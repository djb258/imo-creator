import pytest
from fastapi.testclient import TestClient
from services.mcp.modules.intake.ingest import router
from fastapi import FastAPI

app = FastAPI()
app.include_router(router)
client = TestClient(app)

def test_extract_endpoint():
    """Test extract endpoint with minimal data"""
    response = client.post("/tools/intake/ingest/extract", json={
        "file_id": "test123",
        "format": "json"
    })
    assert response.status_code == 200
    assert response.json()["file_id"] == "test123"

def test_parse_endpoint():
    """Test parse endpoint"""
    response = client.post("/tools/intake/ingest/parse", json={
        "file_id": "test123",
        "parser": "auto"
    })
    assert response.status_code == 200
    assert response.json()["parser_used"] == "auto"

def test_snapshot_endpoint():
    """Test snapshot creation"""
    response = client.post("/tools/intake/ingest/snapshot", json={
        "file_id": "test123",
        "name": "test_snapshot"
    })
    assert response.status_code == 200
    assert "snap_" in response.json()["snapshot_id"]