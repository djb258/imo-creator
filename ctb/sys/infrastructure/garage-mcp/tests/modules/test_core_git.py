import pytest
from fastapi.testclient import TestClient
from services.mcp.modules.core.git import router
from fastapi import FastAPI

app = FastAPI()
app.include_router(router)
client = TestClient(app)

def test_git_diff_endpoint_exists():
    """Test that git diff endpoint exists"""
    # This is a minimal test - actual git operations would require a git repo
    response = client.post("/tools/git/diff", json={"cwd": "."})
    # We expect either success or a git-related error, not a 404
    assert response.status_code != 404

def test_git_commit_requires_message():
    """Test that commit requires a message"""
    response = client.post("/tools/git/commit", json={"cwd": "."})
    assert response.status_code == 422  # Validation error for missing message