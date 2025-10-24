## Quick orientation

This repository is "IMO Creator" — a small blueprint/SSOT generator with an optional FastAPI backend, HEIR (ID/compliance) utilities, MCP/garage-mcp integrations, and a collection of Claude/OpenAI agent helpers. When editing code, prefer small, focused changes and preserve existing conventions (see Commit Style below).

## Big-picture architecture (what to know first)
- Main API: `src/server/main.py` (FastAPI). Hosts `/llm`, `/api/ssot/save`, `/api/subagents` and other blueprint endpoints.
- HEIR: `packages/heir/` contains compliance checks and ID stamping logic; `heir.doctrine.yaml` is the doctrine/config used by tests and runtime.
- MCP / garage-mcp: local MCP server lives under `garage-mcp/` and helper `src/mcp_server.py`. MCP validates SSOT via `/heir/check` on port 7001 by default.
- Sidecar: `packages/sidecar/` and a local sidecar server (port 8000) capture NDJSON telemetry to `./logs/sidecar.ndjson`.
- Static UI & tools: `docs/blueprints/ui/` (static HTML pages) and `tools/` (scripts such as `blueprint_score.py` and `blueprint_visual.py`).

Data flow summary
- UI (static pages) -> calls FastAPI `/llm` or copy-to-clipboard fallback.
- API persists/manipulates SSOT -> HEIR stamping via MCP -> optional Sidecar telemetry.
- Subagent registry calls garage-mcp; fallback to local registry files when unavailable.

## Developer workflows & essential commands
- Setup (Windows example):

```powershell
python -m venv .venv; .\.venv\Scripts\activate; pip install -r requirements.txt
```

- Run API (dev): `uvicorn src.server.main:app --port 7002 --reload` (also available as VS Code task `api: run`).
- Start local MCP server (garage-mcp): run the Makefile target or `python src/mcp_server.py`. VS Code task: `mcp: start server` (port 7001).
- Start sidecar logger: `make run-sidecar` or run the script in `packages/sidecar/` (port 8000).
- Quick tools: `python tools/blueprint_score.py example` and `python tools/blueprint_visual.py example` (VS Code tasks available: `bp: score example`, `bp: visuals example`).
- Tests: run `pytest` from repo root or specific tests in `tests/`.

Helpful endpoints for manual testing
- HEIR check: POST http://localhost:7001/heir/check
- Sidecar events: POST http://localhost:8000/events
- Save SSOT (ID stamping): POST http://localhost:7002/api/ssot/save
- Subagents listing: GET http://localhost:7002/api/subagents

## Project-specific conventions and patterns
- ID & doctrine: IDs are stamped automatically using values from `heir.doctrine.yaml` and env vars (DOCTRINE_DB, DOCTRINE_SUBHIVE, DOCTRINE_APP, DOCTRINE_VER). Look for stamping code in `src/server/blueprints/`.
- Provider selection: The LLM routing uses a small selection algorithm (see `README.md` LLM Provider Selection Algorithm). If `provider` specified, it must have a corresponding API key set. The app works without keys (UI falls back to copy-to-clipboard prompts).
- Altitude orchestration: garage-mcp follows fixed altitude roles (30k/20k/10k/5k). Subagents have stable role IDs (examples in `garage-mcp/docs/CLAUDE_SETUP.md`): `input-subagent-mapper`, `middle-subagent-db`, `output-subagent-notifier`.
- Typed models: Pydantic models are used heavily (see `claude-agents-library/mcp/registry_endpoint.py` and `src/server/models.py`) — return shapes should match these models when modifying APIs.

## Integration points & external dependencies
- LLMs: OpenAI and Anthropic (env vars `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `LLM_DEFAULT_PROVIDER`). See `README.md` for request format.
- MCP/garage-mcp: used for subagent registry and HEIR validation (`garage-mcp/`, `src/mcp_server.py`, `config/mcp_registry.json`).
- Claude agents library: `claude-agents-library/` contains install scripts and an MCP tool wrapper; follow its install/validate flow when adding agents.
- Deployment: Vercel is used for production; environment hints are in `VERCEL_ENVS.md` and `README.md`.

## Typical small tasks for an AI coding agent (how to be productive)
- When adding or changing an API endpoint:
  - Update or add a Pydantic model in `src/server/models.py`.
  - Add a minimal unit test in `tests/test_api_smoke.py` that exercises the new route.
  - Run the dev server and hit the endpoint, and run `pytest`.
- When changing ID generation or doctrine behavior: update `heir.doctrine.yaml` + `packages/heir/` logic, then run `make check` or `python -m packages.heir.checks`.
- When working with agents or MCP tools: prefer the provided scripts under `claude-agents-library/` for validation and installation; `install.sh` and the `mcp` scripts include helpful helpers and environment variables.

## Commit style and PR expectations
- Use conventional commits (examples in `CONTRIBUTING.md`): `feat(api): ...`, `fix(ui): ...`, `chore(deps): ...`.
- Keep changes small and include a test when you change behavior.

## Files to inspect first (quick reference)
- `README.md` — quickstart, provider algorithm, endpoints
- `src/server/main.py` — app entrypoint and routes
- `src/mcp_server.py` & `garage-mcp/` — MCP integration and local orchestration
- `packages/heir/` & `heir.doctrine.yaml` — ID/compliance logic
- `tools/blueprint_score.py`, `tools/blueprint_visual.py` — CLI utilities for blueprints
- `claude-agents-library/` — agent manifests, mcp helper scripts

If anything above is unclear or you want a different level of detail (more examples, code snippets, or test templates), tell me which sections to expand and I'll iterate. 
