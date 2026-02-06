# IMO/CTB Structural Inventory — Deep Audit

**Audit Date**: 2026-02-06
**Auditor**: Claude Code (READ-ONLY)
**Scope**: templates/ folder evaluated against CTB/IMO simplification rules

---

## Audit Framework

This audit evaluates `templates/` against the **CTB/IMO Simplification Rules**:

| Rule | Requirement |
|------|-------------|
| **CTB-1** | One trunk (root authority) |
| **CTB-2** | Limited number of hubs |
| **CTB-3** | Leaves must be boring and few |
| **IMO-1** | INPUT: intake, staging, ingress |
| **IMO-2** | MIDDLE: logic, derivation, transformation |
| **IMO-3** | OUTPUT: canonical artifacts only |
| **LEAF-1** | Only CANONICAL, ERRORS, MATERIALIZED_VIEWS, REGISTRY at leaves |
| **HYGIENE-1** | One concept → one authoritative template |

---

## TRUNK Analysis

### Question: Is there ONE clear trunk (root authority)?

**Answer: YES** ✓

| Artifact | Role | Status |
|----------|------|--------|
| `CONSTITUTION.md` (repo root) | Supreme governing document | TRUNK |
| `CANONICAL_ARCHITECTURE_DOCTRINE.md` | Derived constitutional law | TRUNK |
| `CLAUDE.md` (repo root) | AI governance rules | TRUNK |

**Evaluation**: The trunk is clearly defined. CONSTITUTION.md declares itself as governing authority, and CANONICAL_ARCHITECTURE_DOCTRINE.md derives from it.

**CTB-1 Status**: PASS ✓

---

## HUB Analysis

### Question: Is templates/ structured as a hub with clear IMO flow?

**Expected Structure**:
```
INPUT (intake/staging)
    ↓
MIDDLE (logic/transformation)
    ↓
OUTPUT (canonical artifacts)
```

**Actual Structure**:

```
templates/
├── [INPUT] config/              ← Configuration files
├── [INPUT] child/               ← Child repo templates (to be filled)
├── [INPUT] gpt/                 ← Intake guides
│
├── [MIDDLE] claude/             ← Processing prompts (16 files)
├── [MIDDLE] ai-employee/        ← Agent protocols
├── [MIDDLE] scripts/            ← Execution scripts
├── [MIDDLE] validators/         ← Validation logic (empty)
│
├── [OUTPUT] doctrine/           ← Canonical law (11 files)
├── [OUTPUT] prd/                ← Canonical PRD template
├── [OUTPUT] adr/                ← Canonical ADR template
├── [OUTPUT] checklists/         ← Canonical checklists
├── [OUTPUT] audit/              ← Canonical attestation
├── [OUTPUT] semantic/           ← Canonical OSAM
├── [OUTPUT] pr/                 ← Canonical PR templates
├── [OUTPUT] erd/                ← Canonical ERD metrics template
│
├── [MIXED] integrations/        ← Guidance + tooling
├── [MIXED] docs/architecture/   ← Explanatory (not canonical)
└── [ROOT INDEX] TEMPLATES_MANIFEST.yaml, IMO_SYSTEM_SPEC.md, README.md
```

**CTB-2 Status**: PASS ✓ (templates/ is effectively ONE hub with clear boundaries)

---

## IMO Layer Mapping

### INPUT Layer (Intake/Staging/Ingress)

| Folder/File | Purpose | IMO Role | Status |
|-------------|---------|----------|--------|
| `config/*.yaml` | Configuration inputs | INPUT | Correct |
| `config/*.json` | Configuration inputs | INPUT | Correct |
| `child/*.template` | Child repo fill-in templates | INPUT | Correct |
| `gpt/PRD_INTAKE_GUIDE.md` | User intake guide | INPUT | Correct |

**INPUT Layer Status**: PASS ✓

### MIDDLE Layer (Logic/Derivation/Transformation)

| Folder/File | Purpose | IMO Role | Status |
|-------------|---------|----------|--------|
| `claude/*.prompt.md` (16 files) | AI processing prompts | MIDDLE | Correct |
| `ai-employee/AI_EMPLOYEE_PROTOCOL.md` | Agent execution rules | MIDDLE | Correct |
| `ai-employee/AI_EMPLOYEE_TASK.yaml` | Task payload template | MIDDLE | Correct |
| `scripts/*.sh` | Execution scripts | MIDDLE | Correct |
| `validators/` | Validation patterns | MIDDLE | Empty ⚠️ |
| `GUARDSPEC.md` | Enforcement rules | MIDDLE | Correct |

