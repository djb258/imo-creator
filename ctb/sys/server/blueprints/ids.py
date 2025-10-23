import os, time, hashlib, base64
from typing import Dict

def _ts_ms() -> int:
    return int(time.time() * 1000)

def _rand16(seed: str) -> str:
    h = hashlib.sha256(seed.encode("utf-8")).digest()
    return base64.b32encode(h[:10]).decode("utf-8").rstrip("=")

def _compact_ts(ts_ms: int) -> str:
    import datetime as dt
    t = dt.datetime.fromtimestamp(ts_ms/1000.0, dt.timezone.utc)
    return t.strftime("%Y%m%d-%H%M%S")

def generate_unique_id(ssot: Dict) -> str:
    db        = os.getenv("DOCTRINE_DB", "shq")
    subhive   = os.getenv("DOCTRINE_SUBHIVE", "03")
    app       = os.getenv("DOCTRINE_APP", "imo")
    ts_ms     = int(ssot.get("meta", {}).get("_created_at_ms") or _ts_ms())
    app_name  = (ssot.get("meta", {}).get("app_name") or "imo-creator").strip()
    seed      = f"{db}|{subhive}|{app}|{app_name}|{ts_ms}"
    r = _rand16(seed)
    return f"{db}-{subhive}-{app}-{_compact_ts(ts_ms)}-{r}"

def generate_process_id(ssot: Dict) -> str:
    db      = os.getenv("DOCTRINE_DB", "shq")
    subhive = os.getenv("DOCTRINE_SUBHIVE", "03")
    app     = os.getenv("DOCTRINE_APP", "imo")
    ver     = os.getenv("DOCTRINE_VER", "1")

    stage = (ssot.get("meta", {}).get("stage") or "overview").lower()
    ts_ms = int(ssot.get("meta", {}).get("_created_at_ms") or _ts_ms())
    ymd = _compact_ts(ts_ms).split("-")[0]
    return f"{db}.{subhive}.{app}.V{ver}.{ymd}.{stage}"

def ensure_ids(ssot: Dict) -> Dict:
    ssot = dict(ssot or {})
    meta = dict(ssot.get("meta") or {})
    if "_created_at_ms" not in meta:
        meta["_created_at_ms"] = _ts_ms()
    ssot["meta"] = meta

    doctrine = dict(ssot.get("doctrine") or {})
    if not doctrine.get("unique_id"):
        doctrine["unique_id"] = generate_unique_id(ssot)
    if not doctrine.get("process_id"):
        doctrine["process_id"] = generate_process_id(ssot)
    doctrine.setdefault("schema_version", "HEIR/1.0")
    ssot["doctrine"] = doctrine
    return ssot