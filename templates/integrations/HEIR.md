# HEIR Compliance Template

**HEIR = Hub Environment Identity Record**

## Hub Identity

| Field | Value |
|-------|-------|
| **Hub Name** | |
| **Hub ID** | |
| **Schema Version** | HEIR/1.0 |

---

## Overview

Every hub MUST have a `heir.doctrine.yaml` file at the root for compliance validation.

> **HEIR enforces doctrine programmatically.**
> **No manual checks. No trust. Only validation.**

---

## Required File: `heir.doctrine.yaml`

```yaml
meta:
  app_name: "<hub-name>"
  repo_slug: "<org>/<repo>"
  stack: ["<framework>", "<backend>", "<database>"]
  llm:
    providers:
      - anthropic
      - openai
    default: "anthropic"

doctrine:
  unique_id: "<hub-id>-${TIMESTAMP}-${RANDOM_HEX}"
  process_id: "<hub-id>-process-${SESSION_ID}"
  schema_version: "HEIR/1.0"
  blueprint_version_hash: "${AUTO_SHA256_OF_CANON}"
  agent_execution_signature: "${AUTO_HASH(llm+tools)}"

deliverables:
  repos:
    - name: "<hub-name>"
      visibility: private
  services:
    - name: "mcp"
      port: 7001
    - name: "sidecar"
      port: 8000
  env:
    MCP_URL: "http://localhost:7001"
    SIDECAR_URL: "http://localhost:8000"
    BEARER_TOKEN: "${DOPPLER:BEARER_TOKEN}"
    LLM_DEFAULT_PROVIDER: "anthropic"

contracts:
  acceptance:
    - "All HEIR checks pass in CI"
    - "Sidecar event emitted on app start"
    - "MCP bay exposes required tools"

build:
  actions:
    mcp_tools: ["heir.check", "sidecar.event"]
    ci_checks: ["python -m packages.heir.checks"]
    telemetry_events: ["app.start", "action.invoked"]
```

---

## HEIR Validation Checks

| Check | What It Validates |
|-------|-------------------|
| **Meta** | app_name, repo_slug, stack, LLM providers |
| **Doctrine** | unique_id, process_id, schema_version |
| **Deliverables** | repos, services (mcp, sidecar), env vars |
| **Contracts** | acceptance criteria defined |
| **Build** | MCP tools, CI checks, telemetry events |
| **Manifest** | IMO manifest integration |

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

### Meta Section
| Field | Required | Description |
|-------|----------|-------------|
| `app_name` | Yes | Hub name |
| `repo_slug` | Yes | GitHub org/repo |
| `stack` | Yes | Technology stack array |
| `llm.providers` | Yes | LLM providers array |
| `llm.default` | Yes | Default provider |

### Doctrine Section
| Field | Required | Description |
|-------|----------|-------------|
| `unique_id` | Yes | Hub ID pattern |
| `process_id` | Yes | Process ID pattern |
| `schema_version` | Yes | Must be "HEIR/1.0" |

### Deliverables Section
| Field | Required | Description |
|-------|----------|-------------|
| `services` | Yes | Must include mcp and sidecar |
| `env` | Yes | Required environment variables |

---

## Doppler Integration

All secrets in `heir.doctrine.yaml` should reference Doppler:

```yaml
env:
  BEARER_TOKEN: "${DOPPLER:BEARER_TOKEN}"
  COMPOSIO_API_KEY: "${DOPPLER:COMPOSIO_API_KEY}"
  ANTHROPIC_API_KEY: "${DOPPLER:ANTHROPIC_API_KEY}"
```

---

## Compliance Checklist

- [ ] `heir.doctrine.yaml` exists at hub root
- [ ] Meta section complete
- [ ] Doctrine IDs defined
- [ ] Services include mcp and sidecar
- [ ] Environment variables reference Doppler
- [ ] CI runs HEIR checks
- [ ] All checks pass

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| PRD | |
| ADR | |
| Linear Issue | |
