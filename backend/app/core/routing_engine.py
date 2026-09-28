"""
SAHAYAK AI: Step 7 Channel Partner Routing Engine
Executes deterministic, versioned routing rules (route-v1.0), data freshness policies (freshness-v1.0),
institution-specific risk criteria, spatial PostGIS/geodesic radius searches, and explainable ranking.
"""

import math
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Tuple, Dict, Any

from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.app.schemas.partners import (
    PartnerSearchRequest,
    PartnerSearchResponse,
    RankedPartnerItem,
    UnverifiedPartnerItem,
    CitizenSafeExclusionSummary,
    LocationInterpretation,
)
from backend.app.core.partner_catalogue import (
    PartnerOrgRecord,
    PartnerBranchRecord,
    OperationalSnapshotRecord,
    get_all_organizations,
    get_all_branches,
    get_all_snapshots,
    get_district_centroid,
)
from backend.app.models.partners import PartnerBranch, PartnerOperationalSnapshot

ROUTING_POLICY_VERSION = "route-v1.0"
FRESHNESS_POLICY_VERSION = "freshness-v1.0"
MAX_OBSERVATION_AGE_DAYS = 180  # Platform freshness policy threshold (documented prototype configuration)


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes great-circle geodesic distance in kilometres between two WGS84 coordinates.
    """
    R = 6371.0088  # Mean Earth radius in km (IUGG standard)
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)


def evaluate_partner_routing(
    request: PartnerSearchRequest,
    db: Optional[Session] = None,
    evaluation_time: Optional[datetime] = None,
) -> PartnerSearchResponse:
    """
    Evaluates Channel Partner eligibility and ranks suitable branches serving the beneficiary.
    """
    now = evaluation_time or datetime.now(timezone.utc)
    search_id = f"srch-{uuid.uuid4().hex[:12]}"

    # 1. Resolve Location Interpretation
    resolved_lat = request.latitude
    resolved_lng = request.longitude
    is_approximate = True
    resolved_name = f"{request.district.strip().title()}, {request.state.strip().title()}"
    loc_type = request.location_type

    if resolved_lat is not None and resolved_lng is not None:
        if loc_type == "USER_COORDINATES":
            is_approximate = False
            resolved_name = f"Your GPS Location ({request.district.title()})"
    else:
        # Resolve via district centroid
        centroid = get_district_centroid(request.district)
        if centroid:
            resolved_lat = centroid["lat"]
            resolved_lng = centroid["lng"]
            loc_type = "DISTRICT_CENTROID"
            is_approximate = True
            resolved_name = f"{request.district.title()} District Central Area (Approximate)"

    location_interp = LocationInterpretation(
        state=request.state,
        district=request.district,
        pincode=request.pincode,
        latitude=resolved_lat,
        longitude=resolved_lng,
        is_approximate=is_approximate,
        location_type=loc_type,
        resolved_name=resolved_name,
    )

    # 2. Gather Datasets
    orgs_map: Dict[str, PartnerOrgRecord] = {o.id: o for o in get_all_organizations()}
    branches: List[PartnerBranchRecord] = get_all_branches()
    snapshots_by_branch: Dict[str, OperationalSnapshotRecord] = {
        s.branch_id: s for s in get_all_snapshots()
    }

    # If DB session exists, optionally augment with DB branches if available
    if db is not None:
        try:
            db_branches = db.query(PartnerBranch).filter(PartnerBranch.is_active.is_(True)).all()
            for db_b in db_branches:
                # If not already in in-memory catalog, adapt it
                if not any(b.branch_code == db_b.branch_code for b in branches):
                    schemes_supp = [s.scheme.code for s in db_b.scheme_supports if s.scheme]
                    branches.append(
                        PartnerBranchRecord(
                            id=db_b.id,
                            organization_id=db_b.organization_id,
                            branch_code=db_b.branch_code,
                            name=db_b.name,
                            public_address=f"{db_b.district}, {db_b.state}",
                            district=db_b.district,
                            state=db_b.state,
                            pincode=db_b.pincode,
                            latitude=db_b.latitude,
                            longitude=db_b.longitude,
                            supported_schemes=schemes_supp,
                            jurisdiction_type="DISTRICT",
                            served_districts=[db_b.district],
                            is_active=db_b.is_active,
                            is_demonstration=db_b.is_demonstration,
                            is_fictional=False,
                        )
                    )
        except Exception:
            pass

    # 3. Process Branches through Multi-Step Filtering
    eligible_candidates: List[Tuple[PartnerBranchRecord, PartnerOrgRecord, OperationalSnapshotRecord, float]] = []
    unverified_candidates: List[UnverifiedPartnerItem] = []
    exclusion_counters: Dict[str, int] = {
        "OUTSIDE_SERVICE_AREA": 0,
        "SCHEME_NOT_SUPPORTED": 0,
        "INACTIVE_OFFICE": 0,
        "OPERATIONAL_REQUIREMENT_UNMET": 0,
        "OUTSIDE_SEARCH_RADIUS": 0,
    }

    target_scheme = request.scheme_code.strip()
    target_state = request.state.strip().lower()
    target_district = request.district.strip().lower()

    for branch in branches:
        org = orgs_map.get(branch.organization_id)
        if not org:
            continue

        # Data mode filter
        if request.data_mode == "VERIFIED_ONLY" and (branch.is_demonstration or org.is_demonstration):
            continue
        if request.data_mode == "DEMONSTRATION" and not (branch.is_demonstration or org.is_demonstration):
            continue

        # Filter by partner type if requested
        if request.partner_type and request.partner_type.upper() != "ALL":
            if org.partner_type.upper() != request.partner_type.upper():
                continue

        # Step 3A: Active Authorization Check
        if not org.is_active or not branch.is_active:
            exclusion_counters["INACTIVE_OFFICE"] += 1
            continue

        # Step 3B: Scheme Support Check
        if target_scheme not in branch.supported_schemes:
            exclusion_counters["SCHEME_NOT_SUPPORTED"] += 1
            continue

        # Step 3C: Jurisdiction Check
        # Check State match
        if branch.state.strip().lower() != target_state:
            exclusion_counters["OUTSIDE_SERVICE_AREA"] += 1
            continue

        # Check District match
        branch_dist = branch.district.strip().lower()
        served_dists = [d.strip().lower() for d in branch.served_districts]

        is_in_jurisdiction = False
        if branch.jurisdiction_type == "STATEWIDE":
            # State Channelizing Agencies (SCAs) serve the entire state
            is_in_jurisdiction = True
        elif branch_dist == target_district or target_district in served_dists:
            is_in_jurisdiction = True

        if not is_in_jurisdiction:
            exclusion_counters["OUTSIDE_SERVICE_AREA"] += 1
            continue

        # Step 3D: Freshness Check for Operational Snapshot
        snapshot = snapshots_by_branch.get(branch.id)
        if not snapshot:
            # Missing essential operational data -> ELIGIBILITY_UNVERIFIED
            unverified_candidates.append(
                UnverifiedPartnerItem(
                    id=branch.id,
                    name=branch.name,
                    organization_name=org.name,
                    partner_type=org.partner_type,
                    district=branch.district,
                    state=branch.state,
                    public_address=branch.public_address,
                    contact_phone=branch.contact_phone,
                    contact_person=branch.contact_person,
                    unverified_reason="Current operational health and quota records could not be verified in the directory.",
                    unverified_reason_hi="निर्देशिका में वर्तमान परिचालन स्वास्थ्य और कोटा रिकॉर्ड सत्यापित नहीं किए जा सके।",
                )
            )
            continue

        # Verify observation age
        obs_age_days = (now - snapshot.observed_at).days
        if obs_age_days > MAX_OBSERVATION_AGE_DAYS:
            # Stale operational observation -> ELIGIBILITY_UNVERIFIED
            unverified_candidates.append(
                UnverifiedPartnerItem(
                    id=branch.id,
                    name=branch.name,
                    organization_name=org.name,
                    partner_type=org.partner_type,
                    district=branch.district,
                    state=branch.state,
                    public_address=branch.public_address,
                    contact_phone=branch.contact_phone,
                    contact_person=branch.contact_person,
                    unverified_reason=f"Operational metrics were observed {obs_age_days} days ago (exceeds {MAX_OBSERVATION_AGE_DAYS}-day freshness policy).",
                    unverified_reason_hi=f"परिचालन मेट्रिक्स {obs_age_days} दिन पहले देखे गए थे (ताज़ा नीति सीमा {MAX_OBSERVATION_AGE_DAYS} दिन से अधिक)।",
                )
            )
            continue

        # Step 3E: Differentiated Operational Policy Evaluation
        # Check Overdues to refinancing/nodal institution
        if snapshot.has_pending_overdues:
            exclusion_counters["OPERATIONAL_REQUIREMENT_UNMET"] += 1
            continue

        # Check Operational Status
        if snapshot.operational_status == "QUOTA_EXHAUSTED":
            exclusion_counters["OPERATIONAL_REQUIREMENT_UNMET"] += 1
            continue

        # Institution-specific NPA policies
        is_operational_pass = True
        ptype = org.partner_type.upper()

        if ptype == "PSB":
            # Commercial banks under RBI Priority Sector norms: Gross NPA <= 6.0% or Net NPA <= 3.0%
            if snapshot.gross_npa_ratio is not None and snapshot.gross_npa_ratio > 6.0:
                is_operational_pass = False
            elif snapshot.net_npa_ratio is not None and snapshot.net_npa_ratio > 3.0:
                is_operational_pass = False
        elif ptype in ("RRB", "NBFC_MFI"):
            # Rural & MFI partners: Gross NPA threshold 5.0%
            if snapshot.gross_npa_ratio is not None and snapshot.gross_npa_ratio > 5.0:
                is_operational_pass = False
        elif ptype == "SCA":
            # State Channelizing Agencies backed by state guarantee; disqualified if flagged in snapshot
            if snapshot.operational_status == "HIGH_NPA_RESTRICTED":
                is_operational_pass = False

        if not is_operational_pass:
            exclusion_counters["OPERATIONAL_REQUIREMENT_UNMET"] += 1
            continue

        # Step 3F: Spatial Proximity & Coordinates
        if branch.latitude is None or branch.longitude is None:
            # Branch serves jurisdiction, but coordinates are missing
            # Handle gracefully: do NOT invent distance or false geographic rank
            unverified_candidates.append(
                UnverifiedPartnerItem(
                    id=branch.id,
                    name=branch.name,
                    organization_name=org.name,
                    partner_type=org.partner_type,
                    district=branch.district,
                    state=branch.state,
                    public_address=branch.public_address,
                    contact_phone=branch.contact_phone,
                    contact_person=branch.contact_person,
                    unverified_reason="Geographic coordinates pending official geotagging; office distance unavailable.",
                    unverified_reason_hi="भौगोलिक निर्देशांक आधिकारिक जियोटैगिंग के लिए लंबित हैं; कार्यालय की दूरी उपलब्ध नहीं है।",
                )
            )
            continue

        if resolved_lat is None or resolved_lng is None:
            # No user coordinates or district centroid available
            dist_km = 0.0
        else:
            dist_km = haversine_distance_km(
                resolved_lat, resolved_lng, branch.latitude, branch.longitude
            )

        # Step 3G: Radius Boundary Check
        if dist_km > request.radius_km:
            exclusion_counters["OUTSIDE_SEARCH_RADIUS"] += 1
            continue

        # Candidate is ELIGIBLE_FOR_ROUTING!
        eligible_candidates.append((branch, org, snapshot, dist_km))

    # 4. Deterministic Ranking
    # Rule 1: Shortest distance
    # Rule 2: Stable tie-breaker on organization name, branch code, and ID
    eligible_candidates.sort(
        key=lambda item: (item[3], item[1].name, item[0].branch_code, item[0].id)
    )

    # 5. Build RankedPartnerItem List
    ranked_partners: List[RankedPartnerItem] = []
    for idx, (b, o, snap, d_km) in enumerate(eligible_candidates, start=1):
        is_top = (idx == 1)

        # Build transparent selection reasons
        reasons_en = [
            f"Authorized {o.partner_type} supporting {target_scheme} for your area.",
            snap.suitability_reason_en,
        ]
        reasons_hi = [
            f"आपके क्षेत्र के लिए {target_scheme} का समर्थन करने वाला अधिकृत {o.partner_type}।",
            snap.suitability_reason_hi,
        ]
        if is_top:
            reasons_en.insert(
                0,
                f"Closest operational partner meeting all routing checks ({d_km} km away).",
            )
            reasons_hi.insert(
                0,
                f"सभी रूटिंग जांचों को पूरा करने वाला निकटतम परिचालन भागीदार ({d_km} किमी दूर)।",
            )
        else:
            reasons_en.append(f"Qualified alternative branch ({d_km} km).")
            reasons_hi.append(f"योग्य वैकल्पिक शाखा ({d_km} किमी)।")

        # Citizen actions
        can_call = bool(b.contact_phone and not b.is_fictional)
        can_direct = bool(b.latitude and b.longitude and not b.is_fictional)
        ext_map_url = None
        if can_direct and b.latitude and b.longitude:
            ext_map_url = (
                f"https://www.openstreetmap.org/?mlat={b.latitude}&mlon={b.longitude}#map=16/{b.latitude}/{b.longitude}"
            )

        ranked_partners.append(
            RankedPartnerItem(
                rank=idx,
                is_top_recommended=is_top,
                id=b.id,
                organization_id=o.id,
                organization_name=o.name,
                branch_code=b.branch_code,
                name=b.name,
                partner_type=o.partner_type,
                public_address=b.public_address,
                district=b.district,
                state=b.state,
                pincode=b.pincode,
                latitude=b.latitude,
                longitude=b.longitude,
                distance_km=d_km,
                distance_method="GEODESIC_WGS84",
                is_approximate_distance=location_interp.is_approximate,
                supported_schemes=b.supported_schemes,
                routing_status="ELIGIBLE_FOR_ROUTING",
                selection_reasons_en=reasons_en,
                selection_reasons_hi=reasons_hi,
                contact_person=b.contact_person,
                contact_phone=b.contact_phone if not b.is_fictional else None,
                contact_email=b.contact_email if not b.is_fictional else None,
                website_url=o.verified_website if not b.is_fictional else None,
                is_demonstration=b.is_demonstration or o.is_demonstration,
                is_fictional=b.is_fictional,
                sample_institution_label=(
                    "Sample institution (Demonstration Only)" if b.is_fictional else None
                ),
                can_call=can_call,
                can_direct=can_direct,
                external_map_url=ext_map_url,
                data_as_of=snap.observed_at.strftime("%d-%b-%Y"),
                observed_at=snap.observed_at.isoformat(),
                retrieved_at=snap.retrieved_at.isoformat(),
                source_reference=snap.source_reference,
                freshness_status="FRESH",
            )
        )

    # 6. Build Citizen-Safe Exclusion Summaries
    exclusion_summaries: List[CitizenSafeExclusionSummary] = []
    if exclusion_counters["OUTSIDE_SEARCH_RADIUS"] > 0:
        exclusion_summaries.append(
            CitizenSafeExclusionSummary(
                reason_code="OUTSIDE_SEARCH_RADIUS",
                count=exclusion_counters["OUTSIDE_SEARCH_RADIUS"],
                description_en="Operating branches located outside your active search radius.",
                description_hi="सक्रिय खोज दायरे से बाहर स्थित परिचालन शाखाएं।",
            )
        )
    if exclusion_counters["SCHEME_NOT_SUPPORTED"] > 0:
        exclusion_summaries.append(
            CitizenSafeExclusionSummary(
                reason_code="SCHEME_NOT_SUPPORTED",
                count=exclusion_counters["SCHEME_NOT_SUPPORTED"],
                description_en="Partner offices that do not disburse your selected credit scheme.",
                description_hi="पार्टनर कार्यालय जो आपकी चयनित ऋण योजना का वितरण नहीं करते हैं।",
            )
        )
    if exclusion_counters["OPERATIONAL_REQUIREMENT_UNMET"] > 0:
        exclusion_summaries.append(
            CitizenSafeExclusionSummary(
                reason_code="OPERATIONAL_REQUIREMENT_UNMET",
                count=exclusion_counters["OPERATIONAL_REQUIREMENT_UNMET"],
                description_en="Branches temporarily restricted under institutional priority lending guidelines.",
                description_hi="संस्थागत प्राथमिकता ऋण दिशानिर्देशों के तहत अस्थायी रूप से प्रतिबंधित शाखाएं।",
            )
        )
    if exclusion_counters["OUTSIDE_SERVICE_AREA"] > 0:
        exclusion_summaries.append(
            CitizenSafeExclusionSummary(
                reason_code="OUTSIDE_SERVICE_AREA",
                count=exclusion_counters["OUTSIDE_SERVICE_AREA"],
                description_en="Branches outside your residential administrative jurisdiction.",
                description_hi="आपके आवासीय प्रशासनिक क्षेत्राधिकार से बाहर की शाखाएं।",
            )
        )

    total_excluded = sum(exclusion_counters.values())

    return PartnerSearchResponse(
        search_id=search_id,
        evaluated_at=now.isoformat(),
        scheme_code=target_scheme,
        rule_version_id=request.rule_version_id or "NSFDC-MF-2024.1",
        routing_policy_version=ROUTING_POLICY_VERSION,
        freshness_policy_version=FRESHNESS_POLICY_VERSION,
        data_mode=request.data_mode,
        location_interpretation=location_interp,
        search_radius_km=request.radius_km,
        total_eligible=len(ranked_partners),
        eligible_partners=ranked_partners,
        unverified_partners=unverified_candidates,
        excluded_count=total_excluded,
        exclusion_summaries=exclusion_summaries,
        disclaimer_en="Preliminary Channel Partner routing is advisory. Final loan sanction, appraisal, and quota disbursement remain with the accredited Channel Partner and ministry guidelines.",
        disclaimer_hi="प्रारंभिक चैनल पार्टनर रूटिंग केवल सलाहकारी है। अंतिम ऋण स्वीकृति, मूल्यांकन और कोटा संवितरण मान्यता प्राप्त चैनल पार्टनर और मंत्रालय के दिशानिर्देशों के अधीन है।",
    )
