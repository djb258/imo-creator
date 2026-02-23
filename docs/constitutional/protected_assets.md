# Protected Assets — Ecosystem Doctrine

**Authority**: IMO-Creator (Sovereign)
**Scope**: All child repos in the fleet
**Status**: CONSTITUTIONAL

---

## Protected Models

The following models are ecosystem-level protected assets. They are defined in parent doctrine and inherited by all child repos. Modification requires architectural elevation.

| Model | Governing Document | Protection Level |
|-------|--------------------|-----------------|
| CTB backbone | `backbone.md §2` | CONSTITUTIONAL |
| Altitude hierarchy | `backbone.md §3` | CONSTITUTIONAL |
| Sovereign ID doctrine | `templates/doctrine/ARCHITECTURE.md` | CONSTITUTIONAL |
| Cantonal pattern | `templates/doctrine/CTB_REGISTRY_ENFORCEMENT.md` | CONSTITUTIONAL |
| ERROR pattern | `templates/doctrine/CTB_REGISTRY_ENFORCEMENT.md` | CONSTITUTIONAL |
| Registry enforcement model | `templates/doctrine/CTB_REGISTRY_ENFORCEMENT.md` | CONSTITUTIONAL |

### What Protection Means

| Action | Permitted |
|--------|-----------|
| READ | ALLOWED — required before any downstream work |
| APPLY as written | ALLOWED — child repos must conform |
| MODIFY | PROHIBITED — requires architectural elevation |
| REINTERPRET | PROHIBITED — apply as written, do not interpret |
| EXTEND | PROHIBITED — no local additions to protected models |
| OVERRIDE | PROHIBITED — no local exceptions to protected models |

---

## Protected Folders (Parent Level)

The following directories in the parent repository are protected. Their contents define constitutional law for the ecosystem.

| Folder | Purpose | Protection Level |
|--------|---------|-----------------|
| `/docs/constitutional/` | Constitutional governance surface | CONSTITUTIONAL |
| `/templates/doctrine/` | Architectural and structural law | CONSTITUTIONAL |
| `/templates/semantic/` | Semantic access contracts | CONSTITUTIONAL |
| `/templates/integrations/TOOLS.md` | Tool doctrine | CONSTITUTIONAL |
| `/templates/SNAP_ON_TOOLBOX.yaml` | Master tool registry | CONSTITUTIONAL |

### Child Repo Inherited Protection

Child repos must treat the following local equivalents as protected:

| Child Folder/File | Inherits From | Protection Level |
|-------------------|---------------|-----------------|
| `DOCTRINE.md` | Parent doctrine reference | PROTECTED |
| `REGISTRY.yaml` | Parent registry model | PROTECTED |
| `IMO_CONTROL.json` | Parent control contract | PROTECTED |
| CTB branch structure (`src/{sys,data,app,ai,ui}/`) | Parent altitude model | PROTECTED |
| Agent contracts (when adopted) | Parent governance model | PROTECTED |

Child repos must not modify their inherited protected assets without architectural elevation to the parent.

---

## Protection Rule

Any modification to a protected model or protected folder requires architectural elevation.

### Trigger Condition

```
IF target ∈ protected_models OR target ∈ protected_folders:
    architectural_flag = true
    parent_approval    = required
    execution          = HALTED
```

### Enforcement Sequence

| Step | Action | Authority |
|------|--------|-----------|
| 1 | Modification to protected asset detected | Automated (CI, agent, or human) |
| 2 | Execution halts immediately | MANDATORY |
| 3 | Architectural elevation filed | Human (child or parent level) |
| 4 | Parent reviews modification request | Human (parent level) |
| 5 | If approved: parent updates doctrine first | Human (parent level) |
| 6 | Child repo conforms to updated doctrine | Child repo team |
| 7 | If rejected: modification reverted | Child repo team |

### Hard Stop

Execution MUST halt when a protected asset modification is detected. There is no "continue and fix later" option. There is no "temporary exception" mechanism. The halt is immediate and non-negotiable.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-23 |
| Authority | IMO-Creator (Sovereign) |
| Status | CONSTITUTIONAL |
| Phase | V1 Control Plane — Phase 1 Constitutional Freeze |
