# Layer 0 Doctrine — The Universal Thinking Framework

## Status: LOCKED — Governing Document

This document defines the irreducible foundation that governs all IMO-Creator operations, all skill creation, all architecture decisions, and all child repo work. Nothing in the system contradicts this document.

---

## The Engine

Layer 0 is a constant-extraction engine. Its purpose is to take any domain and extract every constant until the remaining variable space is within operational tolerance.

**One Objective:** Extract constants.

**Three Validators:** Every candidate constant must survive all three simultaneously:
1. **IMO (Input → Middle → Output):** Does it stay fixed regardless of what flows through the process?
2. **CTB (Christmas Tree Backbone):** Does it stay fixed at every level of the hierarchy?
3. **Circle (Feedback Loop):** Does it still hold after a full feedback cycle?

If it survives all three → constant. Lock it.
If it fails any one → variable. Classify it with guard rails.

---

## The Gate Mechanism

Constants are extracted through progressive gates. Each gate produces one locked constant.

**Gate operation:**
1. Identify a candidate constant at this altitude
2. Validate with IMO + CTB + Circle (simultaneously, not sequentially)
3. If it survives → lock it. It becomes foundation for the next gate.
4. Back-propagate: Does the new constant invalidate any prior constant?
   - If prior constant breaks → reclassify it as variable, re-run that gate
5. Stop when: no new constants found AND back-propagation clean

**The number of gates is a variable.** The structure of each gate is the constant.

---

## Two-Phase Altitude Structure

**Phase 1 — Qualitative (Upper Altitudes: 50,000 - ~30,000 ft):**
- Constants validated by IMO/CTB/Circle and human judgment
- Strategic decisions, domain scope, structural truths
- No Monte Carlo — nothing to parameterize yet

**Phase 2 — Quantitative (Lower Altitudes: ~30,000 ft and below):**
- Variables become parameterizable
- Altitude Test (Monte Carlo) activates
- Standard deviation is the trackable measurable constant
- Each gate should show tighter sigma than the last
- Sigma tightened → real constant. Sigma flat → phantom constant. Sigma expanded → broken prior constant.

**Transition point:** The altitude where all remaining variables are numeric/parameterizable. This transition is itself a constant identified during the process.

---

## How to Define a Constant

A constant is anything that survives:
1. **Forward validation** — IMO + CTB + Circle at its gate
2. **Retroactive validation** — still holds when tested against every constant discovered at lower gates

If it survives both → constant. If it fails either → it was a variable you misclassified.

---

## Fractal IMO

IMO is fractal. Every I, M, and O can be decomposed into its own IMO. You can zoom into any level and find the same pattern.

**Zoom discipline:** Only zoom when the Circle demands it:
1. Something broke at this level — zoom to find WHERE in the I, M, or O it failed
2. You're building at this level — zoom for implementation detail
3. Sigma isn't tightening — this level's IMO is too coarse

**Stop zooming when:** The IMO at that level is atomic (can't split further) OR the output is within tolerance and the Circle isn't finding problems.

---

## The Tolerance Cascade

Sharpening any element at Layer 0 cascades precision down every branch:
- Tighter C&V definitions → sharper gate mechanism
- Sharper gates → cleaner domain decompositions
- Cleaner decompositions → more precise skills and architecture
- More precise skills → better LLM output

One improvement at the trunk propagates to every leaf automatically.

---

## CTB Backbone Mapping (Database Pattern)

When the gate mechanism produces output that maps to data:
- Constants that survived all gates → CANONICAL table (locked, trusted, promoted)
- Variables that failed validation → ERROR table (unresolved, needs Circle correction)

The gate mechanism IS the promotion path. Canonical = constants that survived. Error = variables that didn't.

---

## Governance

1. This document is LOCKED. Changes require explicit approval and ADR.
2. All skills, all architecture, all child repos conform to Layer 0.
3. Layer 0 does not contain domain-specific content. It is the engine, not the fuel.
4. The four elements (C&V + IMO + CTB + Circle) are the constants of the system itself.