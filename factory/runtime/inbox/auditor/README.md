# Auditor Inbox

**Owner**: Auditor

Receives completed work from DB Agent. Final QA — checks against BAR spec, validates output, flags issues. Drops final report in `outbox/auditor/` for Foreman review.

**Writes to this directory**: DB Agent only
**Reads from this directory**: Auditor only

See `factory/runtime/PACKET_CONTRACT.md` for envelope schema and handoff rules.
