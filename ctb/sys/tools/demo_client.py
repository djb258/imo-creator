#!/usr/bin/env python3
"""
Demo client for IMO Creator HEIR/MCP integration
Demonstrates bay tools usage with no external dependencies
"""
import json
import yaml
import requests
import os
import time
from pathlib import Path
from typing import Dict, Any

# Configuration
BASE_DIR = Path(__file__).parent.parent
SSOT_SAMPLE_PATH = BASE_DIR / "docs" / "ssot.sample.yaml"
MCP_URL = os.getenv("IMOCREATOR_MCP_URL", "http://localhost:7001")
SIDECAR_URL = os.getenv("IMOCREATOR_SIDECAR_URL", "http://localhost:8000")
UNIQUE_ID = f"demo-{int(time.time())}-{hex(hash(str(time.time())))[-8:]}"
PROCESS_ID = f"demo-process-{UNIQUE_ID[:16]}"

def load_ssot_sample() -> Dict[str, Any]:
    """Load SSOT sample configuration"""
    if not SSOT_SAMPLE_PATH.exists():
        print(f"[ERROR] SSOT sample file not found: {SSOT_SAMPLE_PATH}")
        return {}
    
    with open(SSOT_SAMPLE_PATH, 'r') as f:
        ssot = yaml.safe_load(f)
    
    # Replace template variables
    ssot_str = yaml.dump(ssot)
    ssot_str = ssot_str.replace("${TIMESTAMP}", str(int(time.time())))
    ssot_str = ssot_str.replace("${RANDOM_HEX}", hex(hash(str(time.time())))[-8:])
    ssot_str = ssot_str.replace("${SESSION_ID}", UNIQUE_ID[:16])
    
    return yaml.safe_load(ssot_str)

def test_heir_check():
    """Test POST /heir/check with SSOT from docs/ssot.sample.yaml"""
    print(f"\n[TEST] Testing HEIR check endpoint: {MCP_URL}/heir/check")
    
    ssot = load_ssot_sample()
    if not ssot:
        return False
    
    payload = {
        "ssot": ssot
    }
    
    try:
        response = requests.post(
            f"{MCP_URL}/heir/check",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if result.get("ok"):
            print("[SUCCESS] HEIR check passed!")
            return True
        else:
            print("[ERROR] HEIR check failed")
            return False
            
    except Exception as e:
        print(f"[ERROR] Error calling HEIR check: {e}")
        return False

def test_sidecar_event():
    """Test POST to sidecar: type="blueprint.validated" """
    print(f"\n[TEST] Testing Sidecar event endpoint: {SIDECAR_URL}/events")
    
    event_payload = {
        "type": "blueprint.validated",
        "payload": {
            "blueprint_id": "demo-blueprint",
            "validation_result": {
                "passed": True,
                "checks": ["ssot", "structure", "requirements"]
            },
            "demo": True
        },
        "tags": {
            "unique_id": UNIQUE_ID,
            "process_id": PROCESS_ID,
            "source": "demo_client",
            "environment": "development"
        },
        "ts": int(time.time())
    }
    
    try:
        response = requests.post(
            f"{SIDECAR_URL}/events",
            json=event_payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200:
            print("[SUCCESS] Sidecar event logged successfully!")
            return True
        else:
            print("[ERROR] Sidecar event failed")
            return False
            
    except Exception as e:
        print(f"[ERROR] Error sending sidecar event: {e}")
        return False

def test_action_invoked_event():
    """Test action.invoked event as shown in QUICKSTART example"""
    print(f"\n[TEST] Testing action.invoked event: {SIDECAR_URL}/events")
    
    event_payload = {
        "type": "action.invoked",
        "payload": {
            "action": "demo.test",
            "parameters": {"test": True},
            "result": "success"
        },
        "tags": {
            "unique_id": UNIQUE_ID,
            "process_id": PROCESS_ID,
            "source": "demo_client"
        }
    }
    
    try:
        response = requests.post(
            f"{SIDECAR_URL}/events",
            json=event_payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        return response.status_code == 200
            
    except Exception as e:
        print(f"[ERROR] Error sending action.invoked event: {e}")
        return False

def check_services():
    """Check that services are running"""
    print("[INFO] Checking service availability...")
    
    services = [
        ("MCP Server", f"{MCP_URL}/health"),
        ("Sidecar Server", f"{SIDECAR_URL}/health")
    ]
    
    all_healthy = True
    for name, url in services:
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"[OK] {name} is healthy")
            else:
                print(f"[ERROR] {name} responded with status {response.status_code}")
                all_healthy = False
        except Exception as e:
            print(f"[ERROR] {name} is not available: {e}")
            all_healthy = False
    
    return all_healthy

def main():
    """Run all demo tests"""
    print("="*60)
    print("IMO Creator HEIR/MCP Demo Client")
    print("="*60)
    print(f"MCP URL: {MCP_URL}")
    print(f"Sidecar URL: {SIDECAR_URL}")
    print(f"Unique ID: {UNIQUE_ID}")
    print(f"Process ID: {PROCESS_ID}")
    
    # Check services first
    if not check_services():
        print("\n[ERROR] Some services are not available. Please start them:")
        print("  make run-mcp")
        print("  make run-sidecar")
        return 1
    
    # Run tests
    tests = [
        ("HEIR Check", test_heir_check),
        ("Blueprint Validated Event", test_sidecar_event),
        ("Action Invoked Event", test_action_invoked_event)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        result = test_func()
        results.append((test_name, result))
    
    # Summary
    print(f"\n{'='*60}")
    print("Demo Summary")
    print("="*60)
    for test_name, result in results:
        status = "[PASS]" if result else "[FAIL]"
        print(f"{test_name}: {status}")
    
    all_passed = all(result for _, result in results)
    if all_passed:
        print(f"\n[SUCCESS] All demo tests passed! HEIR/MCP integration is working.")
        return 0
    else:
        print(f"\n[ERROR] Some demo tests failed. Check service logs for details.")
        return 1

if __name__ == "__main__":
    exit(main())