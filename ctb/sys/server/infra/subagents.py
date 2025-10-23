import os, httpx

BASE = os.getenv("GARAGE_MCP_URL", "")
TOKEN = os.getenv("GARAGE_MCP_TOKEN", "")
PATH = os.getenv("SUBAGENT_REGISTRY_PATH", "/registry/subagents")

FALLBACK = [
    {"id":"validate-ssot","bay":"frontend","desc":"Validate SSOT against HEIR schema"},
    {"id":"heir-check","bay":"backend","desc":"Run HEIR checks on blueprint"},
    {"id":"register-blueprint","bay":"backend","desc":"Persist + emit registration event"},
]

def list_subagents():
    if not BASE:
        return FALLBACK
    try:
        headers = {"Authorization": f"Bearer {TOKEN}"} if TOKEN else {}
        with httpx.Client(base_url=BASE, headers=headers, timeout=5.0) as c:
            r = c.get(PATH)
            r.raise_for_status()
            data = r.json()
            items = data if isinstance(data, list) else data.get("items", [])
            out = []
            for item in items:
                out.append({
                    "id": item.get("id") or item.get("name"),
                    "bay": item.get("bay") or item.get("namespace") or "unknown",
                    "desc": item.get("description") or "",
                })
            return out or FALLBACK
    except Exception:
        return FALLBACK