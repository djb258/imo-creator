# Tool Selection Doctrine

## Hub Identity

| Field | Value |
|-------|-------|
| **Hub Name** | |
| **Hub ID** | |

---

## Core Doctrine

> **Determinism > Cost > Auditability**
> **LLMs are allowed only as tail arbitration**
> **Tools are swappable; doctrine is not**

---

## Tool Approval Rules

| Rule | Enforcement |
|------|-------------|
| All tools MUST be registered in this ledger | PR rejected if not |
| New tools require an ADR | No exceptions |
| LLMs cannot replace deterministic scripts | PR invalid |
| Tools are scoped to hub M layer only | Spokes cannot own tools |

---

## Pipeline Tool Ledger (19 Steps)

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

### TypeScript Reference

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

## Tool Categories

### Category 1: Pure Deterministic (16 tools)
Output is 100% predictable. No LLM.

| Steps | Tools |
|-------|-------|
| 1, 2 | Exact Matcher, Deterministic Fuzzy Matcher |
| 4, 5 | Domain Resolver, DNS / MX Validator |
| 6, 7 | Pattern Discovery Worker, Pattern Generator |
| 8, 9 | Email Verifier (Light), Email Verifier (Authoritative) |
| 10, 11 | Signal Deduplicator, BIT Scoring Engine |
| 14, 15 | Slot Assignment Engine, Enrichment Queue Manager |
| 16, 17, 18, 19 | Talent Movement Detector, DOL Importer, Exact EIN Matcher, Blog / RSS Ingestor |

### Category 2: LLM Tail Only (3 tools)
Deterministic logic first, LLM only for edge cases.

| Step | Tool | When LLM Used |
|------|------|---------------|
| 3 | Fuzzy Arbitration Resolver | When deterministic match fails |
| 12 | People Classifier | After rules exhaust |
| 13 | Email Generator | After template selection |

### Category 3: Forbidden
- Unregistered tools
- Tools without ADR
- Tools spanning multiple hubs
- Tools in spokes
- LLM as primary solution

---

## IMO Layer Mapping

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
│  MATCHING: Steps 1, 2, 3, 18                                    │
│  VALIDATION: Steps 4, 5, 8, 9                                   │
│  ENRICHMENT: Steps 6, 7, 15, 16                                 │
│  SCORING: Steps 10, 11, 12                                      │
│  ASSIGNMENT: Step 14                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         EGRESS (O)                               │
│  Step 13: Email Generator                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Infrastructure Tools (Required)

| Tool | Purpose | Doctrine ID |
|------|---------|-------------|
| Doppler | Secrets management | 04.05.01 |
| GitHub | Version control | 04.05.02 |
| Linear | Task management | 04.05.03 |
| Obsidian | Knowledge management | 04.05.04 |
| HEIR | Compliance validation | 04.05.05 |
| Composio | MCP server | 04.04.01 |
| n8n | Workflow automation | 04.04.02 |

---

## Tool Scoping Rules

| Location | Tools Allowed |
|----------|---------------|
| **I — Ingress** | Data ingestors only (Steps 17, 19) |
| **M — Middle** | All processing tools (Steps 1-12, 14-16, 18) |
| **O — Egress** | Output generators only (Step 13) |
| **Spokes** | None (interface only) |

---

## Adding a New Tool

1. Determine if deterministic solution exists
2. If yes → implement deterministically
3. If no → implement rules first, LLM as tail only
4. Create ADR using `templates/adr/ADR.md`
5. Assign step number and Doctrine ID
6. Add to this ledger
7. Get hub owner approval

---

## LLM Usage Validation

Before using LLM in any tool:

- [ ] Deterministic solution proven impossible
- [ ] Rules/templates tried first
- [ ] LLM only handles edge cases
- [ ] Output is validated before action
- [ ] Audit trail maintained
- [ ] ADR documents the decision

---

## Compliance Checklist

- [ ] All tools registered in ledger
- [ ] Each tool has step number
- [ ] Each tool has Doctrine ID
- [ ] Each tool mapped to IMO layer
- [ ] No tools in spokes
- [ ] No tools spanning hubs
- [ ] LLM usage justified (3 tools max)
- [ ] Security review completed

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| PRD | |
| ADR | ADR-001-tool-selection |
| Linear Issue | |
