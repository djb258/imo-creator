# Authority Map — IMO-Creator Governance Topology

**Authority**: IMO-Creator (CC-01 Sovereign)
**Version**: 1.0.0
**Last Updated**: 2026-02-20
**Status**: ACTIVE

---

## 1. Single Entrypoint Chain

Read in this order. Higher level wins on conflict.

| Order | File | Audience | Purpose |
|-------|------|----------|---------|
| 1 | `CLAUDE.md` | AI agents | Locked file registry, permissions, operational rules |
| 2 | `CONSTITUTION.md` | Humans, downstream repos | What is governed, invariants, transformation law |
| 3 | `IMO_CONTROL.json` | Machine + agents | Structural governance contract, doctrine file list |
| 4 | `templates/doctrine/ARCHITECTURE.md` | All | CTB Constitutional Law (v2.1.0) — the root doctrine |

---

## 2. CTB Registry Locations

| Artifact | Path | Purpose | Maintained By |
|----------|------|---------|---------------|
| Column Registry | `templates/child/column_registry.yml.template` | Canonical schema spine — all table/column definitions | Human + AI (fill template) |
| Hub Registry | `templates/child/REGISTRY.yaml.template` | Hub identity, sub-hubs, spokes, CTB placement | Human + AI (fill template) |
| Branch Map | `templates/config/ctb.branchmap.yaml` | CTB branch hierarchy, altitude levels, merge flow | Human |
| CTB Governance | `templates/config/CTB_GOVERNANCE.md` | Table classification, frozen tables, drift detection | Human |
| Table Registry (DB) | `ctb.table_registry` (created by `templates/migrations/001_ctb_table_registry.sql`) | Runtime mirror of column_registry.yml | Automated (migrations) |

---

## 3. CI Enforcement Locations

| Layer | File | Trigger | Purpose |
|-------|------|---------|---------|
| CI | `.github/workflows/doctrine-enforcement.yml` | push/PR to master | Doctrine audit + UI builder gate |
| CI | `.github/workflows/reusable-ctb-enforcement.yml` | workflow_call | Reusable CTB structure enforcement |
| CI | `.github/workflows/reusable-fail-closed-gate.yml` | workflow_call | Fail-closed governance (4 gates) |
| CI | `.github/workflows/codeql.yml` | push/PR + weekly | Security scanning |
| Pre-commit | `templates/scripts/hooks/pre-commit` | git commit | 14 doctrine compliance checks |
| Claude Code | `templates/claude/APPLY_DOCTRINE.prompt.md` | Agent session | Structural audit via AI |
| UI Builder | `UI_CONTROL_CONTRACT.json` | UI build | Component discovery gate |

---

## 4. Doctrine File Map

| File | Version | Status | Purpose |
|------|---------|--------|---------|
| `ARCHITECTURE.md` | 2.1.0 | LOCKED | CTB, CC, Hub-Spoke, IMO, Descent, PID, Ownership |
| `ROLLBACK_PROTOCOL.md` | 1.0.0 | LOCKED | Doctrine sync rollback procedure |
| `EXECUTION_SURFACE_LAW.md` | 1.0.0 | LOCKED | Where code can run |
| `CTB_REGISTRY_ENFORCEMENT.md` | 1.0.0 | LOCKED | Registry-first enforcement |
| `FAIL_CLOSED_CI_CONTRACT.md` | 1.0.0 | LOCKED | Fail-closed CI contract |
| `LEGACY_COLLAPSE_PLAYBOOK.md` | 1.0.0 | LOCKED | Legacy migration protocol |
| `DBA_ENFORCEMENT_DOCTRINE.md` | — | LOCKED | Database change governance |
| `DOCUMENTATION_ERD_DOCTRINE.md` | — | LOCKED | ERD standards |
| `ERD_CONSTITUTION.md` | — | LOCKED | ERD governance |
| `ERD_DOCTRINE.md` | — | LOCKED | ERD structure/validation |
| `PRD_CONSTITUTION.md` | — | LOCKED | PRD governance |
| `PROCESS_DOCTRINE.md` | — | LOCKED | Process declaration |
| `REPO_REFACTOR_PROTOCOL.md` | — | LOCKED | Refactor sequence |
| `TEMPLATE_IMMUTABILITY.md` | — | LOCKED | Immutability rules |
| `CANONICAL_ARCHITECTURE_DOCTRINE.md` | — | REDIRECT | → ARCHITECTURE.md |
| `HUB_SPOKE_ARCHITECTURE.md` | — | REDIRECT | → ARCHITECTURE.md Part IV |
| `ALTITUDE_DESCENT_MODEL.md` | — | REDIRECT | → ARCHITECTURE.md Part VI |

---

## 5. Deprecation Registry

| File | Status | Superseded By | Action |
|------|--------|---------------|--------|
| `CANONICAL_ARCHITECTURE_DOCTRINE.md` | REDIRECT | `ARCHITECTURE.md` | Keep as redirect stub |
| `HUB_SPOKE_ARCHITECTURE.md` | REDIRECT | `ARCHITECTURE.md` Part IV | Keep as redirect stub |
| `ALTITUDE_DESCENT_MODEL.md` | REDIRECT | `ARCHITECTURE.md` Part VI | Keep as redirect stub |

These redirects are intentional backward-compatibility stubs. They exist in the file tree but contain only a pointer to the consolidated `ARCHITECTURE.md`. Do not delete them.

---

## 6. Enforcement Surface Inventory

| Layer | Mechanism | Scope | Fail Mode |
|-------|-----------|-------|-----------|
| **Pre-commit** | `hooks/pre-commit` (14 checks) | Local developer machine | Blocks commit |
| **CI (doctrine)** | `doctrine-enforcement.yml` | GitHub push/PR | Blocks merge |
| **CI (fail-closed)** | `reusable-fail-closed-gate.yml` | GitHub push/PR (child repos) | Blocks merge |
| **CI (CTB)** | `reusable-ctb-enforcement.yml` | GitHub workflow_call | Reports status |
| **Claude Code** | `APPLY_DOCTRINE.prompt.md` | AI agent sessions | HALT + report |
| **UI Builder** | `UI_CONTROL_CONTRACT.json` | UI build pipeline | Blocks build |
| **DB (DDL)** | Event trigger (`ctb.enforce_table_registration`) | PostgreSQL DDL | Blocks DDL |
| **DB (DML)** | Write guards (`ctb.write_guard_check`) | PostgreSQL DML | Blocks writes |
| **Application** | Gatekeeper module | Runtime writes | Blocks + logs |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-20 |
| Authority | IMO-Creator (CC-01) |
| Status | ACTIVE |
| Note | This is a repo-root doc, NOT a template. Not tracked in TEMPLATES_MANIFEST.yaml. |
