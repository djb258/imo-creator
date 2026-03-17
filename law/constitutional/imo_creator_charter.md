# IMO-CREATOR CHARTER

**Version: 1.0.0**
**Governing Engine: Tier 0 Doctrine (`law/doctrine/TIER0_DOCTRINE.md`)**
**CTB Position: LEAF (under CONSTITUTION.md)**
**Chain: TIER0_DOCTRINE.md → CONSTITUTION.md → this file**
**Status: Constitutional — LOCKED**

---

## 1. Purpose

IMO-Creator is the sovereign Garage control plane for the fleet of downstream repositories ("child repos").

It is not an application.
It is not a business logic surface.
It is not a deployment target.

It is the governance, validation, orchestration, and certification authority.

---

## 2. Sovereignty Model

* IMO-Creator is the sole governance authority.
* Child repos are implementation surfaces only.
* No child repo may contain independent governance enforcement.
* All compliance validation occurs inside the Garage.

If a rule exists, it is enforced here.

---

## 3. Control Plane Execution Model

All work flows through the same deterministic loop:

Orchestrator
→ Planner
→ Worker
→ Auditor
→ ORBT_CAPTURE
→ SANITATE
→ CERTIFY

No bypass is permitted.

Certification is the only release gate.

---

## 4. Identity & Operational Invariants

These mappings are fixed and may not be reinterpreted:

* **Process ID** = HEIR identity anchor (stable repository identity)
* **Operational ID** = execution instance context
* **ORBT mode** = operational intent classification
* **Altitude** = inspection depth / context scope

HEIR defines identity.
ORBT defines operational state.
Both are mandatory.

No mutation occurs without an Operational ID.
No repository mounts without valid HEIR.

---

## 5. HEIR (Hub Environment Identity Record)

Each child repository must contain:

```
heir.doctrine.yaml
```

HEIR declares:

* sovereign_id
* hub_id
* ctb_placement
* imo_topology
* services
* secrets_provider
* acceptance_criteria
* doctrine_version

HEIR is validated during mount.
Mount fails if HEIR is missing or invalid.

---

## 6. ORBT (Operate, Repair, Build, Troubleshoot, Train)

ORBT classifies execution intent.

Every WORK_PACKET must declare:

```
orbt_mode
```

Valid modes:

* operate
* repair
* build
* troubleshoot
* train

ORBT does not imply autonomy.
It is a deterministic classification surface.

All failures emit ORBT telemetry artifacts.

---

## 7. Alignment Model (Fleet Standard)

A repository is considered aligned when it contains:

* `heir.doctrine.yaml`
* `.github/workflows/garage-certification-gate.yml`
* `changesets/outbox/`
* `audit_reports/`
* `.garage/`

Alignment states:

* independent
* partial
* aligned

Alignment is evaluated by the Auditor.
No auto-remediation occurs.

---

## 8. Sanitation Requirement

Before certification:

* Audit must PASS
* Sanitation must PASS
* HEIR must remain valid

Sanitation ensures:

* No stale artifacts
* No orphaned Garage surfaces
* No schema drift

Certification aborts on any failure.

---

## 9. Governance Non-Goals

IMO-Creator does not:

* Host business logic
* Duplicate child repository functionality
* Execute integration services
* Contain deployment pipelines for products
* Re-implement template business code

It governs.
It validates.
It certifies.

Nothing more.

---

## 10. Evolution Rules

* Constitutional documents are modified only under `architectural_flag=true`.
* Schema changes require version increments.
* Governance enforcement must remain centralized.
* Push-model enforcement is deprecated.
* Garage sovereignty is permanent unless explicitly superseded by human-approved ADR.
