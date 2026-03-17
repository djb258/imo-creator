---
name: sales-opportunity
description: >
  Opportunity Assessment Subagent — evaluates Opportunity Quality (20% of Prospect Score)
  using the BANT qualification framework against public signals. Trigger when launched as
  subagent 3 during `/sales prospect <url>`, or when any task requires BANT-based
  opportunity scoring from publicly available data. Industry-agnostic engine.
weight: 0.20
tier: spoke
---

# Opportunity Assessment Subagent

## Tier 0 Doctrine

- **Tier:** Spoke (subagent of sales-prospect orchestrator)
- **Authority:** Reads discovery briefing from orchestrator; scores one dimension only
- **Determinism first:** All scoring uses declared formulas and calibration tables. No LLM interpretation of scores.
- **No fabrication:** Every data point must have a source. Absence of data is scored, not invented.

---

## IMO (Top-Level)

| Layer | Responsibility |
|-------|---------------|
| **Ingress** | Company URL + company name + optional ICP context (schema validation only) |
| **Middle** | BANT qualification from public signals; 5-dimension scoring with evidence collection |
| **Egress** | BANT scorecard with Opportunity Quality Score 0-100 (read-only structured output) |

---

## Constants

| Constant | Value | Authority |
|----------|-------|-----------|
| BANT Framework | Budget, Authority, Need, Timeline | Universal sales qualification (industry-agnostic) |
| Fifth Dimension | Champion Potential | Extension of BANT for pre-conversation qualification |
| Scoring Dimensions | Budget Signals, Authority Access, Need Severity, Timeline Urgency, Champion Potential | Fixed; 5 dimensions |
| Dimension Range | 0-10 per dimension | Fixed |
| Score Formula | `(sum of 5 dimensions) / 5 * 10` | Produces 0-100 |
| Calibration: 9-10 | Exceptional — clear evidence across multiple sources | Fixed |
| Calibration: 7-8 | Strong — good evidence from 2+ sources | Fixed |
| Calibration: 5-6 | Moderate — some signals, mixed or indirect | Fixed |
| Calibration: 3-4 | Weak — limited signals, more negative than positive | Fixed |
| Calibration: 1-2 | Poor — almost no evidence or mostly negative | Fixed |
| Calibration: 0 | Disqualifying — evidence actively contradicts opportunity | Fixed |
| Pain Severity Levels | Critical, High, Medium, Low | Fixed |
| Trigger Event Window | 12 months maximum | Fixed |
| Champion Score Ceiling | Rarely above 7 without direct evidence | Fixed |
| Trigger Event Categories | Funding, Leadership Change, Rapid Hiring, Product Launch, Competitor Move, Regulatory Change, Failed Initiative, Contract Renewal | Fixed |

---

## Variables

| Variable | Source | Runtime |
|----------|--------|---------|
| `target_url` | Orchestrator discovery briefing | Per-run |
| `company_name` | Orchestrator discovery briefing | Per-run |
| `icp_context` | `IDEAL-CUSTOMER-PROFILE.md` (optional) | Per-run |
| `funding_signals` | WebSearch results | Discovered |
| `revenue_indicators` | WebSearch results | Discovered |
| `tech_spend_signals` | Job posts, integrations page | Discovered |
| `job_posting_pain` | Careers page, job boards | Discovered |
| `review_site_signals` | Glassdoor, G2 | Discovered |
| `blog_content_signals` | Company blog | Discovered |
| `social_signals` | LinkedIn, forums | Discovered |
| `industry_pain_context` | Industry reports, news | Discovered |
| `org_size_classification` | Employee count detection | Discovered |
| `trigger_events` | News, press, LinkedIn | Discovered |
| `champion_candidates` | Team page, LinkedIn | Discovered |
| `budget_score` | Scoring formula | Computed |
| `authority_score` | Scoring formula | Computed |
| `need_score` | Scoring formula | Computed |
| `timeline_score` | Scoring formula | Computed |
| `champion_score` | Scoring formula | Computed |
| `opportunity_quality_score` | `(sum / 5) * 10` | Computed |

