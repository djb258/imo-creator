# PRD Migration Prompt

**Purpose**: Retrofit existing PRDs with mandatory HSS (Hub-and-Spoke Set Up) section
**Authority**: OPERATIONAL
**Status**: LOCKED

---
## NAVIGATION

| Field | Value |
|-------|-------|
| **Prerequisites** | Existing PRD without HSS section |
| **Runs After** | `APPLY_DOCTRINE.prompt.md` (when audit flags missing HSS) |
| **Next Prompt** | `PRD_TO_ERD_WORKFLOW.prompt.md` (after migration complete) |
| **Halt Conditions** | PRD not found, cannot extract required fields, human review needed |

**Use this prompt ONLY for legacy PRDs. New PRDs should use `HUB_DESIGN_DECLARATION_INTAKE.prompt.md` first.**

---

## When to Use

Use this prompt when:
- An existing PRD lacks the HSS (Hub-and-Spoke Set Up) section
- A PRD was created before HSS became mandatory
- Compliance audit flags PRD as missing HSS

---

## Prerequisites

Before running this prompt:
1. Locate the existing PRD file
2. Confirm it is a hub PRD (not spoke or other artifact)
3. Have access to SNAP_ON_TOOLBOX.yaml for tool references

---

## Migration Process

### Step 1: Read Existing PRD

Read the existing PRD and extract:
- Hub name and ID from §2
- Transformation statement from §3
- Constants from §3
- Variables from §3
- Spoke declarations from §6 (if any)
- Tools from §8 (if any)

### Step 2: Generate HSS Section

Insert the following at the VERY TOP of the PRD file:

```markdown
# HSS — Hub-and-Spoke Set Up (NON-AUTHORITATIVE — FILL FIRST)

> **This section is a fill-first design worksheet.**
> It exists to force architectural clarity before formal specification.
> It has NO governing authority.
> The authoritative PRD begins in §1.
> All decisions declared here MUST be restated formally below.

---

## Idea / Need

[EXTRACTED: Derive from §3 Purpose or ask human]

---

## Hub Justification

[EXTRACTED: This hub exists to transform [CONSTANTS from §3] into [VARIABLES from §3].]

---

## Hub–Spoke Decision

**Hub–Spoke does NOT exist by default.**
Spokes are boundary-crossing transport only.
Logic, decisions, and transformations belong ONLY in the hub (Middle layer).

Choose ONE and complete:

### Option A: IMPLEMENTED

[EXTRACTED: If §6 has spokes, list them here with justification]

| Spoke | Type (I/O) | Justification |
|-------|------------|---------------|
| [from §6] | [from §6] | [derive or ask] |

### Option B: DECLINED

[EXTRACTED: If §6 is empty or says "none", explain why]

**Selected option**: [IMPLEMENTED if spokes exist, DECLINED if not]

---

## Candidate Constants

[EXTRACTED: Copy from §3 Constants table]

| Constant | Source | Description |
|----------|--------|-------------|
| [from §3] | [from §3] | [from §3] |

---

## Candidate Variables

[EXTRACTED: Copy from §3 Variables table]

| Variable | Destination | Description |
|----------|-------------|-------------|
| [from §3] | [from §3] | [from §3] |

---

## Candidate Tools (SNAP-ON TOOLBOX ONLY)

[EXTRACTED: Map §8 tools to SNAP-ON TOOLBOX IDs]

| Tool ID | Tier | Purpose |
|---------|------|---------|
| [TOOL-NNN] | [0/1/2] | [from §8] |

---

# VALIDATION RULE

**The PRD is INVALID unless §§1–15 fully restate all authoritative decisions.**

No section below may reference or defer to the HSS section.
Statements such as "see declaration above" are forbidden.

---
---
```

### Step 3: Update §6 Hub-Spoke Status

Add or update the Hub-Spoke Status field in §6:

```markdown
**Hub–Spoke Status**: [ IMPLEMENTED / DECLINED ]
```

### Step 4: Add Governing ERD to Traceability

Ensure Traceability section includes:

```markdown
| **Governing ERD** | [path to ERD] |
| **Governing Process** | [path to Process] |
```

### Step 5: Verify Consistency

Check that:
- HSS constants match §3 constants
- HSS variables match §3 variables
- HSS Hub-Spoke decision matches §6
- HSS tools match §8

If ANY mismatch → ASK HUMAN to resolve

---

## Migration Output

After migration, output:

```
PRD MIGRATION COMPLETE
──────────────────────
PRD: [path]
Hub: [HUB-ID]

Migration actions:
  [x] HSS section inserted
  [x] Hub-Spoke Status added to §6
  [x] Governing ERD field added
  [x] Consistency verified

Warnings (if any):
  - [list any mismatches requiring human review]

Status: MIGRATED
Next: Run HUB_COMPLIANCE.md to verify
```

---

## Human Review Required

After migration, human MUST:
1. Review Idea/Need field (may need refinement)
2. Review Hub-Spoke justifications
3. Fill any [EXTRACTED: ask human] placeholders
4. Run compliance checklist

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-30 |
| Authority | OPERATIONAL |
| Purpose | Retrofit existing PRDs with HSS (Hub-and-Spoke Set Up) |
