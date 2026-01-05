# HEIR Compliance Template

**HEIR = Hub Environment Identity Record**

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | |
| **CC Layer** | CC-03 (Validation Interface) |

---

## Hub Identity (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | |
| **Hub Name** | |
| **Hub ID** | |
| **Schema Version** | HEIR/1.0 |

---

## Overview

Every hub MUST have a `heir.doctrine.yaml` file at the root for compliance validation.

> **HEIR enforces doctrine programmatically.**
> **No manual checks. No trust. Only validation.**

HEIR operates as a CC-03 validation interface, ensuring CC layer compliance at runtime.

---

## Required File: `heir.doctrine.yaml`

```yaml
# Canonical Chain (CC) Reference
sovereign:
  identity: "<sovereign-id>"              # CC-01

# Hub Identity (CC-02)
hub:
  name: "<hub-name>"
  id: "<hub-id>"

meta:
  app_name: "<hub-name>"
  repo_slug: "<org>/<repo>"
  stack: ["<framework>", "<backend>", "<database>"]
  llm:
    providers: []                         # Define as needed
    default: "<provider>"

# Doctrine Compliance
doctrine:
  version: "<doctrine-version>"
  unique_id: "<hub-id>-${TIMESTAMP}-${RANDOM_HEX}"
  process_id: "<hub-id>-process-${SESSION_ID}"    # CC-04
  schema_version: "HEIR/1.0"

# Deliverables (CC-03 Interfaces)
deliverables:
  repos:
    - name: "<hub-name>"
      visibility: private
  services:
    - name: "<service-name>"
      port: "<port>"
  env:
    <VARIABLE_NAME>: "${SECRETS_PROVIDER:<KEY>}"

# Acceptance Contracts
contracts:
  acceptance:
    - "All HEIR checks pass in CI"
    - "<additional-contract>"

# Build Configuration
build:
  actions:
    ci_checks: ["<check-command>"]
    telemetry_events: ["app.start"]
```

---

## HEIR Validation Checks

| Check | What It Validates | CC Layer |
|-------|-------------------|----------|
| **Sovereign** | sovereign reference present | CC-01 |
| **Hub** | hub identity complete | CC-02 |
| **Meta** | app_name, repo_slug, stack | CC-02 |
| **Doctrine** | version, unique_id, process_id, schema | CC-02/CC-04 |
| **Deliverables** | repos, services, env vars | CC-03 |
| **Contracts** | acceptance criteria defined | CC-03 |
| **Build** | CI checks, telemetry events | CC-04 |

---

## Running HEIR Checks

```bash
# Run validation
python -m packages.heir.checks

# Expected output
[INFO] Running HEIR validation checks...
  Checking Meta configuration... PASSED
  Checking Doctrine fields... PASSED
  Checking Deliverables... PASSED
  Checking Contracts... PASSED
  Checking Build configuration... PASSED
  Checking Manifest integration... PASSED

==================================================
HEIR Validation Summary
==================================================

[SUCCESS] All checks passed! Hub is HEIR-compliant.
```

---

## CI Integration

### GitHub Actions

```yaml
- name: Run HEIR Compliance Checks
  run: python -m packages.heir.checks

- name: Fail if not compliant
  if: failure()
  run: |
    echo "HEIR compliance failed. Fix errors before merging."
    exit 1
```

---

## Required Fields

### Sovereign Section (CC-01)
| Field | Required | Description |
|-------|----------|-------------|
| `sovereign.identity` | Yes | Reference to governing sovereign |

### Hub Section (CC-02)
| Field | Required | Description |
|-------|----------|-------------|
| `hub.name` | Yes | Hub name |
| `hub.id` | Yes | Unique, immutable hub identifier |

### Meta Section (CC-02)
| Field | Required | Description |
|-------|----------|-------------|
| `app_name` | Yes | Hub name |
| `repo_slug` | Yes | Repository identifier (org/repo) |
| `stack` | Yes | Technology stack array |

### Doctrine Section (CC-02/CC-04)
| Field | Required | Description |
|-------|----------|-------------|
| `version` | Yes | Doctrine version |
| `unique_id` | Yes | Hub ID pattern |
| `process_id` | Yes | Process ID pattern (CC-04) |
| `schema_version` | Yes | Must be "HEIR/1.0" |

### Deliverables Section (CC-03)
| Field | Required | Description |
|-------|----------|-------------|
| `services` | Yes | Service definitions |
| `env` | Yes | Environment variables |

---

## Secrets Integration

All secrets in `heir.doctrine.yaml` should reference your secrets provider:

```yaml
env:
  <SECRET_NAME>: "${SECRETS_PROVIDER:<KEY>}"
```

---

## Compliance Checklist

- [ ] `heir.doctrine.yaml` exists at hub root
- [ ] Sovereign reference present (CC-01)
- [ ] Hub identity complete (CC-02)
- [ ] Meta section complete
- [ ] Doctrine version and IDs defined
- [ ] Services defined (CC-03)
- [ ] Environment variables reference secrets provider
- [ ] CI runs HEIR checks
- [ ] All checks pass

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | CANONICAL_ARCHITECTURE_DOCTRINE.md |
| PRD | |
| ADR | |
| Work Item | |
