# ADR: Supadata MCP Tool Registration (TOOL-018)

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-01 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-034 |
| **Status** | [x] Accepted |
| **Date** | 2026-03-13 |

---

## Owning Hub (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | CC-01 |
| **Hub Name** | imo-creator (Sovereign) |
| **Hub ID** | Garage |

---

## CC Layer Scope

| Layer | Affected | Description |
|-------|----------|-------------|
| CC-01 (Sovereign) | [x] | SNAP_ON_TOOLBOX.yaml updated |
| CC-02 (Hub) | [ ] | |
| CC-03 (Context) | [ ] | |
| CC-04 (Process) | [ ] | |

---

## IMO Layer Scope

| Layer | Affected |
|-------|----------|
| I — Ingress | [x] |
| M — Middle | [ ] |
| O — Egress | [ ] |

---

## Constant vs Variable

| Classification | Value |
|----------------|-------|
| **This decision defines** | [x] Constant (structure/meaning) |
| **Mutability** | [x] ADR-gated |

---

## Context

Multiple hubs need raw content ingestion from video platforms and web pages: prospect research scrapes company websites, outreach builds on competitor content, and content pipelines extract transcripts from YouTube, TikTok, Instagram, Facebook, and Twitter. Currently there is no tool in the registry that provides video transcript extraction or structured web scraping.

Supadata is a freemium API that provides two capabilities: (1) video transcript extraction from major platforms, and (2) web page scraping that returns clean structured Markdown. It ships an official MCP server (`@supadata/mcp`) that exposes these as MCP tools, giving the agent direct access to raw content ingestion.

This aligns with Tool Doctrine: Supadata is a data ingestion spoke. It extracts and returns raw content — it does not analyze, process, or make decisions. Hub-spoke discipline applies: raw content flows IN for hub processing.

User preference was Composio integration, but Supadata is not in Composio's catalog. MCP server is the correct connection method.

---

## Decision

Register Supadata as **TOOL-018** in SNAP_ON_TOOLBOX.yaml at **Tier 0** (free tier: 100 requests).

**Evaluation order compliance:**
1. Not on banned list
2. Tier 0 — free tier available (100 requests)
3. No existing tool in the registry covers video transcript extraction or structured web scraping
4. Fills a gap: raw content ingestion spoke for video and web sources

**Install command:**
```
claude mcp add supadata -s user -e SUPADATA_API_KEY=<key> -- npx -y @supadata/mcp
```

**API key management:** Stored in Doppler (`imo-creator/dev` project as `SUPADATA_API_KEY`).

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Composio integration | Supadata not in Composio catalog |
| Direct REST API calls | Works but no MCP integration — agent would need manual HTTP calls |
| @supadata/js SDK | TypeScript SDK available but MCP server provides better agent integration |
| youtube-transcript npm | YouTube only — no TikTok, Instagram, Facebook, Twitter, or web scraping |
| Playwright MCP (TOOL-015) scraping | Can scrape web pages but cannot extract video transcripts |
| Do Nothing | No video transcript or structured web scraping capability |

---

## Consequences

### Enables

- Video transcript extraction from YouTube, TikTok, Instagram, Facebook, Twitter
- Structured web page scraping returning clean Markdown
- AI-powered structured data extraction from video content
- Batch processing for multiple URLs
- Raw content ingestion for prospect research, competitive analysis, and content pipelines

### Prevents

- Manual copy-paste of video transcripts
- Inconsistent web scraping approaches across hubs
- Missing content ingestion capability in the tool registry

---

## PID Impact (if CC-04 affected)

| Field | Value |
|-------|-------|
| **New PID required** | [x] No |
| **PID pattern change** | [x] No |
| **Audit trail impact** | None |

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Rate Limit | 20 transcript/scrape calls per session | CC-01 |
| Free Tier Cap | 100 requests total — monitor usage | CC-01 |
| Timeout | 30s per request | CC-01 |
| Kill Switch | Rate limit exceeded → stop and warn | CC-01 |

---

## Rollback

Remove TOOL-018 entry from SNAP_ON_TOOLBOX.yaml and uninstall MCP server (`claude mcp remove supadata`). Remove `SUPADATA_API_KEY` from Doppler. No downstream dependencies — tool is optional and additive.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md v2.1.0 |
| Tool Registry | SNAP_ON_TOOLBOX.yaml |
| Source | https://supadata.ai/ |
| MCP Package | @supadata/mcp |
| Secrets | Doppler: imo-creator/dev/SUPADATA_API_KEY |
| Work Items | BAR-128 |
| PR(s) | This commit |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-01) | Human (Sovereign) | 2026-03-13 |
| Reviewer | Claude Opus 4.6 | 2026-03-13 |
