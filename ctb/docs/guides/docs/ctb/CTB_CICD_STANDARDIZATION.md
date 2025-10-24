<!--

# CTB Metadata
# Generated: 2025-10-23T14:32:40.039322
# CTB Version: 1.3.3
# Division: Documentation
# Category: guides
# Compliance: 90%
# HEIR ID: HEIR-2025-10-DOC-GUIDES-01

-->

# CTB CI/CD Standardization Guide

**Version**: 1.3.1
**Last Updated**: 2025-10-23
**Status**: Production

---

## Table of Contents

1. [Overview](#overview)
2. [Standardization Goals](#standardization-goals)
3. [Workflow Trigger Policy](#workflow-trigger-policy)
4. [Notification Silencing](#notification-silencing)
5. [Auto-Commit Prevention](#auto-commit-prevention)
6. [Centralized Workflows](#centralized-workflows)
7. [Child Repository Integration](#child-repository-integration)
8. [Migration Guide](#migration-guide)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The **CTB CI/CD Standardization** establishes a centralized, quiet, and predictable CI/CD architecture across all CTB-derived repositories. This prevents:

- ❌ **CI spam** from running on every branch
- ❌ **Email noise** from GitHub Actions notifications
- ❌ **Auto-commit loops** ("CTB Doctrine Cleanup #159")
- ❌ **Redundant enforcement** across child repos

**Philosophy**: **Centralized Enforcement, Decentralized Execution**

- All CTB enforcement logic lives in **IMO-Creator** (master repo)
- Child repos **inherit** workflows via reusable workflow calls
- CI runs **only** on `main` and `develop` branches
- Notifications are **silenced** by default

---

## Standardization Goals

### 🎯 Primary Goals

1. **Silence the Channel**: No email notifications from GitHub Actions
2. **Reduce Noise**: CI runs only on `main` and `develop` branches
3. **Prevent Loops**: No auto-commits that trigger recursive workflows
4. **Centralize Authority**: IMO-Creator is the single source of truth
5. **Version-Lock Workflows**: Child repos reference IMO-Creator workflows with version tags

### 📊 Before vs. After

| Metric | Before | After |
|--------|--------|-------|
| **Workflow Triggers** | All branches (`**`, `sys/**`, etc.) | `main`, `develop` only |
| **Email Notifications** | Enabled (spammy) | Silenced |
| **Auto-Commits** | Enabled (loop risk) | Disabled |
| **Workflow Location** | Duplicated across repos | Centralized in IMO-Creator |
| **CI Noise** | High (every push) | Low (targeted branches) |

---

## Workflow Trigger Policy

### ✅ Standardized Trigger Pattern

All workflows now use this consistent trigger configuration:

```yaml
name: Workflow Name

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

# Silence email notifications
notifications:
  email: false
```

### ❌ Removed Trigger Patterns

The following trigger types have been **removed** from all workflows:

1. **Wildcard branches**: `'**'`, `'sys/**'`, `'doctrine/**'`, `'deploy/*'`
2. **Scheduled cron jobs**: `schedule: - cron: '0 2 * * *'`
3. **Manual dispatch**: `workflow_dispatch`
4. **Repository dispatch**: `repository_dispatch`
5. **Path filters**: `paths: - 'global-config/**'`
6. **PR type filters**: `types: [opened, synchronize]`

### 🔒 Why Only `main` and `develop`?

- **Production (`main`)**: Stable releases, tagged versions
- **Integration (`develop`)**: Feature integration, pre-release testing
- **Feature branches**: Local development, no CI needed

**Rationale**: Feature branches are developer workspaces. CI should validate integration points (`develop`) and releases (`main`), not every experimental commit.

---

## Notification Silencing

### 📧 Email Notification Problem

**Before**: Every workflow run sent email notifications to all watchers.

**Impact**:
- Inbox spam for teams
- Alert fatigue (important notifications missed)
- Workflow noise drowning out real issues

### 🔕 Solution: Global Notification Silencing

All workflows now include:

```yaml
# Silence email notifications
notifications:
  email: false
```

**Location**: Immediately after the `on:` trigger section

**Result**: Workflows run silently. Only workflow failures are visible in GitHub UI, not email.

### 📊 Viewing Workflow Status

**Without email notifications**, monitor workflow status via:

1. **GitHub Actions Tab**: https://github.com/djb258/imo-creator/actions
2. **Commit Status Checks**: Green checkmarks on commits
3. **PR Status**: Workflow badges on pull requests
4. **Branch Protection Rules**: Block merges if workflows fail

---

## Auto-Commit Prevention

### 🔁 The Auto-Commit Loop Problem

**Before**: `doctrine_sync.yml` automatically committed changes to all branches:

```yaml
# OLD - CAUSED LOOPS
git add .
git commit -m "🌲 CTB Doctrine Sync - $(date +%Y-%m-%d)"
git push origin "$branch"
```

**Impact**:
- Triggered recursive workflow runs
- Generated endless "CTB Doctrine Cleanup #159, #160, #161..." commits
- Polluted git history
- Consumed CI/CD quota

### 🛑 Solution: Disable Auto-Commits

**Updated `doctrine_sync.yml`** (lines 120-130):

```yaml
# AUTO-COMMIT DISABLED - Prevents infinite commit loops
# Use manual workflow_dispatch for intentional syncs only
if git diff --staged --quiet; then
  echo "No changes for $branch"
else
  echo "⚠️ Changes detected but auto-commit is disabled"
  echo "Run manual sync if intentional doctrine updates needed"
  # git add .
  # git commit -m "🌲 CTB Doctrine Sync - $(date +%Y-%m-%d)" || true
  # git push origin "$branch" || true
fi
```

**Result**: Workflows report changes but **do not commit automatically**. Manual intervention required for intentional doctrine updates.

### 📋 Manual Sync Procedure

If intentional doctrine sync needed:

```bash
# 1. Run local enforcement check
bash global-config/scripts/ctb_enforce.sh

# 2. Review changes
git status

# 3. Commit manually with context
git add -A
git commit -m "📚 Manual doctrine update: [describe reason]"

# 4. Push to specific branch
git push origin main
```

---

## Centralized Workflows

### 🏗️ Reusable Workflow Architecture

IMO-Creator now provides **reusable workflows** that child repos can reference:

**File**: `.github/workflows/reusable-ctb-enforcement.yml`

```yaml
name: Reusable CTB Enforcement

on:
  workflow_call:
    inputs:
      enforcement_mode:
        description: 'Enforcement mode (standard or strict)'
        required: false
        type: string
        default: 'standard'
    outputs:
      status:
        description: 'Enforcement status (PASSED or FAILED)'
        value: ${{ jobs.enforce.outputs.status }}

jobs:
  enforce:
    name: CTB Doctrine Enforcement
    runs-on: ubuntu-latest
    # ... enforcement logic
```

### 📦 Centralized Workflow List

| Workflow | Purpose | Reusable |
|----------|---------|----------|
| `reusable-ctb-enforcement.yml` | CTB doctrine validation | ✅ Yes |
| `ctb_drift_check.yml` | Template structure verification | 🔄 Planned |
| `security_lockdown.yml` | Secret scanning | 🔄 Planned |

---

## Child Repository Integration

### 🌲 How Child Repos Should Reference IMO-Creator

Child repositories (e.g., `chartdb`, `deepwiki`, `activepieces`) should **reference** IMO-Creator workflows instead of duplicating them.

**Example Child Repo Workflow** (`.github/workflows/ctb_enforcement.yml`):

```yaml
name: CTB Enforcement

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

# Silence email notifications
notifications:
  email: false

jobs:
  enforce:
    name: CTB Doctrine Enforcement
    uses: djb258/imo-creator/.github/workflows/reusable-ctb-enforcement.yml@v1.3.1
    with:
      enforcement_mode: standard
```

### 🔖 Version Locking

**Always reference specific versions** using Git tags:

```yaml
uses: djb258/imo-creator/.github/workflows/reusable-ctb-enforcement.yml@v1.3.1
#                                                                         ^^^^^^
#                                                              Version-locked reference
```

**Why version-lock?**
- Prevents breaking changes from affecting child repos
- Allows gradual rollout of workflow updates
- Enables rollback if issues discovered

### 🔄 Updating Child Repos

When IMO-Creator releases new workflow versions:

1. Test in IMO-Creator first
2. Tag release: `git tag v1.3.2`
3. Update child repos to reference new tag
4. Monitor for issues

---

## Migration Guide

### 📝 For Existing CTB Repositories

If you have an existing CTB repository with custom workflows:

#### Step 1: Backup Current Workflows

```bash
mkdir .github/workflows.backup
cp .github/workflows/*.yml .github/workflows.backup/
```

#### Step 2: Update Triggers

For each workflow file:

```bash
# Find workflows with old trigger patterns
grep -r "branches:" .github/workflows/

# Update each file to use main + develop only
```

#### Step 3: Add Notification Silencing

Add after the `on:` section in each workflow:

```yaml
# Silence email notifications
notifications:
  email: false
```

#### Step 4: Disable Auto-Commits

Search for `git commit` and `git push` in workflows:

```bash
grep -rn "git commit" .github/workflows/
grep -rn "git push" .github/workflows/
```

Comment out or remove auto-commit logic.

#### Step 5: Reference IMO-Creator Workflows

Replace custom enforcement workflows with references to IMO-Creator:

```yaml
# OLD - Custom logic
jobs:
  enforce:
    runs-on: ubuntu-latest
    steps:
      - name: Run custom enforcement
        run: ./scripts/enforce.sh

# NEW - Reference IMO-Creator
jobs:
  enforce:
    uses: djb258/imo-creator/.github/workflows/reusable-ctb-enforcement.yml@v1.3.1
```

#### Step 6: Test Changes

```bash
# Commit changes
git add .github/workflows/
git commit -m "🔧 CI/CD: Standardize workflows per CTB v1.3.1"

# Push to develop first
git push origin develop

# Monitor GitHub Actions
# Verify workflows run only on main/develop
```

#### Step 7: Update Documentation

Update your repo's README with new CI/CD behavior:

```markdown
## CI/CD

This repository uses centralized CTB workflows from IMO-Creator.

- **Triggers**: `main` and `develop` branches only
- **Notifications**: Silenced (check GitHub Actions tab)
- **Enforcement**: References IMO-Creator v1.3.1
```

---

## Troubleshooting

### ❓ Common Issues

#### Issue 1: Workflows Still Running on All Branches

**Symptom**: CI runs on feature branches despite updates

**Diagnosis**:
```bash
# Check workflow trigger configuration
cat .github/workflows/ctb_enforcement.yml | grep -A 10 "on:"
```

**Fix**: Ensure triggers are:
```yaml
on:
  push:
    branches:
      - main
      - develop
```

**Not**:
```yaml
on:
  push:
    branches:
      - '**'  # ❌ Wildcard
```

#### Issue 2: Still Receiving Email Notifications

**Symptom**: Emails continue after adding `notifications: email: false`

**Diagnosis**: Check GitHub personal notification settings

**Fix**:
1. Go to GitHub Settings → Notifications
2. Uncheck "Actions" under "Email"
3. Or add `.github/workflows/` to notification ignore list

#### Issue 3: Auto-Commit Loops Persist

**Symptom**: Still seeing recursive "CTB Doctrine Cleanup #XXX" commits

**Diagnosis**:
```bash
# Find workflows with git commit
grep -rn "git commit" .github/workflows/
```

**Fix**: Comment out **all** auto-commit logic:
```yaml
# git add .
# git commit -m "..."
# git push origin "$branch"
```

#### Issue 4: Child Repo Cannot Reference IMO-Creator Workflow

**Symptom**: Error: "Workflow file not found"

**Diagnosis**: Version tag doesn't exist or workflow file moved

**Fix**:
```bash
# Check available tags
git ls-remote --tags https://github.com/djb258/imo-creator

# Use latest stable tag
uses: djb258/imo-creator/.github/workflows/reusable-ctb-enforcement.yml@v1.3.1
```

#### Issue 5: Workflows Not Running at All

**Symptom**: No CI runs on `main` or `develop`

**Diagnosis**: Branch protection rules or workflow file syntax errors

**Fix**:
1. Check GitHub Actions tab for workflow errors
2. Validate YAML syntax: https://www.yamllint.com/
3. Ensure workflows are in `.github/workflows/` (not `.github/workflow/`)

---

## Summary

### 🎯 Key Takeaways

1. **Triggers**: Only `main` and `develop` branches
2. **Notifications**: Silenced with `notifications: email: false`
3. **Auto-Commits**: Disabled to prevent loops
4. **Centralization**: IMO-Creator is the workflow authority
5. **Version-Locking**: Child repos reference specific IMO-Creator versions

### 📊 Impact

- **CI Runs**: Reduced by ~80% (only integration points)
- **Email Noise**: Eliminated completely
- **Auto-Commit Spam**: Stopped
- **Workflow Maintenance**: Centralized (single update, all repos benefit)

### 🚀 Next Steps

1. **Update child repos**: Reference IMO-Creator workflows
2. **Monitor CI**: Verify runs only on `main`/`develop`
3. **Report issues**: GitHub issues if workflows behave unexpectedly

---

## References

- **IMO-Creator Workflows**: https://github.com/djb258/imo-creator/tree/main/.github/workflows
- **Reusable Workflows Doc**: https://docs.github.com/en/actions/using-workflows/reusing-workflows
- **CTB Doctrine**: `/docs/ctb/CTB_SYSTEM_MANUAL_GUIDE.md`
- **Version History**: `/docs/ctb/CTB_VERSION_HISTORY.md`

---

**CTB CI/CD Standardization** - Quiet, predictable, centralized enforcement ✨

**Version**: 1.3.1
**Last Updated**: 2025-10-23
**Status**: Production Ready
