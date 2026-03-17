---
name: sales-proposal
description: >
  Sales Proposal Generator — produces a complete, client-ready CLIENT-PROPOSAL.md
  with 11 fixed sections, 3-tier pricing, 3 ROI scenarios, and a 6-email follow-up
  sequence. Invoked via `/sales proposal <client>`. Industry-agnostic engine.
  Deterministic template structure; LLM fills variable slots only.
weight: 1.00
tier: master
---

# Sales Proposal Generator

## Tier 0 Doctrine

- **Tier:** Master (standalone skill invoked directly)
- **Authority:** Reads client inputs + prior analysis files; produces one deliverable (CLIENT-PROPOSAL.md)
- **Determinism first:** All 11 sections follow fixed templates. Pricing uses declared tier model. ROI uses declared scenario formulas. No LLM interpretation of structure.
- **No fabrication:** Every claim, metric, and case study must originate from user-supplied inputs or prior analysis files. Absence of data produces placeholder slots, not invented content.

---

## IMO (Top-Level)

| Layer | Responsibility |
|-------|---------------|
| **Ingress** | `/sales proposal <client>` + 8 required inputs + 5 optional inputs + prior analysis files if present (schema validation only) |
| **Middle** | Assemble 11 proposal sections from templates; compute 3-tier pricing with ROI math; build 6-email follow-up sequence; enforce writing principles and page constraints |
| **Egress** | `CLIENT-PROPOSAL.md` — complete proposal + follow-up appendix (read-only structured output) |

---

## Constants

| Constant | Value | Authority |
|----------|-------|-----------|
| Invocation | `/sales proposal <client>` | Skill contract |
| Output File | `CLIENT-PROPOSAL.md` | Skill contract |
| Proposal Sections | 11 fixed: Cover Page, Executive Summary, Situation Analysis, Proposed Solution, Scope of Work, Timeline, Investment, ROI Projection, Team, Case Studies, Next Steps | Fixed structure |
| Writing Principles | 7: lead with problems, anchor price to ROI, use client language, under 15 pages, sales document, confidence without arrogance, frame as opportunity | Fixed |
| Executive Summary | 1 page, 250-350 words, 5 paragraphs: Acknowledge, Problem, Solution, Outcomes, Urgency | Fixed |
| Executive Summary Format | No bullet points — narrative only | Fixed |
| Pricing Model | 3-tier Good-Better-Best with aspiration names (never Basic/Standard/Premium) | Fixed |
| Pricing Anchor | Middle tier = RECOMMENDED; top tier anchors middle as reasonable; bottom tier = fallback | Fixed |
| ROI Scenarios | 3: Conservative, Moderate, Aggressive | Fixed |
| ROI Conservative Rule | Must show positive ROI; if not, adjust pricing or scope | Fixed |
| Solution Phases | 3 phases with aspiration names (e.g., Foundation, Growth, Scale) | Fixed |
| Case Study Format | Challenge-Solution-Results with 3+ measurable results each | Fixed |
| Case Study Count | 2-3 per proposal | Fixed |
| Validity Period | 30 days from generation date | Fixed |
| Confidential Marking | Always present on cover page | Fixed |
| Page Limit | 15 pages maximum | Fixed |
| Follow-Up Sequence | 6 emails: Day 0 (delivery), Day 2 (walkthrough), Day 5 (value-add), Day 7 (check-in), Day 14 (value-add), Day 21 (breakup) | Fixed |
| Next Steps Limit | 3-4 items maximum | Fixed |
| Scope Exclusions | Minimum 3 explicit exclusions required | Fixed |
| Required Inputs | 8: client name/company, industry/model, pain points (min 3), proposed solution, engagement model, budget range, timeline, case studies | Fixed |
| Optional Inputs | 5: decision makers, competitive context, urgency factors, client language, previous conversations | Fixed |
| Prior Analysis Files | PROSPECT-ANALYSIS.md, COMPANY-RESEARCH.md, LEAD-QUALIFICATION.md, COMPETITIVE-INTEL.md, DECISION-MAKERS.md, MEETING-PREP.md, OBJECTION-PLAYBOOK.md | Fixed |
| Engagement Models | Retainer, Project-based, Performance-based, Hybrid | Fixed |

