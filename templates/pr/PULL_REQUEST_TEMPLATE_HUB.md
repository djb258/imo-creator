# Hub Change

## Hub Identity

| Field | Value |
|-------|-------|
| **Hub Name** | |
| **Hub ID** | |
| **Process ID** | |

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
| PRD | |
| Sub-PRD | |
| ADR | |
| Linear Issue | |

---

## Compliance Checklist

- [ ] Hub PRD exists and is current
- [ ] ADR approved (if decision required)
- [ ] Linear issue linked
- [ ] No cross-hub logic introduced
- [ ] No sideways hub calls introduced
- [ ] Spokes contain no logic, tools, or state
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
