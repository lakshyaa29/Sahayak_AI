def test_list_partners(client):
    response = client.get("/api/v1/partners")
    assert response.status_code == 200
    data = response.json()
    assert data["isDemonstration"] is True
    assert data["total"] >= 4
    assert len(data["partners"]) >= 4

    # Check partner fields and operational risk indicators
    sample_partner = data["partners"][0]
    assert "grossNpaRatio" in sample_partner
    assert "hasPendingOverdues" in sample_partner
    assert "operationalStatus" in sample_partner
    assert "latitude" in sample_partner
    assert "longitude" in sample_partner
    assert sample_partner["isDemonstration"] is True


def test_filter_partners_by_district(client):
    response = client.get("/api/v1/partners?district=Wardha")
    assert response.status_code == 200
    data = response.json()
    assert all("wardha" in p["district"].lower() for p in data["partners"])


def test_filter_partners_by_type(client):
    response = client.get("/api/v1/partners?partner_type=SCA")
    assert response.status_code == 200
    data = response.json()
    assert all(p["partnerType"] == "SCA" for p in data["partners"])
