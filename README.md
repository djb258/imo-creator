# Blueprint App Shell

A 4-page planning app with SSOT manifest, flex ladder stages, and visual progress tracking.

## Features
- **4-Page UI**: Overview with progress visual, Input/Middle/Output pages
- **SSOT Manifest**: YAML-based configuration with flexible stages per bucket
- **Scoring**: Automatic progress calculation (done/wip/todo)
- **Visuals**: Mermaid diagrams for overview and per-bucket ladders
- **API**: Optional FastAPI for manifest GET/PUT operations

## Quickstart

```bash
# Setup
python -m venv .venv && . .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt

# Generate progress and visuals
python tools/blueprint_score.py example
python tools/blueprint_visual.py example

# Open UI
# Open docs/blueprints/ui/overview.html in your browser

# (Optional) Run API
uvicorn src.server.main:app --port 7002 --reload
```

## Structure
- `docs/blueprints/example/` - Example manifest and generated files
- `docs/blueprints/ui/` - Static HTML UI pages
- `tools/` - Scorer and visual generator
- `src/server/` - Optional FastAPI backend