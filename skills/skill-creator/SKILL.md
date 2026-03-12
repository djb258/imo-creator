---
name: skill-creator
description: >
  Creates validated, swap-testable skill packages for LLM execution.
  Trigger: User requests a new skill, or requests modification of an existing skill.
  Output: A validated skill package at skills/<skill-name>/SKILL.md that passes
  quick_validate.py and can be executed by any LLM without prior context.
---

## Layer 0 Doctrine

This skill is a constant-extraction engine. Its purpose is to take a domain and extract
every constant until the remaining variable space is within operational tolerance. The
output is a skill package — a locked set of constants structured for LLM execution.

**One Objective:** Extract constants from the domain.

**Three Validators:** Every candidate constant must survive all three:
- IMO: Does it stay fixed regardless of what flows through the process?
- CTB: Does it stay fixed at every level of the hierarchy?
- Circle: Does it still hold after a full feedback cycle?

**Block Architecture:** This skill is built from blocks. Each block is governed by one of
the four elements (C&V, IMO, CTB, Circle). Every block — regardless of its governing
element — follows the same internal format defined by all four elements. The number of
blocks is determined by the domain. The format per block is the constant.

---

## Block Format — The Constant

Every block in every skill follows this structure. This does not change.

```
BLOCK [N]: [Name]
Governed by: [C&V | IMO | CTB | Circle]

Constants: What is fixed in this block regardless of domain or invocation.
Variables: What changes per domain or invocation.

IMO:
  Input: What this block receives from prior blocks or the user.
  Middle: What this block does — the specific work governed by its element.
  Output: What this block produces for downstream blocks.

CTB:
  Trunk: The primary concept this block handles.
  Branches: Supporting elements.
  Leaves: Specific details or implementation items.

Circle:
  Validation: How you know this block's output is correct.
  Feedback: If wrong, which prior block receives the correction signal.

Go/No-Go: The gate. What must be true before proceeding to the next block.
```

---

## Skill-Creator Blocks

### BLOCK 1: Domain Scope
**Governed by: C&V**

**Constants:**
- Every skill has a single, unambiguous trigger condition.
- Every skill has a testable output (the swap test).
- The two-question entry: "What triggers this?" and "How do we get it?"

**Variables:**
- The specific domain being skilled.
- The specific examples and edge cases.

**IMO:**
- Input: User request — "I need a skill that does X."
- Middle: Apply C&V lens. What is fixed about this domain regardless of implementation?
  What changes per invocation? Ask the two-question entry. If either question cannot be
  answered, stop and ask the user.
- Output: Confirmed domain scope with initial constants and variables separated.

**CTB:**
- Trunk: The domain definition — what this skill IS.
- Branches: The trigger condition, the output definition.
- Leaves: Specific examples and edge cases.

**Circle:**
- Validation: Can you state in one sentence what triggers this skill and what it produces?
- Feedback: If no, return to user for clarification. Do not proceed with ambiguity.

**Go/No-Go:** Trigger and output are unambiguous. Both entry questions answered. Proceed.

---

### BLOCK 2: Constant Extraction
**Governed by: C&V**

**Constants:**
- Constants first. Variables are a last resort.
- Every candidate constant must survive all three validators (IMO/CTB/Circle).
- A constant that names a specific tool is not a constant — it is a mislabeled variable.
- Constants are structural truths. Variables are implementation details.

**Variables:**
- The specific constants discovered for this domain.
- The number of gates required (determined by domain complexity).

**IMO:**
- Input: Domain scope from Block 1.
- Middle: Run the gate mechanism. At each gate:
  1. Identify a candidate constant.
  2. Validate with IMO: Does it hold regardless of what flows through?
  3. Validate with CTB: Does it hold at every level of the hierarchy?
  4. Validate with Circle: Does it hold after a full feedback cycle?
  5. If it survives all three, lock it. Move to next gate.
  6. Back-propagate: Does the new constant invalidate any prior constant?
  7. If prior constant breaks, reclassify it as variable and re-run that gate.
  8. Stop when no new constants found AND back-propagation clean.
- Output: Locked constants list. Isolated variable space. Gate count documented.

**CTB:**
- Trunk: The constants block of the target skill.
- Branches: Each individual constant, numbered and defined.
- Leaves: The validation evidence for each constant (which tests it passed).

**Circle:**
- Validation: Is the variable count low? A high variable count means the constants block
  is incomplete. Variables are edge functions — if a skill has many, it has too many
  moving parts. That is a design gap.
