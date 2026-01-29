# Template Immutability Doctrine

**Status**: LOCKED
**Authority**: CONSTITUTIONAL
**Version**: 1.0.0
**Change Protocol**: HUMAN APPROVAL REQUIRED — NO EXCEPTIONS

---

## Purpose

This doctrine governs the immutability of all templates and doctrine files in IMO-Creator.

**These files are LAW. They do not change without human approval.**

---

## Immutable Artifacts

The following artifacts are LOCKED and IMMUTABLE:

### Doctrine Files (templates/doctrine/)

| File | Status | Change Protocol |
|------|--------|-----------------|
| `CANONICAL_ARCHITECTURE_DOCTRINE.md` | LOCKED | ADR + Human Approval |
| `HUB_SPOKE_ARCHITECTURE.md` | LOCKED | ADR + Human Approval |
| `ALTITUDE_DESCENT_MODEL.md` | LOCKED | ADR + Human Approval |
| `REPO_REFACTOR_PROTOCOL.md` | LOCKED | ADR + Human Approval |
| `DBA_ENFORCEMENT_DOCTRINE.md` | LOCKED | ADR + Human Approval |
| `TEMPLATE_IMMUTABILITY.md` | LOCKED | ADR + Human Approval |

### Constitutional Files (Root)

| File | Status | Change Protocol |
|------|--------|-----------------|
| `CONSTITUTION.md` | CONSTITUTIONAL | Human Approval Only |
| `IMO_CONTROL.json` | CONSTITUTIONAL | Human Approval Only |
| `UI_CONTROL_CONTRACT.json` | CONSTITUTIONAL | Human Approval Only |

### Template Files

| Directory | Status | Change Protocol |
|-----------|--------|-----------------|
| `templates/prd/` | LOCKED | ADR + Human Approval |
| `templates/adr/` | LOCKED | ADR + Human Approval |
| `templates/pr/` | LOCKED | ADR + Human Approval |
| `templates/checklists/` | LOCKED | ADR + Human Approval |
| `templates/claude/` | LOCKED | ADR + Human Approval |

---

## AI Non-Modification Clause

### Absolute Prohibitions

AI agents (including Claude Code) are PROHIBITED from:

1. **Modifying** any doctrine file
2. **Reordering** rules within doctrine files
3. **Rewriting** doctrine content
4. **Reinterpreting** doctrine meaning
5. **Adding** new rules to doctrine
6. **Removing** rules from doctrine
7. **Commenting out** doctrine rules
8. **Creating workarounds** for doctrine rules

### Violation Response

If an AI agent is asked to modify doctrine:

```
DOCTRINE MODIFICATION REFUSED

Request: [describe request]
Reason: Template Immutability Doctrine prohibits AI modification of doctrine files.
Required: Human approval for any doctrine change.

Action: BLOCKED
```

---

## Escalation Mechanism

When doctrine modification is required, follow this process:

### Step 1 — Raise ADR

Create an ADR documenting:
- What doctrine change is proposed
- Why current doctrine is insufficient
- Impact on downstream repos
- Rollback strategy

ADR Location: `docs/adr/ADR-XXX-doctrine-change-*.md`

### Step 2 — Block Merge

Any PR that would modify doctrine files MUST:
- Have an associated ADR
- Be blocked until ADR is approved
- Include explicit human approval in PR comments

```
DOCTRINE CHANGE PR BLOCKED

Reason: Doctrine modification requires ADR + human approval
ADR Required: Yes
ADR Status: [MISSING | PENDING | APPROVED]

Unblock Condition: ADR-XXX approved + human comment "APPROVED"
```

### Step 3 — Human Approval Gate

Human approval MUST be:
- Explicit (not implied)
- In writing (PR comment or ADR approval)
- From doctrine owner or sovereign authority

No silent approvals. No assumed consent.

---

## Human Approval Protocol

### For Doctrine Changes

