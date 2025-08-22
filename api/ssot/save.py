from http.server import BaseHTTPRequestHandler
import json
import os
import time
from hashlib import sha256
import base64

def _ts_ms():
    return int(time.time() * 1000)

def _rand16(seed):
    h = sha256(seed.encode('utf-8')).digest()
    return base64.b64encode(h[:10]).decode('ascii').replace('=', '').replace('+', '-').replace('/', '_')

def _compact_ts(ts_ms):
    t = time.gmtime(ts_ms / 1000)
    return f"{t.tm_year:04d}{t.tm_mon:02d}{t.tm_mday:02d}-{t.tm_hour:02d}{t.tm_min:02d}{t.tm_sec:02d}"

def generate_unique_id(ssot):
    db = os.getenv('DOCTRINE_DB', 'shq')
    subhive = os.getenv('DOCTRINE_SUBHIVE', '03')
    app = os.getenv('DOCTRINE_APP', 'imo')
    ts_ms = ssot.get('meta', {}).get('_created_at_ms', _ts_ms())
    app_name = ssot.get('meta', {}).get('app_name', 'imo-creator').strip()
    seed = f"{db}|{subhive}|{app}|{app_name}|{ts_ms}"
    r = _rand16(seed)
    return f"{db}-{subhive}-{app}-{_compact_ts(ts_ms)}-{r}"

def generate_process_id(ssot):
    db = os.getenv('DOCTRINE_DB', 'shq')
    subhive = os.getenv('DOCTRINE_SUBHIVE', '03')
    app = os.getenv('DOCTRINE_APP', 'imo')
    ver = os.getenv('DOCTRINE_VER', '1')
    
    stage = ssot.get('meta', {}).get('stage', 'overview').lower()
    ts_ms = ssot.get('meta', {}).get('_created_at_ms', _ts_ms())
    ymd = _compact_ts(ts_ms).split('-')[0]
    return f"{db}.{subhive}.{app}.V{ver}.{ymd}.{stage}"

def ensure_ids(ssot):
    ssot = dict(ssot or {})
    meta = dict(ssot.get('meta', {}))
    
    if '_created_at_ms' not in meta:
        meta['_created_at_ms'] = _ts_ms()
    ssot['meta'] = meta
    
    doctrine = dict(ssot.get('doctrine', {}))
    if 'unique_id' not in doctrine:
        doctrine['unique_id'] = generate_unique_id(ssot)
    if 'process_id' not in doctrine:
        doctrine['process_id'] = generate_process_id(ssot)
    if 'schema_version' not in doctrine:
        doctrine['schema_version'] = 'HEIR/1.0'
    ssot['doctrine'] = doctrine
    
    return ssot

def _scrub(o):
    OMIT = {'timestamp_last_touched', '_created_at_ms', 'blueprint_version_hash'}
    
    if isinstance(o, dict):
        result = {}
        for k in sorted(o.keys()):
            if k not in OMIT:
                result[k] = _scrub(o[k])
        return result
    elif isinstance(o, list):
        return [_scrub(v) for v in o]
    return o

def stamp_version_hash(ssot):
    canon = json.dumps(_scrub(ssot), sort_keys=True)
    h = sha256(canon.encode('utf-8')).hexdigest()
    
    ssot = dict(ssot)
    doctrine = dict(ssot.get('doctrine', {}))
    doctrine['blueprint_version_hash'] = h
    ssot['doctrine'] = doctrine
    
    return ssot

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8') if content_length else '{}'
            data = json.loads(body)
            ssot = data.get('ssot', {})
            
            ssot = ensure_ids(ssot)
            ssot = stamp_version_hash(ssot)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"ok": True, "ssot": ssot}).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": f"Failed to process SSOT: {str(e)}"}).encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()