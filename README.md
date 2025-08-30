# IMO-Creator Blueprint Garage

## 🧱 **PRIMARY SYSTEM DOCTRINE (Top-Level Rule)**  
**"AI helps build the system. Old school runs the system."**

### Doctrine Enforcement Requirements:

1. 🤖 **LLMs ONLY during blueprint phase** inside the `imo-creator` repo  
2. 🧠 **Full process definition required**:
   - `manifest.yaml` with altitude-coded logic (30k → 1k)
   - `subagents.json` declaring MCP tools
   - `heir/check.ts` or MCP validator to enforce structure
3. 🧪 **All runtime execution → MCP servers** (Firebase, Neon, BigQuery, Apify, Render, etc.)
4. ❌ **No LLM active during live production** unless explicitly doctrine-approved
5. ✅ **Pre-deployment validation**:
   - Retire all LLM subagents into `garage/`
   - Strip Claude prompt scaffolding
   - Run doctrine validation (`/heir/check`)
   - Confirm MCP-only execution path

---

## Blueprint App Shell

A 4-page planning app with SSOT manifest, flex ladder stages, and visual progress tracking.

## Cockpit & Lens
- Repo‑Lens: /lens
- New Repo Wizard: /new
- Cockpit (per repo): /cockpit?repo=<owner/repo>&mode=factory|mechanic
- Launchpad (3 windows): /launchpad

## 🎄 Visualization Dashboard
- **Flow Visualization**: Christmas tree-style interactive flow diagram
- **Health Monitoring**: Real-time health status with color-coded nodes
- **Telemetry Heat Map**: Runtime failure pattern overlay
- **Mermaid Export**: Static diagram generation and export

```bash
# Launch visualization dashboard
pnpm garage:viz

# Refresh health data from static checks
pnpm garage:scan
```

Dashboard Features:
- 🟢 **Green nodes**: All checks passing (healthy)
- 🟡 **Yellow nodes**: Warnings detected (functional)  
- 🔴 **Red nodes**: Critical issues (requires attention)
- 📊 **Interactive sidebar**: Click nodes for detailed health information
- 🔥 **Heat map overlay**: Toggle telemetry failure visualization
- 📋 **Mermaid fallback**: Export diagrams for documentation

## 📋 Project Blueprint Template
- **Comprehensive Planning**: Multi-altitude project blueprint template
- **Whimsical Integration**: Automatic diagram generation for mind maps, flowcharts
- **Validation System**: Built-in schema validation and completeness checking
- **Agent Coordination**: Structured handoffs between Claude, GPT, and other agents

```bash
# Copy and fill out project blueprint template
cp templates/imo_project_blueprint.json my-project-blueprint.json

# Validate blueprint completeness and compliance
pnpm factory:validate-blueprint my-project-blueprint.json

# Submit to Whimsical GPT for visual generation
```

Blueprint Features:
- 🛩️ **30,000ft Vision**: Strategic objectives and success criteria
- ✈️ **20,000ft Architecture**: System components and team roles  
- 🚁 **10,000ft Implementation**: Detailed steps and decision points
- 🏃 **5,000ft Execution**: Documentation plans and agent handoffs
- 🎨 **Visual Outputs**: Mind maps, flowcharts, sequence diagrams
- 📊 **Progress Tracking**: Completeness scoring and validation

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

## MCP Backend Server

This project includes a dedicated **MCP (Mission Control Processor) Backend** that orchestrates connections between GitHub repositories, Whimsical diagrams, Plasmic UIs, and LLMs. 

### 🚀 Deployment
The MCP backend is deployed at: **https://imo-creator.onrender.com**

### 🏗️ Architecture
The MCP backend provides a modular FastAPI service that handles:

1. **GitHub Webhook Processing** - Receives repository change notifications
2. **CTB Structure Parsing** - Analyzes CTB blueprints from repositories  
3. **Whimsical Integration** - Updates diagrams with CTB structure visualization
4. **LLM Enhancement** - Analyzes CTB structures and suggests improvements
5. **Plasmic UI Generation** - Creates UI components from enhanced structures

### 🔧 Local Development
```bash
# Navigate to MCP backend directory
cd mcp/

# Install Python dependencies
pip install -r requirements.txt

# Start the MCP server
python main.py
# Server runs at http://localhost:8000
```

### 📡 API Endpoints

**Health & Status:**
- `GET /health` - Health check endpoint
- `GET /api/status` - Detailed service status

**GitHub Integration:**
- `POST /webhooks/github` - GitHub webhook receiver (requires HMAC signature)

**CTB Operations:**
- `GET /api/ctb/parse?repo_url={url}&branch={branch}` - Parse CTB from repository
- `GET /api/ctb/validate?repo_url={url}` - Validate CTB structure
- `GET /api/ctb/summary?repo_url={url}` - Get CTB summary

**Whimsical Integration:**
- `POST /api/whimsical/update` - Update Whimsical diagram with CTB data

**LLM Enhancement:**
- `POST /api/llm/analyze` - Analyze CTB structure and suggest improvements

### 🔐 Environment Variables
Configure these for the MCP backend:

```bash
# GitHub Integration
MCP_GITHUB_WEBHOOK_SECRET=your_webhook_secret
MCP_GITHUB_TOKEN=your_github_token

# Whimsical Integration  
MCP_WHIMSICAL_API_KEY=your_whimsical_key

# LLM Integration
MCP_LLM_API_KEY=your_openai_or_anthropic_key
MCP_LLM_MODEL=gpt-4  # or claude-3-5-sonnet

# Plasmic Integration
MCP_PLASMIC_PROJECT_ID=your_project_id
MCP_PLASMIC_AUTH_TOKEN=your_auth_token
```

### 🔄 Workflow Integration
The MCP backend integrates into the following workflow:

1. **GitHub Push** → Webhook to MCP backend
2. **MCP Backend** → Parses CTB structure from repository  
3. **LLM Analysis** → Suggests CTB improvements and enhancements
4. **Whimsical Update** → Updates diagrams with enhanced CTB structure
5. **Plasmic Generation** → Creates UI components from final structure

### 🛠️ Technical Details
- **Framework**: FastAPI with async/await support
- **HTTP Client**: httpx for external API calls
- **YAML Processing**: ruamel.yaml for CTB parsing
- **Deployment**: Render.com with Python 3.13
- **Background Tasks**: Async task processing to avoid webhook timeouts
- **Validation**: Pydantic models for request/response validation
- **Logging**: Structured logging with request tracking

## HEIR/MCP Integration

This app also includes HEIR (Hierarchical Error-handling, ID management, and Reporting) and legacy MCP integration:

### Quick Start
```bash
# Run HEIR validation checks
make check
# or
python -m packages.heir.checks

# Start legacy MCP server (port 7001)
make run-mcp

# Start Sidecar event logger (port 8000)
make run-sidecar

# Test endpoints
curl http://localhost:7001/heir/check -X POST -H "Content-Type: application/json" -d '{"ssot": {"meta": {"app_name": "test"}, "doctrine": {}}}'
curl http://localhost:8000/events -X POST -H "Content-Type: application/json" -d '{"type": "test.event", "payload": {"message": "hello"}, "tags": {"source": "curl"}}'
```

### Service Architecture
- **New MCP Backend** (https://imo-creator.onrender.com): GitHub/Whimsical/Plasmic orchestration
- **Legacy MCP Server** (`:7001`): HEIR validation endpoint `/heir/check`
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