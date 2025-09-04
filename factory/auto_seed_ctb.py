#!/usr/bin/env python3
"""
Auto-seeding CTB generator for Garage-MCP and IMO-Creator factory integration.
This script automatically seeds any repo (new or existing) with CTB infrastructure.

Integration points:
1. Garage-MCP: Run when fixing/updating repos
2. IMO-Creator factory: Run when creating new applications  
3. Manual: Can be run standalone on any git repo

Usage:
  python factory/auto_seed_ctb.py /path/to/repo
  python factory/auto_seed_ctb.py /path/to/repo --project-name "My App" --owner "Team"
"""
import sys
import os
import subprocess
from pathlib import Path
import json
import argparse

# Import the main seeding logic
sys.path.insert(0, str(Path(__file__).parent))
from seed_repo import seed_repo, TEMPLATE_SPEC, CI_WORKFLOW

def detect_project_info(repo_path: Path) -> dict:
    """Auto-detect project information from existing repo."""
    info = {
        "project": "Unknown App",
        "owner": "Team", 
        "existing_mcps": [],
        "existing_databases": [],
        "repo_type": "unknown"
    }
    
    # Try to get project name from package.json
    package_json = repo_path / "package.json"
    if package_json.exists():
        try:
            with open(package_json) as f:
                data = json.load(f)
                info["project"] = data.get("name", "Node.js App").replace("-", " ").title()
                info["repo_type"] = "nodejs"
        except:
            pass
    
    # Check for Python project
    if (repo_path / "requirements.txt").exists() or (repo_path / "pyproject.toml").exists():
        info["repo_type"] = "python"
        if not package_json.exists():
            info["project"] = repo_path.name.replace("-", " ").title()
    
    # Detect existing MCP servers
    mcp_servers_dir = repo_path / "mcp-servers"
    if mcp_servers_dir.exists():
        for item in mcp_servers_dir.iterdir():
            if item.is_dir() and not item.name.startswith('.'):
                info["existing_mcps"].append(item.name)
    
    # Detect database configs
    if (repo_path / ".env.example").exists():
        try:
            env_content = (repo_path / ".env.example").read_text()
            if "NEON_" in env_content or "POSTGRES" in env_content:
                info["existing_databases"].append("PostgreSQL/Neon")
            if "FIREBASE" in env_content:
                info["existing_databases"].append("Firebase")
            if "BIGQUERY" in env_content:
                info["existing_databases"].append("BigQuery")
        except:
            pass
    
    return info

def customize_spec_for_project(base_spec: dict, project_info: dict, args) -> dict:
    """Customize the template spec based on detected project info."""
    spec = base_spec.copy()
    
    # Update meta information
    spec["meta"]["project"] = args.project_name or project_info["project"]
    spec["meta"]["owner"] = args.owner or project_info["owner"]
    
    # Customize CTB star
    spec["ctb"]["star"] = f"⭐ {spec['meta']['project']} System (40k Star)"
    
    # Add detected MCP servers
    if project_info["existing_mcps"]:
        spec["mcps"] = []
        for i, mcp in enumerate(project_info["existing_mcps"]):
            spec["mcps"].append({
                "name": mcp.replace("-", " ").title(),
                "port": 3000 + i + 1,
                "ops": ["execute", "process", "validate"]
            })
    
    # Add detected databases
    if project_info["existing_databases"]:
        spec["databases"] = []
        for db in project_info["existing_databases"]:
            if "PostgreSQL" in db or "Neon" in db:
                spec["databases"].append({
                    "name": "Neon/PostgreSQL",
                    "role": "Primary data store",
                    "schemas": [
                        {
                            "name": "app",
                            "tables": [
                                {"name": "users", "id": "01.usr.0001"},
                                {"name": "data", "id": "01.dat.0001"}
                            ]
                        }
                    ]
                })
            elif "Firebase" in db:
                spec["databases"].append({
                    "name": "Firebase",
                    "role": "Real-time data",
                    "collections": [
                        {"name": "users"},
                        {"name": "sessions"},
                        {"name": "logs"}
                    ]
                })
    
    # Customize altitude pages based on repo type
    if project_info["repo_type"] == "nodejs":
        spec["tools"].extend([
            {"name": "Node.js", "purpose": "Runtime environment"},
            {"name": "Express.js", "purpose": "Web framework"}
        ])
    elif project_info["repo_type"] == "python":
        spec["tools"].extend([
            {"name": "Python", "purpose": "Runtime environment"},
            {"name": "FastAPI", "purpose": "Web framework"}
        ])
    
    return spec

