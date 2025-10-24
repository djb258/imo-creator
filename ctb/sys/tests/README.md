# CTB/SYS Tests

**Purpose**: Test suite for system infrastructure components

---

## 📁 Test Structure

```
ctb/sys/tests/
├── __init__.py              # Package initialization
├── conftest.py              # Pytest configuration and fixtures
├── test_database.py         # Database client tests
├── test_heir_orbt.py        # HEIR/ORBT utilities tests
├── test_composio_mcp.py     # Composio MCP integration tests (to be added)
├── test_api.py              # API endpoint tests (to be added)
└── README.md                # This file
```

---

## 🧪 Running Tests

### Run All Tests
```bash
# From repo root
pytest ctb/sys/tests/

# With coverage
pytest ctb/sys/tests/ --cov=ctb/sys --cov-report=html
```

### Run Specific Test File
```bash
pytest ctb/sys/tests/test_database.py
pytest ctb/sys/tests/test_heir_orbt.py
```

### Run Specific Test Class
```bash
pytest ctb/sys/tests/test_database.py::TestDatabaseClient
```

### Run Specific Test Method
```bash
pytest ctb/sys/tests/test_database.py::TestDatabaseClient::test_execute_query
```

---

## 🔧 Test Configuration

### Environment Setup

Create a `.env.test` file:
```bash
# Test Database
TEST_DATABASE_URL=postgresql://user:pass@localhost:5432/test_db

# Test Composio
COMPOSIO_API_KEY=test_key
COMPOSIO_USER_ID=test_user

# Test Environment
PYTHON_ENV=test
DEBUG=true
```

### Pytest Configuration

Create `pytest.ini` at repo root:
```ini
[pytest]
testpaths = ctb/sys/tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --strict-markers
markers =
    asyncio: mark test as async
    integration: mark test as integration test
    unit: mark test as unit test
```

---

## 📋 Test Categories

### Unit Tests
Test individual functions and classes in isolation

**Files**: All test_*.py files

**Example**:
```python
def test_heir_id_format():
    heir_id = generate_heir_id("SYS", "TEST")
    assert heir_id.startswith("HEIR-")
```

### Integration Tests
Test interactions between components

**Mark with**: `@pytest.mark.integration`

**Example**:
```python
@pytest.mark.integration
async def test_database_connection():
    db = get_db_client()
    result = await db.execute_query("SELECT 1")
    assert len(result) == 1
```

### Async Tests
Test async functions

**Mark with**: `@pytest.mark.asyncio`

**Example**:
```python
@pytest.mark.asyncio
async def test_async_query():
    result = await db.execute_query("SELECT * FROM users")
    assert isinstance(result, list)
```

---

## 🎯 Writing New Tests

### Test File Template

```python
"""
Module description
Tests for ctb/sys/path/to/module.py
"""

import pytest


class TestYourComponent:
    """Test your component"""

    def test_basic_functionality(self):
        """Test basic functionality"""
        # Arrange
        input_data = "test"

        # Act
        result = your_function(input_data)

        # Assert
        assert result == expected_output
```

### Fixtures

Add shared fixtures to `conftest.py`:

```python
@pytest.fixture(scope="function")
def your_fixture():
    """Your fixture description"""
    # Setup
    data = setup_data()

    yield data

    # Teardown
    cleanup_data(data)
```

---

## 📊 Test Coverage

### Generate Coverage Report

```bash
# HTML report
pytest ctb/sys/tests/ --cov=ctb/sys --cov-report=html

# Terminal report
pytest ctb/sys/tests/ --cov=ctb/sys --cov-report=term

# View HTML report
open htmlcov/index.html
```

### Coverage Targets

| Component | Target | Current |
|-----------|--------|---------|
| Database Client | 90% | TBD |
| HEIR/ORBT Utils | 95% | TBD |
| API Endpoints | 85% | TBD |
| Composio MCP | 80% | TBD |

---

## 🔍 Test Scenarios

### Database Tests
- Connection establishment
- Query execution
- Command execution
- Error handling
- Connection pooling
- Transaction management

### HEIR/ORBT Tests
- HEIR ID generation
- Process ID generation
- Payload validation
- ORBT layer validation
- Middleware functionality

### API Tests
- Endpoint responses
- Authentication
- Error handling
- Rate limiting
- CORS configuration

### Composio MCP Tests
- Server connectivity
- Tool execution
- Error handling
- Timeout handling

---

## 🚨 Troubleshooting

### Tests Failing

```bash
# Run with verbose output
pytest ctb/sys/tests/ -vv

# Run with print statements
pytest ctb/sys/tests/ -s

# Run specific failing test
pytest ctb/sys/tests/test_database.py::test_name -vv
```

### Database Connection Issues

```bash
# Check test database
psql $TEST_DATABASE_URL -c "SELECT 1"

# Reset test database
dropdb test_db && createdb test_db
```

### Import Errors

```bash
# Ensure ctb is in PYTHONPATH
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Or install in development mode
pip install -e .
```

---

## 📚 Resources

- **Pytest Documentation**: https://docs.pytest.org
- **pytest-asyncio**: https://github.com/pytest-dev/pytest-asyncio
- **Coverage.py**: https://coverage.readthedocs.io

---

**Maintainer**: Infrastructure Team
**Last Updated**: 2025-10-23
