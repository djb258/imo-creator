# System Funnel Overview

**Status**: NON-AUTHORITATIVE — EXPLANATORY ONLY
**Subordinate to**: CONSTITUTION.md, IMO_SYSTEM_SPEC.md
**Purpose**: End-to-end lifecycle from idea to execution

---

## The Funnel

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              IDEA / NEED                                     │
│                     (Problem, signal, opportunity)                           │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         HUB EXISTENCE JUSTIFICATION                          │
│                                                                              │
│   "This hub transforms [CONSTANTS] into [VARIABLES]."                        │
│                                                                              │
│   If this statement cannot be completed → hub is INVALID                     │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                          PRD (Behavioral Contract)                           │
│                                                                              │
│   §1  Sovereign Reference (CC-01)                                            │
│   §2  Hub Identity (CC-02)                                                   │
│   §3  Purpose & Transformation Declaration (CONST → VAR)                     │
│   §4  CTB Placement                                                          │
│   §5  IMO Structure                                                          │
│   §6  Spokes ← MANDATORY HUB-SPOKE DECISION (IMPLEMENTED or DECLINED)        │
│   §7  Constants vs Variables                                                 │
│   §8  Tools (reference only, scoped to M layer)                              │
│   §9+ Guard Rails, Kill Switch, Gates, Observability                         │
│                                                                              │
│   PRD is INVALID if §6 is empty or ambiguous.                                │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                          ERD (Structural Proof)                              │
│                                                                              │
│   Proves WHAT structural artifacts are allowed to exist.                     │
│   Every table must:                                                          │
│     - Depend on a declared constant                                          │
│     - Represent a declared variable                                          │
│     - Be owned by a declared pass                                            │
│     - Have lineage enforcement mechanism                                     │
│                                                                              │
│   No orphan tables. No speculative tables.                                   │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        PROCESS (Flow Declaration)                            │
│                                                                              │
│   Declares HOW transformations execute.                                      │
│   Process MUST:                                                              │
│     - Reference governing PRD                                                │
│     - Reference governing ERD                                                │
│     - Introduce NO new constants                                             │
│     - Introduce NO new variables                                             │
│     - Match pass sequence from PRD/ERD                                       │
│                                                                              │
│   Process is execution declaration, not transformation definition.           │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                       EXECUTION AUTHORIZATION                                │
│                                                                              │
│   ┌────────────────────────┐    ┌────────────────────────┐                   │
│   │   SNAP-ON TOOLBOX      │    │   AI_EMPLOYEE_TASK     │                   │
│   │   (Legal tools only)   │    │   (Job ticket)         │                   │
│   │                        │    │                        │                   │
│   │   - Tier 0: Free       │    │   - Scope              │                   │
│   │   - Tier 1: Cheap      │    │   - Traceability       │                   │
│   │   - Tier 2: Gated      │    │   - Tools allowed      │                   │
│   │   - Banned: Forbidden  │    │   - Constraints        │                   │
│   └────────────────────────┘    └────────────────────────┘                   │
│                                                                              │
│   Tools implement processes but do not define them.                          │
│   Tools are explicitly downstream and replaceable.                           │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                           EXECUTION (IMO)                                    │
│                                                                              │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│   │   INGRESS    │───▶│    MIDDLE    │───▶│    EGRESS    │                   │
│   │     (I)      │    │     (M)      │    │     (O)      │                   │
│   │              │    │              │    │              │                   │
│   │  Data entry  │    │  All logic   │    │  Output      │                   │
│   │  No logic    │    │  All state   │    │  No logic    │                   │
│   │  No state    │    │  All tools   │    │  No state    │                   │
│   └──────────────┘    └──────────────┘    └──────────────┘                   │
│                                                                              │
│   AI Employees enforce gates.                                                │
│   Spokes connect to I or O only — never M.                                   │
│   Logic lives ONLY in M.                                                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Stage Explanations

### 1. Idea / Need

The starting point. A problem, signal, or opportunity that may require a system response.

