# TAS — Change Impact Map

**Generated**: 2026-01-28
**Authority**: IMO-Creator (CC-01 Sovereign)
**Status**: AUTHORITATIVE

---

## Purpose

This document defines **what must be updated when X changes**. This prevents drift six months from now.

**Rule**: When you change an artifact, you MUST update all impacted artifacts in the same PR.

---

## 1. Doctrine File Changes

### If CANONICAL_ARCHITECTURE_DOCTRINE.md changes:

| Must Update | Reason |
|-------------|--------|
| IMO_CONTROL.json | Version number |
| IMO_SYSTEM_SPEC.md | Cross-references |
| TAS_AUTHORITY_MAP.md | Version matrix |
| TAS_CANONICAL_DIAGRAM.md | If structure changed |
| ALTITUDE_DESCENT_MODEL.md | If CC layers changed |
| REPO_REFACTOR_PROTOCOL.md | If CTB changed |
| All child repo DOCTRINE.md | Version reference |

### If ALTITUDE_DESCENT_MODEL.md changes:

| Must Update | Reason |
|-------------|--------|
| IMO_CONTROL.json | Version number |
| TAS_AUTHORITY_MAP.md | Version matrix |
| TAS_CANONICAL_DIAGRAM.md | CC descent diagram |
| TAS_ANTI_PATTERNS.md | If forbidden patterns changed |

### If any doctrine file version changes:

| Must Update | Reason |
|-------------|--------|
| IMO_CONTROL.json doctrine_files section | Version tracking |
| TAS_AUTHORITY_MAP.md version matrix | Single source of truth |

---

## 2. Schema/ERD Changes

### If a table is added:

| Must Update | Reason |
|-------------|--------|
| ERD diagram | Visual representation |
| Column Data Dictionary | Column definitions |
| REGISTRY.yaml | If new sub-hub |
| Data lane documentation | Lane assignment |
| AI readability test | New table must pass |

### If a column is added:

| Must Update | Reason |
|-------------|--------|
| Column Data Dictionary | New column entry |
| ERD diagram | If FK relationship |
| Downstream consumers list | Who uses this column |

### If a column is deprecated:

| Must Update | Reason |
|-------------|--------|
| Column Data Dictionary | Mark deprecated |
| ADR | Document deprecation |
| Migration script | Data migration |
| Consumer notification | Breaking change |

### If a table is removed:

| Must Update | Reason |
|-------------|--------|
| ERD diagram | Remove from visual |
| Column Data Dictionary | Remove all columns |
| ADR | Document removal |
| All referencing tables | FK cleanup |
| Data lane documentation | Lane update |

---

## 3. Structure Changes

### If a new CTB branch is used:

| Must Update | Reason |
|-------------|--------|
| REGISTRY.yaml ctb section | Declare usage |
| TAS_CANONICAL_DIAGRAM.md | If standard diagram affected |
| ctb.branchmap.yaml | If new branch type |

### If a sub-hub is added:

| Must Update | Reason |
|-------------|--------|
| REGISTRY.yaml subhubs section | Declaration |
| PRD | Sub-hub requirements |
| ADR | Architectural decision |
| Process flow diagrams | New flows |
| Christmas Tree diagram | Visual update |

### If a spoke is added:

| Must Update | Reason |
|-------------|--------|
| REGISTRY.yaml spokes section | Declaration |
| Spoke contract definition | Interface spec |
| ADR | If new integration |
| Process flow diagrams | Data flow |

---

## 4. Control Plane Changes

### If IMO_CONTROL.json changes:

| Must Update | Reason |
|-------------|--------|
| All child repos IMO_CONTROL.json | Inheritance |
| TAS_AUTHORITY_MAP.md | Authority structure |
| CLAUDE.md | If behavior rules changed |

### If lifecycle phases change:

| Must Update | Reason |
|-------------|--------|
| IMO_CONTROL.json lifecycle section | Phase list |
| TAS_CANONICAL_DIAGRAM.md | Lifecycle diagram |
| Phase prompt files | New/removed phases |
| TAS_COMPLETION_SEMANTICS.md | Completion criteria |

---

## 5. Template Changes

### If PRD template changes:

| Must Update | Reason |
|-------------|--------|
| All existing PRDs | Conformance |
| TAS_COMPLETION_SEMANTICS.md | Completion criteria |
| CLAUDE.md | If locked sections changed |

### If ADR template changes:

| Must Update | Reason |
|-------------|--------|
| All existing ADRs | Conformance |
| TAS_COMPLETION_SEMANTICS.md | Completion criteria |
| CLAUDE.md | If locked sections changed |

---

## 6. Quick Reference Matrix

| When This Changes | Update These |
|-------------------|--------------|
| CANONICAL_ARCHITECTURE_DOCTRINE.md | IMO_CONTROL.json, IMO_SYSTEM_SPEC.md, TAS_*.md, child DOCTRINE.md |
| Any doctrine version | IMO_CONTROL.json, TAS_AUTHORITY_MAP.md |
| Table added | ERD, Dictionary, REGISTRY.yaml (if sub-hub), Lanes |
| Column added | Dictionary, ERD (if FK) |
| Column deprecated | Dictionary, ADR, Migration, Consumers |
| Table removed | ERD, Dictionary, ADR, FKs, Lanes |
| Sub-hub added | REGISTRY.yaml, PRD, ADR, Flows, Tree diagram |
| Spoke added | REGISTRY.yaml, Contract, ADR, Flows |
| IMO_CONTROL.json | Child repos, TAS_AUTHORITY_MAP.md |
| Lifecycle phases | IMO_CONTROL.json, TAS diagrams, Prompts, Completion semantics |
| PRD template | Existing PRDs, Completion semantics |
| ADR template | Existing ADRs, Completion semantics |

---

## 7. Drift Prevention Protocol

```
BEFORE merging any change:

1. Identify changed artifact(s)
2. Consult this impact map
3. Update ALL impacted artifacts
4. Verify no orphan references
5. Run doctrine validation
6. Include all updates in SAME PR

FORBIDDEN:
- Merge change without impacted updates
- "I'll update that later"
- Partial updates across PRs
```

---

## 8. Automated Checks (Recommended)

| Check | Trigger | Validates |
|-------|---------|-----------|
| Version sync | PR to doctrine/ | IMO_CONTROL.json matches |
| ERD sync | PR with schema change | ERD updated |
| Dictionary sync | PR with column change | Dictionary updated |
| TAS sync | PR to doctrine/ | TAS_AUTHORITY_MAP.md updated |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-28 |
| Authority | IMO-Creator (Sovereign) |
| Status | AUTHORITATIVE |
| Change Protocol | ADR + Human Approval |
