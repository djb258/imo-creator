---
name: sales-prep
description: >
  Meeting Preparation Brief Engine — generates MEETING-PREP.md with 11 fixed sections
  covering company research, attendee intelligence, competitive context, and tactical
  preparation. Invoked standalone via `/sales prep <url>`. Industry-agnostic engine:
  section structure, question ordering, and response frameworks are constants;
  all prospect-specific content is runtime variable.
---

# Meeting Preparation Brief

## Tier 0 Doctrine

- **Tier:** Master (standalone skill, invoked directly)
- **Authority:** Operates on user-supplied URL + optional attendee/meeting context; produces one output artifact
- **Determinism first:** All section structure, question ordering, framework templates, and agenda layouts are fixed constants. LLM assembles research into deterministic slots — never interprets structure.
- **No fabrication:** Every factual claim must cite a source URL or be labeled inference. Absence of data is disclosed, not invented.

---

## IMO (Top-Level)

| Layer | Responsibility |
|-------|---------------|
| **Ingress** | Prospect URL + optional attendee names, meeting date/time, meeting purpose, product context (schema validation only) |
| **Middle** | 4-phase research (company, attendee, competitive, industry); assembly into 11 fixed sections + agenda templates |
| **Egress** | `MEETING-PREP.md` written to working directory (read-only structured output) |

---

## Constants

| Constant | Value | Authority |
|----------|-------|-----------|
| Output File | `MEETING-PREP.md` | Fixed |
| Output Sections | 11 fixed sections (see Workflow) | Fixed |
| Cheat Sheet Items | 5 items + opening line + key question + trap to avoid | Fixed |
| Talking Points Count | 5-7 per brief | Fixed |
| Discovery Questions Count | 10 per brief | Fixed |
| Discovery Question Order | rapport (2), situation (2), pain (2), impact (2), future (2) | Fixed |
| Objections Count | 5 per brief | Fixed |
| Objection Framework | Feel-Felt-Found | Fixed |
| Success Metric Tiers | minimum, target, stretch | Fixed |
| Next Step Tiers | bold, standard, minimum | Fixed |
| Agenda Templates | 30-minute and 60-minute | Fixed |
| Research Phases | Company, Attendee, Competitive, Industry | Fixed; 4 phases |
| Company Research Surfaces | Homepage, About, Products, Blog/News, Careers, Case Studies | Fixed |
| Attendee Profile Fields | Background, Recent Activity, Communication Style, Likely Priorities, Rapport Anchors, How to Win | Fixed |
| Communication Styles | detail-oriented, big-picture, data-driven, relationship-focused | Fixed |
| Attendee Roles (decision map) | decision-maker, influencer, gatekeeper | Fixed |
| Competitive Intel Categories | Current solutions, switching triggers, what NOT to say, differentiation | Fixed |
| Talking Point Format | Statement/Question + Context + Leads-to | Fixed |
| Discovery Question Format | Question + Purpose + Expected Response + Follow-Up + Listen For | Fixed |
| Objection Format | Exact words + Hidden concern + Feel-Felt-Found response + Proof point | Fixed |
| Landmine Format | Topic + Why avoid + If-it-comes-up handling | Fixed |
| Next Step Format | Exact wording + date suggestion + pushback response | Fixed |
| 30-Min Agenda Blocks | Rapport (2m), Discovery (8m), Value/Demo (10m), Q&A (5m), Next Steps (5m) | Fixed |
| 60-Min Agenda Blocks | Rapport (5m), Discovery (15m), Presentation (20m), Discussion (10m), Pricing (5m), Next Steps (5m) | Fixed |
| Prior Analysis Files | PROSPECT-ANALYSIS.md, COMPANY-RESEARCH.md, LEAD-QUALIFICATION.md, COMPETITIVE-INTEL.md, DECISION-MAKERS.md | Fixed |

---

## Variables

| Variable | Source | Runtime |
|----------|--------|---------|
| `target_url` | User invocation (`/sales prep <url>`) | Per-run |
| `attendee_names` | User input (optional) | Per-run |
| `meeting_date` | User input (optional) | Per-run |
| `meeting_purpose` | User input (optional) | Per-run |
| `product_context` | User input (optional) | Per-run |
| `company_name` | Homepage extraction | Discovered |
| `company_description` | Homepage, About page | Discovered |
| `company_size` | About page, LinkedIn | Discovered |
| `funding_stage` | WebSearch results | Discovered |
| `revenue_estimate` | WebSearch results | Discovered |
| `growth_signals` | Careers page, news | Discovered |
| `product_offerings` | Products/Services pages | Discovered |
| `recent_news` | WebSearch results | Discovered |
| `open_roles` | Careers page | Discovered |
| `case_studies` | Testimonials page | Discovered |
| `attendee_profiles` | LinkedIn, public presence | Discovered |
| `decision_dynamics` | Role analysis | Computed |
| `current_solutions` | Website tech, job posts, integrations | Discovered |
| `competitor_advantages` | Competitive analysis | Computed |
| `industry_trends` | WebSearch results | Discovered |
| `industry_pain_points` | WebSearch results | Discovered |
| `cheat_sheet` | Synthesis of all research | Computed |
| `talking_points` | Research-backed personalization | Computed |
| `discovery_questions` | Ordered by constant sequence | Computed |
| `objection_responses` | Feel-Felt-Found assembly | Computed |
| `success_metrics` | Meeting context + deal stage | Computed |
| `competitive_landmines` | Competitive research | Computed |
| `next_steps` | Meeting purpose + deal stage | Computed |
| `agenda` | Meeting duration selection | Computed |
| `prior_analysis` | Existing files in working directory | Discovered |

