# DOCTRINE INDEX

**Version**: 1.2.0
**Authority**: imo-creator (CC-01 Sovereign)
**Last Updated**: 2026-02-25T00:00:00Z

Single source of truth listing all authoritative doctrine documents. Reference only — no content duplication.

---

## Constitutional Sources

| Document | Path | Purpose |
|----------|------|---------|
| Backbone | `docs/constitutional/backbone.md` | Core system identity and invariants |
| Garage | `docs/constitutional/garage.md` | Garage control plane constitution |
| Governance | `docs/constitutional/governance.md` | Governance model and enforcement mechanisms |
| Protected Assets | `docs/constitutional/protected_assets.md` | Immutable asset registry |
| IMO-Creator Charter | `docs/constitutional/imo_creator_charter.md` | Sovereign charter — 10 sections, LOCKED (v1.0.0) |

---

## Structural Doctrine

| Document | Path | Purpose |
|----------|------|---------|
| Architecture (CTB + IMO + Altitude) | `templates/doctrine/ARCHITECTURE.md` | CTB Constitutional Law — CTB, CC, Hub-Spoke, IMO, Descent, PID (v2.1.0) |
| CTB Branchmap | `templates/config/ctb.branchmap.yaml` | CTB branch structure definition |
| CTB Registry Enforcement | `templates/doctrine/CTB_REGISTRY_ENFORCEMENT.md` | Registry-first enforcement + RAW lockdown + vendor JSON + bootstrap (v1.5.0) |
| Execution Surface Law | `templates/doctrine/EXECUTION_SURFACE_LAW.md` | Execution surface containment (v1.0.0) |
| Fail-Closed CI Contract | `templates/doctrine/FAIL_CLOSED_CI_CONTRACT.md` | Fail-closed CI + bootstrap guarantees (v1.1.0) |

**Note**: `ARCHITECTURE.md` consolidates CTB, IMO topology, and altitude model into a single document. `CANONICAL_ARCHITECTURE_DOCTRINE.md`, `HUB_SPOKE_ARCHITECTURE.md`, and `ALTITUDE_DESCENT_MODEL.md` exist as redirects only.

---

## Identity & Operation Doctrine

| Document | Path | Purpose |
|----------|------|---------|
| HEIR Schema | `sys/contracts/heir.schema.json` | Hub Environment Identity Record — flat 8-field validation schema (v1.0.0) |
| HEIR Template | `templates/integrations/heir.doctrine.yaml.template` | Legacy HEIR template (nested format — Garage validates against flat schema) |
| HEIR Integration Spec | `templates/integrations/HEIR.md` | HEIR integration specification |
| ORBT Error Schema | `sys/contracts/orbt_error.schema.json` | Operate/Repair/Build/Train telemetry artifact schema (v1.0.0) |

---

## Agent Contracts

| Document | Path | Purpose |
|----------|------|---------|
| Orchestrator | `ai/agents/orchestrator/master_prompt.md` | Orchestrator agent contract — deterministic intake + ID minting (v1.0.0) |
| Planner | `ai/agents/planner/master_prompt.md` | Planner agent contract (v2.3.0) |
| Worker | `ai/agents/worker/master_prompt.md` | Worker agent contract (v2.5.0) |
| Auditor | `ai/agents/auditor/master_prompt.md` | Auditor agent contract (v2.5.0) |

---

## Runtime Contracts

| Document | Path | Purpose |
|----------|------|---------|
| Mount Contract | `sys/runtime/repo_mount/mount_contract.json` | Repository mount protocol (v2.3.0) |
| Execution Runner | `sys/runtime/execution_runner/runner_contract.json` | Execution pipeline — 9 phases (v1.1.0) |
| Sanitation Contract | `sys/runtime/sanitation/sanitation_contract.json` | Post-audit workspace sanitation rules (v1.0.0) |
| Orchestration | `app/garage/orchestration_contract.json` | Garage orchestration pipeline (v1.1.0) |

---

## Certification & Schemas

| Document | Path | Purpose |
|----------|------|---------|
| Certification Schema | `sys/contracts/certification.schema.json` | Signed certification artifact (v1.0.0) |
| Sanitation Report Schema | `sys/contracts/sanitation_report.schema.json` | Post-audit sanitation report (v1.0.0) |
| Signature Engine | `sys/certification/signature_engine/engine_contract.json` | Cryptographic signing contract (v1.1.0) |

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
| doctrine_index_version | 1.2.0 |
| last_updated | 2026-02-25T00:00:00Z |
| Authority | imo-creator (CC-01 Sovereign) |
