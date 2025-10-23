"""Smoke tests for blueprint shell"""
import subprocess
import json
from pathlib import Path
import sys

def test_scorer_runs():
    """Test that scorer generates progress.json"""
    result = subprocess.run(
        [sys.executable, "tools/blueprint_score.py", "example"],
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Scorer failed: {result.stderr}"
    
    progress_path = Path("docs/blueprints/example/progress.json")
    assert progress_path.exists(), "progress.json not created"
    
    with open(progress_path, 'r') as f:
        progress = json.load(f)
    
    assert 'overall' in progress, "Missing overall in progress"
    assert 'buckets' in progress, "Missing buckets in progress"
    assert 'todo' in progress, "Missing todo in progress"
    assert progress['overall']['total'] == 15, f"Expected 15 stages, got {progress['overall']['total']}"

def test_visual_generator_runs():
    """Test that visual generator creates Mermaid files"""
    result = subprocess.run(
        [sys.executable, "tools/blueprint_visual.py", "example"],
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Visual generator failed: {result.stderr}"
    
    base_dir = Path("docs/blueprints/example")
    expected_files = [
        "tree_overview.mmd",
        "ladder_input.mmd",
        "ladder_middle.mmd",
        "ladder_output.mmd"
    ]
    
    for filename in expected_files:
        file_path = base_dir / filename
        assert file_path.exists(), f"Missing {filename}"
        
        with open(file_path, 'r') as f:
            content = f.read()
        assert len(content) > 50, f"{filename} is too short or empty"
        assert "flowchart" in content, f"{filename} missing flowchart directive"
        assert "classDef" in content, f"{filename} missing class definitions"

def test_manifest_exists():
    """Test that example manifest exists and is valid"""
    manifest_path = Path("docs/blueprints/example/manifest.yaml")
    assert manifest_path.exists(), "Example manifest not found"
    
    with open(manifest_path, 'r') as f:
        content = f.read()
    
    assert "process: example" in content
    assert "buckets:" in content
    assert "input:" in content
    assert "middle:" in content
    assert "output:" in content

def test_ui_files_exist():
    """Test that UI files exist"""
    ui_dir = Path("docs/blueprints/ui")
    expected_files = [
        "overview.html",
        "input.html",
        "middle.html",
        "output.html",
        "app.js",
        "style.css"
    ]
    
    for filename in expected_files:
        file_path = ui_dir / filename
        assert file_path.exists(), f"Missing UI file: {filename}"

def test_id_helpers():
    """Test ID generation helpers"""
    from tools.ids import process_id, run_id, stage_id, artifact_id
    from datetime import datetime
    
    dt = datetime(2025, 1, 18)
    
    pid = process_id("test", "1.0.0", "seed123", dt)
    assert pid.startswith("PRC::TEST::v1.0.0::20250118::")
    
    rid = run_id(pid, dt)
    assert "RUN::" in rid
    assert pid in rid
    
    sid = stage_id(pid, "input", "validate")
    assert "STG::" in sid
    assert "INPUT" in sid
    
    aid = artifact_id(sid, "abc123")
    assert "ART::" in aid
    assert sid in aid

if __name__ == "__main__":
    import pytest
    pytest.main([__file__, "-v"])