---

## Workflow

### BLOCK 1: Research Collection
**Governed by: C&V**

**Constants:** 4 research phases, 6 company research surfaces, attendee profile fields, competitive intel categories, prior analysis file list
**Variables:** `target_url`, `attendee_names`, `company_name`, `company_description`, `company_size`, `funding_stage`, `revenue_estimate`, `growth_signals`, `product_offerings`, `recent_news`, `open_roles`, `case_studies`, `attendee_profiles`, `current_solutions`, `industry_trends`, `industry_pain_points`, `prior_analysis`

**IMO:**
- **Ingress:** `target_url` validated as URL; optional inputs validated if present; check working directory for prior analysis files
- **Middle:**
  - **Phase 1 — Company:** WebFetch homepage, about, products, blog/news, careers, case studies. WebSearch `"[company]" news [year]` and `"[company]" funding OR acquisition`. Extract: description, value prop, team size, locations, pricing model, content themes, hiring signals, customer logos.
  - **Phase 2 — Attendee:** If names provided: search LinkedIn profiles, recent posts, conference talks, published articles. Build per-person profile using 6 fixed fields. Predict communication style from role/seniority. If no names: infer likely attendees from leadership page + meeting purpose + deal stage; label as "Predicted Attendees" with confidence level.
  - **Phase 3 — Competitive:** Detect current tools from website scripts, meta tags, job post requirements, partner pages, social mentions. For each competitor: note usage, identify advantages, flag topics to avoid.
  - **Phase 4 — Industry:** WebSearch for 2-3 recent trends/challenges. Identify regulatory changes, market shifts, competitive pressures.
  - If prior analysis files exist, ingest findings — do not re-research covered ground.
  - Run fetches in parallel where possible.
- **Egress:** Structured research data for all 4 phases; source URL recorded for every factual claim

**Go/No-Go:** Proceed if homepage fetch succeeds. If homepage unreachable, halt with error. Partial data from other phases is acceptable — flag gaps, continue.

---

### BLOCK 2: Brief Assembly
**Governed by: IMO**

**Constants:** 11 section structure, cheat sheet format (5 items + 3 elements), talking point format, discovery question format and ordering (rapport/situation/pain/impact/future x2), objection format (Feel-Felt-Found), success metric tiers (min/target/stretch), landmine format, next step tiers (bold/standard/minimum) with exact-wording requirement
**Variables:** All research variables from Block 1 + `cheat_sheet`, `talking_points`, `discovery_questions`, `objection_responses`, `success_metrics`, `competitive_landmines`, `next_steps`

**IMO:**
- **Ingress:** All structured research data from Block 1
- **Middle:**
  - **Section 1 — Cheat Sheet:** Synthesize 5 most important facts. Generate personalized opening line, key question, trap to avoid. This section must stand alone — a reader of only the cheat sheet walks in meaningfully prepared.
  - **Section 2 — Company Snapshot:** One paragraph (4-6 sentences) + quick-reference table (10 fields: Company, Website, Industry, Founded, Employees, Revenue, Funding, HQ, Key Products, Target Market).
  - **Section 3 — Attendee Profiles:** Per-attendee block with 6 fixed fields. If multiple attendees: add decision dynamics (decision-maker/influencer/gatekeeper) and meeting politics.
  - **Section 4 — Business Situation:** Current state, recent changes, growth trajectory, 3-5 key challenges, addressable opportunities. Frame challenges as opportunities — "room for improvement" not "problems."
  - **Section 5 — Competitive Context:** Current solutions with satisfaction assessment, switching triggers, topics to avoid, 2-3 differentiation points specific to this prospect.
  - **Section 6 — Talking Points (5-7):** Each must reference specific research. Format: statement/question + context + leads-to. Never generic ("How's business?", "Tell me about your company", "What keeps you up at night?" are banned).
  - **Section 7 — Discovery Questions (10):** Ordered: Q1-2 rapport, Q3-4 situation, Q5-6 pain, Q7-8 impact, Q9-10 future/decision. Each has: question, purpose, expected response, follow-up, listen-for signals. Questions must be genuinely curious, not leading.
  - **Section 8 — Objections (5):** Most likely objections for this prospect's size, industry, solutions, stage. Each: exact words, hidden concern, Feel-Felt-Found response with metrics, proof point.
  - **Section 9 — Success Metrics:** Minimum (bare-minimum worthwhile outcome), target (realistic best), stretch (ideal). Each specifies: what prospect says/agrees to, concrete next step established, information obtained.
  - **Section 10 — Competitive Landmines:** Topics to avoid. Each: topic, why avoid, graceful handling if raised.
  - **Section 11 — Next Steps:** Bold ask (most ambitious), standard ask (reasonable), minimum ask (fallback). Each: exact wording, specific date/time suggestion, pushback response.