**MIDDLE Layer Status**: PASS ✓ (but validators/ is empty)

### OUTPUT Layer (Canonical Artifacts)

| Folder/File | Purpose | IMO Role | Expected Leaf Type | Status |
|-------------|---------|----------|-------------------|--------|
| `doctrine/*.md` (11 files) | Constitutional law | OUTPUT | CANONICAL | ✓ |
| `prd/PRD_HUB.md` | Hub PRD template | OUTPUT | CANONICAL | ✓ |
| `adr/ADR.md` | ADR template | OUTPUT | CANONICAL | ✓ |
| `checklists/*.md` (2 files) | Compliance checklists | OUTPUT | CANONICAL | ✓ |
| `audit/*.md` | Attestation template | OUTPUT | CANONICAL | ✓ |
| `semantic/OSAM.md` | Query-routing contract | OUTPUT | CANONICAL | ✓ |
| `pr/*.md` (2 files) | PR templates | OUTPUT | CANONICAL | ✓ |
| `erd/ERD_METRICS.yaml.template` | ERD metrics template | OUTPUT | CANONICAL | ✓ |
| `SNAP_ON_TOOLBOX.yaml` | Tool registry | OUTPUT | REGISTRY | ✓ |

**OUTPUT Layer Status**: PASS ✓

---

## IMO-3 Violation Analysis: Mixed/Misplaced Artifacts

### Items NOT clearly in one IMO layer:

| Artifact | Current Location | Current Role | Problem |
|----------|------------------|--------------|---------|
| `integrations/*.md` | templates/integrations/ | GUIDANCE | Neither INPUT nor OUTPUT — it's reference documentation |
| `integrations/*.template` | templates/integrations/ | INPUT | Correct, but mixed with guidance docs |
| `docs/architecture/*.md` | templates/docs/architecture/ | SUPPORT | Explanatory docs, not canonical output |
| `config/CTB_DOCTRINE.md` | templates/config/ | POINTER | Doctrine-like content in config folder |
| `config/QUICK_REFERENCE.md` | templates/config/ | SUPPORT | Documentation in config folder |

**IMO Layer Mixing Violations**: 5 items

---

## LEAF Constraint Analysis

### Rule: At leaves, ONLY allow CANONICAL, ERRORS, MATERIALIZED_VIEWS, REGISTRY

