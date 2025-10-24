"""
Pytest configuration for CTB/SYS tests
Shared fixtures and test configuration
"""

import pytest
import os
from pathlib import Path

# Set test environment
os.environ["PYTHON_ENV"] = "test"
os.environ["NODE_ENV"] = "test"


@pytest.fixture(scope="session")
def test_env():
    """Test environment fixture"""
    return {
        "env": "test",
        "debug": True,
        "log_level": "debug"
    }


@pytest.fixture(scope="session")
def test_database_url():
    """Test database URL fixture"""
    return os.getenv("TEST_DATABASE_URL", "postgresql://user:pass@localhost:5432/test_db")


@pytest.fixture(scope="session")
def composio_test_config():
    """Composio test configuration"""
    return {
        "api_key": os.getenv("COMPOSIO_API_KEY", "test_key"),
        "user_id": os.getenv("COMPOSIO_USER_ID", "test_user"),
        "mcp_url": "http://localhost:3001"
    }


@pytest.fixture(scope="function")
def mock_database_client():
    """Mock database client for testing"""
    from unittest.mock import AsyncMock

    client = AsyncMock()
    client.execute_query = AsyncMock(return_value=[])
    client.execute_command = AsyncMock(return_value=None)

    return client


@pytest.fixture(scope="function")
def sample_heir_orbt_payload():
    """Sample HEIR/ORBT payload for testing"""
    return {
        "tool": "test_tool",
        "data": {"test": "data"},
        "unique_id": "HEIR-2025-10-SYS-TEST-01",
        "process_id": "PRC-SYS-1729800000",
        "orbt_layer": 2,
        "blueprint_version": "1.0"
    }
