"""Tests for output page functionality"""
import yaml
import json
from pathlib import Path

def test_imo_output_manifest_structure():
    """Test that IMO manifest has proper Output stages structure"""
    manifest_path = Path(__file__).parent.parent.parent / "docs/blueprints/imo/manifest.yaml"
    assert manifest_path.exists(), "IMO manifest not found"
    
    with open(manifest_path, 'r') as f:
        manifest = yaml.safe_load(f)
    
    assert manifest['process'] == 'imo', "Wrong process name"
    
    # Check output stages
    output_stages = manifest['buckets']['output']['stages']
    stage_keys = [s['key'] for s in output_stages]
    
    expected_keys = ['frame', 'destinations', 'promotion', 'publish']
    assert stage_keys == expected_keys, f"Wrong output stage keys: {stage_keys}"
    
    # Verify we have exactly 4 stages
    assert len(output_stages) == 4, f"Expected 4 output stages, got {len(output_stages)}"

def test_promotion_stage_structure():
    """Test that promotion stage has proper gate and audit structure"""
    manifest_path = Path(__file__).parent.parent.parent / "docs/blueprints/imo/manifest.yaml"
    
    with open(manifest_path, 'r') as f:
        manifest = yaml.safe_load(f)
    
    promotion_stage = next(s for s in manifest['buckets']['output']['stages'] if s['key'] == 'promotion')
    
    assert promotion_stage['title'] == "Output schema, promotion gate, audit", "Wrong promotion title"
    
    fields = promotion_stage['fields']
    assert 'schema_ref' in fields, "Missing schema_ref field"
    assert 'promotion_gate' in fields, "Missing promotion_gate field"
    assert 'audit' in fields, "Missing audit field"
    
    # Check promotion gate has default
    assert "validator.status=='pass'" in fields['promotion_gate'], "Missing validator check in promotion gate"
    
    # Check audit has default values
    assert isinstance(fields['audit'], list), "Audit should be a list"
    assert 'run_id' in fields['audit'], "Missing run_id in audit"
    assert 'hash' in fields['audit'], "Missing hash in audit"
    assert 'actor' in fields['audit'], "Missing actor in audit"
    
    # Check required fields
    assert 'schema_ref' in promotion_stage['required_fields'], "schema_ref not in required_fields"
    assert 'promotion_gate' in promotion_stage['required_fields'], "promotion_gate not in required_fields"
    assert 'audit' in promotion_stage['required_fields'], "audit not in required_fields"
    
    # Check milestones
    assert 'milestones' in promotion_stage, "Missing milestones"
    assert promotion_stage['milestones']['sets_promotion_gate'] == True, "Missing sets_promotion_gate milestone"

def test_publish_stage_structure():
    """Test that publish stage has proper UPSERT and events structure"""
    manifest_path = Path(__file__).parent.parent.parent / "docs/blueprints/imo/manifest.yaml"
    
    with open(manifest_path, 'r') as f:
        manifest = yaml.safe_load(f)
    
    publish_stage = next(s for s in manifest['buckets']['output']['stages'] if s['key'] == 'publish')
    fields = publish_stage['fields']
    
    assert 'upsert_rule' in fields, "Missing upsert_rule"
    assert 'notifications' in fields, "Missing notifications"
    assert 'retention' in fields, "Missing retention"
    assert 'events' in fields, "Missing events"
    
    # Check defaults
    assert 'ON CONFLICT' in fields['upsert_rule'], "Wrong upsert_rule default"
    assert fields['retention'] == 'P30D', "Wrong retention default"
    assert 'output.promoted' in fields['events'], "Missing output.promoted event"
    assert 'notify.sent' in fields['events'], "Missing notify.sent event"

