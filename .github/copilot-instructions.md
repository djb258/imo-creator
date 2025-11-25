# IMO-Creator Copilot Instructions

## Architecture Overview

This is the **master doctrine repository** for the Input-Middle-Output (IMO) pattern. All code follows the IMO flow and CTB (Code-Test-Boundary) layer structure.

### IMO Pattern (Input → Middle → Output)
- **Input**: Validation, auth, ingestion (Replit/frontend owns)
- **Middle**: Processing, transformation, AI/LLM logic (Claude Code owns)
- **Output**: Persistence, responses, notifications (Replit/frontend owns)

### CTB Layers (`src/` and `tests/` mirror each other)
```
src/system/  → Infrastructure, config, auth, telemetry
src/data/    → Persistence, schemas, DB clients
src/app/     → Business logic, workflows
src/ai/      → LLM providers, prompts, MCP tools, subagents
src/ui/      → Dashboard components, CLI
```

## Key Commands

```bash
# API Server (port 7002)
make run-api                    # or: uvicorn src.server.main:app --port 7002 --reload

# MCP Service (port 7001) - with bay selection
BAY=frontend uvicorn src.mcp_server:app --port 7001 --reload

# Sidecar Service (port 8000) - telemetry & HEIR checks
make run-sidecar

# Blueprint tools
python tools/blueprint_score.py <slug>   # Generate progress.json
python tools/blueprint_visual.py <slug>  # Generate Mermaid diagrams

# HEIR compliance validation
make heir-check                 # or: python -m packages.heir.checks

# Tests
pytest -q tests/test_blueprint_shell.py
```

## Project Conventions

### Blueprint Manifests
Blueprints live in `docs/blueprints/<slug>/manifest.yaml` following the IMO bucket structure:
- `buckets.input.stages[]` → Input phase stages
- `buckets.middle.stages[]` → Processing stages  
- `buckets.output.stages[]` → Output stages

Scoring generates `progress.json`; visuals generate `.mmd` Mermaid diagrams.

### HEIR Doctrine
The `heir.doctrine.yaml` file defines compliance requirements. Key checks:
- Unique ID format: `imo-${TIMESTAMP}-${RANDOM_HEX}`
- Required fields in `meta`: `app_name`, `repo_slug`, `stack`, `llm`
- All CI checks must pass via `python -m packages.heir.checks`

### MCP Registry
Integration routing defined in `branches/composio/mcp_registry.json`. The system uses Composio as primary hub with fallback spokes (n8n, Make.com, Zapier, Pipedream).

### Service Ports
| Service | Port | Purpose |
|---------|------|---------|
| Main API | 7002 | Blueprint API, LLM proxy |
| MCP Server | 7001 | Tool execution (bay-based) |
| Sidecar | 8000 | Event logging, HEIR checks |

### LLM Provider Fallback
The `/llm` endpoint auto-selects providers. Configure via:
- `LLM_DEFAULT_PROVIDER` env var (openai/anthropic)
- `OPENAI_API_KEY` and/or `ANTHROPIC_API_KEY`

## File Patterns

- **New API endpoint**: Add to `src/server/main.py`
- **New MCP tool**: Add to `garage-mcp/services/mcp/` with bay registration
- **New test**: Mirror in `tests/<layer>/` matching `src/<layer>/`
- **Config changes**: Update `config/global_config.yaml` and `heir.doctrine.yaml`
- **New blueprint**: Create `docs/blueprints/<slug>/manifest.yaml`

## Avoid

- Cross-layer imports (e.g., `ui` importing from `data`)
- Placing files in `/utils`, `/helpers`, `/common` (use proper CTB layer)
- Skipping HEIR checks before commit
- Modifying `garage-mcp/` without updating bay registration
