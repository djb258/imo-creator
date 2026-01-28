# TAS — Completion Semantics

**Generated**: 2026-01-28
**Authority**: IMO-Creator (CC-01 Sovereign)
**Status**: AUTHORITATIVE

---

## Purpose

This document defines **what "DONE" means** for each phase and artifact. Not vibes — criteria.

**Rule**: An artifact is DONE when ALL criteria pass. Partial completion = NOT DONE.

---

## 1. CC Layer Completion Criteria

### CC-01: Sovereignty — DONE When:

| Criterion | Required | Verification |
|-----------|----------|--------------|
| CONSTITUTION.md referenced | ✓ | File path exists in DOCTRINE.md |
| Sovereignty declared | ✓ | Explicit statement in REGISTRY.yaml |
| Boundary defined | ✓ | Scope documented |
| Authority established | ✓ | sovereign_reference populated |

### CC-02: Hub — DONE When:

| Criterion | Required | Verification |
|-----------|----------|--------------|
| Hub ID assigned | ✓ | hub_id in REGISTRY.yaml non-empty |
| PRD exists | ✓ | docs/PRD.md file present |
| PRD follows template | ✓ | All 15 sections present |
| PRD approved | ✓ | Approval signature or PR merged |
| CTB placement declared | ✓ | ctb section in REGISTRY.yaml |
| IMO defined | ✓ | Ingress/Middle/Egress listed |

### CC-03: Context — DONE When:

| Criterion | Required | Verification |
|-----------|----------|--------------|
| ADR exists for work | ✓ | docs/ADR-*.md file present |
| ADR follows template | ✓ | All required sections present |
| ADR approved | ✓ | Approval signature or PR merged |
| Process flows documented | ✓ | Diagrams in ADR or linked |
| Spokes defined | ✓ | Ingress/Egress spokes in REGISTRY.yaml |
| Spoke contracts specified | ✓ | Interface definitions exist |

### CC-04: Process — DONE When:

| Criterion | Required | Verification |
|-----------|----------|--------------|
| Code implements ADR | ✓ | Code matches ADR decisions |
| Code in correct CTB branch | ✓ | No CTB violations |
| Tests exist | ✓ | Test files present |
| Tests pass | ✓ | CI green |
| Config documented | ✓ | Environment variables listed |
| PID minted for execution | ✓ | Unique process_id assigned |

---

## 2. Artifact Completion Criteria

### PRD — DONE When:

```
□ All 15 sections present (per PRD_HUB.md template)
□ No [PLACEHOLDER] values remain
□ IMO layers defined
□ Success metrics specified
□ Constraints documented
□ Approved by stakeholder
```

### ADR — DONE When:

```
□ All required sections present (per ADR.md template)
□ Decision clearly stated
□ Alternatives considered
□ Consequences documented
□ Context explained
□ Status = ACCEPTED (not PROPOSED)
```

### REGISTRY.yaml — DONE When:

```
□ hub_id populated
□ hub_name populated
□ sovereign_reference populated
□ conformance section complete
□ ctb branches declared
□ No [PLACEHOLDER] values
```

### ERD Diagram — DONE When:

```
□ Mermaid format
□ All tables in ALL CAPS
□ PK/FK explicitly labeled
□ All relationships shown
□ No descriptions inside diagram
□ Matches Column Data Dictionary
```

### Column Data Dictionary — DONE When:

```
□ Every column has unique ID
□ Every column has description
□ Data type specified
□ Format specified
□ Constraints documented
□ Source of truth identified
□ Volatility declared
□ Consumer listed
```

---

## 3. Phase Completion Criteria

### Phase 1: Constitutional Admission — DONE When:

```
□ IMO_CONTROL.json exists at root
□ DOCTRINE.md points to imo-creator
□ REGISTRY.yaml exists
□ CTB structure verified
□ No forbidden folders
□ Claude Code can read all doctrine
```

### Phase 2: Structural Instantiation — DONE When:

```
□ Hub declared in REGISTRY.yaml
□ Sub-hubs declared (if any)
□ CTB branches created (src/sys, data, app, ai, ui)
□ Christmas Tree diagram generated
□ Physical layout normalized
```

### Phase 3: Data Declaration — DONE When:

```
□ ERD diagrams generated
□ Column dictionaries complete
□ Data lanes defined
□ Ownership assigned to all tables
□ AI readability test passes
```

### Phase 4: Execution Wiring — DONE When:

```
□ Process flows documented
□ Spoke interfaces defined
□ Error handling specified
□ PID generation configured
□ Audit logging configured
```

### Phase 5: DBA Enforcement — DONE When:

```
□ Gate A passes (all changes)
□ Gate B passes (Type B changes)
□ Template immutability verified
□ No deprecated columns without ADR
□ Audit trail present
```

### Phase 6: Documentation Enforcement — DONE When:

```
□ All Type B changes documented
□ ERD updated
□ Dictionary updated
□ PR template followed
□ AI readability test passes
```

### Phase 7: Hygiene Audit — DONE When:

```
□ No orphan files
□ No stale branches
□ No TODOs without tickets
□ No hardcoded secrets
□ No forbidden patterns
```

### Phase 8: Cleanup Execution — DONE When:

```
□ Hygiene issues resolved
□ Deprecated items removed (with ADR)
□ Documentation current
□ All tests passing
□ Version incremented (if release)
```

---

## 4. NOT DONE Examples

| Artifact | Issue | Why NOT DONE |
|----------|-------|--------------|
| PRD | Missing section 12 | Template requires all 15 sections |
| ADR | Status = PROPOSED | Must be ACCEPTED |
| REGISTRY.yaml | hub_id = "[HUB_ID]" | Placeholder not replaced |
| ERD | Table names in lowercase | Must be ALL CAPS |
| Code | In src/helpers/ | Forbidden folder |
| Test | Skipped | Tests must pass, not skip |

---

## 5. Completion Checklist Template

```markdown
## [ARTIFACT NAME] Completion Checklist

**Artifact**: [Name]
**Phase**: [Phase number]
**Date**: [YYYY-MM-DD]

### Required Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
...

### Verification
- [ ] Self-reviewed
- [ ] Peer-reviewed (if required)
- [ ] CI passed
- [ ] Approved

### Status
**DONE**: [ ] YES  [ ] NO

If NO, blocking issues:
1. [Issue 1]
2. [Issue 2]
```

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-28 |
| Authority | IMO-Creator (Sovereign) |
| Status | AUTHORITATIVE |
| Change Protocol | ADR + Human Approval |
