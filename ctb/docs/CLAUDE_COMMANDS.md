# 🤖 Claude Code Commands for IMO-Creator CTB Doctrine

## Simple Commands You Can Use

### **Primary Command: Update Any Repository**

In any Barton Enterprise repository, just say:

```
update from imo-creator
```

**Aliases (all do the same thing):**
- "update from imo-creator"
- "sync from imo-creator"
- "apply ctb doctrine"
- "update ctb structure"
- "sync ctb from source"

---

## What Each Command Does

### **"update from imo-creator"**

**Runs**: `global-config/scripts/update_from_imo_creator.sh`

**Does**:
1. ✅ Automatically locates IMO-Creator SOURCE repository
2. ✅ Syncs all global-config files
3. ✅ Syncs GitHub Actions workflows
4. ✅ Creates any missing CTB branches (15 total)
5. ✅ Verifies compliance
6. ✅ Commits changes with doctrine signature
7. ✅ Tags the sync with timestamp

**Output**: Full summary report with status

---

### **"verify ctb structure"**

**Runs**: `global-config/scripts/ctb_verify.sh`

**Does**:
- Checks all 15 CTB branches exist
- Verifies required files present
- Reports compliance status

**Output**:
```
✅ CTB structure is fully compliant!
Present branches: 15/15
Missing branches: 0
Missing files: 0
```

---

### **"initialize ctb branches"**

**Runs**: `global-config/scripts/ctb_init.sh`

**Does**:
- Creates all 15 CTB branches from main
- Adds .ctb-metadata to each branch
- Reports creation status

**Use when**: First time setting up CTB in a repo

---

### **"check repository status"**

**Does**:
- Shows current branch
- Lists all CTB branches
- Shows recent commits
- Reports uncommitted changes

---

## Usage by Scenario

### **Scenario 1: I have an existing repo that needs CTB**

```
# Just say:
"update from imo-creator"

# That's it! Everything is automatic.
```

---

### **Scenario 2: I created a brand new repo**

```
# Just say:
"update from imo-creator"

# Or be more specific:
"apply ctb structure from imo-creator"
```

---

### **Scenario 3: I want to check if my repo is compliant**

```
# Just say:
"verify ctb structure"

# Or:
"check ctb compliance"
```

---

### **Scenario 4: IMO-Creator was updated, I need the latest**

```
# Just say:
"update from imo-creator"

# It automatically pulls the latest configuration
```

---

### **Scenario 5: I accidentally deleted CTB branches**

```
# Just say:
"update from imo-creator"

# It will recreate missing branches
```

---

## Command Variations (All Understood)

### Updating/Syncing

All of these work the same way:
- "update from imo-creator"
- "sync from imo-creator"
- "pull latest from imo-creator"
- "apply ctb from imo-creator"
- "get latest ctb doctrine"
- "sync ctb structure"
- "update ctb branches"

### Verifying

All of these check compliance:
- "verify ctb structure"
- "check ctb compliance"
- "verify branches"
- "check ctb status"
- "validate ctb"

### Initializing

All of these create branches:
- "initialize ctb"
- "create ctb branches"
- "set up ctb structure"
- "apply ctb doctrine"

---

## Technical Details (For Reference)

### What Gets Synced

When you say "update from imo-creator":

```
Synced Files:
├── global-config/
│   ├── ctb.branchmap.yaml              ← Branch definitions
│   ├── CTB_DOCTRINE.md                 ← Documentation
│   ├── branch_protection_config.json   ← Protection rules
│   ├── QUICK_REFERENCE.md              ← This file
│   └── scripts/
│       ├── ctb_init.sh                 ← Initialize branches
│       ├── ctb_verify.sh               ← Verify compliance
│       ├── ctb_scaffold_new_repo.sh    ← Scaffold script
│       └── update_from_imo_creator.sh  ← Update script
└── .github/workflows/
    ├── doctrine_sync.yml               ← Nightly sync
    ├── ctb_health.yml                  ← Weekly health
    └── audit.yml                       ← Compliance audit
```

### Created Branches

```
15 CTB Branches Total:

40k Altitude (8):
  - doctrine/get-ingest
  - sys/composio-mcp
  - sys/neon-vault
  - sys/firebase-workbench
  - sys/bigquery-warehouse
  - sys/github-factory
  - sys/builder-bridge
  - sys/security-audit

20k Altitude (3):
  - imo/input
  - imo/middle
  - imo/output

10k Altitude (2):
  - ui/figma-bolt
  - ui/builder-templates

5k Altitude (2):
  - ops/automation-scripts
  - ops/report-builder
```

---

## Advanced Usage (Optional)

### Manual Script Execution

If Claude Code isn't available, run manually:

```bash
# Update from IMO-Creator
bash global-config/scripts/update_from_imo_creator.sh

# Verify structure
bash global-config/scripts/ctb_verify.sh

# Initialize branches
bash global-config/scripts/ctb_init.sh

# Specify custom IMO-Creator path
bash global-config/scripts/update_from_imo_creator.sh /path/to/imo-creator
```

---

## Expected Output

### Successful Update

```
╔════════════════════════════════════════════╗
║  IMO-Creator CTB Doctrine Update          ║
║  Automatic Repository Synchronization     ║
╚════════════════════════════════════════════╝

[STEP] 1/5 Syncing global configuration files...
  ✓ ctb.branchmap.yaml
  ✓ CTB_DOCTRINE.md
  ✓ branch_protection_config.json
  ✓ All scripts copied and made executable
  ✓ GitHub Actions workflows
[SUCCESS] Configuration files synced

[STEP] 2/5 Initializing CTB branch structure...
[SUCCESS] Created branch: imo/input
[SUCCESS] Created branch: imo/middle
...

[STEP] 3/5 Verifying CTB compliance...
[SUCCESS] CTB structure verified and compliant

[STEP] 4/5 Committing CTB doctrine updates...
[SUCCESS] Changes committed and tagged: ctb-sync-20251009-143022

[STEP] 5/5 Generating update summary...

╔════════════════════════════════════════════╗
║       CTB Doctrine Update Complete        ║
╚════════════════════════════════════════════╝

Repository:     your-repo-name
Status:         ✅ Updated from IMO-Creator SOURCE
CTB Branches:   15/15
Compliance:     ✅ Verified
Timestamp:      2025-10-09 14:30:22

Next steps:
  1. Review changes: git log -1
  2. Push branches: git push --all origin
  3. Push tags: git push --tags

🌲 CTB Doctrine: Your repository is now aligned with IMO-Creator standards
```

---

## Troubleshooting

### "Cannot find IMO-Creator SOURCE repository"

Claude will automatically search common locations. If not found:

```
# Specify the path manually:
"update from imo-creator at /path/to/imo-creator"
```

### "You are in the IMO-Creator SOURCE repository"

You're already in the SOURCE! Navigate to another repo first.

### Branches Not Created

```
# Force recreation:
"initialize ctb branches"
```

---

## Remember

### **You only need one command:**

```
"update from imo-creator"
```

**That's it!** Everything else is automatic.

---

**🌲 CTB Doctrine: Structure through simplicity**

**Last Updated**: 2025-10-09
**Version**: 1.0
