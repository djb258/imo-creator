# Git Branch Strategy (Altitude Model)

**Authority**: Operational runbook (subordinate to CANONICAL_ARCHITECTURE_DOCTRINE.md)
**Status**: ACTIVE
**Last Updated**: 2026-01-11

---

## Overview

This document defines the **git branch structure** for repositories following the Barton Doctrine.

**IMPORTANT DISTINCTION:**
- **This document** defines GIT BRANCHES (where code is committed)
- **CANONICAL_ARCHITECTURE_DOCTRINE.md** defines FOLDER STRUCTURE under `src/` and CC AUTHORITY LAYERS
- These are DIFFERENT concepts. Do not conflate them.

---

## The Christmas Tree Analogy (Git Branches)

```
                    ⭐ (Operations - 5k)
                   /|\
                  / | \
                 /  |  \   (UI Layer - 10k)
                /   |   \
               /    |    \
              /     |     \  (Business Logic - 20k)
             /      |      \
            /       |       \
           /________|________\  (System Infrastructure - 40k)
                   |||
                   |||  (Main Trunk - Doctrine Core)
                   |||
```

---

## Altitude Levels (Git Branches)

| Altitude | Purpose | Branch Protection |
|----------|---------|-------------------|
| **40k ft** | Doctrine Core, system infrastructure | Strict (2 reviews) |
| **20k ft** | Business Logic, IMO processes | Light |
| **10k ft** | UI/UX components | Light |
| **5k ft** | Operations, automation | Light |

---

## Branch Structure

### 40k Altitude: Doctrine Core

| Branch | Purpose |
|--------|---------|
| `main` | Trunk - production-ready code |
| `doctrine/get-ingest` | Global manifests, HEIR schema |
| `sys/composio-mcp` | MCP registry, tool integrations |
| `sys/neon-vault` | PostgreSQL schemas, migrations |
| `sys/firebase-workbench` | Firestore structures, security |
| `sys/bigquery-warehouse` | Analytics, data warehouse |
| `sys/github-factory` | CI/CD templates, automation |
| `sys/builder-bridge` | Builder.io, Figma connectors |
| `sys/security-audit` | Compliance, key rotation |

### 20k Altitude: Business Logic

| Branch | Purpose |
|--------|---------|
| `imo/input` | Data intake, scraping, enrichment |
| `imo/middle` | Calculators, compliance logic |
| `imo/output` | Dashboards, exports, visualizations |

### 10k Altitude: UI/UX

| Branch | Purpose |
|--------|---------|
| `ui/figma-bolt` | Figma + Bolt UI components |
| `ui/builder-templates` | Builder.io reusable modules |

### 5k Altitude: Operations

| Branch | Purpose |
|--------|---------|
| `ops/automation-scripts` | Cron jobs, CI tasks |
| `ops/report-builder` | Compliance reports |

---

## Merge Flow Direction

Changes flow **upward** like sap in a tree:

```
Operations (5k) → UI (10k) → Business (20k) → Systems (40k) → Main (Trunk)
```

### Code Review Requirements

| From → To | Reviews Required |
|-----------|-----------------|
| Operations → UI | 0 |
| UI → Business | 0 |
| Business → Systems | 1 |
| Systems → Main | 2 |

---

## Branch Protection Rules

Configure via GitHub Settings → Branches:

```yaml
main:
  required_reviews: 2
  status_checks: [doctrine_sync, compliance_audit]
  dismiss_stale_reviews: true

doctrine/*:
  required_reviews: 1
  status_checks: [doctrine_sync]

sys/*:
  required_reviews: 1
  status_checks: [compliance_audit]

imo/*, ui/*, ops/*:
  required_reviews: 0
  status_checks: []
```

---

## Relationship to Canonical Doctrine

| This Document (Git Branches) | Canonical Doctrine (Folder Structure) |
|------------------------------|--------------------------------------|
| `sys/*` branches | `src/sys/` folder |
| `imo/*` branches | `src/app/` + `src/data/` folders |
| `ui/*` branches | `src/ui/` folder |
| `ops/*` branches | `scripts/` folder (not under src/) |

The git branch strategy organizes **where development happens**.
The canonical CTB structure organizes **where files are placed**.

Both apply. Neither replaces the other.

---

## Document Control

| Field | Value |
|-------|-------|
| Type | Operational Runbook |
| Authority | Subordinate to Canonical Doctrine |
| Extracted From | global-config/CTB_DOCTRINE.md |
