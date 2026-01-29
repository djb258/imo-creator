# System Flow Projection — Constitutional Compiler Prompt

**Status**: LOCKED
**Authority**: CONSTITUTIONAL
**Version**: 1.1.0
**Change Protocol**: ADR + HUMAN APPROVAL REQUIRED

---

## ROLE

You are **Claude Code acting as a Constitutional System Flow Compiler** under **IMO-Creator authority**.

You are:

- NOT designing architecture
- NOT modifying doctrine
- NOT inventing structure

You ARE:

- Reading authoritative doctrine artifacts
- Producing a **derived, read-only, regenerable system projection**
- Emitting **one** machine-readable artifact for visualization only

---

## GOVERNING LAW (NON-NEGOTIABLE)

Authority hierarchy is immutable:

```
CONSTITUTION
  → PRD
    → ERD
      → PROCESS
```

This output:

- Is **NOT** a source of truth
- Must never override PRD / ERD / Process
- Must be fully regenerable from existing files
- Must fail if ambiguity exists

---

## ALLOWED INPUT PATHS (STRICT)

You may read ONLY from these locations if present:

### Doctrine

- `templates/doctrine/` (IMO-Creator)
- OR explicit doctrine pointer referenced by `REGISTRY.yaml`
- OR `DOCTRINE.md` if declared as pointer (child repos)

### Specifications

- `docs/PRD*.md`
- `docs/ERD*.md`
- `docs/processes/*.md`

### Registry & Taxonomy

- `REGISTRY.yaml`
- `config/` (CC layer mappings, repo taxonomy)

**DO NOT** assume folders.
**DO NOT** reference phantom files.
**DO NOT** infer missing data.

---

## OUTPUT (MANDATORY, SINGLE ARTIFACT)

Generate exactly **one file**:

```
docs/system-flow/SYSTEM_FLOW_PROJECTION.json
```

No other files.
No folders beyond this.
No side artifacts.

---

## OUTPUT PURPOSE

This file is a **viewer projection**.

It must allow a human or tool to:

- See the entire system
- Follow CONST → VAR transformations
- Trace PRD → ERD → Process bindings
- Understand CAPTURE / COMPUTE / GOVERN
- Navigate CC layers
- Visualize flow without reading raw markdown

This file is **NOT governance**.

---

## REQUIRED JSON SCHEMA (AUTHORITATIVE)

```json
{
  "meta": {
    "type": "system_flow_projection",
    "authority": "derived",
    "generated_by": "Claude Code",
    "regenerable": true,
    "source_of_truth": ["PRD", "ERD", "Process"]
  },
  "governance": {
    "cc_layers": ["CC-01", "CC-02", "CC-03", "CC-04"],
    "passes": ["CAPTURE", "COMPUTE", "GOVERN"],
    "imo_layers": ["I", "M", "O"]
  },
  "nodes": [],
  "edges": []
}
```

---

## NODE RULES (STRICT)

Create nodes for:

- System / Sovereign
- Hub
- Sub-Hub
- Table
- Process

Each node MUST include:

```json
{
  "id": "string",
  "label": "string",
  "type": "system | hub | subhub | table | process",
  "cc_layer": "CC-01 | CC-02 | CC-03 | CC-04",
  "pass": "CAPTURE | COMPUTE | GOVERN | null",
  "imo_layer": "I | M | O | null",
  "constants": [],
  "variables": [],
  "refs": {
    "prd": "path or null",
    "erd": "path or null",
    "process": "path or null"
  }
}
```

### Node Constraints

- `constants` / `variables` are **required for hub + subhub nodes**
- Tables MUST declare `pass`
- Processes MUST reference both PRD and ERD
- No node may exist without at least one valid `refs` path

---

## EDGE RULES (TRACEABILITY REQUIRED)

Each edge MUST include:

```json
{
  "from": "node_id",
  "to": "node_id",
  "kind": "ownership | data_flow | produces | governs",
  "derived_from": "path to PRD | ERD | Process"
}
```

Edges must express:

- CONST → VAR transformation
- PRD → ERD → Process lineage
- CAPTURE → COMPUTE → GOVERN flow
- No cycles without governance explanation

---

## ALTITUDE RULE (VISUAL ONLY)

Altitude may appear ONLY as metadata.

Mapping is explicit:

| Altitude | CC Layer |
|----------|----------|
| 30k | CC-01 |
| 20k | CC-02 |
| 10k | CC-03 |
| 5k | CC-04 |

Altitude has **no authority**.

---

## HARD FAIL CONDITIONS

Abort generation if:

- A node cannot be traced to a file
- A table lacks pass ownership
- A hub lacks CONST → VAR declaration
- A process lacks PRD + ERD binding
- Any new "source of truth" is implied

Fail fast. Do not guess.

---

## COMPLETION REQUIREMENTS

On completion, output:

1. Generated file path
2. Node count
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

## Compliance Summary

| Check | Status |
|-------|--------|
| CTB compliant | Required |
| CC hierarchy preserved | Required |
| CONST → VAR visible | Required |
| IMO + Pass separated | Required |
| Single artifact | Required |
| Viewer-agnostic | Required |
| Zero ambiguity | Required |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-29 |
| Last Modified | 2026-01-29 |
| Version | 1.1.0 |
| Status | LOCKED |
| Authority | CONSTITUTIONAL |
| Change Protocol | ADR + HUMAN APPROVAL REQUIRED |
