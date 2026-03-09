---
description: "Doctrine-native feature development — guided discovery, architecture, implementation with CTB placement and approval gates"
argument-hint: "Feature description or request"
allowed-tools: "Bash, Glob, Grep, Read, Edit, Write, TaskCreate, TaskUpdate, TaskList, TaskGet, WebFetch, WebSearch"
---

# feature-dev — Doctrine-Native Feature Development

**Authority:** Global command (CC-04 process altitude). Conforms to skill-creator framework at `/Users/employeeai/Documents/IMO-Creator/skills/skill-creator/SKILL.md`. Reads doctrine from `/Users/employeeai/Documents/IMO-Creator/templates/doctrine/ARCHITECTURE.md`.

---

## IMO — Ingress / Middle / Egress

**Ingress (Trigger):** User requests a new feature via `$ARGUMENTS` or describes what needs to be built.

**Middle (Processing):**
- Discover what needs to be built and confirm scope
- Explore the codebase with parallel agents targeting different aspects
- Surface all ambiguities as clarifying questions — wait for answers
- Design architecture with multiple approaches and CTB placement
- Implement with explicit user approval
- Review with parallel reviewers using confidence scoring
- Summarize deliverables

**Egress (Output):** Implemented, reviewed feature code with all files mapped to CTB branches, todos resolved, and summary delivered to user.

**Go/No-Go Gate:** Feature is not complete until Phase 7 summary is delivered and all todos are marked done.

---

## Constants — What Is Fixed About Every Feature Dev Session

1. The 7-phase workflow is always executed in order. No phase is skipped.
2. Phases 3, 4, and 5 each require explicit user approval before the next phase begins.
3. Parallel agent exploration always launches 2-3 agents with distinct focus areas.
4. Architecture design always presents multiple approaches with trade-offs.
5. Code review always uses confidence scoring; only issues >= 80 are reported.
6. Every new file must map to exactly one CTB branch (`sys/`, `data/`, `app/`, `ai/`, `ui/`) under `src/` when the target repo uses CTB structure.
7. Folders named `utils/`, `helpers/`, `common/`, `shared/`, `lib/`, `misc/` are forbidden.
8. Todo tracking is maintained throughout all phases.
9. The feature package is the hub. Each phase is a spoke. Spokes do not call other spokes.

---

## Variables — What Changes Per Feature

| Variable | What It Is | Who Sets It |
|----------|-----------|-------------|
| `feature_request` | What the user wants built (`$ARGUMENTS`) | User |
| `target_repo` | Which codebase receives the feature | Determined in Phase 1 |
| `ctb_branches_used` | Which of the 5 CTB branches are touched | Determined in Phase 4 |
| `cc_layer` | What altitude the feature operates at (CC-02/03/04) | Determined in Phase 4 |
| `architecture_choice` | Which design approach the user selects | User chooses in Phase 4 |
| `files_to_modify` | Specific files created or changed | Determined in Phase 4, executed in Phase 5 |
| `review_findings` | Issues surfaced by code reviewers | Determined in Phase 6 |

---

## Hub-and-Spoke Configuration

The feature development process is a wheel. The hub is the feature package being built. Each spoke is a phase that feeds the hub. Spokes complete their work and hand off to the hub — they do not call each other.

| Spoke | Input | Output | Interface to Hub |
|-------|-------|--------|-----------------|
| 1 Discovery | User request | Confirmed scope + todo list | Go/No-Go: scope is unambiguous |
| 2 Exploration | Confirmed scope | Codebase map + key files | Go/No-Go: patterns understood |
| 3 Questions | Codebase map + request | Resolved ambiguities | Go/No-Go: user answered all questions |
| 4 Architecture | Resolved scope + patterns | Chosen design + CTB mapping | Go/No-Go: user approved approach |
| 5 Implementation | Approved design | Working code | Go/No-Go: user approved to start; code complete |
| 6 Review | Implemented code | Consolidated findings | Go/No-Go: user decided on fixes |
| 7 Summary | Reviewed code | Deliverable summary | Go/No-Go: all todos complete |

**Hub rule:** The feature package (hub) is the only thing that touches the outside world. Each phase completes its job and hands off to the hub. No phase reaches into another phase's state.

---

## Phase Failure Handling

**Constants:**
- Silent retry is never the response to a phase failure.
- A three-field log is always produced before escalation: (1) which phase failed, (2) what was attempted, (3) what was returned.
- The user decides whether to retry, revise, or abort.

**Variables:**
- The specific phase that failed.
- The specific error or unexpected output.

**OTHER path:** If a failure cannot be classified (not a missing file, not a permission error, not a user rejection), log it with `phase_failed`, `attempted_action`, and `raw_output`. Do not attempt resolution without user input.

---

## Rules — What This Command Never Does

