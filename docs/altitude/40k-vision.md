---
title: "40,000ft - Vision"
aliases: [vision, 40k, why-we-exist]
tags:
  - altitude/40k
  - doctrine/master
created: 2025-11-25
updated: 2025-11-25
---

# 40,000ft - Vision

> **Altitude**: Strategic / Why we exist
> **Audience**: Stakeholders, new team members, external partners

---

## Mission Statement

**IMO-Creator is the master doctrine repository that scaffolds, validates, and maintains doctrine-compliant repositories across the ecosystem.**

---

## Why This Exists

Software projects fail when:
- Structure is inconsistent across repos
- Data flow is undocumented
- Failure modes are undefined
- AI agents can't understand the codebase

IMO-Creator solves this by providing:
1. **A canonical structure** (Input-Middle-Output) that all repos inherit
2. **Automated validation** ensuring doctrine compliance
3. **AI-readable documentation** generated automatically
4. **Kill switches** defined for every failure path

---

## Core Principle

> Every repository should explain itself to both humans and AI by default.

This is achieved through:
- **IMO Architecture**: Clear data flow (Input → Middle → Output)
- **CTB Layers**: Code organized by concern (system/data/app/ai/ui)
- **HEIR Compliance**: Unique IDs, process tracking, error hierarchy
- **Auto-generated docs**: Diagrams, indexes, summaries

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Repos scaffolded | All new repos use IMO template |
| Doctrine compliance | 100% of repos pass HEIR checks |
| AI comprehension | Claude/GPT can navigate any IMO repo |
| Mean time to onboard | < 1 hour for new developer |

---

## Non-Goals

- Not a runtime framework (it's a meta-framework)
- Not opinionated about language/stack (works with any)
- Not a deployment platform (uses Vercel/Render)
- Not a database (uses Neon/Firebase/B2)

---

## Related Docs

- [10-imo.md](../10-imo.md) - Data flow definition
- [heir.doctrine.yaml](../../heir.doctrine.yaml) - HEIR rules
