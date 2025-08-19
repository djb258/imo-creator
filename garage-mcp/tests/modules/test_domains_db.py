import pytest
from fastapi.testclient import TestClient
from services.mcp.modules.domains.db import router
from fastapi import FastAPI

app = FastAPI()
app.include_router(router)
client = TestClient(app)

def test_migrate_endpoint():
    """Test database migration endpoint"""
    response = client.post("/tools/domains/db/migrate", json={
        "target_version": "1.1.0",
        "dry_run": True
    })
    assert response.status_code == 200
    assert response.json()["success"] == True

def test_backup_endpoint():
    """Test database backup endpoint"""
    response = client.post("/tools/domains/db/backup", json={
        "compress": True
    })
    assert response.status_code == 200
    assert "backup_" in response.json()["backup_id"]

def test_restore_requires_backup_id():
    """Test that restore requires backup_id"""
    response = client.post("/tools/domains/db/restore", json={})
    assert response.status_code == 422  # Validation error