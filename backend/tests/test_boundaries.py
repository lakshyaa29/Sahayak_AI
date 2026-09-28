def test_assessment_evaluate_returns_200_and_evaluation_result(client):
    payload = {
        "purpose": "business",
        "activityType": "retail_shop",
        "projectCost": 120000.0,
        "annualFamilyIncome": 250000.0,
        "isScheduledCasteDeclared": True,
        "state": "Maharashtra",
        "district": "Wardha",
    }
    response = client.post("/api/v1/assessments/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["engine_version"] == "eval-v1.0"
    assert data["ranking_policy_version"] == "rank-v1.0"
    assert data["primary_scheme"] is not None
    assert data["primary_scheme"]["code"] == "SC_MICRO_FINANCE"
    assert data["primary_scheme"]["status"] == "POTENTIALLY_ELIGIBLE"
    assert len(data["primary_scheme"]["passed_conditions"]) >= 4


def test_calculation_simulate_returns_200_and_repayment_schedule(client):
    payload = {
        "schemeCode": "SC_MICRO_FINANCE",
        "projectCost": 120000.0,
    }
    response = client.post("/api/v1/calculations/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["calculation_engine_version"] == "calc-v1.0"
    assert data["scheme_code"] == "SC_MICRO_FINANCE"
    assert float(data["financial_breakdown"]["max_permissible_loan"]) == 108000.0
    assert float(data["financial_breakdown"]["mandatory_promoter_contribution"]) == 12000.0
    assert len(data["amortization_schedule"]) > 0
