#!/usr/bin/env python3
"""HEIR/ORBT BMAD Policy Checker - Ensures compliance with IMO-Creator standards"""
import os, json, sys, glob, yaml
from datetime import datetime

# Load HEIR policy
policy_path = "heir/policy_bmad.yaml"
if os.path.exists(policy_path):
    with open(policy_path) as f:
        policy = yaml.safe_load(f)
else:
    policy = {
        "required_fields": ["trace_id","process_id","blueprint_id","agent_id","duration_s","exit_code","ts"]
    }

strict = os.getenv("HEIR_STRICT","1")=="1"
required = set(policy.get("required_fields", []))
ok = True
violations = []

# Check BMAD logs for HEIR/ORBT compliance
log_files = sorted(glob.glob("logs/bmad/*.log"))[-5:] if glob.glob("logs/bmad/*.log") else []
json_files = sorted(glob.glob("logs/bmad/*.json"))[-10:] if glob.glob("logs/bmad/*.json") else []

print("[HEIR/ORBT] BMAD Policy Validation Starting...")
print(f"[HEIR/ORBT] Checking {len(log_files)} log files and {len(json_files)} json traces")

# Check log files
for f in log_files:
    try:
        with open(f) as file:
            for line_num, line in enumerate(file, 1):
                try:
                    obj = json.loads(line)
                    missing = required - set(obj.keys())
                    if missing:
                        violations.append(f"Missing fields {missing} in {f}:{line_num}")
                        ok = False
                    
                    # Check HEIR VIN format if process_id looks like VIN
                    if "process_id" in obj and obj["process_id"].startswith("IMO-"):
                        if not obj["process_id"].match(r"^IMO-\d{4}-\d{2}-[A-Z]+-[A-Z]+-V\d+$"):
                            violations.append(f"Invalid VIN format in {f}:{line_num}")
                            ok = False
                            
                except json.JSONDecodeError:
                    pass
    except Exception as e:
        violations.append(f"Error reading {f}: {e}")

# Check JSON traces
for f in json_files:
    try:
        with open(f) as file:
            obj = json.load(file)
            missing = required - set(obj.keys())
            if missing:
                violations.append(f"Missing fields {missing} in {f}")
                ok = False
                
            # Check performance regression if baseline exists
            if "duration_s" in obj:
                baseline_file = f.replace(".json", ".baseline.json")
                if os.path.exists(baseline_file):
                    with open(baseline_file) as bf:
                        baseline = json.load(bf)
                        if "duration_s" in baseline:
                            regression = ((obj["duration_s"] - baseline["duration_s"]) / baseline["duration_s"]) * 100
                            if regression > 10:
                                violations.append(f"Performance regression {regression:.1f}% in {f}")
                                if strict:
                                    ok = False
                                    
    except Exception as e:
        violations.append(f"Error checking {f}: {e}")

# Report results
if violations:
    print("[HEIR/ORBT] Policy Violations Found:")
    for v in violations[:10]:  # Show first 10 violations
        print(f"  - {v}")
    if len(violations) > 10:
        print(f"  ... and {len(violations)-10} more violations")

if not ok and strict:
    print(f"[HEIR/ORBT] BMAD policy FAILED (strict mode)")
    print("[HEIR/ORBT] Set HEIR_STRICT=0 to allow warn-only mode")
    sys.exit(1)
elif not ok:
    print(f"[HEIR/ORBT] BMAD policy WARNINGS (warn-only mode)")
else:
    print(f"[HEIR/ORBT] BMAD policy PASSED")

# Factory/Garage integration check
if os.path.exists("health.json"):
    with open("health.json") as f:
        health = json.load(f)
        if health.get("factory", {}).get("status") != "healthy":
            print("[HEIR/ORBT] WARNING: Factory health check not passing")
        if health.get("garage", {}).get("status") != "operational":
            print("[HEIR/ORBT] WARNING: Garage not operational")

print(f"[HEIR/ORBT] Compliance check complete (strict={'1' if strict else '0'})")