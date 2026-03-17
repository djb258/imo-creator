---
name: code-simplifier
description: Simplifies and refines code for clarity, consistency, and maintainability while preserving all functionality. Operates on recently modified code unless instructed otherwise. Doctrine-aware — respects CTB branch boundaries and IMO layer separation during refactoring.
---

# code-simplifier — Doctrine-Native Code Simplification

**Authority:** CC-04 (Process). This skill executes at runtime altitude. It does not modify doctrine, templates, or hub structure. It refines code within existing architectural boundaries.

**Replaces:** Anthropic `code-simplifier` plugin v1.0.0. All capabilities preserved. Doctrine awareness added.

---

## IMO — Ingress / Middle / Egress

**Ingress (Trigger):** User invokes `/code-simplifier`, or code has been recently modified in the current session. Ingress validates that target files exist and identifies their CTB branch placement and IMO layer membership. No decisions occur here — schema validation only.

**Middle (Processing):**
- Separate Constants from Variables for the simplification pass
- Read project CLAUDE.md for project-specific coding standards
- Identify recently modified code sections (scoped, not whole-codebase)
- Analyze each section for clarity, redundancy, and anti-pattern violations
- Apply simplification transforms that preserve exact functionality
- Verify no CTB branch boundary or IMO layer boundary has been crossed
- Verify no functionality has changed — only structure and clarity

**Egress (Output):** Simplified code delivered as edits to existing files. Read-only output — the egress produces the refined code and a summary of changes. No logic lives here.

**Go/No-Go Gate:** Before delivering any simplification, confirm: (1) all original functionality is preserved, (2) no CTB or IMO boundaries have been violated, (3) the code is genuinely simpler, not just different.

---

## Constants — What Is Fixed About Every Simplification

1. Functionality preservation is the highest priority. Never change WHAT code does — only HOW it does it.
2. Every simplification pass reads the project's CLAUDE.md first to load project-specific standards.
3. Scope is limited to recently modified code unless the user explicitly broadens it.
4. Clarity is preferred over compactness. Explicit code beats clever code.
5. Anti-patterns are always flagged: nested ternaries, dense one-liners, junk-drawer utils, over-abstraction.
6. CTB branch boundaries are never crossed during refactoring. Code in `data/` stays in `data/`.
7. IMO layer boundaries are never crossed. Ingress logic (validation) does not merge into Middle (decisions). Middle logic does not leak into Egress (views).
8. Simplification is reductive. It removes complexity. It does not add abstractions, layers, or indirection.

---

## Variables — What Changes Per Invocation

| Variable | What It Is | Who Sets It |
|----------|-----------|-------------|
| `target_files` | Files to simplify | Detected from recent modifications or user-specified |
| `project_standards` | Coding conventions from CLAUDE.md | Read from project root |
| `language` | Programming language of target files | Detected from file extensions |
| `ctb_branch` | Which CTB branch the file belongs to | Determined from file path under `src/` |
| `imo_layer` | Which IMO layer the code operates in | Determined from code analysis |
| `scope_override` | Whether user requested broader scope | User input, defaults to false |

---

## Hub-and-Spoke Configuration

The simplification process is a wheel. The hub is the simplified output delivered to the user. Each spoke is an analysis or transform phase that feeds the hub.

| Spoke | Input | Output | Interface to Hub |
|-------|-------|--------|-----------------|
| Discover | Session state or user request | List of target files with CTB/IMO metadata | Go/No-Go: files exist and are within scope |
| Standards | Project CLAUDE.md | Loaded coding conventions | Go/No-Go: standards identified (or defaults applied) |
| Analyze | Target files + standards | Simplification opportunities ranked by impact | Go/No-Go: at least one opportunity identified |
| Transform | Ranked opportunities | Proposed code changes | Go/No-Go: functionality preserved, boundaries intact |
| Verify | Proposed changes | Verified simplifications | Go/No-Go: no behavior change, no boundary violation |
| Deliver | Verified simplifications | Applied edits + change summary | Final output |

