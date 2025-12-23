# Hub Compliance Checklist

This checklist must be completed before any hub can ship.
No exceptions. No partial compliance.

---

## Hub Identity

- [ ] Hub ID assigned (unique, immutable)
- [ ] Process ID assigned (execution / trace ID)
- [ ] Hub Name defined
- [ ] Hub Owner assigned

---

## CTB Placement

- [ ] CTB path defined
- [ ] Branch level specified (sys / ui / ai / infra)
- [ ] Parent hub identified (if applicable)

---

## Altitude Scope

- [ ] Altitude level declared (30k / 20k / 10k / 5k)
- [ ] Scope appropriate for declared altitude

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

- [ ] PRD exists and is current
- [ ] ADR exists (if decisions required)
- [ ] Linear issue linked
- [ ] PR linked

---

## Compliance Rule

If any box is unchecked, this hub may not ship.
