# 🌲 CTB (Christmas Tree Backbone) Doctrine

## 🚀 Quick Start - One Simple Command

To update any repository with the latest CTB structure, just say to Claude Code:

```
"update from imo-creator"
```

That's it! The system automatically syncs all configuration, creates branches, and verifies compliance.

**📖 For more details, see**: `QUICK_REFERENCE.md` and `CLAUDE_COMMANDS.md`

---

## Overview

The **Christmas Tree Backbone (CTB) Doctrine** is Barton Enterprises' organizational framework for managing code repositories through a hierarchical branch structure that mirrors altitude-based development philosophy.

**Core Principle**: Like a Christmas tree, the main branch is the trunk (immutable doctrine), system branches are major limbs, business logic forms mid-branches, UI components are upper branches, and operations are the ornaments.

---

## Philosophy

### The Christmas Tree Analogy

```
                    ⭐ (Operations - 5k)
                   /|\
                  / | \
                 /  |  \   (UI Layer - 10k)
                /   |   \
               /    |    \
              /     |     \  (Business Logic - 20k)
             /      |      \
            /       |       \
           /________|________\  (System Infrastructure - 40k)
                   |||
                   |||  (Main Trunk - Doctrine Core)
                   |||
```

### Altitude Levels

- **40k ft (Doctrine Core)**: Immutable truths, global standards, system infrastructure
- **20k ft (Business Logic)**: IMO Factory processes - input, middle, output
- **10k ft (UI/UX)**: User-facing components and visual systems
- **5k ft (Operations)**: Automation scripts, reporting, operational tooling

### Merge Flow Direction

Changes flow **upward** like sap in a tree:

```
Operations (5k) → UI (10k) → Business (20k) → Systems (40k) → Main (Trunk)
```

---

## Branch Structure

### 40k Altitude: Doctrine Core (8 branches)

Immutable infrastructure and global standards.

| Branch | Purpose | Protection |
|--------|---------|-----------|
| `main` | Trunk - production-ready code | Strict (2 reviews) |
| `doctrine/get-ingest` | Global manifests, HEIR schema | Moderate (1 review) |
| `sys/composio-mcp` | MCP registry, tool integrations | Moderate (1 review) |
| `sys/neon-vault` | PostgreSQL schemas, migrations | Moderate (1 review) |
| `sys/firebase-workbench` | Firestore structures, security | Moderate (1 review) |
| `sys/bigquery-warehouse` | Analytics, data warehouse | Moderate (1 review) |
| `sys/github-factory` | CI/CD templates, automation | Moderate (1 review) |
| `sys/builder-bridge` | Builder.io, Figma connectors | Moderate (1 review) |
| `sys/security-audit` | Compliance, key rotation | Moderate (1 review) |

### 20k Altitude: Business Logic (3 branches)

IMO Factory business process engine.

| Branch | Purpose | Protection |
|--------|---------|-----------|
| `imo/input` | Data intake, scraping, enrichment | Light |
| `imo/middle` | Calculators, compliance logic | Light |
| `imo/output` | Dashboards, exports, visualizations | Light |

### 10k Altitude: UI/UX (2 branches)

User interface components and design systems.

| Branch | Purpose | Protection |
|--------|---------|-----------|
| `ui/figma-bolt` | Figma + Bolt UI components | Light |
| `ui/builder-templates` | Builder.io reusable modules | Light |

### 5k Altitude: Operations (2 branches)

Automation and operational tooling.

| Branch | Purpose | Protection |
|--------|---------|-----------|
| `ops/automation-scripts` | Cron jobs, CI tasks | Light |
| `ops/report-builder` | Compliance reports | Light |

---

## File Organization Guide

### By Branch

<details>
<summary><strong>doctrine/get-ingest</strong> - Global Standards</summary>

- `heir.doctrine.yaml`
- `CLAUDE.md`
- `COMPOSIO_INTEGRATION.md`
- `global-config/**`
- `*.doctrine.yaml`

