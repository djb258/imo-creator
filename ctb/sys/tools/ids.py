"""ID generation helpers for process, run, stage, and artifact identifiers"""
from datetime import datetime
import hashlib

def _short_hash(text: str, length: int = 8) -> str:
    """Generate short hash from text"""
    return hashlib.sha256(text.encode()).hexdigest()[:length]

def process_id(slug: str, semver: str, seed: str, dt: datetime = None) -> str:
    """Generate process ID: PRC::<SLUG>::v<semver>::YYYYMMDD::<SHORT8>"""
    if dt is None:
        dt = datetime.now()
    date_str = dt.strftime("%Y%m%d")
    short_hash = _short_hash(f"{slug}{semver}{seed}")
    return f"PRC::{slug.upper()}::v{semver}::{date_str}::{short_hash}"

def run_id(process_id: str, dt: datetime = None) -> str:
    """Generate run ID based on process ID"""
    if dt is None:
        dt = datetime.now()
    timestamp = dt.strftime("%Y%m%d_%H%M%S")
    short_hash = _short_hash(f"{process_id}{timestamp}")
    return f"RUN::{process_id}::{timestamp}::{short_hash}"

def stage_id(process_id: str, bucket: str, stage_key: str) -> str:
    """Generate stage ID"""
    short_hash = _short_hash(f"{process_id}{bucket}{stage_key}")
    return f"STG::{process_id}::{bucket.upper()}::{stage_key}::{short_hash}"

def artifact_id(stage_id: str, fingerprint: str) -> str:
    """Generate artifact ID"""
    short_hash = _short_hash(f"{stage_id}{fingerprint}")
    return f"ART::{stage_id}::{short_hash}"