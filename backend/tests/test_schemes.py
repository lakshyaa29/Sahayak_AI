def test_list_schemes(client):
    response = client.get("/api/v1/schemes")
    assert response.status_code == 200
    data = response.json()
    assert data["isDemonstration"] is True
    assert data["total"] >= 3
    assert len(data["schemes"]) >= 3

    # Check Micro Finance scheme details
    micro = next((s for s in data["schemes"] if s["code"] == "SC_MICRO_FINANCE"), None)
    assert micro is not None
    assert micro["maxProjectCost"] == 140000.0
    assert micro["interestRateMin"] == 6.5
    assert micro["isDemonstration"] is True


def test_filter_schemes_by_type(client):
    response = client.get("/api/v1/schemes?scheme_type=EDUCATION")
    assert response.status_code == 200
    data = response.json()
    assert all(s["schemeType"] == "EDUCATION" for s in data["schemes"])


def test_get_scheme_by_code(client):
    response = client.get("/api/v1/schemes/SC_MICRO_FINANCE")
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == "SC_MICRO_FINANCE"
    assert data["maxIncomeLimit"] == 500000.0


def test_get_invalid_scheme_code(client):
    response = client.get("/api/v1/schemes/INVALID_SCHEME_CODE")
    assert response.status_code == 404
