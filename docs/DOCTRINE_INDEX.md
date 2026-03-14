# DOCTRINE INDEX

**Version**: 1.3.0
**Authority**: imo-creator (CC-01 Sovereign)
**Last Updated**: 2026-02-28T00:00:00Z

Single source of truth listing all authoritative doctrine documents. Reference only — no content duplication.

---

## Layer 0 — Foundation (Governs All)

| Document | Location | Purpose |
|----------|----------|---------|
| Layer 0 Doctrine | law/doctrine/LAYER0_DOCTRINE.md | The four irreducible elements, gate mechanism, altitude test. Governs all operations. |

---

## Constitutional Sources

| Document | Path | Purpose |
|----------|------|---------|
| Backbone | `law/constitutional/backbone.md` | Core system identity and invariants |
| Garage | `law/constitutional/garage.md` | Garage control plane constitution |
| Governance | `law/constitutional/governance.md` | Governance model and enforcement mechanisms |
| Protected Assets | `law/constitutional/protected_assets.md` | Immutable asset registry |
| IMO-Creator Charter | `law/constitutional/imo_creator_charter.md` | Sovereign charter — 10 sections, LOCKED (v1.0.0) |
| Prompt and Skills Bay | `law/constitutional/PROMPT_SKILLS_BAY_CONSTITUTION.md` | PSB governance — Transformation Law, artifacts, audit requirements, Garage relationship (v1.0.0) — PSB-CONST-001 |

---

## Structural Doctrine

| Document | Path | Purpose |
|----------|------|---------|
| Architecture (CTB + IMO + Altitude) | `law/doctrine/ARCHITECTURE.md` | CTB Constitutional Law — CTB, CC, Hub-Spoke, IMO, Descent, PID (v2.1.0) |
| CTB Branchmap | `fleet/config/ctb.branchmap.yaml` | CTB branch structure definition |
| CTB Registry Enforcement | `law/doctrine/CTB_REGISTRY_ENFORCEMENT.md` | Registry-first enforcement + RAW lockdown + vendor JSON + bootstrap (v1.5.0) |
| Execution Surface Law | `law/doctrine/EXECUTION_SURFACE_LAW.md` | Execution surface containment (v1.0.0) |
| Fail-Closed CI Contract | `law/doctrine/FAIL_CLOSED_CI_CONTRACT.md` | Fail-closed CI + bootstrap guarantees (v1.1.0) |

**Note**: `ARCHITECTURE.md` consolidates CTB, IMO topology, and altitude model into a single document. `CANONICAL_ARCHITECTURE_DOCTRINE.md`, `HUB_SPOKE_ARCHITECTURE.md`, and `ALTITUDE_DESCENT_MODEL.md` exist as redirects only.

---

## Identity & Operation Doctrine

| Document | Path | Purpose |
|----------|------|---------|
| HEIR Schema | `factory/contracts/heir.schema.json` | Hub Environment Identity Record — flat 8-field validation schema (v1.0.0) |
| HEIR Template | `law/integrations/heir.doctrine.yaml.template` | Legacy HEIR template (nested format — Garage validates against flat schema) |
| HEIR Integration Spec | `law/integrations/HEIR.md` | HEIR integration specification |
| ORBT Error Schema | `factory/contracts/orbt_error.schema.json` | Operate/Repair/Build/Train telemetry artifact schema (v1.0.0) |
| IMO Law IDs | `law/registry/imo_law_ids.json` | IMO-01 through IMO-06 data flow law definitions (v1.0.0) |
| Master ERROR Table Schema | `factory/contracts/error_table.schema.json` | Immutable fault registry — EVENT classification, INSERT-only (v1.0.0) |

---

## Agent Contracts

| Document | Path | Purpose |
|----------|------|---------|
| Orchestrator | `factory/agents/agent-orchestrator/SKILL.md` | Orchestrator agent contract — deterministic intake + ID minting (v1.0.0) |
| Planner | `factory/agents/agent-planner/SKILL.md` | Planner agent contract (v2.3.0) |
| Builder | `factory/agents/agent-builder/SKILL.md` | Builder agent contract (v2.5.0) (formerly Worker) |
| Auditor | `factory/agents/agent-auditor/SKILL.md` | Auditor agent contract (v2.5.0) |

---

## Runtime Contracts

| Document | Path | Purpose |
|----------|------|---------|
| Mount Contract | `factory/runtime/repo_mount/mount_contract.json` | Repository mount protocol (v2.3.0) |
| Execution Runner | `factory/runtime/execution_runner/runner_contract.json` | Execution pipeline — 9 phases (v1.1.0) |
| Sanitation Contract | `factory/runtime/sanitation/sanitation_contract.json` | Post-audit workspace sanitation rules (v1.0.0) |
| Orchestration | `app/garage/orchestration_contract.json` | Garage orchestration pipeline (v1.1.0) |

---

## Certification & Schemas

| Document | Path | Purpose |
|----------|------|---------|
| Certification Schema | `factory/contracts/certification.schema.json` | Signed certification artifact + capa_required field (v1.1.0) |
| Sanitation Report Schema | `factory/contracts/sanitation_report.schema.json` | Post-audit sanitation report (v1.0.0) |
| Signature Engine | `factory/certification/signature_engine/engine_contract.json` | Cryptographic signing contract (v1.1.0) |

---

## Canonical Identity Mapping (Factory Invariant)

Process ID = HEIR identity anchor (stable repo identity)
Operational ID = execution instance context
ORBT mode = operational intent classification
Altitude = inspection depth / context scope

These mappings are fixed.
They must not be reinterpreted across agents or repos.

---

## Document Control

| Field | Value |
|-------|-------|
| doctrine_index_version | 1.3.0 |
| last_updated | 2026-02-28T00:00:00Z |
| Authority | imo-creator (CC-01 Sovereign) |
