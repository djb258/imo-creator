# Doctrine Simplification — Proposed Structure

**Audit Date**: 2026-02-06
**Goal**: Simplify documentation to keep everything aligned without overcomplicating

---

## The Problem

**Current State**: 95 files, 21 folders, 11 doctrine files, 4 "entry points"

**LLM Experience**: "Where do I start? Which file is authoritative? Why are there 3 ERD files?"

---

## The Simplest Possible Structure

### Principle: One Concept = One File

| Concept | Files Needed |
|---------|--------------|
| Architecture (CTB + CC + Hub-Spoke + Descent) | 1 |
| PRD rules | 1 |
| ERD rules | 1 |
| Process rules | 1 |
| AI agent rules | 1 |
| Template protection | 1 |
| **TOTAL DOCTRINE** | **6 files** |

---

## Proposed Simplified Structure

```
templates/
│
├── MANIFEST.yaml                    ← THE entry point (machine + human)
├── AI_CONTRACT.md                   ← ALL AI rules in ONE file
├── SNAP_ON_TOOLBOX.yaml             ← Tool registry
│
├── doctrine/                        ← 6 files (down from 11)
│   ├── ARCHITECTURE.md              ← CTB + CC + Hub-Spoke + IMO + Descent
│   ├── PRD.md                       ← PRD constitution + validation
│   ├── ERD.md                       ← ERD constitution + validation + formatting
│   ├── PROCESS.md                   ← Process declaration rules
│   ├── DBA.md                       ← Database change rules
│   └── IMMUTABILITY.md              ← Template protection rules
│
├── canonical/                       ← Output templates (what child repos copy)
│   ├── PRD_HUB.md
│   ├── ADR.md
│   ├── OSAM.md
│   ├── HUB_COMPLIANCE.md
│   ├── QUARTERLY_AUDIT.md
│   ├── ATTESTATION.md
│   └── PR_TEMPLATE.md
│
├── prompts/                         ← ALL AI prompts in ONE folder
│   ├── INTAKE.prompt.md             ← HSS intake
│   ├── PRD_TO_ERD.prompt.md         ← PRD→ERD workflow
│   ├── ENFORCEMENT.prompt.md        ← Doctrine enforcement
│   ├── HYGIENE.prompt.md            ← Audit hygiene
│   └── ... (other prompts)
│
├── child/                           ← Templates child repos fill in
│   ├── IMO_CONTROL.json.template
│   ├── REGISTRY.yaml.template
│   └── HUB_DECLARATION.yaml.template
│
└── config/                          ← Configuration inputs only
    └── *.yaml (no .md files here)
```

---

## What Gets Merged

### Doctrine Consolidation

| Current Files | Merge Into | Rationale |
|---------------|------------|-----------|
| CANONICAL_ARCHITECTURE_DOCTRINE.md | doctrine/ARCHITECTURE.md | Core architecture |
| HUB_SPOKE_ARCHITECTURE.md | doctrine/ARCHITECTURE.md | Part of architecture |
| ALTITUDE_DESCENT_MODEL.md | doctrine/ARCHITECTURE.md | CC layer rules = architecture |
| PRD_CONSTITUTION.md | doctrine/PRD.md | One file for PRD rules |
| ERD_CONSTITUTION.md | doctrine/ERD.md | One file for ERD rules |
| ERD_DOCTRINE.md | doctrine/ERD.md | Duplicate content |
| DOCUMENTATION_ERD_DOCTRINE.md | doctrine/ERD.md | Formatting is part of ERD rules |
| PROCESS_DOCTRINE.md | doctrine/PROCESS.md | Keep separate |
| DBA_ENFORCEMENT_DOCTRINE.md | doctrine/DBA.md | Keep separate |
| TEMPLATE_IMMUTABILITY.md | doctrine/IMMUTABILITY.md | Keep separate |
| REPO_REFACTOR_PROTOCOL.md | DELETE or move to docs/ | Operational, not doctrine |

