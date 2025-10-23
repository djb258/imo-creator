# 🌐 Global CTB Doctrine Propagation System

## Executive Summary

This document defines the **Global CTB Doctrine Propagation System** that automatically applies the Christmas Tree Backbone structure and UI Doctrine to all Barton Enterprises repositories—current and future.

**Key Concept**: IMO-Creator serves as the **FACTORY ROOT**, and all changes propagate automatically to child repositories through the "update from imo-creator" command.

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│   IMO-Creator (FACTORY ROOT / SOURCE)      │
│   - Defines CTB branch structure            │
│   - Contains global-config/                 │
│   - Contains doctrine/                      │
│   - Contains ui/figma-bolt/ templates       │
└──────────────────┬──────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │  Propagation Via  │
         │ "update from imo" │
         └─────────┬─────────┘
                   │
      ┌────────────┼────────────┐
      ▼            ▼            ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ outreach │ │  sales   │ │  client  │
│   -core  │ │ -process │ │  -hive-* │
│  (CHILD) │ │  (CHILD) │ │  (CHILD) │
└──────────┘ └──────────┘ └──────────┘
```

---

## Component Hierarchy

### 1. IMO-Creator (FACTORY ROOT)

**Location**: `https://github.com/djb258/imo-creator`

**Contains**:
```
imo-creator/
├── global-config/                    ← CTB configuration (SOURCE OF TRUTH)
│   ├── ctb.branchmap.yaml
│   ├── CTB_DOCTRINE.md
│   ├── QUICK_REFERENCE.md
│   ├── branch_protection_config.json
│   └── scripts/
│       ├── ctb_init.sh
│       ├── ctb_verify.sh
│       ├── ctb_scaffold_new_repo.sh
│       └── update_from_imo_creator.sh
│
├── doctrine/                         ← Global doctrine files
│   ├── CTB_UI_DOCTRINE.md
│   ├── GLOBAL_PROPAGATION_SYSTEM.md  (this file)
│   └── templates/
│       ├── figma-bolt/
│       └── automation/
│
├── .github/workflows/                ← Workflow templates
│   ├── doctrine_sync.yml
│   ├── ctb_health.yml
│   └── audit.yml
│
└── CLAUDE_COMMANDS.md                ← User-facing commands
```

**Role**: Defines all CTB standards, serves as sync source

### 2. Child Repositories (IMPORT)

**Examples**: outreach-core, sales-process-imo, client-hive-*, realestate-hive

**Receives from IMO-Creator**:
- All `global-config/` files
- All `doctrine/` files
- All `.github/workflows/` files
- 15 CTB branches created automatically

**Command**: `"update from imo-creator"`

---

## Propagation Methods

### Method 1: Manual Command (Per Repository)

User navigates to any repository and says:

```
"update from imo-creator"
```

**What Happens**:
1. `update_from_imo_creator.sh` runs
2. Locates IMO-Creator SOURCE
3. Copies all doctrine and configuration files
4. Creates missing CTB branches
5. Verifies compliance
6. Commits and tags

**Use Case**: One-time setup or periodic updates

---

### Method 2: GitHub Action (Automatic)

**Trigger**: On push to `main` or weekly schedule

**Workflow**: `.github/workflows/doctrine_sync.yml`

```yaml
name: Auto-Sync from IMO-Creator

on:
  schedule:
    - cron: '0 2 * * 0'  # Weekly Sunday 2 AM
  workflow_dispatch:      # Manual trigger

jobs:
  sync-doctrine:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Clone IMO-Creator SOURCE
        run: |
          git clone https://github.com/djb258/imo-creator.git /tmp/imo-creator

      - name: Run CTB Update
        run: |
          bash /tmp/imo-creator/global-config/scripts/update_from_imo_creator.sh /tmp/imo-creator

      - name: Commit Changes
        run: |
          git config user.name "CTB Doctrine Bot"
          git config user.email "doctrine@barton-enterprises.com"
          git add .
          git commit -m "🔁 Auto-sync from IMO-Creator SOURCE" || echo "No changes"
          git push
```

**Use Case**: Keeps all repositories automatically synchronized

