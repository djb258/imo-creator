# Branch Documentation: sys/github-factory

**Generated**: 2025-10-22T07:57:01.715680
**Last Updated**: 2025-10-22

---

## 📊 Statistics

- **Total Files**: 16857
- **Directories**: 1725
- **Recent Commits**: 10

### File Types

- `.ts`: 4881 files
- `.js`: 4798 files
- `.map`: 3196 files
- `.cjs`: 866 files
- `.md`: 550 files
- `.mjs`: 485 files
- `.json`: 475 files
- `.mts`: 459 files
- `no_extension`: 329 files
- `.cts`: 277 files
- `.proto`: 220 files
- `.py`: 125 files
- `.yml`: 49 files
- `.txt`: 20 files
- `.ps1`: 20 files
- `.sh`: 19 files
- `.cmd`: 19 files
- `.yaml`: 9 files
- `.mmd`: 8 files
- `.html`: 8 files

---

## 📁 Top-Level Structure

- .claude
- .composio-test-report.json
- .devcontainer
- .env.example
- .github
- .gitignore
- .gitingestignore
- .python-version
- .vscode
- BUILDER_COMPOSIO_MCP.md
- CLAUDE.md
- CLAUDE_COMMANDS.md
- COMPOSIO_INTEGRATION.md
- COMPOSIO_INTEGRATION_SUMMARY.md
- COMPOSIO_QUICK_START.md
- COMPOSIO_TOOLS_STATUS.json
- COMPOSIO_VERIFICATION_REPORT.md
- CONTRIBUTING.md
- CTB_IMPLEMENTATION_REPORT.md
- DEEPSEEK_INTEGRATION.md
- DEPLOYMENT_URLS.md
- DRAWIO_INTEGRATION.md
- LICENSE
- LLM_ONBOARDING.md
- Makefile
- Procfile
- QUICKSTART.md
- README-DOCTRINE-AUTOMATION.md
- README.md
- REPO_OVERVIEW.md
- SCAFFOLD_INSTRUCTIONS.md
- STATUS.md
- VERCEL_ENVS.md
- VSCODE_BUILDER_INTEGRATION.md
- activepieces
- add-doctrine-headers.js
- analyze_composio_tools.py
- api
- apps
- audit_results
- bootstrap-repo.cjs
- branches
- chartdb
- check-claude-composio.cjs
- check-composio-apps.cjs
- check-instantly-app.cjs
- check-relevance-app.cjs
- claude-agents-library
- composio-mcp-openapi.yaml
- composio-tools-analysis.json
- composio-tools-full.json
- composio-tools-organized.json
- composio-tools-summary.json
- config
- custom-gpt-openapi.yaml
- deepwiki
- diagrams
- docs
- doctrine
- factory
- figma-plugin-urls.txt
- firebase_mcp.dockerfile
- firebase_mcp.js
- firebase_mcp_package.json
- firebase_mcp_registry_example.json
- firebase_studio_deploy.yml
- firebase_workflow_example.md
- garage-mcp
- garage_bay.py
- git-ingest-1758912879.md
- global-config
- gpt_mcp_manifest.json
- heir.doctrine.yaml
- imo-creator-ingest.txt
- imo-creator.code-workspace
- imo-sync.config.json
- imo.config.json
- index.html
- install-figma-plugins.bat
- install-figma-plugins.ps1
- install-figma-plugins.sh
- latest-composio-tools.json
- libs
- logs
- main.py
- mcp.config.json
- mechanic
- node_modules
- package-lock.json
- package.json
- packages
- pytest.ini
- relevance-ai-mcp.cjs
- render.yaml
- repo-lens
- requirements.txt
- runtime.txt
- scripts
- services
- simple_garage_bay.py
- src
- sys
- templates
- test-all-composio-tools.cjs
- test-composio-tools.py
- test_builder_integration.py
- test_pdf_mapper.py
- test_vscode_mcp_integration.py
- tests
- tools
- utils
- vercel.json
- verified-figma-plugins-2025.txt
- windmill

---

## 🔧 Configuration Files

- `package.json`
- `requirements.txt`
- `.env.example`

---

## 📝 Recent Commits

### 57d62b12 - 2025-10-22
**Author**: Dave Barton (dbarton@svg.agency)
**Message**: ðŸ¤– Add DeepWiki-Open integration (doctrine_id 04.04.11)

### 4aaaf569 - 2025-10-21
**Author**: Customer (dbarton@svg.agency)
**Message**: ðŸ“¦ Add comprehensive dependencies & validation for imo_tools

### 1f52c1d3 - 2025-10-21
**Author**: Customer (dbarton@svg.agency)
**Message**: ðŸ”§ Integrate pdfplumber for real PDF extraction in PDFMapperTool

### 2ce9ef88 - 2025-10-21
**Author**: Customer (dbarton@svg.agency)
**Message**: ðŸ§° Add PDFMapperTool for bidirectional PDF operations

### 5cc6f7fc - 2025-10-21
**Author**: Customer (dbarton@svg.agency)
**Message**: ðŸ§° Add imo_tools modular library with auto-propagation

### 85f30e6f - 2025-10-19
**Author**: Dave Barton (dbarton@svg.agency)
**Message**: Add Composio MCP integration documentation and tools- Add COMPOSIO_INTEGRATION_SUMMARY.md: Complete overview of 24 integrations and 1,059 tools- Add COMPOSIO_QUICK_START.md: Setup guide and usage examples- Add DEEPSEEK_INTEGRATION.md: DeepSeek integration documentation- Add test-composio-tools.py: Test script for Composio API- Add composio-tools-organized.json: Organized tool reference by app- Document Figma, GitHub, Gmail, Google Drive, Sheets, Notion, OpenAI, Vercel, and Render integrations

### 1fbdc731 - 2025-10-19
**Author**: Customer (dbarton@svg.agency)
**Message**: ðŸ“š Add comprehensive LLM onboarding documentation

### f5ec1a1d - 2025-10-18
**Author**: Dave Barton (dbarton@svg.agency)
**Message**: ðŸ”„ Add Auto-Update Version Detection System

### c6361bed - 2025-10-18
**Author**: Dave Barton (dbarton@svg.agency)
**Message**: ðŸ”„ Enhanced CTB Update Script v1.3.2

### a0b2fd3c - 2025-10-18
**Author**: Dave Barton (dbarton@svg.agency)
**Message**: ðŸš€ CTB Doctrine v1.3.2: Phase 2 Developer Experience Enhancements


---

## 📖 README Content

*Source: README.md*

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
curl -s https://imo-creator.vercel.app/api/subagents | 

*... (truncated, full length: 6897 characters)*
