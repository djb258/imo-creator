# CTB Auto-Update System

**Version**: 1.3.1
**Purpose**: Automatically sync and EXECUTE CTB updates from IMO-Creator

## Overview

The CTB Auto-Update System ensures child repositories **automatically receive AND RUN** updates from IMO-Creator. This system doesn't just copy files - it **executes** them in your repo.

## What Gets Executed

When updates are applied, the system:

1. ✅ **Copies files** - Downloads latest CTB structures
2. ✅ **Installs dependencies** - Runs `npm install` if `package.json` changed
3. ✅ **Runs health checks** - Executes `manual/scripts/status_check.ts`
4. ✅ **Validates doctrine** - Runs `global-config/scripts/ctb_enforce.sh`
5. ✅ **Rebuilds TypeScript** - Compiles with `tsc`
6. ✅ **Runs tests** - Executes `npm test` to verify nothing broke

## Two Ways to Update

### Option 1: Automatic (Recommended)

**GitHub Action runs daily** and automatically syncs updates.

**Setup**: The workflow is already included in `.github/workflows/auto_ctb_sync.yml`

**How it works**:
- Checks IMO-Creator every day at 3 AM UTC
- If updates available, downloads and EXECUTES them
- Creates a PR for review (or pushes directly to `main`)
- Runs all validation and tests

**No manual action needed** - updates happen automatically!

### Option 2: Manual

Run the update script whenever you want:

```bash
bash scripts/ctb_auto_update.sh
```

**What happens**:
```
[1/7] Verifying CTB repository...
[2/7] Creating backup...
[3/7] Fetching latest CTB from IMO-Creator...
[4/7] Applying CTB updates...
[5/7] Executing CTB updates...          ← ACTUALLY RUNS THE CODE
      - Running npm install
      - Running CTB health check
      - Validating doctrine compliance
      - Rebuilding TypeScript
      - Running tests
[6/7] Cleaning up...
[7/7] Update Summary
```

## What Makes This Different?

### ❌ Old Way (Just Copy Files)
```bash
# Download files
cp -r imo-creator/ctb-template/* ./

# Files sit there... nothing happens
# User has to manually run everything
```

### ✅ New Way (Copy AND Execute)
```bash
# Download AND run
bash scripts/ctb_auto_update.sh

# Automatically:
✓ Installs dependencies
✓ Runs health checks
✓ Validates compliance
✓ Rebuilds code
✓ Runs tests
```

## Execution Details

### Step-by-Step Execution

When `[5/7] Executing CTB updates...` runs:

1. **Dependency Installation**
   ```bash
   npm install  # If package.json changed
   ```

2. **Health Check**
   ```bash
   ts-node manual/scripts/status_check.ts
   ```
   - Checks AI_ENGINE, WORKBENCH_DB, VAULT_DB, INTEGRATION_BRIDGE
   - Updates `manual/troubleshooting/system_diagnostics.json`

3. **Doctrine Validation**
   ```bash
   bash global-config/scripts/ctb_enforce.sh
   ```
   - Verifies CTB branches exist
   - Checks MCP tools registered
   - Validates Barton policy

4. **Post-Update Script** (if exists)
   ```bash
   bash scripts/post_ctb_update.sh
   ```
   - Your custom post-update logic

5. **TypeScript Rebuild**
   ```bash
   tsc --noEmit
   ```
   - Verifies TypeScript compiles

6. **Test Suite**
   ```bash
   npm test
   ```
   - Ensures updates didn't break anything

## GitHub Action Configuration

The automated workflow (`.github/workflows/auto_ctb_sync.yml`) has two modes:

### Mode 1: Auto-Push (Default)

Updates are automatically committed and pushed to `main`:

```yaml
- name: Commit and push updates
  run: |
    git add -A
    git commit -m "🔄 Auto-Sync: CTB Update"
    git push origin HEAD
```

### Mode 2: Create PR (Optional)

Updates create a PR for review:

```yaml
- name: Create PR instead of direct push
  uses: peter-evans/create-pull-request@v5
```

**To enable PR mode**: Uncomment the PR step in the workflow.

## Safety Features

### Automatic Backup

Before any changes:
```
.ctb-backup-20251023-143052/
├── ctb-template/
└── .github/workflows/
```

**Rollback if needed**:
```bash
cp -r .ctb-backup-*/ctb-template ./ctb-template
```

### Validation Checks

Before finalizing:
- ✅ Version comparison (only update if newer)
- ✅ Test suite runs (catch breaking changes)
- ✅ TypeScript compilation (catch type errors)
- ✅ Health checks (ensure system operational)

## Customization

### Add Custom Post-Update Logic

Create `scripts/post_ctb_update.sh`:

```bash
#!/bin/bash

echo "Running custom post-update tasks..."

# Example: Restart services
docker-compose restart

# Example: Run migrations
npm run migrate

# Example: Clear caches
rm -rf .cache/*

echo "✅ Custom post-update complete"
```

**The auto-update script will detect and run it automatically.**

## Troubleshooting

### Updates not running

**Check**:
1. Is `.github/workflows/auto_ctb_sync.yml` present?
2. Are GitHub Actions enabled?
3. Check Actions tab for errors

### Execution steps failing

**Individual step failures**:
- `npm install failed` → Check `package.json` syntax
- `health check warnings` → Review `logs/` directory
- `tests failed` → Run `npm test` locally
- `TypeScript errors` → Run `tsc` locally

### Rollback to previous version

```bash
# Find backup
ls -la .ctb-backup-*

# Restore
cp -r .ctb-backup-20251023-143052/ctb-template ./ctb-template

# Commit rollback
git add ctb-template
git commit -m "⏪ Rollback: CTB update"
```

## Manual Override

Disable auto-sync temporarily:

**Option 1**: Rename workflow
```bash
mv .github/workflows/auto_ctb_sync.yml .github/workflows/auto_ctb_sync.yml.disabled
```

**Option 2**: Skip schedule
```yaml
on:
  # schedule:  # Commented out
  workflow_dispatch:  # Manual only
```

## Version Check

Check current CTB version:

```bash
cat ctb-template/version.json
```

Check IMO-Creator latest version:

```bash
curl -s https://raw.githubusercontent.com/djb258/imo-creator/master/ctb-template/version.json | grep ctb_version
```

## Summary

### What Happens Automatically

1. **Daily Check** (3 AM UTC) - GitHub Action checks for updates
2. **Download** - Fetches latest CTB from IMO-Creator
3. **Copy** - Updates `manual/`, `drivers/`, `viewer-api/`, workflows
4. **EXECUTE** - Runs npm install, health checks, tests, builds
5. **Commit** - Pushes changes (or creates PR)
6. **Validate** - Ensures everything works

### Key Point

**This is NOT just file sync** - it's full execution:
- Dependencies installed
- Scripts run
- Code compiled
- Tests executed
- System validated

**Result**: IMO-Creator updates are automatically applied AND running in your repo.

---

**CTB Auto-Update** - Copy + Execute, not just copy ✨
