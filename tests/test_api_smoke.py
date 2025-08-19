import os, json
from fastapi.testclient import TestClient
from src.server.main import app

client = TestClient(app)

def test_llm_missing_keys():
    # should not 500 when no keys; expect graceful message or 4xx
    r = client.post("/llm", json={"prompt":"ping"})
    assert r.status_code in (200,400,422,502)
    assert isinstance(r.json(), dict)

def test_ssot_save_minimal():
    r = client.post("/api/ssot/save", json={"ssot":{"meta":{"app_name":"IMO Creator","stage":"overview"}}})
    assert r.status_code == 200
    data = r.json()
    assert "ssot" in data
    # Allow either stamping now or pass-through with keys pending
    assert "meta" in data["ssot"]

def test_subagents_list():
    r = client.get("/api/subagents")
    assert r.status_code in (200,204)
    # body can be {items:[...]} or empty depending on integration
    # only asserting non-500 stability
    assert r.text is not None