</details>

<details>
<summary><strong>sys/composio-mcp</strong> - MCP Integrations</summary>

- `src/api/composio_*.py`
- `tools/million_verifier.py`
- `composio-*.yaml`
- `composio-*.json`
- `latest-composio-tools.json`

</details>

<details>
<summary><strong>sys/neon-vault</strong> - Database Schemas</summary>

- `src/server/blueprints/**`
- `packages/heir/**`
- Database migration scripts

</details>

<details>
<summary><strong>sys/firebase-workbench</strong> - Firebase Config</summary>

- `firebase_*.js`
- `firebase_*.json`
- `firebase_*.yml`
- Firestore security rules

</details>

<details>
<summary><strong>sys/bigquery-warehouse</strong> - Analytics</summary>

- `analytics/**`
- `reports/**`
- BigQuery SQL queries

</details>

<details>
<summary><strong>sys/github-factory</strong> - CI/CD</summary>

- `.github/**`
- `Makefile`
- `bootstrap-repo.cjs`
- GitHub Actions workflows

</details>

<details>
<summary><strong>sys/builder-bridge</strong> - Design Tools</summary>

- `builder/**`
- `figma/**`
- `*figma*.sh`, `*figma*.bat`, `*figma*.ps1`
- Design system connectors

</details>

<details>
<summary><strong>sys/security-audit</strong> - Security</summary>

- `.env.example`
- `VERCEL_ENVS.md`
- Security policies

</details>

<details>
<summary><strong>imo/input</strong> - Data Intake</summary>

- `garage_bay.py`
- `simple_garage_bay.py`
- `test_*.py`
- Scraping tools

</details>

<details>
<summary><strong>imo/middle</strong> - Business Logic</summary>

- `src/server/main.py`
- `src/models.py`
- `main.py`
- `tools/blueprint_*.py`
- `libs/imo_tools/**` (shared modular toolbox)

</details>

<details>
<summary><strong>imo/output</strong> - Dashboards</summary>

- `docs/blueprints/**`
- `index.html`
- `libs/imo_tools/**` (shared modular toolbox)
- Export generators

</details>

<details>
<summary><strong>libs/imo_tools</strong> - Shared Modular Toolbox</summary>

**Auto-propagated to all child repositories**

Lightweight, AI-ready tools for common IMO Factory operations:
- `base_tool.py` - Base class with logging and version tracking
- `parser_tool.py` - AI-heavy parsing for unstructured data (PDFs, text)
- `api_mapper_tool.py` - API documentation analysis and schema mapping
- `csv_mapper_tool.py` - CSV/Excel normalization and schema alignment
- `composio_client_tool.py` - (Future) Shared MCP connection wrapper

**Usage:**
```python
from libs.imo_tools import ParserTool, APIMapperTool, CSVMapperTool

parser = ParserTool(tool_name="MyParser", version="0.1.0")
result = parser.run(raw_input="unstructured data...")
```

**Update Behavior:** When you run `update from imo-creator`, all new tools are automatically synced to child repositories.

</details>

<details>
<summary><strong>ui/figma-bolt</strong> - UI Components</summary>

- `docs/blueprints/ui/**`
- `*.html`, `*.css`
- Component libraries

</details>

<details>
<summary><strong>ui/builder-templates</strong> - Templates</summary>

- `templates/**`
- `components/**`
- Reusable UI modules

</details>

<details>
<summary><strong>ops/automation-scripts</strong> - Automation</summary>

- `scripts/**`
- `tools/repo_*.py`
- `add-doctrine-headers.js`
- `check-*.cjs`

</details>

<details>
<summary><strong>ops/report-builder</strong> - Reporting</summary>

- `analyze_*.py`
- Report generation tools

</details>

---

## Usage Guide

### For New Repositories

1. **Scaffold CTB Structure**:
   ```bash
   bash global-config/scripts/ctb_scaffold_new_repo.sh /path/to/new-repo
   ```

