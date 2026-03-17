---
name: sales-contacts
description: >
  Decision Maker Intelligence Engine -- identifies the buying committee, maps
  organizational hierarchy, researches personalization anchors, and builds a
  multi-threading engagement strategy. Trigger on `/sales contacts <url>`, or
  when launched as the sales-contacts subagent by sales-prospect. Standalone
  produces DECISION-MAKERS.md; subagent mode returns Contact Access Score 0-100.
  Industry-agnostic engine.
---

# Decision Maker Intelligence

## Tier 0 Doctrine

- **Tier:** Spoke (subagent of sales-prospect, weight 0.20; also standalone via `/sales contacts <url>`)
- **Authority:** Owns buying committee classification, personalization anchor research, contact access scoring, and multi-threading strategy. Does not own company-level research or opportunity qualification.
- **Determinism first:** All scoring uses declared point tables and summation. Buying committee roles are a fixed constant set. Multi-threading sequences use deterministic day-ranges and company-size bands. No LLM interpretation of scores.
- **No fabrication:** Every contact, title, and anchor must trace to a fetched source (team page, LinkedIn search, press page). Absence is scored as 0 points in the relevant sub-dimension, never invented.

---

## IMO (Top-Level)

| Layer | Responsibility |
|-------|---------------|
| **Ingress** | Target URL + optional discovery briefing (schema validation only: URL must be well-formed; briefing, if present, must contain `target_url` and `company_name`; reject if URL is empty) |
| **Middle** | Contact identification (team page, LinkedIn, press); org chart mapping; buying committee role classification; email pattern detection; personalization anchor research and quality rating; Contact Access Score calculation (4 sub-dimensions, 0-25 each); multi-threading strategy generation |
| **Egress** | Standalone: DECISION-MAKERS.md + terminal scorecard (read-only structured output). Subagent: Contact Access Score 0-100 with structured buying committee data (read-only return object) |

---

## Constants

| Constant | Value | Authority |
|----------|-------|-----------|
| Buying committee roles | 6: Economic Buyer, Champion, Technical Evaluator, End User, Blocker, Coach | Universal sales framework (industry-agnostic) |
| Subagent weight | 0.20 | sales-prospect composite formula |
| Score range | 0-100 (4 sub-dimensions, 0-25 each) | Contact Access Score spec |
| Sub-dim 1 | Decision Makers Identified (0-25) | Scoring rubric |
| Sub-dim 2 | Contact Info Accessibility (0-25) | Scoring rubric |
| Sub-dim 3 | Personalization Anchor Quality (0-25) | Scoring rubric |
| Sub-dim 4 | Warm Paths Available (0-25) | Scoring rubric |
| SMB single-decision override | +10 replaces individual role points in sub-dim 1 | Scoring rubric |
| Personalization anchor categories | 6: Recent LinkedIn Activity, Career History, Published Content, Shared Connections, Interests/Hobbies, Recent Trigger Events | Anchor framework |
| Anchor quality ratings | 3-point: Strong, Moderate, Weak | Quality rubric |
| Minimum personalization standard | 1 Strong or 2 Moderate anchors per outreach | Outreach gate |
| Email patterns | 5 known formats | Detection spec |
| Multi-threading size bands | 4 bands by employee count | Engagement framework |
| Multi-threading day sequence | Day 0-1 Champion, Day 2-3 Economic Buyer, Day 5-7 Technical Evaluator, Day 7-10 End Users | Engagement framework |
| Score interpretation bands | 80-100 Excellent, 60-79 Good, 40-59 Moderate, 20-39 Limited, 0-19 Poor | Grade table |
| Bar chart width | 10 characters (Unicode block fill) | Terminal display spec |
| Output file name | DECISION-MAKERS.md | Standalone output spec |

---

## Variables

| Variable | Source | Runtime |
|----------|--------|---------|
| `target_url` | User invocation `/sales contacts <url>` or parent briefing | Per-run |
| `discovery_briefing` | Provided by sales-prospect parent, or null in standalone mode | Per-run |
| `company_name` | Extracted from homepage or briefing | Per-run |
| `employee_count_band` | Detected from team page size, LinkedIn, careers page signals | Per-run |
| `team_page_content` | Raw text from /team, /about/team, /leadership, /people | Per-run |
| `contacts_found[]` | Array of identified persons: name, title, source URL | Per-run |
| `org_chart` | Hierarchical tree of identified contacts | Per-run |
| `email_pattern` | Detected format (e.g., firstname.lastname@domain) or "Unknown" | Per-run |
| `buying_committee[]` | Contacts classified into 6 roles with confidence | Per-run |
| `anchors{}` | Personalization anchors per contact with quality rating | Per-run |
| `contact_access_score` | Computed total 0-100 (sum of 4 sub-dimensions) | Per-run |
| `sub_scores{}` | Individual sub-dimension scores: dm_identified, contact_info, anchor_quality, warm_paths | Per-run |
| `multi_thread_strategy` | Engagement sequence by role and day | Per-run |
| `priority_contacts[]` | Top 3 contacts with full profiles and approach strategies | Per-run |
| `existing_reports{}` | Pre-existing files in cwd (COMPANY-RESEARCH.md, etc.) | Per-run |

