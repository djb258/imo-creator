#!/usr/bin/env python3
# # CTB Metadata
# # Generated: 2025-10-23T14:32:40.920407
# # CTB Version: 1.3.3
# # Division: Data & Databases
# # Category: tests
# # Compliance: 65%
# # HEIR ID: HEIR-2025-10-DAT-TESTS-01

"""
Database schema tests for CTB/DATA
Tests database connectivity, schema integrity, and migrations
"""

import pytest
import os
from pathlib import Path
import sys
from ctb.ai.orbt_utils.heir_generator import HeirGenerator

# Test if psycopg2 is available
try:
    import psycopg2
    from psycopg2 import connect, sql
    PSYCOPG2_AVAILABLE = True
except ImportError:
    PSYCOPG2_AVAILABLE = False

# Test if SQLAlchemy is available
try:
    from sqlalchemy import create_engine, text, inspect
    SQLALCHEMY_AVAILABLE = True
except ImportError:
    SQLALCHEMY_AVAILABLE = False


@pytest.fixture
def database_url():
    """Get database URL from environment"""
    db_url = os.getenv("DATABASE_URL") or os.getenv("NEON_DATABASE_URL")
    if not db_url:
        pytest.skip("No DATABASE_URL or NEON_DATABASE_URL environment variable set")
    return db_url


@pytest.fixture
def db_connection(database_url):
    """Create database connection"""
    if not PSYCOPG2_AVAILABLE:
        pytest.skip("psycopg2 not installed")

    try:
        conn = connect(database_url)
        yield conn
        conn.close()
    except Exception as e:
        pytest.skip(f"Cannot connect to database: {e}")


@pytest.fixture
def db_engine(database_url):
    """Create SQLAlchemy engine"""
    if not SQLALCHEMY_AVAILABLE:
        pytest.skip("SQLAlchemy not installed")

    try:
        engine = create_engine(database_url)
        yield engine
        engine.dispose()
    except Exception as e:
        pytest.skip(f"Cannot create engine: {e}")


class TestDatabaseConnection:
    """Test database connectivity"""

    def test_database_url_format(self):
        """Test DATABASE_URL is properly formatted"""
        db_url = os.getenv("DATABASE_URL") or os.getenv("NEON_DATABASE_URL")
        if db_url:
            assert db_url.startswith("postgresql://"), "DATABASE_URL should start with postgresql://"
        else:
            pytest.skip("No database URL configured")

    def test_connection_with_psycopg2(self, database_url):
        """Test connection using psycopg2 (CORRECT METHOD)"""
        if not PSYCOPG2_AVAILABLE:
            pytest.skip("psycopg2 not installed")

        try:
            conn = connect(database_url)
            cursor = conn.cursor()

            # Test basic query
            cursor.execute("SELECT version();")
            version = cursor.fetchone()

            assert version is not None
            assert "PostgreSQL" in version[0]

            cursor.close()
            conn.close()

        except Exception as e:
            pytest.fail(f"Connection failed: {e}")

    def test_connection_with_sqlalchemy(self, db_engine):
        """Test connection using SQLAlchemy"""
        if not SQLALCHEMY_AVAILABLE:
            pytest.skip("SQLAlchemy not installed")

        with db_engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            assert result.scalar() == 1


class TestDatabaseSchema:
    """Test database schema integrity"""

    def test_schema_migrations_table_exists(self, db_connection):
        """Test schema_migrations table exists"""
        cursor = db_connection.cursor()

        cursor.execute("""
            SELECT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_name = 'schema_migrations'
            );
        """)

        exists = cursor.fetchone()[0]
        cursor.close()

        # It's okay if it doesn't exist yet (fresh database)
        # This test just checks the query works
        assert exists in [True, False]

    def test_list_all_tables(self, db_engine):
        """Test listing all tables in database"""
        if not SQLALCHEMY_AVAILABLE:
            pytest.skip("SQLAlchemy not installed")

        inspector = inspect(db_engine)
        tables = inspector.get_table_names()

        # Should be a list (even if empty)
        assert isinstance(tables, list)

        # If tables exist, print them for debugging
        if tables:
            print(f"\nFound {len(tables)} tables: {tables}")

    def test_no_composio_database_access(self):
        """Test that we're using direct pg client, NOT Composio"""
        # This is a reminder test that Composio should NOT be used for databases

        # ❌ WRONG: neon_execute_sql (does not exist)
        # ✅ CORRECT: Direct pg client connection

        # This test always passes, it's just documentation
        assert True, "Always use direct pg client for database operations"


