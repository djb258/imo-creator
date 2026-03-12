# ADR Index — Fleet-Wide Architecture Decisions

**Authority**: Human-maintained (Sovereign)
**Location**: imo-creator repo root (NOT in templates/)

---

## Index

| ADR # | Repo | Date | Title | Status | One-Line Summary |
|-------|------|------|-------|--------|-----------------|
| ADR-001 | imo-creator | 2026-02-15 | Sub-hub table cardinality | ACCEPTED | Exactly 1 CANONICAL + 1 ERROR table per sub-hub (OWN-10a/10b/10c) |
| ADR-002 | client | — | CTB consolidated client infrastructure backbone | ACCEPTED | Consolidated client infrastructure under CTB backbone structure |
| ADR-003 | client | — | Renewal sub-hub addition | WITHDRAWN | Renewal sub-hub proposed then withdrawn |
| ADR-004 | client | — | Renewal downgraded to plan support | ACCEPTED | Renewal downgraded from sub-hub to plan support feature |
| ADR-005 | client | — | Client projection support | ACCEPTED | Client projection support architecture |
| ADR-006 | barton-outreach-core | — | Sovereign completion infrastructure | ACCEPTED | Sovereign completion infrastructure for outreach |
| ADR-007 | barton-outreach-core | — | Kill switch system | ACCEPTED | Kill switch system for outreach safety |
| ADR-008 | barton-outreach-core | 2026-01-20 | v1.0 operational baseline certification | ACCEPTED | v1.0 operational baseline certified and locked |
| ADR-009 | barton-outreach-core | 2026-01-20 | Tier telemetry and drift analytics | ACCEPTED | Tier telemetry and drift analytics system |
| ADR-010 | barton-outreach-core | 2026-01-20 | Marketing safety gate | ACCEPTED | Marketing safety gate with HARD_FAIL enforcement |
| ADR-011 | barton-outreach-core | 2026-01-22 | CL authority registry + outreach spine | ACCEPTED | CL authority registry and outreach operational spine |
| ADR-012 | barton-outreach-core | 2026-01-25 | Company target utils refactor | ACCEPTED | Company target utils folder refactor |
| ADR-013 | barton-outreach-core | 2026-01-25 | Talent flow hub architecture | ACCEPTED | Talent flow hub architecture design |
| ADR-014 | barton-outreach-core | 2026-01-25 | BIT engine architecture | ACCEPTED | BIT (Buyer Intent Tracker) engine architecture |
| ADR-015 | barton-outreach-core | 2026-01-25 | Quarterly hygiene process | ACCEPTED | Quarterly hygiene and schema drift audit process |
| ADR-016 | barton-outreach-core | 2026-01-25 | Repo and Neon cleanup | EXECUTED | Repository and Neon schema cleanup |
| ADR-017 | barton-outreach-core | 2026-01-25 | BIT authorization migration | ACCEPTED | BIT authorization system migration |
| ADR-018 | barton-outreach-core | — | FREE extraction pipeline progress | ACCEPTED | FREE extraction pipeline progress report |
| ADR-019 | barton-outreach-core | 2026-01-30 | FREE extraction pipeline complete | ACCEPTED | FREE extraction pipeline completed |
| ADR-020 | barton-outreach-core | — | People sub-hub dual canonical exception | ACCEPTED | SUPPORTING leaf type + people master reclassification |
| ADR-021 | imo-creator | 2026-02-25 | DB Lane + UI Lane + Container Surface (V2 Control Plane) | ACCEPTED | DB_CHANGESET, UI_CHANGESET, CONTAINER_RUN artifacts; WORK_PACKET V2 routing flags; adapter model for UI and container |
| ADR-022 | imo-creator | 2026-03-01 | Agent Teams Integration for Garage Pipeline | ACCEPTED | Native Claude Code Agent Teams + worktree isolation for parallel execution within Worker, Auditor, and fleet refit stages |
| ADR-023 | imo-creator | 2026-03-01 | PSB Libraries (Prompt, Reverse Prompt, Skills) | ACCEPTED | Database-backed Prompt Library, Reverse Prompt Library, and Skills Library in psb schema — migrations 012-015, column registry. Deployed to Neon. |
| ADR-024 | imo-creator | 2026-03-02 | CLAUDE.md Path Corrections | ACCEPTED | Fix 10 broken agent/contract file references after Garage V2 restructure |
| ADR-025 | imo-creator | 2026-03-02 | V2 Path Corrections — Remaining Stale Refs | ACCEPTED | Fix stale templates/agents/ refs in SYSTEM_MANIFEST.md, REPO_HOUSEKEEPING.md, HUB_COMPLIANCE.md; flag DOPPLER.md gap |
| ADR-026 | imo-creator | 2026-03-05 | DeltaHound Tool Registration (TOOL-012) | ACCEPTED | Register DeltaHound homebrew field-monitoring tool in SNAP_ON_TOOLBOX.yaml as Tier 0 |
| ADR-027 | imo-creator | 2026-03-05 | DeltaHound Sub-Hub 1 Scheduler — GitHub Actions vs Cloudflare Scheduled Workers | ACCEPTED | GitHub Actions selected for DeltaHound Scheduler; Cloudflare Scheduled Workers evaluated and rejected on stack simplicity grounds |
| ADR-028 | imo-creator | 2026-03-11 | BAR-104 LOCKED File Platform Purge | ACCEPTED | Update SNAP_ON_TOOLBOX.yaml, CONSTITUTION.md, hostinger templates, TEMPLATES_MANIFEST.yaml — purge retired platform refs (Lovable/Supabase/Hostinger) per BAR-100 |
| ADR-029 | imo-creator | 2026-03-12 | CLI-Anything Tool Registration (TOOL-013) | ACCEPTED | Register CLI-Anything in SNAP_ON_TOOLBOX.yaml as Tier 0 — generates CLI wrappers for GUI-only software |
| ADR-030 | imo-creator | 2026-03-12 | UI/UX Pro Max Tool Registration (TOOL-014) | ACCEPTED | Register UI/UX Pro Max design intelligence skill in SNAP_ON_TOOLBOX.yaml as Tier 0 — deterministic design lookup for non-designers |
| ADR-031 | imo-creator | 2026-03-12 | Dev-Browser / Playwright MCP Tool Registration (TOOL-015) | ACCEPTED | Register Dev-Browser / Playwright MCP in SNAP_ON_TOOLBOX.yaml as Tier 0 — visual QA circle for frontend verification |
| ADR-032 | imo-creator | 2026-03-12 | shadcn/ui MCP Tool Registration (TOOL-016) | ACCEPTED | Register shadcn/ui MCP in SNAP_ON_TOOLBOX.yaml as Tier 0 — deterministic component API lookup from official registry |
| ADR-033 | imo-creator | 2026-03-12 | a11y-mcp Tool Registration (TOOL-017) | ACCEPTED | Register a11y-mcp in SNAP_ON_TOOLBOX.yaml as Tier 0 — axe-core WCAG accessibility auditing gate |

---

## How to Use This Index

Before creating a new ADR:
1. Search this index for related decisions
2. If a related ADR exists, reference it in your new ADR
3. If your ADR supersedes an existing one, update the old entry's status to SUPERSEDED

After creating an ADR:
1. Add an entry to this index
2. Commit the index update alongside the ADR

This file lives in imo-creator because ADRs are fleet-wide decisions.
Child repos contain the full ADR documents; this index is the lookup table.

---

## Status Definitions

| Status | Meaning |
|--------|---------|
| PROPOSED | Under review, not yet binding |
| ACCEPTED | Approved and binding |
| SUPERSEDED | Replaced by a newer ADR (note which one) |
| REJECTED | Considered and declined |

---

## ADR Numbering

ADR numbers are **global across the fleet**, not per-repo. When creating a new ADR in any repo, use the next sequential number from this index.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-15 |
| Last Modified | 2026-03-09 |
| Maintained By | Human + AI (after ADR creation) |
| Audit Script | scripts/adr-check.sh |
