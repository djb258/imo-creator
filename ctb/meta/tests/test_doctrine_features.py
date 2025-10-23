"""Tests for doctrine ID generation and subagent registry"""
import os
import pytest
from src.server.blueprints.ids import ensure_ids, generate_unique_id, generate_process_id
from src.server.blueprints.versioning import stamp_version_hash, canonicalize
from src.server.infra.subagents import list_subagents

def test_id_generation():
    """Test doctrine ID generation"""
    ssot = {
        "meta": {
            "app_name": "Test App",
            "stage": "overview"
        }
    }
    
    # Test ensure_ids adds required fields
    result = ensure_ids(ssot)
    
    assert "_created_at_ms" in result["meta"]
    assert "doctrine" in result
    assert "unique_id" in result["doctrine"]
    assert "process_id" in result["doctrine"]
    assert result["doctrine"]["schema_version"] == "HEIR/1.0"
    
    # Test ID format
    unique_id = result["doctrine"]["unique_id"]
    process_id = result["doctrine"]["process_id"]
    
    # unique_id format: shq-03-imo-YYYYMMDD-HHMMSS-RANDOMHASH
    assert unique_id.startswith("shq-03-imo-")
    assert len(unique_id.split("-")) >= 5
    
    # process_id format: shq.03.imo.V1.YYYYMMDD.stage
    assert process_id.startswith("shq.03.imo.V1.")
    assert process_id.endswith(".overview")

def test_version_hashing():
    """Test blueprint version hashing"""
    ssot = {
        "meta": {"app_name": "Test"},
        "doctrine": {"unique_id": "test-123"}
    }
    
    # Test canonicalization
    canon = canonicalize(ssot)
    assert isinstance(canon, str)
    assert "app_name" in canon
    
    # Test hash stamping
    result = stamp_version_hash(ssot)
    assert "blueprint_version_hash" in result["doctrine"]
    assert len(result["doctrine"]["blueprint_version_hash"]) == 64  # SHA256

def test_version_hash_stability():
    """Test that identical SSOTs produce identical hashes"""
    ssot1 = {"meta": {"app_name": "Test"}, "value": 123}
    ssot2 = {"meta": {"app_name": "Test"}, "value": 123}
    
    hash1 = stamp_version_hash(ssot1)["doctrine"]["blueprint_version_hash"]
    hash2 = stamp_version_hash(ssot2)["doctrine"]["blueprint_version_hash"]
    
    assert hash1 == hash2

def test_version_hash_changes():
    """Test that different SSOTs produce different hashes"""
    ssot1 = {"meta": {"app_name": "Test1"}}
    ssot2 = {"meta": {"app_name": "Test2"}}
    
    hash1 = stamp_version_hash(ssot1)["doctrine"]["blueprint_version_hash"]
    hash2 = stamp_version_hash(ssot2)["doctrine"]["blueprint_version_hash"]
    
    assert hash1 != hash2

def test_subagents_fallback():
    """Test subagent registry fallback"""
    # Should return fallback when no GARAGE_MCP_URL is set
    old_url = os.getenv("GARAGE_MCP_URL")
    if old_url:
        del os.environ["GARAGE_MCP_URL"]
    
    try:
        items = list_subagents()
        assert isinstance(items, list)
        assert len(items) >= 3  # At least the fallback items
        
        # Check fallback structure
        item = items[0]
        assert "id" in item
        assert "bay" in item
        assert "desc" in item
        
    finally:
        if old_url:
            os.environ["GARAGE_MCP_URL"] = old_url

def test_env_var_customization():
    """Test that environment variables customize ID generation"""
    # Save original env vars
    original_vars = {
        "DOCTRINE_DB": os.getenv("DOCTRINE_DB"),
        "DOCTRINE_SUBHIVE": os.getenv("DOCTRINE_SUBHIVE"),
        "DOCTRINE_APP": os.getenv("DOCTRINE_APP"),
        "DOCTRINE_VER": os.getenv("DOCTRINE_VER")
    }
    
    try:
        # Set custom values
        os.environ["DOCTRINE_DB"] = "test"
        os.environ["DOCTRINE_SUBHIVE"] = "99"
        os.environ["DOCTRINE_APP"] = "demo"
        os.environ["DOCTRINE_VER"] = "2"
        
        ssot = {"meta": {"app_name": "Custom", "stage": "testing"}}
        result = ensure_ids(ssot)
        
        unique_id = result["doctrine"]["unique_id"]
        process_id = result["doctrine"]["process_id"]
        
        assert unique_id.startswith("test-99-demo-")
        assert process_id.startswith("test.99.demo.V2.")
        assert process_id.endswith(".testing")
        
    finally:
        # Restore original env vars
        for key, value in original_vars.items():
            if value is not None:
                os.environ[key] = value
            elif key in os.environ:
                del os.environ[key]

if __name__ == "__main__":
    pytest.main([__file__, "-v"])