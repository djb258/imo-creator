---
name: skill-creator
description: >
  Creates validated, swap-testable skill packages for LLM execution.
  Trigger: User requests a new skill, or requests modification of an existing skill.
  Output: A validated skill package at skills/<skill-name>/SKILL.md that passes
  quick_validate.py and can be executed by any LLM without prior context.
---

## IMO — Ingress / Middle / Egress

**Ingress (Trigger):** User requests a new skill, or requests modification of an existing skill.

**Middle (Processing):**
- Apply the Constants/Variables filter to the skill's domain
- Map the hub-and-spoke configuration
- Define the IMO for the skill's execution
- Write the skill so its structure demonstrates the framework — the document IS the instruction, not a description of it

**Egress (Output):** A validated skill package at `skills/<skill-name>/SKILL.md` that passes `quick_validate.py` and can be executed by any LLM without prior context.

**Go/No-Go Gate:** Do not deliver a skill until it passes the swap test — can a different LLM pick up this skill cold and produce the same output? If no, the skill is not done.

---

## Constants — What Is Fixed About Every Skill

These do not change regardless of domain, tool, or use case:

1. Every skill has a `SKILL.md` with YAML frontmatter (`name`, `description`) and a Markdown body.
2. Every skill separates Constants from Variables before any workflow instructions appear.
3. Every skill states its IMO — what triggers it, what processing it performs, what output it produces.
4. Every skill has a Rules/Boundaries section stating what it NEVER does.
5. Every skill uses progressive disclosure: metadata → SKILL.md body → reference files as needed.
6. Every skill earns its tokens — context is a finite resource; every line must justify its presence.
7. Every skill passes the swap test before delivery.
8. Constants first. Variables are a last resort. Every variable requires guard rails. Drive toward constants.

---

## Variables — What Changes Per Skill

These are set per domain and per invocation:

| Variable | What It Is | Who Sets It |
|----------|-----------|-------------|
| `skill_domain` | The specific capability being packaged | User or task context |
| `tool_names` | Specific tools, APIs, or services used | Determined after constants are locked |
| `reference_files` | Domain-specific docs loaded as needed | Identified during Step 2 |
| `scripts` | Executable code for repetitive operations | Written per domain |
| `activation_state` | Active by default or optional | Set per deployment |

**Rule:** Tool names and implementation details are always Variables. They never appear in the Constants block.

---

## Hub-and-Spoke Configuration

The skill creation process is a wheel. The hub is the locked skill package. Each spoke is a phase that feeds the hub.

| Spoke | Input | Output | Interface to Hub |
|-------|-------|--------|-----------------|
| Understand | User request + examples | Confirmed domain scope | Go/No-Go: scope is unambiguous |
| Plan | Domain scope | Resource inventory (scripts, refs, templates) | Go/No-Go: all resources identified |
| Initialize | Resource inventory | Scaffolded skill directory | Go/No-Go: init_skill.py ran successfully |
| Build | Scaffolded directory | Populated SKILL.md + resources | Go/No-Go: swap test passes |
| Validate | Populated skill | Validation report | Go/No-Go: quick_validate.py passes |
| Deliver | Validated skill | Skill package sent to user | Final output |

**Hub rule:** The hub (locked skill package) is the only thing that touches the outside world. Spokes do not call other spokes. Each spoke completes its job and hands off to the hub.

---

## Phase Failure Handling — Constants

Every phase has two exit paths: Go (proceed to next spoke) and No-Go (failure). No-Go is not a variable — the response to any phase failure is a constant:

**IMO of a Phase Failure:**
- **Ingress:** A phase produces an unexpected result that does not match its defined output.
- **Middle:** Log the failure with three fields — (1) which phase failed, (2) what was attempted, (3) what was returned. Do not guess. Do not retry silently.
- **Egress:** Escalate to the user with the three-field log. State the phase name, the attempted action, and the exact error or unexpected output. Ask for direction before proceeding.

**Constants:**
- Silent retry is never the response to a phase failure.
- The three-field log is always produced before escalation.
- The user decides whether to retry, revise the skill, or abort.

**Variables:**
- The specific phase that failed.
- The specific error or unexpected output.

**OTHER path:** If the failure cannot be classified by any known error type, it routes to OTHER. Log it to the error table with `phase_failed`, `attempted_action`, and `raw_output`. Do not attempt to resolve OTHER without user input.

---

## Rules — What This Skill Never Does

