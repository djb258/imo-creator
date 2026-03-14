# PRD to ERD Workflow

**Purpose**: Validate PRD completeness, generate clarifying questions, create ERD
**Authority**: OPERATIONAL
**Status**: LOCKED

---
## NAVIGATION

| Field | Value |
|-------|-------|
| **Prerequisites** | `HUB_DESIGN_DECLARATION.yaml` status = CONFIRMED, PRD exists |
| **Runs After** | `HUB_DESIGN_DECLARATION_INTAKE.prompt.md` |
| **Next Prompt** | `DECLARE_DATA_AND_RENDER_ERD.prompt.md` (after ERD created) |
| **Halt Conditions** | PRD missing HSS section, human hasn't answered questions |

**This is the ONLY authorized ERD creation path.**

---

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: VALIDATE PRD                                          │
│  Check HSS (Hub-and-Spoke Set Up) completeness                  │
│  Check PRD body consistency                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: GENERATE QUESTIONS                                    │
│  Auto-detect gaps in HSS section                                │
│  Generate clarifying questions for each gap                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: HUMAN CONFIRMATION                                    │
│  Present questions to human                                     │
│  WAIT for answers before proceeding                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 4: CREATE ERD                                            │
│  Generate ERD from validated PRD                                │
│  Link ERD back to PRD                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Validate PRD

### Step 1.1: Check HSS Section Exists

```
Does PRD have HSS (Hub-and-Spoke Set Up) section at top?
  ├─ YES → Continue
  └─ NO → HALT. Run PRD_MIGRATION.prompt.md first.
```

### Step 1.2: Check HSS Completeness

For each field, check if completed:

| Field | Check | Gap Type |
|-------|-------|----------|
| Idea/Need | Not empty, not placeholder | CRITICAL |
| Hub Justification | Contains CONST and VAR | CRITICAL |
| Hub-Spoke Decision | IMPLEMENTED or DECLINED selected | CRITICAL |
| Hub-Spoke Justification | If IMPLEMENTED, spokes listed with reasons | HIGH |
| Candidate Constants | At least one constant listed | CRITICAL |
| Candidate Variables | At least one variable listed | CRITICAL |
| Candidate Tools | Tools listed OR "none required" stated | HIGH |

### Step 1.3: Check PRD Body Consistency

| Check | Validation |
|-------|------------|
| §3 Constants match HSS | Same items, same count |
| §3 Variables match HSS | Same items, same count |
| §6 Hub-Spoke Status matches HSS | IMPLEMENTED/DECLINED consistent |
| §8 Tools match HSS | Same tools referenced |

---

## Phase 2: Generate Questions

For each gap detected in Phase 1, generate a clarifying question.

### Question Templates

**If Idea/Need is empty or vague:**
```
QUESTION: What specific problem or need caused this hub to exist?
CONTEXT: The HSS section requires a clear statement of the problem being solved.
EXAMPLE: "Customer data arrives in multiple formats and needs standardization."
```

**If Hub Justification is incomplete:**
```
QUESTION: What constants does this hub receive, and what variables does it produce?
CONTEXT: Every hub must transform declared constants into declared variables.
EXAMPLE: "This hub transforms [raw CSV files] into [validated customer records]."
```

**If Hub-Spoke Decision is missing:**
```
QUESTION: Does this hub require external boundary crossings (spokes)?
CONTEXT: Spokes are transport-only conduits. Hub-Spoke does NOT exist by default.
OPTIONS:
  A) IMPLEMENTED - List each spoke and why it's needed
  B) DECLINED - Hub operates without external boundary crossings
```

**If IMPLEMENTED but no spokes listed:**
```
QUESTION: What spokes are needed and why?
CONTEXT: Each spoke must have:
  - Name
  - Type (Ingress I or Egress O)
  - Justification for why variability requires this spoke
```

**If Constants are missing:**
```
QUESTION: What immutable inputs does this hub receive?
CONTEXT: Constants are ADR-gated to change. List all external inputs.
EXAMPLE: "API webhook payloads", "CSV file uploads", "Database records"
```

**If Variables are missing:**
```
QUESTION: What outputs does this hub produce?
CONTEXT: Variables are the governed outputs of the transformation.
EXAMPLE: "Validated records", "Enriched profiles", "Export files"
```

**If Tools are missing:**
```
QUESTION: What tools from SNAP-ON TOOLBOX does this hub require?
CONTEXT: Reference SNAP_ON_TOOLBOX.yaml for approved tools.
OPTIONS:
  - List TOOL-NNN IDs needed
  - OR state "No external tools required"
```

---

## Phase 3: Human Confirmation

### Step 3.1: Present Questions

Output all generated questions:

```
PRD VALIDATION — QUESTIONS REQUIRED
───────────────────────────────────
PRD: [path]
Hub: [HUB-ID]
Gaps Detected: [count]

QUESTIONS:

1. [Question from Phase 2]
   Context: [context]

2. [Question from Phase 2]
   Context: [context]

[... all questions ...]

─────────────────────────────────────────────────────
HUMAN ACTION REQUIRED:
Answer all questions above before ERD can be created.
─────────────────────────────────────────────────────
```

### Step 3.2: Wait for Answers

**DO NOT proceed to Phase 4 until human provides answers.**

After receiving answers:

```
ANSWERS RECEIVED
────────────────
1. [Question]: [Human's answer]
2. [Question]: [Human's answer]

Proceeding to ERD creation...
```

### Step 3.3: Update PRD with Answers

If answers require PRD updates:
1. Update HSS section with clarified information
2. Update corresponding PRD body sections
3. Verify consistency again

---

## Phase 4: Create ERD

### Step 4.1: ERD Structure

Create ERD based on validated PRD:

```markdown
# ERD — [Hub Name]

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | |
| **Governing PRD** | [path to PRD] |
| **CC Layer** | CC-02 |

---

## Tables

For each Variable declared in PRD, create a table entry:

### [Table Name]

| Field | Value |
|-------|-------|
| **Depends On Constant** | [which constant from PRD] |
| **Represents Variable** | [which variable from PRD] |
| **Producing Pass** | [CAPTURE / COMPUTE / GOVERN] |
| **Lineage Enforcement** | [mechanism] |

| Column | Type | Description |
|--------|------|-------------|
| | | |

---
```

### Step 4.2: Link ERD to PRD

Update PRD Traceability section:

```markdown
| **Governing ERD** | [path to newly created ERD] |
```

### Step 4.3: Output Confirmation

```
ERD CREATED
───────────
PRD: [path]
ERD: [path]
Hub: [HUB-ID]

Tables created: [count]
  - [table 1] (from variable: [var name])
  - [table 2] (from variable: [var name])

Linkage:
  PRD → ERD: [path in PRD Traceability]
  ERD → PRD: [path in ERD Conformance]

Status: COMPLETE
Next: Run HUB_COMPLIANCE.md §A.3 (ERD Compliance)
```

---

## Halt Conditions

HALT and report if:
- PRD has no HSS section (run migration first)
- HSS has CRITICAL gaps and human doesn't answer
- PRD body contradicts HSS section
- Human explicitly rejects proceeding

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-30 |
| Authority | OPERATIONAL |
| Purpose | PRD validation, question generation, ERD creation |
