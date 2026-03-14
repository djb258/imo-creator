# Skill-Creator Operator's Checklist

This is the step-by-step process for creating a skill using the refined skill-creator. The SKILL.md is the engine. This checklist is the operator's manual.

**Before you start:** Have the four elements in your head.
- C&V: What's fixed? What changes?
- IMO: What comes in? What happens? What comes out?
- CTB: What's the trunk? What are the branches? What are the leaves?
- Circle: Does it close? If not, what broke?

---

## BLOCK 1: Domain Scope (Governed by C&V)

**Step 1:** Ask the two entry questions:
- [ ] "What triggers this skill?" — Write it down in one sentence.
- [ ] "How do we get it?" — Identify the data source or event that starts the process.

**Step 2:** Confirm scope:
- [ ] Can you state in ONE sentence what the skill does and what it produces?
- [ ] Is there any ambiguity? If yes, STOP. Ask for clarification.

**Gate:** Both questions answered. Scope is one sentence. No ambiguity. → PROCEED.

---

## BLOCK 2: Constant Extraction (Governed by C&V)

**Step 3:** For each candidate constant, run three tests:
- [ ] **IMO Test:** Does it stay fixed regardless of what flows through?
- [ ] **CTB Test:** Does it stay fixed at every level?
- [ ] **Circle Test:** Does it still hold after a full feedback cycle?
- [ ] Passes all three → lock it. Fails any → it's a variable.

**Step 4:** Repeat until no more constants found.

**Step 5:** Back-propagate:
- [ ] Does each new constant invalidate any prior constant?
- [ ] If yes → reclassify and re-run.

**Step 6:** Variable count check:
- [ ] Under 7 → Good. 8+ → Constants block is probably incomplete. Go back.

**Gate:** Constants locked. Variables minimized. Back-propagation clean. → PROCEED.

---

## BLOCK 3: Process Definition (Governed by IMO)

**Step 7:** Define the skill's IMO:
- [ ] **Input:** What triggers? What data enters?
- [ ] **Middle:** What processing happens? (operations, not prose)
- [ ] **Output:** What exactly comes out? (testable deliverable)

**Step 8:** Validate:
- [ ] Can an LLM read JUST the IMO and know what to do?
- [ ] Is the output testable?

**Gate:** IMO complete, self-contained, testable. → PROCEED.

---

## BLOCK 4: Workflow Design (Governed by IMO)

**Step 9:** Decompose Middle into phases:
- [ ] Each phase = its own IMO + Go/No-Go gate.
- [ ] Each phase's output feeds the next phase's input.

**Step 10:** Minimize:
- [ ] Can any phase be eliminated by making its work a constant?

**Step 11:** Failure handling per phase:
- [ ] Two exits: Go and No-Go.
- [ ] No-Go = three-field log (phase_failed, attempted_action, raw_output).
- [ ] Silent retry is NEVER the response.

**Gate:** Every phase has IMO + gate. Minimum phase count. → PROCEED.

---

## BLOCK 5: Skill Organization (Governed by CTB)

**Step 12:** Assemble SKILL.md as CTB:
- [ ] Trunk: SKILL.md file.
- [ ] Branches: Layer 0 Doctrine → IMO → Constants → Variables → Workflow → Rules → References.
- [ ] Leaves: Content within sections.

**Step 13:** Progressive disclosure:
- [ ] Frontmatter under 10 lines.
- [ ] Body under 500 lines.
- [ ] Reference files under 200 lines each.

**Step 14:** No duplication:
- [ ] Information lives in ONE place only.

**Gate:** Under 500 lines. No duplication. Progressive disclosure clean. → PROCEED.

---

## BLOCK 6: Rules & Boundaries (Governed by C&V)

**Step 15:** For each constant and phase:
- [ ] "What's the most common way an LLM will screw this up?"
- [ ] Write it as a "Never" statement.

**Step 16:** Universal rules included:
- [ ] Never put tool names in Constants.
- [ ] Never skip C&V separation.
- [ ] Never describe framework without demonstrating it.
- [ ] Never deliver without swap test.
- [ ] Never duplicate between SKILL.md and references.

**Step 17:** Each rule prevents a specific, describable failure.

**Gate:** Every rule has a clear failure it prevents. → PROCEED.

---

## BLOCK 7: Swap Test (Governed by Circle)

**Step 18:** Execute:
- [ ] Fresh session. Different LLM. Zero context.
- [ ] Drop SKILL.md + one concrete example.

**Step 19:** Compare:
- [ ] Constants match?
- [ ] Variables match?
- [ ] IMO match?

**Step 20:** PASS (all three) → Block 8. FAIL → route to specific block that caused deviation.

**Gate:** PASS on all three. → PROCEED.

---

## BLOCK 8: Automated Validation (Governed by Circle)

**Step 21:**
- [ ] `python factory/agents/skill-creator/scripts/quick_validate.py <skill-name>`
- [ ] All checks passed → Proceed. Failures → fix and re-run.

**Gate:** Validation passes. → PROCEED.

---

## BLOCK 9: Delivery (Governed by IMO)

**Step 22:**
- [ ] Present path: `factory/agents/<skill-name>/SKILL.md`
- [ ] Confirm swap test + validation passed.

**Gate:** Delivered. → ITERATION.

---

## BLOCK 10: Iteration (Governed by Circle)

**Step 23:** After real usage:
- [ ] Where did the LLM deviate?
- [ ] Missing constant → Block 2. Missing rule → Block 6. Missing phase → Block 4. Unclear IMO → Block 3. Bad organization → Block 5.
- [ ] Fix → re-run Blocks 7-9.

**This block never closes.**

---

## Quick Reference — The Four Tests

| Test | Question | Yes | No |
|------|----------|-----|-----|
| C&V | Fixed or changes? | Lock as constant | Classify as variable |
| IMO | Can I state I, M, O? | Process defined | Sharpen it |
| CTB | Trunk, branches, leaves? | Organization clean | Restructure |
| Circle | Does output feed back? | Loop closes | Find the break |

---

## Time Estimates

| Scenario | Time |
|----------|------|
| First skill | 60-90 min |
| Second skill | 30-45 min |
| Third+ | 15-30 min |
| Simple domain | 15 min |
| Complex domain | 45-60 min |
| Iterating existing | 10-15 min per fix |