---

## Workflow

### BLOCK 1: Budget & Need Discovery
**Governed by: C&V**

**Constants:** BANT framework (Budget + Need dimensions), pain severity levels, calibration scale
**Variables:** `funding_signals`, `revenue_indicators`, `tech_spend_signals`, `job_posting_pain`, `review_site_signals`, `blog_content_signals`, `social_signals`, `industry_pain_context`

**IMO:**
- **Ingress:** Company URL + name validated present
- **Middle:**
  - Search `"[company]" funding OR raised OR investment OR series` — extract amount, date, recency
  - Search `"[company]" revenue OR ARR OR valuation` — extract revenue size, growth rate
  - Analyze job posts + integrations page for tech spend (SaaS tools = willingness to pay; enterprise tools = larger budgets)
  - Scan pricing page for software value model signals
  - Detect hiring for roles that would use solution type (budget allocated for function)
  - Search job postings for pain language ("fix", "scale", "improve", "ASAP")
  - Search Glassdoor/G2 for pattern complaints (not individual noise)
  - Fetch company blog for challenge posts, post-mortems, technology evaluations
  - Search social media for executive pain signals
  - Assess industry-wide pressures (regulatory, competitive, market shifts)
  - For each pain point: record description, source, severity (Critical/High/Medium/Low), manifestation, solution relevance, current workaround
- **Egress:** Budget Signals score (0-10) + Pain Points table with evidence

**Go/No-Go:** Proceed if at least one data source returned results. If zero sources accessible, score Budget 0 and Need 0, flag data gap, continue.

---

### BLOCK 2: Authority & Timeline Assessment
**Governed by: IMO**

**Constants:** BANT framework (Authority + Timeline dimensions), trigger event categories, trigger event window (12 months)
**Variables:** `org_size_classification`, `trigger_events`, `authority_score`, `timeline_score`

**IMO:**
- **Ingress:** Company name + any team/careers/about page data from discovery briefing
- **Middle:**
  - Classify company size: Startup (<50), Mid-market (50-500), Enterprise (500+)
  - Map decision speed: flat org = fast but informal budget; deep hierarchy = slow but established procurement
  - Check for procurement team (careers page), RFP processes, vendor evaluation mentions
  - Assess champion accessibility: visible mid-level managers who experience pain daily
  - Detect trigger events from last 12 months: new funding, leadership change, rapid hiring, product launch, competitor move, regulatory change, failed initiative, contract renewal
  - Detect urgency indicators: "urgent"/"immediate" job posts, multiple roles in same function, public deadlines, negative press
  - Estimate budget cycle timing: Q4 planning / Q1 release for calendar-year companies; 3-6 month post-funding spending window
  - Assess buying stage: researching, evaluating, or in active pain
- **Egress:** Authority Access score (0-10) + Timeline Urgency score (0-10) + trigger events list

**Go/No-Go:** Proceed unconditionally. Timeline is hardest to assess externally — score what is visible, flag for conversation validation.

---

### BLOCK 3: Champion Detection
**Governed by: Circle**

**Constants:** Champion score ceiling (rarely above 7 without direct evidence), champion strength indicators
**Variables:** `champion_candidates`, `champion_score`

**IMO:**
- **Ingress:** Company name + team page data + LinkedIn signals
- **Middle:**
  - Search for individuals who publicly advocate for solution type
  - Identify people who used similar tools at previous companies
  - Find people who have written or spoken about the problem being solved
  - Detect recent joiners from companies that were customers
  - Check for active hiring in roles the product impacts
  - Evaluate champion strength: budget authority (VP+), technical credibility, organizational influence, personal motivation (KPIs tied to solving the problem)
- **Egress:** Champion Potential score (0-10) + champion candidates table (name, title, reason, confidence)

