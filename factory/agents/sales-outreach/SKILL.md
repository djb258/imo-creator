---
name: sales-outreach
description: >
  Cold Outreach Sequence Generator — produces a complete, personalized, ready-to-send
  5-email cold sequence with integrated LinkedIn touchpoints. Trigger via
  `/sales outreach <prospect>` standalone (outputs OUTREACH-SEQUENCE.md) or as the
  sales-strategy subagent within `/sales prospect` (returns Outreach Readiness Score 0-100).
  Industry-agnostic engine — outreach frameworks and sequence structure are universal
  constants; prospect details, triggers, and industries are runtime variables.
weight: 0.20
tier: spoke
---

# Cold Outreach Sequence Generator

## Tier 0 Doctrine

- **Tier:** Spoke (subagent of sales-prospect as sales-strategy; also standalone via `/sales outreach <prospect>`)
- **Authority:** Reads discovery briefing from orchestrator or performs own research; scores Outreach Readiness dimension only when subagent
- **Determinism first:** Framework selection uses a declared decision tree. Scoring uses declared formulas and calibration tables. No LLM interpretation of scores.
- **No fabrication:** Every personalization element must reference specific, verifiable prospect data. Absence of data is scored, not invented.

---

## IMO (Top-Level)

| Layer | Responsibility |
|-------|---------------|
| **Ingress** | Prospect identifier (URL, company name, or reference to existing analysis) + optional discovery briefing from orchestrator (schema validation only) |
| **Middle** | Personalization research across 3 trigger categories; framework selection via decision tree; 5-email sequence generation with LinkedIn touchpoints; 4-dimension scoring with evidence collection |
| **Egress** | OUTREACH-SEQUENCE.md (standalone) or Outreach Readiness Score 0-100 with full sequence (subagent) — read-only structured output |

---

## Constants

| Constant | Value | Authority |
|----------|-------|-----------|
| Outreach Frameworks | 4: Observation-Connection-Ask, Problem-Proof-Ask, Trigger Event, Mutual Connection | This file |
| Framework Decision Tree | Hot trigger -> F3; Mutual connection -> F4; Strong anchor -> F1; Case study -> F2; Fallback -> F1 | This file |
| Sequence Structure | 5 emails: Hook (Day 1), Value Add (Day 3), Social Proof (Day 7), Different Angle (Day 14), Breakup (Day 21) | This file |
| LinkedIn Touchpoints | 4: Connection request (Day 0), Engage content (Day 5), DM (Day 10), Share content (Day 18) | This file |
| Total Touchpoints | 9 across 2 channels over 21 days | This file |
| Subject Line Limit | 4-7 words, no spam words, no exclamation marks, no ALL CAPS | This file |
| Body Word Limit | Emails 1-4: under 100 words; Email 5: under 75 words | This file |
| LinkedIn Connection Note Limit | Under 300 characters | This file |
| LinkedIn DM Limit | Under 150 words | This file |
| CTA Rule | One per email, low friction, question not command, specific | This file |
| Tone Rule | Peer-to-peer, no jargon, no exclamation marks, no emojis, plain text | This file |
| Banned Jargon | synergy, leverage, circle back, touch base, low-hanging fruit, deep dive, bandwidth, ecosystem | This file |
| Banned Openers | "I hope this finds you well", "My name is...", "I'm reaching out because..." | This file |
| First Line Rule | MUST reference specific prospect data — never generic | This file |
| Trigger Categories | Company (7 types), Personal (6 types), Industry (5 types) | This file |
| Company Trigger Types | Funding, Product Launch, Hiring Spree, Leadership Change, Expansion, Partnership, Award | This file |
| Personal Trigger Types | New Role, Promotion, Recent Post/Article, Speaking Engagement, Career Milestone, Published Content | This file |
| Industry Trigger Types | New Regulation, Market Shift, Competitor Move, Technology Disruption, Economic Conditions | This file |
| Trigger Quality: Hot | Within 30 days, directly relevant | This file |
| Trigger Quality: Warm | Within 90 days, related to solution area | This file |
| Trigger Quality: Cool | 3-6 months, background context only | This file |
| A/B Test Rule | Subject lines + opening lines; test one element at a time; 50 sends minimum per variant | This file |
| Scoring Dimensions | Personalization Depth, Trigger Events Found, Channel Strategy Clarity, Message-Market Fit | This file |
| Dimension Range | 0-25 per dimension | This file |
| Score Formula | Sum of 4 dimensions = 0-100 | This file |
| Calibration: 20-25 | Exceptional — strong data, multiple sources, high confidence | This file |
| Calibration: 15-19 | Strong — good data, moderate confidence | This file |
| Calibration: 10-14 | Moderate — some signals, mixed quality | This file |
| Calibration: 0-9 | Weak — limited or no signals | This file |
| Send Timing Lookup | C-suite: Tue-Thu 7-8AM/5-6PM; Directors: Tue-Thu 9-11AM; Technical: Tue-Wed 10AM-12PM; Founders: any weekday 7-9AM/8-10PM | This file |
| Deliverability Rules | 10-20/day start, warm 2-3 weeks, separate sending domain, SPF/DKIM/DMARC, unsubscribe link | This file |
| Follow-Up: No Response | Wait 30 days, re-approach with new angle | This file |
| Follow-Up: Positive | Respond within 1 hour, propose 2-3 specific times | This file |
| Output File | OUTREACH-SEQUENCE.md | This file |