- Never put tool names in the Constants block. Tools are Variables. A constant that names a tool is not a constant — it is a variable that has been mislabeled.
- Never skip the Constants/Variables filter. If you cannot state what is fixed about this skill, you do not understand the domain well enough to write the skill.
- Never write a skill that describes the framework without demonstrating it. The structure of the skill IS the instruction. Prose descriptions of how to apply a framework are not the same as a document structured by that framework.
- Never deliver a skill that fails the swap test. If a different LLM cannot pick it up cold and produce the same output, the skill is incomplete.
- Never let reference files duplicate SKILL.md content. Information lives in one place only.
- Never include README.md, CHANGELOG.md, or auxiliary documentation. Skills are for AI agents, not users.
- Never exceed 500 lines in SKILL.md. Move variant-specific details to reference files.

---

## Workflow

### Phase 1 — Understand (Spoke 1)

**Constants for this phase:**
- The skill must have a single, unambiguous trigger condition.
- The skill must have a testable output (the swap test).

**Variables for this phase:**
- The specific domain, examples, and edge cases.

**Execute:**
Ask the user: "What does this skill do, and can you give me a concrete example of how it would be used?" Do not proceed until you can answer both questions without ambiguity. If the trigger condition is unclear, ask before proceeding. This is the IMO input gate — if you cannot identify the trigger, you cannot build the skill.

**Go/No-Go:** Can you state in one sentence what triggers this skill and what output it produces? If yes, proceed. If no, ask.

### Phase 2 — Plan (Spoke 2)

**Constants for this phase:**
- Every skill has exactly three resource types: scripts, references, templates.
- Resource type is determined by reuse pattern, not by content.

**Variables for this phase:**
- Which resource types this specific skill needs.
- What files belong in each type.

| Resource Type | Use When | Example |
|--------------|----------|---------|
| `scripts/` | Code that would be rewritten repeatedly | `rotate_pdf.py`, `init_skill.py` |
| `references/` | Documentation loaded into context as needed | Database schemas, API docs, domain policies |
| `templates/` | Output assets not loaded into context | HTML boilerplate, fonts, logos |

**Execute:** For each example from Phase 1, identify which resource type handles it. List every file needed. This is the Variables inventory — the only things that change per skill.

**Go/No-Go:** Is every resource identified and typed? If yes, proceed. If no, return to Phase 1.

### Phase 3 — Initialize (Spoke 3)

**Constants for this phase:**
- New skills always use `init_skill.py`. No exceptions.
- Existing skills skip this phase.

**Execute:**

```bash
python skills/skill-creator/scripts/init_skill.py <skill-name>
```

This creates the scaffold at `skills/<skill-name>/` with proper frontmatter, placeholder SKILL.md, and example resource directories.

**Go/No-Go:** Does `skills/<skill-name>/SKILL.md` exist? If yes, proceed. If no, diagnose and re-run.

### Phase 4 — Build (Spoke 4)

**Constants for this phase:**
- SKILL.md structure is always: IMO → Constants → Variables → Hub-and-Spoke → Rules → Workflow → Reference pointers.
- The frontmatter `description` field is the primary trigger mechanism — it must state what the skill does AND when to use it.
- Every workflow phase has a Go/No-Go gate.

**Variables for this phase:**
- The domain-specific content of each section.
- Which reference files to point to and when.

**Execute — Write SKILL.md in this order:**

1. **YAML frontmatter** — `name` and `description`. The description is the trigger. Write it last, after the body is complete, so it accurately reflects what the skill does.
2. **IMO block** — State the trigger, processing, and output before any other content. An LLM reading this skill must know what it is executing before it reads the instructions.
3. **Constants block** — List everything that is fixed about this skill regardless of invocation. No tool names. No implementation details. Structural truths only.
4. **Variables block** — List everything that changes per invocation. This is where tool names, configuration values, and domain-specific parameters live.
5. **Hub-and-Spoke map** — Name the hub. Name the spokes. Show the interface between each spoke and the hub as a table. An LLM reading this map must be able to identify the processing center and the transport pipes without reading any other section.
6. **Rules/Boundaries** — What this skill NEVER does. This is the highest-value section. State hard constraints explicitly. "Never" is a constant. Boundaries prevent the most common failure modes.
7. **Workflow** — Step-by-step execution with Go/No-Go gates. Each phase is a spoke. Each phase has its own Constants, Variables, and Go/No-Go. The workflow is not prose — it is an executable sequence.
8. **Reference pointers** — State which reference files exist, what they contain, and when to load them. Do not duplicate their content in SKILL.md.

**Consult these reference files for established patterns:**
- Multi-step processes: `skills/skill-creator/references/workflows.md`
- Output formats: `skills/skill-creator/references/output-patterns.md`
- Progressive disclosure: `skills/skill-creator/references/progressive-disclosure-patterns.md`

