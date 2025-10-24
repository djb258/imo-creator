# 🗺️ IMO Creator - Fast Navigation Index

**Last Updated**: 2025-10-23 | **CTB Version**: 1.3.3 | **Compliance**: 75%

---

## ⚡ INSTANT LOOKUP

### Need to find/do something? Start here:

| What You Need | Exact Location | Purpose |
|--------------|----------------|---------|
| **MCP Registry** | `ctb/meta/config/mcp_registry.json` | All MCP tool registrations |
| **Composio Integration** | `ctb/docs/composio/COMPOSIO_INTEGRATION.md` | Composio MCP server setup + connected accounts |
| **API Catalog** | `ctb/sys/api/API_CATALOG.md` | All 15 API endpoints documented |
| **Database Schemas** | `ctb/data/SCHEMA_REFERENCE.md` | All 7 database tables (STAMPED format) |
| **CTB Doctrine** | `ctb/docs/global-config/CTB_DOCTRINE.md` | Full CTB rules and standards |
| **Quick Reference** | `ctb/docs/global-config/QUICK_REFERENCE.md` | CTB cheat sheet |
| **Compliance Scripts** | `ctb/sys/github-factory/scripts/` | Tagger, auditor, remediator |
| **Compliance Reports** | Root: `CTB_AUDIT_REPORT.md` | Latest compliance status |
| **HEIR Generator** | `ctb/ai/orbt-utils/heir_generator.py` | Generate HEIR/ORBT IDs |
| **Git Hooks** | `.githooks/` | Pre-commit compliance checks |
| **Branch Map** | `ctb/docs/global-config/ctb.branchmap.yaml` | All 20+ CTB branches defined |

---

## 📁 CTB DIVISION BREAKDOWN

### `ctb/sys/` - System Infrastructure (270 files)
**When to use**: APIs, servers, scripts, infrastructure, CI/CD

```
sys/
├── api/                    # API endpoints (llm.js, subagents.js, etc.)
├── github-factory/scripts/ # CTB compliance scripts (tagger, auditor, remediator)
├── global-factory/         # Global CTB config scripts
├── infrastructure/         # Garage MCP, Activepieces, Windmill, ChartDB
├── scripts/                # Utility scripts (composio tools, validation)
├── server/                 # FastAPI server code
├── tools/                  # Compliance tools, blueprint tools
└── libs/                   # Shared libraries (imo_tools, orbt-utils)
```

**Key Files**:
- `sys/github-factory/scripts/ctb_metadata_tagger.py` - Tags files with CTB metadata
- `sys/github-factory/scripts/ctb_audit_generator.py` - Generates compliance reports
- `sys/github-factory/scripts/ctb_remediator.py` - Auto-fixes compliance issues
- `sys/scripts/analyze_composio_tools.py` - Composio tool analysis
- `sys/server/main.py` - FastAPI entry point

### `ctb/ai/` - AI/ORBT Layer (13 files)
**When to use**: AI agents, HEIR/ORBT utilities, prompts

```
ai/
├── agents/        # AI agent definitions
├── orbt-utils/    # HEIR generators (Python & JS)
├── mcp/           # MCP registry endpoints
└── prompts/       # AI prompts
```

**Key Files**:
- `ai/orbt-utils/heir_generator.py` - Python HEIR ID generator
- `ai/orbt-utils/heir-generator.js` - JavaScript HEIR ID generator

### `ctb/data/` - Data/Schemas (12 files)
**When to use**: Database schemas, migrations, seeds, data warehouses

```
data/
├── schemas/chartdb_schemas/  # All ChartDB detected schemas
├── migrations/               # Database migrations
├── seeds/                    # Seed data
├── warehouses/chartdb/       # ChartDB warehouse data
└── tests/                    # Data layer tests
```

**Key Files**:
- `data/SCHEMA_REFERENCE.md` - Complete schema documentation (STAMPED)
- `data/schemas/chartdb_schemas/schema_index.json` - Schema index

### `ctb/docs/` - Documentation (130 files)
**When to use**: Architecture, doctrine, guides, integrations

```
docs/
├── composio/        # All Composio integration docs
├── global-config/   # CTB doctrine, branch maps, enforcement
├── guides/          # Step-by-step guides
├── integration/     # Integration summaries (DeepSeek, DrawIO, VSCode)
└── doctrine/        # CTB UI doctrine, global propagation
```

**Key Files**:
- `docs/global-config/CTB_DOCTRINE.md` - Master CTB rules
- `docs/global-config/QUICK_REFERENCE.md` - CTB quick ref
- `docs/composio/COMPOSIO_INTEGRATION.md` - Composio setup
- `docs/LLM_ONBOARDING.md` - LLM context guide
- `CLAUDE.md` - Claude bootstrap guide

### `ctb/meta/` - Metadata/Config (49 files)
**When to use**: MCP configs, compliance data, registries, tests