1. **Never skip clarifying questions.** Phase 3 exists because assumptions cause rework. Even if the request seems clear, surface at least edge cases and error handling questions.
2. **Never implement before user approval.** Phases 3, 4, and 5 each gate on explicit user confirmation. "Whatever you think is best" requires you to state your recommendation and get a yes.
3. **Never place files outside CTB branches.** When the target repo uses CTB structure, every new file maps to `sys/`, `data/`, `app/`, `ai/`, or `ui/` under `src/`. If unsure where a file belongs, ask — do not create junk-drawer folders.
4. **Never report low-confidence review issues.** Only issues scoring >= 80 on confidence are presented. Noise wastes user attention.
5. **Never modify locked doctrine files.** If the feature touches a file listed as LOCKED in any repo's CLAUDE.md, stop and inform the user. An ADR is required.
6. **Never let the LLM decide architecture alone.** Present options to the user. The user decides. LLM is tail, not spine.

---

## Architectural Awareness

### Altitude Model — CC Hierarchy

When designing a feature, identify which CC layer it operates at:

| Layer | Name | Feature Dev Implication |
|-------|------|------------------------|
| CC-01 | Sovereign | Template/doctrine changes — requires ADR, not feature-dev |
| CC-02 | Hub | New domain capability, new service, new data model |
| CC-03 | Context | Scoped module within existing hub boundary |
| CC-04 | Process | Runtime behavior, single execution path |

Most features are CC-03 or CC-04. If you identify a CC-02 feature, flag it — it may need its own hub definition package.

### Two-Table Pattern — CANONICAL + ERROR

If the feature persists data, its workflow gates ARE the promotion path:
- Data reaching CANONICAL has passed all gates.
- Everything else lands in ERROR.
- High ERROR volume after launch means a missing gate — fix the feature, not the error handler.

### CTB Backbone — 5 Branches

Every new file maps to one branch. Determine placement in Phase 4.

| Branch | Contains | Feature Files Land Here When |
|--------|----------|------------------------------|
| `sys/` | Env loaders, bootstraps, config | Feature produces infrastructure or config |
| `data/` | Schemas, queries, migrations | Feature produces data definitions or migrations |
| `app/` | Modules, services, business logic | Feature produces application logic |
| `ai/` | Agents, routers, prompts | Feature produces AI/LLM components |
| `ui/` | Pages, components, layouts | Feature produces interface components |

---

## Workflow

### Phase 1 — Discovery

**Constants:** The feature must have a single, describable scope before exploration begins.

**Variables:** The specific feature request and target repo context.

**Execute:**
1. Create a todo list with all 7 phases.
2. Read `$ARGUMENTS`. If the feature is unclear, ask:
   - What problem does this solve?
   - What should the feature do concretely?
   - Any constraints, deadlines, or requirements?
3. Summarize understanding back to the user. Confirm scope.

**Go/No-Go:** Can you state in one sentence what this feature does and where it lives? If yes, proceed. If no, ask.

---

### Phase 2 — Codebase Exploration

**Constants:** Always launch 2-3 parallel exploration agents with distinct focus areas. Always read the key files they identify.

**Variables:** The specific aspects to explore (varies by feature).

**Execute:**
1. Launch 2-3 subagents in parallel. Each agent should:
   - Trace through code comprehensively
   - Target a different aspect (similar features, architecture/abstractions, integration points)
   - Return a list of 5-10 key files

   Example agent prompts:
   - "Find features similar to [feature] and trace their implementation comprehensively. Return key files."
   - "Map the architecture, abstractions, and module boundaries for [area]. Return key files."
   - "Analyze integration points, testing patterns, and extension mechanisms for [area]. Return key files."

2. Read all key files identified by agents to build deep understanding.
3. Present comprehensive summary of patterns, conventions, and architecture discovered.
4. If the target repo uses CTB structure, identify which branches are relevant.

**Go/No-Go:** Do you understand the existing patterns well enough to design a feature that fits? If yes, proceed. If no, launch additional exploration.

---

### Phase 3 — Clarifying Questions (APPROVAL GATE)

**Constants:** This phase is never skipped. Questions are always presented before design begins.

**Variables:** The specific ambiguities discovered.

**Execute:**
1. Review codebase findings and the original request.
2. Identify underspecified aspects. Always consider:
   - Edge cases and error handling
   - Integration points with existing code
   - Scope boundaries (what is NOT included)
   - Backward compatibility
   - Performance requirements
   - Data persistence (if applicable — which tables, what promotion path)
   - CTB placement (which branch under `src/`)
3. Present all questions in an organized list.
4. **WAIT for user answers before proceeding.**

If user says "whatever you think is best" — state your recommendation explicitly and get confirmation.

**Go/No-Go:** Has the user answered all questions? If yes, proceed. If no, wait.

---

### Phase 4 — Architecture Design (APPROVAL GATE)

**Constants:** Always present multiple approaches. Always include CTB placement. Always recommend one approach with reasoning.

