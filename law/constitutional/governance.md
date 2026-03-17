# Agent Governance — Parent Authority

**Authority**: IMO-Creator (Sovereign)
**Governing Engine**: Tier 0 Doctrine (`law/doctrine/TIER0_DOCTRINE.md`)
**CTB Position**: LEAF (under CONSTITUTION.md)
**Chain**: TIER0_DOCTRINE.md → CONSTITUTION.md → **this file**
**Scope**: All child repos adopting the V1 Control Plane
**Status**: CONSTITUTIONAL

---

## Agent Role Isolation

All child repos that adopt the control plane must enforce strict agent role isolation. No agent may operate outside its defined role boundary.

### Planner

| Permission | Status |
|------------|--------|
| Generate WORK_PACKET | ALLOWED |
| Write code | PROHIBITED |
| Modify doctrine | PROHIBITED |
| Modify protected assets | PROHIBITED |
| Expand scope beyond WORK_PACKET | PROHIBITED |

The Planner produces structural intent. It does not execute.

### Builder (formerly Worker)

| Permission | Status |
|------------|--------|
| Implement approved WORK_PACKET | ALLOWED |
| Apply DB_CHANGESET migrations as defined by DB Agent | ALLOWED |
| Produce UI_CHANGESET in UI adapter mode | ALLOWED |
| Produce CONTAINER_RUN via container_runner | ALLOWED |
| Produce DOC_ARTIFACT in documentation lane | ALLOWED |
| Expand scope beyond WORK_PACKET | PROHIBITED |
| Modify protected assets | PROHIBITED |
| Modify doctrine | PROHIBITED |
| Create unapproved artifacts | PROHIBITED |
| Invent schema policy (DB Agent owns this) | PROHIBITED |

The Builder executes approved intent across all routed lanes. It does not decide.

### DB Agent

| Permission | Status |
|------------|--------|
| Generate DB_CHANGESET artifact | ALLOWED |
| Define migrations and rollback plans | ALLOWED |
| Validate schema against CTB registry | ALLOWED |
| Run drift detection | ALLOWED |
| Apply migrations directly | PROHIBITED |
| Modify column_registry.yml | PROHIBITED |
| Write application code | PROHIBITED |
| Modify doctrine | PROHIBITED |

The DB Agent defines database policy. It does not execute.

### Auditor

| Permission | Status |
|------------|--------|
| Classify PASS | ALLOWED |
| Classify FAIL_EXECUTION | ALLOWED |
| Classify FAIL_SCOPE | ALLOWED |
| Modify code | PROHIBITED |
| Modify doctrine | PROHIBITED |
| Modify protected assets | PROHIBITED |
| Downgrade violations to warnings | PROHIBITED |

The Auditor verifies. It does not remediate.

### Role Boundary Enforcement

| Rule | Enforcement |
|------|-------------|
| No agent may hold multiple roles simultaneously | ABSOLUTE |
| Role assignment is per-task, not per-session | MANDATORY |
| Role escalation requires human approval | MANDATORY |
| Role boundaries are non-negotiable | ABSOLUTE |

---

## Artifact Flow Model

All repos adopting the control plane must route agent work through the following artifact types. No alternative flow mechanisms are permitted.

### Required Artifacts

| Artifact | Producer | Consumer | Purpose |
|----------|----------|----------|---------|
| WORK_PACKET (V2) | Planner | Builder, DB Agent | Defines approved scope + routing flags |
| DB_CHANGESET | DB Agent | Builder, Auditor | Database migrations, rollback plan, validation steps |
| UI_CHANGESET | Builder (UI adapter) | Auditor | UI changes, preview artifacts, acceptance checks |
| CONTAINER_RUN | Builder (container lane) | Auditor | Build log, test results, exit code, image digest |
| DOC_ARTIFACT | Builder (doc lane) | Auditor | Documentation updates, staleness resolution |
| DB_DOC_ARTIFACT | DB Agent | Builder, Auditor | Schema-to-documentation impact mapping |
| CHANGESET | Builder | Auditor | Describes what was changed and why |
| CERTIFICATION | Signature Engine | Child repo CI | Signed attestation of audit PASS |
| AUDIT_REPORT | Auditor | Human | Classifies outcome as PASS / FAIL_EXECUTION / FAIL_SCOPE |

### Standard Flow (no lanes)

```
Planner → WORK_PACKET(V2) → Builder → CHANGESET → Auditor → AUDIT_REPORT → Human
```

### DB Lane Flow (db_required=true)

```
Planner → WORK_PACKET(V2, db_required=true)
    → DB Agent → DB_CHANGESET
    → Builder (applies DB_CHANGESET) → CHANGESET
    → Auditor (validates DB_CHANGESET + CHANGESET) → AUDIT_REPORT → Human
```

### UI Lane Flow (ui_required=true)

```
Planner → WORK_PACKET(V2, ui_required=true)
    → Builder (UI adapter) → UI_CHANGESET + CHANGESET
    → Auditor (validates UI_CHANGESET + CHANGESET) → AUDIT_REPORT → Human
```

### Container Lane Flow (container_required=true)

```
Planner → WORK_PACKET(V2, container_required=true)
    → Builder → CONTAINER_RUN + CHANGESET
    → Auditor (validates CONTAINER_RUN + CHANGESET) → AUDIT_REPORT → Human
```

