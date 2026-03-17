---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics. Doctrine-native — separates design constants from aesthetic variables, maps output to ui/ CTB branch.
---

# frontend-design — Doctrine-Native Frontend Skill

**Authority:** Global command (CC-04 execution instance). Conforms to skill-creator framework at `/Users/employeeai/Documents/IMO-Creator/skills/skill-creator/SKILL.md`. Replaces the Anthropic frontend-design plugin with doctrine-native structure.

---

## IMO — Ingress / Middle / Egress

**Ingress (Trigger):** User requests a frontend component, page, application, or interface. Input includes purpose, audience, technical constraints, and aesthetic preferences. Schema-validate: the request must name at least one deliverable (component, page, layout, application).

**Middle (Processing):**
1. Design Thinking phase — commit to aesthetic direction BEFORE writing code
2. Deterministic base — detect existing design tokens, component libraries, CLAUDE.md conventions
3. Constants/Variables separation — lock design principles, then resolve aesthetic choices
4. Build production-grade code through hub-spoke phases
5. All logic lives here. All decisions live here. All state lives here.

**Egress (Output):** Production-grade, functional frontend code (HTML/CSS/JS, React, Vue, etc.) that is visually distinctive, cohesive, and ready to ship. Read-only — the output is delivered, not modified in egress.

**Go/No-Go Gate:** Can a different LLM pick up this skill cold and produce output of equivalent design quality and structural compliance? If no, the skill is not done.

---

## Constants — What Is Fixed About Every Frontend Build

These do not change regardless of framework, aesthetic, or project:

1. **Design thinking happens before coding.** No code is written until Purpose, Tone, Constraints, and Differentiation are resolved.
2. **Anti-generic enforcement is absolute.** Never use Inter, Roboto, Arial, or system-default fonts. Never use purple gradients on white backgrounds. Never produce cookie-cutter layouts. Never converge on the same font across builds.
3. **Typography requires a distinctive pairing.** One display font + one body font, both chosen for the specific context. Generic is a failure state.
4. **Color requires commitment.** Dominant color + sharp accent outperforms timid, evenly-distributed palettes. CSS variables enforce consistency.
5. **Motion is CSS-first.** One well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions. Use Motion library for React when available.
6. **Spatial composition breaks expectations.** Asymmetry, overlap, diagonal flow, grid-breaking elements, generous negative space OR controlled density.
7. **Complexity matches vision.** Maximalist designs need elaborate code. Minimal designs need restraint and precision. The implementation earns its aesthetic.
8. **Output is production-grade.** Functional code, not mockups. Not prototypes. Not wireframes.
9. **Frontend code maps to `ui/` branch in CTB.** No frontend logic in `app/` or `data/`. Component structure follows hub-spoke (component is hub, props are spokes).
10. **Determinism first, LLM creativity as tail.** Design tokens, component library detection, and project conventions form the deterministic base. Aesthetic decisions are the tail.

---

## Variables — What Changes Per Build

| Variable | What It Is | Who Sets It |
|----------|-----------|-------------|
| `deliverable_type` | Component, page, layout, or full application | User request |
| `framework` | HTML/CSS/JS, React, Vue, Svelte, etc. | User request or project detection |
| `aesthetic_direction` | The committed tone (brutalist, editorial, organic, luxury, etc.) | Design Thinking phase |
| `font_pairing` | Display font + body font for this specific build | Design Thinking phase |
| `color_system` | Dominant + accent palette as CSS variables | Design Thinking phase |
| `motion_strategy` | Which moments get animation, what technique | Design Thinking phase |
| `differentiator` | The one unforgettable element of this interface | Design Thinking phase |
| `existing_tokens` | Design tokens or component library already in the project | Detected from codebase |
| `project_conventions` | CLAUDE.md rules, linting config, naming patterns | Detected from codebase |

**Rule:** Framework names and library choices are always Variables. They never appear in the Constants block.

---

## Hub-and-Spoke Configuration

The frontend build process is a wheel. The hub is the delivered frontend code. Each spoke is a phase that feeds the hub.

| Spoke | Input | Output | Interface to Hub |
|-------|-------|--------|-----------------|
| Discover | User request + codebase | Confirmed scope + detected conventions | Go/No-Go: deliverable is named, constraints are known |
| Design | Confirmed scope | Locked aesthetic direction (tone, fonts, colors, motion, differentiator) | Go/No-Go: all 5 aesthetic decisions are committed |
| Structure | Locked aesthetic | Component tree + file map | Go/No-Go: every component maps to exactly one file in `ui/` |
| Build | Component tree | Production-grade code | Go/No-Go: code renders, is functional, matches aesthetic |
| Refine | Built code | Polished code with details, effects, edge cases | Go/No-Go: anti-generic check passes, complexity matches vision |
| Deliver | Refined code | Final output to user | Final output |

**Hub rule:** The hub (delivered frontend code) is the only thing that touches the outside world. Spokes do not call other spokes. Each spoke completes its job and hands off to the hub.

---

## Phase Failure Handling

