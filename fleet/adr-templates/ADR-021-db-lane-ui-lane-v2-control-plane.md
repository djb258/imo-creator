# ADR: Introduction of DB Lane and UI Lane (V2 Control Plane)

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 3.5.0 |
| **CC Layer** | CC-01 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-021 |
| **Status** | [x] Accepted |
| **Date** | 2026-02-25 |

---

## Owning Hub (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | imo-creator |
| **Hub Name** | Garage Control Plane |
| **Hub ID** | CC-01 (Sovereign) |

---

## CC Layer Scope

| Layer | Affected | Description |
|-------|----------|-------------|
| CC-01 (Sovereign) | [x] | New artifact schemas, agent routing, enforcement rules |
| CC-02 (Hub) | [x] | Child repos receive certification with DB/UI lane artifacts |
| CC-03 (Context) | [ ] | |
| CC-04 (Process) | [ ] | |

---

## IMO Layer Scope

| Layer | Affected |
|-------|----------|
| I — Ingress | [x] |
| M — Middle | [x] |
| O — Egress | [x] |

---

## Constant vs Variable

| Classification | Value |
|----------------|-------|
| **This decision defines** | [x] Constant (structure/meaning) |
| **Mutability** | [x] ADR-gated |

---

## Context

The V1 control plane routes all work through a single Builder lane. Database schema changes and UI changes flow through the same execution path as application code changes. This creates three problems:

1. **DB policy leakage**: The Builder agent makes schema decisions that should be governed by a dedicated DB specialist with CTB registry enforcement knowledge.
2. **UI surface ambiguity**: UI work spans three distinct surfaces (local repo, Lovable.dev, Figma) with different execution models, but the Builder treats them identically.
3. **Audit blind spots**: The Auditor cannot enforce DB-specific or UI-specific rules when all artifacts look like generic CHANGESETs.

The Garage refactor (v3.5.0) centralized agents and introduced certification. This ADR extends the control plane with dedicated lanes while preserving backward compatibility.

---

## Decision

Introduce two new artifact types and corresponding execution lanes:

### New Artifact: DB_CHANGESET

- Schema: `sys/contracts/db_changeset.schema.json`
- Producer: DB Agent (`ai/agents/db_agent/`)
- Consumer: Worker (applies migrations), Auditor (validates)
- Output path: `changesets/outbox/<work_packet_id>/db/`
- Contains: migrations, schema_diff_artifact, rollback_plan, validation_steps, risk_class

### New Artifact: UI_CHANGESET

- Schema: `sys/contracts/ui_changeset.schema.json`
- Producer: Worker (UI adapter mode)
- Consumer: Auditor (validates)
- Output path: `changesets/outbox/<work_packet_id>/ui/`
- Contains: ui_surface, ui_target, changes, preview_artifacts, acceptance_checks

### New Artifact: CONTAINER_RUN

- Schema: `sys/contracts/container_run.schema.json`
- Producer: Worker (container adapter mode)
- Consumer: Auditor (validates)
- Contains: container_profile, container_target, build_log, test_results, exit_code

### WORK_PACKET V2 Routing

V2 extends V1 with routing flags. V1 fields preserved. New fields:

| Flag | Type | Conditional Requirements |
|------|------|-------------------------|
| `db_required` | boolean | If true: `db_targets` and `db_system` required |
| `db_targets` | array | Required if db_required=true |
| `db_system` | enum (neon, firebase, bigquery) | Required if db_required=true |
| `ui_required` | boolean | If true: `ui_surface` and `ui_target` required |
| `ui_surface` | enum (local, lovable, figma) | Required if ui_required=true |
| `ui_target` | string | Required if ui_required=true |
| `container_required` | boolean | If true: `container_profile` and `container_target` required |
| `container_profile` | enum (node, python, mixed) | Required if container_required=true |
| `container_target` | string | Required if container_required=true |

### Separation of DB Policy from Worker

