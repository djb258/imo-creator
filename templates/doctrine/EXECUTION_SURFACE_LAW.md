# Execution Surface Law

**Authority**: IMO-Creator (CC-01 Sovereign)
**Status**: LOCKED
**Version**: 1.0.0
**Scope**: All child repositories

---

## Purpose

This document defines where executable code may exist. Any execution surface not listed here is **PROHIBITED**. The default posture is **deny** — code must be placed in a declared surface or it is a violation.

---

## 1. Valid Execution Surfaces (CTB Branches)

All application code MUST reside within CTB branches under `src/`.

| Branch | Allowed Execution | Placement Rule |
|--------|-------------------|----------------|
| `src/sys/` | Bootstraps, env loaders, infrastructure init, config readers | System-level only — no business logic |
| `src/data/` | Migrations, queries, data transforms, repositories | Data layer only — no UI or orchestration |
| `src/app/` | Services, workflows, business logic, orchestration | Application layer — hub M-layer logic |
| `src/ai/` | Agents, LLM calls, prompt execution, routers | AI components — LLM as tail only |
| `src/ui/` | Pages, components, event handlers, layouts | User interface — no business logic |

**Rule**: Files with executable content (`.ts`, `.js`, `.py`, `.sh`, `.ps1`, or files with executable permissions) MUST exist inside one of these five branches.

---

## 2. Valid Support Surfaces

These locations may contain executable content for **governance purposes only**.

| Location | Allowed Content | Constraint |
|----------|-----------------|------------|
| `.github/workflows/` | CI/CD workflow definitions | YAML only — no custom scripts embedded |
| `scripts/` (repo root) | Governance scripts distributed by imo-creator | Only scripts from `templates/scripts/` — no custom scripts |
| `.git/hooks/` | Pre-commit hook | Only the hook from `templates/scripts/hooks/pre-commit` |
| `migrations/` (repo root) | Database migration SQL | Only SQL files — no application logic |

**Rule**: Support surfaces exist for governance enforcement. They MUST NOT contain application logic, business rules, or runtime code.

---

## 3. Prohibited Execution Surfaces

The following directories are **FORBIDDEN** at the repository root:

| Directory | Status | Reason |
|-----------|--------|--------|
| `bin/` | PROHIBITED | Side-door execution bypass |
| `tools/` | PROHIBITED | Unregistered tool placement |
| `lambda/` | PROHIBITED | Serverless bypass outside CTB |
| `functions/` | PROHIBITED | Cloud function bypass outside CTB |
| `workers/` | PROHIBITED | Background worker bypass outside CTB |
| `jobs/` | PROHIBITED | Job runner bypass outside CTB |
| `cron/` | PROHIBITED | Scheduled task bypass outside CTB |
| `utils/` | PROHIBITED | CTB_VIOLATION (forbidden folder) |
| `helpers/` | PROHIBITED | CTB_VIOLATION (forbidden folder) |
| `common/` | PROHIBITED | CTB_VIOLATION (forbidden folder) |
| `shared/` | PROHIBITED | CTB_VIOLATION (forbidden folder) |
| `lib/` | PROHIBITED | CTB_VIOLATION (forbidden folder) |
| `misc/` | PROHIBITED | CTB_VIOLATION (forbidden folder) |

**Rule**: If code needs to run, it belongs in a CTB branch. There are no exceptions.

---

## 4. Detection & Enforcement

| Layer | Mechanism | What It Detects |
|-------|-----------|-----------------|
| Pre-commit | CHECK 1 (forbidden folders) | Prohibited directories in `src/` |
| Pre-commit | CHECK 2 (loose files) | Executable files in `src/` root |
| CI | Gate A (side-door detection) | Prohibited directories at repo root |
| CI | Gate B (executable containment) | Executable files outside CTB branches |
| Claude Code | APPLY_DOCTRINE.prompt.md | Structural audit of file placement |

---

## 5. Violation Categories

| Violation | Severity | Action |
|-----------|----------|--------|
| Executable file outside CTB branch | CRITICAL | HALT — move to correct CTB branch |
| Prohibited directory at repo root | CRITICAL | HALT — remove directory, place code in CTB |
| Application logic in support surface | HIGH | HALT — move logic to `src/app/` or appropriate CTB branch |
| Custom script in `scripts/` (not from imo-creator) | HIGH | HALT — move to CTB branch or request ADR |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-20 |
| Authority | IMO-Creator (CC-01) |
| Status | LOCKED |
| Version | 1.0.0 |
| Change Protocol | ADR + Human Approval Required |
| Related | FAIL_CLOSED_CI_CONTRACT.md, ARCHITECTURE.md Part II |
