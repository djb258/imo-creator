# IMO-Creator Copilot Instructions

## Architecture Overview

This is a monorepo implementing the **IMO (Input → Middle → Output) doctrine** — a hub-and-spoke architecture for AI-powered interface creation with MCP integration.

### Core Architecture Pattern
```
INPUT LAYER (Ingress)     →    MIDDLE LAYER (Logic)    →    OUTPUT LAYER (Egress)
  - Vercel frontend              - Composio Hub              - Neon Postgres
  - API endpoints                - MCP routing               - Firebase
  - Static UI                    - HEIR compliance           - External APIs
```

**Key Rule**: Logic and state live ONLY in the Middle layer. Input/Output are "dumb" pass-through layers.

### Directory Structure
| Path | Purpose |
|------|---------|
| `src/server/main.py` | FastAPI backend (port 7002) |
| `garage-mcp/` | MCP server with bay-based tool loading (port 7001) |
| `packages/heir/` | HEIR compliance checks and ID stamping |
| `packages/sidecar/` | Telemetry logger (port 8000) |
| `imo-creator/ctb/` | Code Tree Base: `sys/`, `ui/`, `ai/`, `data/` branches |
| `config/mcp_registry.json` | Central MCP tool registry |
| `docs/blueprints/` | Blueprint manifests and static UI |
| `tools/` | CLI utilities (scoring, visuals, compliance) |

---

## IMO Doctrine & Hub Compliance

Every hub must follow IMO structure per [HUB_COMPLIANCE.md](imo-creator/templates/checklists/HUB_COMPLIANCE.md):

- **Ingress (I)**: No logic, no state, UI is dumb input only
- **Middle (M)**: ALL logic, ALL state, ALL decisions, tools scoped here only  
- **Egress (O)**: No logic, no state, clean output only
- **Spokes**: Typed as I or O only, never contain logic/state/tools

### Hub Identity Requirements
```yaml
# Every hub requires these IDs (from heir.doctrine.yaml)
unique_id: "imo-${TIMESTAMP}-${RANDOM_HEX}"
process_id: "imo-process-${SESSION_ID}"
doctrine_id: "04.04.XX"  # From mcp_registry.json
```

### Altitude Levels
- **30k**: Strategic vision, high-level orchestration
- **20k**: Tactical planning, workflow coordination  
- **10k**: Implementation, specific tool execution
- **5k**: Detail work, individual operations

---

## Developer Workflows

### Setup
```powershell
python -m venv .venv; .\.venv\Scripts\activate
pip install -r requirements.txt
```

### Run Services (VS Code Tasks Available)
```bash
# API Server (port 7002)
uvicorn src.server.main:app --port 7002 --reload  # Task: "api: run"

# MCP Server (port 7001)
cd garage-mcp && make run-mcp  # or: uvicorn services.mcp.main:app --port 7001

# Sidecar Logger (port 8000)
make run-sidecar  # or: uvicorn services.sidecar.main:app --port 8000
```

### Blueprint Tools
```bash
python tools/blueprint_score.py <slug>    # Task: "bp: score ${input:slug}"
python tools/blueprint_visual.py <slug>   # Task: "bp: visuals ${input:slug}"
```

### Testing
```bash
pytest                        # All tests
pytest tests/test_api_smoke.py  # API smoke tests
python -m packages.heir.checks  # HEIR compliance
```

---

## API Endpoints Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/llm` | POST | LLM proxy with provider fallback |
| `/api/ssot/save` | POST | SSOT processing with HEIR stamping |
| `/api/subagents` | GET | Subagent registry (garage-mcp) |
| `/blueprints/{slug}/manifest` | GET/PUT | Blueprint manifest CRUD |
| `/blueprints/{slug}/score` | POST | Run blueprint scoring |
| `localhost:7001/heir/check` | POST | HEIR compliance validation |
| `localhost:8000/events` | POST | Sidecar telemetry events |

---

## Conventions & Patterns

### Pydantic Models
All API request/response shapes use Pydantic (`src/server/models.py`). When modifying endpoints, update models first.

### HEIR ID Stamping
IDs are auto-generated using `heir.doctrine.yaml` values + env vars:
- `DOCTRINE_DB`, `DOCTRINE_SUBHIVE`, `DOCTRINE_APP`, `DOCTRINE_VER`

### MCP Registry
`config/mcp_registry.json` defines available tools:
- `engine_capabilities`: Global tools (don't modify per-repo)
- `repo_usage`: Repo-specific patterns (customize here)
- Each tool has a `doctrine_id` for traceability

### Commit Style
```
feat(api): add new endpoint
fix(ui): resolve rendering issue
chore(deps): update requirements
```

---

## Common Tasks

### Adding an API Endpoint
1. Add Pydantic model in `src/server/models.py`
2. Add route in `src/server/main.py`
3. Add test in `tests/test_api_smoke.py`
4. Run: `pytest && uvicorn src.server.main:app --port 7002 --reload`

### Adding a Hub/Component
1. Place in CTB: `imo-creator/ctb/{sys|ui|ai|data}/`
2. Complete [HUB_COMPLIANCE.md](imo-creator/templates/checklists/HUB_COMPLIANCE.md)
3. Assign `doctrine_id` and add to `config/mcp_registry.json`
4. Ensure IMO layer separation (no logic in I/O layers)

### Working with MCP Tools
1. Select bay via `BAY` env var: `database`, `frontend`, `backend`
2. Core tools always loaded: `fs.*`, `exec.*`, `git.*`, `heir.*`, `sidecar.*`
3. Use garage-mcp scripts for validation

---

## Key Files to Inspect First
- [imo-architecture.json](imo-architecture.json) — Full hub/spoke architecture
- [heir.doctrine.yaml](heir.doctrine.yaml) — Doctrine configuration
- [config/mcp_registry.json](config/mcp_registry.json) — MCP tool registry
- [src/server/main.py](src/server/main.py) — API entry point
- [docs/imo_architecture.md](docs/imo_architecture.md) — Architecture docs
- [imo-creator/templates/checklists/HUB_COMPLIANCE.md](imo-creator/templates/checklists/HUB_COMPLIANCE.md) — Compliance checklist