---

## Variables

| Variable | Source | Runtime |
|----------|--------|---------|
| `prospect_identifier` | User input or orchestrator | Per-run |
| `company_name` | WebSearch / discovery briefing | Discovered |
| `primary_contact` | WebSearch / discovery briefing | Discovered |
| `contact_title` | WebSearch / LinkedIn | Discovered |
| `contact_email_pattern` | WebSearch | Discovered |
| `company_triggers` | WebSearch (7 query patterns) | Discovered |
| `personal_triggers` | WebSearch (4 query patterns) | Discovered |
| `industry_triggers` | WebSearch (5 query patterns) | Discovered |
| `trigger_quality_ratings` | Assessed from trigger recency | Computed |
| `best_opening_angle` | Selected from highest-quality trigger | Computed |
| `secondary_angle` | Backup trigger for follow-up emails | Computed |
| `selected_framework` | Decision tree evaluation | Computed |
| `linkedin_profile_url` | WebSearch | Discovered |
| `case_study_match` | WebSearch / prior analysis | Discovered |
| `industry_vertical` | WebSearch / discovery briefing | Discovered |
| `company_size` | WebSearch / discovery briefing | Discovered |
| `email_subjects_ab` | Generated per email (2 variants each) | Computed |
| `email_bodies` | Generated per framework + personalization | Computed |
| `linkedin_touchpoint_content` | Generated per touchpoint slot | Computed |
| `personalization_depth_score` | Scoring formula | Computed |
| `trigger_events_score` | Scoring formula | Computed |
| `channel_strategy_score` | Scoring formula | Computed |
| `message_market_fit_score` | Scoring formula | Computed |
| `outreach_readiness_score` | Sum of 4 dimensions | Computed |
| `send_timing_recommendation` | Lookup by contact title | Computed |
| `audience_type` | Classified from contact title | Computed |

---

## Workflow

### BLOCK 1: Personalization Research
**Governed by: C&V**

**Constants:** 3 trigger categories (Company 7 types, Personal 6 types, Industry 5 types), trigger quality scale (Hot/Warm/Cool), trigger freshness windows, banned openers, first line rule
**Variables:** `company_triggers`, `personal_triggers`, `industry_triggers`, `trigger_quality_ratings`, `best_opening_angle`, `secondary_angle`

**IMO:**
- **Ingress:** Prospect identifier validated as non-empty string. If discovery briefing present, validate as parseable markdown.
- **Middle:**
  - If discovery briefing contains pre-fetched data, skip redundant research for covered dimensions
  - Execute company trigger searches: `"[company]" funding`, `"[company]" product launch`, `"[company]" hiring`, `"[company]" partnership`, `"[company]" expansion`, `"[company]" news`, `"[company]" CEO interview`
  - Execute personal trigger searches: `"[contact]" "[company]" LinkedIn`, `"[contact]" "[company]" interview`, `"[contact]" "[company]" presentation`, `"[contact]" "[company]" article`
  - Execute industry trigger searches: `"[industry]" trends`, `"[industry]" challenges`, `"[industry]" regulation`, `"[industry]" disruption`, `"[industry]" market shift`
  - For each trigger found: record description, date, category, quality rating (Hot/Warm/Cool per freshness windows)
  - Select best opening angle: highest-quality trigger with strongest connection to prospect
  - Select secondary angle: next-best trigger from a different category
  - Compile personalization research summary: company triggers, personal triggers, industry triggers, best/secondary angles
- **Egress:** Personalization research summary with all triggers rated and angles selected

**Go/No-Go:** Proceed if at least one trigger found at any quality level. If zero triggers found across all 3 categories, note limitation and proceed with industry-level personalization (weakest approach). Never halt — always generate sequence.

