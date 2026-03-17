# Progressive Disclosure Patterns — Reference

Load this file during Phase 4 (Build) when structuring reference pointers and managing context budget.

---

## Principle

Context is a finite resource. Every token loaded into an LLM's context window has a cost — it displaces other tokens that could carry useful information. Progressive disclosure means: load only what is needed, when it is needed, at the altitude it is needed.

---

## Layer 1: Frontmatter (Always Loaded)

The YAML frontmatter is always in context. It is the trigger mechanism.

**Budget:** Under 10 lines. Name + description only.

**Rule:** If the LLM cannot decide whether to activate this skill from the frontmatter alone, the description is incomplete.

---

## Layer 2: SKILL.md Body (Loaded on Activation)

The full SKILL.md body is loaded when the skill activates. This is the execution layer.

**Budget:** Under 500 lines. Every line must justify its presence.

**Rule:** If a section is only relevant to one specific workflow phase, consider moving it to a reference file and loading it only during that phase.

---

## Layer 3: Reference Files (Loaded on Demand)

Reference files are loaded into context only when a specific workflow phase needs them.

**Budget:** No fixed limit, but each reference file should be under 200 lines. If a reference file exceeds 200 lines, it should be split by concern.

**Rule:** A reference file that is always loaded alongside SKILL.md should be merged into SKILL.md. A reference file that is never loaded should be deleted.

---

## Loading Instructions Pattern

In the Workflow section, indicate when to load a reference:

```markdown
### Phase 3 — Build

**Load:** `references/api-schema.md` (needed for field mapping)

**Execute:**
[Instructions that use the loaded reference]
```

This tells the LLM:
1. Load this file now (not before, not after)
2. Why it is needed (the LLM can verify relevance)
3. Implicitly: unload after this phase (context hygiene)

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|-------------|-------------|-----|
| Loading all references at activation | Wastes context on irrelevant content | Load per-phase |
| Duplicating reference content in SKILL.md | Two sources of truth — guaranteed drift | Single source, pointer from SKILL.md |
| Reference file with no load instruction | Orphaned content — never used | Delete or add load point |
| Giant monolithic reference file | Forces loading irrelevant sections | Split by concern |
| Reference file that changes per invocation | That is a Variable, not a reference | Move to Variables block or generate at runtime |