```
meta/
├── config/           # All MCP configs, tool manifests
├── branches/         # Branch-specific configs
├── audit_results/    # Historical audit results
├── tests/            # Meta layer tests
└── *.json           # Generated compliance data
```

**Key Files**:
- `meta/config/mcp_registry.json` - MCP tool registry
- `meta/ctb_registry.json` - CTB registry (divisions, scripts, workflows)
- `meta/audit_data.json` - Latest audit data
- `meta/config/heir.doctrine.yaml` - HEIR doctrine config

### `ctb/ui/` - UI Components (21 files)
**When to use**: UI apps, components, templates, factories

```
ui/
├── apps/my-app/    # Main UI app
├── components/     # Reusable UI components
├── factory/        # UI build/dev scripts
└── packages/       # UI packages (heir, sidecar)
```

---

## 🎯 COMMON TASKS

### Run Compliance Check
```bash
python ctb/sys/github-factory/scripts/ctb_audit_generator.py
# View: CTB_AUDIT_REPORT.md
```

### Tag Files with Metadata
```bash
python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py
# View: CTB_TAGGING_REPORT.md
```

### Auto-Fix Compliance Issues
```bash
python ctb/sys/github-factory/scripts/ctb_remediator.py
# View: CTB_REMEDIATION_SUMMARY.md
```

### Generate HEIR ID
```python
from ctb.ai.orbt_utils.heir_generator import HeirGenerator
heir = HeirGenerator()
heir_id = heir.generate()  # HEIR-2025-10-SYS-MODE-01
```

### Install Git Hooks
```bash
bash .githooks/install-hooks.sh
```

### Start MCP Server (Composio)
```bash
# See COMPOSIO_INTEGRATION.md for exact path
cd /path/to/composio-mcp
node server.js
```

---

## 🔧 CURRENT STATE

**Compliance Score**: 75% (Grade B)
**Tagged Files**: 425/469 (90.6%)
**Untagged Files**: 44
**Issues**: 2 (HEIR/ORBT gaps, hardcoded secrets)
**Recommendations**: 1 (tag remaining files)

**Critical Issues**:
1. 12 Composio calls missing HEIR/ORBT payloads (HIGH)
2. 3 files with hardcoded secrets (CRITICAL)

**Files with Hardcoded Secrets**:
- `ctb/sys/tools/million_verifier.py`
- `ctb/data/tests/test_schema.py`
- 1 other file (check audit_data.json)

---

## 🌳 CTB BRANCH STRUCTURE

**40k Altitude - Doctrine Core**:
- `doctrine/get-ingest` - Doctrine ingestion
- `sys/composio-mcp` - Composio MCP integration
- `sys/neon-vault` - Neon database
- `sys/firebase-workbench` - Firebase workspace
- `sys/bigquery-warehouse` - BigQuery data
- `sys/github-factory` - GitHub automation
- `sys/builder-bridge` - Builder.io bridge
- `sys/security-audit` - Security scanning
- `sys/chartdb` - ChartDB integration
- `sys/activepieces` - Activepieces automation
- `sys/windmill` - Windmill workflows
- `sys/claude-skills` - Claude Skills API
- `sys/deepwiki` - DeepWiki generation

**20k Altitude - IMO Factory**:
- `imo/input` - Input layer
- `imo/middle` - Processing layer
- `imo/output` - Output layer

**10k Altitude - UI Layer**:
- `ui/figma-bolt` - Figma integration
- `ui/builder-templates` - Builder.io templates

**5k Altitude - Operations**:
- `ops/automation-scripts` - Automation scripts
- `ops/report-builder` - Report generation

---

## 📊 FILE COUNTS

| Division | Files | Size (MB) | Subdirectories |
|----------|-------|-----------|----------------|
| sys      | 270   | 2.77      | 15             |
| docs     | 130   | 2.36      | 8              |
| meta     | 49    | 0.85      | 6              |
| ui       | 21    | 0.05      | 5              |
| ai       | 13    | 0.09      | 5              |
| data     | 12    | 0.05      | 5              |
| **TOTAL**| **495** | **6.17** | **44**       |

---

## 🚨 DON'T DO THIS

❌ Create custom Google API integrations (use Composio MCP)
❌ Set up individual OAuth flows (Composio handles it)
❌ Use environment variables for Google services (use MCP)
❌ Ignore HEIR/ORBT payload format for Composio calls
❌ Skip compliance checks before committing
❌ Hardcode API keys/secrets (use MCP vault)

---

## 💡 EFFICIENCY TIPS

1. **Always check this file first** - Don't search, use the lookup table
2. **Use ctb_registry.json** for division info
3. **Use audit_data.json** for compliance metrics
4. **Read CLAUDE.md** for bootstrap context
5. **Use QUICK_REFERENCE.md** for CTB cheat sheet
6. **Check mcp_registry.json** for MCP tools

---

**THIS FILE SAVES TOKEN COSTS** - Bookmark it. Reference it first. Update it when structure changes.
