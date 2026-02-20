# Fail-Closed CI Contract

**Authority**: IMO-Creator (CC-01 Sovereign)
**Status**: LOCKED
**Version**: 1.0.0
**Scope**: All child repositories

---

## Purpose

No enforcement job may pass on error. CI gates are **fail-closed** by default. This document defines the contract that all CI enforcement must follow.

---

## 1. The Principle

**DEFAULT DENY**: Anything not explicitly allowed is blocked.

| Rule | Meaning |
|------|---------|
| No `continue-on-error: true` on enforcement jobs | Enforcement failures MUST stop the pipeline |
| No pass-on-skip | Missing enforcement scripts = FAIL, not SKIP |
| No manual override without ADR | Bypassing gates requires formal decision record |
| No silent degradation | If enforcement cannot run, the pipeline FAILS |

---

## 2. Fail-Closed vs Fail-Open

| Scenario | Fail-Open (WRONG) | Fail-Closed (CORRECT) |
|----------|-------------------|-----------------------|
| Enforcement script not found | SKIP or WARN | **FAIL** |
| Script exits non-zero | `continue-on-error: true` | **FAIL** — pipeline stops |
| Unknown table in migration | Allow creation | **BLOCK** — must register first |
| Missing CTB registration | Proceed with warning | **HALT** — register before creating |
| `continue-on-error` detected | Ignore | **FAIL** — Gate D violation |
| Rogue directory at repo root | Warn | **FAIL** — Gate A violation |

---

## 3. CI Contract: Reusable Fail-Closed Gate

**Workflow**: `.github/workflows/reusable-fail-closed-gate.yml`

Child repos MUST include this workflow in their CI pipeline:

```yaml
jobs:
  fail-closed-gate:
    uses: djb258/imo-creator/.github/workflows/reusable-fail-closed-gate.yml@v3.0.0
    with:
      enforcement_mode: strict
```

### 3.1 Gate Definitions

| Gate | Name | What It Blocks |
|------|------|----------------|
| **A** | Side-door detection | Prohibited execution directories at repo root |
| **B** | Executable containment | Executable files outside CTB branches |
| **C** | DDL containment | SQL DDL (CREATE/ALTER/DROP) outside `migrations/` |
| **D** | Fail-open detection | `continue-on-error: true` on active workflow enforcement jobs |

### 3.2 Gate Behavior

- ALL four gates must pass for the workflow to succeed
- ANY single gate failure = entire workflow FAILS
- No gate uses `continue-on-error`
- No gate skips on missing dependencies — it FAILS instead
- Exit codes are respected: non-zero = FAIL

---

## 4. Prohibited CI Patterns

| Pattern | Violation | Why |
|---------|-----------|-----|
| `continue-on-error: true` on enforcement jobs | FAIL_OPEN_VIOLATION | Allows failures to pass silently |
| `if: failure()` to skip enforcement | GATE_BYPASS | Enforcement must not be conditional on prior failures |
| Missing enforcement workflow in child repo | MISSING_GATE | All child repos must run the fail-closed gate |
| Custom enforcement that softens rules | DOCTRINE_VIOLATION | Enforcement must match or exceed parent doctrine |

---

## 5. Child Repo Obligations

Every child repo MUST:

| Obligation | Enforcement |
|------------|-------------|
| Include `reusable-fail-closed-gate.yml` in CI | Gate D detects missing enforcement |
| Not add `continue-on-error: true` to enforcement jobs | Gate D scans workflow files |
| Not create execution directories outside CTB | Gate A detects side-door dirs |
| Not place DDL outside `migrations/` | Gate C scans for DDL patterns |
| Not place executables outside CTB branches | Gate B scans for executables |

---

## 6. Escalation

If a child repo cannot comply with this contract:

1. **Do NOT** add `continue-on-error: true`
2. **Do NOT** remove the fail-closed gate from CI
3. **DO** create an ADR explaining the exception
4. **DO** request human approval for a time-limited waiver
5. **DO** add the waiver to `allowed_execution_dirs` input (for Gate A only)

There is no permanent exception. Waivers expire and must be renewed.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-20 |
| Authority | IMO-Creator (CC-01) |
| Status | LOCKED |
| Version | 1.0.0 |
| Change Protocol | ADR + Human Approval Required |
| Related | EXECUTION_SURFACE_LAW.md, CTB_REGISTRY_ENFORCEMENT.md |
