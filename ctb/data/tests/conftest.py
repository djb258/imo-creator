"""
Pytest configuration for CTB/DATA tests
Shared fixtures and test configuration
"""

import pytest
import os
from pathlib import Path

# Set test environment
os.environ["PYTHON_ENV"] = "test"
os.environ["NODE_ENV"] = "test"


@pytest.fixture(scope="session")
def test_database_url():
    """Test database URL fixture"""
    return os.getenv("TEST_DATABASE_URL", "postgresql://user:pass@localhost:5432/test_db")


@pytest.fixture(scope="session")
def test_firebase_config():
    """Test Firebase configuration"""
    return {
        "project_id": os.getenv("FIREBASE_PROJECT_ID", "test-project"),
        "client_email": "test@test.iam.gserviceaccount.com",
        "private_key": "test_key"
    }


@pytest.fixture(scope="function")
def sample_user_data():
    """Sample user data for testing"""
    return {
        "id": 1,
        "email": "test@example.com",
        "name": "Test User",
        "created_at": "2025-10-23T12:00:00Z"
    }


@pytest.fixture(scope="function")
def sample_migration():
    """Sample migration SQL"""
    return """
    CREATE TABLE test_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """


@pytest.fixture(scope="function")
def sample_schema_definition():
    """Sample schema definition for testing"""
    return {
        "table_name": "users",
        "columns": [
            {"name": "id", "type": "SERIAL", "primary_key": True},
            {"name": "email", "type": "VARCHAR(255)", "unique": True, "not_null": True},
            {"name": "name", "type": "VARCHAR(255)"},
            {"name": "created_at", "type": "TIMESTAMP", "default": "CURRENT_TIMESTAMP"}
        ],
        "indexes": [
            {"name": "idx_users_email", "columns": ["email"]}
        ]
    }


@pytest.fixture(scope="function")
def zod_user_schema():
    """Zod schema example for testing"""
    return """
    import { z } from 'zod';

    export const UserSchema = z.object({
        id: z.number().int().positive(),
        email: z.string().email(),
        name: z.string().min(1).max(255),
        createdAt: z.date(),
    });
    """
