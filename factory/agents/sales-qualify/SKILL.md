---
name: sales-qualify
description: >
  Lead Qualification Engine — evaluates a prospect against BANT and MEDDIC
  frameworks using public signals, producing an Opportunity Quality Score 0-100
  with composite weighting (BANT 50%, MEDDIC 30%, Urgency 20%). Trigger via
  `/sales qualify <url>` standalone (outputs LEAD-QUALIFICATION.md) or as
  subagent of sales-prospect (returns score + structured data).
  Industry-agnostic engine.
---

# Lead Qualification Engine

## Tier 0 Doctrine

- **Tier:** Spoke (subagent of sales-prospect orchestrator; also standalone via `/sales qualify <url>`)
- **Authority:** Reads discovery briefing from orchestrator or fetches directly; scores qualification only
- **Determinism first:** All scoring uses declared formulas, rubrics, and calibration tables. No LLM interpretation of scores.
- **No fabrication:** Every data point must have a source and confidence level. Absence of data is scored, not invented.

---

## IMO (Top-Level)

| Layer | Responsibility |
|-------|---------------|
| **Ingress** | Company URL + company name + optional discovery briefing (schema validation only) |
| **Middle** | BANT scoring (4 dimensions, 0-25 each), MEDDIC completeness assessment (6 elements), urgency modifier calculation, composite score computation, grade assignment |
| **Egress** | LEAD-QUALIFICATION.md (standalone) or Opportunity Quality Score 0-100 with structured data (subagent) — read-only output |

---

## Constants

| Constant | Value | Authority |
|----------|-------|-----------|
| Invocation | `/sales qualify <url>` | Skill registry |
| Weight (as subagent) | 0.20 of Prospect Score | sales-prospect orchestrator |
| BANT Framework | Budget, Authority, Need, Timeline | Universal sales qualification (industry-agnostic) |
| BANT Dimension Range | 0-25 per dimension | Fixed |
| BANT Total Range | 0-100 | Sum of 4 dimensions |
| MEDDIC Framework | Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion | Universal sales qualification (industry-agnostic) |
| MEDDIC Element Count | 6 | Fixed |
| MEDDIC Completeness Formula | `(elements_with_medium+_confidence / 6) * 100` | Fixed |
| Composite Score Formula | `BANT * 0.50 + MEDDIC_Completeness * 0.30 + Urgency_Modifier * 0.20` | Fixed; produces 0-100 |
| Urgency Modifier Range | 0-100 | Fixed |
| Urgency: Active Buying | 80-100 — active buying process or major trigger in last 30 days | Fixed |
| Urgency: Recent Trigger | 60-79 — recent trigger event (last 90 days) or strong urgency signals | Fixed |
| Urgency: Moderate | 40-59 — industry trends, gradual pain escalation | Fixed |
| Urgency: Low | 20-39 — nice-to-have, future planning | Fixed |
| Urgency: None | 0-19 — no urgency detected | Fixed |
| Grade A (SQL) | 75-100 — Sales Qualified Lead | Fixed |
| Grade B (MQL) | 50-74 — Marketing Qualified Lead | Fixed |
| Grade C (IQL) | 25-49 — Information Qualified Lead | Fixed |
| Grade D (Unqualified) | 0-24 — Unqualified | Fixed |
| Confidence Levels | High (directly stated), Medium (reasonable inference), Low (indirect signal), Inferred (educated guess) | Fixed |
| Signal Strength | Strong, Moderate, Weak, Absent | Fixed |
| Dual Mode | Standalone = LEAD-QUALIFICATION.md; Subagent = Opportunity Quality Score 0-100 | Fixed |
| Data Source Types | Pricing page, Careers page, Job postings, Blog/Resources, Case studies, About page, Review sites, Glassdoor, LinkedIn, News/Press, Social media, Competitor mentions | Fixed; 12 source types |

---

## Variables

