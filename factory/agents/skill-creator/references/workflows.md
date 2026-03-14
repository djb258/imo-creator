# Workflow Patterns — Reference

Load this file during Phase 4 (Build) when constructing workflow sections.

---

## Pattern 1: Linear Pipeline

Use when each phase depends on the previous phase's output. No branching.

```
Phase 1 → Phase 2 → Phase 3 → Deliver
```

Each phase has:
- Constants (what is fixed for this phase)
- Variables (what changes)
- Execute (instructions)
- Go/No-Go (gate before next phase)

**When to use:** Most skills. Default pattern.

---

## Pattern 2: Fork-Join

Use when multiple independent tasks must complete before a merge step.

```
Phase 1 → Phase 2a (parallel) → Phase 3 (join) → Deliver
         → Phase 2b (parallel) ↗
```

Fork phases run independently. Join phase requires all forks complete.
Go/No-Go at join: ALL fork outputs present and valid.

**When to use:** Skills that produce multiple independent artifacts (e.g., generate code + tests + docs simultaneously).

---

## Pattern 3: Iterative Refinement

Use when output quality requires multiple passes with feedback.

```
Phase 1 → Phase 2 → Phase 3 (validate) → PASS → Deliver
                         ↓ FAIL
                     Phase 2 (retry with feedback)
```

Max iterations must be declared as a Constant. Infinite loops are a doctrine violation.

**When to use:** Skills where first-pass output rarely passes validation (e.g., complex formatting, multi-constraint satisfaction).

---

## Pattern 4: Conditional Branch

Use when the execution path depends on input classification.

```
Phase 1 (classify) → Type A → Phase 2a → Deliver
                   → Type B → Phase 2b → Deliver
                   → OTHER  → HALT (missing constant)
```

Every branch must have a Go/No-Go. The OTHER branch is mandatory — it catches unclassified inputs and signals a Constants gap.

**When to use:** Skills that handle multiple input types with different processing (e.g., file format conversion).

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|-------------|-------------|-----|
| No Go/No-Go gates | LLM proceeds through failures silently | Add gate after every phase |
| Phase calls another phase directly | Spokes calling spokes — violates hub rule | Each phase returns to hub |
| Unbounded iteration | Token exhaustion, no convergence guarantee | Declare max iterations as Constant |
| Implicit classification | LLM guesses which branch — non-deterministic | Explicit classification criteria in Constants |
