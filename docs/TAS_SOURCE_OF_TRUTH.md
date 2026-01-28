# TAS — Source of Truth Declaration

**Generated**: 2026-01-28
**Authority**: IMO-Creator (CC-01 Sovereign)
**Status**: LAW

---

## Purpose

This document establishes the **explicit hierarchy** when conflicts arise between artifacts. This is not implied — it is LAW.

**Rule**: When two artifacts conflict, the higher-ranked artifact wins. Always.

---

## 1. Master Hierarchy (Conflict Resolution Order)

```
RANK 1: CONSTITUTION.md
   │
   ├── Wins over: Everything
   └── Conflicts: Never (supreme authority)

RANK 2: IMO_CONTROL.json
   │
   ├── Wins over: All doctrine files, all configs, all diagrams
   └── Loses to: CONSTITUTION.md only

RANK 3: IMO_SYSTEM_SPEC.md
   │
   ├── Wins over: Individual doctrine files, configs, diagrams
   └── Loses to: CONSTITUTION.md, IMO_CONTROL.json

RANK 4: CANONICAL_ARCHITECTURE_DOCTRINE.md
   │
   ├── Wins over: All other doctrine, all configs, all diagrams, all ERDs
   └── Loses to: CONSTITUTION.md, IMO_CONTROL.json, IMO_SYSTEM_SPEC.md

RANK 5: Other Doctrine Files (ALTITUDE_DESCENT_MODEL.md, etc.)
   │
   ├── Wins over: Configs, diagrams, ERDs, code comments
   └── Loses to: Ranks 1-4

RANK 6: TAS Documents (TAS_*.md)
   │
   ├── Wins over: Diagrams, ERDs (TAS diagrams are canonical)
   └── Loses to: Ranks 1-5

RANK 7: ERD Diagrams
   │
   ├── Wins over: Code comments, inline documentation
   └── Loses to: Ranks 1-6

RANK 8: Code Comments / Inline Documentation
   │
   ├── Wins over: Nothing
   └── Loses to: Everything above
```

---

## 2. Conflict Resolution Matrix

| Artifact A | Artifact B | Winner | Reason |
|------------|------------|--------|--------|
| CONSTITUTION.md | Anything | CONSTITUTION.md | Supreme authority |
| IMO_CONTROL.json | Doctrine file | IMO_CONTROL.json | Control plane authority |
| CANONICAL_ARCHITECTURE_DOCTRINE.md | ERD diagram | Doctrine | Doctrine defines structure |
| TAS_CANONICAL_DIAGRAM.md | Random ERD | TAS diagram | TAS is authoritative |
| Doctrine file | Code comment | Doctrine file | Documentation > comments |
| ERD diagram | Code comment | ERD diagram | Visual > inline |

---

## 3. Specific Conflict Rules

### 3.1 Version Conflicts

**If doctrine file version differs from IMO_CONTROL.json:**
- IMO_CONTROL.json declares the EXPECTED version
- If actual file differs, the file is OUT OF COMPLIANCE
- Resolution: Update the file to match declared version (via ADR)

### 3.2 Diagram Conflicts

**If two diagrams show different structures:**
1. Check which document each diagram lives in
2. Apply hierarchy (TAS > random docs)
3. If same rank: Check creation date (newer wins IF approved)
4. If still ambiguous: Escalate to human

### 3.3 ERD vs Code Schema

**If ERD shows different schema than actual code:**
- ERD is SOURCE OF TRUTH for intended structure
- Code must conform to ERD
- If code differs, code is WRONG (not ERD)
- Resolution: Fix code, not ERD

### 3.4 Text vs Diagram

**If text description conflicts with diagram in same document:**
- Diagrams are AUTHORITATIVE (visual > textual)
- Text must be updated to match diagram
- Exception: If diagram is clearly broken (syntax error), text prevails temporarily

---

## 4. Escalation Protocol

When conflicts cannot be resolved by hierarchy:

```
Step 1: Check this document's hierarchy
   ↓
Step 2: Apply winner rule
   ↓
Step 3: If ambiguous, check dates (newer approved artifact wins)
   ↓
Step 4: If still ambiguous, HALT and escalate to human
   ↓
Step 5: Human decides, documents decision in ADR
   ↓
Step 6: ADR becomes precedent for future conflicts
```

---

## 5. What This Document Does NOT Resolve

- **Business logic conflicts** → Domain-specific, handled in child repos
- **Runtime behavior** → Out of scope for IMO-Creator
- **Tool preferences** → See SNAP_ON_TOOLBOX.yaml
- **Naming conventions** → Local policy per CONSTITUTION.md

---

## 6. Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│           SOURCE OF TRUTH QUICK REFERENCE               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  CONSTITUTION.md          ← Supreme, wins all           │
│       ↓                                                 │
│  IMO_CONTROL.json         ← Control plane               │
│       ↓                                                 │
│  IMO_SYSTEM_SPEC.md       ← System index                │
│       ↓                                                 │
│  CANONICAL_ARCHITECTURE   ← Root doctrine               │
│       ↓                                                 │
│  Other doctrine/*.md      ← Specialized rules           │
│       ↓                                                 │
│  TAS_*.md                 ← Authoritative diagrams      │
│       ↓                                                 │
│  ERD diagrams             ← Schema truth                │
│       ↓                                                 │
│  Code comments            ← Lowest rank                 │
│                                                         │
│  RULE: Higher rank ALWAYS wins. No exceptions.          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-28 |
| Authority | IMO-Creator (Sovereign) |
| Status | LAW |
| Change Protocol | ADR + Human Approval |
