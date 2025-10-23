"""
Test HEIR module integration with MCP
Ensures heir tools load without crashing regardless of optional dependency availability
"""

import pytest
import sys
from pathlib import Path
from typing import Dict, Any

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

def test_heir_module_import():
    """Test that heir module can be imported without crashing"""
    try:
        from services.mcp.modules.core import heir
        assert heir is not None
        assert hasattr(heir, 'router')
    except ImportError as e:
        pytest.fail(f"HEIR module import failed: {e}")

@pytest.mark.asyncio
async def test_heir_status_endpoint():
    """Test heir status endpoint works regardless of dependencies"""
    from services.mcp.modules.core.heir import heir_status
    
    # Call the status function
    result = await heir_status()
    
    # Should return a StatusResponse object with valid status
    assert hasattr(result, 'status')
    assert hasattr(result, 'available')
    assert result.status in ['ok', 'degraded', 'unavailable', 'error', 'fail']
    
    # If unavailable, should have reason and hint
    if result.status == 'unavailable':
        assert hasattr(result, 'reason')
        assert hasattr(result, 'hint')
        assert result.available == False
    
    # If available, should have version
    if result.available:
        assert hasattr(result, 'version')

@pytest.mark.asyncio 
async def test_heir_check_endpoint():
    """Test heir check endpoint handles missing dependencies gracefully"""
    from services.mcp.modules.core.heir import run_heir_checks, CheckRequest
    
    # Create a test request
    request = CheckRequest(target_path=".", strict=False)
    
    # Call the check function
    result = await run_heir_checks(request)
    
    # Should return a CheckResponse object
    assert hasattr(result, 'status')
    assert hasattr(result, 'missing')
    assert hasattr(result, 'details')
    
    # Status should be valid
    assert result.status in ['ok', 'degraded', 'unavailable', 'error', 'fail']
    
    # If unavailable, should have helpful details
    if result.status == 'unavailable':
        assert 'hint' in result.details or 'reason' in result.details

def test_heir_optional_import_handling():
    """Test that heir module gracefully handles missing optional imports"""
    from services.mcp.modules.core import heir
    
    # Check if heir_checks was imported successfully
    if heir.heir_checks is None:
        # Should have captured the import error
        assert heir._heir_import_error is not None
        print(f"HEIR import failed as expected: {heir._heir_import_error}")
    else:
        # Should have working heir_checks module
        assert hasattr(heir.heir_checks, 'run_checks')
        assert hasattr(heir.heir_checks, 'HEIR_VERSION')
        print("HEIR module imported successfully")

def test_heir_checks_package_direct():
    """Test direct import of heir checks package"""
    try:
        from packages.heir.checks import run_checks, HEIR_VERSION
        
        # Test the new interface
        result = run_checks(".", strict=False)
        
        assert isinstance(result, dict)
        assert 'status' in result
        assert 'missing' in result
        assert 'details' in result
        
        # Should not crash regardless of optional deps
        assert result['status'] in ['ok', 'degraded', 'error', 'fail']
        
        print(f"HEIR checks result: {result['status']}")
        if result['missing']:
            print(f"Missing optional deps: {result['missing']}")
            
    except ImportError as e:
        # This is acceptable - heir package might not be importable
        print(f"HEIR package not importable (acceptable): {e}")

if __name__ == "__main__":
    # Run tests directly
    test_heir_module_import()
    test_heir_status_endpoint()
    test_heir_check_endpoint()
    test_heir_optional_import_handling()
    test_heir_checks_package_direct()
    print("All HEIR module tests passed!")