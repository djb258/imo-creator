# Adoption Guide

**For humans creating a new child repository governed by IMO-Creator.**

---

## What This Repository Is

This repository (`imo-creator`) is a **constitutional parent** that defines:

- Structural rules (CTB branches, CC layers)
- Governance contracts (IMO_CONTROL.json)
- Template definitions (PRD, ADR, checklists)
- AI agent constraints (operating contracts, prompts)
- Enforcement specifications (immutability, descent gates)

This repository is the **single source of truth** for all structural law.

---

## What This Repository Is NOT

This repository does NOT contain:

- Domain-specific logic
- Business rules or scoring
- Use-case implementations
- Runtime code
- Industry-specific terminology
- Concrete schema definitions

**All domain meaning belongs ONLY in child repositories.**

If you find domain-specific content in this repository, it is a violation.

---

## When to Copy Templates

Copy templates from this repository when:

| Condition | Action |
|-----------|--------|
| Creating a new governed repository | Copy required templates |
| Starting a new hub | Copy PRD template |
| Making an architectural decision | Copy ADR template |
| Setting up governance | Copy child templates |

**Do NOT copy templates for exploration or experimentation.**

Templates are governance artifacts. Treat them accordingly.

---

## Required Files for a Child Repository

Every child repository MUST have these files at minimum:

| File | Source | Purpose |
|------|--------|---------|
| `IMO_CONTROL.json` | `templates/child/IMO_CONTROL.json.template` | Governance contract |
| `REGISTRY.yaml` | `templates/child/REGISTRY.yaml.template` | Hub identity declaration |
| `DOCTRINE.md` | `templates/child/DOCTRINE.md.template` | Doctrine reference |
| `doctrine/REPO_DOMAIN_SPEC.md` | AI_EMPLOYEE_OPERATING_CONTRACT.md stub | Domain bindings |
| `README.md` | (Create new) | Repository overview |

---

## Mandatory: doctrine/REPO_DOMAIN_SPEC.md

Every child repository MUST create:

```
doctrine/REPO_DOMAIN_SPEC.md
```

This file binds generic roles to domain-specific meaning.

**Without this file, AI agents will HALT and refuse to proceed.**

This file MUST:
- Map generic terms to domain tables
- Declare lane definitions
- Declare lifecycle state mappings
- Contain NO SQL, code, or implementation logic

The stub template is defined in `templates/AI_EMPLOYEE_OPERATING_CONTRACT.md`.

---

## Parent vs Child Responsibilities

### Parent Repository (imo-creator) Owns:

| Responsibility | Modifiable? |
|----------------|-------------|
| Structural doctrine | NO — LOCKED |
| Template definitions | NO — LOCKED |
| AI operating contracts | NO — LOCKED |
| Governance rules | NO — LOCKED |
| Generic tool registry | NO — LOCKED |

### Child Repository Owns:

| Responsibility | Modifiable? |
|----------------|-------------|
| Domain-specific bindings | YES — in REPO_DOMAIN_SPEC.md |
| Domain-specific tools | YES — in REPO_DOMAIN_SPEC.md |
| Local policy decisions | YES — within invariant boundaries |
| Implementation code | YES — at CC-04 only |
| Hub/sub-hub identity | YES — declared at creation |

---

## First-Run Checklist

Complete these steps in order when creating a new child repository.

### Phase 0: Repository Setup
- [ ] Create new repository
- [ ] Clone locally

### Phase 1: Copy Templates
- [ ] Copy `templates/child/IMO_CONTROL.json.template` → `IMO_CONTROL.json`
- [ ] Copy `templates/child/REGISTRY.yaml.template` → `REGISTRY.yaml`
- [ ] Copy `templates/child/DOCTRINE.md.template` → `DOCTRINE.md`

### Phase 2: Fill Placeholders

In `IMO_CONTROL.json`:
- [ ] Replace `[YYYY-MM-DD]` with creation date
- [ ] Replace `[COMMIT_HASH]` with current imo-creator commit
- [ ] Replace `[REPO_NAME]` with repository name
- [ ] Replace `[HUB_ID]` with unique hub identifier
- [ ] Replace `[CC-01_REFERENCE]` with sovereign reference

In `REGISTRY.yaml`:
- [ ] Replace `[HUB_ID]` with unique hub identifier
- [ ] Replace `[HUB_NAME]` with human-readable name
- [ ] Replace `[OWNER_NAME]` with owner
- [ ] Replace `[DOCTRINE_VERSION]` with current doctrine version
- [ ] Replace `[CTB_VERSION]` with current CTB version
- [ ] Set `branches_used` to true/false for each branch

In `DOCTRINE.md`:
- [ ] Replace `[VERSION]` placeholders with current versions
- [ ] Replace `[YYYY-MM-DD]` with creation date

- [ ] Verify NO brackets `[ ]` remain in any copied file

