## Doctrine Acronyms (Canonical Glossary)

```yaml
glossary:
  - acronym: IMO
    stands_for: Input–Middle–Output
    definition: Framework to design processes with clear intake, transformation, and delivery phases.
    usage: Applied across blueprints and runtime flows; appears in repo scaffolds and UI.
  - acronym: CTB
    stands_for: Christmas Tree Backbone
    definition: Hierarchical architecture mapping 60k‑ft to 5k‑ft processes.
    usage: Governs repo-of-repos organization, branch standards, and enforcement.
  - acronym: HEIR
    stands_for: Hierarchy, Enforcement, Integration, Reporting
    definition: Governance and compliance layer enforcing doctrine across agents and data.
    usage: ID stamping, compliance checks, and audit trails.
  - acronym: ORBT
    stands_for: Operate, Repair, Build, Train
    definition: Operational doctrine for self‑documenting, self‑repairing, teachable systems.
    usage: Guides runtime modes, remediation, and knowledge capture.
  - acronym: STAMPED
    stands_for: Structured Table Architecture for Managed Persistent Enterprise Data
    definition: Neon (PostgreSQL) schema for validated, version‑locked data.
    usage: Structured data vault for persistent records.
  - acronym: SPVPET
    stands_for: Structured Processing Vault for Persistent Event Tracking
    definition: Firebase schema for realtime working memory and UI sync.
    usage: Realtime memory vault for operational state.
  - acronym: STACKED
    stands_for: Structured Table Architecture for Calculated Knowledge & Event Data
    definition: BigQuery schema for analytics and historical data.
    usage: Analytics warehouse for aggregations and BI.
  - acronym: ALTITUDE
    stands_for: System visibility levels (60k–5k)
    definition: Perspective tiers from strategic to operational detail.
    usage: Appears in planning, enforcement, reporting, and subagent roles.
```

### Core Architecture

- **IMO**: Input–Middle–Output — Process framework with clear intake, transformation, and delivery phases.
- **CTB**: Christmas Tree Backbone — Hierarchical map from 60k‑ft overview to 5k‑ft operational processes.
- **HEIR**: Hierarchy, Enforcement, Integration, Reporting — Governance system enforcing doctrine across agents and data.
- **ORBT**: Operate, Repair, Build, Train — Operational doctrine for self‑documenting, self‑repairing, and teachable systems.

### Vaults and Data Layers

- **STAMPED**: Structured Table Architecture for Managed Persistent Enterprise Data — Neon (PostgreSQL) schema for validated, version‑locked data.
- **SPVPET**: Structured Processing Vault for Persistent Event Tracking — Firebase schema for realtime working memory.
- **STACKED**: Structured Table Architecture for Calculated Knowledge & Event Data — BigQuery schema for analytics and historical data.

### ALTITUDE (System Visibility Levels)

Defines perspective and scope for planning, execution, and reporting within CTB.

| Level | Name                  | Scope and Focus                                                                 |
|------:|-----------------------|----------------------------------------------------------------------------------|
| 60k   | Strategic Constellation| Company‑wide doctrine, cross‑LLC alignment, long‑range objectives               |
| 40k   | Program Constellation  | Multi‑system initiatives, capability roadmaps, dependency alignment             |
| 30k   | Engineering Hangar     | Architecture, repo‑of‑repos, standards, CI/CD, enforcement (HEIR/ORBT)         |
| 20k   | System Blueprint       | Service boundaries, contracts, schemas, interfaces, SLAs                        |
| 10k   | Workflow/Module        | Pipelines, jobs, subagents, tool wiring (n8n/Composio, MCP)                     |
| 5k    | Operational Runbook    | Concrete tasks, endpoints, migrations, health checks, dashboards                |

Notes:
- ALTITUDE appears in enforcement and orchestration (see `ctb/docs/global-config/global_manifest.yaml`).
- HEIR/ORBT tracking should include an `orbt_layer` and altitude context where applicable.