| Variable | Source | Runtime |
|----------|--------|---------|
| `target_url` | User input or orchestrator briefing | Per-run |
| `company_name` | Detected from URL or orchestrator briefing | Per-run |
| `discovery_briefing` | Orchestrator (subagent mode) or self-fetched (standalone) | Per-run |
| `industry_vertical` | Detected from company content | Discovered |
| `employee_count` | About page, LinkedIn, careers page | Discovered |
| `funding_signals` | WebSearch, press releases, Crunchbase | Discovered |
| `pricing_page_signals` | Pricing page content | Discovered |
| `tech_stack_signals` | Job posts, integrations page | Discovered |
| `job_posting_signals` | Careers page, job boards | Discovered |
| `blog_content_signals` | Company blog | Discovered |
| `review_site_signals` | G2, Capterra, Glassdoor | Discovered |
| `social_media_signals` | LinkedIn, company social accounts | Discovered |
| `news_press_signals` | News articles, press releases | Discovered |
| `competitor_mentions` | Job posts, website content | Discovered |
| `leadership_data` | Team page, LinkedIn | Discovered |
| `org_structure` | Team page, LinkedIn, careers page | Discovered |
| `budget_score` | BANT rubric | Computed (0-25) |
| `authority_score` | BANT rubric | Computed (0-25) |
| `need_score` | BANT rubric | Computed (0-25) |
| `timeline_score` | BANT rubric | Computed (0-25) |
| `bant_total` | Sum of 4 dimensions | Computed (0-100) |
| `meddic_completeness` | Completeness formula | Computed (0-100%) |
| `urgency_modifier` | Urgency rubric | Computed (0-100) |
| `opportunity_quality_score` | Composite formula | Computed (0-100) |
| `lead_grade` | Grade band lookup | Computed (A/B/C/D) |

---

## Workflow

### BLOCK 1: Signal Collection & BANT Scoring
**Governed by: C&V**

**Constants:** BANT framework (4 dimensions), dimension range (0-25 each), confidence levels, signal strength, 12 data source types
**Variables:** `target_url`, `company_name`, `discovery_briefing`, `pricing_page_signals`, `funding_signals`, `tech_stack_signals`, `job_posting_signals`, `blog_content_signals`, `review_site_signals`, `leadership_data`, `org_structure`, `news_press_signals`, `social_media_signals`, `competitor_mentions`, `budget_score`, `authority_score`, `need_score`, `timeline_score`, `bant_total`

**IMO:**
- **Ingress:** URL + company name validated present. If discovery briefing exists (subagent mode), validate schema; use pre-fetched content to skip redundant fetches. If standalone, validate URL is reachable.
- **Middle:**
  - **Budget (0-25):** Search for funding rounds (Series A: +12, B: +16, C+: +20). Check pricing page for enterprise tier signals (+10-15). Scan job posts for paid tool requirements (+8-12). Detect employee count for budget proxy (50+: +5-10). Flag cost-cutting or layoff signals (cap at 0-5). Score using rubric: 20-25 strong, 15-19 good, 10-14 moderate, 5-9 weak, 0-4 poor.
  - **Authority (0-25):** Check team/leadership page for C-suite and VP titles. Search LinkedIn for decision-making roles. Map org structure: flat org/owner-operator (+15-20), clear hierarchy (+10-15), complex enterprise (+3-8). Identify economic buyer by name if possible (+20-25). Score using rubric: 20-25 clear path, 15-19 likely mapped, 10-14 partial, 5-9 limited, 0-4 invisible.
  - **Need (0-25):** Search blog, news, social for explicit pain points (+20-25). Scan job postings for roles that solve the problem (+15-20). Check review sites for current-solution dissatisfaction (+12-18). Detect competitor product mentions in job posts (+10-15). Assess industry-wide pain applicability (+5-10). Score using rubric: 20-25 validated, 15-19 strong, 10-14 moderate, 5-9 weak, 0-4 none.
  - **Timeline (0-25):** Detect active RFP or vendor evaluation (+22-25). Find active hiring for relevant roles (+15-20). Identify recent trigger events: funding, leadership change, expansion (+12-18). Assess budget cycle alignment (+8-12). Detect competitor dissatisfaction recency (+8-12). Score using rubric: 20-25 active buying, 15-19 within 1-3 months, 10-14 within 3-6 months, 5-9 within 6-12 months, 0-4 no urgency.
  - For every signal: record evidence quote or paraphrase, source URL, confidence level (High/Medium/Low/Inferred), signal strength (Strong/Moderate/Weak/Absent).
  - Compute `bant_total = budget_score + authority_score + need_score + timeline_score`.
