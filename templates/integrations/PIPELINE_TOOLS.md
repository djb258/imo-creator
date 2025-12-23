# Pipeline Tool Ledger

## Doctrine

> **Determinism > Cost > Auditability**
> **LLMs are allowed only as tail arbitration**

---

## Tool Ledger

| Step | Tool Name | Solution Type | LLM? |
|------|-----------|---------------|------|
| 1 | Exact Matcher | Deterministic code | No |
| 2 | Deterministic Fuzzy Matcher | String distance math | No |
| 3 | Fuzzy Arbitration Resolver | LLM tail only | Yes (tail) |
| 4 | Domain Resolver | Deterministic parsing | No |
| 5 | DNS / MX Validator | DNS lookup | No |
| 6 | Pattern Discovery Worker | Statistical analysis | No |
| 7 | Pattern Generator | Template generation | No |
| 8 | Email Verifier (Light) | DNS + SMTP | No |
| 9 | Email Verifier (Authoritative) | External verifier | No |
| 10 | Signal Deduplicator | Hash + DB constraint | No |
| 11 | BIT Scoring Engine | Weighted rules | No |
| 12 | People Classifier | Rules → LLM tail | Yes (tail) |
| 13 | Email Generator | Templates → LLM | Yes (tail) |
| 14 | Slot Assignment Engine | Deterministic solver | No |
| 15 | Enrichment Queue Manager | n8n | No |
| 16 | Talent Movement Detector | Deterministic diff | No |
| 17 | DOL Importer | Fetch + parse | No |
| 18 | Exact EIN Matcher | Exact numeric match | No |
| 19 | Blog / RSS Ingestor | RSS + scheduler | No |

---

## Solution Categories

### Category 1: Pure Deterministic (16 tools)
These tools use no LLM. Output is 100% predictable.

| Step | Tool |
|------|------|
| 1 | Exact Matcher |
| 2 | Deterministic Fuzzy Matcher |
| 4 | Domain Resolver |
| 5 | DNS / MX Validator |
| 6 | Pattern Discovery Worker |
| 7 | Pattern Generator |
| 8 | Email Verifier (Light) |
| 9 | Email Verifier (Authoritative) |
| 10 | Signal Deduplicator |
| 11 | BIT Scoring Engine |
| 14 | Slot Assignment Engine |
| 15 | Enrichment Queue Manager |
| 16 | Talent Movement Detector |
| 17 | DOL Importer |
| 18 | Exact EIN Matcher |
| 19 | Blog / RSS Ingestor |

### Category 2: LLM Tail Only (3 tools)
These tools use deterministic logic first, LLM only for edge cases.

| Step | Tool | When LLM Used |
|------|------|---------------|
| 3 | Fuzzy Arbitration Resolver | When deterministic match fails |
| 12 | People Classifier | After rules exhaust |
| 13 | Email Generator | After template selection |

---

## Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         INGRESS (I)                              │
│  Steps 17, 19: DOL Importer, Blog/RSS Ingestor                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MIDDLE (M)                               │
│                                                                  │
│  MATCHING PHASE                                                  │
│  ├─ Step 1: Exact Matcher                                       │
│  ├─ Step 2: Deterministic Fuzzy Matcher                         │
│  ├─ Step 3: Fuzzy Arbitration Resolver (LLM tail)               │
│  └─ Step 18: Exact EIN Matcher                                  │
│                                                                  │
│  VALIDATION PHASE                                                │
│  ├─ Step 4: Domain Resolver                                     │
│  ├─ Step 5: DNS / MX Validator                                  │
│  ├─ Step 8: Email Verifier (Light)                              │
│  └─ Step 9: Email Verifier (Authoritative)                      │
│                                                                  │
│  ENRICHMENT PHASE                                                │
│  ├─ Step 6: Pattern Discovery Worker                            │
│  ├─ Step 7: Pattern Generator                                   │
│  ├─ Step 15: Enrichment Queue Manager                           │
│  └─ Step 16: Talent Movement Detector                           │
│                                                                  │
│  SCORING & CLASSIFICATION                                        │
│  ├─ Step 10: Signal Deduplicator                                │
│  ├─ Step 11: BIT Scoring Engine                                 │
│  └─ Step 12: People Classifier (LLM tail)                       │
│                                                                  │
│  ASSIGNMENT                                                      │
│  └─ Step 14: Slot Assignment Engine                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         EGRESS (O)                               │
│  Step 13: Email Generator (LLM tail for personalization)        │
└─────────────────────────────────────────────────────────────────┘
```

---

## TypeScript Reference

```typescript
export const TOOL_LEDGER = [
  { step: 1,  name: "Exact Matcher",                solution: "Deterministic code" },
  { step: 2,  name: "Deterministic Fuzzy Matcher",  solution: "String distance math" },
  { step: 3,  name: "Fuzzy Arbitration Resolver",   solution: "LLM tail only" },
  { step: 4,  name: "Domain Resolver",              solution: "Deterministic parsing" },
  { step: 5,  name: "DNS / MX Validator",           solution: "DNS lookup" },
  { step: 6,  name: "Pattern Discovery Worker",     solution: "Statistical analysis" },
  { step: 7,  name: "Pattern Generator",            solution: "Template generation" },
  { step: 8,  name: "Email Verifier (Light)",       solution: "DNS + SMTP" },
  { step: 9,  name: "Email Verifier (Authoritative)", solution: "External verifier" },
  { step: 10, name: "Signal Deduplicator",          solution: "Hash + DB constraint" },
  { step: 11, name: "BIT Scoring Engine",           solution: "Weighted rules" },
  { step: 12, name: "People Classifier",            solution: "Rules → LLM tail" },
  { step: 13, name: "Email Generator",              solution: "Templates → LLM" },
  { step: 14, name: "Slot Assignment Engine",       solution: "Deterministic solver" },
  { step: 15, name: "Enrichment Queue Manager",     solution: "n8n" },
  { step: 16, name: "Talent Movement Detector",     solution: "Deterministic diff" },
  { step: 17, name: "DOL Importer",                 solution: "Fetch + parse" },
  { step: 18, name: "Exact EIN Matcher",            solution: "Exact numeric match" },
  { step: 19, name: "Blog / RSS Ingestor",          solution: "RSS + scheduler" }
];
```

---

## Compliance Rules

### Adding a New Tool

1. Determine if deterministic solution exists
2. If yes → implement deterministically
3. If no → implement rules first, LLM as tail only
4. Create ADR documenting the decision
5. Assign step number
6. Add to this ledger
7. Get hub owner approval

### LLM Usage Validation

Before using LLM in any tool:

- [ ] Deterministic solution proven impossible
- [ ] Rules/templates tried first
- [ ] LLM only handles edge cases
- [ ] Output is validated before action
- [ ] Audit trail maintained
- [ ] ADR documents the decision

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| PRD | |
| ADR | ADR-001-tool-selection |
| Linear Issue | |