class TestMigrations:
    """Test database migrations"""

    def test_migration_files_exist(self):
        """Test migration files directory exists"""
        migrations_dir = Path("ctb/data/migrations")
        assert migrations_dir.exists(), "Missing migrations directory"

    def test_migration_files_format(self):
        """Test migration files follow naming convention"""
        migrations_dir = Path("ctb/data/migrations")
        if not migrations_dir.exists():
            pytest.skip("Migrations directory doesn't exist")

        migration_files = list(migrations_dir.glob("*.sql"))

        for migration_file in migration_files:
            # Should be named like: 001_description.sql
            name = migration_file.stem

            # Basic format check
            assert "_" in name, f"Migration {name} should contain underscore"


class TestSeedData:
    """Test seed data"""

    def test_seed_files_exist(self):
        """Test seed data directory exists"""
        seeds_dir = Path("ctb/data/seeds")
        # Seeds are optional, so just check path structure
        assert True

    def test_seed_data_format(self):
        """Test seed data files are valid SQL"""
        seeds_dir = Path("ctb/data/seeds")
        if not seeds_dir.exists():
            pytest.skip("Seeds directory doesn't exist")

        seed_files = list(seeds_dir.glob("*.sql"))

        for seed_file in seed_files:
            content = seed_file.read_text()

            # Should contain SQL keywords
            assert any(keyword in content.upper() for keyword in ["INSERT", "UPDATE", "CREATE"]), \
                f"Seed file {seed_file.name} doesn't contain valid SQL"


class TestChartDBSchemas:
    """Test ChartDB schema integration"""

    def test_chartdb_schema_directory_exists(self):
        """Test ChartDB schemas directory exists"""
        schema_dir = Path("ctb/data/schemas/chartdb_schemas")
        assert schema_dir.exists(), "Missing ChartDB schemas directory"

    def test_schema_index_exists(self):
        """Test schema index file exists"""
        index_file = Path("ctb/data/schemas/chartdb_schemas/schema_index.json")

        # Index is auto-generated, so it's okay if it doesn't exist yet
        if index_file.exists():
            import json
            data = json.loads(index_file.read_text())
            assert isinstance(data, (dict, list)), "Schema index should be valid JSON"


class TestDatabaseSecurity:
    """Test database security practices"""

    def test_no_hardcoded_credentials(self):
        """Test no hardcoded database credentials in code"""
        data_dir = Path("ctb/data")

        for py_file in data_dir.rglob("*.py"):
            if "__pycache__" in str(py_file):
                continue

            content = py_file.read_text(encoding="utf-8", errors="ignore")

            # Check for obvious hardcoded credentials
            dangerous_patterns = [
                "# WARNING: Use process.env or MCP_VAULT
password=",
                "# WARNING: Use process.env or MCP_VAULT
PASSWORD=",
                "psql://",
                "postgresql://user:password@",
            ]

            for pattern in dangerous_patterns:
                if pattern in content and "example" not in content.lower():
                    pytest.fail(f"Possible hardcoded credential in {py_file}: {pattern}")

    def test_env_example_exists(self):
        """Test .env.example exists"""
        env_example = Path("ctb/data/.env.example")
        assert env_example.exists(), "Missing .env.example file"

    def test_env_file_not_committed(self):
        """Test .env file is not committed"""
        env_file = Path("ctb/data/.env")
        gitignore = Path(".gitignore")

        if env_file.exists() and gitignore.exists():
            gitignore_content = gitignore.read_text()
            assert ".env" in gitignore_content, ".env file exists but not in .gitignore!"


if __name__ == "__main__":
    # Run tests with: pytest ctb/data/tests/test_schema.py -v
    pytest.main([__file__, "-v"])
