"""Blueprint API endpoints

CTB Layer: app
IMO Phase: INPUT (manifest upload), MIDDLE (scoring, visuals), OUTPUT (API response)
"""
import os
import sys
import json
import yaml
import subprocess
from pathlib import Path
from fastapi import HTTPException
from fastapi.responses import PlainTextResponse, JSONResponse


def get_blueprints_dir() -> Path:
    """Get blueprints directory path"""
    base_dir = Path(__file__).parent.parent.parent.parent
    return base_dir / "docs" / "blueprints"


async def get_manifest(slug: str):
    """Get manifest YAML for a blueprint"""
    blueprints_dir = get_blueprints_dir()
    manifest_path = blueprints_dir / slug / "manifest.yaml"
    if not manifest_path.exists():
        return PlainTextResponse(f"Manifest not found for {slug}. Create it at {manifest_path}", status_code=404)

    with open(manifest_path, 'r') as f:
        return PlainTextResponse(f.read())


async def put_manifest(slug: str, body: bytes):
    """Update manifest YAML for a blueprint"""
    blueprints_dir = get_blueprints_dir()
    blueprint_dir = blueprints_dir / slug
    blueprint_dir.mkdir(parents=True, exist_ok=True)

    manifest_path = blueprint_dir / "manifest.yaml"

    try:
        yaml.safe_load(body.decode())
    except yaml.YAMLError as e:
        raise HTTPException(status_code=400, detail=f"Invalid YAML: {e}")

    with open(manifest_path, 'wb') as f:
        f.write(body)

    return {"message": f"Manifest saved for {slug}", "path": str(manifest_path)}


async def score_blueprint(slug: str):
    """Run scorer and return progress JSON"""
    blueprints_dir = get_blueprints_dir()
    base_dir = blueprints_dir.parent.parent
    blueprint_dir = blueprints_dir / slug

    if not (blueprint_dir / "manifest.yaml").exists():
        return JSONResponse({"error": f"No manifest found for {slug}"}, status_code=404)

    try:
        result = subprocess.run(
            [sys.executable, str(base_dir / "tools" / "blueprint_score.py"), slug],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode != 0:
            return JSONResponse({"error": result.stderr}, status_code=500)

        progress_path = blueprint_dir / "progress.json"
        if progress_path.exists():
            with open(progress_path, 'r') as f:
                return json.load(f)
        else:
            return JSONResponse({"error": "Progress file not generated"}, status_code=500)

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


async def generate_visuals(slug: str):
    """Run visual generator and return paths"""
    blueprints_dir = get_blueprints_dir()
    base_dir = blueprints_dir.parent.parent
    blueprint_dir = blueprints_dir / slug

    if not (blueprint_dir / "manifest.yaml").exists():
        return JSONResponse({"error": f"No manifest found for {slug}"}, status_code=404)

    try:
        result = subprocess.run(
            [sys.executable, str(base_dir / "tools" / "blueprint_visual.py"), slug],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode != 0:
            return JSONResponse({"error": result.stderr}, status_code=500)

        files = [
            "tree_overview.mmd",
            "ladder_input.mmd",
            "ladder_middle.mmd",
            "ladder_output.mmd"
        ]

        paths = {}
        for file in files:
            file_path = blueprint_dir / file
            if file_path.exists():
                paths[file] = str(file_path)

        return {"message": "Visuals generated", "paths": paths}

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
