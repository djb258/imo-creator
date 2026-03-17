---
name: sales-followup
description: >
  Follow-Up Sequence Generator — produces multi-channel follow-up sequences
  for prospects after initial contact (meeting, demo, proposal, ghost, nurture).
  Trigger via `/sales followup <prospect>`. Industry-agnostic engine. Every email
  adds new value, references specific conversation points, and includes one clear
  next step. Output: FOLLOWUP-SEQUENCE.md.
---

# Follow-Up Sequence Generator

## Tier 0 Doctrine

- **Tier:** Master (standalone skill invoked directly)
- **Authority:** Reads prospect context from user input or prior analysis files in working directory
- **Determinism first:** Scenario selection, cadence, timing, and channel rules are table lookups. No LLM interpretation of which sequence to use.
- **No fabrication:** Every email references real conversation points. Absence of context must be collected, not invented.

---

## IMO (Top-Level)

| Layer | Responsibility |
|-------|---------------|
| **Ingress** | Prospect name + company + interaction type + context fields (schema validation only) |
| **Middle** | Scenario selection, cadence matrix lookup, multi-channel sequence assembly, breakup rules |
| **Egress** | FOLLOWUP-SEQUENCE.md with emails, LinkedIn actions, phone scripts, SMS templates, cadence calendar (read-only structured output) |

---

## Constants

| Constant | Value | Authority |
|----------|-------|-----------|
| Invocation | `/sales followup <prospect>` | Skill contract |
| Output File | `FOLLOWUP-SEQUENCE.md` | Skill contract |
| Scenarios | Post-Meeting (3 emails), Post-Demo (4 emails), Post-Proposal (5 emails), Ghost Recovery (3 emails), Nurture (6 monthly emails) | Fixed |
| Email Word Limit | Under 100 words per email | Fixed |
| Breakup Word Limit | 40-70 words | Fixed |
| Temperatures | Hot, Warm, Cool, Cold | Fixed |
| Deal Stages | Early, Active, Near Decision, Stalled | Fixed |
| Cadence: Hot | Early 2-3d, Active 2d, Near Decision daily, Stalled 3-4d | Fixed |
| Cadence: Warm | Early 4-5d, Active 3-4d, Near Decision 2-3d, Stalled 5-7d | Fixed |
| Cadence: Cool | Early 7d, Active 5-7d, Near Decision 4-5d, Stalled 10-14d | Fixed |
| Cadence: Cold/Ghost | Early 10-14d, Active 7-10d, Near Decision 5-7d, Stalled 14-21d | Fixed |
| Channel: Email | Primary channel; every touchpoint has an email | Fixed |
| Channel: LinkedIn | Secondary; 1-2 day offset from email; never same day as email | Fixed |
| Channel: Phone | Max 2 calls per sequence; best after Email 2 and before final email | Fixed |
| Channel: SMS | Warm/Hot leads only; opted-in only; max 1-2 per sequence | Fixed |
| SMS Rules | Max 2 sentences, no links, must self-identify | Fixed |
| Voicemail Limit | 30 seconds (~75 words), conversational tone, reference one prior point, point to companion email | Fixed |
| Time: C-Suite | Tue-Thu 7-8AM or 5-6PM | Fixed |
| Time: VPs/Directors | Tue-Thu 9-10AM or 2-3PM | Fixed |
| Time: Managers/ICs | Tue-Thu 10-11AM or 1-2PM | Fixed |
| Time: Avoid | Monday mornings, Friday afternoons, weekends | Fixed |
| Feel-Felt-Found | Objection-handling framework for post-demo sequences | Universal sales (industry-agnostic) |
| Breakup Rules | No guilt, respectful, leave door open, factual FOMO only, shortest email in sequence, never burn bridges | Fixed |
| Nurture Pattern | Rotate: Industry Insight, Resource Share, Case Study, Thought Leadership, Event Invite, Personal Check-In | Fixed; 6-month cycle |
| Nurture Email Limit | Under 80 words, zero sales pitch, one subtle tie-back max | Fixed |
| Prior Analysis Files | PROSPECT-ANALYSIS.md, COMPANY-RESEARCH.md, LEAD-QUALIFICATION.md, DECISION-MAKERS.md, OUTREACH-SEQUENCE.md | Fixed; auto-incorporate if present |

---

## Variables

