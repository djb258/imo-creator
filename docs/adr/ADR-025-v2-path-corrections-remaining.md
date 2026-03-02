# ADR: V2 Path Corrections — Remaining Stale Agent References

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 3.4.1 |
| **CC Layer** | CC-01 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-025 |
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
| CC-01 (Sovereign) | [x] | Locked templates and sovereign operational docs |
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

ADR-024 corrected 10 broken file references in CLAUDE.md after the Garage V2 restructure. A follow-up full-repo grep revealed that 3 additional files still contain stale `templates/agents/` references:

1. **`docs/SYSTEM_MANIFEST.md`** — Operational doc (not locked). Entire "Agent Contracts" section (lines 55-67) and authority chain tree (lines 140-145) reference `templates/agents/` paths that no longer exist.

2. **`templates/checklists/REPO_HOUSEKEEPING.md`** — LOCKED template (v1.1.0). Check 7 bash scripts (lines 242-250) iterate over `templates/agents/contracts/*.json` and `templates/agents/$role/master_prompt.md`. Check 8 grep pattern (lines 274-277) searches for `templates/agents/` references. Traceability table (line 653) references `templates/agents/contracts/`.

3. **`templates/checklists/HUB_COMPLIANCE.md`** — LOCKED template (v1.1.0). Traceability Reference table (lines 821-822) references `templates/agents/contracts/arch_pressure_report.schema.json` and `templates/agents/contracts/flow_pressure_report.schema.json`.

**Additionally flagged (NO FIX):** `templates/integrations/DOPPLER.md` is a locked template that does not document the sovereign vault pattern (`FLEET_SECRETS_MANIFEST.yaml`), `fleet-secrets-sync.sh` push-down scripts, or config branch architecture. This is a known documentation gap that will require a separate ADR when DOPPLER.md is updated.

All stale references trace back to the same V2 restructure that ADR-024 addressed. The `archive/agents_v0/` directory correctly contains stale references (those are expected — archived V0 agents reference their original paths).

---

## Decision

Update the 3 affected files to correct all remaining stale `templates/agents/` references:

### SYSTEM_MANIFEST.md (not locked)

| Broken Reference | Correction |
|---|---|
| Section header "Agent Contracts (templates/agents/)" | "Agent Contracts & Prompts (V2)" |
| `templates/agents/contracts/work_packet.schema.json` | `sys/contracts/work_packet.schema.json` |
| `templates/agents/contracts/changeset.schema.json` | `archive/agents_v0/contracts/changeset.schema.json` (archived) |
| `templates/agents/contracts/audit_report.schema.json` | `archive/agents_v0/contracts/audit_report.schema.json` (archived) |
| `templates/agents/contracts/arch_pressure_report.schema.json` | `archive/agents_v0/contracts/arch_pressure_report.schema.json` (archived) |
| `templates/agents/contracts/flow_pressure_report.schema.json` | `archive/agents_v0/contracts/flow_pressure_report.schema.json` (archived) |
| `templates/agents/planner/master_prompt.md` | `ai/agents/planner/master_prompt.md` |
| `templates/agents/builder/master_prompt.md` | `ai/agents/worker/master_prompt.md` (renamed) |
| `templates/agents/auditor/master_prompt.md` | `ai/agents/auditor/master_prompt.md` |
| `templates/agents/control_panel/master_prompt.md` | `ai/agents/orchestrator/master_prompt.md` (renamed) |
| Authority chain tree `templates/agents/contracts/` | `sys/contracts/` (active) + `archive/agents_v0/contracts/` (archived) |

### REPO_HOUSEKEEPING.md (LOCKED — v1.1.0 → v1.2.0)

| Location | Change |
|---|---|
| Check 7 contract loop (line 242) | `templates/agents/contracts/*.json` → `sys/contracts/*.json` |
| Check 7 prompt loop (lines 247-249) | Update roles list and paths to `ai/agents/$role/master_prompt.md` |
| Check 8 grep pattern (lines 274-277) | Update comment and pattern to check for `ai/agents/` and `sys/contracts/` |
| Traceability table (line 653) | `templates/agents/contracts/` → `sys/contracts/` |
| Version | 1.1.0 → 1.2.0 |

### HUB_COMPLIANCE.md (LOCKED — v1.1.0 → v1.2.0)

| Location | Change |
|---|---|
| Line 821 | `templates/agents/contracts/arch_pressure_report.schema.json` → `archive/agents_v0/contracts/arch_pressure_report.schema.json` |
| Line 822 | `templates/agents/contracts/flow_pressure_report.schema.json` → `archive/agents_v0/contracts/flow_pressure_report.schema.json` |
| Version | 1.1.0 → 1.2.0 |

### DOPPLER.md (LOCKED — NO FIX, FLAG ONLY)

Known documentation gap. Does not cover sovereign vault, fleet-secrets-sync.sh, or config branch patterns. Separate ADR required when updating.

WHY: These files instruct both AI agents and humans. Stale paths cause housekeeping audit failures (Check 7, Check 8), broken script execution in child repos, and incorrect traceability chains. This is a continuation of the ADR-024 documentation accuracy effort.

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Fix only unlocked files | Leaves locked templates with broken paths — child repos copying these templates get broken scripts |
| Do Nothing | Housekeeping audit continues to flag stale refs. Scripts in child repos fail. |
| Update DOPPLER.md too | Scope creep — DOPPLER.md needs a content rewrite, not just path fixes. Separate ADR. |

---

## Consequences

### Enables

- Full-repo grep for `templates/agents/` returns 0 hits outside `archive/` and ADR docs
- Housekeeping audit Checks 7 and 8 pass cleanly in child repos
- Traceability chains in both checklists point to actual files
- Clean documentation baseline before any downstream sync

### Prevents

- Child repos inheriting broken bash scripts from REPO_HOUSEKEEPING.md
- False BROKEN reports when running Check 7 reference integrity audit
- Traceability references pointing to non-existent files

---

## PID Impact (if CC-04 affected)

| Field | Value |
|-------|-------|
| **New PID required** | [ ] Yes / [x] No |
| **PID pattern change** | [ ] Yes / [x] No |
| **Audit trail impact** | None — documentation and script path corrections only |

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Rate Limit | N/A | |
| Timeout | N/A | |
| Kill Switch | N/A | |

---

## Rollback

Revert all 3 files via `git revert`. No cascading effects — documentation and script path corrections only. Locked template versions revert from 1.2.0 to 1.1.0.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md |
| PRD | N/A (sovereign maintenance) |
| Work Items | Documentation Audit 2026-03-02, continuation of ADR-024 |
| Related ADR | ADR-024 (CLAUDE.md path corrections) |
| PR(s) | |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-01) | Human (sovereign authority) | 2026-03-02 |
| Reviewer | Claude Code (auditor) | 2026-03-02 |