The DB Agent generates the DB_CHANGESET (migrations, rollback plan, validation steps). The Worker applies the DB_CHANGESET exactly as defined. The Worker does not invent schema policy. This separation ensures CTB registry enforcement is maintained by a specialist agent.

### UI Adapter Model

The UI lane is an adapter on the Worker, not a standalone agent. The Worker operates in "UI adapter mode" when `ui_required=true`. This is intentional — UI work does not yet warrant a full agent with its own master prompt. The adapter model routes to the correct surface (local, Lovable.dev, Figma) while keeping execution within the Worker's existing envelope.

### Flow Updates

Standard (no lanes):
```
Planner → WORK_PACKET → Worker → CHANGESET → Auditor → AUDIT_REPORT
```

DB lane:
```
Planner → WORK_PACKET(V2, db_required=true)
    → DB Agent → DB_CHANGESET
    → Worker (applies DB_CHANGESET) → CHANGESET
    → Auditor → AUDIT_REPORT
```

UI lane:
```
Planner → WORK_PACKET(V2, ui_required=true)
    → Worker (UI adapter) → UI_CHANGESET + CHANGESET
    → Auditor → AUDIT_REPORT
```

Both lanes:
```
Planner → WORK_PACKET(V2, db_required=true, ui_required=true)
    → DB Agent → DB_CHANGESET
    → Worker (applies DB_CHANGESET + UI adapter) → UI_CHANGESET + CHANGESET
    → Auditor → AUDIT_REPORT
```

Container lane (additive):
```
Worker (container_required=true) → CONTAINER_RUN artifact
    → Auditor validates CONTAINER_RUN
```

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Standalone UI Agent | Premature. UI work does not yet have enough distinct policy to warrant a full agent. Adapter model is sufficient and avoids agent sprawl. |
| DB logic stays in Worker | Violates separation of concerns. Worker should not make schema policy decisions. CTB registry enforcement requires specialist knowledge. |
| New top-level directories | Violates CTB topology. All new artifacts use existing `sys/contracts/` and `changesets/` paths. |
| Do Nothing | DB and UI blind spots in audit remain. Certification cannot enforce lane-specific rules. |

---

## Consequences

### Enables

- Dedicated DB governance with CTB registry enforcement
- UI work routed to correct surface (local, Lovable.dev, Figma)
- Auditor can enforce lane-specific rules (DB_CHANGESET rollback plan, UI_CHANGESET preview artifacts)
- Container-based testing and builds as a certified execution surface
- Backward compatibility preserved — V1 work packets still route through standard flow

### Prevents

- DB policy decisions by non-specialist agents
- Uncertified UI changes across multiple surfaces
- Audit blind spots for schema migrations and UI changes
- Uncertified container execution results

---

## PID Impact (if CC-04 affected)

| Field | Value |
|-------|-------|
| **New PID required** | [x] No |
| **PID pattern change** | [x] No |
| **Audit trail impact** | New artifact types added to audit trail. Existing PID patterns unchanged. |

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Rate Limit | One WORK_PACKET per pipeline run | CC-01 |
| Timeout | Per execution_type (audit:300s, refactor:600s, build:900s, migrate:1200s) | CC-04 |
| Kill Switch | DB Agent validation failure blocks Worker execution | CC-01 |

---

## Rollback

If DB/UI lanes cause issues:
1. Remove routing flags from WORK_PACKET V2 schema (revert to V1 fields only).
2. Remove DB_CHANGESET and UI_CHANGESET schemas.
3. Revert agent prompts to pre-ADR-021 versions.
4. Standard flow resumes. V1 backward compatibility ensures no breakage.

Container rollback:
1. Remove container_run.schema.json and container_runner contract.
2. Remove container routing flags from WORK_PACKET V2.
3. Worker reverts to non-container execution.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md v2.1.0, CTB_REGISTRY_ENFORCEMENT.md v1.5.0 |
| PRD | N/A (infrastructure, not feature) |
| Work Items | Garage V2 extension — DB lane + UI lane + container surface |
| PR(s) | Pending |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-02) | Human (Sovereign) | 2026-02-25 |
| Reviewer | | |