| Variable | Source | Runtime |
|----------|--------|---------|
| `prospect_name` | User input or prior analysis files | Per-run |
| `company_name` | User input or prior analysis files | Per-run |
| `interaction_type` | User input: Meeting, Demo, Proposal, Ghost, Nurture | Per-run |
| `last_interaction_date` | User input | Per-run |
| `key_discussion_points` | User input (min 3 specifics) | Per-run |
| `stated_pain_points` | User input or prior analysis files | Per-run |
| `agreed_next_step` | User input | Per-run |
| `prospect_role` | User input (title + seniority) | Per-run |
| `deal_stage` | User input: Early, Active, Near Decision, Stalled | Per-run |
| `prospect_temperature` | User input: Hot, Warm, Cool, Cold | Per-run |
| `product_service` | User input (specific solution discussed) | Per-run |
| `selected_scenario` | Determined by `interaction_type` | Computed |
| `cadence_interval` | Lookup from cadence matrix (temperature x stage) | Computed |
| `send_time` | Lookup from time-of-day table by seniority | Computed |
| `email_sequence` | Generated per scenario rules | Computed |
| `linkedin_actions` | Generated per channel rules | Computed |
| `phone_scripts` | Generated per voicemail constants | Computed |
| `sms_templates` | Generated if warm/hot + opted-in | Computed |

---

## Workflow

### BLOCK 1: Context Collection & Scenario Selection
**Governed by: C&V**

**Constants:** Scenarios (5 types), prior analysis files list, required context fields (10 items)
**Variables:** `prospect_name`, `company_name`, `interaction_type`, `last_interaction_date`, `key_discussion_points`, `stated_pain_points`, `agreed_next_step`, `prospect_role`, `deal_stage`, `prospect_temperature`, `product_service`

**IMO:**
- **Ingress:** User provides prospect identifier; validate all 10 context fields present
- **Middle:**
  - Scan working directory for prior analysis files (PROSPECT-ANALYSIS.md, COMPANY-RESEARCH.md, LEAD-QUALIFICATION.md, DECISION-MAKERS.md, OUTREACH-SEQUENCE.md); auto-incorporate findings
  - If any required context field missing and not in prior files, prompt user
  - Map `interaction_type` to scenario: Meeting->Scenario 1, Demo->Scenario 2, Proposal->Scenario 3, Ghost->Scenario 4, Nurture->Scenario 5
  - Lookup cadence interval from matrix: `temperature` x `deal_stage`
  - Lookup send time from seniority table using `prospect_role`
- **Egress:** All context fields populated; scenario selected; cadence and timing resolved

**Go/No-Go:** Proceed only when all 10 context fields are populated. If prior files fill gaps, proceed without re-asking.

---

### BLOCK 2: Sequence Generation
**Governed by: IMO**

**Constants:** Scenario email counts and structures, email word limit (100), breakup word limit (40-70), Feel-Felt-Found framework, nurture pattern (6 types), nurture limit (80 words)
**Variables:** `selected_scenario`, `email_sequence`, `key_discussion_points`, `stated_pain_points`

**IMO:**
- **Ingress:** Populated context from Block 1 + selected scenario
- **Middle:**
  - **Post-Meeting (3 emails):** Email 1 same-day summary + next steps (80-100w), Email 2 value reinforcement at +3d (60-80w), Email 3 decision nudge at +8d (50-70w)
  - **Post-Demo (4 emails):** Email 1 same-day recap + resources (80-100w), Email 2 address objections via Feel-Felt-Found at +3d (80-100w), Email 3 social proof case study at +8d (70-90w), Email 4 decision timeline at +15d (60-80w)
  - **Post-Proposal (5 emails):** Email 1 delivery + highlight key sections (50-70w), Email 2 walkthrough offer at +2d (50-70w), Email 3 value-add insight with NO proposal mention at +7d (60-80w), Email 4 direct check-in at +12d (40-60w), Email 5 breakup at +22d (50-70w)
  - **Ghost Recovery (3 emails):** Email 1 pattern interrupt at +7d from last unanswered (30-50w), Email 2 new angle/value at +14d (40-60w), Email 3 honest breakup at +28d (40-60w)
  - **Nurture (6 monthly):** Rotate content types per nurture pattern constant; each under 80 words; zero pitch; one tie-back sentence max; low-pressure CTA only
  - Every email must: add NEW value, reference specific conversation points, include ONE clear next step, stay under word limit
  - Subject lines must be specific (never "Just checking in", "Following up", "Bumping this")
- **Egress:** Complete email sequence with subject lines, send timing, and body text

**Go/No-Go:** Proceed if all emails in sequence meet word limits and contain at least one specific prospect reference. Any generic email blocks output.