---

### Method 3: Organization-Wide Script

**For applying to multiple repositories at once**:

```bash
#!/bin/bash
# apply-ctb-to-org.sh

ORG="barton-enterprises"
REPOS=$(gh repo list $ORG --json name -q '.[].name')

for repo in $REPOS; do
  echo "Processing: $repo"

  # Clone repo
  git clone "https://github.com/$ORG/$repo.git" "/tmp/$repo"
  cd "/tmp/$repo"

  # Run update
  bash /path/to/imo-creator/global-config/scripts/update_from_imo_creator.sh /path/to/imo-creator

  # Push changes
  git push --all origin
  git push --tags

  cd -
done
```

**Use Case**: Initial rollout to entire organization

---

## File Propagation Matrix

| File | Source (IMO-Creator) | Destination (Child Repos) | Frequency |
|------|---------------------|----------------------------|-----------|
| `ctb.branchmap.yaml` | `global-config/` | `global-config/` | Every sync |
| `CTB_DOCTRINE.md` | `global-config/` | `global-config/` | Every sync |
| `QUICK_REFERENCE.md` | `global-config/` | `global-config/` | Every sync |
| `update_from_imo_creator.sh` | `global-config/scripts/` | `global-config/scripts/` | Every sync |
| `ctb_init.sh` | `global-config/scripts/` | `global-config/scripts/` | Every sync |
| `ctb_verify.sh` | `global-config/scripts/` | `global-config/scripts/` | Every sync |
| `doctrine_sync.yml` | `.github/workflows/` | `.github/workflows/` | Every sync |
| `ctb_health.yml` | `.github/workflows/` | `.github/workflows/` | Every sync |
| `audit.yml` | `.github/workflows/` | `.github/workflows/` | Every sync |
| `CTB_UI_DOCTRINE.md` | `doctrine/` | `doctrine/` | Every sync |
| Figma templates | `ui/figma-bolt/` | `ui/figma-bolt/` | Every sync |

---

## Branch Creation Logic

### Automatic Branch Creation

When `update_from_imo_creator.sh` runs, it creates these 15 branches if missing:

**40k Altitude (8 branches)**:
1. `doctrine/get-ingest`
2. `sys/composio-mcp`
3. `sys/neon-vault`
4. `sys/firebase-workbench`
5. `sys/bigquery-warehouse`
6. `sys/github-factory`
7. `sys/builder-bridge`
8. `sys/security-audit`

**20k Altitude (3 branches)**:
9. `imo/input`
10. `imo/middle`
11. `imo/output`

**10k Altitude (2 branches)**:
12. `ui/figma-bolt`
13. `ui/builder-templates`

**5k Altitude (2 branches)**:
14. `ops/automation-scripts`
15. `ops/report-builder`

### Branch Creation Process

```bash
for branch in "${CTB_BRANCHES[@]}"; do
  if ! git show-ref --verify --quiet "refs/heads/$branch"; then
    git checkout -b "$branch" main
    echo "altitude: $altitude" > .ctb-metadata
    git add .ctb-metadata
    git commit -m "🌲 Initialize CTB branch: $branch"
    git push -u origin "$branch"
  fi
done
```

---

## Versioning and Tags

### Tag Strategy

Every sync creates a timestamped tag:

```
ctb-sync-YYYYMMDD-HHMMSS

Examples:
- ctb-sync-20251009-143022
- ctb-sync-20251016-020000
```

### Version Tracking

Track which version of IMO-Creator was used for sync:

```yaml
# In ctb.branchmap.yaml
meta:
  version: 1.0
  doctrine_source: https://github.com/djb258/imo-creator
  last_synced: "2025-10-09T14:30:22Z"
  synced_from_commit: "d1f91190"
  synced_by: "Claude-Code"
```

---

## Organization-Wide Policies

### 1. New Repository Creation

**Policy**: All new repositories MUST run CTB sync on first commit