1. Human initiates change request
2. ADR created documenting:
   - What is changing
   - Why it must change
   - Impact assessment
   - Rollback plan
3. ADR reviewed by doctrine owner
4. Human explicitly approves in writing
5. Change implemented by human (not AI)
6. Version incremented
7. Change logged to audit trail

### Approval Evidence Required

| Evidence | Format |
|----------|--------|
| Change Request | Written description |
| ADR | ADR-XXX-*.md |
| Approval | Explicit "APPROVED" statement |
| Implementer | Human name |
| Timestamp | ISO-8601 |

---

## Template Directory Structure (LOCKED)

```
templates/
├── README.md                              # Directory guide
├── SNAP_ON_TOOLBOX.yaml                   # Tool registry
├── doctrine/                              # LOCKED DOCTRINE
│   ├── CANONICAL_ARCHITECTURE_DOCTRINE.md # Master doctrine
│   ├── HUB_SPOKE_ARCHITECTURE.md          # Hub-spoke rules
│   ├── ALTITUDE_DESCENT_MODEL.md          # Descent gates
│   ├── REPO_REFACTOR_PROTOCOL.md          # Structure rules
│   ├── DBA_ENFORCEMENT_DOCTRINE.md        # DBA rules
│   └── TEMPLATE_IMMUTABILITY.md           # This file
├── claude/                                # LOCKED PROMPTS
│   ├── APPLY_DOCTRINE.prompt.md           # Doctrine execution
│   ├── DECLARE_STRUCTURE_AND_RENDER_TREE.prompt.md
│   ├── DECLARE_DATA_AND_RENDER_ERD.prompt.md
│   ├── DECLARE_EXECUTION_WIRING.prompt.md
│   └── DBA_ENFORCEMENT.prompt.md          # DBA enforcement
├── prd/                                   # LOCKED TEMPLATES
│   └── PRD_HUB.md
├── adr/                                   # LOCKED TEMPLATES
│   └── ADR.md
├── pr/                                    # LOCKED TEMPLATES
│   ├── PULL_REQUEST_TEMPLATE_HUB.md
│   └── PULL_REQUEST_TEMPLATE_SPOKE.md
├── checklists/                            # LOCKED TEMPLATES
│   └── HUB_COMPLIANCE.md
└── integrations/                          # LOCKED TEMPLATES
    ├── COMPOSIO.md
    ├── DOPPLER.md
    ├── HEIR.md
    ├── OBSIDIAN.md
    └── TOOLS.md
```

**This structure is IMMUTABLE.**

---

## Enforcement Verification

Before any operation, verify:

| # | Check | Pass Criteria |
|---|-------|---------------|
| 1 | Doctrine Unmodified | No changes to doctrine files |
| 2 | Structure Preserved | Directory structure intact |
| 3 | No AI Modifications | AI has not altered any locked file |
| 4 | Human Approval Present | If changes exist, approval documented |

---

## Violation Categories

| Category | Definition | Severity |
|----------|------------|----------|
| `DOCTRINE_MODIFICATION` | Doctrine file changed without approval | CRITICAL |
| `STRUCTURE_VIOLATION` | Directory structure altered | CRITICAL |
| `AI_MODIFICATION` | AI modified locked file | CRITICAL |
| `APPROVAL_MISSING` | Change without human approval | CRITICAL |
| `REINTERPRETATION` | Rule meaning altered | CRITICAL |

**ALL violations are CRITICAL. There are no warnings.**

---

## The Golden Rule

> **Doctrine is LAW.**
> **Templates are LAW.**
> **Structure is LAW.**
>
> **If you cannot comply, you do not proceed.**
> **If doctrine seems wrong, escalate to human.**
> **You do not fix doctrine. You enforce it.**

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-11 |
| Last Modified | 2026-01-11 |
| Version | 1.0.0 |
| Status | LOCKED |
| Authority | CONSTITUTIONAL |
| Change Protocol | HUMAN APPROVAL REQUIRED |