**Result**: 11 files → 6 files

### AI Contract Consolidation

| Current Files | Merge Into |
|---------------|------------|
| AI_EMPLOYEE_OPERATING_CONTRACT.md | AI_CONTRACT.md |
| ai-employee/AI_EMPLOYEE_PROTOCOL.md | AI_CONTRACT.md |
| GUARDSPEC.md | AI_CONTRACT.md |
| IMO_SYSTEM_SPEC.md | AI_CONTRACT.md (as "System Index" section) |
| README.md | MANIFEST.yaml (as comments) or DELETE |

**Result**: 5 files → 1 file

### Prompt Consolidation

| Current Location | Move To |
|------------------|---------|
| claude/*.prompt.md (16 files) | prompts/ |
| gpt/PRD_INTAKE_GUIDE.md | prompts/INTAKE.prompt.md |
| ai-employee/AI_EMPLOYEE_TASK.yaml | prompts/ |

**Result**: 3 folders → 1 folder

### Folder Consolidation

| Current Folders | Action |
|-----------------|--------|
| prd/, adr/, checklists/, audit/, semantic/, pr/, erd/ | Merge into canonical/ |
| claude/, gpt/, ai-employee/ | Merge into prompts/ |
| validators/, workflows/ | DELETE (empty) |
| docs/architecture/ | DELETE or move to docs/ |
| integrations/ | Keep but clean up |

**Result**: 21 folders → ~8 folders

---

## The New Reading Order

```
1. MANIFEST.yaml          ← Entry point, file list, version
2. AI_CONTRACT.md         ← What AI can/cannot do
3. doctrine/ARCHITECTURE.md ← The physics (if needed)
4. Relevant prompt         ← For the current task
```

**That's it. 4 files max for any task.**

---

## What This Achieves

| Metric | Before | After |
|--------|--------|-------|
| Doctrine files | 11 | 6 |
| AI governance files | 5 | 1 |
| Prompt folders | 3 | 1 |
| Entry points | 4 | 1 |
| Total folders | 21 | ~8 |
| Files LLM must reconcile | Multiple | Zero |

---

## The Key Insight

**Current structure**: Organized by *what the file is* (doctrine, prompt, template)

**Proposed structure**: Organized by *when you need it*:
1. Starting? → MANIFEST.yaml
2. AI rules? → AI_CONTRACT.md
3. Architecture? → doctrine/ARCHITECTURE.md
4. Building a PRD? → doctrine/PRD.md + canonical/PRD_HUB.md
5. Building an ERD? → doctrine/ERD.md + relevant prompt

---

## What NOT to Simplify

| Keep Separate | Why |
|---------------|-----|
| PRD vs ERD doctrine | Different validation rules |
| Process doctrine | Different lifecycle |
| DBA doctrine | Specialized concern |
| Individual prompts | Each is a distinct workflow |
| Tool registry | Machine-readable, distinct purpose |

---

## Migration Path

| Phase | Actions |
|-------|---------|
| **Phase 1** | Merge ERD files into one ERD.md |
| **Phase 2** | Merge AI files into one AI_CONTRACT.md |
| **Phase 3** | Merge architecture files into ARCHITECTURE.md |
| **Phase 4** | Consolidate folders (prompts/, canonical/) |
| **Phase 5** | Update all references, version bump |

Each phase is independently valuable. You don't have to do all at once.

---

## The Test

After simplification, an LLM should be able to:

1. Start at MANIFEST.yaml
2. Know exactly which file to read next
3. Never ask "which file is authoritative?"
4. Never read duplicate content
5. Complete any task with ≤4 file reads

---

## Document Control

| Field | Value |
|-------|-------|
| Generated | 2026-02-06 |
| Type | Simplification Proposal |
| Goal | 6 doctrine files, 1 AI contract, 1 entry point |
