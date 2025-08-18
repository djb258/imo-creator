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

The UI supports LLM-assisted prompt generation with **concurrent Anthropic and OpenAI support**:

**Local Development:**
```bash
# Copy and configure environment
cp .env.example .env
# Add BOTH API keys for full functionality:
# ANTHROPIC_API_KEY=sk-ant-xxx
# OPENAI_API_KEY=sk-xxx
# LLM_DEFAULT_PROVIDER=openai

# Run with LLM support
uvicorn src.server.main:app --port 7002 --reload

# Use LLM endpoint
# Open docs/blueprints/ui/input.html?llm=http://localhost:7002/llm
```

**Production (Vercel):**
- Set environment variables in Vercel dashboard (both providers supported)
- Deploy automatically calls `/api/llm` serverless function
- Configure `ALLOW_ORIGIN` for CORS security

**Request Format:**
```json
{
  "provider": "anthropic" | "openai",     // optional: auto-select if omitted
  "model": "claude-3-5-sonnet-20240620",  // optional: provider-specific model
  "system": "You are a helpful assistant", // optional
  "prompt": "Generate a JSON schema",     // required
  "json": true,                          // optional: expect JSON response
  "max_tokens": 1024                     // optional
}
```

**Provider Selection Algorithm:**
1. If `provider` specified → use it (error if API key missing)
2. Else if `model` starts with "claude" → anthropic, "gpt"/"o" → openai  
3. Else use `LLM_DEFAULT_PROVIDER` (error if key missing)
4. Else use whichever single API key is available
5. Else error: no provider/key available

**Fallback:** If LLM endpoint unavailable, buttons fall back to copy-to-clipboard prompts.

## Structure
- `docs/blueprints/example/` - Example manifest and generated files
- `docs/blueprints/ui/` - Static HTML UI pages
- `tools/` - Scorer and visual generator
- `src/server/` - Optional FastAPI backend