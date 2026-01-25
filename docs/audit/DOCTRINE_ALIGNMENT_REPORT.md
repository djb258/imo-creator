# Doctrine Alignment Report

**Generated**: 2026-01-11
**Auditor**: Claude Code
**Status**: CONTRADICTIONS FOUND

---

## Executive Summary

This audit identified **3 critical contradictions** and **2 structural issues** that require human resolution before doctrine can be considered aligned.

---

## Constitutional Authority Chain

| Layer | Document | Location | Version | Status |
|-------|----------|----------|---------|--------|
| 1 | CONSTITUTION.md | Root | N/A | LOCKED |
| 2 | IMO_CONTROL.json | Root | 1.2.0 | CONSTITUTIONAL |
| 3a | CANONICAL_ARCHITECTURE_DOCTRINE.md | templates/doctrine/ | 1.3.0 | LOCKED |
| 3b | HUB_SPOKE_ARCHITECTURE.md | templates/doctrine/ | 1.2.0 | SUBORDINATE |
| 3c | ALTITUDE_DESCENT_MODEL.md | templates/doctrine/ | 1.1.0 | SUBORDINATE |
| 3d | REPO_REFACTOR_PROTOCOL.md | templates/doctrine/ | 1.2.0 | SUBORDINATE |
| 4 | CTB_DOCTRINE.md | global-config/ | 1.3.3 | **UNCLEAR** |

---

## CONTRADICTION #1: Altitude Terminology Conflict

**Severity**: CRITICAL

### In `global-config/CTB_DOCTRINE.md`:
```
40k ft (Doctrine Core): Immutable truths, system infrastructure
20k ft (Business Logic): IMO Factory processes
10k ft (UI/UX): User-facing components
5k ft (Operations): Automation scripts, reporting
```

### In `templates/doctrine/CANONICAL_ARCHITECTURE_DOCTRINE.md`:
```
CC-01 (Sovereign): Authority anchor, root of identity
CC-02 (Hub): Domain ownership, logic, state, decisions
CC-03 (Context): Bounded execution context within hub
CC-04 (Process): Execution instance, runtime operations
```

### Problem:
These are **two different hierarchies** using similar language:
- **Altitude (40k→5k)** = Physical branch structure (where files go)
- **CC Layers (CC-01→04)** = Authority hierarchy (who can do what)

CTB_DOCTRINE.md conflates these concepts. The canonical doctrine keeps them separate.

### Resolution Required:
Human must decide: Does CTB_DOCTRINE.md supplement or contradict the canonical doctrine?

---

## CONTRADICTION #2: CTB Branch Definition Conflict

**Severity**: CRITICAL

### In `templates/doctrine/CANONICAL_ARCHITECTURE_DOCTRINE.md` (Section 1.3):
```
Canonical CTB branches under src/:
- sys/    (System infrastructure)
- data/   (Data layer)
- app/    (Application logic)
- ai/     (AI components)
- ui/     (User interface)
```

### In `global-config/CTB_DOCTRINE.md` (Branch Structure):
```
40k Altitude (8 branches):
- main, doctrine/get-ingest, sys/composio-mcp, sys/neon-vault...

20k Altitude (3 branches):
- imo/input, imo/middle, imo/output

10k Altitude (2 branches):
- ui/figma-bolt, ui/builder-templates

5k Altitude (2 branches):
- ops/automation-scripts, ops/report-builder
```

### Problem:
- Canonical doctrine defines 5 CTB branches: `sys`, `data`, `app`, `ai`, `ui`
- CTB_DOCTRINE.md defines 15+ branches with different names: `imo/*`, `doctrine/*`, `ops/*`

These are **incompatible structures**.

### Resolution Required:
Human must clarify:
1. Are these **git branches** (CTB_DOCTRINE) vs **folder structure** (Canonical)?
2. If so, the naming collision with `sys/` needs disambiguation.

---

## CONTRADICTION #3: Version Drift

**Severity**: MODERATE

