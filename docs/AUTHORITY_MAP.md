# Authority Map — IMO-Creator Governance Topology

**Authority**: IMO-Creator (CC-01 Sovereign)
**Version**: 1.2.0
**Last Updated**: 2026-03-02
**Status**: ACTIVE

---

## 1. Single Entrypoint Chain

Read in this order. Higher level wins on conflict.

| Order | File | Audience | Purpose |
|-------|------|----------|---------|
| 1 | `CLAUDE.md` | AI agents | Locked file registry, permissions, operational rules |
| 2 | `CONSTITUTION.md` | Humans, downstream repos | What is governed, invariants, transformation law |
| 3 | `IMO_CONTROL.json` | Machine + agents | Structural governance contract, doctrine file list |
| 4 | `law/doctrine/ARCHITECTURE.md` | All | CTB Constitutional Law (v2.1.0) — the root doctrine |

---

## 2. CTB Registry Locations

| Artifact | Path | Purpose | Maintained By |
|----------|------|---------|---------------|
| Column Registry | `fleet/car-template/column_registry.yml.template` | Canonical schema spine — all table/column definitions | Human + AI (fill template) |
| Hub Registry | `fleet/car-template/REGISTRY.yaml.template` | Hub identity, sub-hubs, spokes, CTB placement | Human + AI (fill template) |
| Branch Map | `fleet/config/ctb.branchmap.yaml` | CTB branch hierarchy, altitude levels, merge flow | Human |
| CTB Governance | `fleet/config/CTB_GOVERNANCE.md` | Table classification, frozen tables, drift detection | Human |
| Table Registry (DB) | `ctb.table_registry` (created by `fleet/migrations/001_ctb_table_registry.sql`) | Runtime mirror of column_registry.yml | Automated (migrations) |

---

## 3. CI Enforcement Locations

| Layer | File | Trigger | Purpose |
|-------|------|---------|---------|
| CI | `.github/workflows/doctrine-enforcement.yml` | push/PR to master | Doctrine audit + pressure test gate + UI builder gate |
| CI | `.github/workflows/reusable-ctb-enforcement.yml` | workflow_call | Reusable CTB structure enforcement |
| CI | `.github/workflows/reusable-fail-closed-gate.yml` | workflow_call | Fail-closed governance (4 gates) |
| CI | `.github/workflows/codeql.yml` | push/PR + weekly | Security scanning |
| CI | `.github/workflows/doctrine-enforcement.yml` (pressure-test-gate) | push/PR to master | Mechanical pressure test — artifact existence + field-level PASS validation |
| Pre-commit | `fleet/scripts/hooks/pre-commit` | git commit | 14 doctrine compliance checks |
| Claude Code | `fleet/prompts/APPLY_DOCTRINE.prompt.md` | Agent session | Structural audit via AI |
| UI Builder | `UI_CONTROL_CONTRACT.json` | UI build | Component discovery gate |

---

## 4. Doctrine File Map

| File | Version | Status | Purpose |
|------|---------|--------|---------|
| `ARCHITECTURE.md` | 2.1.0 | LOCKED | CTB, CC, Hub-Spoke, IMO, Descent, PID, Ownership |
| `ROLLBACK_PROTOCOL.md` | 1.0.0 | LOCKED | Doctrine sync rollback procedure |
| `EXECUTION_SURFACE_LAW.md` | 1.0.0 | LOCKED | Where code can run |
| `CTB_REGISTRY_ENFORCEMENT.md` | 1.5.0 | LOCKED | Registry-first enforcement |
| `FAIL_CLOSED_CI_CONTRACT.md` | 1.1.0 | LOCKED | Fail-closed CI contract |
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

## 6. Agent Contract Locations

| Artifact | Path | Purpose |
|----------|------|---------|
| WORK_PACKET schema | `factory/contracts/work_packet.schema.json` | Governance envelope for planned work — includes `requires_pressure_test`, `flow_contract` |
| CHANGESET schema (archived) | `archive/agents_v0/contracts/changeset.schema.json` | Governance envelope for completed changes — includes `requires_pressure_test` |
| AUDIT_REPORT schema (archived) | `archive/agents_v0/contracts/audit_report.schema.json` | Governance envelope for audit classification |
| ARCH_PRESSURE_REPORT schema (archived) | `archive/agents_v0/contracts/arch_pressure_report.schema.json` | 5 structural invariants (PASS/FAIL) |
| FLOW_PRESSURE_REPORT schema (archived) | `archive/agents_v0/contracts/flow_pressure_report.schema.json` | 5 flow invariants (PASS/FAIL) |
| Planner prompt | `factory/agents/agent-planner/SKILL.md` | WORK_PACKET generation — pressure test classification |
| Builder prompt | `factory/agents/agent-builder/SKILL.md` | Implementation + pressure test artifact production (formerly Worker) |
| Auditor prompt | `factory/agents/agent-auditor/SKILL.md` | Compliance verification — constitutional pressure test gate |
| Orchestrator prompt | `factory/agents/agent-orchestrator/SKILL.md` | Read-only governance inspector — pressure test signal detection |
| DB Agent prompt | `factory/agents/agent-db/SKILL.md` | Database change governance — DDL/DML enforcement |
| Constitutional backbone | `law/constitutional/backbone.md` | CTB backbone authority, altitude hierarchy, elevation triggers |
| Constitutional governance | `law/constitutional/governance.md` | Agent roles, artifact flow, bus enforcement, pressure test routing |
| Protected assets | `law/constitutional/protected_assets.md` | Protected models and folders |

---

## 7. Enforcement Surface Inventory

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
| **Pressure Test (structural)** | `ARCH_PRESSURE_REPORT.json` (5 fields) | Architectural changes | Blocks merge if any field != PASS |
| **Pressure Test (flow)** | `FLOW_PRESSURE_REPORT.json` (5 fields) | Flow/event changes | Blocks merge if any field != PASS |
| **Bus routing** | `governance.md` §Pressure Test Bus Enforcement | Artifact routing | Blocks routing when reports missing or any FAIL |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-20 |
| Last Modified | 2026-03-02 |
| Authority | IMO-Creator (CC-01) |
| Status | ACTIVE |
| Note | This is a repo-root doc, NOT a template. Not tracked in TEMPLATES_MANIFEST.yaml. |
