# Hub Compliance Checklist

This checklist must be completed before any hub can ship.
No exceptions. No partial compliance.

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | |
| **CC Layer** | CC-02 |

---

## Canonical Chain (CC) Compliance

- [ ] Sovereign declared (CC-01 reference)
- [ ] Hub ID assigned (unique, immutable) (CC-02)
- [ ] All child contexts scoped to CC-03
- [ ] All processes scoped to CC-04
- [ ] Authorization matrix honored (no upward writes)
- [ ] Doctrine version declared

---

## Hub Identity (CC-02)

- [ ] Hub ID assigned (unique, immutable)
- [ ] Process ID pattern defined (CC-04 execution scope)
- [ ] Hub Name defined
- [ ] Hub Owner assigned

---

## CTB Placement

- [ ] CTB path defined (Trunk / Branch / Leaf)
- [ ] Branch level specified (sys / ui / ai / data / ops / docs)
- [ ] Parent hub identified (if nested hub)

---

## IMO Structure

### Ingress (I Layer)

- [ ] Ingress points defined
- [ ] Ingress contains no logic
- [ ] Ingress contains no state
- [ ] UI (if present) is dumb ingress only

### Middle (M Layer)

- [ ] All logic resides in M layer
- [ ] All state resides in M layer
- [ ] All decisions occur in M layer
- [ ] Tools scoped to M layer only

### Egress (O Layer)

- [ ] Egress points defined
- [ ] Egress contains no logic
- [ ] Egress contains no state

---

## Spokes

- [ ] All spokes typed as I or O only
- [ ] No spoke contains logic
- [ ] No spoke contains state
- [ ] No spoke owns tools
- [ ] No spoke performs decisions

---

## Tools

- [ ] All tools scoped inside this hub
- [ ] All tools have Doctrine ID
- [ ] All tools have ADR reference
- [ ] No tools exposed to spokes

---

## Connectors

- [ ] Connectors (API / CSV / Event) defined
- [ ] Connector direction specified (Inbound / Outbound)
- [ ] Connector contracts documented

---

## Cross-Hub Isolation

- [ ] No sideways hub-to-hub calls
- [ ] No cross-hub logic
- [ ] No shared mutable state between hubs

---

## Guard Rails

- [ ] Rate limits defined
- [ ] Timeouts defined
- [ ] Validation implemented
- [ ] Permissions enforced

---

## Kill Switch

- [ ] Kill switch endpoint defined
- [ ] Kill switch activation criteria documented
- [ ] Kill switch tested and verified
- [ ] Emergency contact assigned

---

## Rollback

- [ ] Rollback plan documented
- [ ] Rollback tested and verified

---

## Observability

- [ ] Logging implemented
- [ ] Metrics implemented
- [ ] Alerts configured
- [ ] Shipping without observability is forbidden

---

## Failure Modes

- [ ] Failure modes documented
- [ ] Severity levels assigned
- [ ] Remediation steps defined

---

## Human Override

- [ ] Override conditions defined
- [ ] Override approvers assigned

---

## Traceability

- [ ] PRD exists and is current (CC-02)
- [ ] ADR exists for each decision (CC-03)
- [ ] Work item linked
- [ ] PR linked (CC-04)
- [ ] Canonical Doctrine referenced

---

## CC Layer Verification

| Layer | Verified | Notes |
|-------|----------|-------|
| CC-01 (Sovereign) | [ ] | Reference declared |
| CC-02 (Hub) | [ ] | Identity, PRD, CTB complete |
| CC-03 (Context) | [ ] | ADRs, spokes, guard rails defined |
| CC-04 (Process) | [ ] | PIDs, code, tests implemented |

---

## Compliance Rule

If any box is unchecked, this hub may not ship.

---

## Traceability Reference

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | CANONICAL_ARCHITECTURE_DOCTRINE.md |
| Hub/Spoke Doctrine | HUB_SPOKE_ARCHITECTURE.md |
