<!--

# CTB Metadata
# Generated: 2025-10-23T14:32:39.655589
# CTB Version: 1.3.3
# Division: Documentation
# Category: global-config
# Compliance: 75%
# HEIR ID: HEIR-2025-10-DOC-GLOBAL-01

-->

# 🚀 IMO-Creator CTB Doctrine - Quick Reference

## One-Command Usage

### **Update Any Repository from IMO-Creator**

Just say to Claude Code:

```
"update from imo-creator"
```

That's it! The system automatically:
- ✅ Syncs all CTB configuration files
- ✅ Creates/verifies all 15 CTB branches
- ✅ Runs compliance verification
- ✅ Commits changes with doctrine signature
- ✅ Tags the update

---

## Manual Command (If Needed)

If you need to run it manually:

```bash
# From any [ORGANIZATION] repository
bash global-config/scripts/update_from_imo_creator.sh

# Or specify IMO-Creator location
bash global-config/scripts/update_from_imo_creator.sh /path/to/imo-creator
```

---

## What Happens Automatically

### When you say "update from imo-creator":

**1. Detection Phase**
- Detects if you're in IMO-Creator (SOURCE) or another repo
- Locates IMO-Creator SOURCE repository automatically

**2. Sync Phase**
- Copies latest `global-config/ctb.branchmap.yaml`
- Copies latest `global-config/CTB_DOCTRINE.md`
- Copies all scripts (ctb_init.sh, ctb_verify.sh, etc.)
- Copies GitHub Actions workflows
- **Syncs `libs/imo_tools/**` (modular toolbox with all new tools)**

**3. Branch Creation Phase**
- Creates any missing CTB branches:
  - 40k altitude: 8 system branches
  - 20k altitude: 3 business logic branches
  - 10k altitude: 2 UI branches
  - 5k altitude: 2 operations branches

**4. Verification Phase**
- Runs `ctb_verify.sh`
- Confirms 15/15 branches present
- Validates all required files exist

**5. Commit Phase**
- Commits all changes with standard message
- Tags with timestamp: `ctb-sync-YYYYMMDD-HHMMSS`

---

## Example Workflows

### **Update an Existing Repo**

```bash
# 1. Open the repo in Claude Code
cd /path/to/outreach-core

# 2. Say to Claude:
"update from imo-creator"

# 3. Review the changes
git log -1

# 4. Push
git push --all origin && git push --tags
```

### **Apply CTB to a Brand New Repo**

```bash
# 1. Create and clone new repo
git clone https://github.com/[ORGANIZATION]/[NEW_PROJECT].git
cd new-project

# 2. Say to Claude:
"update from imo-creator"

# 3. Push everything
git push --all origin && git push --tags
```

---

## Common Locations

The update script automatically searches for IMO-Creator in:
- `../imo-creator`
- `../../imo-creator`
- `~/Desktop/Cursor Builds/imo-creator`
- `/c/Users/CUSTOM PC/Desktop/Cursor Builds/imo-creator`

If not found, you can specify the path:
```bash
bash global-config/scripts/update_from_imo_creator.sh /custom/path/to/imo-creator
```

---

## What Gets Synced

| File/Folder | Purpose |
|-------------|---------|
| `global-config/ctb.branchmap.yaml` | Branch hierarchy definition |
| `global-config/CTB_DOCTRINE.md` | Complete documentation |
| `global-config/branch_protection_config.json` | GitHub protection rules |
| `global-config/scripts/*.sh` | All CTB management scripts |
| `.github/workflows/doctrine_sync.yml` | Nightly doctrine sync |
| `.github/workflows/ctb_health.yml` | Weekly health checks |
| `.github/workflows/audit.yml` | HEIR compliance validation |

---

## Troubleshooting

### **"Cannot find IMO-Creator SOURCE repository"**

Solution 1: Specify the path
```bash
bash global-config/scripts/update_from_imo_creator.sh /path/to/imo-creator
```

Solution 2: Clone IMO-Creator to a known location
```bash
cd ~/Desktop/Cursor\ Builds/
git clone https://github.com/[OWNER]/imo-creator.git
```

### **"You are in the IMO-Creator SOURCE repository"**

This means you're already in the SOURCE repo. No update needed.

To update another repo, navigate to that repo first:
```bash
cd /path/to/other-repo
bash /path/to/imo-creator/global-config/scripts/update_from_imo_creator.sh
```

### **Missing Branches**

The script automatically creates missing branches. If issues persist:
```bash
bash global-config/scripts/ctb_init.sh
bash global-config/scripts/ctb_verify.sh
```

---

## For Claude Code Users

### Simple Commands You Can Say:

| What You Say | What Happens |
|--------------|--------------|
| "update from imo-creator" | Full CTB sync and branch creation |
| "verify ctb structure" | Runs ctb_verify.sh |
| "check ctb compliance" | Verification + detailed report |
| "apply ctb doctrine" | Same as "update from imo-creator" |

---

## Branch Structure Reference

```
🌲 CTB Doctrine Branch Tree

40k (Doctrine Core):
  ├── main
  ├── doctrine/get-ingest
  └── sys/
      ├── composio-mcp
      ├── neon-vault
      ├── firebase-workbench
      ├── bigquery-warehouse
      ├── github-factory
      ├── builder-bridge
      └── security-audit

20k (Business Logic):
  └── imo/
      ├── input
      ├── middle
      └── output

10k (UI/UX):
  └── ui/
      ├── figma-bolt
      └── builder-templates

5k (Operations):
  └── ops/
      ├── automation-scripts
      └── report-builder
```

---

## Quick Commands Cheat Sheet

```bash
# Update from SOURCE
bash global-config/scripts/update_from_imo_creator.sh

# Verify compliance
bash global-config/scripts/ctb_verify.sh

# Initialize CTB (creates branches)
bash global-config/scripts/ctb_init.sh

# Apply to new repo
bash /path/to/imo-creator/global-config/scripts/ctb_scaffold_new_repo.sh .

# List all CTB branches
git branch | grep -E '(doctrine|sys|imo|ui|ops)/'

# Count CTB branches (should be 15)
git branch | grep -E '(doctrine|sys|imo|ui|ops)/' | wc -l

# Push everything
git push --all origin && git push --tags
```

---

## Support

- **Full Documentation**: `global-config/CTB_DOCTRINE.md`
- **Branch Map**: `global-config/ctb.branchmap.yaml`
- **Implementation Report**: `CTB_IMPLEMENTATION_REPORT.md` (in IMO-Creator only)

---

**🌲 Remember: Just say "update from imo-creator" - that's all you need!**
