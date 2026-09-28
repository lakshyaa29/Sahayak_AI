from typing import Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.app.schemas.partners import (
    PartnerBranchResponse,
    PartnerListResponse,
    PartnerSearchRequest,
    PartnerSearchResponse,
)
from backend.app.db.session import get_db
from backend.app.core.routing_engine import evaluate_partner_routing
from backend.app.core.partner_catalogue import (
    get_all_branches,
    get_all_organizations,
    get_all_snapshots,
)

router = APIRouter(prefix="/partners", tags=["Channel Partners"])


@router.post(
    "/search",
    response_model=PartnerSearchResponse,
    status_code=status.HTTP_200_OK,
    summary="Search and Rank Channel Partners (Step 7 Engine)",
    description="Deterministically filters, verifies operational freshness, and ranks accredited Channel Partner branches by spatial distance.",
)
def search_partners(
    payload: PartnerSearchRequest,
    db: Session = Depends(get_db),
) -> PartnerSearchResponse:
    """
    Evaluates Channel Partner eligibility against selected scheme, beneficiary jurisdiction,
    operational criteria, and spatial proximity under route-v1.0.
    """
    return evaluate_partner_routing(payload, db=db)


@router.get(
    "",
    response_model=PartnerListResponse,
    summary="List Channel Partners (Directory View)",
    description="Returns public Channel Partner branches filtered by district or partner type.",
)
def list_partners(
    district: Optional[str] = None,
    partner_type: Optional[str] = None,
    db: Session = Depends(get_db),
) -> PartnerListResponse:
    """
    Returns channel partner directory records with operational indicators.
    Maintains backward compatibility with legacy directory listing.
    """
    orgs_map = {o.id: o for o in get_all_organizations()}
    branches = get_all_branches()
    snapshots_map = {s.branch_id: s for s in get_all_snapshots()}

    results = []
    for b in branches:
        org = orgs_map.get(b.organization_id)
        if not org or not org.is_active or not b.is_active:
            continue

        if district and district.lower() not in b.district.lower():
            continue
        if partner_type and partner_type.upper() != org.partner_type.upper():
            continue

        snap = snapshots_map.get(b.id)
        gross_npa = snap.gross_npa_ratio if snap and snap.gross_npa_ratio is not None else 3.5
        overdues = snap.has_pending_overdues if snap else False
        status_val = snap.operational_status if snap else "ACTIVE_ELIGIBLE"
        reason = snap.suitability_reason_en if snap else "Accredited partner in jurisdiction"
        date_str = snap.observed_at.strftime("%d-%b-%Y") if snap else "Current Snapshot"

        results.append(
            PartnerBranchResponse(
                id=b.id,
                name=b.name,
                branchCode=b.branch_code,
                organizationName=org.name,
                partnerType=org.partner_type,
                supportedSchemes=b.supported_schemes,
                district=b.district,
                state=b.state,
                latitude=b.latitude or 20.7453,
                longitude=b.longitude or 78.6022,
                distanceKm=4.5,
                operationalStatus=status_val,
                grossNpaRatio=gross_npa,
                hasPendingOverdues=overdues,
                quotaUtilizedPercent=68.0,
                contactPerson=b.contact_person,
                contactPhone=b.contact_phone,
                isDemonstration=True,
                lastUpdated=date_str,
                suitabilityReason=reason,
            )
        )

    return PartnerListResponse(
        total=len(results),
        isDemonstration=True,
        district=district or "All Districts",
        partners=results,
    )
