<!--

# CTB Metadata
# Generated: 2025-10-23T14:32:39.922894
# CTB Version: 1.3.3
# Division: Documentation
# Category: guides
# Compliance: 90%
# HEIR ID: HEIR-2025-10-DOC-GUIDES-01

-->

# CTB Architecture Guide

Comprehensive overview of the Christmas Tree Backbone (CTB) Doctrine system architecture, component relationships, and data flow.

---

## 🎯 System Overview

The CTB Doctrine implements a hierarchical, altitude-based repository structure inspired by the Christmas tree metaphor. This architecture ensures clear separation of concerns, predictable merge flows, and maintainable codebases across all Barton Enterprises projects.

```
                    ⭐ Operations (5k)
                   /|\
                  / | \
                 /  |  \ UI Layer (10k)
                /   |   \
               /    |    \
              /     |     \ Business Logic (20k)
             /      |      \
            /       |       \
           /________|________\ System Infrastructure (40k)
                   |||
                   ||| Main Trunk (Doctrine Core)
                   |||
```

---

## 🏗️ Core Components

### 1. Main Trunk (master branch)

**Purpose:** Production-ready, immutable source of truth

**Contains:**
- Deployment configurations
- Root-level documentation
- Version control metadata

**Protection:** Strictest (2 required reviews)

