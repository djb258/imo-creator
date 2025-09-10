#!/usr/bin/env python3
"""
Factory seeding mechanism for CTB + altitude generator.
Seeds ANY new app repo with the same generator, spec template, docs structure, and CI workflow.

Usage:
  python factory/seed_repo.py /path/to/new-repo

What gets seeded:
- spec/ directory with process_map template
- tools/generate_ctb.py generator script
- .github/workflows/ctb-docs.yml CI workflow
- README_CTBG.md documentation
- Basic docs structure

Requirements:
- Target repo must exist and be a git repository
- Python 3.7+ (stdlib only)
"""
import sys
import shutil
import json
from pathlib import Path

# Template spec for new repos
TEMPLATE_SPEC = {
    "meta": {
        "project": "New App",
        "version": "2025-09-04", 
        "doctrine": ["ORBT", "STAMPED/SPVPET/STACKED", "Barton"],
        "owner": "Team"
    },
    "ctb": {
        "star": "⭐ App System (40k Star)",
        "nodes": [
            {"id": "node1", "label": "Node 1 — Data Input & Validation"},
            {"id": "node2", "label": "Node 2 — Processing & Logic"},
            {"id": "node3", "label": "Node 3 — Output & Integration"},
            {"id": "node4", "label": "Node 4 — Monitoring & Control"}
        ],
        "order": ["node1", "node2", "node3", "node4"]
    },
    "databases": [
        {
            "name": "Primary DB",
            "role": "Main storage",
            "schemas": [
                {
                    "name": "app",
                    "tables": [
                        {"name": "users", "id": "01.usr.0001"},
                        {"name": "data", "id": "01.dat.0001"}
                    ]
                }
            ]
        }
    ],
    "tools": [
        {"name": "IDE", "purpose": "Development environment"},
        {"name": "CI/CD", "purpose": "Automation pipeline"}
    ],
    "mcps": [
        {"name": "Core MCP", "port": 3001, "ops": ["process", "validate"]}
    ],
    "altitudes": {
        "a30k": {
            "title": "30,000 ft — Strategic View", 
            "summary": "High-level system overview and architecture.",
            "lanes": [
                {"name": "Inputs", "items": ["User requests", "API calls", "Data feeds"]},
                {"name": "Processing", "items": ["Core logic", "Business rules", "Validation"]},
                {"name": "Storage", "items": ["Database", "Cache", "Files"]},
                {"name": "Outputs", "items": ["API responses", "UI updates", "Reports"]}
            ]
        },
        "a20k": {
            "title": "20,000 ft — Operational Design",
            "stages": ["Input validation", "Data processing", "Output generation"],
            "roles": ["Owner: Team Lead", "Developer: Engineers", "Operations: DevOps"]
        },
        "a10k": {
            "title": "10,000 ft — Tactical System Flow", 
            "steps": [
                "S1: Receive input → validate format",
                "S2: Process data → apply business logic", 
                "S3: Store results → update database",
                "S4: Generate output → return response"
            ],
            "decisions": ["Input valid?", "Processing successful?", "Output ready?"]
        },
        "a5k": {
            "title": "5,000 ft — Execution Details",
            "apis": ["REST endpoints", "Database connections", "External integrations"],
            "contracts": ["Request/response schemas", "Data validation rules"],
            "guardrails": ["Rate limiting", "Error handling", "Security checks"]
        }
    },
    "flows": [
        {"from": "User Input", "to": "Validation Layer"},
        {"from": "Validation Layer", "to": "Processing Engine"},
        {"from": "Processing Engine", "to": "Database Storage"},
        {"from": "Database Storage", "to": "Response Generator"}
    ]
}

