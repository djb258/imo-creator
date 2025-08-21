#!/usr/bin/env python3
"""
garage_bay.py — Run Garage‑MCP + HEIR checks against any repo.

Usage:
  python garage_bay.py --target /path/to/repo [--open-code]
  python garage_bay.py --target https://github.com/owner/repo.git --ref main [--open-code]
  python garage_bay.py --target owner/repo --ref main [--open-code]

Outputs:
  ./audit_results/<repo-name>/console.log
  ./audit_results/<repo-name>/summary.json
"""

import argparse, os, re, shutil, subprocess, sys, tempfile, json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent
TOOLS_DIR = ROOT / "garage_tools"
RESULTS_DIR = ROOT / "audit_results"
GARAGE_MCP_DIR = ROOT / "garage-mcp"  # Use existing garage-mcp in imo-creator

GARAGE_MCP_URL = "https://github.com/djb258/garage-mcp.git"  # If needed for future
HEIR_URL       = "https://github.com/djb258/HEIR-AGENT-SYSTEM.git"

PY_ENV = ROOT / ".garage-venv"

def sh(cmd, cwd=None, check=True):
    print(f"[$] {cmd}")
    return subprocess.run(cmd, cwd=cwd, shell=True, check=check, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

def ensure_tools():
    TOOLS_DIR.mkdir(parents=True, exist_ok=True)
    
    # Check if we have garage-mcp integrated already (preferred)
    if GARAGE_MCP_DIR.exists():
        print(f"[INFO] Using integrated garage-mcp at {GARAGE_MCP_DIR}")
    else:
        # Fallback to cloning external tools if needed
        tools = [
            ("HEIR-AGENT-SYSTEM", HEIR_URL),
        ]
        for name, url in tools:
            dest = TOOLS_DIR / name
            if not dest.exists():
                try:
                    sh(f"git clone --depth=1 {url} {dest}")
                except subprocess.CalledProcessError as e:
                    print(f"[WARN] Could not clone {name}: {e}")
                    continue
            else:
                try:
                    sh("git fetch --depth=1 origin", cwd=dest)
                    # try common default branches
                    for br in ("main", "master"):
                        try:
                            sh(f"git checkout {br}", cwd=dest)
                            sh(f"git reset --hard origin/{br}", cwd=dest)
                            break
                        except subprocess.CalledProcessError:
                            continue
                except subprocess.CalledProcessError as e:
                    print(f"[WARN] Could not update {name}: {e}")
                    continue

def ensure_pyenv():
    if not PY_ENV.exists():
        sh(f"python -m venv {PY_ENV}")
    act = PY_ENV / ("Scripts/activate" if os.name == "nt" else "bin/activate")
    if not act.exists():
        print("Virtualenv activation script missing.", file=sys.stderr)
        sys.exit(1)
    return str(act)

def pip_install(req_path):
    if req_path.exists():
        sh(f'{PY_ENV / ("Scripts/pip" if os.name == "nt" else "bin/pip")} install -r "{req_path}"')

def parse_target(s: str):
    if re.match(r"^[\w\-]+/[\w\.\-]+$", s):  # owner/repo
        return f"https://github.com/{s}.git", "main", None
    if s.startswith("http"):
        # optional /tree/<ref>
        ref = "main"
        m = re.search(r"/tree/([^/]+)", s)
        if m:
            ref = m.group(1)
        # ensure .git at end for cloning
        git_url = s if s.endswith(".git") else (s.rstrip("/") + ".git")
        return git_url, ref, None
    # else treat as path
    p = pathlib.Path(s).expanduser().resolve()
    if not p.exists():
        print(f"Target path not found: {p}", file=sys.stderr)
        sys.exit(1)
    return None, None, p

def clone_to_tmp(git_url, ref):
    tmp = pathlib.Path(tempfile.mkdtemp(prefix="garage_bay_"))
    name = git_url.rstrip("/").split("/")[-1].replace(".git", "")
    dest = tmp / name
    sh(f'git clone --depth=1 --branch "{ref}" "{git_url}" "{dest}"')
    return dest

def run_checks(target_dir: pathlib.Path, outdir: pathlib.Path):
    outdir.mkdir(parents=True, exist_ok=True)
    console = outdir / "console.log"
    summary = outdir / "summary.json"

    # Install deps for tools
    act = ensure_pyenv()
    pip_bin = PY_ENV / ("Scripts/pip" if os.name == "nt" else "bin/pip")
    python_bin = PY_ENV / ("Scripts/python" if os.name == "nt" else "bin/python")

    # Upgrade pip quickly
    sh(f'{pip_bin} install -U pip')

    # Try to install tool requirements
    # Use integrated garage-mcp if available
    if GARAGE_MCP_DIR.exists():
        mcp_req = GARAGE_MCP_DIR / "requirements.txt"
        if mcp_req.exists():
            pip_install(mcp_req)
    else:
        mcp_req = TOOLS_DIR / "garage-mcp" / "requirements.txt"
        pip_install(mcp_req)
    
    heir_req = TOOLS_DIR / "HEIR-AGENT-SYSTEM" / "requirements.txt"
    pip_install(heir_req)

    log = []

    def run_and_capture(cmd, cwd=None, ok_codes=(0,)):
        try:
            r = sh(cmd, cwd=cwd, check=False)
            log.append(r.stdout)
            return r.returncode in ok_codes
        except subprocess.CalledProcessError as e:
            log.append(e.stdout or str(e))
            return False

    # IMO Creator compliance check first
    imo_compliance_tool = ROOT / "tools" / "repo_compliance_check.py"
    if imo_compliance_tool.exists():
        log.append("=== IMO Creator Compliance Check ===\n")
        run_and_capture(f'{python_bin} "{imo_compliance_tool}" "{target_dir}"')
        log.append("\n")

    # HEIR checks - check both integrated and external locations
    heir_checks_locations = [
        GARAGE_MCP_DIR / "packages" / "heir" / "checks.py",
        TOOLS_DIR / "garage-mcp" / "packages" / "heir" / "checks.py", 
        TOOLS_DIR / "HEIR-AGENT-SYSTEM" / "checks.py"
    ]
    
    heir_found = False
    for heir_checks_py in heir_checks_locations:
        if heir_checks_py.exists():
            log.append("=== HEIR System Checks ===\n")
            run_and_capture(f'{python_bin} "{heir_checks_py}" --path "{target_dir}"')
            log.append("\n")
            heir_found = True
            break
    
    if not heir_found:
        log.append("[WARN] HEIR checks.py not found in expected locations; skipping.\n")

    # Garage-MCP checks - prioritize integrated version
    mcp_dir = GARAGE_MCP_DIR if GARAGE_MCP_DIR.exists() else TOOLS_DIR / "garage-mcp"
    log.append("=== Garage-MCP Checks ===\n")
    
    if (mcp_dir / "Makefile").exists():
        run_and_capture(f'make -C "{mcp_dir}" check PATH_TO_TARGET="{target_dir}"')
    else:
        # Try MCP modules we've built
        mcp_modules = [
            mcp_dir / "services" / "mcp" / "modules" / "subagent_delegator.py",
            mcp_dir / "services" / "sidecar" / "main.py"
        ]
        
        mcp_found = False
        for mcp_check in mcp_modules:
            if mcp_check.exists():
                run_and_capture(f'{python_bin} "{mcp_check}" --check "{target_dir}"', ok_codes=(0, 1))
                mcp_found = True
                break
        
        if not mcp_found:
            log.append("[WARN] MCP checker not found; using available modules.\n")

    # Run IMO Creator MCP orchestrator if available
    mcp_orchestrator = ROOT / "tools" / "repo_mcp_orchestrator.py"
    if mcp_orchestrator.exists():
        log.append("=== IMO Creator MCP Orchestration ===\n")
        run_and_capture(f'{python_bin} "{mcp_orchestrator}" "{target_dir}"', ok_codes=(0, 1))
        log.append("\n")

    # Write logs
    console.write_text("".join(log), encoding="utf-8")

    # Enhanced summary parsing
    txt = console.read_text(encoding="utf-8")
    
    # Extract IMO Creator compliance score
    compliance_score = 0
    compliance_match = re.search(r"Overall Score: ([\d.]+)%", txt)
    if compliance_match:
        compliance_score = float(compliance_match.group(1))

    # Extract specific check results
    checks = {}
    check_lines = re.findall(r"\[(PASS|FAIL)\] (.+)", txt)
    for status, check_name in check_lines:
        checks[check_name.lower().replace(" ", "_")] = status == "PASS"

    summary_data = {
        "timestamp": json.dumps(pathlib.Path().resolve(), default=str),
        "target": str(target_dir),
        "imo_creator": {
            "compliance_score": compliance_score,
            "checks": checks
        },
        "heir": {
            "errors": len(re.findall(r"\bERROR\b", txt)),
            "warnings": len(re.findall(r"\bWARN(ING)?\b", txt)),
        },
        "garage_mcp": {
            "failures": len(re.findall(r"\bFAIL(URE)?\b", txt)),
        },
        "summary": {
            "total_issues": len(re.findall(r"\b(ERROR|FAIL|FAILURE)\b", txt)),
            "recommendations_available": "Recommendations:" in txt
        }
    }
    
    summary.write_text(json.dumps(summary_data, indent=2), encoding="utf-8")
    return summary_data

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--target", required=True, help="Path or GitHub (owner/repo or URL).")
    ap.add_argument("--ref", default="main", help="Branch or tag when cloning.")
    ap.add_argument("--open-code", action="store_true", help="Open repository in VS Code after audit.")
    ap.add_argument("--apply-fixes", action="store_true", help="Apply IMO Creator compliance fixes after audit.")
    args = ap.parse_args()

    ensure_tools()

    git_url, ref, local_path = parse_target(args.target)
    target_dir = None
    tmp_root = None

    if git_url:
        target_dir = clone_to_tmp(git_url, args.ref or ref)
        tmp_root = target_dir.parent
    else:
        target_dir = local_path

    repo_name = target_dir.name
    outdir = RESULTS_DIR / repo_name
    out = run_checks(target_dir, outdir)

    print("\n=== GARAGE BAY AUDIT SUMMARY ===")
    print(json.dumps(out, indent=2))
    print(f"\nLogs:    {outdir/'console.log'}")
    print(f"Summary: {outdir/'summary.json'}\n")

    # Apply fixes if requested and compliance score is low
    if args.apply_fixes and out.get("imo_creator", {}).get("compliance_score", 0) < 100:
        print("=== APPLYING COMPLIANCE FIXES ===")
        fixer_tool = ROOT / "tools" / "repo_compliance_fixer.py"
        if fixer_tool.exists():
            try:
                python_bin = PY_ENV / ("Scripts/python" if os.name == "nt" else "bin/python")
                result = sh(f'{python_bin} "{fixer_tool}" "{target_dir}"', check=False)
                if result.returncode == 0:
                    print("Fixes applied successfully!")
                    
                    # Re-run compliance check
                    print("\n=== POST-FIX COMPLIANCE CHECK ===")
                    post_fix_results = run_checks(target_dir, outdir / "post_fix")
                    print("Post-fix compliance score:", post_fix_results.get("imo_creator", {}).get("compliance_score", 0))
                else:
                    print("Some fixes failed - check logs for details")
            except Exception as e:
                print(f"Error applying fixes: {e}")

    if args.open_code:
        # Open in VS Code if 'code' is on PATH
        try:
            sh(f'code "{target_dir}"', check=False)
        except Exception:
            pass

    # If we cloned, keep the tmp around for inspection; uncomment to auto-clean:
    # if tmp_root and tmp_root.exists(): shutil.rmtree(tmp_root)

if __name__ == "__main__":
    main()