**Implementation**:
```yaml
# .github/workflows/first-commit-ctb.yml
name: CTB Initialization

on:
  push:
    branches:
      - main
      - master

jobs:
  initialize-ctb:
    if: github.run_number == 1
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Initialize CTB
        run: |
          curl -o /tmp/update.sh https://raw.githubusercontent.com/djb258/imo-creator/master/global-config/scripts/update_from_imo_creator.sh
          bash /tmp/update.sh https://github.com/djb258/imo-creator
          git push --all origin
          git push --tags
```

### 2. Weekly Sync

**Policy**: All repositories sync from IMO-Creator weekly

**Implementation**: Enabled via `doctrine_sync.yml` workflow

### 3. Manual Sync Anytime

**Policy**: Users can trigger sync anytime with: `"update from imo-creator"`

---

## Compliance Monitoring

### Health Checks

**Script**: `ctb_verify.sh`

**Checks**:
- ✅ All 15 CTB branches present
- ✅ Required files exist
- ✅ Branch metadata valid
- ✅ Last sync within 30 days

**Report Format**:
```
✅ CTB structure is fully compliant!
Present branches: 15/15
Missing branches: 0
Missing files: 0
Last sync: 2025-10-09 (3 days ago)
```

### Dashboard (Future)

Track compliance across all repositories:

```
Repository Dashboard:
┌─────────────────┬──────────┬───────────┬─────────────┐
│ Repository      │ Status   │ Branches  │ Last Sync   │
├─────────────────┼──────────┼───────────┼─────────────┤
│ imo-creator     │ ✅ SOURCE│ 19/19     │ N/A         │
│ outreach-core   │ ✅ SYNC  │ 15/15     │ 2 days ago  │
│ sales-process   │ ✅ SYNC  │ 15/15     │ 1 week ago  │
│ client-hive-abc │ ⚠️  DRIFT │ 12/15     │ 45 days ago │
│ realestate-hive │ ✅ SYNC  │ 15/15     │ 3 days ago  │
└─────────────────┴──────────┴───────────┴─────────────┘
```

---

## Troubleshooting

### Issue: "Cannot find IMO-Creator SOURCE"

**Solution**: Specify path manually
```bash
bash global-config/scripts/update_from_imo_creator.sh /path/to/imo-creator
```

### Issue: Branch creation fails

**Solution**: Check permissions and re-run init
```bash
bash global-config/scripts/ctb_init.sh --force
```

### Issue: Merge conflicts during sync

**Solution**: Stash local changes before sync
```bash
git stash
bash global-config/scripts/update_from_imo_creator.sh
git stash pop
```

---

## Rollback Procedure

### If a sync causes issues:

```bash
# 1. Find last good tag
git tag | grep ctb-sync | tail -2

# 2. Rollback to previous sync
git reset --hard ctb-sync-20251002-143022

# 3. Force push (DANGEROUS - use with caution)
git push --force origin main

# 4. Recreate branches
bash global-config/scripts/ctb_init.sh
```

---

## Future Enhancements

### Phase 2: Barton-Doctrine Repository

Create dedicated `barton-doctrine` repository:
```
barton-doctrine/
├── global-config/     ← Master configuration
├── doctrine/          ← All doctrine files
├── templates/         ← Repo templates
└── scripts/
    └── sync-all.sh    ← Sync entire organization
```

### Phase 3: Web Dashboard

Build monitoring dashboard:
- View all repository compliance
- Trigger syncs from UI
- View sync history
- Generate compliance reports

### Phase 4: Automated Testing

Before each sync:
- Run CTB health checks
- Verify branch structure
- Test workflows
- Generate diff report

---

## Summary

The Global CTB Doctrine Propagation System ensures:

1. ✅ **IMO-Creator is the single source of truth**
2. ✅ **One command updates any repository**: `"update from imo-creator"`
3. ✅ **Automatic branch creation** (15 CTB branches)
4. ✅ **Automatic file synchronization** (doctrine + config)
5. ✅ **Versioning and tagging** for audit trail
6. ✅ **Compliance verification** built-in
7. ✅ **Works for existing and future repositories**

---

**🌐 One source, infinite repositories. Structure through propagation.**

**Last Updated**: 2025-10-09
**Version**: 1.0
**Maintained By**: Barton Enterprises Repository Architect