---

### BLOCK 3: Multi-Channel Assembly
**Governed by: Circle**

**Constants:** Channel rules (LinkedIn offset, phone max 2, SMS warm-only), voicemail limit (75 words/30 sec), SMS rules (2 sentences, no links), time-of-day table, cadence matrix
**Variables:** `linkedin_actions`, `phone_scripts`, `sms_templates`, `cadence_interval`, `send_time`

**IMO:**
- **Ingress:** Email sequence from Block 2 + prospect context
- **Middle:**
  - **LinkedIn:** Before Email 1 view profile (no message); after Email 1 like/comment on recent post (specific, not generic); before Email 2 share relevant article; after Email 3+ short LinkedIn message (2-3 sentences, conversational, no repeat of email)
  - **Phone:** Generate 2 voicemail scripts (after Email 2, before final email); each under 75 words; reference one conversation point; point to companion email; never ask for callback
  - **SMS:** Generate 2-3 templates only if `prospect_temperature` is Hot or Warm AND opted-in; max 2 sentences; no links; must self-identify
  - Build cadence calendar: merge all channels into day-by-day table; enforce no LinkedIn+email same day; apply cadence interval from matrix; apply send time from seniority lookup
- **Egress:** LinkedIn action list, phone scripts, SMS templates, unified cadence calendar

**Go/No-Go:** Proceed if channel rules are satisfied: LinkedIn never same day as email, phone max 2, SMS only for warm/hot. Violation blocks output.

---

### BLOCK 4: Output Assembly
**Governed by: CTB**

**Constants:** Output file name (FOLLOWUP-SEQUENCE.md), output schema (context table, scenario section, emails, phone scripts, SMS, cadence calendar, best practices)
**Variables:** All computed outputs from Blocks 1-3

**IMO:**
- **Ingress:** All sequences, scripts, templates, and calendar from Blocks 1-3
- **Middle:**
  - Assemble FOLLOWUP-SEQUENCE.md with sections: header (prospect, date, scenario, temperature, stage), prospect context table (10 fields), selected scenario with all emails (subject + timing + body + companion actions), phone scripts section, SMS templates section (if applicable), cadence calendar (Day | Channel | Action | Content), best practices applied
  - Validate no `[PLACEHOLDER]` brackets remain in output
  - Validate every email contains at least one prospect-specific reference
  - Validate breakup emails (if present) comply with breakup rules: no guilt, respectful, door open, under word limit
- **Egress:** Write FOLLOWUP-SEQUENCE.md to working directory

**Go/No-Go:** Output is always produced. Any email with `[PLACEHOLDER]` brackets or missing prospect-specific reference must be flagged and revised before write.

---

## Rules

1. **Never** send a "just checking in" or "bumping this" email. Every email must add new value or do not send.
2. **Never** exceed 100 words per email. Breakup emails must stay under 70 words. Nurture emails under 80 words.
3. **Never** include multiple CTAs in one email. One email = one ask.
4. **Never** use manufactured urgency or fake scarcity. Urgency must be factual (timeline, capacity, pricing).
5. **Never** guilt-trip, use passive aggression, or reference email-open tracking. The prospect owes nothing.
6. **Never** send LinkedIn message and email on the same day. Offset by 1-2 days minimum.
7. **Never** exceed 2 phone calls per sequence or 30 seconds per voicemail.
8. **Never** send SMS to cool/cold leads or without opt-in. No links in SMS.
9. **Never** leave `[PLACEHOLDER]` brackets in final output. All personalization must be filled from context.
10. **Never** ignore prior analysis files. If PROSPECT-ANALYSIS.md or similar exists in working directory, incorporate it — do not ask user to repeat available data.

---

## Reference Pointers

| Reference | Location |
|-----------|----------|
| Sales prospect orchestrator | `agents/sales-prospect.md` |
| Opportunity assessment | `agents/sales-opportunity.md` |
| ICP definition | `IDEAL-CUSTOMER-PROFILE.md` (working directory, optional) |
| Prior analysis files | `PROSPECT-ANALYSIS.md`, `COMPANY-RESEARCH.md`, `LEAD-QUALIFICATION.md`, `DECISION-MAKERS.md`, `OUTREACH-SEQUENCE.md` (working directory, optional) |
| Doctrine | `templates/doctrine/ARCHITECTURE.md` (IMO, Hub-Spoke, CTB) |
| Skill creation rules | `skills/skill-creator/SKILL.md` |