def integrate_with_garage_mcp(repo_path: Path):
    """Add hooks for Garage-MCP integration."""
    garage_hooks_dir = repo_path / ".garage-mcp"
    garage_hooks_dir.mkdir(exist_ok=True)
    
    # Create CTB update hook
    ctb_hook = garage_hooks_dir / "ctb-update.py"
    ctb_hook.write_text("""#!/usr/bin/env python3
# Auto-regenerate CTB docs when Garage-MCP processes this repo
import subprocess
import sys
from pathlib import Path

def main():
    repo_root = Path(__file__).parent.parent
    generator = repo_root / "tools" / "generate_ctb.py"
    spec = repo_root / "spec" / "process_map.yaml"
    
    if generator.exists() and spec.exists():
        try:
            result = subprocess.run([
                sys.executable, str(generator), str(spec)
            ], cwd=repo_root, capture_output=True, text=True)
            
            if result.returncode == 0:
                print("[GARAGE-MCP] ✓ CTB docs regenerated")
                print(result.stdout)
            else:
                print(f"[GARAGE-MCP] ⚠ CTB regeneration failed: {result.stderr}")
        except Exception as e:
            print(f"[GARAGE-MCP] ⚠ CTB hook error: {e}")
    else:
        print("[GARAGE-MCP] No CTB generator found, skipping")

if __name__ == "__main__":
    main()
""", encoding="utf-8")
    ctb_hook.chmod(0o755)
    
    print(f"✓ Added Garage-MCP CTB update hook: {ctb_hook}")

def integrate_with_imo_factory(repo_path: Path):
    """Add IMO-Creator factory integration."""
    factory_config = repo_path / ".imo-factory.json"
    
    config = {
        "factory_version": "v2.0.0",
        "ctb_generator": {
            "enabled": True,
            "auto_regenerate": True,
            "spec_path": "spec/process_map.yaml",
            "output_path": "docs/"
        },
        "ui_build": {
            "enabled": True,
            "output_path": "ui-build/",
            "files": ["30k.md", "ctb_horiz.md", "catalog.md", "flows.md"]
        },
        "integrations": {
            "garage_mcp": True,
            "plasmic": True,
            "whimsical": True
        }
    }
    
    factory_config.write_text(json.dumps(config, indent=2), encoding="utf-8")
    print(f"✓ Added IMO-Factory config: {factory_config}")

