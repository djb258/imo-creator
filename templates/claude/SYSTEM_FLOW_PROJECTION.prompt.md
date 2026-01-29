# System Flow Projection Prompt

**Status**: LOCKED
**Authority**: CONSTITUTIONAL
**Version**: 1.0.0
**Change Protocol**: ADR + HUMAN APPROVAL REQUIRED

---

## Prompt

```
ROLE:
You are Claude Code operating as a System Flow Projection Compiler
under IMO-Creator doctrine authority.

OBJECTIVE:
Generate a derived, READ-ONLY system flow projection that makes the
PRD, ERD, and Process structure of the repository human-navigable
and tool-readable.

This output MUST NOT introduce new doctrine.
It MUST NOT override constitutional hierarchy.
It MUST be fully regenerable from source documents.

AUTHORITATIVE SOURCES (READ-ONLY):
- Constitutional doctrine files (templates/doctrine/)
- docs/prd/**/*.md
- docs/ERD*.md
- docs/processes/*.md
- REGISTRY.yaml (root, if present)

TARGET OUTPUT DIRECTORY (MANDATORY):
docs/system-flow/

FILES TO CREATE (ALL REQUIRED):

1. SYSTEM_FLOW_INDEX.md
2. SYSTEM_FLOW_MODEL.json        ← derived projection (machine-readable)
3. SYSTEM_FLOW_MODEL.md          ← rendered explanation (human-readable)
4. SYSTEM_FLOW_ASSERTIONS.md
5. SYSTEM_FLOW_AUDIT.md

DOCTRINAL POSITIONING (IMPORTANT):

- PRDs, ERDs, and Process documents remain the sole sources of truth.
- SYSTEM_FLOW_MODEL.json is a compiled projection.
- Visualizations (Miro, Figma, UI) are downstream viewers only.

No file produced here has governance authority.

---

### STRUCTURAL RULES

• Use CC layer terminology (CC-01 → CC-04) for governance.
• Altitude language MAY be used ONLY as a visualization mapping and
  must be explicitly tied to CC layers.
• Do not invent hubs, passes, tables, or flows.
• If contradictions exist between PRD / ERD / Process, HALT and report.

---

### FILE SPECIFICATIONS

### 1️⃣ SYSTEM_FLOW_INDEX.md
Human entry point.
Explain:
- What this projection is
- How to read the system top-down
- Where the authoritative sources live

---

### 2️⃣ SYSTEM_FLOW_MODEL.json
Derived projection.

Must include:
- metadata (repo, date, doctrine version)
- cc_layers[]
- hubs[]
  - id
  - cc_layer
  - passes (CAPTURE / COMPUTE / GOVERN)
  - constants (from PRDs)
  - variables (from PRDs)
  - tables (from ERDs)
- upstream_flows
- invariants (derived guarantees)

No prose. No opinions.

---

### 3️⃣ SYSTEM_FLOW_MODEL.md
Human-readable rendering of the JSON.
Walk the system CC-01 → CC-04.
Explain flow, not implementation.

---

### 4️⃣ SYSTEM_FLOW_ASSERTIONS.md
List invariants provable from source:
- No orphan tables
- No undeclared passes
- No process without PRD/ERD binding
- GOVERN never precedes CAPTURE

---

### 5️⃣ SYSTEM_FLOW_AUDIT.md
Document:
- Projection type (READ-ONLY)
- Inputs used
- Audit date
- Scope disclaimer (documentation only)

---

EXECUTION ORDER:
1. Scan authoritative inputs
2. Validate internal consistency
3. Build SYSTEM_FLOW_MODEL.json
4. Render markdown projections
5. Write index, assertions, audit

BEGIN.
```

---

## Doctrinal Context

This prompt generates a **derived projection**, not governance artifacts.

### What This Projection IS

| Attribute | Value |
|-----------|-------|
| Type | Derived view |
| Authority | None (read-only) |
| Regenerable | Yes (deterministic from sources) |
| CTB Location | `docs/system-flow/` |

### What This Projection IS NOT

| Attribute | Explanation |
|-----------|-------------|
| Source of truth | PRD/ERD/Process remain authoritative |
| New doctrine layer | Does not add governance |
| Runtime artifact | Documentation only |

### Hierarchy Preserved

```
Constitution (authoritative)
    ↓
PRD (authoritative - behavioral proof)
    ↓
ERD (authoritative - structural proof)
    ↓
Process (authoritative - execution declaration)
    ↓
System Flow Projection (derived - read-only view)
```

---

## CC Layer to Altitude Mapping (Visualization Only)

If altitude terminology is used for visualization, it MUST map to CC layers:

| CC Layer | Name | Altitude (visualization) |
|----------|------|--------------------------|
| CC-01 | Sovereign | ~30k ft |
| CC-02 | Hub | ~20k ft |
| CC-03 | Context | ~10k ft |
| CC-04 | Process | ~5k ft |

**Altitude is never used for governance. CC layers are authoritative.**

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-29 |
| Last Modified | 2026-01-29 |
| Version | 1.0.0 |
| Status | LOCKED |
| Authority | CONSTITUTIONAL |
| Change Protocol | ADR + HUMAN APPROVAL REQUIRED |