**Hub rule:** The hub (simplified output) is the only thing that touches the outside world. Spokes do not call other spokes. Each spoke completes its job and hands off to the hub. The Analyze spoke does not apply changes. The Transform spoke does not verify. Separation is absolute.

---

## Phase Failure Handling

Every phase has two exit paths: Go (proceed) and No-Go (failure).

**Constants:**
- Silent retry is never the response to a phase failure.
- A three-field log is always produced before escalation: (1) which phase failed, (2) what was attempted, (3) what was returned.
- The user decides whether to retry, adjust scope, or abort.
- If a simplification would change functionality, that is a No-Go on the Transform phase — not an error to fix silently.

**Variables:**
- The specific phase that failed.
- The specific error or unexpected output.

**OTHER path:** If a failure cannot be classified (e.g., ambiguous whether functionality changed), log it with `phase_failed`, `attempted_action`, and `raw_output`. Do not attempt to resolve without user input. When in doubt, do not simplify — preserving functionality is the supreme constant.

---

## Rules — What This Skill Never Does

1. **Never change functionality.** If a simplification alters behavior, inputs, outputs, side effects, or error handling, it is rejected. This is the supreme rule. All other rules are subordinate.
   - *Reasoning:* The entire value of simplification is zero if behavior changes. Users must trust that simplified code is identical in behavior.

2. **Never refactor across CTB branch boundaries.** Code in `sys/` does not get merged with code in `app/`. Code in `data/` does not move to `ai/`. Each branch is a sovereign domain.
   - *Reasoning:* CTB branches exist because different code types have different governance. Crossing boundaries creates architectural drift.

3. **Never merge IMO layers.** Ingress validation logic stays in Ingress. Middle decision logic stays in Middle. Egress view logic stays in Egress. Do not "simplify" by combining validation with business logic or by putting decisions in views.
   - *Reasoning:* IMO separation is constitutional. Merging layers creates coupling that doctrine exists to prevent.

4. **Never introduce nested ternary operators.** Prefer `if/else` chains or `switch` statements for multiple conditions. A single ternary for a simple binary condition is acceptable.
   - *Reasoning:* Nested ternaries are the canonical example of "clever code" — compact but unreadable.

5. **Never over-abstract.** Do not extract single-use helper functions. Do not create wrapper classes for simple operations. Do not add indirection layers in the name of "clean code."
   - *Reasoning:* Premature abstraction is complexity, not simplification. Extract when there is genuine duplication, not before.

6. **Never prioritize line count.** Fewer lines is not the goal. Clearer lines is the goal. A 10-line `if/else` that is immediately readable beats a 3-line chain of ternaries and logical operators.
   - *Reasoning:* Line count is a vanity metric. Cognitive load is the real cost.

7. **Never simplify locked files.** If a file is marked as locked, read-only, or constitutional in the project's CLAUDE.md, do not modify it.
   - *Reasoning:* Locked files require ADR + human approval. An automated simplifier has no authority to modify them.

8. **Never operate on the entire codebase unsolicited.** Default scope is recently modified files only. Broader scope requires explicit user instruction.
   - *Reasoning:* Unbounded simplification creates unbounded risk. Scoping is a constant, not a suggestion.

---

## Architectural Awareness

This skill operates at CC-04 (Process) altitude. It refines code within existing structure. It does not create new structure, modify hub identity, or alter data flow topology.

### Altitude Model — Where This Skill Sits

| Layer | Name | This Skill's Relationship |
|-------|------|--------------------------|
| CC-01 | Sovereign | Reads doctrine from imo-creator. Never modifies. |
| CC-02 | Hub | Reads project CLAUDE.md for standards. Never modifies hub structure. |
| CC-03 | Context | Operates within a single module or file scope. |
| CC-04 | Process | **This is where simplification executes.** Runtime, single invocation. |

### Two-Table Pattern — Applied to Simplification

