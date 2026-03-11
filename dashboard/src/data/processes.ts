import type { Process } from './types';

export const processes: Process[] = [
  // ── LCS — Full end-to-end pipeline: capture through lifecycle communication ──
  {
    id: 'PROC-LCS',
    name: 'Lifecycle Communication Spine',
    shortName: 'LCS',
    description: 'End-to-end pipeline: company intake through identity minting, sub-hub activation, signal collection, intelligence assembly, frame matching, and multi-channel delivery (Mailgun, HeyReach, Sales Handoff).',
    status: 'IN_PROGRESS',
    docs: [
      { file: 'PROCESS.md', status: 'MISSING', template: 'templates/processes/PROCESS.md' },
      { file: 'docs/prd/PRD-LCS.md', status: 'PRESENT', repo: 'company-lifecycle-cl' },
      { file: 'doctrine/OSAM.md', status: 'PRESENT', repo: 'barton-outreach-core' },
      { file: 'ERD.md', status: 'MISSING', template: 'templates/processes/ERD.md' },
      { file: 'docs/lcs/DEPLOY_CHECKLIST.md', status: 'PRESENT', repo: 'company-lifecycle-cl' },
    ],
    heir: {
      repos: ['company-lifecycle-cl', 'barton-outreach-core', 'client'],
      subHubs: ['CL-INTAKE', 'CL-LCS', 'company_target', 'dol', 'people', 'blog', 'bit'],
      tools: ['Hunter', 'Clay', 'Apollo'],
      services: ['CF D1/KV (working)', 'Neon (vault)', 'Doppler', 'Mailgun', 'HeyReach', 'Calendly'],
      skills: ['/bootstrap', '/feature-dev', '/process-creator'],
    },
    imo: {
      ingress: {
        trigger: 'Source adapter loads company candidates into cl.company_candidate',
        schema: 'cl.company_candidate (staging_id, source_company_id, source_system, company_name, company_domain, eligibility_status)',
      },
      middle: {
        steps: [
          'Verify candidate via verifyCandidate()',
          'Mint sovereign_company_id in cl.company_identity',
          'Bridge mapping: cl.company_identity_bridge',
          'Activate outreach sub-hub (mint outreach_id)',
          'Waterfall: CT → DOL → People → Blog enrichment',
          'Signal queue ingress from sub-hubs',
          'Intelligence assembly via v_company_intelligence',
          'Frame matching by signal + intelligence tier',
          'Adapter delivery (MG/HR/SH)',
        ],
        decisions: [
          'Candidate eligibility (ELIGIBLE/PARTIAL/INELIGIBLE)',
          'Intelligence tier (1-5) determines frame selection',
          'BIT authorization band gates outreach intensity',
          'ORBT 3-strike protocol on delivery failure',
          'Lifecycle promotion (OUTREACH→SALES→CLIENT)',
        ],
        stateTables: ['cl.company_candidate', 'cl.company_identity', 'cl.company_identity_bridge', 'lcs.signal_queue', 'lcs.event'],
      },
      egress: {
        outputs: ['lcs.event (Canonical Event Table)', 'v_company_lifecycle_status view', 'v_company_promotable view'],
        consumers: ['barton-outreach-core', 'sales', 'client'],
      },
    },
    erd: {
      tables: [
        { table: 'cl.company_candidate', repo: 'company-lifecycle-cl', access: 'WRITE', order: 1 },
        { table: 'cl.company_identity', repo: 'company-lifecycle-cl', access: 'READ/WRITE', order: 2 },
        { table: 'cl.company_identity_bridge', repo: 'company-lifecycle-cl', access: 'WRITE', order: 3 },
        { table: 'outreach.outreach', repo: 'barton-outreach-core', access: 'WRITE', order: 4 },
        { table: 'outreach.company_target', repo: 'barton-outreach-core', access: 'READ/WRITE', order: 5 },
        { table: 'lcs.signal_queue', repo: 'company-lifecycle-cl', access: 'READ/WRITE', order: 6 },
        { table: 'lcs.event', repo: 'company-lifecycle-cl', access: 'WRITE', order: 7 },
        { table: 'lcs.err0', repo: 'company-lifecycle-cl', access: 'WRITE', order: 8 },
      ],
    },
    orbt: {
      mode: 'BUILD',
      health: 'YELLOW',
      notes: 'LCS v2.2.0 active — signal queue + frame registry wired, adapter delivery in integration testing',
    },
    ctb: {
      canonicalTables: ['cl.company_identity', 'lcs.event', 'outreach.outreach'],
      errorTables: ['cl.company_lifecycle_error', 'lcs.err0'],
      promotionPath: ['SOURCE', 'STAGING', 'CANONICAL'],
    },
  },

  // ── Talent Flow — Executive movement detection via people sub-hub ──
  {
    id: 'PROC-TALENT-FLOW',
    name: 'Talent Flow',
    shortName: 'TF',
    description: 'Detects executive movement — someone left a company, someone joined. Reads people sub-hub slots, compares LinkedIn snapshots over time, emits BIT signals (+10 JOINED, -5 LEFT).',
    status: 'PLANNED',
    docs: [
      { file: 'PROCESS.md', status: 'MISSING', template: 'templates/processes/PROCESS.md' },
      { file: 'PRD.md', status: 'MISSING', template: 'templates/prd/PRD_HUB.md' },
      { file: 'OSAM.md', status: 'MISSING', template: 'templates/semantic/OSAM.md' },
      { file: 'ERD.md', status: 'MISSING', template: 'templates/processes/ERD.md' },
      { file: 'ORBT.md', status: 'MISSING', template: 'templates/processes/ORBT.md' },
    ],
    heir: {
      repos: ['barton-outreach-core'],
      subHubs: ['people', 'company_target', 'bit'],
      tools: ['Hunter', 'Clay'],
      services: ['CF D1/KV (working)', 'Neon (vault)', 'Doppler'],
      skills: ['/feature-dev'],
    },
    imo: {
      ingress: {
        trigger: 'Scheduled scan of people.company_slot for slot state changes',
        schema: 'people.company_slot (outreach_id, slot_type, is_filled, person_id)',
      },
      middle: {
        steps: [
          'Snapshot current slot state per company',
          'Compare against previous snapshot',
          'Detect JOINED events (slot was empty, now filled)',
          'Detect LEFT events (slot was filled, now empty or different person)',
          'Validate movement against people.people_master records',
          'Emit BIT signals: EXECUTIVE_JOINED (+10), EXECUTIVE_LEFT (-5)',
        ],
        decisions: [
          'Slot change threshold (genuine movement vs data correction)',
          'Signal confidence: verified email vs unverified',
          'Movement type classification (lateral, departure, new hire)',
        ],
        stateTables: ['people.company_slot', 'people.people_master'],
      },
      egress: {
        outputs: ['BIT signal events (EXECUTIVE_JOINED, EXECUTIVE_LEFT)', 'outreach.bit_scores update'],
        consumers: ['BIT Scoring process', 'LCS signal queue'],
      },
    },
    erd: {
      tables: [
        { table: 'people.company_slot', repo: 'barton-outreach-core', access: 'READ', order: 1 },
        { table: 'people.people_master', repo: 'barton-outreach-core', access: 'READ', order: 2 },
        { table: 'outreach.company_target', repo: 'barton-outreach-core', access: 'READ', order: 3 },
        { table: 'outreach.bit_scores', repo: 'barton-outreach-core', access: 'WRITE', order: 4 },
      ],
    },
    orbt: {
      mode: 'BUILD',
      health: 'YELLOW',
      notes: 'People sub-hub slots exist (285k slots, 62.4% filled) — movement detection logic not yet built',
    },
    ctb: {
      canonicalTables: ['people.company_slot', 'people.people_master'],
      errorTables: ['people.people_errors'],
      promotionPath: ['VENDOR', 'STAGING', 'CANONICAL'],
    },
  },

  // ── Blog Signal Detection — Content changes via blog sub-hub ──
  {
    id: 'PROC-BLOG-SIGNAL',
    name: 'Blog Signal Detection',
    shortName: 'BSD',
    description: 'Monitors blog sub-hub for content changes — funding events, acquisitions, leadership announcements, news. Emits high-value BIT signals (FUNDING_EVENT +15, ACQUISITION +12).',
    status: 'PLANNED',
    docs: [
      { file: 'PROCESS.md', status: 'MISSING', template: 'templates/processes/PROCESS.md' },
      { file: 'PRD.md', status: 'MISSING', template: 'templates/prd/PRD_HUB.md' },
      { file: 'OSAM.md', status: 'MISSING', template: 'templates/semantic/OSAM.md' },
      { file: 'ERD.md', status: 'MISSING', template: 'templates/processes/ERD.md' },
      { file: 'ORBT.md', status: 'MISSING', template: 'templates/processes/ORBT.md' },
    ],
    heir: {
      repos: ['barton-outreach-core'],
      subHubs: ['blog', 'company_target', 'bit'],
      tools: ['ScraperAPI'],
      services: ['CF D1/KV (working)', 'Neon (vault)', 'Doppler'],
      skills: ['/feature-dev'],
    },
    imo: {
      ingress: {
        trigger: 'New or updated records in outreach.blog + vendor.blog URL staging',
        schema: 'outreach.blog (outreach_id, content fields) + vendor.blog (289k URLs)',
      },
      middle: {
        steps: [
          'Scan vendor.blog for new/changed URLs',
          'Fetch content via ScraperAPI',
          'Classify content signals (funding, acquisition, leadership change, news)',
          'Match to outreach.company_target via outreach_id',
          'Emit BIT signals: FUNDING_EVENT (+15), ACQUISITION (+12)',
          'Update outreach.blog canonical with signal metadata',
        ],
        decisions: [
          'Content classification confidence threshold',
          'Signal freshness window (weekly velocity)',
          'Duplicate content detection',
        ],
        stateTables: ['vendor.blog', 'outreach.blog'],
      },
      egress: {
        outputs: ['BIT signal events (FUNDING_EVENT, ACQUISITION)', 'outreach.bit_scores update', 'lcs.signal_queue BLOG_TRIGGER'],
        consumers: ['BIT Scoring process', 'LCS signal queue'],
      },
    },
    erd: {
      tables: [
        { table: 'vendor.blog', repo: 'barton-outreach-core', access: 'READ/WRITE', order: 1 },
        { table: 'outreach.blog', repo: 'barton-outreach-core', access: 'READ/WRITE', order: 2 },
        { table: 'outreach.blog_ingress_control', repo: 'barton-outreach-core', access: 'READ', order: 3 },
        { table: 'outreach.company_target', repo: 'barton-outreach-core', access: 'READ', order: 4 },
        { table: 'outreach.bit_scores', repo: 'barton-outreach-core', access: 'WRITE', order: 5 },
      ],
    },
    orbt: {
      mode: 'BUILD',
      health: 'YELLOW',
      notes: 'Blog canonical has 95k records, vendor.blog has 289k URLs staged — signal classification not yet built',
    },
    ctb: {
      canonicalTables: ['outreach.blog'],
      errorTables: ['outreach.blog_errors'],
      promotionPath: ['VENDOR', 'STAGING', 'CANONICAL'],
    },
  },

  // ── DOL Enrichment — Filing data match via dol sub-hub ──
  {
    id: 'PROC-DOL-ENRICH',
    name: 'DOL Enrichment',
    shortName: 'DOL',
    description: 'EIN resolution and Form 5500 + Schedule A filing data enrichment. Matches companies to DOL filings, extracts funding type, carrier, broker, renewal month. Feeds STRUCTURAL_PRESSURE signals to BIT.',
    status: 'ACTIVE',
    docs: [
      { file: 'PROCESS.md', status: 'MISSING', template: 'templates/processes/PROCESS.md' },
      { file: 'hubs/dol-filings/PRD.md', status: 'PRESENT', repo: 'barton-outreach-core' },
      { file: 'doctrine/OSAM.md', status: 'PRESENT', repo: 'barton-outreach-core' },
      { file: 'hubs/dol-filings/SCHEMA.md', status: 'PRESENT', repo: 'barton-outreach-core' },
      { file: 'hubs/dol-filings/pipeline.md', status: 'PRESENT', repo: 'barton-outreach-core' },
    ],
    heir: {
      repos: ['barton-outreach-core'],
      subHubs: ['dol', 'company_target', 'bit'],
      services: ['CF D1/KV (working)', 'Neon (vault)', 'Doppler'],
      skills: ['/code-review'],
    },
    imo: {
      ingress: {
        trigger: 'Company present in outreach.company_target with outreach_id',
        schema: 'dol.form_5500 (11M+ rows, 2023-2025), dol.ein_urls, dol.schedule_a, dol.renewal_calendar',
      },
      middle: {
        steps: [
          'Resolve EIN from company domain via dol.ein_urls',
          'Match EIN to Form 5500 filings',
          'Extract funding_type (pension_only / fully_insured / self_funded)',
          'Extract carrier from Schedule A health records',
          'Extract broker_or_advisor from Schedule C code 28',
          'Calculate renewal_month and outreach_start_month',
          'Write enrichment columns to outreach.dol',
        ],
        decisions: [
          'EIN match confidence (domain-to-EIN resolution)',
          'Filing recency (prefer most recent plan year)',
          'Carrier extraction from Schedule A vs C',
        ],
        stateTables: ['outreach.dol', 'outreach.company_target'],
      },
      egress: {
        outputs: ['outreach.dol enrichment columns (ein, filing_present, funding_type, carrier, broker, renewal_month)', 'BIT STRUCTURAL_PRESSURE signals'],
        consumers: ['BIT Scoring process', 'LCS signal queue (RENEWAL_PROXIMITY, PLAN_CHANGE)'],
      },
    },
    erd: {
      tables: [
        { table: 'dol.form_5500', repo: 'barton-outreach-core', access: 'READ', order: 1 },
        { table: 'dol.ein_urls', repo: 'barton-outreach-core', access: 'READ', order: 2 },
        { table: 'dol.schedule_a', repo: 'barton-outreach-core', access: 'READ', order: 3 },
        { table: 'dol.renewal_calendar', repo: 'barton-outreach-core', access: 'READ', order: 4 },
        { table: 'outreach.dol', repo: 'barton-outreach-core', access: 'WRITE', order: 5 },
        { table: 'outreach.bit_scores', repo: 'barton-outreach-core', access: 'WRITE', order: 6 },
      ],
    },
    orbt: {
      mode: 'OPERATE',
      health: 'GREEN',
      notes: '70,150 DOL records enriched (100% EIN, 92% filing_present, 100% funding_type, 100% renewal_month)',
    },
    ctb: {
      canonicalTables: ['outreach.dol'],
      errorTables: ['outreach.dol_errors'],
      promotionPath: ['RAW (dol.*)', 'BRIDGE', 'CANONICAL (outreach.dol)'],
    },
  },

  // ── People Enrichment — Contact slot filling via people sub-hub ──
  {
    id: 'PROC-PEOPLE-ENRICH',
    name: 'People Enrichment',
    shortName: 'PE',
    description: 'Contact slot filling pipeline: CEO/CFO/HR slot assignment, email generation, verification waterfall. Feeds DECISION_SURFACE signals to BIT. 285k slots, 62.4% filled.',
    status: 'ACTIVE',
    docs: [
      { file: 'PROCESS.md', status: 'MISSING', template: 'templates/processes/PROCESS.md' },
      { file: 'hubs/people-intelligence/PRD.md', status: 'PRESENT', repo: 'barton-outreach-core' },
      { file: 'doctrine/OSAM.md', status: 'PRESENT', repo: 'barton-outreach-core' },
      { file: 'hubs/people-intelligence/SCHEMA.md', status: 'PRESENT', repo: 'barton-outreach-core' },
      { file: 'hubs/people-intelligence/pipeline.md', status: 'PRESENT', repo: 'barton-outreach-core' },
    ],
    heir: {
      repos: ['barton-outreach-core'],
      subHubs: ['people', 'company_target', 'bit'],
      tools: ['Hunter', 'Clay', 'Apollo'],
      services: ['CF D1/KV (working)', 'Neon (vault)', 'Doppler'],
      skills: ['/code-review'],
    },
    imo: {
      ingress: {
        trigger: 'Company present in outreach.company_target — people pipeline phases 5-8 execute after company phases 1-4',
        schema: 'vendor.people (Hunter contacts, scrapers) → people.company_slot + people.people_master',
      },
      middle: {
        steps: [
          'Phase 5: Email generation from domain + name',
          'Phase 6: Slot assignment (CEO/CFO/HR via title_slot_mapping)',
          'Phase 7: Enrichment queue (Hunter CSV, Clay, Apollo imports)',
          'Phase 8: Output writer (people_master + slot linking)',
          'Verification Agent: promote verified emails to CT, derive pattern',
          'Verification Gate: flip email_pattern_status GUESS→FACT',
          'Bounce Downgrade: hard bounce resets to GUESS',
        ],
        decisions: [
          'Slot type detection from job title keywords',
          'Email verification status (verified vs unverified)',
          'outreach_ready flag (safe to send)',
          'Enrichment source priority (Hunter > Clay > Apollo)',
        ],
        stateTables: ['people.company_slot', 'people.people_master', 'people.slot_ingress_control'],
      },
      egress: {
        outputs: ['people.company_slot (285k slots)', 'people.people_master (183k contacts)', 'BIT DECISION_SURFACE signals (SLOT_FILLED +10, EMAIL_VERIFIED +3)'],
        consumers: ['BIT Scoring process', 'LCS signal queue (GROWTH_SIGNAL)', 'Talent Flow process'],
      },
    },
    erd: {
      tables: [
        { table: 'vendor.people', repo: 'barton-outreach-core', access: 'READ/WRITE', order: 1 },
        { table: 'people.slot_ingress_control', repo: 'barton-outreach-core', access: 'READ', order: 2 },
        { table: 'people.title_slot_mapping', repo: 'barton-outreach-core', access: 'READ', order: 3 },
        { table: 'people.company_slot', repo: 'barton-outreach-core', access: 'READ/WRITE', order: 4 },
        { table: 'people.people_master', repo: 'barton-outreach-core', access: 'READ/WRITE', order: 5 },
        { table: 'outreach.bit_scores', repo: 'barton-outreach-core', access: 'WRITE', order: 6 },
      ],
    },
    orbt: {
      mode: 'OPERATE',
      health: 'GREEN',
      notes: '182,946 people records, 285,012 slots (62.4% filled = 177,757), verification agent chain v1.3 active',
    },
    ctb: {
      canonicalTables: ['people.company_slot', 'people.people_master'],
      errorTables: ['people.people_errors'],
      promotionPath: ['VENDOR', 'STAGING', 'CANONICAL'],
    },
  },

  // ── BIT Scoring — Authorization band aggregation across all sub-hubs ──
  {
    id: 'PROC-BIT-SCORING',
    name: 'BIT Scoring',
    shortName: 'BIT',
    description: 'Buyer Intent Tracker — aggregates signals from all sub-hubs into authorization bands (0-5). Three domains: STRUCTURAL_PRESSURE (DOL), DECISION_SURFACE (People), NARRATIVE_VOLATILITY (Blog). Band determines permitted outreach intensity.',
    status: 'ACTIVE',
    docs: [
      { file: 'PROCESS.md', status: 'MISSING', template: 'templates/processes/PROCESS.md' },
      { file: 'hubs/company-target/PRD.md', status: 'PRESENT', repo: 'barton-outreach-core' },
      { file: 'doctrine/OSAM.md', status: 'PRESENT', repo: 'barton-outreach-core' },
      { file: 'hubs/company-target/SCHEMA.md', status: 'PRESENT', repo: 'barton-outreach-core' },
      { file: 'hubs/company-target/pipeline.md', status: 'PRESENT', repo: 'barton-outreach-core' },
    ],
    heir: {
      repos: ['barton-outreach-core'],
      subHubs: ['bit', 'people', 'dol', 'blog', 'company_target'],
      services: ['CF D1/KV (working)', 'Neon (vault)', 'Doppler'],
      skills: ['/code-review'],
    },
    imo: {
      ingress: {
        trigger: 'Signal events from People Enrichment, DOL Enrichment, Blog Signal Detection, and Talent Flow processes',
        schema: 'Signal sources: SLOT_FILLED (+10), EMAIL_VERIFIED (+3), FORM_5500_FILED (+5), BROKER_CHANGE (+7), FUNDING_EVENT (+15), ACQUISITION (+12), EXECUTIVE_JOINED (+10), EXECUTIVE_LEFT (-5)',
      },
      middle: {
        steps: [
          'Collect signals from three BIT authorization domains',
          'STRUCTURAL_PRESSURE (DOL): slow velocity, highest trust — gravity',
          'DECISION_SURFACE (People): medium velocity, high trust — direction',
          'NARRATIVE_VOLATILITY (Blog): fast velocity, lowest trust — timing amplifier only',
          'Aggregate weighted signal scores per company',
          'Classify into authorization band (0-5)',
          'Write composite score to outreach.bit_scores',
        ],
        decisions: [
          'Band 0 (0-9 SILENT): no action',
          'Band 1 (10-24 WATCH): internal flag only',
          'Band 2 (25-39 EXPLORATORY): 1 educational message per 60 days',
          'Band 3 (40-59 TARGETED): persona-specific, 3-touch max',
          'Band 4 (60-79 ENGAGED): phone warm, 5-touch max',
          'Band 5 (80+ DIRECT): direct contact, meeting request',
        ],
        stateTables: ['outreach.bit_scores'],
      },
      egress: {
        outputs: ['outreach.bit_scores (13,226 scored companies)', 'Authorization band classification per company'],
        consumers: ['LCS frame matching (intelligence tier gating)', 'Coverage workflow (export scores)'],
      },
    },
    erd: {
      tables: [
        { table: 'people.company_slot', repo: 'barton-outreach-core', access: 'READ', order: 1 },
        { table: 'outreach.dol', repo: 'barton-outreach-core', access: 'READ', order: 2 },
        { table: 'outreach.blog', repo: 'barton-outreach-core', access: 'READ', order: 3 },
        { table: 'outreach.company_target', repo: 'barton-outreach-core', access: 'READ', order: 4 },
        { table: 'outreach.bit_scores', repo: 'barton-outreach-core', access: 'READ/WRITE', order: 5 },
      ],
    },
    orbt: {
      mode: 'OPERATE',
      health: 'GREEN',
      notes: '13,226 companies scored, 6 authorization bands active, 5 pressure classes defined',
    },
    ctb: {
      canonicalTables: ['outreach.bit_scores'],
      errorTables: ['outreach.bit_errors'],
      promotionPath: ['SIGNAL', 'AGGREGATE', 'CANONICAL'],
    },
  },
];

/** Reverse lookup: which processes reference a given repo name */
export function getProcessesForRepo(repoName: string): Process[] {
  return processes.filter((p) => p.heir.repos.includes(repoName));
}