- **Egress:** Complete 11-section brief content assembled in memory

**Go/No-Go:** All 11 sections must be populated. Any section with insufficient data must state what is missing and why. No empty sections permitted.

---

### BLOCK 3: Agenda Generation
**Governed by: Circle**

**Constants:** 30-minute agenda blocks (5 segments), 60-minute agenda blocks (6 segments), time allocations per segment
**Variables:** `meeting_purpose`, `agenda`, `talking_points`, `discovery_questions`

**IMO:**
- **Ingress:** Brief content from Block 2 + meeting context
- **Middle:**
  - Generate 30-minute agenda: Rapport (0:00-2:00) with specific talking point, Discovery (2:00-10:00) with top 4 questions, Value/Demo (10:00-20:00) with key points, Q&A (20:00-25:00) with likely questions, Next Steps (25:00-30:00) with proposed step and date.
  - Generate 60-minute agenda: Rapport (0:00-5:00), Discovery (5:00-20:00) with all 10 questions prioritized, Presentation (20:00-40:00) tailored to stated needs, Discussion (40:00-50:00) with proof points, Pricing (50:00-55:00) if appropriate for stage, Next Steps (55:00-60:00).
  - Cross-reference agenda activities to specific brief sections.
- **Egress:** Two agenda tables with prospect-specific notes per segment

**Go/No-Go:** Both agenda templates must be produced regardless of whether meeting duration is known.

---

### BLOCK 4: Output & Source Audit
**Governed by: CTB**

**Constants:** Output file name (`MEETING-PREP.md`), document header format, section numbering, research sources section
**Variables:** All assembled content from Blocks 2-3, all source URLs collected in Block 1

**IMO:**
- **Ingress:** Complete brief content + agenda tables + source URL registry
- **Middle:**
  - Assemble final document with header: title, generated date, meeting date (if provided), meeting purpose (if provided), prepared-by line.
  - Write 11 sections with horizontal rule separators, numbered per constant structure.
  - Append Suggested Agenda section with both templates.
  - Append Research Sources section listing every URL fetched and source consulted.
  - Verify every factual claim has a source citation or is labeled as inference.
  - Write `MEETING-PREP.md` to working directory.
- **Egress:** `MEETING-PREP.md` written to disk; confirmation message to user

**Go/No-Go:** File must be written successfully. If write fails, report error. Output always produced — partial data sections are disclosed, never omitted.

---

## Rules

1. **Never** include generic content. Every talking point, question, objection, and recommendation must reference specific research about this prospect.
2. **Never** fabricate evidence. Every factual claim cites a source URL. Speculation is labeled as inference, never presented as fact.
3. **Never** use manipulative tactics. No NLP tricks, psychological pressure techniques, or leading questions designed to force conclusions.
4. **Never** bash competitors. Competitive references are factual. Unverifiable claims are labeled "commonly reported" or omitted entirely.
5. **Never** produce empty sections. If data is insufficient, state what is missing and the impact on preparation quality.
6. **Never** re-research covered ground. If prior analysis files exist in the working directory, incorporate their findings directly.
7. **Never** exceed the fixed section count. Output has exactly 11 sections + agenda + sources. No additions, no removals, no reordering.
8. **Never** reorder discovery questions. The sequence rapport-situation-pain-impact-future is a constant, not a suggestion.
9. **Never** omit the Cheat Sheet opening line, key question, and trap. These three elements are mandatory even when research is sparse.
10. **Never** propose next steps without exact wording. Each tier (bold/standard/minimum) includes the literal sentence the salesperson should say.

---

## Reference Pointers

| Reference | Location |
|-----------|----------|
| Prospect analysis skill | `skills/sales-prospect/SKILL.md` |
| Qualification skill (BANT + MEDDIC) | `skills/sales-qualify/SKILL.md` |
| Opportunity assessment subagent | `agents/sales-opportunity.md` |
| ICP definition | `IDEAL-CUSTOMER-PROFILE.md` (working directory, optional) |
| Prior analysis files | `PROSPECT-ANALYSIS.md`, `COMPANY-RESEARCH.md`, `LEAD-QUALIFICATION.md`, `COMPETITIVE-INTEL.md`, `DECISION-MAKERS.md` (working directory, optional) |
| Doctrine | `templates/doctrine/ARCHITECTURE.md` (IMO, Hub-Spoke, CTB) |
| Skill creation rules | `skills/skill-creator/SKILL.md` |