**Variables:** The specific approaches and their trade-offs.

**Execute:**
1. Launch 2-3 architecture subagents in parallel with different focuses:
   - **Minimal**: Smallest change, maximum reuse of existing patterns
   - **Clean**: Best abstractions, long-term maintainability
   - **Pragmatic**: Balance of speed and quality

   Each agent should analyze codebase patterns and deliver a concrete blueprint with file paths.

2. Review all approaches. For each, determine:
   - CTB branch mapping (which files go where under `src/`)
   - CC layer (what altitude does this operate at?)
   - Files to create and modify
   - Trade-offs (complexity, reuse, testability, time)

3. Present to user:
   - Brief summary of each approach
   - CTB placement table showing where new files land
   - Trade-offs comparison
   - **Your recommendation with reasoning**

4. **WAIT for user to choose an approach.**

**Go/No-Go:** Has the user selected an approach? If yes, proceed. If no, wait.

---

### Phase 5 — Implementation (APPROVAL GATE)

**Constants:** Never start without explicit user approval. Follow chosen architecture exactly. Follow codebase conventions.

**Variables:** The specific code to write.

**Execute:**
1. **WAIT for explicit user approval** ("go ahead", "yes", "implement it", etc.).
2. Read all relevant files identified in prior phases.
3. Implement following the chosen architecture:
   - Place files in correct CTB branches
   - Follow existing code patterns and conventions
   - Write clean, documented code
   - Handle errors and edge cases per Phase 3 answers
4. Update todos as each component is completed.

**Go/No-Go:** Is the implementation complete per the architecture blueprint? If yes, proceed to review. If no, continue implementing.

---

### Phase 6 — Quality Review

**Constants:** Always launch 3 parallel review agents. Only report issues with confidence >= 80.

**Variables:** The specific issues found.

**Execute:**
1. Launch 3 review subagents in parallel:
   - **Simplicity reviewer**: DRY violations, unnecessary complexity, readability
   - **Correctness reviewer**: Bugs, logic errors, security, null handling, race conditions
   - **Conventions reviewer**: Project patterns, CLAUDE.md compliance, naming, CTB placement correctness

2. Each reviewer scores issues 0-100 on confidence. Consolidate only issues >= 80.

3. Present findings to user organized by severity (Critical / Important):
   - Description with confidence score
   - File path and line number
   - Concrete fix suggestion

4. **Ask user**: Fix now, fix later, or proceed as-is?
5. Address issues per user decision.

**Go/No-Go:** Has the user decided on review findings? If yes, proceed. If no, wait.

---

### Phase 7 — Summary

**Constants:** Always mark all todos complete. Always list files modified.

**Variables:** The specific deliverables.

**Execute:**
1. Mark all todos complete.
2. Deliver summary:
   - **What was built**: Feature description in one paragraph
   - **CTB placement**: Table of new/modified files and their branch
   - **Key decisions**: Architecture choice and rationale
   - **Files changed**: Complete list with brief description of each change
   - **Suggested next steps**: Testing, documentation, follow-up work

**Go/No-Go:** Summary delivered. All todos complete. Session done.

---

## CTB Backbone Mapping

When the feature produces files in a CTB-structured repo, enforce placement:

- Infrastructure/config files → `src/sys/`
- Schemas, migrations, queries → `src/data/`
- Business logic, services → `src/app/`
- AI agents, prompts, routers → `src/ai/`
- UI components, pages → `src/ui/`

If a file does not fit any branch, the file's responsibility is unclear — decompose it until each piece maps to exactly one branch. If the target repo does not use CTB structure, note this in Phase 2 and skip CTB enforcement.

---

## Constant-First Principle

Each phase of this workflow eliminates unknowns. By Phase 5, the only remaining variables are implementation details — everything structural has been locked by prior phases:

- Phase 1 locks scope (what)
- Phase 2 locks patterns (how the codebase works)
- Phase 3 locks requirements (edge cases, constraints)
- Phase 4 locks design (architecture, CTB placement, CC layer)
- Phase 5 is execution against locked decisions
- Phase 6 validates against locked expectations
- Phase 7 documents what was locked and delivered

If you reach Phase 5 and find major unknowns, that is a Phase 3 or Phase 4 failure. Go back.

---

## Iteration

After delivering a feature, iterate based on real usage:

1. If review found patterns that should become constants, note them for the next session.
2. If CTB placement was ambiguous, that signals a missing architectural constant — flag it.
3. If the user frequently skips Phase 3, the questions are not useful enough — improve them.

---

## Installation Targets

- **Global (current):** `~/.claude/commands/feature-dev.md`
- **Project-level:** `.claude/commands/feature-dev.md`
- **Doctrine source:** `/Users/employeeai/Documents/IMO-Creator/templates/doctrine/ARCHITECTURE.md`