- Feedback: If variable count is high, return to gate mechanism and extract more constants.

**Go/No-Go:** Constants locked. Variable count minimized. Every constant has validation
evidence. Proceed.

---

### BLOCK 3: Process Definition
**Governed by: IMO**

**Constants:**
- Every skill has exactly one IMO: one trigger, one processing description, one output.
- The IMO appears at the top of every skill before any other content.
- An LLM reading the skill must know what it is executing before it reads the instructions.
- A "state" in the skill is just identifying your position on the IMO.

**Variables:**
- The specific trigger for this skill.
- The specific processing steps.
- The specific output format and deliverable.

**IMO:**
- Input: Constants and variables from Block 2.
- Middle: Define the skill's IMO.
  - Ingress: What triggers this skill? What is the input? Be specific — an LLM must be
    able to recognize the trigger without human help.
  - Middle: What processing does the skill perform? State it as operations on constants
    and variables, not as prose descriptions.
  - Egress: What does this skill produce? State the exact output — file, data structure,
    decision, action. If the output is not testable, the IMO is incomplete.
- Output: The skill's IMO block — ready to drop into SKILL.md.

**CTB:**
- Trunk: The overall process (trigger → process → output).
- Branches: Ingress definition, Middle definition, Egress definition.
- Leaves: Specific trigger conditions, processing steps, output specs.

**Circle:**
- Validation: Can an LLM read just the IMO block and know what to do without reading
  anything else? If no, the IMO is incomplete.
- Feedback: If IMO is unclear, return to Block 1 (domain scope may be ambiguous).

**Go/No-Go:** IMO is complete, testable, and self-contained. Proceed.

---

### BLOCK 4: Workflow Design
**Governed by: IMO**

**Constants:**
- Every workflow phase is itself an IMO with its own input, middle, output.
- Every phase has a Go/No-Go gate.
- Phases do not call other phases directly — each completes and hands off to the hub.
- Silent retry is never the response to a phase failure.
- The three-field failure log is always produced: phase_failed, attempted_action, raw_output.

**Variables:**
- The number of phases (determined by domain complexity).
- The specific work each phase performs.
- The specific Go/No-Go criteria per phase.

**IMO:**
- Input: The skill's IMO from Block 3 + constants/variables from Block 2.
- Middle: Decompose the skill's Middle into execution phases. Each phase is a spoke
  on the hub-and-spoke. Each phase has:
  - Its own constants (what is fixed for this phase).
  - Its own variables (what changes per invocation in this phase).
  - Its own IMO (input to this phase, processing, output from this phase).
  - Its own Go/No-Go gate.
  For each phase, ask: "Is this the minimum number of steps to produce the output?"
  If any phase can be eliminated by moving its work to constants, eliminate it.
- Output: Complete workflow with phases, each structured as an IMO with Go/No-Go gates.

**CTB:**
- Trunk: The overall workflow.
- Branches: Individual phases.
- Leaves: Phase-specific constants, variables, IMO, and gates.

**Circle:**
- Validation: Walk through the workflow mentally with a concrete example. Does each
  phase produce what the next phase needs? Does every Go/No-Go gate have a clear
  pass/fail criterion?
- Feedback: If a phase's output doesn't match the next phase's input, the interface
  is broken. Fix the phase or add a missing phase.

**Go/No-Go:** Every phase has IMO + Go/No-Go. No phase calls another phase directly.
Concrete example walks through cleanly. Proceed.

---

### BLOCK 5: Skill Organization
**Governed by: CTB**

**Constants:**
- SKILL.md structure is always: Layer 0 Doctrine → IMO → Constants → Variables →
  Workflow → Rules → Reference Pointers.
- The frontmatter description field is the primary trigger mechanism.
- Every skill uses progressive disclosure: frontmatter → body → references as needed.
- Every skill earns its tokens — context is finite; every line justifies its presence.
- Never exceed 500 lines in SKILL.md. Move details to reference files.
- Information lives in one place only. No duplication between SKILL.md and references.

**Variables:**
- The domain-specific content of each section.
- Which reference files to create and when to load them.

**IMO:**
- Input: All outputs from Blocks 1-4 (scope, constants, variables, IMO, workflow).
- Middle: Assemble the skill as a CTB:
  - Trunk: The SKILL.md file itself — the single source of truth.
  - Branches: Major sections (IMO, Constants, Variables, Workflow, Rules, References).
  - Leaves: Specific content within each section.
  Write the skill so its structure demonstrates the framework. The document IS the
  instruction, not a description of it. Every section should be a block following the
  block format.
