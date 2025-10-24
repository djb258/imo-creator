# CTB/DATA Tests

**Purpose**: Test suite for data layer components including schemas, migrations, validation, and pipelines

---

## 📁 Test Structure

```
ctb/data/tests/
├── __init__.py              # Package initialization
├── conftest.py              # Pytest configuration and fixtures
├── test_schemas.py          # Database schema tests
├── test_migrations.py       # Migration tests
├── test_validation.py       # Zod validation tests
├── test_pipelines.py        # ETL pipeline tests (to be added)
└── README.md                # This file
```

---

## 🧪 Running Tests

### Run All Tests
```bash
# From repo root
pytest ctb/data/tests/

# With coverage
pytest ctb/data/tests/ --cov=ctb/data --cov-report=html
```

### Run Specific Test File
```bash
pytest ctb/data/tests/test_schemas.py
pytest ctb/data/tests/test_migrations.py
pytest ctb/data/tests/test_validation.py
```

### Run Specific Test Class
```bash
pytest ctb/data/tests/test_schemas.py::TestPostgreSQLSchemas
```

### Run Specific Test Method
```bash
pytest ctb/data/tests/test_schemas.py::TestPostgreSQLSchemas::test_schema_has_required_fields
```

---

## 🔧 Test Configuration

### Environment Setup

Create a `.env.test` file:
```bash
# Test Database
TEST_DATABASE_URL=postgresql://user:pass@localhost:5432/test_db

# Firebase Test Config
FIREBASE_PROJECT_ID=test-project-id
FIREBASE_CLIENT_EMAIL=test@test.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="test_key"

# Test Environment
PYTHON_ENV=test
DEBUG=true
```

### Test Database Setup

```bash
# Create test database
createdb test_db

# Run migrations on test database
DATABASE_URL=$TEST_DATABASE_URL node ctb/sys/database/migrations/run.cjs

# Or use Docker
docker run -d \
  --name postgres-test \
  -e POSTGRES_DB=test_db \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=pass \
  -p 5432:5432 \
  postgres:15
```

---

## 📋 Test Categories

### Schema Tests
Test database schema definitions and structure

**File**: `test_schemas.py`

**Coverage**:
- Schema structure validation
- Column definitions
- Primary keys
- Unique constraints
- Indexes
- Foreign keys

### Migration Tests
Test database migration files and execution

**File**: `test_migrations.py`

**Coverage**:
- Migration naming conventions
- Migration SQL syntax
- Migration execution order
- Migration tracking
- Rollback functionality

### Validation Tests
Test Zod validation schemas

**File**: `test_validation.py`

**Coverage**:
- Schema structure
- Email validation
- String validation (min/max length)
- Number validation (positive, integer)
- Object validation (required fields)
- Error handling

### Pipeline Tests (To Be Added)
Test ETL pipelines

**File**: `test_pipelines.py`

**Coverage**:
- Data extraction
- Data transformation
- Data loading
- Error handling
- Batch processing

---

## 🎯 Writing New Tests

### Test File Template

```python
"""
Module description
Tests for ctb/data/path/to/module.py
"""

import pytest


class TestYourComponent:
    """Test your component"""

    def test_basic_functionality(self):
        """Test basic functionality"""
        # Arrange
        input_data = {"test": "data"}

        # Act
        result = validate_data(input_data)

        # Assert
        assert result is not None
```

### Database Test Template

```python
@pytest.mark.asyncio
async def test_database_operation(test_database_url):
    """Test database operation"""
    from ctb.sys.database.client import get_db_client

    # Arrange
    db = get_db_client(test_database_url)

    # Act
    result = await db.execute_query("SELECT 1")

    # Assert
    assert len(result) == 1
```

---

## 📊 Test Coverage

### Generate Coverage Report

```bash
# HTML report
pytest ctb/data/tests/ --cov=ctb/data --cov-report=html

# Terminal report
pytest ctb/data/tests/ --cov=ctb/data --cov-report=term

# View HTML report
open htmlcov/index.html
```

### Coverage Targets

| Component | Target | Current |
|-----------|--------|---------|
| Schemas | 95% | TBD |
| Migrations | 90% | TBD |
| Validation | 95% | TBD |
| Pipelines | 85% | TBD |

---

## 🔍 Test Scenarios

### Schema Testing Scenarios
- ✅ Valid schema structure
- ✅ Invalid column types
- ✅ Missing primary key
- ✅ Duplicate column names
- ✅ Invalid constraints
- ✅ Index definitions

### Migration Testing Scenarios
- ✅ Valid migration file naming
- ✅ Invalid migration names
- ✅ Migration SQL syntax
- ✅ Migration execution order
- ✅ Migration tracking
- ✅ Rollback functionality
- ❌ Migration conflicts (to be added)

### Validation Testing Scenarios
- ✅ Valid data passes
- ✅ Invalid email formats
- ✅ String length violations
- ✅ Number range violations
- ✅ Required field missing
- ✅ Type mismatches
- ❌ Custom validation rules (to be added)

---

## 🚨 Troubleshooting

### Tests Failing

```bash
# Run with verbose output
pytest ctb/data/tests/ -vv

# Run with print statements
pytest ctb/data/tests/ -s

# Run specific failing test
pytest ctb/data/tests/test_schemas.py::test_name -vv
```

### Database Connection Issues

```bash
# Check test database exists
psql -l | grep test_db

# Create if missing
createdb test_db

# Test connection
psql $TEST_DATABASE_URL -c "SELECT 1"
```

### Migration Test Failures

```bash
# Reset test database
dropdb test_db && createdb test_db

# Run migrations manually
DATABASE_URL=$TEST_DATABASE_URL node ctb/sys/database/migrations/run.cjs

# Check migration tracking
psql $TEST_DATABASE_URL -c "SELECT * FROM schema_migrations"
```

### Validation Test Failures

```bash
# Check Zod is installed
npm ls zod

# Reinstall if needed
npm install zod

# Run validation tests in isolation
pytest ctb/data/tests/test_validation.py -v
```

---

## 🧹 Test Data Cleanup

### After Each Test

```python
@pytest.fixture(scope="function")
async def clean_database():
    """Clean test database after each test"""
    yield
    # Cleanup code here
    await db.execute_command("TRUNCATE TABLE users CASCADE")
```

### After Test Suite

```bash
# Drop test database
dropdb test_db

# Or clean all tables
psql $TEST_DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

---

## 📚 Resources

- **Pytest Documentation**: https://docs.pytest.org
- **pytest-asyncio**: https://github.com/pytest-dev/pytest-asyncio
- **Zod Documentation**: https://zod.dev
- **PostgreSQL Testing**: https://www.postgresql.org/docs/current/regress.html

---

## 🎯 Best Practices

### Test Naming
- Use descriptive names: `test_user_creation_with_valid_data`
- Follow pattern: `test_[what]_[scenario]`
- Group related tests in classes

### Test Isolation
- Each test should be independent
- Use fixtures for setup/teardown
- Don't rely on test execution order

### Test Data
- Use fixtures for test data
- Generate realistic test data
- Clean up after tests

### Assertions
- Use specific assertions
- Provide clear failure messages
- Test one thing per test

---

**Maintainer**: Data Engineering Team
**Last Updated**: 2025-10-23
