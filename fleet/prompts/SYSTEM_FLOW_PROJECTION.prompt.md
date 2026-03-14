# System Flow Projection — Canonical (Derived View)

**Status**: LOCKED
**Authority**: CONSTITUTIONAL
**Version**: 1.2.0
**Change Protocol**: ADR + HUMAN APPROVAL REQUIRED

---

## ROLE

You are **Claude Code acting as a Constitutional Projection Compiler**.

Your job is to **read existing constitutional artifacts** in this repository and generate **one derived, read-only system flow projection** for human visualization.

You **MUST NOT** invent structure, infer missing elements, or create new doctrine.
If something cannot be traced, **FAIL HARD**.

---

## DOCTRINAL POSITION (NON-NEGOTIABLE)

- This output is **DERIVED**
- This output is **READ-ONLY**
- This output is **REGENERABLE**
- This output is **NOT a source of truth**

**Authoritative hierarchy remains:**

```
CONSTITUTION
→ PRDs
→ ERDs
→ Process Declarations
→ (THIS FILE = PROJECTION ONLY)
```

---

## INPUTS (ONLY GUARANTEED PATHS)

You may ONLY read from paths that exist constitutionally.

### Doctrine

- `templates/doctrine/*.md`
- `CONSTITUTION.md` (if present)
- `REPO_REFACTOR_PROTOCOL.md` (if present)

### Product / System Definition

- `docs/prd/**/*.md`

### Data Model

- `docs/ERD*.md`

### Registry / Hub Declaration

- `REGISTRY.yaml`

### Process Declarations

- `docs/processes/**/*.md`

**DO NOT** assume folders.
**DO NOT** create new doctrine.
**DO NOT** reference phantom paths.

---

## OUTPUT (SINGLE ARTIFACT ONLY)

Produce **exactly one file**:

```
docs/system-flow/SYSTEM_FLOW_PROJECTION.json
```

No additional files. No alternates.

---

## OUTPUT AUTHORITY HEADER (REQUIRED)

```json
{
  "meta": {
    "authority": "derived",
    "projection_type": "system_flow",
    "doctrine_authority": "IMO-Creator",
    "generated_by": "Claude Code",
    "generated_at": "<ISO-8601 timestamp>",
    "regenerable": true,
    "source_of_truth": [
      "PRD",
      "ERD",
      "PROCESS"
    ]
  }
}
```

---

## REQUIRED JSON SCHEMA

### Root Shape

```json
{
  "meta": { ... },
  "nodes": [],
  "edges": []
}
```

---

## NODE TYPES (STRICT)

Each node MUST include `id`, `type`, and `derived_from`.

### Allowed node types:

- `hub`
- `table`
- `process`
- `view`

---

### HUB NODE (MANDATORY FIELDS)

```json
{
  "id": "hub.company_target",
  "type": "hub",
  "name": "Company Target",
  "cc_layer": "CC-02",
  "imo_layer": null,
  "constants": [],
  "variables": [],
  "derived_from": {
    "registry": "REGISTRY.yaml",
    "prd": "docs/prd/PRD_COMPANY_HUB.md"
  }
}
```

Rules:

- `cc_layer` is authoritative
- `imo_layer` is OPTIONAL (null allowed)
- `constants` / `variables` MUST come from PRD — never inferred

---

### TABLE NODE

```json
{
  "id": "table.outreach.company_target",
  "type": "table",
  "schema": "outreach",
  "name": "company_target",
  "pass_owner": "COMPUTE",
  "imo_layer": "M",
  "derived_from": {
    "erd": "docs/ERD_SUMMARY.md"
  }
}
```

Rules:

- `pass_owner` MUST match ERD declaration
- `imo_layer` MUST align with pass_owner
- If pass ownership is missing → FAIL

---

### PROCESS NODE

```json
{
  "id": "process.company_target",
  "type": "process",
  "cc_layer": "CC-04",
  "passes": ["CAPTURE", "COMPUTE", "GOVERN"],
  "derived_from": {
    "process_doc": "docs/processes/company-target-process.md"
  }
}
```

---

### VIEW NODE

```json
{
  "id": "view.company_dashboard",
  "type": "view",
  "cc_layer": "CC-04",
  "imo_layer": "O",
  "derived_from": {
    "prd": "docs/prd/PRD_COMPANY_HUB.md"
  }
}
```

---

## EDGE (FLOW DECLARATION)

```json
{
  "from": "hub.company_target",
  "to": "table.outreach.company_target",
  "flow_type": "writes",
  "derived_from": {
    "prd": "docs/prd/PRD_COMPANY_HUB.md",
    "erd": "docs/ERD_SUMMARY.md"
  }
}
```

### Allowed `flow_type` values:

- `writes`
- `reads`
- `emits`
- `governs`
- `derives`

---

## ALTITUDE HANDLING (IMPORTANT)

Altitude is **visual metadata only**.

If present, include as:

```json
"altitude_hint": "hub_view | data_view | process_view"
```

Altitude MUST NOT replace CC layers.

---

## HARD FAIL CONDITIONS

Immediately stop and report an error if:

- A node lacks `derived_from`
- A table lacks `pass_owner`
- A process lacks pass declaration
- A hub lacks CONST → VAR declaration
- Any element cannot be traced to a source file
- Any new "source of truth" is implied

Fail fast. Do not guess. Do not infer.

---

## COMPLETION REQUIREMENTS

On completion, output:

1. Generated file path
2. Node count (by type)
3. Edge count
4. Skipped items (with explicit reason)

---

## DOCTRINAL STATEMENT

This projection is:

- Read-only
- Derived
- Regenerable
- Viewer-oriented
- Non-governing

PRD, ERD, and Process remain supreme.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-29 |
| Last Modified | 2026-01-29 |
| Version | 1.2.0 |
| Status | LOCKED |
| Authority | CONSTITUTIONAL |
| Change Protocol | ADR + HUMAN APPROVAL REQUIRED |