# CI workflow template
CI_WORKFLOW = """name: Auto-regenerate CTB docs

on:
  push:
    paths:
      - 'spec/process_map.yaml'
      - 'spec/process_map.json'
      - 'tools/generate_ctb.py'
  pull_request:
    paths:
      - 'spec/process_map.yaml'  
      - 'spec/process_map.json'
      - 'tools/generate_ctb.py'

jobs:
  regenerate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          
      - name: Install PyYAML (optional)
        run: pip install pyyaml
        continue-on-error: true
        
      - name: Generate CTB docs
        run: python tools/generate_ctb.py spec/process_map.yaml
        
      - name: Check for changes
        id: changes
        run: |
          if git diff --quiet docs/; then
            echo "changed=false" >> $GITHUB_OUTPUT
          else
            echo "changed=true" >> $GITHUB_OUTPUT
          fi
          
      - name: Commit regenerated docs
        if: steps.changes.outputs.changed == 'true'
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add docs/
          git commit -m "docs: auto-regenerate CTB and altitude pages
          
          Generated from spec changes in ${{ github.sha }}
          
          🤖 Generated with [Claude Code](https://claude.ai/code)
          "
          git push
"""

def seed_repo(target_repo_path: Path):
    """Seed target repo with CTB generator and templates."""
    
    if not target_repo_path.exists():
        raise SystemExit(f"Target repo does not exist: {target_repo_path}")
        
    if not (target_repo_path / ".git").exists():
        raise SystemExit(f"Target is not a git repository: {target_repo_path}")
    
    print(f"Seeding repo: {target_repo_path}")
    
    # Create directory structure
    (target_repo_path / "spec").mkdir(exist_ok=True)
    (target_repo_path / "tools").mkdir(exist_ok=True) 
    (target_repo_path / "docs").mkdir(exist_ok=True)
    (target_repo_path / "docs" / "altitude").mkdir(exist_ok=True)
    (target_repo_path / ".github" / "workflows").mkdir(parents=True, exist_ok=True)
    
    # Copy generator script
    source_generator = Path(__file__).parent.parent / "tools" / "generate_ctb.py"
    target_generator = target_repo_path / "tools" / "generate_ctb.py"
    shutil.copy2(source_generator, target_generator)
    print(f"✓ Copied generator: {target_generator}")
    
    # Create template spec files
    spec_yaml_path = target_repo_path / "spec" / "process_map.yaml"
    spec_json_path = target_repo_path / "spec" / "process_map.json"
    
    # Convert template to YAML format (basic conversion)
    yaml_content = "---\n"
    yaml_content += f"meta:\n"
    yaml_content += f"  project: \"{TEMPLATE_SPEC['meta']['project']}\"\n"
    yaml_content += f"  version: \"{TEMPLATE_SPEC['meta']['version']}\"\n"
    yaml_content += f"  doctrine: {TEMPLATE_SPEC['meta']['doctrine']}\n"
    yaml_content += f"  owner: \"{TEMPLATE_SPEC['meta']['owner']}\"\n\n"
    yaml_content += "# Edit this file to customize your CTB and altitude pages\n"
    yaml_content += "# Run: python tools/generate_ctb.py spec/process_map.yaml\n\n"
    yaml_content += "ctb:\n"
    yaml_content += f"  star: \"{TEMPLATE_SPEC['ctb']['star']}\"\n"
    yaml_content += "  nodes:\n"
    for node in TEMPLATE_SPEC['ctb']['nodes']:
        yaml_content += f"    - id: \"{node['id']}\"\n"
        yaml_content += f"      label: \"{node['label']}\"\n"
    yaml_content += f"  order: {TEMPLATE_SPEC['ctb']['order']}\n\n"
    yaml_content += "# Add your databases, tools, mcps, altitudes, and flows here\n"
    yaml_content += "# See the source repo for full example structure\n---\n"
    
    spec_yaml_path.write_text(yaml_content, encoding="utf-8")
    spec_json_path.write_text(json.dumps(TEMPLATE_SPEC, indent=2), encoding="utf-8")
    print(f"✓ Created spec templates: {spec_yaml_path}, {spec_json_path}")
    
    # Copy README
    source_readme = Path(__file__).parent.parent / "README_CTBG.md"
    target_readme = target_repo_path / "README_CTBG.md"
    shutil.copy2(source_readme, target_readme)
    print(f"✓ Copied documentation: {target_readme}")
    
    # Create CI workflow
    workflow_path = target_repo_path / ".github" / "workflows" / "ctb-docs.yml"
    workflow_path.write_text(CI_WORKFLOW, encoding="utf-8")
    print(f"✓ Created CI workflow: {workflow_path}")
    
    # Generate initial docs
    try:
        import subprocess
        result = subprocess.run([
            sys.executable, str(target_generator), str(spec_json_path)
        ], cwd=target_repo_path, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✓ Generated initial docs:")
            print(result.stdout)
        else:
            print(f"⚠ Warning: Failed to generate initial docs: {result.stderr}")
    except Exception as e:
        print(f"⚠ Warning: Could not generate initial docs: {e}")
    
    # Install Composio .env configuration
    print("\n📋 Installing Composio .env configuration...")
    master_env_path = Path(__file__).parent.parent / 'config' / 'master.env'
    if master_env_path.exists():
        # Copy to root .env
        env_dest = target_repo_path / '.env'
        shutil.copy2(master_env_path, env_dest)
        print(f"✓ Installed .env to repository root")
        
        # Copy to mcp-servers/composio-mcp if it exists
        mcp_dir = target_repo_path / 'mcp-servers' / 'composio-mcp'
        if mcp_dir.exists():
            mcp_env_dest = mcp_dir / '.env'
            shutil.copy2(master_env_path, mcp_env_dest)
            print(f"✓ Installed .env to Composio MCP server")
        
        # Update .gitignore to exclude .env files
        gitignore_path = target_repo_path / '.gitignore'
        if gitignore_path.exists():
            gitignore_content = gitignore_path.read_text()
            if '.env' not in gitignore_content:
                with open(gitignore_path, 'a') as f:
                    f.write('\n# Environment files\n.env\n.env.local\n.env.*.local\n')
                print(f"✓ Updated .gitignore to exclude .env files")
        else:
            # Create .gitignore with .env exclusion
            gitignore_path.write_text('# Environment files\n.env\n.env.local\n.env.*.local\n')
            print(f"✓ Created .gitignore with .env exclusion")
    else:
        print(f"⚠ Master .env not found - skipping Composio configuration")
    
    # Install Claude MCP Auto-Discovery System
    print("\n📚 Installing Claude MCP auto-discovery system...")
    
    # Copy auto-discovery script
    scripts_dir = target_repo_path / 'scripts'
    scripts_dir.mkdir(exist_ok=True)
    
    source_discovery = Path(__file__).parent.parent / 'scripts' / 'mcp-auto-discovery.js'
    if source_discovery.exists():
        target_discovery = scripts_dir / 'mcp-auto-discovery.js'
        shutil.copy2(source_discovery, target_discovery)
        print(f"✓ Installed MCP auto-discovery script")
    else:
        print(f"⚠ mcp-auto-discovery.js not found - skipping auto-discovery")
    
    # Copy .claude discovery configuration
    source_claude_dir = Path(__file__).parent.parent / '.claude'
    source_discovery_json = source_claude_dir / 'mcp_discovery.json'
    if source_discovery_json.exists():
        claude_dir = target_repo_path / '.claude'
        claude_dir.mkdir(exist_ok=True)
        target_discovery_json = claude_dir / 'mcp_discovery.json'
        shutil.copy2(source_discovery_json, target_discovery_json)
        print(f"✓ Installed Claude MCP discovery configuration")
    else:
        print(f"⚠ .claude/mcp_discovery.json not found - skipping discovery config")
    
    print(f"\n🎉 Successfully seeded {target_repo_path}")
    print("\nNext steps:")
    print("1. Edit spec/process_map.yaml to match your project")
    print("2. Run: python tools/generate_ctb.py spec/process_map.yaml")
    print("3. Discover MCP servers: node scripts/mcp-auto-discovery.js")
    print("4. Review generated docs in docs/ and docs/altitude/")
    print("5. Commit all files to git (except .env)")
    print("\nInstalled systems:")
    print("• CTB generator with CI workflow")
    print("• Composio credentials (.env pre-configured)")
    print("• MCP auto-discovery system (scripts/mcp-auto-discovery.js)")
    print("• Claude discovery configuration (.claude/mcp_discovery.json)")
    print("\nClaude will auto-discover and connect to available MCP servers.")

def main():
    if len(sys.argv) != 2:
        print("Usage: python factory/seed_repo.py /path/to/target-repo")
        print("\nSeeds target repo with CTB generator, templates, and CI workflow.")
        sys.exit(1)
        
    target_path = Path(sys.argv[1]).resolve()
    seed_repo(target_path)

if __name__ == "__main__":
    main()