---

### BLOCK 2: Framework Selection & Sequence Generation
**Governed by: IMO**

**Constants:** 4 outreach frameworks with structure and selection criteria, framework decision tree, 5-email sequence structure (names, days, goals, word limits), email writing rules (subject limits, body limits, CTA rules, tone rules, banned jargon, banned openers, first line rule), A/B test rule
**Variables:** `selected_framework`, `email_subjects_ab`, `email_bodies`, `case_study_match`

**IMO:**
- **Ingress:** Personalization research summary from Block 1
- **Middle:**
  - Evaluate decision tree top-to-bottom:
    1. Hot company trigger present? -> Framework 3 (Trigger Event): reference trigger + create urgency
    2. Mutual connection available? -> Framework 4 (Mutual Connection): reference shared element + peer framing
    3. Strong personalization anchor (post, article, product)? -> Framework 1 (Observation-Connection-Ask): observation + bridge + soft ask
    4. Relevant case study with metrics? -> Framework 2 (Problem-Proof-Ask): problem + proof + ask
    5. None of above? -> Framework 1 with industry-level observation
  - Generate 5-email sequence following selected framework:
    - **Email 1 — Hook (Day 1):** specific observation first line, bridge to relevance, value statement with proof, soft CTA. Goal: get response.
    - **Email 2 — Value Add (Day 3):** brief reference to email 1 (no guilt), valuable insight/resource/data, why it matters to them, soft close. Goal: give, not ask.
    - **Email 3 — Social Proof (Day 7):** specific result for similar company, brief context, how achieved, bridge to prospect, slightly more direct CTA. Goal: trust via proof.
    - **Email 4 — Different Angle (Day 14):** new observation or pain point, different stakeholder perspective, fresh proof point, direct but respectful CTA. Goal: new perspective.
    - **Email 5 — Breakup (Day 21):** acknowledge busy (no guilt), restate core value in one sentence, leave door open. Under 75 words. Goal: respectful close.
  - For each email: generate 2 subject line variants (A/B), 2 opening line variants (A/B)
  - Enforce all writing rules: word limits, CTA count, tone, jargon ban, opener ban, first line specificity
  - If no matching case study for Email 3, substitute industry benchmark or third-party data
- **Egress:** Complete 5-email sequence with selected framework, A/B variants, per-email structure

**Go/No-Go:** All 5 emails must be generated regardless of personalization quality. Flag emails that rely on weak personalization. If running as subagent with time constraint, prioritize Email 1 quality over completeness of emails 4-5.

---

### BLOCK 3: LinkedIn Integration & Channel Strategy
**Governed by: Circle**

**Constants:** 4 LinkedIn touchpoint slots (Day 0, 5, 10, 18), connection note limit (300 chars), DM limit (150 words), send timing lookup table, deliverability rules, follow-up rules by scenario
**Variables:** `linkedin_touchpoint_content`, `linkedin_profile_url`, `send_timing_recommendation`, `audience_type`

**IMO:**
- **Ingress:** 5-email sequence from Block 2 + contact data from Block 1
- **Middle:**
  - **Day 0 — Connection request:** Write personalized note under 300 characters using best trigger. Never use default "I'd like to add you to my network."
  - **Day 5 — Content engagement:** Identify most recent LinkedIn post. Plan genuine, substantive comment (not "Great post!"). Add perspective or data. No pitch.
  - **Day 10 — LinkedIn DM:** Write cross-channel message under 150 words. Reference emails sent. Different value prop than emails. End with question.
  - **Day 18 — Share content:** Identify article/report/insight relevant to prospect. Plan post connecting content to their challenge. Tag only if genuinely relevant.
  - **Timing:** Classify contact into audience type (C-suite, Directors, Technical/IC, Founders). Look up send timing from constant table. Recommend specific days and times in prospect timezone.
  - **Deliverability:** Apply deliverability rules — recommend volume ramp, warmup period, domain setup, authentication checklist.
  - **Follow-up logic:** Map each response scenario (no response, OOO, not interested, not now, positive, question) to prescribed action from follow-up rules constant.
- **Egress:** LinkedIn touchpoint plan (4 entries with content) + send timing recommendation + deliverability checklist + follow-up decision table

**Go/No-Go:** Proceed unconditionally. If LinkedIn profile not found, omit touchpoints and note channel limitation in scoring.

---

### BLOCK 4: Scoring & Output Assembly
**Governed by: CTB**

