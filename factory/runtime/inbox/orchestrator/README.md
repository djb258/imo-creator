# Orchestrator Inbox

**Owner**: Orchestrator
**Entry Point**: This is the ONLY entry point for the pipeline.

Foreman (Claude.ai) drops packets here after working with Dave. Orchestrator reads, decomposes into sub-tasks, and passes to Planner.

**Writes to this directory**: Foreman only
**Reads from this directory**: Orchestrator only

See `factory/runtime/PACKET_CONTRACT.md` for envelope schema and handoff rules.
