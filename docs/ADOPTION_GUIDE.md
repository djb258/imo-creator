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

Complete these steps in order when creating a new child repository:

### Phase 0: Setup
- [ ] Create new repository
- [ ] Clone locally

### Phase 1: Copy Templates
- [ ] Copy `templates/child/IMO_CONTROL.json.template` → `IMO_CONTROL.json`
- [ ] Copy `templates/child/REGISTRY.yaml.template` → `REGISTRY.yaml`
- [ ] Copy `templates/child/DOCTRINE.md.template` → `DOCTRINE.md`

### Phase 2: Replace Placeholders
- [ ] Replace ALL `[PLACEHOLDER]` values in `IMO_CONTROL.json`
- [ ] Replace ALL `[PLACEHOLDER]` values in `REGISTRY.yaml`
- [ ] Replace ALL `[PLACEHOLDER]` values in `DOCTRINE.md`
- [ ] Verify NO brackets `[ ]` remain in any copied file

### Phase 3: Create Domain Binding
- [ ] Create `doctrine/` folder
- [ ] Create `doctrine/REPO_DOMAIN_SPEC.md`
- [ ] Fill ALL required sections
- [ ] Complete binding completeness checklist
- [ ] Verify NO brackets `[ ]` remain

### Phase 4: Create Structure
- [ ] Create `src/` folder
- [ ] Create required CTB branches under `src/`
- [ ] Add `.gitkeep` to empty folders

### Phase 5: Verify Governance
- [ ] Run constitutional admission (APPLY_DOCTRINE.prompt.md)
- [ ] Verify no violations reported
- [ ] Commit initial structure

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

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-28 |
| Authority | imo-creator |
| Audience | Humans onboarding child repositories |
| Status | ACTIVE |