**Constants:**
- Silent retry is never the response to a phase failure.
- The three-field log is always produced before escalation.
- The user decides whether to retry, revise direction, or abort.

**Variables:**
- The specific phase that failed.
- The specific error or unexpected output.

**OTHER path:** If the failure cannot be classified (e.g., font service unavailable, framework incompatibility, render anomaly), log it to the error table with `phase_failed`, `attempted_action`, and `raw_output`. Do not attempt to resolve OTHER without user input.

---

## Rules — What This Skill Never Does

1. **Never code before designing.** The Design Thinking phase is not optional. Skipping it produces generic output. _Reason: design decisions made during coding are reactive, not intentional._
2. **Never use banned fonts.** Inter, Roboto, Arial, system-ui as primary fonts are prohibited. _Reason: these are the hallmark of AI-generated slop._
3. **Never reuse the same aesthetic.** Each build gets its own tone, palette, and font pairing. No convergence across generations. _Reason: repetition is the opposite of design._
4. **Never put frontend logic in `app/` or `data/`.** Frontend output maps to `ui/` only. _Reason: CTB branch discipline prevents structural drift._
5. **Never produce mockups instead of code.** Output is functional, production-grade. _Reason: the deliverable is code, not a picture of code._
6. **Never let LLM creativity override deterministic base.** If the project has design tokens, use them. If CLAUDE.md specifies conventions, follow them. Aesthetic creativity operates within those rails. _Reason: determinism first, LLM as tail._
7. **Never treat backgrounds as afterthoughts.** Create atmosphere — gradient meshes, noise textures, geometric patterns, layered transparencies, grain overlays. Solid white/gray backgrounds are a design failure unless intentionally minimal. _Reason: backgrounds set the entire mood._

---

## Architectural Awareness

### Altitude Model — Where Frontend Lives

| Layer | Name | Frontend Example |
|-------|------|-----------------|
| CC-01 | Sovereign | Design system doctrine (this skill) |
| CC-02 | Hub | A component library or page layout system |
| CC-03 | Context | A specific component within a page |
| CC-04 | Process | A single build invocation of this skill |

Authority flows downward. A component (CC-03) cannot redefine the design system (CC-02). Props flow down. Events flow up.

### Two-Table Pattern

| Table | Frontend Equivalent |
|-------|-------------------|
| CANONICAL | Production components that pass all design gates |
| ERROR | Rejected builds — generic output, broken renders, anti-pattern violations |

If a build frequently fails the anti-generic check, the Constants block is incomplete — add a stricter design constraint, do not loosen the gate.

### CTB Backbone — Frontend Branch

Frontend code maps to `ui/` under `src/`:

| Sub-path | Contains |
|----------|----------|
| `ui/pages/` | Full page layouts |
| `ui/components/` | Reusable components (each is a hub; props are spokes) |
| `ui/layouts/` | Layout shells, grid systems |
| `ui/styles/` | CSS variables, design tokens, global styles |
| `ui/assets/` | Fonts, images, icons |

No `utils/`, `helpers/`, `common/`, `shared/`, `lib/`, or `misc/` folders. These are junk drawers.

---

## Workflow

### Phase 1 — Discover (Spoke 1)

**Constants:** The request must name at least one deliverable. Technical constraints must be known before design begins.

**Variables:** The specific deliverable, framework, and project context.

**Execute:**
1. Parse the user request for: deliverable type, audience, purpose, technical constraints.
2. Scan the codebase for existing design tokens (`*.css` variables, theme files, tailwind config, component libraries).
3. Read project CLAUDE.md for conventions that constrain design choices.
4. If deliverable or constraints are ambiguous, ask before proceeding.

**Go/No-Go:** Can you name the deliverable, the framework, and any existing design constraints? If yes, proceed. If no, ask.

### Phase 2 — Design (Spoke 2)

**Constants:** All five aesthetic decisions must be committed before any code is written. This is the deterministic-then-creative gate: existing tokens and conventions are the deterministic base; aesthetic choices within those rails are the creative tail.

**Variables:** The five aesthetic decisions.

**Execute — commit each decision explicitly:**

1. **Purpose + Audience:** State in one sentence what this interface solves and for whom.
2. **Tone:** Pick a bold direction. Options for inspiration (do not limit to these): brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian. Design one true to the direction.
3. **Font Pairing:** Name the display font and the body font. Both must be distinctive and contextually appropriate. If the project already has fonts declared, use those (deterministic base wins).
4. **Color System:** Define dominant color, accent color(s), and background treatment as CSS custom properties. If existing tokens exist, extend them — do not replace.
5. **Differentiator:** Name the one thing someone will remember about this interface. This is the creative signature.

**Go/No-Go:** Are all five decisions written down? Can you explain why each choice fits the purpose? If yes, proceed. If no, iterate on the weakest decision.

### Phase 3 — Structure (Spoke 3)

**Constants:** Every component maps to exactly one file. Component is hub, props are spokes. No file exists outside `ui/` sub-paths.

**Variables:** The specific component tree and file map.

