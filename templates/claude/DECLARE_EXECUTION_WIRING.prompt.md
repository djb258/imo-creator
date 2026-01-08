# SYSTEM PROMPT — EXECUTION WIRING

You are operating inside a repository governed by IMO-Creator.

This repository has:
- Passed Constitutional Admission
- Completed Structural Instantiation
- Completed Data Declaration (AI-Ready Data)

Your task is to DECLARE EXECUTION WIRING.

Execution Wiring binds process_id → runnable behavior.
This phase defines HOW the system runs, not WHAT it does.

This is a METADATA-ONLY phase.
You MUST NOT modify business logic, schemas, or structure.

---

## OBJECTIVE

Make the system operable and autonomous by declaring:

- What executable runs each process
- What triggers it
- What inputs and outputs it has
- What side effects are allowed
- How it is observed
- How it can be safely stopped

Execution Wiring enables:
- Human operations
- AI-controlled execution
- Deterministic automation

---

## PHASE 1 — READ GOVERNANCE

Read in order:

1. `CONSTITUTION.md`
2. `IMO_CONTROL.json`
3. `CANONICAL_ARCHITECTURE_DOCTRINE.md`
4. All `REGISTRY.yaml` files (sovereign, hub, sub-hub)
5. Process definitions (`process_id` lists)

**STOP immediately if:**
- Any `process_id` lacks ownership
- Any sub-hub lacks a `REGISTRY.yaml`
- Execution Wiring is not an allowed lifecycle phase

---

## PHASE 2 — DISCOVER EXECUTABLES

For each sub-hub:

1. Identify executable units that implement declared processes:
   - scripts
   - jobs
   - agents
   - workflows
   - API handlers
   - CLI commands
   - external services (if applicable)

2. Map each executable to a `process_id`.

If a `process_id` has no executable:
- Mark it as `DECLARED_BUT_NOT_IMPLEMENTED`
- DO NOT invent logic
- DO NOT create placeholder code

---

## PHASE 3 — BIND PROCESS → EXECUTION

For each sub-hub, create or update:

```
hubs/<hub>/subhubs/<subhub>/execution/
```

**Required files:**

1. `execution.yaml`
2. `triggers.yaml`
3. `schedules.yaml` (if applicable)
4. `kill_switches.yaml`
5. `observability.yaml`

---

### execution.yaml

For EACH `process_id` declare:

| Field | Description |
|-------|-------------|
| `process_id` | The process being wired |
| `execution_type` | `script` / `agent` / `job` / `api` / `external` |
| `executable_path` | Path to script/job OR `agent_name` OR `service_reference` |
| `runtime` | `python` / `node` / `container` / `external` |
| `invocation_method` | `cli` / `http` / `queue` / `sdk` |

---

### triggers.yaml

For EACH `process_id` declare:

| Field | Description |
|-------|-------------|
| `process_id` | The process being triggered |
| `trigger_type` | `schedule` / `event` / `manual` / `upstream` |
| `trigger_source` | What initiates this process |
| `upstream_process_id` | If triggered by another process |

---

### schedules.yaml (only if scheduled)

For EACH scheduled `process_id` declare:

| Field | Description |
|-------|-------------|
| `process_id` | The scheduled process |
| `schedule_type` | `cron` / `interval` |
| `expression` | Cron expression or interval definition |
| `timezone` | IANA timezone identifier |

---

### kill_switches.yaml

For EACH `process_id` declare:

| Field | Description |
|-------|-------------|
| `process_id` | The process being controlled |
| `env_flag` | Environment variable that controls this switch |
| `default_state` | `enabled` / `disabled` |
| `safe_mode` | `dry-run` / `noop` / `full-disable` |
| `authority` | `human_only` / `agent_allowed` |

---

### observability.yaml

For EACH `process_id` declare:

| Field | Description |
|-------|-------------|
| `process_id` | The process being observed |
| `log_sink` | Where logs are written |
| `error_sink` | Where errors are written |
| `metrics.success` | Success metric name |
| `metrics.failure` | Failure metric name |
| `metrics.latency` | Latency metric name |
| `retry_policy` | `none` / `auto` / `manual` |
| `max_retries` | Maximum retry count (if `auto`) |

---

## PHASE 4 — AUTONOMY SAFETY DECLARATIONS

For EACH `process_id`, explicitly declare:

| Field | Description |
|-------|-------------|
| `allowed_side_effects` | Tables written, events emitted, external calls |
| `forbidden_side_effects` | Anything not explicitly allowed |
| `idempotency_expectation` | `yes` / `no` |
| `retry_behavior` | `auto` / `manual` / `none` |

These declarations MUST be metadata-only.

---

## PHASE 5 — VALIDATE COMPLETENESS

Confirm:

- Every `process_id` has execution wiring OR is marked `DECLARED_BUT_NOT_IMPLEMENTED`
- No executable is unowned
- No process lacks a kill switch
- Observability exists for all non-readonly processes

If any violation exists:
**STOP and REPORT.**

---

## ABSOLUTE RULES

- NO logic edits
- NO schema edits
- NO migrations
- NO refactors
- NO new code
- Metadata and documentation ONLY

If uncertain at any point:
**STOP and ASK.**

---

## DELIVERABLES

1. List of `process_id`s wired to executables
2. List of `process_id`s marked `DECLARED_BUT_NOT_IMPLEMENTED`
3. Execution wiring files created or updated
4. Summary of autonomy controls (kill switches, retries, observability)
5. Explicit confirmation that NO LOGIC OR SCHEMA WAS MODIFIED

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-08 |
| Phase | Execution Wiring |
| Prerequisite | Data Declaration |
| Authority | imo-creator (Constitutional) |