**Constants:** 4 scoring dimensions (0-25 each), score formula (sum = 0-100), calibration scale, output file name (OUTREACH-SEQUENCE.md), output schema
**Variables:** `personalization_depth_score`, `trigger_events_score`, `channel_strategy_score`, `message_market_fit_score`, `outreach_readiness_score`

**IMO:**
- **Ingress:** All outputs from Blocks 1-3
- **Middle:**
  - Score each dimension 0-25 per calibration scale:
    - **Personalization Depth:** 20-25 strong personal + company triggers; 15-19 moderate; 10-14 weak; 0-9 none
    - **Trigger Events Found:** 20-25 hot trigger within 30 days; 15-19 warm within 90 days; 10-14 cool 3-6 months; 0-9 none
    - **Channel Strategy Clarity:** 20-25 LinkedIn + email + engagement path clear; 15-19 most channels; 10-14 email only; 0-9 no clear path
    - **Message-Market Fit:** 20-25 clear value prop + strong case study; 15-19 good match + moderate proof; 10-14 some relevance; 0-9 weak fit
  - Compute `outreach_readiness_score = sum of 4 dimensions`
  - Assemble OUTREACH-SEQUENCE.md with sections: Prospect Summary table, Personalization Research (company/personal/industry triggers), Selected Framework with reasoning, 5-email sequence (each with subject A/B, body, CTA, LinkedIn touchpoint, A/B variations), LinkedIn Touchpoint Summary table, Sending Best Practices, Objection Preparation table (3 likely objections with responses)
  - If standalone: write OUTREACH-SEQUENCE.md to working directory
  - If subagent: return structured block with score + full sequence for orchestrator
  - Generate terminal summary with Unicode bar charts for each dimension
- **Egress:** OUTREACH-SEQUENCE.md written (standalone) or structured score block returned (subagent)

**Go/No-Go:** Score must be calculable (all 4 dimensions scored). All 5 emails must be present. Any dimension without data: assign score per calibration, note data gap explicitly.

---

## Rules

1. **Never** write any email before completing personalization research. Generic outreach is worse than no outreach.
2. **Never** start an email with "I hope this finds you well", "My name is...", or "I'm reaching out because..." — first line must reference specific prospect data.
3. **Never** include more than one CTA per email. Low friction, question format, specific.
4. **Never** use banned jargon (synergy, leverage, circle back, touch base, low-hanging fruit, deep dive, bandwidth, ecosystem).
5. **Never** guilt-trip in follow-ups or breakup emails. No "I've sent 4 emails" or "This is my last email."
6. **Never** exceed word limits: emails 1-4 under 100 words, email 5 under 75 words, LinkedIn DM under 150 words.
7. **Never** fabricate triggers, case studies, or personalization data. Missing data is scored and noted, not invented.
8. **Never** use HTML formatting, emojis, exclamation marks, or bold/italic in generated emails. Plain text only.
9. **Never** skip A/B variant generation. Every email requires 2 subject line variants and 2 opening line variants.
10. **Never** send the LinkedIn default connection request. Every connection note must be personalized under 300 characters.

---

## Reference Pointers

| Reference | Location | Relationship |
|-----------|----------|-------------|
| Orchestrator | `skills/sales-prospect/SKILL.md` | Parent — launches this as sales-strategy subagent |
| Strategy Agent | `agents/sales-strategy.md` | Subagent wrapper with synthesis logic |
| Company Research | `skills/sales-research/SKILL.md` | Cross-skill — use COMPANY-RESEARCH.md if present |
| Contact Intelligence | `skills/sales-contacts/SKILL.md` | Cross-skill — use DECISION-MAKERS.md if present |
| Lead Qualification | `skills/sales-qualify/SKILL.md` | Cross-skill — use LEAD-QUALIFICATION.md for pain points |
| Competitive Intel | `skills/sales-competitors/SKILL.md` | Cross-skill — use COMPETITIVE-INTEL.md for positioning |
| Meeting Prep | `skills/sales-prep/SKILL.md` | Downstream — suggest after positive response |
| Follow-Up Sequences | `skills/sales-followup/SKILL.md` | Downstream — suggest for post-meeting sequence |
| Objection Handling | `skills/sales-objections/SKILL.md` | Downstream — suggest for deeper objection work |
| ICP Definition | `IDEAL-CUSTOMER-PROFILE.md` | Working directory file (optional) |
| Doctrine | `law/doctrine/TIER0_DOCTRINE.md` | IMO, Hub-Spoke, CTB |
| Skill Creation Rules | `factory/agents/skill-creator/SKILL.md` | V4 block format specification |
