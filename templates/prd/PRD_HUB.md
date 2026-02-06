# HSS — Hub-and-Spoke Set Up (NON-AUTHORITATIVE — FILL FIRST)

> **This section is a fill-first design worksheet.**
> It exists to force architectural clarity before formal specification.
> It has NO governing authority.
> The authoritative PRD begins in §1.
> All decisions declared here MUST be restated formally below.

---

## Idea / Need

[FILL: What problem or need caused this hub to exist?]

---

## Hub Justification

[FILL: This hub exists to transform _________________ (CONSTANTS) into _________________ (VARIABLES).]

---

## Hub–Spoke Decision

**Hub–Spoke does NOT exist by default.**
Spokes are boundary-crossing transport only.
Logic, decisions, and transformations belong ONLY in the hub (Middle layer).

Choose ONE and complete:

### Option A: IMPLEMENTED

[FILL: List intended spokes and why variability requires them.]

| Spoke | Type (I/O) | Justification |
|-------|------------|---------------|
| | | |

### Option B: DECLINED

[FILL: Explain why hub–spoke is not justified for this hub.]

**Selected option**: [ IMPLEMENTED / DECLINED ]

---

## Candidate Constants

[FILL: Draft list of invariant inputs. These are ADR-gated to change.]

| Constant | Source | Description |
|----------|--------|-------------|
| | | |

---

## Candidate Variables

[FILL: Draft list of governed outputs. These are mutable at runtime.]

| Variable | Destination | Description |
|----------|-------------|-------------|
| | | |

---

## Candidate Tools (SNAP-ON TOOLBOX ONLY)

[FILL: Snap-On tool IDs only. No vendors or implementations.]

| Tool ID | Tier | Purpose |
|---------|------|---------|
| | | |

---

# VALIDATION RULE

**The PRD is INVALID unless §§1–15 fully restate all authoritative decisions.**

No section below may reference or defer to the HSS section.
Statements such as "see declaration above" are forbidden.

---
---

# PRD — Hub

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | |
| **CTB Version** | |
| **CC Layer** | CC-02 |
| **CTB Governance** | `docs/CTB_GOVERNANCE.md` |

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
| **Success Criteria** | _(How do you know the transformation worked?)_ |

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

_Spokes are interfaces ONLY. They carry no logic, tools, or state. Each spoke is typed as INGRESS or EGRESS._

**Hub–Spoke Status**: [ IMPLEMENTED / DECLINED ]

| Spoke Name | Type | Direction | Licensed Capability | Contract | CC Layer |
|------------|------|-----------|---------------------|----------|----------|
| | INGRESS | Inbound | | | CC-03 |
| | EGRESS | Outbound | | | CC-03 |

_Type: INGRESS (data flows into hub) or EGRESS (data flows out of hub)_
_Licensed Capability: What transformation capability does this spoke enable?_

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
| Architecture Doctrine | ARCHITECTURE.md |
| Hub/Spoke Geometry | ARCHITECTURE.md Part IV |
| **Governing OSAM** | _(path to OSAM that defines query routing)_ |
| **OSAM Version** | _(version or hash of OSAM)_ |
| **Governing ERD** | _(path to ERD that implements this PRD)_ |
| **Governing Process** | _(path to Process declaration)_ |

---

## OSAM Compliance Declaration (MANDATORY)

**All PRD questions must be routable via OSAM.**

| Check | Status |
|-------|--------|
| [ ] Governing OSAM referenced above | |
| [ ] All questions in this PRD can be answered via OSAM query routes | |
| [ ] No new query paths introduced in this PRD | |
| [ ] All required tables exist in OSAM | |

**Prohibition**: This PRD may NOT introduce new query paths that are not declared in OSAM.
If a question cannot be routed via OSAM, the OSAM must be updated via ADR BEFORE this PRD is approved.
