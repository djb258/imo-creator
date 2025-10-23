"""Tests for input page functionality"""
import yaml
from pathlib import Path

def test_imo_manifest_exists():
    """Test that IMO manifest exists with required input stages"""
    manifest_path = Path(__file__).parent.parent.parent / "docs/blueprints/imo/manifest.yaml"
    assert manifest_path.exists(), "IMO manifest not found"
    
    with open(manifest_path, 'r') as f:
        manifest = yaml.safe_load(f)
    
    assert manifest['process'] == 'imo', "Wrong process name"
    
    # Check input stages
    input_stages = manifest['buckets']['input']['stages']
    stage_keys = [s['key'] for s in input_stages]
    
    expected_keys = ['one_liner', 'sources', 'contract', 'intake_steps', 'fixtures']
    assert stage_keys == expected_keys, f"Wrong stage keys: {stage_keys}"
    
    # Check sources stage has mode field
    sources_stage = next(s for s in input_stages if s['key'] == 'sources')
    assert 'mode' in sources_stage['fields'], "Sources stage missing mode field"
    assert sources_stage['fields']['mode'] in ['design', 'integrate'], "Invalid mode value"
    
    # Check required fields include mode
    assert 'mode' in sources_stage['required_fields'], "Mode not in required_fields"
    assert 'sources' in sources_stage['required_fields'], "Sources not in required_fields"

def test_sources_stage_structure():
    """Test that sources stage has proper design/integrate structure"""
    manifest_path = Path(__file__).parent.parent.parent / "docs/blueprints/imo/manifest.yaml"
    
    with open(manifest_path, 'r') as f:
        manifest = yaml.safe_load(f)
    
    sources_stage = next(s for s in manifest['buckets']['input']['stages'] if s['key'] == 'sources')
    fields = sources_stage['fields']
    
    # Check design fields exist
    assert 'design' in fields, "Missing design fields"
    design = fields['design']
    assert 'schema_draft' in design, "Missing schema_draft in design"
    assert 'sample_records' in design, "Missing sample_records in design"
    
    # Check integrate fields exist
    assert 'integrate' in fields, "Missing integrate fields"
    integrate = fields['integrate']
    assert 'provider' in integrate, "Missing provider in integrate"
    assert 'external_schema_ref' in integrate, "Missing external_schema_ref in integrate"
    assert 'mapping' in integrate, "Missing mapping in integrate"

def test_input_html_exists():
    """Test that input.html exists and contains Source Strategy"""
    input_path = Path(__file__).parent.parent.parent / "docs/blueprints/ui/input.html"
    assert input_path.exists(), "input.html not found"
    
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    assert "Source Strategy" in content, "Source Strategy text not found"
    assert "mode-design" in content, "Design mode radio not found"
    assert "mode-integrate" in content, "Integrate mode radio not found"
    assert "renderInputPage" in content, "renderInputPage function not called"

def test_input_app_js_functions():
    """Test that app.js contains input page functions"""
    app_path = Path(__file__).parent.parent.parent / "docs/blueprints/ui/app.js"
    assert app_path.exists(), "app.js not found"
    
    with open(app_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    required_functions = [
        'renderInputPage',
        'loadStage',
        'updateGuidance',
        'draftFromLLM',
        'saveStage',
        'rescoreAndVisuals'
    ]
    
    for func in required_functions:
        assert f"function {func}" in content, f"Missing function: {func}"

def test_five_input_stages():
    """Test that there are exactly 5 input stages"""
    manifest_path = Path(__file__).parent.parent.parent / "docs/blueprints/imo/manifest.yaml"
    
    with open(manifest_path, 'r') as f:
        manifest = yaml.safe_load(f)
    
    input_stages = manifest['buckets']['input']['stages']
    assert len(input_stages) == 5, f"Expected 5 input stages, got {len(input_stages)}"

def test_css_has_input_styles():
    """Test that CSS includes input page styles"""
    css_path = Path(__file__).parent.parent.parent / "docs/blueprints/ui/style.css"
    assert css_path.exists(), "style.css not found"
    
    with open(css_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    required_classes = [
        '.segmented-control',
        '.three-column-layout',
        '.json-editor',
        '.controls-row'
    ]
    
    for class_name in required_classes:
        assert class_name in content, f"Missing CSS class: {class_name}"

if __name__ == "__main__":
    import pytest
    pytest.main([__file__, "-v"])