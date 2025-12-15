# Hub-and-Spoke (HS) Templates — Doctrine & Definitions

This directory contains the **authoritative templates** used to design, build,
and enforce Hub-and-Spoke (HS) systems across all projects and domains
(outreach, storage, insurance, etc.).

These templates define **structure and control**, not implementation.
Projects must conform to them.

---

## Canonical Definitions (Single Source of Truth)

The following terms are used throughout all PRDs, PRs, and ADRs.
They are defined **once here** to prevent drift.

### Hub

A **Hub** is a bounded system.
It owns its rules, data, tooling, guard rails, and failure modes.
A hub must be independently understandable, testable, and stoppable.

### Spoke

A **Spoke** is a subordinate unit attached to a hub.
It inherits rules and tooling from its parent hub.
A spoke cannot exist without a hub.
A spoke cannot define its own tools.

### Connector

A **Connector** is an interface between hubs or between a hub and an external system.
Connectors are owned by exactly one hub.
Connectors define the contract; they do not own business logic.

### Tool

A **Tool** is a capability registered to a hub.
Tools are owned by hubs, never by spokes.
New tools require an ADR.

### Guard Rail

A **Guard Rail** is a constraint that prevents harm.
Examples: rate limits, timeouts, circuit breakers, validation rules.
Guard rails are defined at the hub level and inherited by spokes.

### Kill Switch

A **Kill Switch** is a mechanism to halt a hub or spoke immediately.
Every hub and spoke must have one.
Kill switches must be tested before deployment.

### Promotion Gate

A **Promotion Gate** is a checkpoint that must pass before deployment.
Gates are numbered G1–G5.
All gates must pass; there are no exceptions.

### Failure Mode

A **Failure Mode** is a documented way a hub or spoke can fail.
Every tool must have at least one failure mode defined.
Failures propagate to the Master Failure Hub.

---

## Directory Structure

```
templates/
├── README.md                           # This file (doctrine definitions)
├── checklists/
│   └── HUB_COMPLIANCE.md              # Pre-flight checklist for compliance
├── prd/
│   └── PRD_HUB.md                     # Product requirements template
├── pr/
│   ├── PULL_REQUEST_TEMPLATE_HUB.md   # PR template for hub changes
│   └── PULL_REQUEST_TEMPLATE_SPOKE.md # PR template for spoke changes
└── adr/
    └── ADR.md                         # Architecture Decision Record template
```

---

## Required Artifacts for Any Hub

Before a hub can be deployed, it must have:

1. **PRD**
   - Created from `templates/prd/PRD_HUB.md`
   - Defines spokes, connectors, tooling, and controls

2. **Hub Compliance Checklist**
   - Created from `templates/checklists/HUB_COMPLIANCE.md`
   - Must be satisfied before merge or deployment

3. **PR Enforcement**
   - Hub changes use the Hub PR template
   - Spoke changes use the Spoke PR template

4. **ADR(s)**
   - Required for new tools or irreversible decisions

If any artifact is missing, incomplete, or bypassed,
the hub is considered **non-viable**.

---

## Template Usage Rules

- Templates in this directory are **never edited directly**.
- Projects **copy and instantiate** templates.
- Instantiated files live in project repos under:
  - `/docs/prd/`
  - `/docs/adr/`
  - `.github/PULL_REQUEST_TEMPLATE/`
- Projects declare which template version they conform to.

---

## Enforcement Model

- PR templates enforce human attestation.
- CI enforces truth (tests, schemas, logs).
- Violations block merge or trigger kill switches.

Hope is not an enforcement strategy.

---

## Design Principle

> If you cannot diagram it as a hub with spokes and connectors,
> you are not allowed to build it.

---

## Authority

This repository defines doctrine.
Projects conform to it.
Doctrine does not conform to projects.