2. **Customize heir.doctrine.yaml**:
   ```yaml
   meta:
     app_name: "your-app-name"
     repo_slug: "org/repo-name"
   ```

3. **Push All Branches**:
   ```bash
   git push --all origin
   ```

4. **Configure Branch Protection** (via GitHub UI):
   - Settings → Branches → Add rule
   - Apply protection per CTB branch map

### For Existing Repositories

1. **Initialize CTB**:
   ```bash
   cd /path/to/existing-repo

   # Copy CTB config from imo-creator
   cp -r /path/to/imo-creator/global-config .

   # Run initialization
   bash global-config/scripts/ctb_init.sh
   ```

2. **Verify Structure**:
   ```bash
   bash global-config/scripts/ctb_verify.sh
   ```

3. **Organize Files**:
   - Review `ctb.branchmap.yaml` file organization guide
   - Move files to appropriate branches
   - Commit and push

### Daily Workflow

1. **Feature Development**:
   ```bash
   # Work on operations branch
   git checkout ops/automation-scripts
   # Make changes
   git add . && git commit -m "feat: add new automation"

   # Merge upward to UI
   git checkout ui/figma-bolt
   git merge ops/automation-scripts
   ```

2. **Code Review Flow**:
   - Operations → UI: No review required
   - UI → Business: No review required
   - Business → Systems: **1 review required**
   - Systems → Main: **2 reviews required**

3. **Check Branch Health**:
   ```bash
   bash global-config/scripts/ctb_verify.sh
   ```

---

## Automation

### GitHub Actions

Three workflows maintain CTB compliance:

1. **doctrine_sync.yml**: Nightly sync of doctrine files across all branches
2. **ctb_health.yml**: Weekly verification of branch structure
3. **audit.yml**: HEIR compliance validation on every merge to main

### Scheduled Tasks

- **Nightly** (2 AM UTC): Doctrine sync
- **Weekly** (Sunday midnight): CTB health check
- **On merge to main**: Compliance audit

---

## Compliance Requirements

### All Repositories Must Have

- ✅ All 15 CTB branches created
- ✅ `global-config/ctb.branchmap.yaml` present
- ✅ `heir.doctrine.yaml` customized for repo
- ✅ `.github/workflows/doctrine_sync.yml`
- ✅ `.github/workflows/ctb_health.yml`
- ✅ `.github/workflows/audit.yml`

### Branch Protection Rules

Configure via GitHub Settings → Branches:

```yaml
main:
  required_reviews: 2
  status_checks: [doctrine_sync, compliance_audit, heir_validation]
  dismiss_stale_reviews: true
  require_code_owner_reviews: true

doctrine/*:
  required_reviews: 1
  status_checks: [doctrine_sync]

sys/*:
  required_reviews: 1
  status_checks: [compliance_audit]

imo/*, ui/*, ops/*:
  required_reviews: 0
  status_checks: []
```

---

## Repository Types

### SOURCE (Doctrine-Level)

Repositories that **define** CTB standards.

- **Examples**: `imo-creator`, `barton-doctrine`
- **Inherits from**: None
- **Provides to**: All IMPORT repos

### IMPORT (Child-Level)

Repositories that **inherit** CTB structure.

- **Examples**: `outreach-core`, `sales-process-imo`, `client-hive-*`
- **Inherits from**: `imo-creator`
- **Provides to**: None

---

## CTB Doctrine Enforcement

### Mandatory External Repository Integration

**CRITICAL**: All repositories following the Barton CTB Doctrine MUST include the following external repository integrations:

| Branch | Repository | Doctrine ID | Status |
|--------|-----------|-------------|--------|
| `sys/chartdb` | github.com/djb258/chartdb | 04.04.07 | **REQUIRED** |
| `sys/activepieces` | github.com/djb258/activepieces | 04.04.08 | **REQUIRED** |
| `sys/windmill` | github.com/djb258/windmill | 04.04.09 | **REQUIRED** |
| `sys/claude-skills` | Anthropic via Composio MCP | 04.04.10 | **REQUIRED** |

