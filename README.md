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

## LLM Endpoint & Env

The UI supports LLM-assisted prompt generation with dual deployment:

**Local Development:**
```bash
# Copy and configure environment
cp .env.example .env
# Add your API key: ANTHROPIC_API_KEY=sk-ant-xxx or OPENAI_API_KEY=sk-xxx

# Run with LLM support
uvicorn src.server.main:app --port 7002 --reload

# Use LLM endpoint
# Open docs/blueprints/ui/input.html?llm=http://localhost:7002/llm
```

**Production (Vercel):**
- Set environment variables in Vercel dashboard
- Deploy automatically calls `/api/llm` serverless function
- Configure `ALLOW_ORIGIN` for CORS security

**Fallback:** If LLM endpoint unavailable, buttons fall back to copy-to-clipboard prompts.

## Structure
- `docs/blueprints/example/` - Example manifest and generated files
- `docs/blueprints/ui/` - Static HTML UI pages
- `tools/` - Scorer and visual generator
- `src/server/` - Optional FastAPI backend