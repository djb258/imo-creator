# Tier 0 Doctrine — The Universal Thinking Framework

## Status: LOCKED — Governing Document

This document defines the irreducible foundation that governs all IMO-Creator operations, all skill creation, all architecture decisions, and all child repo work. Nothing in the system contradicts this document.

Pressure-tested by 6 LLMs simultaneously on 2026-03-12 across three domains (Sniper Marketing, Storage Facility Recon, Benefits Consulting). None could break it.

---

## The Philosophy

**"Build constants until the decision makes itself."**

When no variables remain that can change the outcome, the answer is binary: go or no-go. You're not deciding — the gate stack already decided. You're reading the answer.

This is domain-agnostic. The engine works on any domain. The domain is fuel. Tier 0 is the engine.

---

## The Engine

Tier 0 is a constant-extraction engine. Its purpose is to take any domain and extract every constant until the remaining variable space is within operational tolerance.

**One Objective:** Extract constants.

**Three Validators:** Every candidate constant must survive all three simultaneously:
1. **IMO (Ingress → Middle → Egress):** Does it stay fixed regardless of what flows through the process?
2. **CTB (Christmas Tree Backbone):** Does it stay fixed at every level of the hierarchy?
3. **Circle (Feedback Loop):** Does it still hold after a full feedback cycle?

If it survives all three → constant. Lock it.
If it fails any one → variable. Classify it with guard rails.

---

## Constants vs Variables

- **Constant:** Anything that survives forward validation (IMO + CTB + Circle at its gate) AND retroactive validation (still holds when tested against every constant discovered at lower gates). If it survives both → constant. Lock it.
- **Variable:** Anything that fails either validation. Classify with guard rails.
- **Domesticated Variable:** A variable run through enough gates that its range is so tight or irrelevant it can't hurt you. The remaining variance is either statistically irrelevant (Monte Carlo sigma too tight to matter) or negotiable (any value in the range is acceptable).

**Goal:** Build constants until the remaining variables are all domesticated. When that happens, the decision makes itself.

---

## The Gate Mechanism

Constants are extracted through progressive gates. Each gate produces one locked constant.

**Gate operation:**
1. Identify a candidate constant at this altitude
2. Validate with IMO + CTB + Circle (simultaneously, not sequentially)
3. If it survives → lock it. It becomes foundation for the next gate.
4. Back-propagate: Does the new constant invalidate any prior constant?
   - If prior constant breaks → reclassify it as variable, re-run that gate
5. Stop when: no new constants found AND back-propagation clean AND remaining variables are domesticated

**The number of gates is a variable.** The structure of each gate is the constant.

