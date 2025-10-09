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

</details>

<details>
<summary><strong>imo/output</strong> - Dashboards</summary>

- `docs/blueprints/**`
- `index.html`
- Export generators

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
