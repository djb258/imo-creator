import hashlib, json, time
from typing import Any, Dict, Optional, Sequence
from src.server.db.neon import get_conn

# Compute a stable dedupe hash over selected fields
_DEDUPE_FIELDS: Sequence[str] = (
    "source_system","source_service","environment","severity","error_code",
    "process_id","unique_id","blueprint_version_hash","message"
)

def _dedupe_hash(payload: Dict[str, Any]) -> str:
    parts = []
    for k in _DEDUPE_FIELDS:
        v = payload.get(k)
        parts.append("" if v is None else str(v))
    # Also fold details_json shallowly for stability
    dj = payload.get("details_json")
    parts.append(json.dumps(dj, sort_keys=True, separators=(",", ":")) if isinstance(dj, (dict, list)) else str(dj or ""))
    h = hashlib.sha256("|".join(parts).encode("utf-8")).hexdigest()
    return h

def log_error(payload: Dict[str, Any]) -> Dict[str, Any]:
    p = dict(payload or {})
    # Defaults
    p.setdefault("occurred_at", None)   # DB will set now()
    p.setdefault("environment", None)
    p.setdefault("http_status", None)
    p.setdefault("line_number", None)
    p.setdefault("context_tags", [])
    # Required
    if not p.get("source_system"):
        raise ValueError("source_system is required")
    if not p.get("severity"):
        raise ValueError("severity is required")
    if not p.get("message"):
        raise ValueError("message is required")

    # Dedupe
    p["dedupe_hash"] = _dedupe_hash(p)

    sql = """
    INSERT INTO shq.master_error_log (
      occurred_at, source_system, source_service, environment, severity, error_code, http_status,
      process_id, unique_id, blueprint_version_hash, schema_version, agent_execution_signature,
      mcp_bay, subagent_id, message, details_json, stack_trace, file_path, line_number,
      context_tags, dedupe_hash, created_by, updated_by, resolution_notes
    )
    VALUES (
      %(occurred_at)s, %(source_system)s, %(source_service)s, %(environment)s, %(severity)s, %(error_code)s, %(http_status)s,
      %(process_id)s, %(unique_id)s, %(blueprint_version_hash)s, %(schema_version)s, %(agent_execution_signature)s,
      %(mcp_bay)s, %(subagent_id)s, %(message)s, %(details_json)s, %(stack_trace)s, %(file_path)s, %(line_number)s,
      %(context_tags)s, %(dedupe_hash)s, %(created_by)s, %(updated_by)s, %(resolution_notes)s
    )
    ON CONFLICT (dedupe_hash) WHERE dedupe_hash IS NOT NULL
    DO UPDATE SET updated_at = now(), resolution_notes = COALESCE(EXCLUDED.resolution_notes, shq.master_error_log.resolution_notes)
    RETURNING id, occurred_at, dedupe_hash;
    """
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute(sql, p)
        row = cur.fetchone()
        conn.commit()
    return {"id": str(row[0]), "occurred_at": row[1].isoformat(), "dedupe_hash": row[2]}