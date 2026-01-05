# Hub Change

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | |
| **CC Layer** | CC-02 |

---

## Hub Identity (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | _(CC-01 reference)_ |
| **Hub Name** | |
| **Hub ID** | |
| **PID Pattern** | _(CC-04 execution scope)_ |

---

## Change Type

- [ ] New Hub
- [ ] Ingress Change (I layer)
- [ ] Middle Change (M layer — logic, state, tools)
- [ ] Egress Change (O layer)
- [ ] Guard Rail Change
- [ ] Kill Switch Change

---

## Scope Declaration

### IMO Layers Affected

| Layer | Modified |
|-------|----------|
| I — Ingress | [ ] |
| M — Middle | [ ] |
| O — Egress | [ ] |

### Spokes Affected

| Spoke Name | Type | Direction |
|------------|------|-----------|
| | I | Inbound |
| | O | Outbound |

---

## Summary

_What changed and why? Reference the approved PRD/ADR — do not define architecture here._

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | CANONICAL_ARCHITECTURE_DOCTRINE.md |
| PRD | |
| Sub-PRD | |
| ADR | |
| Work Item | |

---

## CC Layer Scope

| CC Layer | Affected | Description |
|----------|----------|-------------|
| CC-01 (Sovereign) | [ ] | |
| CC-02 (Hub) | [ ] | |
| CC-03 (Context) | [ ] | |
| CC-04 (Process) | [ ] | |

---

## Compliance Checklist

### Doctrine Compliance
- [ ] Doctrine version declared
- [ ] Sovereign reference present (CC-01)
- [ ] Authorization matrix honored (no upward writes)

### Hub Compliance (CC-02)
- [ ] Hub PRD exists and is current
- [ ] ADR approved for each decision (CC-03)
- [ ] Work item linked
- [ ] No cross-hub logic introduced
- [ ] No sideways hub calls introduced
- [ ] Spokes contain no logic, tools, or state (CC-03)
- [ ] Kill switch tested
- [ ] Rollback plan documented

---

## Promotion Gates

| Gate | Requirement | Passed |
|------|-------------|--------|
| G1 | PRD approved | [ ] |
| G2 | ADR approved (if applicable) | [ ] |
| G3 | Linear issue assigned | [ ] |
| G4 | Tests pass | [ ] |
| G5 | Compliance checklist complete | [ ] |

---

## Rollback

_How is this change reversed if it fails?_
