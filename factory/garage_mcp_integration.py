#!/usr/bin/env python3
"""
Garage-MCP integration for CTB generator.
Hooks into Garage-MCP workflow to automatically seed/update CTB docs.

Integration points:
- Pre-processing hook: Seed CTB if not present
- Post-processing hook: Regenerate CTB docs
- Health check: Verify CTB compliance

Usage (called by Garage-MCP):
  python factory/garage_mcp_integration.py pre-process /path/to/repo
  python factory/garage_mcp_integration.py post-process /path/to/repo  
  python factory/garage_mcp_integration.py health-check /path/to/repo
"""
import sys
import subprocess
from pathlib import Path
import json
import argparse

def pre_process_repo(repo_path: Path):
    """Called before Garage-MCP processes a repo."""
    print(f"[GARAGE-MCP] Pre-processing CTB for: {repo_path.name}")
    
    # Check if CTB generator exists
    generator = repo_path / "tools" / "generate_ctb.py"
    spec = repo_path / "spec" / "process_map.yaml"
    
    if not generator.exists() or not spec.exists():
        print("[GARAGE-MCP] CTB generator not found, auto-seeding...")
        
        # Run auto-seeding
        auto_seeder = Path(__file__).parent / "auto_seed_ctb.py"
        try:
            result = subprocess.run([
                sys.executable, str(auto_seeder), str(repo_path),
                "--project-name", repo_path.name.replace("-", " ").title()
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                print("[GARAGE-MCP] ✓ CTB generator seeded successfully")
            else:
                print(f"[GARAGE-MCP] ⚠ Seeding failed: {result.stderr}")
        except Exception as e:
            print(f"[GARAGE-MCP] ⚠ Auto-seeding error: {e}")
    else:
        print("[GARAGE-MCP] ✓ CTB generator already present")

def post_process_repo(repo_path: Path):
    """Called after Garage-MCP finishes processing a repo."""
    print(f"[GARAGE-MCP] Post-processing CTB for: {repo_path.name}")
    
    generator = repo_path / "tools" / "generate_ctb.py"
    spec = repo_path / "spec" / "process_map.yaml"
    
    if generator.exists() and spec.exists():
        print("[GARAGE-MCP] Regenerating CTB docs...")
        
        try:
            result = subprocess.run([
                sys.executable, str(generator), str(spec)
            ], cwd=repo_path, capture_output=True, text=True)
            
            if result.returncode == 0:
                print("[GARAGE-MCP] ✓ CTB docs regenerated")
                
                # Update ui-build folder
                update_ui_build_folder(repo_path)
                
                # Check if we should commit
                if should_auto_commit(repo_path):
                    commit_ctb_updates(repo_path)
                    
            else:
                print(f"[GARAGE-MCP] ⚠ CTB regeneration failed: {result.stderr}")
        except Exception as e:
            print(f"[GARAGE-MCP] ⚠ CTB regeneration error: {e}")
    else:
        print("[GARAGE-MCP] No CTB generator found, skipping regeneration")

def health_check_repo(repo_path: Path):
    """Check CTB compliance and health."""
    print(f"[GARAGE-MCP] CTB health check for: {repo_path.name}")
    
    health = {
        "ctb_generator_present": False,
        "spec_exists": False,
        "docs_generated": False,
        "ui_build_ready": False,
        "ci_workflow_present": False,
        "compliance_score": 0
    }
    
    # Check generator
    if (repo_path / "tools" / "generate_ctb.py").exists():
        health["ctb_generator_present"] = True
        health["compliance_score"] += 20
    
    # Check spec
    if (repo_path / "spec" / "process_map.yaml").exists():
        health["spec_exists"] = True
        health["compliance_score"] += 20
    
    # Check generated docs
    docs_dir = repo_path / "docs"
    required_docs = ["ctb_horiz.md", "catalog.md", "flows.md"]
    altitude_docs = ["30k.md", "20k.md", "10k.md", "5k.md"]
    
    if docs_dir.exists():
        existing_docs = [f.name for f in docs_dir.iterdir() if f.is_file()]
        altitude_dir = docs_dir / "altitude"
        if altitude_dir.exists():
            existing_altitude = [f.name for f in altitude_dir.iterdir() if f.is_file()]
        else:
            existing_altitude = []
        
        if all(doc in existing_docs for doc in required_docs):
            health["docs_generated"] = True
            health["compliance_score"] += 20
        
        if all(doc in existing_altitude for doc in altitude_docs):
            health["compliance_score"] += 10
    
    # Check ui-build
    ui_build = repo_path / "ui-build"
    if ui_build.exists() and (ui_build / "30k.md").exists():
        health["ui_build_ready"] = True
        health["compliance_score"] += 15
    
    # Check CI workflow
    if (repo_path / ".github" / "workflows" / "ctb-docs.yml").exists():
        health["ci_workflow_present"] = True
        health["compliance_score"] += 15
    
    print(f"[GARAGE-MCP] CTB Compliance Score: {health['compliance_score']}/100")
    
    if health["compliance_score"] < 80:
        print(f"[GARAGE-MCP] ⚠ Low CTB compliance, consider running auto-seeding")
    else:
        print(f"[GARAGE-MCP] ✓ Good CTB compliance")
    
    return health

def update_ui_build_folder(repo_path: Path):
    """Update ui-build folder with latest docs."""
    import shutil
    
    ui_build_dir = repo_path / "ui-build"
    if not ui_build_dir.exists():
        ui_build_dir.mkdir()
    
    docs_to_copy = {
        "docs/ctb_horiz.md": "ctb_horiz.md",
        "docs/catalog.md": "catalog.md", 
        "docs/flows.md": "flows.md",
        "docs/altitude/30k.md": "30k.md"
    }
    
    for source_rel, target_name in docs_to_copy.items():
        source = repo_path / source_rel
        target = ui_build_dir / target_name
        
        if source.exists():
            shutil.copy2(source, target)
            print(f"[GARAGE-MCP]   ✓ Updated {target_name}")

def should_auto_commit(repo_path: Path) -> bool:
    """Check if we should auto-commit CTB updates."""
    config_file = repo_path / ".imo-factory.json"
    
    if config_file.exists():
        try:
            with open(config_file) as f:
                config = json.load(f)
                return config.get("ctb_generator", {}).get("auto_commit", False)
        except:
            pass
    
    # Default: only auto-commit if no uncommitted changes exist
    try:
        result = subprocess.run([
            "git", "status", "--porcelain"
        ], cwd=repo_path, capture_output=True, text=True)
        
        # If only docs/ and ui-build/ changes, it's safe to commit
        lines = result.stdout.strip().split('\n') if result.stdout.strip() else []
        non_doc_changes = [line for line in lines if not (
            line.endswith('.md') and ('docs/' in line or 'ui-build/' in line)
        )]
        
        return len(non_doc_changes) == 0
        
    except:
        return False

def commit_ctb_updates(repo_path: Path):
    """Commit CTB documentation updates."""
    try:
        # Add docs and ui-build
        subprocess.run([
            "git", "add", "docs/", "ui-build/"
        ], cwd=repo_path, check=True)
        
        # Check if there's anything to commit
        result = subprocess.run([
            "git", "status", "--porcelain", "--cached"
        ], cwd=repo_path, capture_output=True, text=True)
        
        if result.stdout.strip():
            # Commit with Garage-MCP signature
            subprocess.run([
                "git", "commit", "-m", 
                "docs: auto-update CTB documentation via Garage-MCP\n\n"
                "Generated from spec changes during Garage-MCP processing\n\n"
                "🤖 Generated with [Claude Code](https://claude.ai/code)\n"
                "🔧 Processed by Garage-MCP"
            ], cwd=repo_path, check=True)
            
            print("[GARAGE-MCP] ✓ CTB updates committed")
        else:
            print("[GARAGE-MCP] No CTB changes to commit")
            
    except subprocess.CalledProcessError as e:
        print(f"[GARAGE-MCP] ⚠ Commit failed: {e}")
    except Exception as e:
        print(f"[GARAGE-MCP] ⚠ Commit error: {e}")

def main():
    parser = argparse.ArgumentParser(description="Garage-MCP CTB integration")
    parser.add_argument("action", choices=["pre-process", "post-process", "health-check"],
                       help="Integration action to perform")
    parser.add_argument("repo_path", help="Path to repository")
    
    args = parser.parse_args()
    repo_path = Path(args.repo_path).resolve()
    
    if not repo_path.exists() or not (repo_path / ".git").exists():
        print(f"[GARAGE-MCP] ❌ Invalid git repository: {repo_path}")
        sys.exit(1)
    
    if args.action == "pre-process":
        pre_process_repo(repo_path)
    elif args.action == "post-process":
        post_process_repo(repo_path)
    elif args.action == "health-check":
        health = health_check_repo(repo_path)
        # Exit with non-zero if compliance is too low
        if health["compliance_score"] < 50:
            sys.exit(1)

if __name__ == "__main__":
    main()