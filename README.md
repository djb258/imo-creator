# IMO-Creator — CTB Master Template Factory

## Purpose
This repository is the **canonical source of truth** for the **Christmas Tree Backbone (CTB)** architecture under Barton Doctrine.

## Usage
All new Barton-compliant repositories **must scaffold** from `/ctb-template/` via the `ctb_scaffold.ts` generator.

## Hierarchy
CTB defines the structural doctrine:
- **System** (`/sys`) → Core infrastructure (Composio MCP, Gatekeeper, Validator, CI, Environment)
- **Data** (`/data`) → Schema enforcement (Neon, Firebase, BigQuery, Zod)
- **Apps** (`/apps`) → Application layer (UI, API, Agents, Tools)
- **AI** (`/ai`) → AI integration (Blueprints, Prompts, Models, Training)
- **Docs** (`/docs`) → Documentation (CTB, Doctrine, ORT, SOPs)
- **Tests** (`/tests`) → Validation (Unit, Integration, Audit)

## Versioning
The current CTB schema version is defined in `/ctb-template/version.json`.

**Current Version**: `1.0.0`
**Last Updated**: `2025-10-23`

## Quick Start

### Scaffold a New Repository

```bash
# Full tier (enterprise-scale)
ts-node scripts/ctb_scaffold.ts --repo my-enterprise-app --tier full

# Mid tier (standard applications)
ts-node scripts/ctb_scaffold.ts --repo my-web-app --tier mid

# Micro tier (single-purpose tools)
ts-node scripts/ctb_scaffold.ts --repo my-cli-tool --tier micro
```

### Available Tiers

- **full**: Complete CTB structure for enterprise-scale repos (System + Data + Apps + AI + Docs + Tests)
- **mid**: CTB layout for mid-size repos (excludes AI training, ORT docs)
- **micro**: CTB layout for single-tool repos (minimal structure: sys, apps/tools, data/zod)

See `/ctb-template/tiers/` for complete tier specifications.

## CTB Template Structure

```
ctb-template/
├── sys/              # System infrastructure (40k altitude)
│   ├── composio-mcp/ # Composio MCP integration
│   ├── gatekeeper/   # Access control & policy enforcement
│   ├── validator/    # Schema enforcement
│   ├── ci/           # CI/CD pipelines
│   └── env/          # Environment configuration
├── data/             # Data layer (5k altitude)
│   ├── neon/         # PostgreSQL schemas
│   ├── firebase/     # Firebase Realtime DB
│   ├── bigquery/     # Analytics warehouse
│   └── zod/          # TypeScript validation
├── apps/             # Application layer (20k altitude)
│   ├── ui/           # Frontend components
│   ├── api/          # Backend endpoints
│   ├── agents/       # AI agents
│   └── tools/        # CLI utilities
├── ai/               # AI integration (20k altitude)
│   ├── blueprints/   # Workflow templates
│   ├── prompts/      # Prompt engineering
│   ├── models/       # Model configurations
│   └── training/     # Training resources
├── docs/             # Documentation
│   ├── ctb/          # CTB architecture docs
│   ├── doctrine/     # Barton Doctrine policies
│   ├── ort/          # Operational readiness
│   └── sops/         # Standard procedures
└── tests/            # Test suites
    ├── unit/         # Unit tests
    ├── integration/  # Integration tests
    └── audit/        # Compliance audits
```

## Barton Doctrine Enforcement

All scaffolded repositories enforce:

✅ **Composio MCP Required** - All external integrations must go through Composio MCP
✅ **Gatekeeper Enforced** - Access control and validation policies enforced at system layer
✅ **No Direct Neon Access** - Data access must go through validator layer

See `/ctb-template/.barton_policy.json` for complete policy specification.

## CTB Branch Structure

All repositories follow the branch map defined in `/ctb-template/CTB_BRANCHMAP.yaml`:

- `main` - Production (doctrine locked, maximum protection)
- `develop` - Integration and staging
- `sys/composio` - Doctrine & MCP synchronization (40k altitude)
- `sys/validator` - Schema enforcement (40k altitude)
- `sys/gatekeeper` - Access control (40k altitude)
- `feature/*` - Active feature development (10k altitude)
- `tools` - Permanent tool branch (20k altitude)

## Drift Enforcement

A GitHub Action (`.github/workflows/ctb_drift_check.yml`) automatically validates:
- CTB version consistency across repositories
- Barton policy compliance
- Required file presence

See **CI/CD Integration** section below for details.

## Documentation

- [CTB Architecture Guide](./docs/ctb/CTB_MAP.png)
- [CTB Version History](./docs/ctb/CTB_VERSION_HISTORY.md)
- [CTB Tier Selection Guide](./docs/ctb/CTB_TIER_GUIDE.md)
- [Barton Doctrine Policies](./docs/doctrine/)

---

## Legacy: Blueprint App Shell

Below is the legacy documentation for the original Blueprint App Shell functionality (still available in this repository).

### Blueprint App Features

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
# Copy environment template
cp .env.example .env

# (Optional) Add API keys for full functionality:
# ANTHROPIC_API_KEY=sk-ant-xxx
# OPENAI_API_KEY=sk-xxx
# LLM_DEFAULT_PROVIDER=openai

# Run server (works without API keys, shows helpful messages)
uvicorn src.server.main:app --port 7002 --reload

