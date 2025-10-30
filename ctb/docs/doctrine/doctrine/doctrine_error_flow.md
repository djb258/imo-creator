## Doctrine Error Correlation Flow (Master Error Log)

```yaml
error_logging:
  master_log:
    name: shq.master_error_log
    ids:
      - unique_id        # HEIR unique identifier (e.g., shq-03-imo-YYYYMMDD-HHMMSS-<rand>)
      - process_id       # Process lineage (e.g., shq.03.imo.V1.YYYYMMDD.stage)
      - blueprint_version_hash  # Content-addressed SSOT snapshot
    fields:
      - error_id         # UUID for individual error event
      - occurred_at      # ISO8601 UTC timestamp
      - agent_id         # Global/Local agent reporting
      - stage            # IMO stage (overview/input/middle/output)
      - severity         # CRITICAL/HIGH/MEDIUM/LOW
      - message          # Error message
      - error_type       # Exception/Category
      - stacktrace       # Sanitized stacktrace
      - hdo_snapshot     # Sanitized context snapshot
      - context          # Additional metadata
  correlation:
    lookup:
      by_ids: [unique_id, process_id]
      fetch_blueprint: "pull SSOT by blueprint_version_hash or by IDs"
    remediation:
      steps:
        - "Locate failing stage from master log record"
        - "Fetch SSOT (by blueprint_version_hash or IDs)"
        - "Reproduce, patch, validate locally"
        - "Promote via Gateway (n8n+Composio)"
        - "Verify via Global Validator"
```

### How it works
- All agents funnel errors into `shq.master_error_log` with `unique_id`, `process_id`, and `blueprint_version_hash`.
- A remediation agent (or engineer) reads the log, pulls the SSOT snapshot by hash or IDs, and fixes the failing stage.
- HEIR/ORBT ensures each remediation is tracked to a process lineage and altitude.

### Where it is implemented
- Error sink builder: `ctb/sys/infrastructure/garage-mcp/services/mcp/modules/error_sink.py`
- ID generators: `ctb/sys/server/blueprints/ids.py`
- Version hashing: `ctb/sys/server/blueprints/versioning.py`