---

## Workflow

### BLOCK 1: Contact Identification & Org Chart

**Governed by: C&V**

**Constants:** Buying committee roles (6), email patterns (5 formats), employee count bands (4).

**Variables:** `target_url`, `discovery_briefing`, `company_name`, `team_page_content`, `contacts_found[]`, `org_chart`, `email_pattern`, `employee_count_band`, `existing_reports{}`.

**Ingress:** Receive `target_url` (and optional `discovery_briefing` if subagent mode). Validate: non-empty, well-formed URL. If briefing provided, validate it contains `target_url` and `company_name`. Check cwd for existing COMPANY-RESEARCH.md or LEAD-QUALIFICATION.md to pre-populate contacts.

**Middle:**

1. **Fetch contact-relevant pages** via WebFetch (skip pages already in briefing):

| Page | Common URLs | Data to Extract |
|------|-------------|-----------------|
| Team page | /team, /about/team, /leadership, /people, /our-team | Names, titles, bios, social links |
| About page | /about, /company, /about-us | Founders, leadership mentions, team size |
| Contact page | /contact, /get-in-touch | Individual emails, department contacts |
| Press page | /press, /news, /newsroom | Spokesperson names, quoted executives |
| Board page | /investors, /board, /advisors | Board members, advisors |

2. **LinkedIn research** via WebSearch for key stakeholders: CEO/Founder, CTO/VP Engineering, VP Sales/CRO, VP Marketing/CMO, relevant department heads, directors. For each person capture: full name, title, tenure, previous companies, education, location, headline, recent posts, shared connections.

3. **Map org chart** hierarchically: CEO/Founder at root, C-suite direct reports, directors, individual contributors of interest. Use real names where found; mark unknown-but-likely roles as "[Unknown -- likely exists]". Omit roles unlikely for company size.

4. **Detect email pattern** from contact page, blog author emails, mailto links, press contacts, testimonial signatures. Match against 5 known patterns:

| Pattern | Example | Detection Method |
|---------|---------|-----------------|
| firstname@domain | john@acme.com | Contact page, email signatures |
| firstname.lastname@domain | john.smith@acme.com | Most common mid-size+ |
| firstinitial.lastname@domain | j.smith@acme.com | European, larger orgs |
| firstname.lastinitial@domain | john.s@acme.com | Less common |
| firstinitiallastname@domain | jsmith@acme.com | Tech startups |

5. **Estimate employee count band** from team page size, LinkedIn company page, careers page volume, press mentions.

**Egress:** `contacts_found[]`, `org_chart`, `email_pattern`, `employee_count_band` populated.

**Go/No-Go:** At least 1 contact must be identified by name. If zero contacts found from all sources, log critical gap, recommend manual LinkedIn research, and continue with empty committee (scores will reflect absence). Never halt entirely -- always produce a report.

---

### BLOCK 2: Role Classification & Personalization

**Governed by: IMO**

**Constants:** 6 buying committee roles with definitions and identification criteria, 6 personalization anchor categories, 3-point quality rating (Strong/Moderate/Weak), minimum personalization standard (1 Strong or 2 Moderate).

**Variables:** `contacts_found[]`, `employee_count_band`, `buying_committee[]`, `anchors{}`, `priority_contacts[]`.

**Ingress:** Receive `contacts_found[]` from BLOCK 1. Validate: array exists (may be empty).

**Middle:**

1. **Classify each contact** into buying committee roles:

| Role | Definition | Typical Titles | Identification Signals |
|------|-----------|---------------|----------------------|
| Economic Buyer | Controls budget, final sign-off | CEO, CFO, CRO, VP, GM | Budget authority, "Chief"/"VP"/"GM" in title |
| Champion | Internal advocate who pushes for solution | Manager, Team Lead, Director | Experiences the pain daily, mid-level influence |
| Technical Evaluator | Assesses technical fit, integrations, security | CTO, VP Eng, IT Director, Architect | Technical role with evaluation/veto authority |
| End User | Will use product daily | ICs, analysts, coordinators, specialists | Role aligns with daily use case |
| Blocker | Resists purchase (competing priorities, incumbency) | Any level | Championed current solution, status quo beneficiary |
| Coach | Shares intel on buying process and dynamics | Any level | Existing relationship, responsive to outreach |

2. **Apply company-size rules:** Under 20 employees, CEO often fills Economic Buyer + Champion + Technical Evaluator. Under 50: 2-3 committee members. 50-200: 3-5 members. 200+: 5-8+ members. One person may hold multiple roles.