- Output: Assembled SKILL.md ready for validation.

**CTB:**
- Trunk: SKILL.md
- Branches: Each major section.
- Leaves: Content within sections + reference file pointers.

**Circle:**
- Validation: Does the skill read top-to-bottom without requiring the reader to jump
  around? Does each section build on the previous? Is the progressive disclosure clean?
- Feedback: If the organization is confusing, the CTB is wrong — the trunk/branch/leaf
  assignment needs rework. Return to this block and reorganize.

**Go/No-Go:** SKILL.md assembled. Under 500 lines. No duplication. Progressive disclosure
clean. Proceed.

---

### BLOCK 6: Rules & Boundaries
**Governed by: C&V**

**Constants:**
- Every skill has a Rules section stating what it NEVER does.
- "Never" is a constant. Boundaries are the highest-value section of any skill.
- Rules prevent the most common failure modes before they happen.
- Rules are constraints expressed as constants — they reduce the variable space by
  eliminating entire categories of behavior.

**Variables:**
- The specific rules for this domain.
- The specific failure modes being prevented.

**IMO:**
- Input: The assembled skill from Block 5 + real-world knowledge of failure modes.
- Middle: For each constant and each workflow phase, ask: "What is the most common way
  an LLM will screw this up?" State the answer as a "Never" rule. Each rule is a
  constant that eliminates a class of variables (failure modes).
  Also add these universal rules that apply to every skill:
  - Never put tool names in the Constants block.
  - Never skip the Constants/Variables separation.
  - Never write a skill that describes the framework without demonstrating it.
  - Never deliver a skill that fails the swap test.
  - Never let reference files duplicate SKILL.md content.
- Output: Complete Rules section for the skill.

**CTB:**
- Trunk: The Rules section.
- Branches: Domain-specific rules + universal rules.
- Leaves: Individual "Never" statements.

**Circle:**
- Validation: For each rule, can you describe the specific failure it prevents? If you
  cannot, the rule is vague — sharpen it or remove it.
- Feedback: If failures are occurring that no rule covers, add a rule. This block is
  never truly finished — it grows with real usage.

**Go/No-Go:** Every rule prevents a specific, describable failure mode. Universal rules
included. Proceed.

---

### BLOCK 7: Swap Test
**Governed by: Circle**

**Constants:**
- The swap test is always run on a fresh session with zero prior context.
- A mismatch in Constants is the highest-severity failure.
- The swap test has three comparison criteria: Constants match, Variables match, IMO match.
- The swap test is human-executed, not automated.

**Variables:**
- The specific example used for the test.
- The specific second LLM used for comparison.
- The specific results of the comparison.

**IMO:**
- Input: The complete assembled skill from Blocks 1-6.
- Middle: Execute the swap test:
  1. Send SKILL.md to a second LLM in a fresh session with zero context.
  2. Give it one concrete example and ask it to execute the skill.
  3. Compare output on three criteria:
     - Constants match: Did the second LLM identify the same fixed elements?
     - Variables match: Did it identify the same configurable elements?
     - IMO match: Did it produce the same trigger/processing/output decomposition?
- Output: PASS (all three match) or FAIL (identify which criterion failed and which
  block produced the deviation).

**CTB:**
- Trunk: The swap test verdict (PASS/FAIL).
- Branches: Each comparison criterion.
- Leaves: Specific matches or mismatches.

**Circle:**
- Validation: PASS means the skill is LLM-agnostic and context-independent. This is
  the definition of "done."
- Feedback: FAIL routes correction to the specific block that produced the mismatch:
  - Constants mismatch → return to Block 2 (constant extraction).
  - Variables mismatch → return to Block 2 (variable identification).
  - IMO mismatch → return to Block 3 (process definition).
  - Workflow confusion → return to Block 4 (workflow design).
  - Organizational confusion → return to Block 5 (skill organization).
  - Missing rule → return to Block 6 (rules & boundaries).

**Go/No-Go:** PASS = proceed to validation. FAIL = return to identified block.

---

### BLOCK 8: Automated Validation
**Governed by: Circle**

**Constants:**
- Validation is always run before delivery. No exceptions.
- A skill that fails validation is not delivered.
- Validation is automated via quick_validate.py.

**Variables:**
- The specific validation errors (if any).

**IMO:**
- Input: Swap-tested skill from Block 7.
- Middle: Run automated validation:
  ```bash
  python skills/skill-creator/scripts/quick_validate.py <skill-name>
  ```