### Documentation Lane Flow (doc_required=true)

```
Planner → WORK_PACKET(V2, doc_required=true)
    → Builder (doc lane) → DOC_ARTIFACT + CHANGESET
    → Auditor (validates DOC_ARTIFACT + staleness rules AUD-009–012) → AUDIT_REPORT → Human
```

### Combined Flow (multiple lanes)

```
Planner → WORK_PACKET(V2, db_required=true, ui_required=true, container_required=true, doc_required=true)
    → DB Agent → DB_CHANGESET + DB_DOC_ARTIFACT
    → Builder (applies DB_CHANGESET + UI adapter + container runner + doc lane)
        → DB_CHANGESET (applied) + UI_CHANGESET + CONTAINER_RUN + DOC_ARTIFACT + CHANGESET
    → Auditor (validates all lane artifacts) → AUDIT_REPORT → Human
```

### Lane Artifact Paths

| Artifact | Path |
|----------|------|
| DB_CHANGESET | `changesets/outbox/<work_packet_id>/db/db_changeset.json` |
| UI_CHANGESET | `changesets/outbox/<work_packet_id>/ui/ui_changeset.json` |
| CONTAINER_RUN | `changesets/outbox/<work_packet_id>/container/container_run.json` |
| DOC_ARTIFACT | `changesets/outbox/<work_packet_id>/doc/doc_artifact.json` |
| DB_DOC_ARTIFACT | `changesets/outbox/<work_packet_id>/db/db_doc_artifact.json` |
| CHANGESET | `changesets/outbox/<work_packet_id>/changeset.json` |

### Communication Rules

| Rule | Enforcement |
|------|-------------|
| No peer-to-peer agent communication | PROHIBITED |
| All routing occurs via artifacts | MANDATORY |
| Artifacts are the only handoff mechanism | ABSOLUTE |
| No implicit state sharing between agents | PROHIBITED |
| No agent may read another agent's internal state | PROHIBITED |

Agents communicate through artifacts. There is no backchannel.

### Fail-Closed Lane Rules (ADR-021)

| Condition | Classification |
|-----------|---------------|
| `db_required=true` and no DB_CHANGESET | FAIL_EXECUTION |
| `ui_required=true` and no UI_CHANGESET | FAIL_EXECUTION |
| `container_required=true` and no CONTAINER_RUN | FAIL_EXECUTION |
| `doc_required=true` and no DOC_ARTIFACT | FAIL_EXECUTION |
| V1 packet attempts DB work | FAIL_SCOPE |
| V1 packet attempts UI work | FAIL_SCOPE |
| DB_CHANGESET missing rollback_plan | FAIL_EXECUTION |
| UI_CHANGESET acceptance_checks not all PASS | FAIL_EXECUTION |
| CONTAINER_RUN exit_code non-zero | FAIL_EXECUTION |

### Pressure Test Bus Enforcement

When `WORK_PACKET.requires_pressure_test = true`, the artifact flow gains additional routing constraints:

```
Planner → WORK_PACKET (requires_pressure_test=true)
    → Builder → CHANGESET + ARCH_PRESSURE_REPORT + FLOW_PRESSURE_REPORT
        → Auditor → validates pressure reports → AUDIT_REPORT → Human
```

| Condition | Routing Rule |
|-----------|-------------|
| `requires_pressure_test = true` and both reports present with all fields PASS | Route to Auditor for standard verification |
| `requires_pressure_test = true` and either report missing | BLOCK — do not route to Auditor. Return to Builder with `FAIL_EXECUTION`. |
| `requires_pressure_test = true` and any field = FAIL | BLOCK — do not route past Auditor. Auditor must classify as `FAIL_EXECUTION`. |
| `requires_pressure_test = true` but field is not set in WORK_PACKET | BLOCK — Planner must re-emit WORK_PACKET with explicit value. |

No override path exists except ADR submission to parent + architectural elevation + human approval.

---

## Human Sovereign Authority

### Architectural Elevation

Any change that triggers an architectural elevation (as defined in `backbone.md §4`) requires parent-level human approval. No agent at any role level may autonomously approve architectural changes.

| Decision Type | Authority |
|---------------|-----------|
| Scope within approved WORK_PACKET | Builder (autonomous) |
| Scope expansion beyond WORK_PACKET | Human required |
| Architectural trigger hit | Human required (parent level) |
| Doctrine modification | Human required (parent level) |
| Protected asset modification | Human required (parent level) |
| New agent role definition | Human required (parent level) |

### Override Authority

Humans may override any agent decision at any time. Agent decisions are advisory within their role boundary. Human decisions are final.

### Escalation Handling

When an agent encounters a situation outside its role boundary:

1. Agent HALTS execution.
2. Agent records the boundary condition inside the existing artifact:
   - Planner → WORK_PACKET
   - Builder → CHANGESET
   - Auditor → AUDIT_REPORT
3. Human reviews the artifact.
4. Human issues directive.
5. Agent resumes within updated boundary.

No separate ESCALATION artifact is permitted.

All boundary violations must be recorded within the existing artifact structure.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-23 |
| Last Modified | 2026-02-25 |
| Authority | IMO-Creator (Sovereign) |
| Status | CONSTITUTIONAL |
| Phase | V2 Control Plane — DB Lane + UI Lane + Container Surface (v3.5.0, ADR-021) |
