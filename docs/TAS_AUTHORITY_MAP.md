# TAS — Technical Authority System Map

**Generated**: 2026-01-28
**Authority**: IMO-Creator (CC-01 Sovereign)
**Status**: AUTHORITATIVE

---

## Purpose

This document formalizes the Technical Authority System (TAS) for IMO-Creator, mapping all doctrine files, their relationships, versions, and authority levels into a single reconciled view.

---

## 1. Authority Hierarchy

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CONSTITUTIONAL LAYER                             │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  CONSTITUTION.md                                             │    │
│  │  IMO_CONTROL.json                                            │    │
│  │  IMO_SYSTEM_SPEC.md                                          │    │
│  │  AI_EMPLOYEE_OPERATING_CONTRACT.md                           │    │
│  └─────────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│                    DOCTRINE LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  CANONICAL_ARCHITECTURE_DOCTRINE.md (v1.5.0) — ROOT         │    │
│  │    ├── ALTITUDE_DESCENT_MODEL.md (v1.2.0)                   │    │
│  │    ├── REPO_REFACTOR_PROTOCOL.md (v1.2.0)                   │    │
│  │    └── HUB_SPOKE_ARCHITECTURE.md (REDIRECT)                 │    │
│  │                                                              │    │
│  │  DBA_ENFORCEMENT_DOCTRINE.md (v1.0.0)                       │    │
│  │  DOCUMENTATION_ERD_DOCTRINE.md (v1.0.0)                     │    │
│  │  TEMPLATE_IMMUTABILITY.md (v1.0.0)                          │    │
│  └─────────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│                    OPERATIONAL LAYER                                │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  SNAP_ON_TOOLBOX.yaml — Tool registry                       │    │
│  │  GUARDSPEC.md — CI enforcement rules                        │    │
│  │  CLAUDE.md — Agent behavior contract                        │    │
│  └─────────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│                    TEMPLATE LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  templates/prd/ — PRD templates                             │    │
│  │  templates/adr/ — ADR templates                             │    │
│  │  templates/pr/ — Pull request templates                     │    │
│  │  templates/checklists/ — Compliance checklists              │    │
│  │  templates/child/ — Child repo templates                    │    │
│  └─────────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│                    EXECUTION LAYER                                  │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  templates/claude/*.prompt.md — Claude execution prompts    │    │
│  │  templates/scripts/*.sh — Automation scripts                │    │
│  │  templates/config/*.yaml — Configuration templates          │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Doctrine Version Matrix

| File | Version | Authority | Status | Derives From |
|------|---------|-----------|--------|--------------|
| CANONICAL_ARCHITECTURE_DOCTRINE.md | 1.5.0 | IMO-Creator | LOCKED | ROOT |
| HUB_SPOKE_ARCHITECTURE.md | N/A | REDIRECT | REDIRECT | CANONICAL §3 |
| ALTITUDE_DESCENT_MODEL.md | 1.2.0 | CANONICAL | LOCKED | CANONICAL §2 |
| REPO_REFACTOR_PROTOCOL.md | 1.2.0 | CANONICAL | LOCKED | CANONICAL §1.3 |
| DBA_ENFORCEMENT_DOCTRINE.md | 1.0.0 | CONSTITUTIONAL | LOCKED | CANONICAL |
| DOCUMENTATION_ERD_DOCTRINE.md | 1.0.0 | CONSTITUTIONAL | LOCKED | CANONICAL |
| TEMPLATE_IMMUTABILITY.md | 1.0.0 | CONSTITUTIONAL | LOCKED | CANONICAL |

---

## 3. IMO_CONTROL.json Version Alignment

| Doctrine File | IMO_CONTROL Version | Actual Version | Status |
|---------------|---------------------|----------------|--------|
| CANONICAL_ARCHITECTURE_DOCTRINE.md | 1.5.0 | 1.5.0 | ✓ ALIGNED |
| HUB_SPOKE_ARCHITECTURE.md | 1.2.0 | REDIRECT | ⚠ NOTE: Redirect file |
| ALTITUDE_DESCENT_MODEL.md | 1.2.0 | 1.2.0 | ✓ ALIGNED |
| REPO_REFACTOR_PROTOCOL.md | 1.2.0 | 1.2.0 | ✓ ALIGNED |
| DBA_ENFORCEMENT_DOCTRINE.md | 1.0.0 | 1.0.0 | ✓ ALIGNED |
| TEMPLATE_IMMUTABILITY.md | 1.0.0 | 1.0.0 | ✓ ALIGNED |
| DOCUMENTATION_ERD_DOCTRINE.md | 1.0.0 | 1.0.0 | ✓ ALIGNED |

---

## 4. Canonical Concepts Cross-Reference

### 4.1 Canonical Chain (CC) Layers

| Layer | Name | Artifacts | Gate Condition | Source |
|-------|------|-----------|----------------|--------|
| CC-01 | Sovereign | Boundary declaration | Sovereignty declared | CANONICAL §2.1 |
| CC-02 | Hub | PRD, REGISTRY.yaml, Hub identity | PRD approved | CANONICAL §2.2 |
| CC-03 | Context | ADR, Process flows, Spoke definitions | ADR approved | CANONICAL §2.3 |
| CC-04 | Process | Code, Tests, Config, UI | Implementation complete | CANONICAL §2.4 |

### 4.2 CTB Branches

| Branch | Purpose | Contains | Source |
|--------|---------|----------|--------|
| sys/ | System infrastructure | Env loaders, bootstraps, config | CANONICAL §1.3 |
| data/ | Data layer | Schemas, queries, migrations | CANONICAL §1.3 |
| app/ | Application logic | Modules, services, workflows | CANONICAL §1.3 |
| ai/ | AI components | Agents, routers, prompts | CANONICAL §1.3 |
| ui/ | User interface | Pages, components, layouts | CANONICAL §1.3 |

### 4.3 IMO Model (Hub-Internal)

| Layer | Role | Source |
|-------|------|--------|
| Ingress | Data entry point (Spoke-I) | CANONICAL §3.2 |
| Middle | Logic/state/decisions (Hub-owned) | CANONICAL §3.2 |
| Egress | Data exit point (Spoke-O) | CANONICAL §3.2 |

---

## 5. Lifecycle Phases

| Phase | Prompt File | Purpose |
|-------|-------------|---------|
| constitutional_admission | APPLY_DOCTRINE.prompt.md | Apply doctrine to repo |
| structural_instantiation | DECLARE_STRUCTURE_AND_RENDER_TREE.prompt.md | Declare hubs, render tree |
| data_declaration | DECLARE_DATA_AND_RENDER_ERD.prompt.md | Declare data, render ERD |
| execution_wiring | DECLARE_EXECUTION_WIRING.prompt.md | Wire execution flows |
| dba_enforcement | DBA_ENFORCEMENT.prompt.md | Enforce DBA rules |
| documentation_enforcement | DOCUMENTATION_ERD_ENFORCEMENT.prompt.md | Enforce documentation |
| hygiene_audit | HYGIENE_AUDITOR.prompt.md | Audit hygiene |
| cleanup_execution | CLEANUP_EXECUTOR.prompt.md | Execute cleanup |

---

## 6. Enforcement Mechanisms

| Mechanism | File | Trigger |
|-----------|------|---------|
| Pre-commit hook | templates/scripts/hooks/pre-commit | Every commit |
| CI Workflow | .github/workflows/doctrine-enforcement.yml | PR |
| Claude Code | templates/claude/APPLY_DOCTRINE.prompt.md | Manual |
| Guard Spec | templates/GUARDSPEC.md | CI |
| Audit Script | templates/scripts/apply_doctrine_audit.sh | Manual |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-28 |
| Authority | IMO-Creator (Sovereign) |
| Status | AUTHORITATIVE |
| Change Protocol | ADR + Human Approval |
