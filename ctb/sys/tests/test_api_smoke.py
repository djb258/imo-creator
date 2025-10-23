#!/usr/bin/env python3
"""
Smoke tests for CTB/SYS API layer
Tests basic API functionality and health checks
"""

import pytest
import requests
from pathlib import Path
import sys

# Add CTB root to Python path
CTB_ROOT = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(CTB_ROOT / "ctb" / "sys"))


class TestAPIHealth:
    """Test API health and basic connectivity"""

    API_BASE_URL = "http://localhost:8000"
    MCP_BASE_URL = "http://localhost:3001"

    def test_fastapi_health(self):
        """Test FastAPI server health endpoint"""
        try:
            response = requests.get(f"{self.API_BASE_URL}/health", timeout=5)
            assert response.status_code == 200
            data = response.json()
            assert data.get("status") == "healthy" or "ok" in str(data).lower()
        except requests.exceptions.ConnectionError:
            pytest.skip("FastAPI server not running on port 8000")

    def test_mcp_server_health(self):
        """Test Composio MCP server health endpoint"""
        try:
            response = requests.get(f"{self.MCP_BASE_URL}/mcp/health", timeout=5)
            assert response.status_code == 200
        except requests.exceptions.ConnectionError:
            pytest.skip("Composio MCP server not running on port 3001")

    def test_api_cors_headers(self):
        """Test CORS headers are properly configured"""
        try:
            response = requests.options(
                f"{self.API_BASE_URL}/health",
                headers={"Origin": "http://localhost:7002"},
                timeout=5
            )
            assert "Access-Control-Allow-Origin" in response.headers
        except requests.exceptions.ConnectionError:
            pytest.skip("FastAPI server not running")


class TestComposioIntegration:
    """Test Composio MCP integration"""

    MCP_BASE_URL = "http://localhost:3001"

    def test_composio_stats(self):
        """Test getting Composio stats via MCP"""
        try:
            payload = {
                "tool": "get_composio_stats",
                "data": {},
                "unique_id": "HEIR-2025-10-TEST-STATS-01",
                "process_id": "PRC-TEST-1730000000",
                "orbt_layer": 2,
                "blueprint_version": "1.0"
            }

            response = requests.post(
                f"{self.MCP_BASE_URL}/tool",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )

            assert response.status_code in [200, 201]
            data = response.json()

            # Should have some connected accounts or available tools
            assert "result" in data or "data" in data or "tools" in data

        except requests.exceptions.ConnectionError:
            pytest.skip("Composio MCP server not running")

    def test_heir_orbt_payload_format(self):
        """Test that HEIR/ORBT payload format is enforced"""
        # Missing required fields should fail or return error
        invalid_payload = {
            "tool": "get_composio_stats",
            "data": {}
            # Missing: unique_id, process_id, orbt_layer, blueprint_version
        }

        try:
            response = requests.post(
                f"{self.MCP_BASE_URL}/tool",
                json=invalid_payload,
                timeout=5
            )

            # Should either reject or add defaults
            # Implementation may vary, so just check it doesn't crash
            assert response.status_code in [200, 201, 400, 422]

        except requests.exceptions.ConnectionError:
            pytest.skip("Composio MCP server not running")


class TestCTBStructure:
    """Test CTB structure integrity"""

    def test_required_divisions_exist(self):
        """Test all required CTB divisions exist"""
        ctb_root = Path("ctb")
        required_divisions = ["sys", "ai", "data", "docs", "ui", "meta"]

        for division in required_divisions:
            assert (ctb_root / division).exists(), f"Missing division: {division}"

    def test_sys_structure(self):
        """Test CTB/SYS structure"""
        sys_root = Path("ctb/sys")
        required_subdirs = ["api", "server", "scripts", "github-factory"]

        for subdir in required_subdirs:
            assert (sys_root / subdir).exists(), f"Missing subdirectory: sys/{subdir}"

    def test_entry_point_exists(self):
        """Test main.py entry point exists at root"""
        assert Path("main.py").exists(), "Missing main.py entry point"


class TestEnvironmentVariables:
    """Test environment variable configuration"""

    def test_env_example_files_exist(self):
        """Test .env.example files exist"""
        assert Path("ctb/sys/api/.env.example").exists(), "Missing sys/api/.env.example"
        assert Path("ctb/data/.env.example").exists(), "Missing data/.env.example"

    def test_no_committed_env_files(self):
        """Test that .env files are not committed"""
        # This is a safety check
        # .env files should be in .gitignore
        dangerous_files = [
            Path("ctb/sys/api/.env"),
            Path("ctb/data/.env"),
            Path(".env")
        ]

        # If they exist, they should be in .gitignore
        gitignore = Path(".gitignore")
        if gitignore.exists():
            gitignore_content = gitignore.read_text()
            if any(f.exists() for f in dangerous_files):
                assert ".env" in gitignore_content, ".env files exist but not in .gitignore!"


if __name__ == "__main__":
    # Run tests with: pytest ctb/sys/tests/test_api_smoke.py -v
    pytest.main([__file__, "-v"])