| Outcome | Analogy | Action |
|---------|---------|--------|
| Clean simplification | CANONICAL | Apply the edit. Report in change summary. |
| Ambiguous simplification | ERROR | Do not apply. Report to user with reasoning. Let user decide. |

If the Analyze spoke produces many ambiguous results, that signals the project standards (Constants) are underspecified. The fix is to improve the project's CLAUDE.md, not to guess.

### CTB Backbone — Branch Boundary Enforcement

When simplifying code in a repo that follows CTB structure, the simplifier respects branch sovereignty:

| Branch | Contains | Simplification Boundaries |
|--------|----------|--------------------------|
| `sys/` | Config, env, bootstrap | Do not merge with app logic. Do not inline config. |
| `data/` | Schemas, migrations, queries | Do not move query logic into app/. Do not embed schemas in code. |
| `app/` | Business logic, services | Do not extract to ai/. Do not merge with data/. |
| `ai/` | Agents, prompts, routers | Do not merge prompt logic with app logic. |
| `ui/` | Pages, components, layouts | Do not merge with app/ services. |

If a file's path does not map to CTB branches (non-CTB repo), this constraint is inactive. The simplifier adapts to the project — it does not impose CTB on projects that do not use it.

---

## Workflow

### Phase 1 — Discover (Spoke 1)

**Constants for this phase:**
- Default scope is recently modified files in the current session.
- Each file is tagged with its language, CTB branch (if applicable), and IMO layer (if detectable).

**Variables for this phase:**
- The specific files modified or specified by the user.
- Whether the user has overridden the default scope.

**Execute:**
1. Check git status or session history for recently modified files.
2. If the user specified files or directories, use those instead.
3. For each file, determine: language, CTB branch (from path), IMO layer (from code patterns — validation = Ingress, logic/state = Middle, views/output = Egress).
4. Exclude any files marked as locked or read-only in CLAUDE.md.

**Go/No-Go:** Are there files in scope to simplify? If yes, proceed. If no, inform the user — nothing to simplify.

### Phase 2 — Standards (Spoke 2)

**Constants for this phase:**
- Project CLAUDE.md is always read if it exists.
- If no CLAUDE.md exists, apply language-standard best practices only.

**Variables for this phase:**
- The specific coding standards found in the project.