### Phase 3: Create Domain Binding
- [ ] Create `doctrine/` folder
- [ ] Create `doctrine/REPO_DOMAIN_SPEC.md` using stub from AI_EMPLOYEE_OPERATING_CONTRACT.md
- [ ] Fill ALL required sections (no brackets remaining)
- [ ] Complete binding completeness checklist

### Phase 4: Create CTB Structure
- [ ] Create `src/` folder
- [ ] Create required CTB branches:
  - [ ] `src/sys/` (if needed)
  - [ ] `src/data/` (if needed)
  - [ ] `src/app/` (if needed)
  - [ ] `src/ai/` (if needed)
  - [ ] `src/ui/` (if needed)
- [ ] Add `.gitkeep` to empty folders

### Phase 5: Constitutional Admission
- [ ] Read `CONSTITUTION.md` from imo-creator
- [ ] Read `IMO_CONTROL.json` (your copy)
- [ ] Read `doctrine/ARCHITECTURE.md` (CTB Constitutional Law)
- [ ] Execute `APPLY_DOCTRINE.prompt.md`
- [ ] Verify no violations
- [ ] Commit initial structure

### Phase 6: Structural Instantiation
- [ ] Execute `DECLARE_STRUCTURE_AND_RENDER_TREE.prompt.md`
- [ ] Declare sub-hubs in `REGISTRY.yaml` (if any)
- [ ] Declare spokes in `REGISTRY.yaml` (if any)
- [ ] Mint unique IDs

### Phase 7: Ongoing Phases (As Needed)
- [ ] Data Declaration (if applicable)
- [ ] Execution Wiring
- [ ] DBA Enforcement (if applicable)
- [ ] Documentation Enforcement
- [ ] Hygiene Audit (scheduled)
- [ ] Cleanup Execution (as needed)
- [ ] Add repo to `FLEET_REGISTRY.yaml` in imo-creator

---

## Required Lifecycle (In Order)

Downstream repositories MUST progress through the following phases in order.
No phase may be skipped.

### 1. Constitutional Admission

Adopt governance and enforcement.

- Read `CONSTITUTION.md`
- Read `IMO_CONTROL.json`
- Read `doctrine/ARCHITECTURE.md` (CTB Constitutional Law v2.1.0)
- Execute `APPLY_DOCTRINE.prompt.md`

**Result:** Repo is legally governed.

### 2. Structural Instantiation

Declare structure and identity.

- Execute `DECLARE_STRUCTURE_AND_RENDER_TREE.prompt.md`
- Declare hubs, sub-hubs, spokes
- Mint unique IDs (hub, sub-hub, spoke, process)
- Normalize repository structure to CTB

**Result:** Repo matches doctrine shape.

### 3. Data Declaration (If Applicable)

Declare AI-ready data schemas.

- Execute `DECLARE_DATA_AND_RENDER_ERD.prompt.md`
- Define tables, columns, relationships
- Generate ERD artifacts

**Result:** Data layer is machine-readable and auditable.

### 4. Execution Wiring

Bind declared processes to executable intent.

- Execute `DECLARE_EXECUTION_WIRING.prompt.md`
- Define triggers, schedules, kill switches, observability

**Result:** System is runnable by humans or agents.

### 5. Hygiene Audit (Scheduled)

Verify ongoing compliance.

- Execute `HYGIENE_AUDITOR.prompt.md`
- Review structure, doctrine alignment, drift

**Result:** Compliance verified or issues surfaced.

### 6. Cleanup Execution (As Needed)

Execute approved cleanup tasks.

- Execute `CLEANUP_EXECUTOR.prompt.md`
- Only after hygiene audit approval
- Gated by human authorization

**Result:** Cleanup completed per audit findings.

---

## Scope Boundary

IMO-Creator governs:

- Structure
- Declaration
- Identity
- Documentation
- Wiring intent

IMO-Creator does NOT provide:

- Runtime execution
- Job history
- State mutation
- Scheduling engines

Those belong to downstream systems.

---

## Warning

```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║   NO DOMAIN MEANING BELONGS IN THE PARENT REPOSITORY.              ║
║                                                                    ║
║   If you are adding:                                               ║
║   - Industry-specific terms                                        ║
║   - Business logic                                                 ║
║   - Scoring or ranking rules                                       ║
║   - Use-case implementations                                       ║
║   - Concrete table names                                           ║
║                                                                    ║
║   STOP. You are in the wrong repository.                           ║
║                                                                    ║
║   Domain meaning belongs ONLY in child repositories,               ║
║   specifically in: doctrine/REPO_DOMAIN_SPEC.md                    ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

---

## Support

If uncertain about any step:
1. STOP
2. Do not guess
3. Review doctrine files
4. Ask for clarification

Governor first. Subject second.
Structure before logic.
If uncertain: STOP and ASK.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-28 |
| Last Modified | 2026-02-15 |
| Authority | imo-creator |
| Audience | Humans onboarding child repositories |
| Status | ACTIVE |
| Note | Merged from ADOPTION.md + ADOPTION_GUIDE.md |