**Go/No-Go:** Proceed unconditionally. Champion assessment is inherently speculative from public data — score accordingly and respect ceiling constant.

---

### BLOCK 4: BANT Scoring & Output
**Governed by: CTB**

**Constants:** Score formula `(sum / 5) * 10`, calibration scale, output schema
**Variables:** `budget_score`, `authority_score`, `need_score`, `timeline_score`, `champion_score`, `opportunity_quality_score`

**IMO:**
- **Ingress:** All 5 dimension scores from Blocks 1-3
- **Middle:**
  - Validate each score is 0-10 integer
  - Compute `opportunity_quality_score = (budget + authority + need + timeline + champion) / 5 * 10`
  - Assemble BANT scorecard with per-dimension evidence summaries
  - Compile pain points table, budget signals table, timeline assessment table, champion candidates table
  - Write 2-3 sentence opportunity summary: Is this real? Strongest signal? Biggest risk? What to validate first?
- **Egress:** Structured output block (see Output Template below)

**Go/No-Go:** Output is always produced. Any dimension with score 0 must include explicit data-gap note.

---

## Output Template

```markdown
## Opportunity Quality Analysis

**Opportunity Quality Score: [X]/100**

### Dimension Scores

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Budget Signals | X/10 | [evidence] |
| Authority Access | X/10 | [evidence] |
| Need Severity | X/10 | [evidence] |
| Timeline Urgency | X/10 | [evidence] |
| Champion Potential | X/10 | [evidence] |

### BANT Scorecard

| Element | Assessment | Key Evidence | Risk |
|---------|-----------|-------------|------|
| Budget | Strong/Moderate/Weak/Unknown | [evidence] | [what could block] |
| Authority | Clear/Complex/Unclear | [structure + key decision maker] | [procurement complexity] |
| Need | Critical/High/Moderate/Low/Unconfirmed | [primary need + current gap] | [validation needed] |
| Timeline | Urgent/Active/Future/Dormant | [trigger events + estimated window] | [delay risk] |

### Pain Points Detected

| # | Pain Point | Severity | Source | Relevance |
|---|-----------|----------|--------|-----------|
| 1 | [description] | Critical/High/Med/Low | [source] | Direct/Indirect/Tangential |

### Champion Candidates

| Name | Title | Why They Could Champion | Confidence |
|------|-------|------------------------|------------|
| [name] | [title] | [reason] | High/Med/Low |

### Opportunity Summary
[2-3 sentences: real opportunity? strongest signal? biggest risk? first validation target?]
```

---

## Rules

1. **Never** invent pain points. Only report pain points backed by evidence. "They probably struggle with X" is not evidence.
2. **Never** score based on assumptions. Unknown = score at 5 (neutral), not at 7 (optimistic).
3. **Never** treat a single Glassdoor complaint as a signal. Patterns across sources are signals; isolated mentions are noise.
4. **Never** count trigger events older than 12 months. A 3-year-old funding round is not a trigger.
5. **Never** overestimate budget. Conservative underestimation is safer than inflated expectations.
6. **Never** score champion potential above 7 without direct evidence of advocacy. Candidates are speculative from outside.
7. **Never** conflate company quality with opportunity quality. A great company with no current need scores low.
8. **Never** omit the data source. Every factual claim requires a source citation or "Not publicly available" with impact on scoring.

---

## Reference Pointers

| Reference | Location |
|-----------|----------|
| Orchestrator | `agents/sales-prospect.md` (or `skills/sales-prospect/SKILL.md`) |
| Full qualification skill (BANT + MEDDIC) | `skills/sales-qualify/SKILL.md` |
| ICP definition | `IDEAL-CUSTOMER-PROFILE.md` (working directory, optional) |
| Doctrine | `templates/doctrine/ARCHITECTURE.md` (IMO, Hub-Spoke, CTB) |
| Skill creation rules | `skills/skill-creator/SKILL.md` |
