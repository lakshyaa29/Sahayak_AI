from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient

from backend.app.schemas.partners import PartnerSearchRequest
from backend.app.core.routing_engine import (
    evaluate_partner_routing,
    haversine_distance_km,
    ROUTING_POLICY_VERSION,
    FRESHNESS_POLICY_VERSION,
)
from backend.app.core.partner_catalogue import (
    PartnerBranchRecord,
    OperationalSnapshotRecord,
)


def test_search_partners_micro_finance_wardha(client: TestClient):
    payload = {
        "scheme_code": "SC_MICRO_FINANCE",
        "state": "Maharashtra",
        "district": "Wardha",
        "radius_km": 50.0,
        "location_type": "DISTRICT_CENTROID",
    }
    response = client.post("/api/v1/partners/search", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["scheme_code"] == "SC_MICRO_FINANCE"
    assert data["routing_policy_version"] == ROUTING_POLICY_VERSION
    assert data["freshness_policy_version"] == FRESHNESS_POLICY_VERSION
    assert data["search_radius_km"] == 50.0
    assert data["total_eligible"] >= 3

    # Check rank ordering by distance
    eligible = data["eligible_partners"]
    assert len(eligible) >= 3
    distances = [p["distance_km"] for p in eligible]
    assert distances == sorted(distances), "Eligible partners must be sorted in ascending distance order"

    # Top recommended check
    assert eligible[0]["is_top_recommended"] is True
    assert eligible[0]["rank"] == 1
    assert any(eligible[1]["is_top_recommended"] is False for _ in [1])


def test_top_recommended_has_rationale(client: TestClient):
    payload = {
        "scheme_code": "SC_MICRO_FINANCE",
        "state": "Maharashtra",
        "district": "Wardha",
        "radius_km": 50.0,
    }
    res = client.post("/api/v1/partners/search", json=payload)
    data = res.json()
    top = data["eligible_partners"][0]
    assert len(top["selection_reasons_en"]) >= 2
    assert len(top["selection_reasons_hi"]) >= 2
    assert "Closest operational partner" in top["selection_reasons_en"][0]
    assert "निकटतम परिचालन भागीदार" in top["selection_reasons_hi"][0]


def test_scheme_not_supported_filter(client: TestClient):
    # Search for an educational scheme; VKGB only supports SC_MICRO_FINANCE and SC_TERM_LOAN
    payload = {
        "scheme_code": "SC_EDUCATION_LOAN",
        "state": "Maharashtra",
        "district": "Wardha",
        "radius_km": 50.0,
    }
    res = client.post("/api/v1/partners/search", json=payload)
    data = res.json()
    eligible_branch_codes = [p["branch_code"] for p in data["eligible_partners"]]
    assert "VKGB-ARV-112" not in eligible_branch_codes

    # Verify exclusion summary includes SCHEME_NOT_SUPPORTED
    excl = {e["reason_code"]: e["count"] for e in data["exclusion_summaries"]}
    assert "SCHEME_NOT_SUPPORTED" in excl
    assert excl["SCHEME_NOT_SUPPORTED"] >= 1


def test_out_of_jurisdiction_filter(client: TestClient):
    # Searching in Ludhiana, Punjab should only return Punjab partners, never Maharashtra ones
    payload = {
        "scheme_code": "SC_MICRO_FINANCE",
        "state": "Punjab",
        "district": "Ludhiana",
        "radius_km": 50.0,
    }
    res = client.post("/api/v1/partners/search", json=payload)
    data = res.json()
    for p in data["eligible_partners"]:
        assert p["state"] == "Punjab"
        assert p["district"] in ("Ludhiana", "Punjab")

    # Verify exclusion counter
    excl = {e["reason_code"]: e["count"] for e in data["exclusion_summaries"]}
    assert "OUTSIDE_SERVICE_AREA" in excl
    assert excl["OUTSIDE_SERVICE_AREA"] >= 3


def test_inactive_authorization_excluded(client: TestClient):
    payload = {
        "scheme_code": "SC_MICRO_FINANCE",
        "state": "Maharashtra",
        "district": "Pune",
        "radius_km": 50.0,
    }
    res = client.post("/api/v1/partners/search", json=payload)
    data = res.json()
    eligible_ids = [p["id"] for p in data["eligible_partners"]]
    assert "br-inactive-pune-01" not in eligible_ids


def test_high_npa_and_overdue_restricted(client: TestClient):
    # Fictional Wardha MFI has 8.4% NPA and pending overdues
    payload = {
        "scheme_code": "SC_MICRO_FINANCE",
        "state": "Maharashtra",
        "district": "Wardha",
        "radius_km": 50.0,
    }
    res = client.post("/api/v1/partners/search", json=payload)
    data = res.json()
    eligible_ids = [p["id"] for p in data["eligible_partners"]]
    assert "br-demo-mfi-wrd-99" not in eligible_ids

    # Should be counted under OPERATIONAL_REQUIREMENT_UNMET
    excl = {e["reason_code"]: e["count"] for e in data["exclusion_summaries"]}
    assert "OPERATIONAL_REQUIREMENT_UNMET" in excl
    assert excl["OPERATIONAL_REQUIREMENT_UNMET"] >= 1


def test_differentiated_npa_policy():
    # PSB with 4.1% gross NPA is ELIGIBLE under PSB rule (<= 6.0%)
    req = PartnerSearchRequest(
        scheme_code="SC_MICRO_FINANCE",
        state="Maharashtra",
        district="Wardha",
        radius_km=50.0,
    )
    res = evaluate_partner_routing(req)
    branch_codes = [p.branch_code for p in res.eligible_partners]
    assert "BOI-SVG-401" in branch_codes


def test_freshness_policy_stale_snapshot():
    # Simulate a search with evaluation time 200 days after snapshot observation
    req = PartnerSearchRequest(
        scheme_code="SC_MICRO_FINANCE",
        state="Maharashtra",
        district="Wardha",
        radius_km=50.0,
    )
    future_time = datetime.now(timezone.utc) + timedelta(days=200)
    res = evaluate_partner_routing(req, evaluation_time=future_time)
    
    # Snapshots observed in Sep 2024 are now > 180 days old!
    # They should NOT be passed as eligible, but moved to unverified
    assert res.total_eligible == 0
    assert len(res.unverified_partners) >= 1
    assert any("freshness policy" in u.unverified_reason for u in res.unverified_partners)


def test_missing_coordinates_handled_gracefully(client: TestClient):
    # Hinganghat office has no coordinates; it must appear in unverified, not eligible with fake distance
    payload = {
        "scheme_code": "SC_MICRO_FINANCE",
        "state": "Maharashtra",
        "district": "Wardha",
        "radius_km": 50.0,
    }
    res = client.post("/api/v1/partners/search", json=payload)
    data = res.json()

    # Not in ranked list
    eligible_ids = [p["id"] for p in data["eligible_partners"]]
    assert "br-sca-wrd-remote" not in eligible_ids

    # Present in unverified partners with clear reason
    unverified_ids = [u["id"] for u in data["unverified_partners"]]
    assert "br-sca-wrd-remote" in unverified_ids
    remote_entry = next(u for u in data["unverified_partners"] if u["id"] == "br-sca-wrd-remote")
    assert "geotagging" in remote_entry["unverified_reason"].lower() or "coordinates" in remote_entry["unverified_reason"].lower()


def test_search_radius_boundary(client: TestClient):
    # Bank of India Sevagram is ~2.6km away from Wardha center
    # With a 2.0 km radius, it should be excluded; with a 10.0 km radius, it should be included
    narrow_req = {
        "scheme_code": "SC_MICRO_FINANCE",
        "state": "Maharashtra",
        "district": "Wardha",
        "radius_km": 2.0,
    }
    res_narrow = client.post("/api/v1/partners/search", json=narrow_req).json()
    narrow_codes = [p["branch_code"] for p in res_narrow["eligible_partners"]]
    assert "BOI-SVG-401" not in narrow_codes

    wide_req = {
        "scheme_code": "SC_MICRO_FINANCE",
        "state": "Maharashtra",
        "district": "Wardha",
        "radius_km": 10.0,
    }
    res_wide = client.post("/api/v1/partners/search", json=wide_req).json()
    wide_codes = [p["branch_code"] for p in res_wide["eligible_partners"]]
    assert "BOI-SVG-401" in wide_codes


def test_no_confidential_leak_in_public_response(client: TestClient):
    payload = {
        "scheme_code": "SC_MICRO_FINANCE",
        "state": "Maharashtra",
        "district": "Wardha",
        "radius_km": 50.0,
    }
    res = client.post("/api/v1/partners/search", json=payload)
    data = res.json()

    # Exclusion summaries should use neutral, citizen-safe language
    for excl in data["exclusion_summaries"]:
        assert "stressed" not in excl["description_en"].lower()
        assert "bankrupt" not in excl["description_en"].lower()
        assert "audit" not in excl["description_en"].lower()


def test_haversine_formula_math():
    # Wardha (20.7453, 78.6022) to Sevagram (20.7291, 78.5835) ~ 2.6 km straight line
    d = haversine_distance_km(20.7453, 78.6022, 20.7291, 78.5835)
    assert 2.0 <= d <= 3.0

    # Wardha to Nagpur (~70-80 km)
    d_nagpur = haversine_distance_km(20.7453, 78.6022, 21.1458, 79.0882)
    assert 65.0 <= d_nagpur <= 85.0


def test_statewide_sca_coverage(client: TestClient):
    # MPBCDC is a statewide SCA in Maharashtra.
    # Searching in Amravati (where MPBCDC Wardha serves multi-districts) finds it
    payload = {
        "scheme_code": "SC_MICRO_FINANCE",
        "state": "Maharashtra",
        "district": "Amravati",
        "radius_km": 120.0,  # Wardha to Amravati ~80-100km
    }
    res = client.post("/api/v1/partners/search", json=payload)
    data = res.json()
    org_types = [p["partner_type"] for p in data["eligible_partners"]]
    assert "SCA" in org_types
