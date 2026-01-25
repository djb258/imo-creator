# Hub Compliance Checklist

This checklist must be completed before any hub can ship.
No exceptions. No partial compliance.

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | |
| **CC Layer** | CC-02 |

---

## Priority Definitions

| Priority | Meaning | Ship Without? |
|----------|---------|---------------|
| **CRITICAL** | Blocks ship | NO — must be checked |
| **HIGH** | Strongly recommended | Only with ADR exception |
| **MEDIUM** | Nice to have | Yes, but document why |

---

## Canonical Chain (CC) Compliance

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Sovereign declared (CC-01 reference) |
| CRITICAL | [ ] Hub ID assigned (unique, immutable) (CC-02) |
| CRITICAL | [ ] Authorization matrix honored (no upward writes) |
| CRITICAL | [ ] Doctrine version declared |
| HIGH | [ ] All child contexts scoped to CC-03 |
| HIGH | [ ] All processes scoped to CC-04 |

---

## Hub Identity (CC-02)

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Hub ID assigned (unique, immutable) |
| CRITICAL | [ ] Process ID pattern defined (CC-04 execution scope) |
| HIGH | [ ] Hub Name defined |
| HIGH | [ ] Hub Owner assigned |

---

## CTB Placement

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] CTB path defined (Trunk / Branch / Leaf) |
| CRITICAL | [ ] No forbidden folders (utils, helpers, common, shared, lib, misc) |
| HIGH | [ ] Branch level specified (sys / ui / ai / data / app) |
| MEDIUM | [ ] Parent hub identified (if nested hub) |

---

## IMO Structure

### Ingress (I Layer)

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Ingress contains no logic |
| CRITICAL | [ ] Ingress contains no state |
| HIGH | [ ] Ingress points defined |
| MEDIUM | [ ] UI (if present) is dumb ingress only |

### Middle (M Layer)

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] All logic resides in M layer |
| CRITICAL | [ ] All state resides in M layer |
| CRITICAL | [ ] All decisions occur in M layer |
| CRITICAL | [ ] Tools scoped to M layer only |

### Egress (O Layer)

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Egress contains no logic |
| CRITICAL | [ ] Egress contains no state |
| HIGH | [ ] Egress points defined |

---

## Spokes

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] All spokes typed as I or O only |
| CRITICAL | [ ] No spoke contains logic |
| CRITICAL | [ ] No spoke contains state |
| CRITICAL | [ ] No spoke owns tools |
| CRITICAL | [ ] No spoke performs decisions |

---

## Tools

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] All tools scoped inside this hub |
| CRITICAL | [ ] No tools exposed to spokes |
| HIGH | [ ] All tools have Doctrine ID |
| HIGH | [ ] All tools have ADR reference |

---

## Cross-Hub Isolation

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] No sideways hub-to-hub calls |
| CRITICAL | [ ] No cross-hub logic |
| CRITICAL | [ ] No shared mutable state between hubs |

---

## Guard Rails

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Rate limits defined |
| CRITICAL | [ ] Timeouts defined |
| HIGH | [ ] Validation implemented |
| HIGH | [ ] Permissions enforced |

---

## Kill Switch

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Kill switch endpoint defined |
| CRITICAL | [ ] Kill switch activation criteria documented |
| HIGH | [ ] Kill switch tested and verified |
| HIGH | [ ] Emergency contact assigned |

---

## Rollback

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Rollback plan documented |
| HIGH | [ ] Rollback tested and verified |

---

## Observability

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] Logging implemented |
| HIGH | [ ] Metrics implemented |
| HIGH | [ ] Alerts configured |
| CRITICAL | [ ] Shipping without observability is forbidden |

---

## Failure Modes

| Priority | Check |
|----------|-------|
| HIGH | [ ] Failure modes documented |
| HIGH | [ ] Severity levels assigned |
| MEDIUM | [ ] Remediation steps defined |

---

## Human Override

| Priority | Check |
|----------|-------|
| HIGH | [ ] Override conditions defined |
| HIGH | [ ] Override approvers assigned |

---

## Traceability

| Priority | Check |
|----------|-------|
| CRITICAL | [ ] PRD exists and is current (CC-02) |
| CRITICAL | [ ] ADR exists for each decision (CC-03) |
| HIGH | [ ] Work item linked |
| HIGH | [ ] PR linked (CC-04) |
| HIGH | [ ] Canonical Doctrine referenced |

---

## CC Layer Verification

| Priority | Layer | Check |
|----------|-------|-------|
| CRITICAL | CC-01 (Sovereign) | [ ] Reference declared |
| CRITICAL | CC-02 (Hub) | [ ] Identity, PRD, CTB complete |
| HIGH | CC-03 (Context) | [ ] ADRs, spokes, guard rails defined |
| HIGH | CC-04 (Process) | [ ] PIDs, code, tests implemented |

---

## Compliance Summary

**Before shipping, count your checks:**

| Priority | Must Have | Your Count |
|----------|-----------|------------|
| CRITICAL | ALL checked | ___ / ___ |
| HIGH | Most checked (ADR for exceptions) | ___ / ___ |
| MEDIUM | Optional | ___ / ___ |

**If any CRITICAL item is unchecked, this hub may not ship.**

---

## Traceability Reference

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | CANONICAL_ARCHITECTURE_DOCTRINE.md |
| Hub/Spoke Doctrine | CANONICAL_ARCHITECTURE_DOCTRINE.md §3 |
