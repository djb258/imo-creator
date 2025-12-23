# PRD — Hub

## 1. Overview

- **System Name:**
- **Hub Name:**
- **Owner:**
- **Version:**

---

## 2. Hub Identity

| Field | Value |
|-------|-------|
| **Hub ID** | _(unique, immutable identifier)_ |
| **Process ID** | _(execution / trace ID)_ |

---

## 3. Purpose

_What does this hub do? What boundary does it own? A hub is the application — it owns logic, state, CTB structure, altitude, and full IMO._

---

## 4. CTB Placement

| CTB Path | Branch Level | Parent Hub |
|----------|--------------|------------|
| | sys / ui / ai / infra | |

---

## 5. Altitude Scope

| Level | Description | Selected |
|-------|-------------|----------|
| 30,000 ft | Strategic vision, system-wide boundaries | [ ] |
| 20,000 ft | Domain architecture, hub relationships | [ ] |
| 10,000 ft | Component design, interface contracts | [ ] |
| 5,000 ft | Implementation detail, execution logic | [ ] |

---

## 6. IMO Structure

_This hub owns all three IMO layers internally. Spokes are external interfaces only._

| Layer | Role | Description |
|-------|------|-------------|
| **I — Ingress** | Dumb input only | Receives data; no logic, no state |
| **M — Middle** | Logic, decisions, state | All processing occurs here inside the hub |
| **O — Egress** | Output only | Emits results; no logic, no state |

---

## 7. Spokes

_Spokes are interfaces ONLY. They carry no logic, tools, or state. Each spoke is typed as Ingress (I) or Egress (O)._

| Spoke Name | Type | Direction | Contract |
|------------|------|-----------|----------|
| | I | Inbound | |
| | O | Outbound | |

---

## 8. Connectors

| Connector | Type | Direction | Contract |
|-----------|------|-----------|----------|
| | API / CSV / Event | Inbound / Outbound | |

---

## 9. Tools

_All tools are scoped strictly INSIDE this hub. Spokes do not own tools._

| Tool | Doctrine ID | Scoped To | ADR |
|------|-------------|-----------|-----|
| | | This Hub (M layer) | |

---

## 10. Guard Rails

| Guard Rail | Type | Threshold |
|------------|------|-----------|
| | Rate Limit / Timeout / Validation | |

---

## 11. Kill Switch

- **Endpoint:**
- **Activation Criteria:**
- **Emergency Contact:**

---

## 12. Promotion Gates

| Gate | Artifact | Requirement |
|------|----------|-------------|
| G1 | PRD | Hub definition approved |
| G2 | ADR | Architecture decision recorded |
| G3 | Linear Issue | Work item created and assigned |
| G4 | PR | Code reviewed and merged |
| G5 | Checklist | Deployment verification complete |

---

## 13. Failure Modes

| Failure | Severity | Remediation |
|---------|----------|-------------|
| | | |

---

## 14. Human Override Rules

_When can a human bypass automation? Who approves?_

---

## 15. Observability

- **Logs:**
- **Metrics:**
- **Alerts:**

---

## Approval

| Role | Name | Date |
|------|------|------|
| Owner | | |
| Reviewer | | |