**Sigma tracking:**
- Sigma tightened → real constant
- Sigma flat → phantom constant (looks like a constant, isn't one)
- Sigma expanded → broken prior constant (something upstream was misclassified)

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

**Transition point:** The altitude where all remaining variables are numeric/parameterizable. This transition is itself a constant identified during the process.

---

## Two-Question Intake

Before solving ANY problem, ask:
1. **"What triggers this?"** — identifies the ingress
2. **"How do we get it?"** — identifies the data source or mechanism

If you can answer both, you have the input side of the IMO and can build from there. If you can't answer them, **STOP** and ask before proceeding. Never build without knowing the trigger and the source.

---

## Fractal IMO

IMO is fractal. Every I, M, and O can be decomposed into its own IMO. You can zoom into any level and find the same pattern.

Take the top-level IMO → zoom into just the I (Ingress) → that Ingress has its OWN IMO → zoom into that I → another IMO → repeat infinitely. At each zoom level, apply the two-question intake. Each answer either LOCKS a constant or EXPOSES a variable.

**Zoom discipline:** Only zoom when the Circle demands it:
1. Something broke at this level — zoom to find WHERE in the I, M, or O it failed
2. You're building at this level — zoom for implementation detail
3. Sigma isn't tightening — this level's IMO is too coarse

**Stop zooming when:** The IMO at that level is atomic (can't split further) OR the output is within tolerance and the Circle isn't finding problems. Keep zooming until remaining variables are domesticated.

---

## Hub-Spoke (The Wheel)

Hub-spoke is IMO expressed as geometry:
- **Hub** = Middle (all processing, all logic, all decisions)
- **Spokes** = dumb transport (no logic, no state, just move data)
- **Rim** = Ingress/Egress (the interface — schema validation in, read-only views out)

The wheel IS the IMO. Rim = I/O. Spokes = transport. Hub = M. Spokes carry data but never process it. The hub does all the work. This is why tools are scoped to the hub M layer only — spokes don't own tools.

---

## Sovereign Silos

Every domain or function is an intentional silo. Each silo is sovereign — does its own work, doesn't know the others exist. Silos connect at one deliberate point only. Never let silos bleed into each other.

This is the CTB at the organizational level. Each branch is sovereign. Branches connect only through the trunk. Cross-branch communication is a doctrine violation.

---

## The Circle

Every system is a circle. Output feeds back to input. When troubleshooting, trace the circle — the failure is wherever the flow stopped.

Monte Carlo IS a Circle at the quantitative level — run simulation, compare output to expectation, adjust classification, run again.

---

## The Tolerance Cascade (10x Multiplier)

Tier 0 sits at the top of the CTB. Everything cascades underneath it:
- Tighter C&V definitions → sharper gate mechanism
- Sharper gates → cleaner domain decompositions
- Cleaner decompositions → more precise skills and architecture
- More precise skills → better LLM output

One improvement at the trunk propagates to every leaf automatically. Improve Tier 0 → every skill, agent, pipeline, and system downstream gets better automatically. You don't improve agents individually — you improve the doctrine and agents improve themselves because they inherit from it.

---

## Determinism First

- Deterministic solution evaluated first. Always.
- LLM as tail arbitration only — never the spine.
- Tools scoped to hub M layer. No tools in spokes.
- Vendors are swappable drivers — the architecture doesn't depend on any single vendor.

---

## Structural Enforcement in Skills

Every block inside a skill follows IMO and CTB format:
- Every block MUST have an Ingress, a Middle, and an Egress — no exceptions
- Every block MUST know its altitude on the CTB (trunk, branch, or leaf)
- Every block's Egress feeds the next block's Ingress — the circle closes at every level
- Any block missing IMO is not a valid block
- Any block that doesn't know its CTB altitude doesn't belong

This makes skills debuggable and auditable — failure is always in the I, M, or E of a specific block at a specific altitude.

---

## CTB Backbone Mapping (Database Pattern)

When the gate mechanism produces output that maps to data:
- Constants that survived all gates → CANONICAL table (locked, trusted, promoted)
- Variables that failed validation → ERROR table (unresolved, needs Circle correction)

The gate mechanism IS the promotion path. Canonical = constants that survived. Error = variables that didn't.

---

## CQRS — Command Query Responsibility Separation

Every sub-hub has exactly **one CANONICAL table** (read/query) and **one ERROR table** (write/command failures). This is a Tier 0 constant — not a pattern choice.

**Write path (Command):** Data enters ONLY from the leaves. Vendor/staging tables at the bottom of the CTB accept incoming data. It promotes upward through registered gates — VENDOR → STAGING → SUPPORTING → CANONICAL. No direct writes to CANONICAL. Ever. INSERT-only at the leaf level. Immutability triggers enforce this mechanically.

**Read path (Query):** CANONICAL tables are the read surface. Views and downstream consumers read from CANONICAL only. Egress is read-only — no logic, no mutations.

**Error path:** Any data that fails a gate lands in the ERROR table. Errors feed the Circle — the repair agent reads the error, the Garage certifies the repair, data re-enters the write path from the leaf.

```
Leaves (vendor/staging) → promotion gates → CANONICAL (read-only query surface)
         ↓ (failures)
      ERROR table → Circle → repair → re-enter at leaf
```

**Constants:**
- One CANONICAL + one ERROR per sub-hub (ADR-001)
- Data enters from leaves only — no sideways writes, no skipping levels
- CANONICAL is read-only from the consumer's perspective
- INSERT-only at the leaf level (immutability triggers)
- The promotion path IS the gate mechanism

---

## Vocabulary

| Term | Definition |
|------|------------|
| **Constant** | Anything that survives forward + retroactive validation through all gates |
| **Variable** | Anything that fails validation — classified with guard rails |
| **Domesticated Variable** | Variable whose range is so tight (sigma) or irrelevant it can't change the outcome |
| **Gate** | One step that converts one unknown into a constant; triggers back-propagation |
| **IMO** | Ingress-Middle-Egress — the universal process pattern (NOT Input-Method-Output) |
| **CTB** | Christmas Tree Backbone — vertical hierarchy (trunk → branch → leaf) |
| **Hub-Spoke / Wheel** | IMO as geometry — Hub=M, Spokes=transport, Rim=I/E |
| **Rim** | The interface layer — Ingress (schema validation) + Egress (read-only views) |
| **Spokes** | Dumb transport — carry data between rim and hub, no logic |
| **Circle** | Feedback loop — output feeds back to input; trace it to find failures |
| **Sovereign Silo** | Independent domain/function that connects to others at one deliberate point only |
| **Two-Question Intake** | "What triggers this?" + "How do we get it?" — required before building anything |
| **Fractal Nesting** | Every I, M, and E decomposes into its own IMO, infinitely |
| **Back-Propagation** | Each new constant triggers revalidation of all prior constants |
| **Sigma Tracking** | Standard deviation measurement: tightening=real, flat=phantom, expanding=broken |
| **Altitude** | Position on CTB hierarchy (50,000ft=strategic → ground=implementation) |
| **Monte Carlo** | Quantitative validation — simulation against locked constants at lower altitudes |
| **Tolerance** | Acceptable range for a domesticated variable — within tolerance = safe to proceed |
| **CQRS** | Command Query Responsibility Separation — write path (leaf→promote→canonical) vs read path (canonical→views) |
| **CANONICAL** | The single trusted table per sub-hub — data that survived all gates |
| **ERROR** | The single error table per sub-hub — data that failed gates, feeds the Circle |
| **Promotion Path** | The registered route from leaf to canonical — IS the gate mechanism |

---

## Governance

1. This document is LOCKED. Changes require explicit human approval.
2. All skills, all architecture, all child repos conform to Tier 0.
3. Tier 0 does not contain domain-specific content. It is the engine, not the fuel.
4. The four elements (C&V + IMO + CTB + Circle) are the constants of the system itself.
5. Portable — works as a drop-in for any LLM (Claude, ChatGPT, Manus, Gemini, or any other).
