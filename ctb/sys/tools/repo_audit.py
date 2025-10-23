#!/usr/bin/env python3
"""
Repository Audit Tool
Complete compliance checking and fixing workflow.

Usage:
    python tools/repo_audit.py /path/to/target/repo [--fix] [--dry-run]
"""

import os
import sys
import subprocess
from pathlib import Path

def run_compliance_check(repo_path: str) -> int:
    """Run compliance check and return exit code"""
    script_path = Path(__file__).parent / "repo_compliance_check.py"
    try:
        result = subprocess.run([
            sys.executable, str(script_path), repo_path
        ], capture_output=False)
        return result.returncode
    except Exception as e:
        print(f"Error running compliance check: {e}")
        return 2

def run_compliance_fixer(repo_path: str, dry_run: bool = False) -> int:
    """Run compliance fixer and return exit code"""
    script_path = Path(__file__).parent / "repo_compliance_fixer.py"
    cmd = [sys.executable, str(script_path), repo_path]
    if dry_run:
        cmd.append("--dry-run")
    
    try:
        result = subprocess.run(cmd, capture_output=False)
        return result.returncode
    except Exception as e:
        print(f"Error running compliance fixer: {e}")
        return 2

def main():
    if len(sys.argv) < 2:
        print("""Repository Audit Tool

Usage:
    python tools/repo_audit.py /path/to/target/repo [options]

Options:
    --fix       Apply automatic fixes for compliance issues
    --dry-run   Show what would be fixed without making changes
    --help      Show this help message

Examples:
    # Check compliance only
    python tools/repo_audit.py ../my-project

    # Check and apply fixes
    python tools/repo_audit.py ../my-project --fix

    # Preview what would be fixed
    python tools/repo_audit.py ../my-project --fix --dry-run
""")
        sys.exit(0)
    
    target_repo = sys.argv[1]
    apply_fixes = "--fix" in sys.argv
    dry_run = "--dry-run" in sys.argv
    
    if "--help" in sys.argv:
        main()
        return
    
    if not os.path.exists(target_repo):
        print(f"Error: Repository path does not exist: {target_repo}")
        sys.exit(1)
    
    print(f"🔍 Auditing repository: {target_repo}")
    
    # Initial compliance check
    print(f"\n{'='*50}")
    print(f"📊 INITIAL COMPLIANCE CHECK")
    print(f"{'='*50}")
    
    initial_score = run_compliance_check(target_repo)
    
    # Apply fixes if requested
    if apply_fixes:
        print(f"\n{'='*50}")
        print(f"🔧 APPLYING COMPLIANCE FIXES")
        print(f"{'='*50}")
        
        fixer_result = run_compliance_fixer(target_repo, dry_run)
        
        if fixer_result == 0 and not dry_run:
            # Re-run compliance check after fixes
            print(f"\n{'='*50}")
            print(f"📊 POST-FIX COMPLIANCE CHECK")
            print(f"{'='*50}")
            
            final_score = run_compliance_check(target_repo)
            
            print(f"\n🎯 AUDIT COMPLETE")
            if final_score == 0:
                print(f"✅ Repository is now fully compliant!")
            else:
                print(f"⚠️  Some issues remain - manual intervention may be required")
        elif dry_run:
            print(f"\n🔍 DRY RUN COMPLETE - No changes were made")
            print(f"💡 Run without --dry-run to apply these fixes")
    else:
        print(f"\n💡 To apply automatic fixes, run with --fix flag:")
        print(f"   python tools/repo_audit.py {target_repo} --fix")
    
    sys.exit(initial_score)

if __name__ == "__main__":
    main()