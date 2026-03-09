---
name: lovable
description: >
  Platform capabilities, hard constraints, credit economics, and pipeline position for
  Lovable.dev — the AI app builder. Use this skill whenever building with, exporting from,
  or making architecture decisions involving Lovable. Trigger on: Lovable, lovable.dev,
  AI app builder, vibe coding, rapid prototype, or any reference to generating full-stack
  apps from natural language prompts. Also trigger when evaluating whether a project should
  use Lovable vs traditional development, when dealing with GitHub export/import constraints,
  or when someone says "quick MVP" or "prototype fast" and Lovable is part of the conversation.
  If the question is "should we use Lovable for this?" — this skill has the answer.
---

# Lovable.dev — Platform Skill

Lovable is a launchpad, not a development platform. It generates React full-stack apps
from natural language prompts — fast, clean enough for prototypes, not built for scaling
or ongoing development.

The single most important thing to understand: **Lovable is Step 1 only. Never Step 2+.**
Once you export to GitHub and start developing elsewhere, you don't bring it back.

## The Gate That Governs Everything

**Lovable CAN export TO GitHub** ✅
**Lovable CANNOT import FROM an existing GitHub repo** ❌

This is the hard constraint that determines Lovable's position in any pipeline.

**Workaround:** Zip from another tool → import zip into Lovable. One-time operation,
not a repeatable workflow.

**What this means:**
- Lovable is always the starting point for net-new projects
- It cannot participate in iteration on existing codebases
- The universal pattern is: Lovable → GitHub → real dev tools (Cursor, Claude Code)
- Planning to use Lovable? Make sure nothing exists yet that needs to be imported

## What It Generates

From a natural language prompt, Lovable produces:
- React frontend (routing, layouts, components, basic UI)
- Backend API routes
- Database schema (via Supabase or Lovable Cloud)
- Authentication flows
- Basic CRUD operations

The output is a working full-stack web app. Not production-grade, but clickable and
demonstrable. Good enough to validate an idea with real users.

## Built-in Tools

- **Visual Editor**: Click elements in the preview to adjust color/size/spacing without prompts
- **Chat Mode**: Discuss problems or explain code without consuming credits
- **Code Mode** (paid only): Edit generated code directly within platform
- **Figma Import**: Convert Figma designs into working components
- **One-click Deploy**: Publish to Lovable subdomain or custom domain (paid)
- **GitHub Sync**: Two-way sync to a GitHub repo — you always own the code

## Backend Options

Two paths for backend functionality:

1. **Supabase integration**: Auth, database (Postgres), storage. Requires separate Supabase
   account. More mature, more control, but you manage two platforms
2. **Lovable Cloud**: Built-in backend (database, storage, auth, pre-integrated AI models).
   Newer, simpler, less customizable. Good for "just make it work" prototypes

Other integrations: Stripe, Clerk, OpenAI, Netlify deployment.

## Credit System & Pricing

Lovable runs on credits. Every AI interaction costs credits. This is where it gets
expensive if you're not careful.

| Plan | Monthly Credits | Daily Credits | Price |
|------|----------------|---------------|-------|
| Free | 30 cap | 5 | $0 |
| Starter | 100 | 5 | $25/mo |
| Launch | 250 | 5 | $50/mo |
| Scale | 500 | 5 | $100/mo |
| Enterprise | Custom | Custom | Custom |

**Credit consumption rules:**
- Every prompt = credits consumed (amount varies by complexity)
- Simple edits: fewer credits. New pages/refactoring: more credits
- **"Fix" messages do NOT count toward quota** — use this aggressively for debugging
- Monthly credits roll over. Daily credits do not
- Debugging loops are the #1 credit drain — the AI tries to fix a bug, fails, reintroduces
  old errors, each attempt burning credits

**Cost reality:** The sticker price is misleading. Complex projects easily burn through
Starter credits in a few sessions. Budget for Launch or Scale if doing anything real.

For full pricing details, read `references/pricing-and-limits.md`.

## Where Lovable Works

Use Lovable when ALL of these are true:
- The project is brand new (nothing to import)
- You need a working prototype, not a production system
- The complexity is low-to-moderate (CRUD, dashboards, landing pages)
- You accept that ongoing development happens elsewhere after export

**Good use cases:**
- MVP for idea validation
- Clickable prototype for stakeholder demos
- UI scaffolding to export and refine in Cursor/Claude Code
- Landing pages, marketing sites, email capture pages
- Simple internal tools where the lifecycle is: build → deploy → done
- Hackathon projects

## Where Lovable Fails

**Architecture problems:**
- Generated code is not built for scaling. Data structures are inflexible
- Logic gets tightly coupled in ways that break when requirements change
- Small feature changes can require rewriting large generated sections

**Complexity ceiling:**
- Complex backend logic (user roles, multi-tenant auth, complex business rules) → breaks
- Enterprise apps with payments + distributed systems + multiple API integrations → no
- Real-time messaging, recommendation engines, custom data pipelines → no
- Anything requiring custom backend architecture → no

**The debugging loop:**
The most common complaint. The AI gets stuck trying to fix bugs — tries a fix, fails,
re-introduces an old error, burns credits. At some point you must export and fix manually.
This is not a bug, it's a fundamental limitation of the approach.

**Code quality:**
- AI-generated code can be hard to debug manually
- Not optimized for performance
- Generic UI patterns — limited visual distinctiveness
- May not follow framework best practices

## Pipeline Doctrine

```
Lovable (generate MVP) → GitHub (export) → Cursor / Claude Code (real development)
```

Lovable occupies exactly one position in the pipeline: the first step for net-new
projects that don't yet exist. It is never a middle step. It is never used on existing
repos. The moment you need ongoing development, maintenance, complex features, or
production reliability — you're in Cursor/Claude Code territory.

## Dave's Operational Notes
<!-- Feed raw notes: which projects used Lovable, credit burn rate reality,
     export quality assessment, Supabase integration pain points -->

## Known Failure Modes
<!-- Document: debugging loops, export issues, specific complexity that broke it -->