---

## Variables

| Variable | Source | Runtime |
|----------|--------|---------|
| `client_name` | User input or prior analysis | Per-run |
| `client_company` | User input or prior analysis | Per-run |
| `industry` | User input or COMPANY-RESEARCH.md | Per-run |
| `business_model` | User input or COMPANY-RESEARCH.md | Per-run |
| `pain_points` | User input or PROSPECT-ANALYSIS.md (min 3) | Per-run |
| `proposed_solution` | User input | Per-run |
| `engagement_model` | User input | Per-run |
| `budget_range` | User input or LEAD-QUALIFICATION.md | Per-run |
| `timeline` | User input | Per-run |
| `case_studies` | User input (2-3) | Per-run |
| `decision_makers` | User input or DECISION-MAKERS.md (optional) | Per-run |
| `competitive_context` | User input or COMPETITIVE-INTEL.md (optional) | Per-run |
| `urgency_factors` | User input or LEAD-QUALIFICATION.md (optional) | Per-run |
| `client_language` | User input or conversation notes (optional) | Per-run |
| `previous_conversations` | User input or MEETING-PREP.md (optional) | Per-run |
| `tier_1_price` | Computed from budget + scope | Computed |
| `tier_2_price` | Computed — aligns with stated budget | Computed |
| `tier_3_price` | Computed — anchor tier | Computed |
| `roi_conservative` | Computed from metrics + assumptions | Computed |
| `roi_moderate` | Computed from metrics + assumptions | Computed |
| `roi_aggressive` | Computed from metrics + assumptions | Computed |
| `team_members` | User input | Per-run |
| `your_company` | User input | Per-run |
| `your_contact` | User input | Per-run |
| `proposal_date` | System date | Per-run |
| `valid_until` | `proposal_date + 30 days` | Computed |

---

## Workflow

### BLOCK 1: Input Collection & Prior File Scan
**Governed by: C&V**

**Constants:** Required inputs (8), optional inputs (5), prior analysis files (7), engagement models
**Variables:** `client_name`, `client_company`, `industry`, `business_model`, `pain_points`, `proposed_solution`, `engagement_model`, `budget_range`, `timeline`, `case_studies`, `decision_makers`, `competitive_context`, `urgency_factors`, `client_language`, `previous_conversations`

**IMO:**
- **Ingress:** `/sales proposal <client>` — validate client identifier present
- **Middle:**
  - Scan working directory for prior analysis files: PROSPECT-ANALYSIS.md, COMPANY-RESEARCH.md, LEAD-QUALIFICATION.md, COMPETITIVE-INTEL.md, DECISION-MAKERS.md, MEETING-PREP.md, OBJECTION-PLAYBOOK.md
  - Extract available data from each file found (company overview, pain points, BANT data, budget signals, competitive positioning, contact profiles, objection responses)
  - Inform user what prior data was found and incorporated
  - For each of the 8 required inputs not covered by prior files, ask the user explicitly
  - For optional inputs not covered, accept if offered but do not block
  - Validate: minimum 3 pain points collected, engagement model is one of 4 declared types
- **Egress:** Complete input set with source attribution (user-supplied vs. file-extracted)

**Go/No-Go:** All 8 required inputs must be present. If any required input is missing after asking, halt — do not generate a generic proposal.

---

### BLOCK 2: Proposal Assembly (Sections 1-6)
**Governed by: IMO**

**Constants:** 11 proposal sections (first 6 here), writing principles (7), executive summary format (5 paragraphs, 250-350 words, no bullets), solution phases (3), page limit (15), validity period (30 days), confidential marking
**Variables:** All client variables from Block 1, `proposal_date`, `valid_until`, `your_company`, `your_contact`