- **Egress:** Four dimension scores (0-25 each) with evidence tables. BANT total (0-100).

**Go/No-Go:** Proceed if URL is reachable and at least one data source returned results. If zero sources accessible after alternate URL attempts, report error and halt (standalone) or return score 0 with data-gap flag (subagent).

---

### BLOCK 2: MEDDIC Assessment
**Governed by: IMO**

**Constants:** MEDDIC framework (6 elements), confidence levels, completeness formula
**Variables:** `leadership_data`, `org_structure`, `job_posting_signals`, `blog_content_signals`, `review_site_signals`, `social_media_signals`, `competitor_mentions`, `meddic_completeness`

**IMO:**
- **Ingress:** All signal data collected in Block 1 + any additional team/leadership page content
- **Middle:**
  - **Metrics:** Check homepage for metric claims. Read case studies for highlighted KPIs. Review job posts for OKR/KPI mentions. Identify 3-5 primary metrics they likely care about. Assign confidence.
  - **Economic Buyer:** Cross-reference leadership data from Block 1. For SMBs: founder/CEO. For mid-market: VP/Director. For enterprise: identify multiple approvers. Record name, title, evidence.
  - **Decision Criteria:** Check for published evaluation criteria (RFPs, vendor requirements). Analyze tech stack patterns (best-of-breed vs suite). Review their tool reviews for valued attributes. Rank likely criteria.
  - **Decision Process:** Assess by company size: smaller = faster/simpler, larger = committees/procurement. Check for procurement portals, compliance requirements (SOC2, GDPR, HIPAA). Estimate buying process type (self-serve, single DM, committee, formal procurement).
  - **Identify Pain:** Compile all pain points from Block 1 signal collection. For each: description, evidence, severity (Critical/High/Medium/Low), solution relevance, current workaround.
  - **Champion:** Search for mid-level managers who experience pain daily. Find people who used similar tools at previous companies. Identify people who post about the relevant problem space. Detect recent joiners in relevant roles.
  - Compute `meddic_completeness = (elements_with_medium_or_higher_confidence / 6) * 100`.
- **Egress:** MEDDIC assessment table (6 elements with finding, evidence, confidence) + completeness percentage

**Go/No-Go:** Proceed unconditionally. MEDDIC is inherently harder to complete from public data. Low completeness is a valid output that informs the lead grade.

---

### BLOCK 3: Urgency & Composite Scoring
**Governed by: CTB**

**Constants:** Urgency modifier scale (0-100), composite formula (`BANT*0.50 + MEDDIC*0.30 + Urgency*0.20`), grade bands (A/B/C/D)
**Variables:** `bant_total`, `meddic_completeness`, `trigger_events`, `urgency_modifier`, `opportunity_quality_score`, `lead_grade`

**IMO:**
- **Ingress:** BANT total from Block 1 + MEDDIC completeness from Block 2 + trigger events detected
- **Middle:**
  - Evaluate urgency modifier: active buying process or trigger in last 30 days (80-100), trigger in last 90 days (60-79), moderate industry trends (40-59), low/future planning (20-39), no urgency (0-19).
  - Compute `opportunity_quality_score = (bant_total * 0.50) + (meddic_completeness * 0.30) + (urgency_modifier * 0.20)`.
  - Assign grade: A (75-100 SQL), B (50-74 MQL), C (25-49 IQL), D (0-24 Unqualified).
  - Compile buying signals summary: all positive signals with source, strength, relevance.
  - Compile red flags summary: all concerns with source, severity, mitigation.
  - Determine recommended approach: A = direct executive outreach, 2-4 week cycle; B = educational outreach, 1-3 month cycle; C = content nurture, 3-6 month warming; D = marketing awareness only, no sales rep time.
