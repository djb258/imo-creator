"""
Pytest configuration for CTB/SYS tests
"""

import pytest
import sys
from pathlib import Path

# Add CTB root to Python path
CTB_ROOT = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(CTB_ROOT / "ctb" / "sys"))


@pytest.fixture(scope="session")
def api_base_url():
    """FastAPI base URL"""
    return "http://localhost:8000"


@pytest.fixture(scope="session")
def mcp_base_url():
    """Composio MCP base URL"""
    return "http://localhost:3001"


@pytest.fixture
def heir_id_generator():
    """Generate test HEIR IDs"""
    counter = 0

    def generate(system="TEST", mode="TEST"):
        nonlocal counter
        counter += 1
        from datetime import datetime
        now = datetime.now()
        return f"HEIR-{now.year}-{now.month:02d}-{system}-{mode}-{counter:02d}"

    return generate


@pytest.fixture
def process_id_generator():
    """Generate test Process IDs"""
    def generate(system="TEST"):
        import time
        timestamp = int(time.time())
        return f"PRC-{system}-{timestamp}"

    return generate