**Expected Leaf Types in templates/**:
- CANONICAL — Authoritative templates
- REGISTRY — Tool/file registries

**Actual Leaf Content**:

| Folder | Leaf Content | Expected Type | Actual Type | Status |
|--------|--------------|---------------|-------------|--------|
| `doctrine/` | 11 doctrine files | CANONICAL | CANONICAL | ✓ |
| `prd/` | 1 PRD template | CANONICAL | CANONICAL | ✓ |
| `adr/` | 1 ADR template | CANONICAL | CANONICAL | ✓ |
| `pr/` | 2 PR templates | CANONICAL | CANONICAL | ✓ |
| `checklists/` | 2 checklists | CANONICAL | CANONICAL | ✓ |
| `audit/` | 1 attestation | CANONICAL | CANONICAL | ✓ |
| `semantic/` | 1 OSAM | CANONICAL | CANONICAL | ✓ |
| `erd/` | 1 ERD template | CANONICAL | CANONICAL | ✓ |
| `child/` | 5 child templates | CANONICAL | CANONICAL | ✓ |
| `SNAP_ON_TOOLBOX.yaml` | Tool registry | REGISTRY | REGISTRY | ✓ |
| `TEMPLATES_MANIFEST.yaml` | File registry | REGISTRY | REGISTRY | ✓ |

**Leaf Constraint Status**: PASS ✓ for output folders

### Non-Leaf Items (Correctly NOT at leaves):

| Folder | Content | Role | Status |
|--------|---------|------|--------|
| `claude/` | 16 prompts | MIDDLE_LOGIC | Correct (not leaf) |
| `scripts/` | 14 scripts | TOOLING | Correct (not leaf) |
| `config/` | 11 configs | INPUT | Correct (not leaf) |

**CTB-3 Status**: PARTIAL PASS ⚠️
- Output leaves are clean and canonical
- But there are 22 folders total, which may exceed "limited and boring"

---

## Doctrine Hygiene Analysis

### Rule: One concept → One authoritative template

| Concept | Files | Overlap? | Status |
|---------|-------|----------|--------|
| **CTB Structure** | CANONICAL_ARCHITECTURE_DOCTRINE.md §1 | None | ✓ |
| **CC Layers** | CANONICAL_ARCHITECTURE_DOCTRINE.md §2 | None | ✓ |
| **Hub-Spoke** | HUB_SPOKE_ARCHITECTURE.md | None | ✓ |
| **Descent Model** | ALTITUDE_DESCENT_MODEL.md | None | ✓ |
| **PRD Rules** | PRD_CONSTITUTION.md | None | ✓ |
| **Process Rules** | PROCESS_DOCTRINE.md | None | ✓ |
| **DBA Rules** | DBA_ENFORCEMENT_DOCTRINE.md | None | ✓ |
| **Template Protection** | TEMPLATE_IMMUTABILITY.md | None | ✓ |
| **Refactor Protocol** | REPO_REFACTOR_PROTOCOL.md | None | ✓ |
| **ERD Rules** | ERD_CONSTITUTION.md + ERD_DOCTRINE.md | **YES** | ⚠️ |
| **ERD Formatting** | DOCUMENTATION_ERD_DOCTRINE.md | Distinct | ✓ |
| **AI Agent Rules** | AI_EMPLOYEE_OPERATING_CONTRACT.md + AI_EMPLOYEE_PROTOCOL.md | **YES** | ⚠️ |

### ERD Doctrine Overlap Analysis

| File | Content |
|------|---------|
| `ERD_CONSTITUTION.md` | Pressure Test, Upstream Flow Test, OSAM Alignment |
| `ERD_DOCTRINE.md` | Same Pressure Test, Same OSAM Alignment, plus "ERD is structural proof" |

**Finding**: ERD_DOCTRINE.md §§2-4 duplicates content from ERD_CONSTITUTION.md

### AI Employee Overlap Analysis

| File | Content |
|------|---------|
| `AI_EMPLOYEE_OPERATING_CONTRACT.md` | Role definition, halt conditions, escalation rules, permissions matrix |
| `AI_EMPLOYEE_PROTOCOL.md` | Gate checks, acceptance protocol, execution protocol, FAIL HARD |

**Finding**: Both define "what AI employees can/cannot do" but from different angles:
- Contract = "what you ARE" (identity/permissions)
- Protocol = "what you DO" (execution/workflow)

**Verdict**: Arguably distinct, but could cause confusion.

**HYGIENE-1 Status**: PARTIAL PASS ⚠️ (2 overlaps identified)

---

## Folder Count Analysis

### Question: Are leaves "boring and few"?

| Category | Folder Count | Status |
|----------|--------------|--------|
| OUTPUT (Canonical) | 9 folders | Reasonable |
| MIDDLE (Logic) | 4 folders | Reasonable |
| INPUT (Config) | 3 folders | Reasonable |
| MIXED/SUPPORT | 3 folders | Problematic |
| EMPTY | 2 folders | Problematic |
| **TOTAL** | **21 subfolders** | ⚠️ |

**Finding**: 21 subfolders may exceed "limited" for a template repository.

---

## Summary: CTB/IMO Compliance

| Rule | Status | Finding |
|------|--------|---------|
| **CTB-1**: One trunk | ✓ PASS | CONSTITUTION.md is clear authority |
| **CTB-2**: Limited hubs | ✓ PASS | templates/ is effectively one hub |
| **CTB-3**: Boring leaves | ⚠️ PARTIAL | Output leaves are clean, but 21 folders is many |
| **IMO-1**: INPUT layer | ✓ PASS | config/, child/, gpt/ are correct |
| **IMO-2**: MIDDLE layer | ✓ PASS | claude/, scripts/, ai-employee/ are correct |
| **IMO-3**: OUTPUT layer | ⚠️ PARTIAL | 5 items have mixed/unclear roles |
| **LEAF-1**: Leaf types | ✓ PASS | All output leaves are CANONICAL or REGISTRY |
| **HYGIENE-1**: One concept | ⚠️ PARTIAL | 2 overlaps (ERD, AI Employee) |

---

## Document Control

| Field | Value |
|-------|-------|
| Generated | 2026-02-06 |
| Auditor | Claude Code |
| Type | Deep CTB/IMO Alignment Audit |
| Scope | templates/ folder |