def test_destinations_stage_structure():
    """Test that destinations stage has proper structure"""
    manifest_path = Path(__file__).parent.parent.parent / "docs/blueprints/imo/manifest.yaml"
    
    with open(manifest_path, 'r') as f:
        manifest = yaml.safe_load(f)
    
    destinations_stage = next(s for s in manifest['buckets']['output']['stages'] if s['key'] == 'destinations')
    fields = destinations_stage['fields']
    
    assert 'destinations' in fields, "Missing destinations"
    assert 'consumers' in fields, "Missing consumers"
    assert 'side_effects' in fields, "Missing side_effects"
    
    # Check required fields
    assert 'destinations' in destinations_stage['required_fields'], "destinations not in required_fields"

def test_output_html_exists():
    """Test that output.html exists and contains required elements"""
    output_path = Path(__file__).parent.parent.parent / "docs/blueprints/ui/output.html"
    assert output_path.exists(), "output.html not found"
    
    with open(output_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    assert "IMO Creator — Output" in content, "Wrong page title"
    assert "renderOutputPage" in content, "renderOutputPage function not called"
    assert "Promotion gate" in content, "Missing promotion gate text"
    assert "Re-score & Visuals" in content, "Missing re-score button"

def test_output_app_js_functions():
    """Test that app.js contains output page functions"""
    app_path = Path(__file__).parent.parent.parent / "docs/blueprints/ui/app.js"
    assert app_path.exists(), "app.js not found"
    
    with open(app_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    required_functions = [
        'renderOutputPage',
        'loadOutputStage',
        'updateOutputGuidance',
        'draftFromLLMOutput',
        'saveOutputStage',
        'showOutputCurlFallback'
    ]
    
    for func in required_functions:
        assert f"function {func}" in content, f"Missing function: {func}"

def test_vscode_tasks_include_output():
    """Test that VS Code tasks include output page"""
    tasks_path = Path(__file__).parent.parent.parent / ".vscode/tasks.json"
    assert tasks_path.exists(), "tasks.json not found"
    
    with open(tasks_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    assert "ui: output" in content, "Missing output UI task"

def test_output_stage_field_requirements():
    """Test that each output stage has proper fields and required_fields"""
    manifest_path = Path(__file__).parent.parent.parent / "docs/blueprints/imo/manifest.yaml"
    
    with open(manifest_path, 'r') as f:
        manifest = yaml.safe_load(f)
    
    output_stages = manifest['buckets']['output']['stages']
    
    for stage in output_stages:
        assert 'key' in stage, f"Stage missing key: {stage}"
        assert 'title' in stage, f"Stage missing title: {stage['key']}"
        assert 'kind' in stage, f"Stage missing kind: {stage['key']}"
        assert 'fields' in stage, f"Stage missing fields: {stage['key']}"
        assert 'required_fields' in stage, f"Stage missing required_fields: {stage['key']}"
        
        # Check that required_fields exist in fields (except empty ones)
        for req_field in stage['required_fields']:
            assert req_field in stage['fields'], f"Required field {req_field} not in fields for {stage['key']}"

def test_output_default_values():
    """Test that output stages have appropriate default values"""
    manifest_path = Path(__file__).parent.parent.parent / "docs/blueprints/imo/manifest.yaml"
    
    with open(manifest_path, 'r') as f:
        manifest = yaml.safe_load(f)
    
    output_stages = manifest['buckets']['output']['stages']
    
    # Promotion should have default promotion_gate and audit
    promotion_stage = next(s for s in output_stages if s['key'] == 'promotion')
    assert promotion_stage['fields']['promotion_gate'] != "", "Promotion gate should have default value"
    assert len(promotion_stage['fields']['audit']) > 0, "Audit should have default values"
    
    # Publish should have default upsert_rule and events
    publish_stage = next(s for s in output_stages if s['key'] == 'publish')
    assert publish_stage['fields']['upsert_rule'] != "", "UPSERT rule should have default value"
    assert len(publish_stage['fields']['events']) > 0, "Events should have default values"

if __name__ == "__main__":
    import pytest
    pytest.main([__file__, "-v"])