### Enforcement Actions

The CTB enforcement system performs the following checks on every repo creation, update, or sync:

1. **Branch Presence Check**
   - Verifies all 4 required branches exist
   - Validates branches contain actual code (not empty)
   - Minimum 2 files per sys/claude-skills branch (claude.skills.md, claude.manifest.json)

2. **MCP Registration Check**
   - Confirms all tools are registered in `config/mcp_registry.json`
   - Validates correct doctrine IDs are assigned (04.04.07–10)
   - Ensures endpoints are configured
   - Verifies Anthropic_Claude_Skills uses `composio://anthropic` endpoint

3. **Port Health Check** (optional in standard mode)
   - ChartDB → localhost:5173
   - Activepieces → localhost:80
   - Windmill → localhost:8000
   - Anthropic_Claude_Skills → Global Composio endpoint (no local port)

4. **Configuration Validation**
   - Verifies `global-config/ctb.branchmap.yaml` includes all branches
   - Checks CTB_DOCTRINE.md is present and current
   - Validates Anthropic is registered in Composio: `composio tools list | grep Anthropic`

### Running Enforcement Checks

**Manual Enforcement:**
```bash
# Standard mode (recommended)
bash global-config/scripts/ctb_enforce.sh

# Strict mode (requires all ports healthy)
bash global-config/scripts/ctb_enforce.sh --strict
```

**Automated Enforcement:**
- Runs automatically on every push via GitHub Actions
- Blocks merges if enforcement fails
- Tags compliant commits with `[CTB_DOCTRINE_VERIFIED]`

### Enforcement Logging

All enforcement checks are logged to:
- **Local**: `logs/ctb_enforcement.log`
- **Firebase**: `ctb_enforcement_log` collection (if configured)

Log format:
```json
{
  "timestamp": "2025-10-18T00:00:00Z",
  "repo_id": "repository-name",
  "enforcement_mode": "STANDARD",
  "status": "PASSED",
  "checks": {
    "branches": {
      "required": 3,
      "missing": 0,
      "empty": 0
    },
    "mcp_tools": {
      "required": 3,
      "missing": 0
    },
    "ports": {
      "checked": 3,
      "unhealthy": 0
    }
  }
}
```

### Failure Policy

**If enforcement fails:**
1. ❌ Build and deploy pipelines are **BLOCKED**
2. ❌ Merge requests are **REJECTED**
3. ❌ Status returns `CTB_ENFORCEMENT_FAILURE`
4. 📊 Diagnostic output shows missing components

**Remediation:**
```bash
# Option 1: Run initialization
bash global-config/scripts/ctb_init.sh

# Option 2: Update from IMO-Creator
# (if in a different repo)
bash global-config/scripts/update_from_imo_creator.sh

# Option 3: Manually integrate missing repos
git checkout sys/chartdb
git clone https://github.com/djb258/chartdb.git
# ... (repeat for other repos)

# Verify fix
bash global-config/scripts/ctb_enforce.sh
```

### Enforcement Exemptions

**None.** All CTB repositories MUST comply. No exemptions are granted.

If a repository cannot support these integrations due to technical constraints, it should not use the CTB Doctrine scaffold.

---

## Security & Secret Handling Lockdown

### Zero-Tolerance Security Policy

**CRITICAL**: All Barton systems run under Composio MCP vault. Local `.env` files are **STRICTLY FORBIDDEN**.

| Policy | Status |
|--------|--------|
| Local .env files | ❌ **FORBIDDEN** |
| Hardcoded secrets | ❌ **FORBIDDEN** |
| MCP vault usage | ✅ **REQUIRED** |
| Runtime injection | ✅ **REQUIRED** |

### Security Enforcement Actions

The security lockdown system performs the following checks before any build or deploy:

1. **File Scanning**
   - Scans for `.env`, `.env.local`, `.env.*` files
   - Checks for `credentials.json`, `service-account.json`
   - Detects `secrets.yaml`, `vault.json`, `.secrets`
   - **Action**: Blocks build if any forbidden files found

2. **Secret Pattern Detection**
   - Scans for hardcoded API keys
   - Detects passwords in code
   - Finds authentication tokens
   - Identifies database connection strings with credentials
   - **Action**: Fails if hardcoded secrets detected

3. **MCP Vault Validation**
   - Verifies MCP configuration exists
   - Validates MCP variable usage patterns
   - Checks vault integration setup
   - **Action**: Warns if MCP not properly configured

4. **Security Audit Logging**
   - Logs all scans to `logs/security_audit.log`
   - Records violations to Firebase `security_audit_log`
   - Tags violating commits with `[SECURITY_LOCKDOWN_TRIGGERED]`
   - **Action**: Permanent audit trail

### Running Security Scans

**Manual Security Scan:**
```bash
# Run comprehensive security scan
bash global-config/scripts/security_lockdown.sh
```

**Automated Security:**
- Runs automatically on every push via GitHub Actions
- Blocks PRs with security violations
- Comments on PRs with remediation steps
- Zero tolerance - no builds proceed with violations

### Forbidden Files

The following files are **NEVER** allowed in any CTB repository:

```
❌ .env
❌ .env.local
❌ .env.development
❌ .env.production
❌ .env.staging
❌ .env.test
❌ *.env
❌ credentials.json
❌ service-account.json
❌ firebase-adminsdk*.json
❌ *-credentials.json
❌ secrets.yaml
❌ secrets.yml
❌ vault.json
❌ .secrets
```

**Exception**: `.env.example` and `.env.template` are allowed (with NO real values)

### MCP Variable Usage

**❌ FORBIDDEN:**
```typescript
// Direct environment variable access
const apiKey = process.env.API_KEY;
const dbUrl = process.env.DATABASE_URL;

// Hardcoded secrets
const secret = "sk_live_abc123def456";
```

**✅ REQUIRED:**
```typescript
import { mcp } from './mcp_vault_resolver';

// Single variable
const apiKey = await mcp.getVariable('API_KEY');

// Multiple variables
const vars = await mcp.getVariables(['API_KEY', 'DATABASE_URL']);

// Template literals
const config = await mcp.template`DB: ${MCP:DATABASE_URL}`;
```

### MCP Vault Sources

Secrets are resolved from these sources (in priority order):

1. **MCP Environment Registry** (Priority 1)
   - Composio MCP server
   - Port: 3001
   - Endpoint: `http://localhost:3001/vault/get`

2. **Doppler Vault** (Priority 2)
   - If configured
   - For sensitive production secrets

3. **Firebase Secure Variables** (Priority 3)
   - Read-only access
   - Staging/development variables

### Security Violation Examples

**Example 1: .env File Detected**
```
❌ Security violation: .env detected in repository

Remediation:
1. Remove the file: rm .env
2. Move secrets to MCP vault
3. Update code to use mcp.getVariable()
4. Re-commit and re-scan
```

**Example 2: Hardcoded API Key**
```
❌ Hardcoded secret detected in: src/config.ts

Line 15: const apiKey = "sk_live_abc123def456"

Remediation:
1. Remove hardcoded value
2. Replace with: const apiKey = await mcp.getVariable('STRIPE_SECRET_KEY')
3. Add to MCP vault: STRIPE_SECRET_KEY=sk_live_abc123def456
4. Re-scan to verify
```

### Remediation Steps

**If security scan fails:**

1. **Remove Forbidden Files**
   ```bash
   # List all .env files
   find . -name "*.env" -not -name "*.example"

   # Remove them
   git rm .env .env.local .env.production

   # Commit removal
   git commit -m "🔒 Security: Remove forbidden .env files"
   ```