3. **Research personalization anchors** for top 3-5 contacts across 6 categories: Recent LinkedIn Activity (posts, articles, shares), Career History (previous companies, trajectory, tenure), Published Content (talks, articles, podcasts, media quotes), Shared Connections (mutual contacts, alumni, communities), Interests/Hobbies (volunteer work, side projects), Recent Trigger Events (new role, funding, awards).

4. **Rate each anchor** using quality rubric:

| Rating | Definition |
|--------|-----------|
| Strong | Specific, recent, directly relevant. Can carry an entire email opener. |
| Moderate | Somewhat specific. Requires a bridge to connect to outreach. |
| Weak | Generic or old. Better than nothing but not compelling. |

5. **Select top 3 priority contacts** with full profiles: name, title, buying role, tenure, previous company, LinkedIn, estimated email, best anchors, career background summary, recommended approach, suggested opening message.

**Egress:** `buying_committee[]`, `anchors{}`, `priority_contacts[]` populated.

**Go/No-Go:** Role classification must assign at least one role to every identified contact. If no contacts exist, committee is empty and scoring proceeds with zeros. Anchors below minimum personalization standard are flagged as a limitation.

---

### BLOCK 3: Contact Access Scoring

**Governed by: CTB**

**Constants:** 4 sub-dimensions (0-25 each), point allocation tables, SMB single-decision override (+10), score interpretation bands (5 bands), score formula (sum of 4 sub-dimensions).

**Variables:** `buying_committee[]`, `email_pattern`, `anchors{}`, `contacts_found[]`, `contact_access_score`, `sub_scores{}`.

**Ingress:** Receive `buying_committee[]`, `email_pattern`, `anchors{}` from BLOCKs 1-2. Validate: arrays exist.

**Middle:**

1. **Score Decision Makers Identified (0-25):**

| Criteria | Points |
|----------|--------|
| Economic buyer identified by name | +8 |
| Champion identified by name | +6 |
| Technical evaluator identified by name | +4 |
| 3+ buying committee members found | +4 |
| Full buying committee mapped (all relevant roles) | +3 |
| SMB single-decision maker only (CEO/founder) | +10 (replaces all above) |
| No decision makers found | 0 |

2. **Score Contact Info Accessibility (0-25):**

| Criteria | Points |
|----------|--------|
| Email pattern identified | +8 |
| Direct email found for key contact | +10 |
| LinkedIn profiles found for key contacts | +5 |
| Phone number found | +2 |
| No contact info found | 0 |

3. **Score Personalization Anchor Quality (0-25):**

| Criteria | Points |
|----------|--------|
| Strong anchor found for primary target | +10 |
| Moderate anchors found for 2+ contacts | +8 |
| Recent trigger event for company | +5 |
| Personal trigger event for key contact | +5 |
| Only weak/generic anchors found | +2 |
| No personalization anchors found | 0 |

4. **Score Warm Paths Available (0-25):**

| Criteria | Points |
|----------|--------|
| Mutual connection who can make introduction | +15 |
| Shared community or alumni network | +8 |
| Contact engages with your content/brand | +10 |
| Contact used your product/competitor at prev company | +8 |
| No warm paths identified | 0 |

5. **Calculate total:** `contact_access_score = dm_identified + contact_info + anchor_quality + warm_paths` (cap at 100).

6. **Interpret score:**

| Range | Interpretation |
|-------|---------------|
| 80-100 | Excellent access. Strong hooks and clear path to decision makers. |
| 60-79 | Good access. Key contacts identified with reasonable personalization. |
| 40-59 | Moderate access. Some contacts found, personalization limited. |
| 20-39 | Limited access. Few contacts, creative approaches needed. |
| 0-19 | Poor access. Cannot identify decision makers from public data. |

**Egress:** `contact_access_score`, `sub_scores{}` finalized.

**Go/No-Go:** Score must be computable (all 4 sub-dimensions return integer 0-25). If any sub-dimension computation fails, default that sub-dimension to 0 and note the gap.

---

### BLOCK 4: Report Assembly & Output

**Governed by: Circle**

**Constants:** Output file (DECISION-MAKERS.md), bar chart width (10 chars), Unicode fill character, terminal scorecard layout, multi-threading size bands (4), multi-threading day sequence (4 steps).

**Variables:** All variables from BLOCKs 1-3 assembled into final artifacts.

**Ingress:** Receive all computed values: contacts, org chart, buying committee, anchors, scores, priority contacts. Validate: all required sections have content (even if partial).

**Middle:**

1. **Build multi-threading strategy** based on `employee_count_band`:

| Company Size | Threads | Approach |
|-------------|---------|----------|
| 1-20 employees | 1-2 | Founder/CEO + one other. Keep simple. |
| 21-100 employees | 2-3 | Economic buyer + champion + tech eval. Stagger 2-3 days. |
| 101-500 employees | 3-4 | Economic buyer + champion + tech eval + end user. Different channels each. |
| 500+ employees | 4-6 | Full committee coverage. Different angles per role. Coordinate timing. |

2. **Sequence engagement** using day-range constants: Day 0-1 Champion (most personalized message, establish dialogue), Day 2-3 Economic Buyer (LinkedIn + separate email, strategic/ROI message), Day 5-7 Technical Evaluator (technical content, pre-empt objections), Day 7-10 End Users (resource sharing, bottom-up demand).

3. **Mode fork:**

   **Standalone mode** -- write DECISION-MAKERS.md with sections:
   - Header: company name, URL, date, Contact Access Score, buying committee size, email pattern.
   - Executive Summary: 2-3 paragraphs for sales rep.
   - Buying Committee Map table: Name, Title, Buying Role, Personalization Anchor, Approach Strategy, Priority.
   - Org Chart: text-based hierarchy with buying roles annotated.
   - Top 3 Priority Contacts: full profiles (name, title, role, tenure, prev company, LinkedIn, estimated email, anchors, career background, recommended approach, suggested opener).
   - Multi-Threading Strategy: engagement sequence table (Day, Contact, Channel, Action, Goal) + messaging by role table (Role, Primary Message, Content to Share, CTA).
   - Contact Access Score Breakdown: sub-dimension table with scores and detail.
   - Recommended Outreach Order: numbered list with rationale.

   **Subagent mode** -- return structured object: `contact_access_score` (0-100), `sub_scores{}`, `buying_committee[]`, `priority_contacts[]`, `multi_thread_strategy`, `email_pattern`.

4. **Render terminal scorecard** (both modes):

```
=== DECISION MAKER INTELLIGENCE COMPLETE ===

Company: [name]
Buying Committee Size: [X] contacts identified

Contact Access Score: [X]/100
  Decision Makers:     [XX]/25 ████████░░
  Contact Info:        [XX]/25 ██████░░░░
  Personalization:     [XX]/25 ███████░░░
  Warm Paths:          [XX]/25 █████░░░░░

Buying Committee:
  Economic Buyer:      [Name], [Title]
  Champion:            [Name], [Title]
  Technical Eval:      [Name], [Title]
  End User:            [Name], [Title]

Email Pattern: [pattern]

Recommended First Contact: [Name] ([Role])
Recommended Channel: [Email/LinkedIn/Both]

Full report saved to: DECISION-MAKERS.md
```

5. **Suggest follow-up commands:** `/sales outreach` for full email sequence, `/sales prep` for meeting preparation.

**Egress:** DECISION-MAKERS.md written to cwd (standalone) or structured return object (subagent). Terminal scorecard displayed. No further mutations.

**Go/No-Go:** Standalone: file must be writable; if write fails, display full report in terminal as fallback. Subagent: return object must contain `contact_access_score` as integer 0-100. Terminal output must render without error.

---

## Rules

1. **Never** fabricate contacts -- every name and title must trace to a fetched source URL or search result. Absence is scored as 0, never invented.
2. **Never** hardcode industry verticals in Constants -- industries are Variables detected at runtime. Buying roles are universal Constants.
3. **Never** use LLM judgment to override point tables or score summation -- scoring is mechanical.
4. **Never** CC multiple contacts in the same email thread unless they are already in conversation.
5. **Never** skip personalization anchor research for priority contacts -- every outreach must meet the minimum standard (1 Strong or 2 Moderate anchors).
6. **Never** launch outreach to all contacts simultaneously -- follow the multi-threading day sequence.
7. **Never** produce a report without a Contact Access Score -- every output declares a score with sub-dimension breakdown.
8. **Never** modify the point allocation tables at runtime -- point values are Constants.
9. **Never** halt entirely on zero contacts found -- produce a report documenting the gap with score 0 and recommend manual research.
10. **Never** return partial data in subagent mode without the `contact_access_score` field -- parent orchestrator depends on this value.

---

## Reference Pointers

| Reference | Location |
|-----------|----------|
| Parent orchestrator | `skills/sales-prospect/SKILL.md` |
| Peer: sales-company | `skills/sales-research/SKILL.md` |
| Peer: sales-opportunity | `skills/sales-qualify/SKILL.md` |
| Peer: sales-competitive | `skills/sales-competitors/SKILL.md` |
| Peer: sales-strategy | `skills/sales-outreach/SKILL.md` |
| Output file (standalone) | DECISION-MAKERS.md (structure defined in BLOCK 4 Middle, section 3) |
| Architecture doctrine | `templates/doctrine/ARCHITECTURE.md` |
| Tool doctrine | `templates/integrations/TOOLS.md` |
