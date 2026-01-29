# PRD — Hub

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | |
| **CTB Version** | |
| **CC Layer** | CC-02 |

---

## 1. Sovereign Reference (CC-01)

| Field | Value |
|-------|-------|
| **Sovereign ID** | |
| **Sovereign Boundary** | |

---

## 2. Hub Identity (CC-02)

| Field | Value |
|-------|-------|
| **Hub Name** | |
| **Hub ID** | _(unique, immutable identifier)_ |
| **Owner** | |
| **Version** | |

---

## 3. Purpose & Transformation Declaration

_What does this hub do? What boundary does it own? A hub is the application — it owns logic, state, CTB structure, and full IMO._

### Transformation Statement (REQUIRED)

_Complete this sentence: "This system transforms [CONSTANTS] into [VARIABLES]."_

| Field | Value |
|-------|-------|
| **Transformation Summary** | |

### Constants (Inputs)

_What immutable inputs does this system receive? These are ADR-gated to change._

| Constant | Source | Description |
|----------|--------|-------------|
| | | |

### Variables (Outputs)

_What mutable outputs does this system produce?_

| Variable | Destination | Description |
|----------|-------------|-------------|
| | | |

### Pass Structure

_Which passes occur and in what order?_

| Pass | Type | IMO Layer | Description |
|------|------|-----------|-------------|
| | CAPTURE | I (Ingress) | |
| | COMPUTE | M (Middle) | |
| | GOVERN | O (Egress) | |

### Scope Boundary

| Scope | Description |
|-------|-------------|
| **IN SCOPE** | |
| **OUT OF SCOPE** | |

---

## 4. CTB Placement

| Field | Value | CC Layer |
|-------|-------|----------|
| **Trunk** | | CC-02 |
| **Branch** | | CC-02 |
| **Leaf** | | CC-02 |

---

## 5. IMO Structure (CC-02)

_This hub owns all three IMO layers internally. Spokes are external CC-03 interfaces only._

| Layer | Role | Description | CC Layer |
|-------|------|-------------|----------|
| **I — Ingress** | Dumb input only | Receives data; no logic, no state | CC-02 |
| **M — Middle** | Logic, decisions, state | All processing occurs here inside the hub | CC-02 |
| **O — Egress** | Output only | Emits results; no logic, no state | CC-02 |

---

## 6. Spokes (CC-03 Interfaces)

_Spokes are interfaces ONLY. They carry no logic, tools, or state. Each spoke is typed as Ingress (I) or Egress (O)._

| Spoke Name | Type | Direction | Contract | CC Layer |
|------------|------|-----------|----------|----------|
| | I | Inbound | | CC-03 |
| | O | Outbound | | CC-03 |

---

## 7. Constants vs Variables

_Declare which elements are constants (ADR-gated) vs variables (configuration)._

| Element | Type | Mutability | CC Layer |
|---------|------|------------|----------|
| Hub ID | Constant | Immutable | CC-02 |
| Hub Name | Constant | ADR-gated | CC-02 |
| | | | |

---

## 8. Tools

_All tools are scoped strictly INSIDE this hub's M layer. Spokes do not own tools._

| Tool | Solution Type | CC Layer | IMO Layer | ADR Reference |
|------|---------------|----------|-----------|---------------|
| | Deterministic / LLM-tail | CC-02 | M | |

---

## 9. Guard Rails

| Guard Rail | Type | Threshold | CC Layer |
|------------|------|-----------|----------|
| | Rate Limit / Timeout / Validation | | CC-03/CC-04 |

---

## 10. Kill Switch

| Field | Value |
|-------|-------|
| **Activation Criteria** | |
| **Trigger Authority** | CC-02 (Hub) / CC-01 (Sovereign) |
| **Emergency Contact** | |

---

## 11. Promotion Gates

| Gate | Artifact | CC Layer | Requirement |
|------|----------|----------|-------------|
| G1 | PRD | CC-02 | Hub definition approved |
| G2 | ADR | CC-03 | Architecture decision recorded |
| G3 | Work Item | CC-04 | Execution item created |
| G4 | PR | CC-04 | Code reviewed and merged |
| G5 | Checklist | CC-04 | Compliance verification complete |

---

## 12. Failure Modes

| Failure | Severity | CC Layer | Remediation |
|---------|----------|----------|-------------|
| | | | |

---

## 13. PID Scope (CC-04)

_Process ID is minted at CC-04 for each execution instance._

| Field | Value |
|-------|-------|
| **PID Pattern** | `<hub-id>-${TIMESTAMP}-${RANDOM_HEX}` |
| **Retry Policy** | New PID per retry |
| **Audit Trail** | Required |

---

## 14. Human Override Rules

_When can a human bypass automation? Who approves? (Trigger authority must be CC-02 or CC-01)_

---

## 15. Observability

| Type | Description | CC Layer |
|------|-------------|----------|
| **Logs** | | CC-04 |
| **Metrics** | | CC-04 |
| **Alerts** | | CC-03/CC-04 |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Sovereign (CC-01) | | |
| Hub Owner (CC-02) | | |
| Reviewer | | |

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | CANONICAL_ARCHITECTURE_DOCTRINE.md |
| Hub/Spoke Geometry | CANONICAL_ARCHITECTURE_DOCTRINE.md §3 |