**Merge Flow:** Only accepts from 40k altitude (sys/*)

---

### 2. Doctrine Layer (40k Altitude)

**Branches (12 total):**

#### Core Doctrine
- `doctrine/get-ingest` - Global manifests, HEIR schema, CTB configuration

#### System Integrations (Mandatory - Doctrine IDs 04.04.07-10)
- `sys/chartdb` - Database schema visualization
- `sys/activepieces` - Workflow automation
- `sys/windmill` - Developer platform (scripts, workflows)
- `sys/claude-skills` - AI/SHQ reasoning layer (200k context)

#### Infrastructure Systems
- `sys/composio-mcp` - MCP registry, tool integrations
- `sys/neon-vault` - PostgreSQL schemas, migrations
- `sys/firebase-workbench` - Firestore structures, security rules
- `sys/bigquery-warehouse` - Analytics, data warehouse
- `sys/github-factory` - CI/CD templates, automation
- `sys/builder-bridge` - Builder.io, Figma connectors
- `sys/security-audit` - Compliance, key rotation

**Characteristics:**
- Highest stability requirements
- Protected by CTB enforcement
- Changes require review
- Foundation for all other layers

---

### 3. Business Logic Layer (20k Altitude)

**Branches (3):**

- `imo/input` - Data intake, scraping, enrichment
- `imo/middle` - Calculators, compliance logic, core processing
- `imo/output` - Dashboards, exports, visualizations

**Characteristics:**
- Application-specific logic
- Merges upward to sys/* branches
- Lighter protection (single review or none)

**Purpose:** IMO Factory business process engine

---

### 4. UI/UX Layer (10k Altitude)

**Branches (2):**

- `ui/figma-bolt` - Figma + Bolt UI components
- `ui/builder-templates` - Builder.io reusable modules

**Characteristics:**
- User-facing components
- Design system implementations
- Visual layer only
- No business logic

---

### 5. Operations Layer (5k Altitude)

**Branches (2):**

- `ops/automation-scripts` - Cron jobs, CI tasks
- `ops/report-builder` - Compliance reports, analytics

**Characteristics:**
- Operational tooling
- Automation scripts
- Reporting utilities
- Highest velocity of change

---

## 🔄 Data Flow & Integration Architecture

### MCP (Model Context Protocol) Integration Hub

The Composio MCP server (port 3001) serves as the central integration point:

```
┌─────────────────────────────────────────────────────────┐
│                  Application Layer                      │
│         (FastAPI, Node.js, Python scripts)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Composio MCP Server (Port 3001)            │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ ChartDB      │  │ Activepieces │  │ Windmill     │  │
│  │ 04.04.07     │  │ 04.04.08     │  │ 04.04.09     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Anthropic Claude Skills (04.04.10)              │  │
│  │  composio://anthropic endpoint                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ MCP Vault    │  │ Tool Registry│  │ HEIR/ORBT    │  │
│  │ (Secrets)    │  │ (100+ tools) │  │ (Governance) │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              External Services & Data Stores            │
│                                                          │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Neon DB │  │ Firebase │  │ BigQuery │  │ Builder │ │
│  │ (Vault) │  │(Workbench│  │(Warehouse│  │  .io    │ │
│  └─────────┘  └──────────┘  └──────────┘  └─────────┘ │
│                                                          │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ GitHub  │  │  Gmail   │  │  Slack   │  │ Figma   │ │
│  │ Actions │  │  Drive   │  │  etc.    │  │         │ │
│  └─────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
```

### HEIR/ORBT Payload Format

All MCP tool calls use standardized Barton Doctrine payload structure:

```json
{
  "tool": "ChartDB",
  "action": "GENERATE_SCHEMA_DIAGRAM",
  "data": {
    "database_url": "${MCP:DATABASE_URL}",
    "output_format": "svg"
  },
  "unique_id": "HEIR-2025-10-CHARTDB-001",
  "process_id": "PRC-SCHEMA-001",
  "orbt_layer": 1,
  "blueprint_version": "1.0"
}
```

**Fields:**
- `tool` - MCP tool name from registry
- `action` - Toolkit tool action to execute
- `data` - Tool-specific parameters
- `unique_id` - HEIR-formatted unique identifier
- `process_id` - Process tracking ID
- `orbt_layer` - Altitude layer (1-4)
- `blueprint_version` - Schema version

---

## 🔐 Security Architecture

### Zero-Tolerance Secret Policy

**Forbidden:**
- `.env` files in any form
- Hardcoded API keys, tokens, passwords
- Credentials in code or config files

**Required:**
- All secrets stored in MCP vault
- Runtime variable injection via `mcp.getVariable()`
- MCP variable syntax: `${MCP:VARIABLE_NAME}`

### Secret Resolution Flow

```
1. Application requests secret
         │
         ▼
2. MCP Vault Resolver checks sources (priority order):
   ├─ Composio MCP Server (localhost:3001/vault/get)
   ├─ Doppler Vault (if configured)
   └─ Firebase Secure Variables (read-only)
         │
         ▼
3. Variable injected at runtime
         │
         ▼
4. Application receives secret (never stored)
```

### Security Enforcement Pipeline

```
On every push/PR:
  ├─ security_lockdown.sh
  │    ├─ Scan for .env files → BLOCK if found
  │    ├─ Detect hardcoded secrets → FAIL if detected
  │    ├─ Validate MCP usage → WARN if incorrect
  │    └─ Log to Firebase audit trail
  │
  ├─ GitHub Actions: .github/workflows/security_lockdown.yml
  │    ├─ TruffleHog secret scanning
  │    ├─ git-secrets history scan
  │    └─ MCP vault validation
  │
  └─ Fail build/deploy if violations found
```

---

## 📊 Testing Architecture

### Test Layers

```
┌──────────────────────────────────────────────────────┐
│  GitHub Actions CI/CD (test_coverage.yml)           │
│  ├─ Job 1: Python Tests (pytest + coverage)         │
│  ├─ Job 2: Bash Script Tests (ctb_scripts)          │
│  └─ Job 3: Registry Validation Tests                │
└──────────────────────────────────────────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────────┐  ┌─────────────┐
│ Unit Tests   │  │  Integration     │  │  Script     │
│ (pytest)     │  │  Tests           │  │  Tests      │
│              │  │  (pytest)        │  │  (bash)     │
│ - src/*      │  │  - MCP tools     │  │  - enforce  │
│ - tools/*    │  │  - Registry      │  │  - security │
│ - packages/* │  │  - Workflows     │  │  - setup    │
└──────────────┘  └──────────────────┘  └─────────────┘
```

### Coverage Requirements

- **Minimum:** 60% code coverage
- **Target:** 80% for critical paths
- **Enforcement:** CI fails if below threshold
- **Reporting:** HTML coverage reports in `htmlcov/`

---

## 🛠️ Development Workflow

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/djb258/imo-creator.git
cd imo-creator

# 2. Run one-command setup
bash global-config/scripts/dev_setup.sh

# 3. Start MCP server (in separate terminal)
cd path/to/scraping-tool/imo-creator/mcp-servers/composio-mcp
npm run dev

# 4. Verify CTB compliance
bash global-config/scripts/ctb_enforce.sh

# 5. Run tests
pytest
bash tests/test_ctb_scripts.sh
```

### Feature Development Flow

```
1. Create feature branch from appropriate altitude
   git checkout ops/automation-scripts
   git checkout -b feature/new-automation

2. Develop feature
   - Write code
   - Add tests
   - Update docs

3. Test locally
   pytest
   bash global-config/scripts/ctb_enforce.sh
   bash global-config/scripts/security_lockdown.sh

4. Commit changes
   git add .
   git commit -m "feat: add new automation script"

5. Merge upward through altitudes
   ops/automation-scripts → ui/figma-bolt → imo/middle → sys/* → main

6. Push and create PR
   git push origin feature/new-automation
   # Use .github/pull_request_template.md
```

---

## 🌐 Deployment Architecture

### Multi-Environment Strategy

```
┌──────────────────────────────────────────────────────────┐
│  Development (Local)                                     │
│  - Docker Compose for services                          │
│  - localhost ports: 3001, 5173, 8000, 8080              │
│  - MCP vault for secrets                                │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│  Staging (Render/Vercel)                                 │
│  - Automated deployments from main branch                │
│  - Doppler for environment variables                     │
│  - Firebase for real-time data                          │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│  Production (Render/Vercel)                              │
│  - Manual promotion from staging                         │
│  - Full security scans required                          │
│  - Zero-tolerance enforcement                            │
│  - Immutable deployments                                 │
└──────────────────────────────────────────────────────────┘
```

### Continuous Integration Pipeline

```
GitHub Push/PR
     │
     ▼
┌────────────────────────────────────┐
│  GitHub Actions Triggers:          │
│  1. test_coverage.yml              │
│  2. doctrine_sync.yml              │
│  3. ctb_health.yml                 │
│  4. security_lockdown.yml          │
└────────┬───────────────────────────┘
         │
         ├─ Tests Pass? → Continue
         ├─ CTB Compliant? → Continue
         ├─ Security Clean? → Continue
         │
         ▼
┌────────────────────────────────────┐
│  Deployment Triggers:              │
│  - Render (FastAPI backend)        │
│  - Vercel (Frontend if applicable) │
└────────────────────────────────────┘
```

---

## 📁 File Organization Patterns

### By Altitude

**40k (Doctrine Core):**
```
global-config/
  ├─ CTB_DOCTRINE.md
  ├─ ctb.branchmap.yaml
  ├─ scripts/
  │   ├─ ctb_enforce.sh
  │   ├─ security_lockdown.sh
  │   └─ dev_setup.sh
  └─ ...

config/
  └─ mcp_registry.json

sys/*/
  ├─ README.md (integration docs)
  ├─ manifest files
  └─ configuration
```

**20k (Business Logic):**
```
src/
  ├─ server/
  │   └─ main.py
  ├─ models.py
  └─ api/

tools/
  └─ blueprint_*.py
```

**10k (UI/UX):**
```
components/
templates/
docs/blueprints/ui/
*.html, *.css
```

**5k (Operations):**
```
scripts/
reports/
automation/
```

---

## 🔍 Component Responsibilities

### Composio MCP Server

**Port:** 3001

**Responsibilities:**
- Tool registry management
- MCP vault (secret storage)
- Integration orchestration
- HEIR/ORBT payload validation
- Audit logging

**Key Endpoints:**
- `POST /tool` - Execute MCP tool
- `POST /vault/set` - Store secret
- `GET /vault/get` - Retrieve secret
- `GET /mcp/health` - Health check

---

### CTB Enforcement System

**Script:** `global-config/scripts/ctb_enforce.sh`

**Responsibilities:**
- Validate all 4 mandatory branches exist
- Check MCP registry for doctrine IDs 04.04.07-10
- Verify branch content (not empty)
- Optional: Port health checks
- Log enforcement status

**Failure Actions:**
- Block builds/deploys
- Reject merge requests
- Tag commits with status
- Log to Firebase

---

### Security Lockdown System

**Script:** `global-config/scripts/security_lockdown.sh`

**Responsibilities:**
- Scan for forbidden .env files
- Detect hardcoded secrets
- Validate MCP variable usage
- Audit logging to Firebase

**Enforcement:**
- Zero tolerance policy
- No overrides allowed
- Permanent audit trail

---

## 🎯 Key Design Principles

1. **Altitude-Based Separation:**
   - Higher altitudes = more stable
   - Lower altitudes = higher velocity
   - Merge flows always upward

2. **MCP-First Integration:**
   - All external tools via MCP
   - Standardized HEIR/ORBT payloads
   - Central vault for secrets

3. **Zero-Tolerance Security:**
   - No local secrets ever
   - Runtime injection only
   - Comprehensive scanning

4. **Enforcement Automation:**
   - CTB compliance on every push
   - Security scans on every PR
   - Fail fast, fail loud

5. **Developer Experience:**
   - One-command setup
   - Clear error messages
   - Self-service documentation
   - Dev containers for consistency

---

## 📚 Related Documentation

- **CTB Doctrine:** `global-config/CTB_DOCTRINE.md`
- **Troubleshooting:** `docs/TROUBLESHOOTING.md`
- **Integration Docs:**
  - `chartdb/README.md`
  - `activepieces/README.md`
  - `windmill/README.md`
  - `sys/claude-skills/README.md`
- **MCP Registry:** `config/mcp_registry.json`
- **Branch Map:** `global-config/ctb.branchmap.yaml`

---

**Last Updated:** 2025-10-18
**CTB Version:** 1.3.2
**Status:** Production Ready