- **Egress:** Opportunity Quality Score (0-100) + lead grade + composite breakdown table + buying signals + red flags + recommended approach

**Go/No-Go:** Output is always produced. Scores of 0 in any component must include explicit data-gap note.

---

### BLOCK 4: Report Generation & Delivery
**Governed by: Circle**

**Constants:** Dual mode (standalone vs subagent), output schema, terminal display format
**Variables:** All computed scores, all evidence tables, `lead_grade`, `opportunity_quality_score`

**IMO:**
- **Ingress:** All scores, evidence, and assessments from Blocks 1-3
- **Middle:**
  - **If standalone mode:** Write LEAD-QUALIFICATION.md with: Qualification Snapshot table, BANT Scorecard (summary table + 4 deep-dive sections: Budget Analysis, Authority Analysis, Need Analysis, Timeline Analysis), MEDDIC Assessment (summary table + 6 deep-dive sections: Metrics, Economic Buyer, Decision Criteria, Decision Process, Pain Point Analysis, Champion Strategy), Buying Signals list, Red Flags list, Opportunity Quality Score composite table, Recommended Approach (strategy paragraph per grade), Next Steps (5 prioritized actions).
  - **If subagent mode:** Return structured data block: Opportunity Quality Score 0-100, BANT scorecard, MEDDIC assessment, buying signals, red flags, recommended approach.
  - **Terminal output (both modes):** Display condensed summary with Unicode bar charts for BANT dimensions (10 chars wide, filled/empty blocks), MEDDIC element status (Found/Partial/Missing), composite score, grade, top buying signals, red flags, recommended action.
  - Cross-skill integration: if `COMPANY-RESEARCH.md` exists, use for pre-population. If `DECISION-MAKERS.md` exists, use for Authority and Champion. If `COMPETITIVE-INTEL.md` exists, use for current-solution analysis. Suggest follow-ups: `/sales contacts`, `/sales outreach`.
- **Egress:** Written file (standalone) or structured return (subagent) + terminal display

**Go/No-Go:** File must be written (standalone) or data returned (subagent) before skill completes. If BANT < 25 and all confidence levels are Low/Inferred, add recommendation for manual research before any outreach.

---

## Rules

1. **Never** invent evidence. If a signal is not found, record "Not publicly available" and score accordingly.
2. **Never** score optimistically. Unknown dimensions receive conservative scores, not hopeful ones.
3. **Never** treat a single review or post as a pattern. Patterns require 2+ sources.
4. **Never** count trigger events older than 12 months. Stale triggers are not urgency signals.
5. **Never** fabricate MEDDIC elements. Low completeness is an honest and valid result.
6. **Never** overstate confidence. High confidence requires directly stated or clearly observable evidence.
7. **Never** skip the composite formula. All three components (BANT, MEDDIC, Urgency) must be computed and weighted.
8. **Never** omit the data source. Every factual claim requires a source citation.
9. **Never** hardcode industry names into scoring logic. Frameworks are universal; industries are runtime variables.
10. **Never** modify scores after computation to "feel right." The formula output is the score.

---

## Reference Pointers

| Reference | Location |
|-----------|----------|
| Orchestrator | `skills/sales-prospect/SKILL.md` |
| Subagent spec | `agents/sales-opportunity.md` |
| ICP definition | `IDEAL-CUSTOMER-PROFILE.md` (working directory, optional) |
| Company research | `skills/sales-research/SKILL.md` |
| Contact intelligence | `skills/sales-contacts/SKILL.md` |
| Competitive analysis | `skills/sales-competitors/SKILL.md` |
| Outreach strategy | `skills/sales-outreach/SKILL.md` |
| Doctrine | `templates/doctrine/ARCHITECTURE.md` (IMO, Hub-Spoke, CTB) |
| Skill creation rules | `skills/skill-creator/SKILL.md` |
