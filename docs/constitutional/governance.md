# Agent Governance — Parent Authority

**Authority**: IMO-Creator (Sovereign)
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

### Builder

| Permission | Status |
|------------|--------|
| Implement approved WORK_PACKET | ALLOWED |
| Expand scope beyond WORK_PACKET | PROHIBITED |
| Modify protected assets | PROHIBITED |
| Modify doctrine | PROHIBITED |
| Create unapproved artifacts | PROHIBITED |

The Builder executes approved intent. It does not decide.

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
| WORK_PACKET | Planner | Builder | Defines approved scope of work |
| CHANGESET | Builder | Auditor | Describes what was changed and why |
| AUDIT_REPORT | Auditor | Human | Classifies outcome as PASS / FAIL_EXECUTION / FAIL_SCOPE |

### Flow Sequence

```
Planner → WORK_PACKET → Builder → CHANGESET → Auditor → AUDIT_REPORT → Human
```

### Communication Rules

| Rule | Enforcement |
|------|-------------|
| No peer-to-peer agent communication | PROHIBITED |
| All routing occurs via artifacts | MANDATORY |
| Artifacts are the only handoff mechanism | ABSOLUTE |
| No implicit state sharing between agents | PROHIBITED |
| No agent may read another agent's internal state | PROHIBITED |

Agents communicate through artifacts. There is no backchannel.

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
| Phase | V1 Control Plane — Phase 2 Pressure Test Enforcement (v3.4.0) |
