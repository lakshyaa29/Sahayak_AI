def test_health_endpoint(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "SAHAYAK AI" in data["app"]
    assert "timestamp" in data


def test_ready_endpoint(client):
    response = client.get("/api/v1/ready")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database" in data
    assert "connected" in data["database"]
    assert "postgisAvailable" in data["database"]
    assert "message" in data["database"]


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "docs" in data
    assert data["docs"] == "/docs"