At this stage, nothing exists. No artifacts, no authority, no justification.

### 2. Hub Existence Justification

The first gate. A hub's right to exist is proven by the transformation statement:

> "This system transforms [CONSTANTS] into [VARIABLES]."

If this statement cannot be completed, the hub is INVALID under CONSTITUTION.md.

This justification is captured in PRD §3, not as a separate artifact.

### 3. PRD (Behavioral Contract)

The PRD is the behavioral proof. It declares:

- What the hub transforms (CONST → VAR)
- Where the hub lives (CTB placement)
- How data flows internally (IMO structure)
- Whether spokes exist (MANDATORY: IMPLEMENTED or DECLINED)
- What tools are referenced (scoped to M layer)

The PRD is legal at CC-02 (Hub level).

### 4. ERD (Structural Proof)

The ERD proves what structural artifacts (tables, schemas) are allowed to exist.

Every artifact must trace to:
- A declared constant (input)
- A declared variable (output)
- A declared pass (ownership)
- A lineage mechanism (enforcement)

No orphan artifacts. No speculative artifacts.

### 5. Process (Flow Declaration)

The Process declares how transformations execute. It does not define new transformations.

Process references PRD and ERD. It introduces no new constants or variables.

Process is legal at CC-03/CC-04 (Context/Execution level).

### 6. Execution Authorization

Before execution, two things must be established:

**SNAP-ON TOOLBOX**: The only legal source of tools.
- Tier 0: Free tools (prefer first)
- Tier 1: Cheap tools (existing subscriptions)
- Tier 2: Gated tools (require conditions)
- Banned: Forbidden (suggest alternative)

**AI_EMPLOYEE_TASK.yaml**: The job ticket.
- Scope: What repo, hub, sub-hub
- Traceability: Links to CONST → VAR
- Tools allowed: From SNAP-ON TOOLBOX
- Constraints: What AI can/cannot do

Tools implement processes but do not define them.

### 7. Execution (IMO)

The runtime phase. Data flows through Ingress → Middle → Egress.

| Layer | Role |
|-------|------|
| **Ingress (I)** | Data entry point. No logic, no state, no decisions. |
| **Middle (M)** | All logic, all decisions, all state, all tools. |
| **Egress (O)** | Output point. No logic, no state, no decisions. |

AI Employees enforce gates during execution.
Spokes connect to I or O only — never M.

---

## Conceptual Design Dependency Order

This is a conceptual dependency stack, not a build sequence.

Each concept must be settled before the next can make sense.

```
1. CANONICAL    →  Authority and identity must exist first
        │
        ▼
2. CTB          →  Placement and boundaries depend on authority
        │
        ▼
3. ALTITUDE     →  Justification and resolution level depend on placement
        │
        ▼
4. IMO          →  Behavioral containment depends on justification
        │
        ▼
5. EXECUTION    →  Tools and workers depend on all of the above
```

| Layer | What Must Be Settled |
|-------|---------------------|
| Canonical | Who has authority? What identities exist? |
| CTB | Where do components live? What boundaries exist? |
| Altitude | At what CC level is this artifact legal? What gates apply? |
| IMO | How does data flow? Where does logic live? |
| Execution | What tools implement? What workers execute? |

---

## Key Rules (Summary)

| Rule | Source |
|------|--------|
| Nothing exists without CONST → VAR proof | CONSTITUTION.md |
| PRD before code | Altitude Descent Model |
| Hub-Spoke decision inside PRD (§6) | PRD Template |
| Tools from SNAP-ON TOOLBOX only | Tool Doctrine |
| Logic in M layer only | IMO Doctrine |
| Spokes touch I or O only, never M | Hub-Spoke Doctrine |
| No sideways hub-to-hub calls | Cross-Hub Isolation |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-30 |
| Authority | NON-AUTHORITATIVE |
| Subordinate To | CONSTITUTION.md, IMO_SYSTEM_SPEC.md |
| Purpose | End-to-end lifecycle explanation |
| Change Protocol | Human approval required |
