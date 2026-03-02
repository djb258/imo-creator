# ADR: CLAUDE.md Path Corrections — Agent and Contract References

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 3.4.1 |
| **CC Layer** | CC-01 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-024 |
| **Status** | [x] Proposed / [ ] Accepted / [ ] Superseded / [ ] Deprecated |
| **Date** | 2026-03-02 |

---

## Owning Hub (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | imo-creator |
| **Hub Name** | Sovereign (CC-01) |
| **Hub ID** | imo-creator |

---

## CC Layer Scope

| Layer | Affected | Description |
|-------|----------|-------------|
| CC-01 (Sovereign) | [x] | CLAUDE.md is a sovereign governance file |
| CC-02 (Hub) | [ ] | |
| CC-03 (Context) | [ ] | |
| CC-04 (Process) | [ ] | |

---

## IMO Layer Scope

| Layer | Affected |
|-------|----------|
| I — Ingress | [ ] |
| M — Middle | [ ] |
| O — Egress | [ ] |

---

## Constant vs Variable

| Classification | Value |
|----------------|-------|
| **This decision defines** | [x] Constant (structure/meaning) |
| **Mutability** | [x] ADR-gated |

---

## Context

Repo Housekeeping audit (2026-03-02) detected 10 broken file references in CLAUDE.md. The repo underwent structural reorganization where:

1. Agent prompts moved from `templates/agents/` to `ai/agents/` (Garage V2 restructure)
2. Agent contracts moved from `templates/agents/contracts/` to `sys/contracts/` (active) and `archive/agents_v0/contracts/` (legacy)
3. `builder` and `control_panel` agents were removed (replaced by `worker` and `orchestrator`)
4. `docs/BOOTSTRAP_AUDIT.md` and `docs/CTB_DRIFT_BASELINE.json` are child-repo outputs, not sovereign files — they were incorrectly referenced as if they exist in imo-creator

CLAUDE.md was not updated to reflect these moves, causing AI agents to reference non-existent paths.

---

## Decision

Update CLAUDE.md to correct all broken file references:

| Broken Reference | Correction |
|---|---|
| `templates/agents/planner/master_prompt.md` | `ai/agents/planner/master_prompt.md` |
| `templates/agents/builder/master_prompt.md` | Remove (builder replaced by worker) |
| `templates/agents/auditor/master_prompt.md` | `ai/agents/auditor/master_prompt.md` |
| `templates/agents/control_panel/master_prompt.md` | Remove (replaced by orchestrator) |
| `templates/agents/contracts/work_packet.schema.json` | `sys/contracts/work_packet.schema.json` |
| `templates/agents/contracts/changeset.schema.json` | Remove (archived to agents_v0) |
| `templates/agents/contracts/arch_pressure_report.schema.json` | Remove (archived to agents_v0) |
| `templates/agents/contracts/flow_pressure_report.schema.json` | Remove (archived to agents_v0) |
| `docs/BOOTSTRAP_AUDIT.md` | Annotate as child-repo output |
| `docs/CTB_DRIFT_BASELINE.json` | Annotate as child-repo output |

WHY: CLAUDE.md is the primary AI instruction file. Broken references cause AI agents to hallucinate paths, attempt to read non-existent files, and operate on stale mental models. This is a documentation accuracy issue, not a structural change.

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Move agents back to templates/agents/ | Agents are operational code (ai/ branch), not templates. Wrong CTB placement. |
| Do Nothing | AI agents continue operating with broken path references. Causes repeated errors. |

---

## Consequences

### Enables

- AI agents correctly locate agent prompts and contracts
- Housekeeping audit Check 7 passes (0 broken refs)
- Accurate mental model for all downstream AI operations

### Prevents

- AI agents attempting to read non-existent files
- Confusion about agent architecture (builder/control_panel no longer exist)

---

## PID Impact (if CC-04 affected)

| Field | Value |
|-------|-------|
| **New PID required** | [ ] Yes / [x] No |
| **PID pattern change** | [ ] Yes / [x] No |
| **Audit trail impact** | None — documentation-only change |

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Rate Limit | N/A | |
| Timeout | N/A | |
| Kill Switch | N/A | |

---

## Rollback

Revert CLAUDE.md to pre-change state via `git revert`. No cascading effects — this is a documentation-only change.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md |
| PRD | N/A (sovereign maintenance) |
| Work Items | Repo Housekeeping Audit 2026-03-02, Finding #1 (HIGH) |
| PR(s) | |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-01) | Human (sovereign authority) | 2026-03-02 |
| Reviewer | Claude Code (auditor) | 2026-03-02 |