2. **Move Secrets to MCP Vault**
   ```bash
   # Add secrets to MCP vault via Composio MCP server
   curl -X POST http://localhost:3001/vault/set \
     -H "Content-Type: application/json" \
     -d '{"key": "DATABASE_URL", "value": "postgres://..."}'
   ```

3. **Update Code**
   ```typescript
   // Replace all process.env references
   import { mcp } from './mcp_vault_resolver';

   // Old:
   const db = process.env.DATABASE_URL;

   // New:
   const db = await mcp.getVariable('DATABASE_URL');
   ```

4. **Re-scan**
   ```bash
   bash global-config/scripts/security_lockdown.sh
   ```

### Failure Policy

**When security violations are detected:**

1. ❌ **Builds are BLOCKED** - No Docker builds
2. ❌ **Deploys are BLOCKED** - No production deployments
3. ❌ **PRs are REJECTED** - Cannot merge to main
4. ❌ **CI/CD FAILS** - GitHub Actions fail
5. 🔒 **Commit is TAGGED** - `[SECURITY_LOCKDOWN_TRIGGERED]`
6. 📊 **Violation is LOGGED** - Firebase audit log

**No exceptions. No overrides. Zero tolerance.**

### Security Audit Log Format

```json
{
  "timestamp": "2025-10-18T00:00:00Z",
  "repo_id": "repository-name",
  "scan_type": "security_lockdown",
  "policy": "zero_tolerance",
  "violations": {
    "total": 0,
    "env_files": 0,
    "hardcoded_secrets": 0,
    "violations_list": []
  },
  "mcp_compliance": {
    "config_valid": true,
    "usage_correct": true
  },
  "status": "PASSED"
}
```

### Security Best Practices

1. ✅ **Always use MCP vault** for ALL secrets
2. ✅ **Never commit .env files** to any repository
3. ✅ **Use MCP variable resolver** in application code
4. ✅ **Run security scans** before every commit
5. ✅ **Review audit logs** regularly
6. ✅ **Rotate secrets** via MCP vault, not files
7. ✅ **Use .env.example** for documentation only

---

## Troubleshooting

### Missing Branches

```bash
# Re-run initialization
bash global-config/scripts/ctb_init.sh

# Or create specific branch manually
git checkout -b sys/composio-mcp main
git push -u origin sys/composio-mcp
```

### Verification Failures

```bash
# Run health check with details
bash global-config/scripts/ctb_verify.sh

# Check GitHub Actions logs
# Settings → Actions → Recent workflow runs
```

### Merge Conflicts

```bash
# Always merge upward (5k → 10k → 20k → 40k)
# If conflicts occur at doctrine level, review carefully

git checkout sys/composio-mcp
git merge imo/middle
# Resolve conflicts
git add . && git commit
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.3.2 | 2025-10-18 | Phase 2 Enhancements: Added dev container configuration, VS Code settings/extensions, comprehensive troubleshooting guide, architecture documentation |
| 1.3.1 | 2025-10-18 | Phase 1 Enhancements: Added testing infrastructure (pytest, GitHub Actions), integration READMEs for all sys/* branches, GitHub issue/PR templates, dev_setup.sh script |
| 1.3 | 2025-10-18 | Added mandatory AI/SHQ reasoning layer — Anthropic Claude Skills (doctrine_id 04.04.10) |
| 1.2 | 2025-10-18 | Added CTB Doctrine Enforcement System with automated checks, logging, and GitHub Actions |
| 1.1 | 2025-10-18 | Added 3 new sys branches: chartdb, activepieces, windmill (18 total branches) |
| 1.0 | 2025-10-09 | Initial CTB Doctrine implementation |

---

## Support

For questions or issues:

1. Review this documentation
2. Run `ctb_verify.sh` for diagnostic info
3. Check GitHub Actions workflow logs
4. Reference `global-config/ctb.branchmap.yaml`

---

**🌲 The CTB Doctrine: Structure is not constraint, it's liberation through organization.**
