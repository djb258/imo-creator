# CTB Workflow Templates

**Version**: 1.3.1
**Purpose**: Standardized GitHub Actions workflows for CTB-derived repositories

## Overview

This directory contains **standardized workflow templates** that are scaffolded into all new CTB repositories. These workflows follow the **CTB v1.3.1 CI/CD Standardization**:

- ✅ **Triggers**: Only `main` and `develop` branches
- ✅ **Notifications**: Silenced (`notifications: email: false`)
- ✅ **Centralized**: Reference IMO-Creator reusable workflows when possible
- ✅ **Version-locked**: Reference specific IMO-Creator versions

## Included Workflows

### 1. `ctb_enforcement.yml`

**Purpose**: CTB Doctrine enforcement and validation

**Trigger**: Push/PR to `main` or `develop`

**Behavior**: References centralized IMO-Creator workflow:
```yaml
uses: djb258/imo-creator/.github/workflows/reusable-ctb-enforcement.yml@v1.3.1
```

**What it checks**:
- Required CTB branches exist
- MCP tools are registered
- Barton Doctrine compliance

### 2. `ctb_drift_check.yml`

**Purpose**: Verify CTB template structure integrity

**Trigger**: Push/PR to `main` or `develop`

**What it checks**:
- `ctb-template/version.json` exists
- CTB version is valid
- Barton policy is enforced

### 3. `ci.yml`

**Purpose**: Basic CI pipeline (lint, test, build)

**Trigger**: Push/PR to `main` or `develop`

**Steps**:
- Install dependencies (`npm ci`)
- Run linting (`npm run lint`)
- Run tests (`npm test`)
- Build project (`npm run build`)

**Note**: Uses `--if-present` flag so commands skip if not defined in `package.json`

## Workflow Trigger Standard

All workflows follow this trigger pattern:

```yaml
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

## Customization

### Adding Project-Specific Workflows

You can add additional workflows for your project:

```yaml
name: Custom Workflow

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

# Always include notification silencing
notifications:
  email: false

jobs:
  custom:
    runs-on: ubuntu-latest
    steps:
      - name: Custom step
        run: echo "Your custom logic here"
```

### Updating CTB Enforcement Version

To update the CTB enforcement version reference:

```yaml
# OLD
uses: djb258/imo-creator/.github/workflows/reusable-ctb-enforcement.yml@v1.3.1

# NEW (when v1.4.0 is released)
uses: djb258/imo-creator/.github/workflows/reusable-ctb-enforcement.yml@v1.4.0
```

**Check available versions**: https://github.com/djb258/imo-creator/tags

## Disabled Workflow Patterns

The following patterns are **NOT used** in CTB workflows:

❌ **Wildcard branches**: `branches: ['**']`
❌ **Scheduled cron**: `schedule: - cron: '0 2 * * *'`
❌ **Manual dispatch**: `workflow_dispatch`
❌ **Path filters**: `paths: - 'src/**'`

**Why?** These cause excessive CI runs and notification spam.

## Troubleshooting

### Workflows not running

1. Check branch name: Must be `main` or `develop`
2. Verify workflow files are in `.github/workflows/`
3. Check GitHub Actions tab for syntax errors

### Reference to IMO-Creator failing

```
Error: Workflow file not found
```

**Fix**: Update version tag to an existing release:
```bash
git ls-remote --tags https://github.com/djb258/imo-creator
```

### Still receiving emails

1. Add `notifications: email: false` to workflow
2. Check GitHub Settings → Notifications
3. Uncheck "Actions" under Email notifications

## Version History

- **v1.3.1** (2025-10-23): Initial standardized workflow templates
  - CTB enforcement via reusable workflow
  - Drift check validation
  - Basic CI pipeline
  - All triggers limited to main/develop
  - Notifications silenced

## References

- **CTB CI/CD Standardization Guide**: `/docs/ctb/CTB_CICD_STANDARDIZATION.md`
- **IMO-Creator Workflows**: https://github.com/djb258/imo-creator/tree/main/.github/workflows
- **CTB System Manual**: `/docs/ctb/CTB_SYSTEM_MANUAL_GUIDE.md`

---

**CTB Workflow Templates** - Quiet, predictable, centralized ✨