**IMO:**
- **Ingress:** Complete input set from Block 1
- **Middle:**
  - **Section 1 — Cover Page:** Company names, proposal title (specific to client situation, not generic), prepared for/by, date, valid until (date + 30 days), CONFIDENTIAL
  - **Section 2 — Executive Summary:** 1 page, 5 paragraphs in fixed order: (1) Acknowledge situation 2-3 sentences, (2) State problem/opportunity 2-3 sentences with quantification, (3) Preview solution 2-3 sentences focused on outcomes, (4) Hint at outcomes 2-3 sentences with comparable client reference, (5) Create urgency 1-2 sentences — factual only, no manufactured urgency. Total 250-350 words, narrative only, no bullets.
  - **Section 3 — Situation Analysis:** Current state (2-3 paragraphs with quantified impact), opportunities identified (3-5 with cause and estimated impact), competitive context (if applicable — peer framing), key challenges (2-3 — demonstrates realism). Frame challenges as opportunities, never failures.
  - **Section 4 — Proposed Solution:** Strategic framework (3-5 sentences on approach + why it works), then 3 phases with aspiration names. Per phase: objective, key activities with specific deliverables, milestone, client involvement requirements. Activities must be specific and measurable.
  - **Section 5 — Scope of Work:** Deliverables (with quantities), meeting cadence (kickoff + recurring + reviews + ad-hoc), response times (email SLA, urgent SLA, report SLA), tools provided, explicit exclusions (minimum 3 with rationale), client responsibilities (with timelines).
  - **Section 6 — Timeline:** Phase/week table with activities and milestones, key dates table. Include buffer time. Mark client decision points.
- **Egress:** Sections 1-6 assembled in template structure

**Go/No-Go:** All 6 sections rendered. Executive summary word count within 250-350 range. Minimum 3 exclusions listed in scope. Proceed to Block 3.

---

### BLOCK 3: Pricing, ROI & Evidence (Sections 7-10)
**Governed by: Circle**

**Constants:** 3-tier pricing model (aspiration names, middle = RECOMMENDED), ROI scenarios (3: conservative/moderate/aggressive), ROI conservative rule (must show positive ROI), case study format (Challenge-Solution-Results, 3+ measurable results), case study count (2-3)
**Variables:** `budget_range`, `tier_1_price`, `tier_2_price`, `tier_3_price`, `roi_conservative`, `roi_moderate`, `roi_aggressive`, `case_studies`, `team_members`