| Document | Stated CTB Version | Stated Doctrine Version |
|----------|-------------------|------------------------|
| CANONICAL_ARCHITECTURE_DOCTRINE.md | 1.1.0 | 1.3.0 |
| CTB_DOCTRINE.md | 1.3.3 | N/A |
| IMO_CONTROL.json | N/A | 1.3.0 (references canonical) |

### Problem:
CTB_DOCTRINE.md claims CTB Version 1.3.3, but CANONICAL_ARCHITECTURE_DOCTRINE.md (the authoritative source) declares CTB Version 1.1.0.

### Resolution Required:
Which version is authoritative? Version numbers must align.

---

## STRUCTURAL ISSUE #1: Duplicate Doctrine Content

**Severity**: MODERATE

`global-config/CTB_DOCTRINE.md` (1020 lines) contains:
- Extensive CTB structure definitions (duplicates canonical)
- Security lockdown policies
- MCP vault integration details
- Tool integration guides
- GitHub branch protection rules
- CTB Planner documentation

Much of this is **operational content** that should live in:
- `docs/operations/` (security, MCP vault)
- `scripts/` (CTB Planner)
- `templates/integrations/` (tool guides)

### Recommendation:
Split CTB_DOCTRINE.md into:
1. **Pointer to canonical doctrine** (reference only)
2. **Operational runbooks** (new location)
3. **Integration guides** (move to templates/integrations/)

---

## STRUCTURAL ISSUE #2: Missing SYSTEM_MANIFEST.md

**Severity**: LOW

No `docs/SYSTEM_MANIFEST.md` exists to declare:
- What this repo is (template sovereign)
- What it contains (templates, doctrine, global-config)
- What it does NOT contain (implementation code)
- Required files for downstream repos

---

## Files Audited

| File | Authority Level | Contradictions | Notes |
|------|-----------------|----------------|-------|
| CONSTITUTION.md | Constitutional | None | Clean |
| IMO_CONTROL.json | Control Plane | None | Clean |
| CANONICAL_ARCHITECTURE_DOCTRINE.md | Master Doctrine | None | Authoritative |
| HUB_SPOKE_ARCHITECTURE.md | Subordinate | None | References canonical |
| ALTITUDE_DESCENT_MODEL.md | Subordinate | None | References canonical |
| REPO_REFACTOR_PROTOCOL.md | Subordinate | None | References canonical |
| CTB_DOCTRINE.md | **UNCLEAR** | 3 | Needs reconciliation |
| LOVABLE_CONTROL.json | Control Plane | None | Clean |
| global_manifest.yaml | Configuration | Not audited | Operational |

---

## Recommended Actions

### Immediate (Human Required)

1. **Clarify CTB_DOCTRINE.md authority**: Is it subordinate to canonical doctrine or a separate operational document?

2. **Resolve altitude vs CC-layer terminology**: Define clear distinction or unify.

3. **Align version numbers**: Set single source of truth for CTB version.

### After Human Decision

4. Add subordinate reference header to CTB_DOCTRINE.md (if keeping):
```markdown
> **Authority**: This document is SUBORDINATE to CANONICAL_ARCHITECTURE_DOCTRINE.md.
> Any conflict, the canonical doctrine wins.
```

5. Split operational content from CTB_DOCTRINE.md into appropriate locations.

6. Create SYSTEM_MANIFEST.md for this repo.

---

## Audit Conclusion

**Cannot proceed with automated reconciliation until contradictions #1 and #2 are resolved by human authority.**

The canonical doctrine files (templates/doctrine/*.md) are internally consistent. The issue is `global-config/CTB_DOCTRINE.md` which appears to be a separate operational document that has drifted into doctrine-like content without clear authority designation.

---

## Document Control

| Field | Value |
|-------|-------|
| Audit Type | Doctrine Alignment |
| Files Audited | 9 |
| Contradictions Found | 3 |
| Structural Issues | 2 |
| Human Resolution Required | Yes |