**Reference file maturity caveat — Constants:**
- Reference files are living documents. They accumulate proven doctrine from real usage.
- A reference file is scaffolding until it has been exercised on at least three real skills built through this pipeline.
- Do not treat reference file patterns as proven constants until they carry that history.
- When a reference file pattern fails on a real skill, update the reference file. That is the iteration loop.

**Go/No-Go (Swap Test — Defined Rubric):**

The swap test is a human-executed gate, not an automated check. Execute it as follows:

1. Send the completed SKILL.md to a second LLM in a fresh session with zero prior context.
2. Give it one concrete example from Phase 1 and ask it to execute the skill.
3. Compare the output against your expected output on three criteria:
   - **Constants match** — did the second LLM identify the same fixed elements?
   - **Variables match** — did it identify the same configurable elements?
   - **IMO match** — did it produce the same trigger/processing/output decomposition?

**Pass:** All three criteria match. Proceed to Phase 5.
**Fail:** Any mismatch. Identify which section caused the deviation — that is a missing constant, a missing boundary, or an ambiguous workflow step. Fix it and re-run the swap test.

**Constants for this gate:**
- The swap test is always run on a fresh session with no prior context.
- A mismatch in Constants is the highest-severity failure — it means the skill's structural truths are not stated clearly enough.

**Variables for this gate:**
- The specific example used for the test.
- The second LLM used for comparison.

### Phase 5 — Validate (Spoke 5)

**Constants for this phase:**
- Validation is always run before delivery. No exceptions.
- A skill that fails validation is not delivered.

**Execute:**

```bash
python skills/skill-creator/scripts/quick_validate.py <skill-name>
```

If validation fails, fix the errors and re-run. Do not deliver until validation passes.

**Go/No-Go:** Does `quick_validate.py` report all checks passed? If yes, proceed to delivery. If no, fix and re-validate.

### Phase 6 — Deliver (Spoke 6)

**Constants for this phase:**
- Delivery is the SKILL.md path plus confirmation of validation pass.

**Execute:**
Present the validated skill path to the user:

```
skills/<skill-name>/SKILL.md
```

**Go/No-Go:** Skill delivered. Task complete. Iterate based on real usage.

---

## Constant-First Principle (Applied to Skill Design)

Constants first. Variables are a last resort.

Every time something is labeled a Variable in a skill, you are committing to writing guard rails, conditional handling, and validation logic. Every time something is locked as a Constant, the skill gets simpler and more predictable. If you can make it a constant, make it a constant. Only declare a Variable when the value genuinely cannot be known at design time.

The funnel is a constant-reduction machine. Each phase of the workflow eliminates a class of unknowns. By the time the LLM reaches Phase 6, the only things still open are the true variables — the ones that cannot be resolved by design. Everything else has been classified, handled, and exited cleanly by a prior phase.

A variable is an edge function. If a skill has many variables, it has too many edge functions. That is a design gap, not a feature. High variable count means the Constants block is incomplete.

**Diagnostic:** If an LLM executing this skill frequently hits OTHER (unclassified behavior), a phase or a constant is missing. That is your signal to return to Phase 1 and re-examine the domain scope.

---

## CTB Backbone Mapping

When a skill produces output that writes to a database, the output maps to CTB leaf types:

- Confirmed, validated output → CANONICAL table write via registered promotion path.
- Unclassified or failed output → ERROR table write.

The skill's workflow IS the promotion path. No data reaches a CANONICAL table without completing the skill's workflow gates — same as no data reaches a CANONICAL table in CTB without a registered promotion path. The skill enforces promotion at the application layer. CTB enforces it at the database layer. Two altitudes, same architecture.

**Diagnostic:** High ERROR table volume means a workflow gate or a Constants block entry is missing. Fix the skill, not the error handler.

---

## Reference Files

| File | Contains | Load When |
|------|----------|-----------|
| `references/workflows.md` | Established multi-step process patterns | Phase 4 — building workflow sections |
| `references/output-patterns.md` | Standard output format patterns | Phase 4 — defining egress format |
| `references/progressive-disclosure-patterns.md` | Context-efficient information layering | Phase 4 — structuring reference pointers |

Do not duplicate reference file content in this SKILL.md. Load as needed.

---

## Iteration

After delivering a skill, iterate based on real usage:

1. Use the skill on real tasks.
2. Notice where the LLM deviates from expected output — that is a Constants gap or a missing Go/No-Go gate.
3. Identify whether the fix is a new constant (add to Constants block), a new boundary (add to Rules), or a new workflow phase (add a spoke).
4. Implement the fix, re-run validation, re-deliver.

**The goal:** A skill that produces identical output regardless of which LLM executes it, in which session, with no prior context. That is the swap test. That is done.
