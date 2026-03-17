"""Register svg-brain as a Composio custom tool via OpenAPI spec upload."""
import os
import sys
import json
import yaml
import requests

API_KEY = os.environ.get("COMPOSIO_API_KEY")
if not API_KEY:
    print("ERROR: COMPOSIO_API_KEY not set")
    sys.exit(1)

# Read the OpenAPI spec
spec_path = os.path.join(os.path.dirname(__file__), "..", "docs", "openapi.yaml")
with open(spec_path, "r") as f:
    spec = yaml.safe_load(f)

print(f"OpenAPI spec loaded: {spec['info']['title']} v{spec['info']['version']}")
print(f"Endpoints: {len(spec.get('paths', {}))}")

HEADERS = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
}
BASE = "https://backend.composio.dev/api"

# Try v3 endpoints in order of likelihood
ENDPOINTS = [
    ("POST", f"{BASE}/v3/openapi/apps", {"openapi_spec": spec, "name": "svg_brain"}),
    ("POST", f"{BASE}/v3/apps/openapi", {"openapi_spec": spec, "name": "svg_brain"}),
    ("POST", f"{BASE}/v3/custom-tools", {"openapi_spec": spec, "name": "svg_brain"}),
    ("POST", f"{BASE}/v3/tools/custom", {"spec": spec, "name": "svg_brain"}),
]

for method, url, body in ENDPOINTS:
    try:
        print(f"\nTrying: {method} {url}")
        resp = requests.request(method, url, headers=HEADERS, json=body, timeout=15)
        print(f"  Status: {resp.status_code}")
        if resp.status_code < 500:
            try:
                data = resp.json()
                print(f"  Response: {json.dumps(data, indent=2)[:500]}")
            except Exception:
                print(f"  Body: {resp.text[:300]}")
            if resp.status_code in (200, 201):
                print("\nSUCCESS! Tool registered.")
                sys.exit(0)
    except requests.exceptions.Timeout:
        print("  Timed out")
    except Exception as e:
        print(f"  Error: {e}")

print("\n---")
print("Automatic registration did not find a working endpoint.")
print("Manual registration steps:")
print("1. Go to https://app.composio.dev/apps")
print("2. Click 'Add Custom Tool' or 'Import OpenAPI'")
print("3. Upload: svg-brain/docs/openapi.yaml")
print("4. Auth: API Key, header name: X-API-Key")
print(f"5. Set key value from Doppler: imo-creator/dev/SVG_BRAIN_API_KEY")
