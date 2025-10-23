#!/usr/bin/env python3
"""
Simple Garage Bay - Simplified version for demo without virtual env complexity
"""

import argparse, os, re, subprocess, sys, json, pathlib
from pathlib import Path

ROOT = pathlib.Path(__file__).resolve().parent
RESULTS_DIR = ROOT / "audit_results"

def sh(cmd, cwd=None, check=True):
    print(f"[$] {cmd}")
    result = subprocess.run(cmd, cwd=cwd, shell=True, check=check, text=True, capture_output=True)
    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print("STDERR:", result.stderr)
    return result

def parse_target(s: str):
    if re.match(r"^[\w\-]+/[\w\.\-]+$", s):  # owner/repo
        return f"https://github.com/{s}.git", "main", None
    if s.startswith("http"):
        return s, "main", None
    # else treat as path
    p = pathlib.Path(s).expanduser().resolve()
    if not p.exists():
        print(f"Target path not found: {p}", file=sys.stderr)
        sys.exit(1)
    return None, None, p

def run_checks(target_dir: pathlib.Path, outdir: pathlib.Path):
    outdir.mkdir(parents=True, exist_ok=True)
    console = outdir / "console.log"
    summary = outdir / "summary.json"

    log = []

    def run_and_capture(cmd, cwd=None, ok_codes=(0,)):
        try:
            r = subprocess.run(cmd, cwd=cwd, shell=True, text=True, capture_output=True)
            log.append(f"=== Command: {cmd} ===\n")
            log.append(r.stdout or "")
            log.append(r.stderr or "")
            log.append(f"\nReturn code: {r.returncode}\n\n")
            return r.returncode in ok_codes
        except subprocess.CalledProcessError as e:
            log.append(f"=== Command Failed: {cmd} ===\n")
            log.append(str(e))
            log.append("\n\n")
            return False

    # IMO Creator compliance check
    imo_compliance_tool = ROOT / "tools" / "repo_compliance_check.py"
    if imo_compliance_tool.exists():
        log.append("=== IMO Creator Compliance Check ===\n")
        run_and_capture(f'python "{imo_compliance_tool}" "{target_dir}"')

    # Check for existing compliance heartbeat
    heartbeat_file = target_dir / "imo-compliance-check.py"
    if heartbeat_file.exists():
        log.append("=== Repository Compliance Heartbeat ===\n")
        run_and_capture(f'python "{heartbeat_file}"', cwd=target_dir)

    # Write logs
    console.write_text("".join(log), encoding="utf-8")

    # Parse results
    txt = console.read_text(encoding="utf-8")
    
    # Extract compliance score
    compliance_score = 0
    compliance_match = re.search(r"Overall Score: ([\d.]+)%", txt)
    if compliance_match:
        compliance_score = float(compliance_match.group(1))

    # Extract check results
    checks = {}
    check_lines = re.findall(r"\[(PASS|FAIL)\] (.+)", txt)
    for status, check_name in check_lines:
        checks[check_name.lower().replace(" ", "_")] = status == "PASS"

    # Check if heartbeat is present
    has_heartbeat = heartbeat_file.exists()
    has_config = (target_dir / ".imo-compliance.json").exists()

    summary_data = {
        "timestamp": str(pathlib.Path().resolve()),
        "target": str(target_dir),
        "imo_creator": {
            "compliance_score": compliance_score,
            "checks": checks,
            "heartbeat_installed": has_heartbeat,
            "config_present": has_config
        },
        "summary": {
            "total_issues": len(re.findall(r"\b(ERROR|FAIL|FAILURE)\b", txt)),
            "recommendations_available": "Recommendations:" in txt,
            "fully_compliant": compliance_score >= 100,
            "monitoring_enabled": has_heartbeat and has_config
        }
    }
    
    summary.write_text(json.dumps(summary_data, indent=2), encoding="utf-8")
    return summary_data

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--target", required=True, help="Path or GitHub (owner/repo or URL).")
    ap.add_argument("--apply-fixes", action="store_true", help="Apply IMO Creator compliance fixes.")
    args = ap.parse_args()

    git_url, ref, local_path = parse_target(args.target)
    
    if git_url:
        print(f"Note: GitHub cloning not implemented in simple version")
        print(f"Please clone manually: git clone {git_url}")
        sys.exit(1)
    
    target_dir = local_path
    repo_name = target_dir.name
    outdir = RESULTS_DIR / repo_name
    
    print(f"\nSimple Garage Bay Audit")
    print(f"Target: {target_dir}")
    print(f"Output: {outdir}")
    print("=" * 60)
    
    out = run_checks(target_dir, outdir)

    print("\n=== AUDIT SUMMARY ===")
    print(json.dumps(out, indent=2))
    print(f"\nLogs:    {outdir/'console.log'}")
    print(f"Summary: {outdir/'summary.json'}")

    # Show key insights
    imo = out.get("imo_creator", {})
    summary = out.get("summary", {})
    
    print(f"\nKey Results:")
    print(f"   Compliance Score: {imo.get('compliance_score', 0)}%")
    print(f"   Fully Compliant: {'Yes' if summary.get('fully_compliant') else 'No'}")
    print(f"   Heartbeat Monitoring: {'Enabled' if summary.get('monitoring_enabled') else 'Disabled'}")
    print(f"   Total Issues: {summary.get('total_issues', 0)}")

    # Apply fixes if requested
    if args.apply_fixes and imo.get('compliance_score', 0) < 100:
        print("\n=== APPLYING COMPLIANCE FIXES ===")
        fixer_tool = ROOT / "tools" / "repo_compliance_fixer.py"
        if fixer_tool.exists():
            try:
                result = sh(f'python "{fixer_tool}" "{target_dir}"', check=False)
                if result.returncode == 0:
                    print("Fixes applied successfully!")
                    
                    # Re-run compliance check
                    print("\n=== POST-FIX COMPLIANCE CHECK ===")
                    post_fix_results = run_checks(target_dir, outdir / "post_fix")
                    post_score = post_fix_results.get("imo_creator", {}).get("compliance_score", 0)
                    print(f"Post-fix compliance score: {post_score}%")
                else:
                    print("Some fixes failed - check logs for details")
            except Exception as e:
                print(f"Error applying fixes: {e}")

    print(f"\nFor full workflow: python garage_bay.py --target {target_dir}")

if __name__ == "__main__":
    main()