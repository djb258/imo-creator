# # CTB Metadata
# # Generated: 2025-10-23T14:32:40.896162
# # CTB Version: 1.3.3
# # Division: Data & Databases
# # Category: tests
# # Compliance: 100%
# # HEIR ID: HEIR-2025-10-DAT-TESTS-01

"""
Pytest configuration for CTB/DATA tests
"""

import pytest
import os
from pathlib import Path


@pytest.fixture(scope="session")
def test_database_url():
    """Get test database URL"""
    # Use separate test database if available
    test_url = os.getenv("TEST_DATABASE_URL")
    if test_url:
        return test_url

    # Fall back to main database URL (be careful!)
    return os.getenv("DATABASE_URL") or os.getenv("NEON_DATABASE_URL")


@pytest.fixture
def migrations_dir():
    """Path to migrations directory"""
    return Path("ctb/data/migrations")


@pytest.fixture
def seeds_dir():
    """Path to seeds directory"""
    return Path("ctb/data/seeds")


@pytest.fixture
def schemas_dir():
    """Path to schemas directory"""
    return Path("ctb/data/schemas")