# Use LLM endpoint
# Open docs/blueprints/ui/input.html?llm=http://localhost:7002/llm
```

**Production (Vercel):**
- **Deploy immediately** - no API keys required, app works with copy-to-clipboard fallback
- **Add API keys later** in Vercel Dashboard → Project Settings → Environment Variables:
  - `ANTHROPIC_API_KEY` = `sk-ant-your-key` (optional)
  - `OPENAI_API_KEY` = `sk-your-key` (optional) 
  - `LLM_DEFAULT_PROVIDER` = `openai` or `anthropic` (optional)
  - `ALLOW_ORIGIN` = `https://your-domain.vercel.app` (optional, for CORS)
- LLM Settings panel shows real-time key status

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

## HEIR/MCP Integration

This app includes HEIR (Hierarchical Error-handling, ID management, and Reporting) and MCP (Model Context Protocol) integration:

### Quick Start
```bash
# Run HEIR validation checks
make check
# or
python -m packages.heir.checks

# Start MCP server (port 7001)
make run-mcp

# Start Sidecar event logger (port 8000)
make run-sidecar

# Test endpoints
curl http://localhost:7001/heir/check -X POST -H "Content-Type: application/json" -d '{"ssot": {"meta": {"app_name": "test"}, "doctrine": {}}}'
curl http://localhost:8000/events -X POST -H "Content-Type: application/json" -d '{"type": "test.event", "payload": {"message": "hello"}, "tags": {"source": "curl"}}'
```

### Service Architecture
- **MCP Server** (`:7001`): HEIR validation endpoint `/heir/check`
- **Sidecar Server** (`:8000`): Event logging to `./logs/sidecar.ndjson`  
- **Main API** (`:7002`): Blueprint management and LLM endpoints

### API Examples
```bash
# Check HEIR compliance
curl -X POST http://localhost:7001/heir/check \
  -H "Content-Type: application/json" \
  -d '{"ssot": {"meta": {"app_name": "imo-creator"}, "doctrine": {"schema_version": "HEIR/1.0"}}}'

# Log telemetry event  
curl -X POST http://localhost:8000/events \
  -H "Content-Type: application/json" \
  -d '{"type": "app.start", "payload": {"version": "1.0.0"}, "tags": {"env": "dev"}}'

# View recent events
curl http://localhost:8000/events/recent?limit=5

# Test SSOT ID generation
curl -X POST http://localhost:7002/api/ssot/save \
  -H "Content-Type: application/json" \
  -d '{"ssot":{"meta":{"app_name":"IMO Creator","stage":"overview"}}}'

# Test subagent registry
curl http://localhost:7002/api/subagents
```

## Smoke Tests (After Vercel Deploy)

### 1. ID Stamping Test
```bash
# Test that IDs get stamped automatically
curl -s -X POST https://imo-creator.vercel.app/api/ssot/save \
  -H 'content-type: application/json' \
  -d '{"ssot":{"meta":{"app_name":"IMO Creator","stage":"overview"}}}' | jq

# Expected: .ssot.doctrine.unique_id, .ssot.doctrine.process_id, .ssot.doctrine.blueprint_version_hash
```

### 2. Subagent Registry Test  
```bash
# Test subagent enumeration (from garage-mcp or fallback)
curl -s https://imo-creator.vercel.app/api/subagents | jq

# Expected: { "items": [ { "id": "...", "bay": "...", "desc": "..." }, ... ] }
```

## Vercel Environment Variables

Add these in Vercel → Project → Settings → Environment Variables:

```bash
# Required for ID generation
DOCTRINE_DB=shq
DOCTRINE_SUBHIVE=03
DOCTRINE_APP=imo
DOCTRINE_VER=1

# Optional garage-mcp integration
GARAGE_MCP_URL=https://your-mcp.example.com
GARAGE_MCP_TOKEN=your-token-here
SUBAGENT_REGISTRY_PATH=/registry/subagents

# Existing LLM keys
IMOCREATOR_OPENAI_API_KEY=sk-your-key
IMOCREATOR_ANTHROPIC_API_KEY=sk-ant-your-key

# Optional UI feature flag
NEXT_PUBLIC_SHOW_SUBAGENTS=true
```

**HEIR/MCP Features:**
- **Doctrine file**: `heir.doctrine.yaml` defines app metadata and compliance requirements
- **ID Generation**: Automatic stamping of `unique_id`, `process_id`, and `blueprint_version_hash`
- **Subagent Registry**: `/api/subagents` endpoint with garage-mcp integration and fallback
- **SSOT Processing**: `/api/ssot/save` endpoint for doctrine-safe ID stamping
- **MCP Server**: Validates SSOT configurations via `/heir/check` endpoint
- **Sidecar Logger**: Captures telemetry events in structured NDJSON format
- **Typed Models**: Pydantic models for request/response validation
- **CI Integration**: Automated HEIR compliance validation in GitHub Actions
- **Event Streaming**: Real-time event logging to `./logs/sidecar.ndjson`

## Structure
- `docs/blueprints/example/` - Example manifest and generated files
- `docs/blueprints/ui/` - Static HTML UI pages
- `tools/` - Scorer and visual generator
- `src/server/` - Optional FastAPI backend
- `packages/heir/` - HEIR compliance validation
- `packages/sidecar/` - Event emission for telemetry
- `heir.doctrine.yaml` - HEIR metadata and compliance configuration
- `src/server/blueprints/` - ID generation and versioning utilities
- `src/server/infra/` - Subagent registry client with garage-mcp integration