def main():
    parser = argparse.ArgumentParser(description="Auto-seed CTB generator for any repo")
    parser.add_argument("repo_path", help="Path to repository to seed")
    parser.add_argument("--project-name", help="Override project name")
    parser.add_argument("--owner", help="Override project owner")
    parser.add_argument("--skip-garage", action="store_true", help="Skip Garage-MCP integration")
    parser.add_argument("--skip-factory", action="store_true", help="Skip IMO-Factory integration") 
    parser.add_argument("--force", action="store_true", help="Force overwrite existing files")
    
    args = parser.parse_args()
    
    repo_path = Path(args.repo_path).resolve()
    
    if not repo_path.exists():
        print(f"❌ Repository path does not exist: {repo_path}")
        sys.exit(1)
    
    if not (repo_path / ".git").exists():
        print(f"❌ Not a git repository: {repo_path}")
        sys.exit(1)
    
    print(f"🚀 Auto-seeding CTB generator for: {repo_path.name}")
    
    # Detect project information
    print("📊 Analyzing project...")
    project_info = detect_project_info(repo_path)
    print(f"   Project: {project_info['project']}")
    print(f"   Type: {project_info['repo_type']}")
    print(f"   MCPs: {len(project_info['existing_mcps'])} found")
    print(f"   Databases: {project_info['existing_databases']}")
    
    # Check if CTB already exists
    if (repo_path / "tools" / "generate_ctb.py").exists() and not args.force:
        print("⚠  CTB generator already exists. Use --force to overwrite.")
        print("   Running regeneration instead...")
        try:
            result = subprocess.run([
                sys.executable, 
                str(repo_path / "tools" / "generate_ctb.py"),
                str(repo_path / "spec" / "process_map.yaml")
            ], cwd=repo_path, capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ CTB docs regenerated successfully!")
            else:
                print(f"❌ Regeneration failed: {result.stderr}")
        except Exception as e:
            print(f"❌ Error running generator: {e}")
        return
    
    # Customize spec for this project
    print("🎯 Customizing CTB spec...")
    from seed_repo import TEMPLATE_SPEC
    custom_spec = customize_spec_for_project(TEMPLATE_SPEC, project_info, args)
    
    # Run the main seeding
    print("🌱 Seeding CTB infrastructure...")
    
    # Create directories
    (repo_path / "spec").mkdir(exist_ok=True)
    (repo_path / "tools").mkdir(exist_ok=True)
    (repo_path / "docs").mkdir(exist_ok=True)
    (repo_path / "docs" / "altitude").mkdir(exist_ok=True)
    (repo_path / "ui-build").mkdir(exist_ok=True)
    (repo_path / ".github" / "workflows").mkdir(parents=True, exist_ok=True)
    
    # Copy generator
    import shutil
    source_generator = Path(__file__).parent.parent / "tools" / "generate_ctb.py"
    target_generator = repo_path / "tools" / "generate_ctb.py"
    shutil.copy2(source_generator, target_generator)
    
    # Write customized specs
    spec_yaml_path = repo_path / "spec" / "process_map.yaml"
    spec_json_path = repo_path / "spec" / "process_map.json"
    
    # Simple YAML output for customized spec
    yaml_content = f"""---
meta:
  project: "{custom_spec['meta']['project']}"
  version: "{custom_spec['meta']['version']}"
  doctrine: {custom_spec['meta']['doctrine']}
  owner: "{custom_spec['meta']['owner']}"

ctb:
  star: "{custom_spec['ctb']['star']}"
  nodes:
"""
    for node in custom_spec['ctb']['nodes']:
        yaml_content += f"""    - id: "{node['id']}"
      label: "{node['label']}"
"""
    yaml_content += f"""  order: {custom_spec['ctb']['order']}

# Customize the sections below for your specific project
# Run: python tools/generate_ctb.py spec/process_map.yaml
# See the source IMO-Creator repo for full examples

databases: []
tools: []  
mcps: []
altitudes: {{}}
flows: []
---"""
    
    spec_yaml_path.write_text(yaml_content, encoding="utf-8")
    spec_json_path.write_text(json.dumps(custom_spec, indent=2), encoding="utf-8")
    
    # Add CI workflow
    workflow_path = repo_path / ".github" / "workflows" / "ctb-docs.yml"
    workflow_path.write_text(CI_WORKFLOW, encoding="utf-8")
    
    # Add integrations
    if not args.skip_garage:
        integrate_with_garage_mcp(repo_path)
    
    if not args.skip_factory:
        integrate_with_imo_factory(repo_path)
    
    # Generate initial docs
    print("📖 Generating initial docs...")
    try:
        result = subprocess.run([
            sys.executable, str(target_generator), str(spec_json_path)
        ], cwd=repo_path, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Initial CTB docs generated!")
        else:
            print(f"⚠ Warning: Doc generation failed: {result.stderr}")
    except Exception as e:
        print(f"⚠ Warning: Could not generate docs: {e}")
    
    # Copy to ui-build
    docs_to_copy = ["30k.md", "ctb_horiz.md", "catalog.md", "flows.md"]
    ui_build_dir = repo_path / "ui-build"
    for doc in docs_to_copy:
        source = repo_path / "docs" / doc
        if source.exists():
            shutil.copy2(source, ui_build_dir / doc)
    
    # Create ui-build README
    ui_readme = ui_build_dir / "README.md"
    ui_readme.write_text(f"""# UI Build Resources - {custom_spec['meta']['project']}

Auto-generated CTB documentation for UI design and Plasmic integration.

## Files:
- **30k.md** - Strategic overview (perfect for dashboard layout)
- **ctb_horiz.md** - Navigation flow
- **catalog.md** - Data structures  
- **flows.md** - Information flows

## Usage:
1. Copy content from these files
2. Use with CustomGPT → Plasmic workflow
3. Auto-updates when spec/ changes

Generated from: `spec/process_map.yaml`
""", encoding="utf-8")
    
    print("🎉 CTB generator successfully integrated!")
    print(f"\n📁 Files created:")
    print(f"   ✓ spec/process_map.yaml (customized)")
    print(f"   ✓ tools/generate_ctb.py")
    print(f"   ✓ .github/workflows/ctb-docs.yml")
    print(f"   ✓ ui-build/ (ready for Plasmic)")
    
    if not args.skip_garage:
        print(f"   ✓ .garage-mcp/ctb-update.py")
    
    if not args.skip_factory:
        print(f"   ✓ .imo-factory.json")
    
    print(f"\n📝 Next steps:")
    print(f"   1. Edit spec/process_map.yaml for your project")
    print(f"   2. Run: python tools/generate_ctb.py spec/process_map.yaml")
    print(f"   3. Review docs/ and ui-build/ folders")
    print(f"   4. Commit all files to git")
    print(f"\n🔄 Auto-regeneration:")
    print(f"   • GitHub Actions will regenerate on spec changes")
    print(f"   • Garage-MCP will update CTB when processing this repo")
    print(f"   • IMO-Factory will maintain consistency")

if __name__ == "__main__":
    main()