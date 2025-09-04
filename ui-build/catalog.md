## Databases / Schemas / Tables

- **Neon** — Vault (STAMPED)
  - `shq` schema
    - dpr_doctrine (01.dpr.0001)
    - process_structure (01.proc.0001)
  - `marketing` schema
    - company (04.co.0001)
    - people (04.pe.0001)
    - ple_slot (04.ple.0001)
- **Firebase** — Working memory (SPVPET)
  - collection: `agent_task`
  - collection: `agents_whiteboard`
  - collection: `error_log`
- **BigQuery** — Analytics (STACKED)
  - dataset: `outreach_analytics`
    - events
    - email_perf
    - leads_funnel

## Tools

- **Lovable.dev** — UI scaffolding + prompt workbench
- **Cursor** — Dev + repo automation
- **Render Endpoint** — API router (/ingest, /validate, /promote)
- **Looker** — Dashboards + oversight

## MCP Servers

- **Apify MCP** (port 3002) — ops: run_actor, scrape_url, get_dataset, list_actors
- **Playwright MCP** (port 3010) — ops: browser_automation, capture
- **Garage-MCP** (port 7001) — ops: fs.read, exec.run, git.diff, heir.check