"""Tests for middle page functionality"""
import yaml
import json
from pathlib import Path

def test_imo_middle_manifest_structure():
    """Test that IMO manifest has proper Middle stages with HEIR support"""
    manifest_path = Path(__file__).parent.parent.parent / "docs/blueprints/imo/manifest.yaml"
    assert manifest_path.exists(), "IMO manifest not found"
    
    with open(manifest_path, 'r') as f:
        manifest = yaml.safe_load(f)
    
    assert manifest['process'] == 'imo', "Wrong process name"
    
    # Check middle stages
    middle_stages = manifest['buckets']['middle']['stages']
    stage_keys = [s['key'] for s in middle_stages]
    
    expected_keys = ['frame', 'state_machine', 'gates', 'transform', 'tests', 'staging']
    assert stage_keys == expected_keys, f"Wrong middle stage keys: {stage_keys}"
    
    # Verify we have exactly 6 stages
    assert len(middle_stages) == 6, f"Expected 6 middle stages, got {len(middle_stages)}"

def test_gates_stage_heir_capable():
    """Test that gates stage supports HEIR rulesets"""
    manifest_path = Path(__file__).parent.parent.parent / "docs/blueprints/imo/manifest.yaml"
    
    with open(manifest_path, 'r') as f:
        manifest = yaml.safe_load(f)
    
    gates_stage = next(s for s in manifest['buckets']['middle']['stages'] if s['key'] == 'gates')
    
    assert gates_stage['title'] == "Validation gates & invariants (HEIR-capable)", "Wrong gates title"
    
    fields = gates_stage['fields']
    assert 'gates' in fields, "Missing gates field"
    assert 'invariants' in fields, "Missing invariants field"
    assert 'heir_ruleset_id' in fields, "Missing heir_ruleset_id field"
    assert 'mode' in fields, "Missing mode field"
    
    # Check required fields
    assert 'gates' in gates_stage['required_fields'], "gates not in required_fields"

def test_transform_stage_structure():
    """Test that transform stage has proper idempotent structure"""
    manifest_path = Path(__file__).parent.parent.parent / "docs/blueprints/imo/manifest.yaml"
    
    with open(manifest_path, 'r') as f:
        manifest = yaml.safe_load(f)
    
    transform_stage = next(s for s in manifest['buckets']['middle']['stages'] if s['key'] == 'transform')
    fields = transform_stage['fields']
    
    assert 'steps' in fields, "Missing steps in transform"
    assert 'lookups' in fields, "Missing lookups in transform"
    assert 'retries' in fields, "Missing retries in transform"
    assert 'budget_usd' in fields, "Missing budget_usd in transform"
    
    assert fields['budget_usd'] == 10, "Wrong budget_usd default value"

def test_staging_stage_structure():
    """Test that staging stage has proper working store configuration"""
    manifest_path = Path(__file__).parent.parent.parent / "docs/blueprints/imo/manifest.yaml"
    
    with open(manifest_path, 'r') as f:
        manifest = yaml.safe_load(f)
    
    staging_stage = next(s for s in manifest['buckets']['middle']['stages'] if s['key'] == 'staging')
    fields = staging_stage['fields']
    
    assert 'working_store' in fields, "Missing working_store"
    assert 'write_kind' in fields, "Missing write_kind"
    assert 'document_keys' in fields, "Missing document_keys"
    assert 'events' in fields, "Missing events"
    
    # Check defaults
    assert fields['working_store'] == 'firebase', "Wrong working_store default"
    assert fields['write_kind'] == 'upsert', "Wrong write_kind default"
    assert 'middle.step.start' in fields['events'], "Missing start event"
    assert 'middle.step.done' in fields['events'], "Missing done event"
    assert 'middle.step.error' in fields['events'], "Missing error event"

def test_middle_html_exists():
    """Test that middle.html exists and contains required elements"""
    middle_path = Path(__file__).parent.parent.parent / "docs/blueprints/ui/middle.html"
    assert middle_path.exists(), "middle.html not found"
    
    with open(middle_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    assert "IMO Creator — Middle" in content, "Wrong page title"
    assert "renderMiddlePage" in content, "renderMiddlePage function not called"
    assert "runSimulator" in content, "runSimulator function not referenced"
    assert "HEIR Integration" in content, "Missing HEIR info"
    assert "Simulate" in content, "Missing simulate button"

def test_middle_app_js_functions():
    """Test that app.js contains middle page functions"""
    app_path = Path(__file__).parent.parent.parent / "docs/blueprints/ui/app.js"
    assert app_path.exists(), "app.js not found"
    
    with open(app_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    required_functions = [
        'renderMiddlePage',
        'loadMiddleStage',
        'updateMiddleGuidance',
        'draftFromLLMMiddle',
        'saveMiddleStage',
        'runSimulator'
    ]
    
    for func in required_functions:
        assert f"function {func}" in content, f"Missing function: {func}"

def test_vscode_tasks_include_middle():
    """Test that VS Code tasks include middle page and simulator"""
    tasks_path = Path(__file__).parent.parent.parent / ".vscode/tasks.json"
    assert tasks_path.exists(), "tasks.json not found"
    
    with open(tasks_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    assert "ui: middle" in content, "Missing middle UI task"
    
    # Check if simflow task exists (optional)
    if "tools/simflow/run.py" in content:
        assert "sim: run" in content, "Missing simulator task"

def test_middle_stage_field_requirements():
    """Test that each middle stage has proper fields and required_fields"""
    manifest_path = Path(__file__).parent.parent.parent / "docs/blueprints/imo/manifest.yaml"
    
    with open(manifest_path, 'r') as f:
        manifest = yaml.safe_load(f)
    
    middle_stages = manifest['buckets']['middle']['stages']
    
    for stage in middle_stages:
        assert 'key' in stage, f"Stage missing key: {stage}"
        assert 'title' in stage, f"Stage missing title: {stage['key']}"
        assert 'kind' in stage, f"Stage missing kind: {stage['key']}"
        assert 'fields' in stage, f"Stage missing fields: {stage['key']}"
        assert 'required_fields' in stage, f"Stage missing required_fields: {stage['key']}"
        
        # Check that required_fields exist in fields
        for req_field in stage['required_fields']:
            assert req_field in stage['fields'], f"Required field {req_field} not in fields for {stage['key']}"

if __name__ == "__main__":
    import pytest
    pytest.main([__file__, "-v"])