**Execute:**
1. Read `CLAUDE.md` from the project root.
2. Extract coding standards: naming conventions, import rules, function style preferences, error handling patterns, component patterns.
3. If CLAUDE.md contains locked file declarations, record them for exclusion.
4. Merge project standards with the Constants from this skill (this skill's Constants take precedence on conflicts — e.g., "never nest ternaries" overrides a project standard that permits them).

**Go/No-Go:** Are standards loaded (from CLAUDE.md or defaults)? If yes, proceed. Always yes — defaults exist.

### Phase 3 — Analyze (Spoke 3)

**Constants for this phase:**
- Every opportunity is classified as CLEAR (safe to apply) or AMBIGUOUS (needs user decision).
- Opportunities are ranked: redundancy removal first, then clarity improvements, then style alignment.

**Variables for this phase:**
- The specific opportunities found in the target files.

**Execute:**
For each file in scope, identify:
1. **Redundant code** — duplicated logic, unnecessary variables, dead code paths.
2. **Complexity** — deep nesting, long functions, complex conditionals.
3. **Anti-patterns** — nested ternaries, clever one-liners, junk-drawer helpers, over-abstraction.
4. **Style drift** — deviations from project standards (naming, imports, function style).
5. **Boundary violations** — code that crosses CTB branches or merges IMO layers (flag but do not "fix" by moving code — report to user).

Classify each as CLEAR or AMBIGUOUS. CLEAR means the simplification obviously preserves functionality. AMBIGUOUS means there is any doubt.

**Go/No-Go:** At least one CLEAR opportunity found? If yes, proceed. If only AMBIGUOUS, present findings to user and ask for direction.

### Phase 4 — Transform (Spoke 4)

**Constants for this phase:**
- Only CLEAR opportunities are transformed without confirmation.
- AMBIGUOUS opportunities are presented to the user before transformation.
- Each transform is atomic — one logical change at a time, not batched rewrites.

**Variables for this phase:**
- The specific transforms applied.

**Execute:**
For each CLEAR opportunity:
1. Draft the simplified code.
2. Verify the transform preserves: function signatures, return values, side effects, error behavior, type contracts.
3. Verify no CTB branch boundary is crossed.
4. Verify no IMO layer boundary is crossed.

For AMBIGUOUS opportunities:
1. Present the opportunity to the user with: current code, proposed change, reasoning, and risk assessment.
2. Apply only if the user approves.

**Go/No-Go:** All transforms preserve functionality and respect boundaries? If yes, proceed. If any transform is uncertain, classify it as AMBIGUOUS and route to user.

### Phase 5 — Verify (Spoke 5)

**Constants for this phase:**
- Verification checks behavior preservation, not style preference.
- If the project has tests, suggest running them after simplification.

**Variables for this phase:**
- The specific verification checks performed.

**Execute:**
1. Review each transform one final time: does the simplified code do exactly what the original did?
2. Check that no imports were broken, no types were changed, no error paths were altered.
3. If the project has a test suite, remind the user to run tests after the simplification is applied.

**Go/No-Go:** All transforms verified? If yes, proceed to delivery. If any fails verification, revert that specific transform and report why.

### Phase 6 — Deliver (Spoke 6)

**Constants for this phase:**
- Delivery is applied edits plus a change summary.
- The change summary lists each simplification with before/after and reasoning.

**Execute:**
1. Apply all verified transforms as file edits.
2. Produce a change summary:
   - Number of files simplified
   - For each file: what changed and why
   - Any AMBIGUOUS opportunities that were skipped (for user awareness)
   - Reminder to run tests if applicable

**Go/No-Go:** Edits applied and summary delivered. Task complete.

---

## CTB Backbone Mapping

When this skill's output (simplified code) lands in a CTB-structured repo:

- Simplified code stays in the same CTB branch as the original. No cross-branch movement.
- If simplification reveals that code is misplaced (e.g., business logic in `sys/`), the simplifier reports the misplacement but does not move the code. Moving code across branches is a hub-level architectural decision, not a process-level simplification.

**Diagnostic:** If the simplifier frequently encounters code that spans multiple CTB branches or IMO layers, that signals an architectural issue upstream. Report it. Do not try to fix architecture with simplification.

---

## Constant-First Principle

Applied to code simplification: every simplification should reduce the number of things a reader must hold in working memory.

- A constant (hardcoded value, fixed pattern, explicit type) is cheaper to read than a variable (computed value, dynamic pattern, inferred type).
- When simplifying, prefer making implicit things explicit. Extract magic numbers into named constants. Replace inferred types with explicit annotations. Replace dynamic dispatch with static dispatch where the set of cases is known.
- A high count of "clever" patterns in code is the same signal as a high variable count in a skill — it means the Constants block (the explicit, fixed, readable parts) is incomplete.

---

## Iteration

After delivering simplifications, iterate based on real outcomes:

1. Did any simplification cause a test failure? That is a Transform phase gap — the functionality check missed something. Add it to the verification checklist.
2. Did the user reject an AMBIGUOUS classification that should have been CLEAR? That is a Standards phase gap — the project conventions need to be more explicit in CLAUDE.md.
3. Did the simplifier miss an obvious improvement? That is an Analyze phase gap — add the pattern to the anti-pattern list.
4. Did a simplification cross a CTB or IMO boundary? That is a Discover phase gap — the boundary detection needs improvement.

The goal: simplified code that any developer (or LLM) can read, understand, and maintain without context about the simplification process.

---

## Installation Targets

- **Global:** `~/.claude/commands/code-simplifier.md` (all projects)
- **Project-level:** `.claude/commands/code-simplifier.md` (single project)