- Output: All checks passed OR specific errors to fix.

**CTB:**
- Trunk: Validation verdict (PASS/FAIL).
- Branches: Individual checks.
- Leaves: Specific pass/fail per check.

**Circle:**
- Validation: Automated — the script runs the checks.
- Feedback: If validation fails, fix errors and re-run. Do not deliver until clean.

**Go/No-Go:** quick_validate.py reports all checks passed. Proceed to delivery.

---

### BLOCK 9: Delivery
**Governed by: IMO**

**Constants:**
- Delivery is the SKILL.md path plus confirmation of swap test and validation pass.
- The delivered skill must be executable by any LLM without prior context.

**Variables:**
- The specific skill path.

**IMO:**
- Input: Validated skill from Block 8.
- Middle: Present the skill package to the user:
  ```
  skills/<skill-name>/SKILL.md
  ```
- Output: Skill delivered. Task complete.

**CTB:**
- Trunk: The delivered skill package.
- Branches: SKILL.md + reference files + scripts (if any).
- Leaves: Individual files.

**Circle:**
- Validation: User confirms receipt.
- Feedback: Iteration begins — see Block 10.

**Go/No-Go:** Skill delivered. Move to iteration.

---

### BLOCK 10: Iteration Protocol
**Governed by: Circle**

**Constants:**
- Every skill improves through real usage, not through speculation.
- Deviation from expected output signals a specific gap: missing constant, missing rule,
  or missing workflow phase.
- High ERROR table volume means a workflow gate or Constants block entry is missing.
  Fix the skill, not the error handler.
- The swap test remains the definition of "done" across all iterations.

**Variables:**
- The specific deviations observed in real usage.
- The specific fixes applied.

**IMO:**
- Input: Real-world usage data — where did the LLM deviate from expected output?
- Middle: Diagnose the deviation:
  1. Is it a Constants gap? → Return to Block 2, add the missing constant.
  2. Is it a Rules gap? → Return to Block 6, add the missing boundary.
  3. Is it a Workflow gap? → Return to Block 4, add or refine a phase.
  4. Is it an IMO gap? → Return to Block 3, clarify the process.
  5. Is it an Organization gap? → Return to Block 5, restructure.
  6. Is it unclassifiable (OTHER)? → Log to error table. Do not guess. Ask the user.
- Output: Specific correction routed to specific block. Re-run Blocks 7-9 after fix.

**CTB:**
- Trunk: The iteration cycle.
- Branches: Diagnosis categories (constants gap, rules gap, workflow gap, etc.).
- Leaves: Specific deviations and their fixes.

**Circle:**
- Validation: After fix, does the swap test still pass? If not, the fix broke something.
  Back-propagate.
- Feedback: This block never closes. Every real-world use is an input to this block.
  The skill is alive as long as it is in use.

**Go/No-Go:** N/A — this block runs continuously. The goal: a skill that produces
identical output regardless of which LLM executes it, in which session, with no prior
context. That is the swap test. That is done.

---

## CTB Backbone Mapping

When a skill produces output that writes to a database:
- Confirmed, validated output → CANONICAL table write via registered promotion path.
- Unclassified or failed output → ERROR table write.

The skill's workflow IS the promotion path. Canonical = constants that survived. Error =
variables that didn't. Two altitudes, same architecture.

---

## Reference Files

| File | Contains | Load When |
|------|----------|-----------|
| `references/workflows.md` | Established multi-step process patterns | Block 4 — designing workflow |
| `references/output-patterns.md` | Standard output format patterns | Block 3 — defining IMO egress |
| `references/progressive-disclosure-patterns.md` | Context-efficient information layering | Block 5 — organizing skill |
| `references/operators-checklist.md` | Step-by-step execution checklist | Any time — operator's manual |

Do not duplicate reference file content in this SKILL.md. Load as needed.

---

## The Constant-First Principle

Constants first. Variables are a last resort.

Every variable commits you to guard rails, conditional handling, and validation logic.
Every constant simplifies the skill and makes it more predictable. If you can make it a
constant, make it a constant. Only declare a variable when the value genuinely cannot be
known at design time.

The gate mechanism is a constant-reduction machine. Each gate eliminates a class of
unknowns. By the time the LLM reaches Block 9, the only things still open are the true
variables — the ones that cannot be resolved by design. Everything else has been
classified, locked, and exited cleanly by a prior block.

A variable is an edge function. High variable count means the Constants block is
incomplete. That is a design gap, not a feature.