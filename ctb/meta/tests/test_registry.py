"""
CTB Doctrine v1.3 - MCP Registry Validation Tests
Purpose: Validate config/mcp_registry.json integrity and compliance
"""

import json
import pytest
from pathlib import Path


@pytest.fixture
def registry_path():
    """Path to MCP registry file"""
    return Path("config/mcp_registry.json")


@pytest.fixture
def registry_data(registry_path):
    """Load MCP registry data"""
    with open(registry_path) as f:
        return json.load(f)


def test_registry_file_exists(registry_path):
    """Test that MCP registry file exists"""
    assert registry_path.exists(), "config/mcp_registry.json must exist"


def test_registry_is_valid_json(registry_path):
    """Test that registry is valid JSON"""
    with open(registry_path) as f:
        data = json.load(f)
    assert isinstance(data, dict), "Registry must be a JSON object"


def test_registry_has_required_keys(registry_data):
    """Test that registry has all required top-level keys"""
    required_keys = ["engine_version", "last_updated", "production_urls", "engine_capabilities"]
    for key in required_keys:
        assert key in registry_data, f"Registry missing required key: {key}"


def test_engine_capabilities_is_list(registry_data):
    """Test that engine_capabilities is a list"""
    assert isinstance(registry_data["engine_capabilities"], list), \
        "engine_capabilities must be a list"


def test_all_mandatory_tools_present(registry_data):
    """Test that all 4 mandatory CTB tools are registered"""
    mandatory_doctrine_ids = ["04.04.07", "04.04.08", "04.04.09", "04.04.10"]
    mandatory_tools = {
        "04.04.07": "ChartDB",
        "04.04.08": "Activepieces",
        "04.04.09": "Windmill",
        "04.04.10": "Anthropic_Claude_Skills"
    }

    registered_ids = [
        tool["doctrine_id"]
        for tool in registry_data["engine_capabilities"]
        if "doctrine_id" in tool
    ]

    for doctrine_id, tool_name in mandatory_tools.items():
        assert doctrine_id in registered_ids, \
            f"Mandatory tool {tool_name} ({doctrine_id}) not registered"


def test_all_tools_have_doctrine_ids(registry_data):
    """Test that all tools have doctrine IDs"""
    for tool in registry_data["engine_capabilities"]:
        if tool.get("type") in ["MCP", "Custom API"]:
            assert "doctrine_id" in tool, \
                f"Tool {tool.get('tool')} missing doctrine_id"


def test_doctrine_ids_are_unique(registry_data):
    """Test that all doctrine IDs are unique"""
    doctrine_ids = [
        tool["doctrine_id"]
        for tool in registry_data["engine_capabilities"]
        if "doctrine_id" in tool
    ]

    assert len(doctrine_ids) == len(set(doctrine_ids)), \
        "Duplicate doctrine IDs found in registry"


def test_all_tools_have_endpoints(registry_data):
    """Test that all tools have endpoints defined"""
    for tool in registry_data["engine_capabilities"]:
        if tool.get("status") == "active":
            assert "endpoint" in tool, \
                f"Active tool {tool.get('tool')} missing endpoint"


def test_mandatory_tools_have_ctb_branches(registry_data):
    """Test that mandatory tools reference their CTB branches"""
    mandatory_tools = ["ChartDB", "Activepieces", "Windmill", "Anthropic_Claude_Skills"]

    for tool in registry_data["engine_capabilities"]:
        tool_name = tool.get("tool")
        if tool_name in mandatory_tools:
            assert "ctb_branch" in tool, \
                f"Mandatory tool {tool_name} missing ctb_branch reference"


def test_engine_version_format(registry_data):
    """Test that engine version follows semantic versioning"""
    version = registry_data["engine_version"]
    assert isinstance(version, str), "engine_version must be a string"

    parts = version.split(".")
    assert len(parts) >= 2, "engine_version must be semantic (X.Y or X.Y.Z)"

    for part in parts:
        assert part.isdigit(), f"Version part '{part}' must be numeric"


def test_anthropic_uses_composio_endpoint(registry_data):
    """Test that Anthropic Claude Skills uses composio:// endpoint"""
    for tool in registry_data["engine_capabilities"]:
        if tool.get("tool") == "Anthropic_Claude_Skills":
            endpoint = tool.get("endpoint", "")
            assert endpoint.startswith("composio://"), \
                "Anthropic_Claude_Skills must use composio:// endpoint"


def test_no_hardcoded_secrets_in_registry(registry_data):
    """Test that registry doesn't contain actual API keys (placeholders only)"""
    registry_str = json.dumps(registry_data)

    # Check for common secret patterns that shouldn't be there
    forbidden_patterns = [
        "sk-", "pk_", "secret_", "password:"
    ]

    for pattern in forbidden_patterns:
        if pattern in registry_str.lower():
            # Allow if it's in a placeholder context
            assert "<your-" in registry_str or "example" in registry_str.lower(), \
                f"Potential hardcoded secret pattern found: {pattern}"


@pytest.mark.integration
def test_registry_engine_version_matches_ctb_version():
    """Test that registry version matches CTB doctrine version"""
    registry_path = Path("config/mcp_registry.json")
    branchmap_path = Path("global-config/ctb.branchmap.yaml")

    with open(registry_path) as f:
        registry = json.load(f)

    if branchmap_path.exists():
        with open(branchmap_path) as f:
            branchmap_content = f.read()
            # Extract version from branchmap
            if "version: 1.3" in branchmap_content:
                assert registry["engine_version"].startswith("1.3"), \
                    "Registry version should match CTB branchmap version"
