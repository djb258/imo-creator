"""Smoke tests for overview page with example slug"""
import subprocess
import json
from pathlib import Path
import sys

SLUG = "example"

def test_scorer_runs():
    """Test that scorer generates progress.json for slug"""
    result = subprocess.run(
        [sys.executable, "tools/blueprint_score.py", SLUG],
        capture_output=True,
        text=True,
        cwd=Path(__file__).parent.parent.parent
    )
    assert result.returncode == 0, f"Scorer failed: {result.stderr}"
    
    progress_path = Path(__file__).parent.parent.parent / f"docs/blueprints/{SLUG}/progress.json"
    assert progress_path.exists(), f"progress.json not created for {SLUG}"
    
    with open(progress_path, 'r') as f:
        progress = json.load(f)
    
    assert 'overall' in progress, "Missing overall in progress"
    assert 'buckets' in progress, "Missing buckets in progress"
    assert 'todo' in progress, "Missing todo in progress"
    assert progress['slug'] == SLUG, f"Wrong slug in progress: {progress.get('slug')}"

def test_visual_generator_runs():
    """Test that visual generator creates Mermaid files for slug"""
    result = subprocess.run(
        [sys.executable, "tools/blueprint_visual.py", SLUG],
        capture_output=True,
        text=True,
        cwd=Path(__file__).parent.parent.parent
    )
    assert result.returncode == 0, f"Visual generator failed: {result.stderr}"
    
    base_dir = Path(__file__).parent.parent.parent / f"docs/blueprints/{SLUG}"
    expected_files = [
        "tree_overview.mmd",
        "ladder_input.mmd",
        "ladder_middle.mmd",
        "ladder_output.mmd"
    ]
    
    for filename in expected_files:
        file_path = base_dir / filename
        assert file_path.exists(), f"Missing {filename} for {SLUG}"
        
        with open(file_path, 'r') as f:
            content = f.read()
        assert len(content) > 20, f"{filename} is too short or empty"
        assert "flowchart" in content, f"{filename} missing flowchart directive"

def test_manifest_exists():
    """Test that manifest exists for slug"""
    manifest_path = Path(__file__).parent.parent.parent / f"docs/blueprints/{SLUG}/manifest.yaml"
    assert manifest_path.exists(), f"Manifest not found for {SLUG}"
    
    with open(manifest_path, 'r') as f:
        content = f.read()
    
    assert f"process: {SLUG}" in content, f"Wrong process in manifest"
    assert "buckets:" in content
    assert "input:" in content
    assert "middle:" in content
    assert "output:" in content

def test_ui_files_exist():
    """Test that UI files exist and support slug parameter"""
    ui_dir = Path(__file__).parent.parent.parent / "docs/blueprints/ui"
    
    # Check overview.html
    overview_path = ui_dir / "overview.html"
    assert overview_path.exists(), "Missing overview.html"
    
    with open(overview_path, 'r') as f:
        content = f.read()
    assert "app.js" in content, "overview.html not loading app.js"
    assert "mermaid" in content, "overview.html not loading mermaid"
    
    # Check app.js
    app_path = ui_dir / "app.js"
    assert app_path.exists(), "Missing app.js"
    
    with open(app_path, 'r') as f:
        content = f.read()
    assert "const SLUG" in content, "app.js not handling slug parameter"
    assert "searchParams.get('slug')" in content, "app.js not reading slug from URL"
    
    # Check style.css
    style_path = ui_dir / "style.css"
    assert style_path.exists(), "Missing style.css"

def test_readiness_calculation():
    """Test that readiness is calculated correctly"""
    progress_path = Path(__file__).parent.parent.parent / f"docs/blueprints/{SLUG}/progress.json"
    
    if progress_path.exists():
        with open(progress_path, 'r') as f:
            progress = json.load(f)
        
        # Check overall percentage calculation
        overall = progress.get('overall', {})
        if overall.get('total', 0) > 0:
            expected_percent = int((overall.get('done', 0) / overall.get('total', 1)) * 100)
            actual_percent = overall.get('percent', 0)
            assert actual_percent == expected_percent, f"Incorrect percentage: {actual_percent} != {expected_percent}"
        
        # Check bucket progress matches stages
        for bucket_name, bucket_progress in progress.get('buckets', {}).items():
            for stage_key, status in bucket_progress.items():
                assert status in ['done', 'wip', 'todo'], f"Invalid status: {status}"

if __name__ == "__main__":
    import pytest
    pytest.main([__file__, "-v"])