**IMO:**
- **Ingress:** Client inputs + sections 1-6 context
- **Middle:**
  - **Section 7 — Investment:** Build 3-tier pricing table with aspiration names (never Basic/Standard/Premium). Per tier: monthly + annual pricing (with annual discount), feature/service inclusions, expected ROI multiplier, "Best For" descriptor. Middle tier = RECOMMENDED, aligns with stated budget. Include ROI justification per tier: monthly investment, expected monthly return, breakeven month, 12-month ROI percentage.
  - **Section 8 — ROI Projection:** Current state vs. projected state table (3+ metrics across 3 scenarios). ROI calculation table: annual value created, annual investment, net ROI, ROI %. Assumptions list with basis for each. Conservative estimate must show positive ROI. Use client metrics and language for KPIs.
  - **Section 9 — Team:** Per member: name, role on engagement, 2-3 sentences (experience, relevance to client's industry/challenges, one notable achievement). Only actual team members. Highlight client-relevant experience.
  - **Section 10 — Case Studies:** 2-3 studies matching client's industry, size, or challenge. Per study: industry/size/challenge header, Challenge (2-3 sentences mirroring prospect situation), Solution (2-3 sentences on approach), Results (3+ specific measurable metrics with before/after and % improvement + timeline), client quote if available. If names restricted, use descriptive labels.
- **Egress:** Sections 7-10 assembled in template structure

**Go/No-Go:** All 4 sections rendered. 3 pricing tiers present. Conservative ROI is positive. Each case study has 3+ measurable results. Proceed to Block 4.

---

### BLOCK 4: Close & Follow-Up Sequence (Section 11 + Appendix)
**Governed by: CTB**

**Constants:** Next steps limit (3-4 items), follow-up sequence (6 emails on fixed schedule), validity period (30 days), page limit (15)
**Variables:** `your_contact`, `valid_until`, `proposal_date`

**IMO:**
- **Ingress:** Sections 1-10 + contact information
- **Middle:**
  - **Section 11 — Next Steps:** 3-4 clear action items: (1) review proposal and share with team, (2) proposal walkthrough call with specific suggested date, (3) finalize engagement agreement for e-signature, (4) kickoff within X days of signing. Include direct contact information (name, title, email, phone, website). Restate validity date.
  - **Appendix — Follow-Up Sequence:** 6 complete ready-to-send emails:
    - Day 0 (Delivery): 50-70 words, attach/link proposal, highlight 2 key sections, propose walkthrough date, state validity
    - Day 2 (Walkthrough): 40-60 words, ask if reviewed, offer 15-min walkthrough, pre-answer likely question, two time options
    - Day 5 (Value-Add): 50-70 words, share genuinely valuable insight, connect to their challenge, do NOT mention proposal
    - Day 7 (Check-In): 40-60 words, ask about timeline/decision process, offer to adjust proposal, ask about other stakeholders
    - Day 14 (Value-Add): 50-70 words, another genuine value piece, brief mention of walkthrough availability
    - Day 21 (Breakup): 50-70 words, direct and honest, leave door open, one factual urgency point, end with "no hard feelings"
  - Final assembly: merge all 11 sections + appendix into CLIENT-PROPOSAL.md
  - Validate total length does not exceed 15 pages
- **Egress:** Complete `CLIENT-PROPOSAL.md` written to working directory

**Go/No-Go:** File written. All 11 sections + appendix present. 6 follow-up emails included. Under 15 pages. Validity date set. CONFIDENTIAL marking present.

---

## Rules

1. **Never** generate a proposal with missing required inputs. All 8 required inputs must be collected before assembly begins. A generic proposal is worse than no proposal.
2. **Never** present a price without ROI context. Every price must be paired with the value it generates. "$10,000/month" is a cost; "$10,000/month generating $50,000 revenue" is an investment.
3. **Never** use generic tier names (Basic, Standard, Premium). Use aspiration names that reflect outcomes (Growth, Accelerate, Transform).
4. **Never** frame the client's situation as a failure. Frame as opportunity: "You have a significant opportunity to..." not "Your current approach is failing because..."
5. **Never** exceed 15 pages. Proposals over 15 pages do not get read. Conciseness signals competence.
6. **Never** include case studies without 3+ specific measurable results. Vague case studies erode credibility.
7. **Never** fabricate metrics, case studies, or client quotes. Every data point must come from user-supplied inputs or prior analysis files. Placeholders over invention.
8. **Never** omit the follow-up email sequence. A proposal without a follow-up plan is incomplete. All 6 emails are part of the deliverable.
9. **Never** use bullets in the executive summary. It must read as a 5-paragraph narrative within 250-350 words.
10. **Never** omit scope exclusions. Minimum 3 explicit exclusions prevent scope creep. Ambiguity creates conflict.
11. **Never** skip prior analysis file scan. If PROSPECT-ANALYSIS.md, COMPANY-RESEARCH.md, or other files exist, incorporate their data automatically. Do not ask users to repeat information already captured.
12. **Never** inflate ROI projections. Conservative estimates must be genuinely conservative. Overpromising destroys credibility when results arrive.

---

## Reference Pointers

| Reference | Location |
|-----------|----------|
| Prospect analysis skill | `skills/sales-prospect/SKILL.md` |
| Lead qualification skill | `skills/sales-qualify/SKILL.md` |
| Company research skill | `skills/sales-research/SKILL.md` |
| Competitive intel skill | `skills/sales-competitive/SKILL.md` |
| Objection handling skill | `skills/sales-objections/SKILL.md` |
| Meeting prep skill | `skills/sales-meeting/SKILL.md` |
| Doctrine | `templates/doctrine/ARCHITECTURE.md` (IMO, Hub-Spoke, CTB) |
| Skill creation rules | `skills/skill-creator/SKILL.md` |
