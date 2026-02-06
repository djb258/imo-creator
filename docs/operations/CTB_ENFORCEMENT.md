# CTB Doctrine Enforcement

**Authority**: Operational runbook (subordinate to ARCHITECTURE.md)
**Status**: ACTIVE
**Last Updated**: 2026-01-11

---

## Mandatory External Repository Integration

**CRITICAL**: All repositories following the CTB Doctrine MUST include the following external repository integrations:

| Branch | Repository | Doctrine ID | Status |
|--------|-----------|-------------|--------|
| `sys/chartdb` | github.com/[OWNER]/chartdb | 04.04.07 | REQUIRED |
| `sys/activepieces` | github.com/[OWNER]/activepieces | 04.04.08 | REQUIRED |
| `sys/windmill` | github.com/[OWNER]/windmill | 04.04.09 | REQUIRED |
| `sys/claude-skills` | Anthropic via Composio MCP | 04.04.10 | REQUIRED |

---

## Enforcement Actions

The CTB enforcement system performs the following checks on every repo creation, update, or sync:

### 1. Branch Presence Check

- Verifies all required branches exist
- Validates branches contain actual code (not empty)
- Minimum 2 files per sys/claude-skills branch

### 2. MCP Registration Check

- Confirms all tools are registered in `config/mcp_registry.json`
- Validates correct doctrine IDs are assigned (04.04.07-10)
- Ensures endpoints are configured

### 3. Port Health Check (optional in standard mode)

- ChartDB → localhost:5173
- Activepieces → localhost:80
- Windmill → localhost:8000
- Anthropic_Claude_Skills → Global Composio endpoint

### 4. Configuration Validation

- Verifies `global-config/ctb.branchmap.yaml` includes all branches
- Checks CTB_DOCTRINE.md is present and current

---

## Running Enforcement Checks

**Manual Enforcement:**
```bash
# Standard mode (recommended)
bash templates/scripts/ctb_enforce.sh

# Strict mode (requires all ports healthy)
bash templates/scripts/ctb_enforce.sh --strict
```

**Automated Enforcement:**
- Runs automatically on every push via GitHub Actions
- Blocks merges if enforcement fails
- Tags compliant commits with `[CTB_DOCTRINE_VERIFIED]`

---

## Enforcement Logging

All enforcement checks are logged to:
- **Local**: `logs/ctb_enforcement.log`
- **Firebase**: `ctb_enforcement_log` collection (if configured)

Log format:
```json
{
  "timestamp": "2026-01-11T00:00:00Z",
  "repo_id": "repository-name",
  "enforcement_mode": "STANDARD",
  "status": "PASSED",
  "checks": {
    "branches": {
      "required": 4,
      "missing": 0,
      "empty": 0
    },
    "mcp_tools": {
      "required": 4,
      "missing": 0
    },
    "ports": {
      "checked": 4,
      "unhealthy": 0
    }
  }
}
```

---

## Failure Policy

**If enforcement fails:**

1. Build and deploy pipelines are BLOCKED
2. Merge requests are REJECTED
3. Status returns `CTB_ENFORCEMENT_FAILURE`
4. Diagnostic output shows missing components

**Remediation:**
```bash
# Option 1: Run initialization
bash templates/scripts/ctb_init.sh

# Option 2: Update from IMO-Creator
bash templates/scripts/update_from_imo_creator.sh

# Verify fix
bash templates/scripts/ctb_enforce.sh
```

---

## Enforcement Exemptions

**None.** All CTB repositories MUST comply. No exemptions are granted.

If a repository cannot support these integrations due to technical constraints, it should not use the CTB Doctrine scaffold.

---

## Document Control

| Field | Value |
|-------|-------|
| Type | Operational Runbook |
| Authority | Subordinate to Canonical Doctrine |
| Extracted From | templates/config/CTB_DOCTRINE.md |