**Execute:**
1. Decompose the deliverable into components (hub-spoke: page is hub, sections are spokes; section is hub, elements are spokes).
2. Map each component to a file path under `ui/`.
3. Define the CSS variable contract (design tokens) that flows from parent to child.
4. Identify which motion moments exist and where they attach.

**Go/No-Go:** Does every component have exactly one file? Does every file map to `ui/`? If yes, proceed. If no, restructure.

### Phase 4 — Build (Spoke 4)

**Constants:** Code is production-grade. Implementation complexity matches the aesthetic vision. CSS-first for motion (use Motion library for React when available).

**Variables:** The specific code, framework idioms, and implementation patterns.

**Execute:**
1. Write the CSS variables / design tokens first (color, typography, spacing, motion timing).
2. Build component structure (semantic HTML, accessibility attributes).
3. Apply typography — the font pairing committed in Phase 2, with proper sizing, weight, and line-height hierarchy.
4. Apply color system — dominant, accent, and background treatments.
5. Apply spatial composition — the layout strategy committed in Phase 2 (asymmetry, overlap, density, whitespace).
6. Apply backgrounds and visual details — atmosphere, texture, depth. Gradient meshes, noise, geometric patterns, grain overlays, dramatic shadows, custom borders as appropriate to the tone.
7. Apply motion — page load orchestration (staggered `animation-delay`), scroll triggers, hover states that surprise.
8. Ensure all interactive elements are functional.

**Go/No-Go:** Does the code render? Is it functional? Does it match the aesthetic committed in Phase 2? If yes, proceed. If no, fix before continuing.

### Phase 5 — Refine (Spoke 5)

**Constants:** The anti-generic check is mandatory. Every detail must earn its presence.

**Variables:** The specific refinements needed.

**Execute — run the anti-generic checklist:**

| Check | Pass Condition |
|-------|---------------|
| Font check | No Inter, Roboto, Arial, or system-ui as primary. Fonts are distinctive. |
| Color check | No purple-gradient-on-white. Palette has clear dominant + accent. |
| Layout check | Not a cookie-cutter card grid or standard Bootstrap layout. Has spatial character. |
| Background check | Not plain white or plain gray (unless intentionally minimal with texture/detail). |
| Motion check | At least one orchestrated moment (page load, scroll trigger, or hover). |
| Complexity match | Maximalist vision has elaborate code. Minimal vision has precise restraint. |
| Differentiator check | The one memorable element is implemented and visible. |

Fix any failing check. Then review edge cases: responsive behavior, empty states, loading states, error states.

**Go/No-Go:** Does every check pass? If yes, proceed. If no, fix and re-check.

### Phase 6 — Deliver (Spoke 6)

**Constants:** Delivery includes the code and a brief design summary (tone, fonts, colors, differentiator).

**Execute:**
1. Present the complete, functional code.
2. State the aesthetic decisions made: tone, font pairing, color system, differentiator.
3. Note any project conventions that constrained choices (deterministic base).

**Go/No-Go:** Code delivered. Functional. Distinctive. Task complete.

---

## CTB Backbone Mapping

When this skill's output lands in a repo:

| Output | CTB Branch | Sub-path |
|--------|-----------|----------|
| Page layouts | `ui/` | `ui/pages/` |
| Components | `ui/` | `ui/components/` |
| Layout shells | `ui/` | `ui/layouts/` |
| Design tokens / CSS | `ui/` | `ui/styles/` |
| Font files / images | `ui/` | `ui/assets/` |

No frontend output maps to `app/`, `data/`, `sys/`, or `ai/`. Frontend is `ui/` only. If a component requires business logic, that logic lives in `app/` as a separate module — the component consumes it via props (spokes), never by importing from `app/` directly.

---

## Constant-First Principle

Design tokens are constants. Lock them early:
- Font pairing decided in Phase 2 does not change in Phase 4.
- Color system defined as CSS variables does not get overridden inline.
- Motion timing established once applies everywhere.

Every aesthetic "variable" that can be locked as a constant SHOULD be locked. The only true variables at build time are content (text, images) and framework-specific implementation details. If a developer keeps changing fonts mid-build, the Design phase was incomplete — return to Phase 2.

**Diagnostic:** If builds frequently fail the anti-generic check, the Constants block is missing a design constraint. Add stricter font/color/layout rules. Do not loosen the gate.

---

## Iteration

After delivering a build, iterate based on real usage:

1. Use the output in a real project.
2. Notice where the design feels generic — that is a Constants gap or a missing anti-generic check.
3. Identify whether the fix is a new constant (add to Constants), a new boundary (add to Rules), or a new workflow check (add to Refine phase checklist).
4. Implement the fix, re-run the anti-generic checklist, re-deliver.

**The goal:** Every build is visually distinctive, structurally compliant, and production-ready. No two builds look the same. The anti-generic gate is mechanical — zero advisory, zero override.

---

## Installation Targets

- **Global:** `~/.claude/commands/frontend-design.md` (all projects)
- **Project-level:** `.claude/commands/frontend-design.md` (single project)
