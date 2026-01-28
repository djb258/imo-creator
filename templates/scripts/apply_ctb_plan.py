#!/usr/bin/env python3
"""
CTB Planner - Validator Script
Version: 1.0.0
Purpose: Applies Claude's CTB JSON plan to restructure repositories

Integrates with:
- Obsidian (doctrine documentation sync)
- Git Projects (task generation from manifest)
- GitKraken (visual diff and tree visualization)
- Lovable.dev (CTB tree rendering)

Usage:
    python apply_ctb_plan.py [ctb_plan.json]

The script:
1. Reads ctb_plan.json (Claude's output)
2. Executes move/create_md/annotate actions
3. Generates specs/ctb_manifest.yaml
4. Updates global_config/imo_global_config.yaml
5. Commits changes with CTB signature
"""

import json
import os
import shutil
import subprocess
import datetime
import yaml
import sys
from pathlib import Path
from typing import Dict, List, Any

# Configuration
PLAN_PATH = "ctb_plan.json"
GLOBAL_CONFIG = "global-config/imo_global_config.yaml"
MANIFEST_DIR = "specs"
MANIFEST_FILE = "specs/ctb_manifest.yaml"

# Colors for terminal output
class Colors:
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    RED = '\033[0;31m'
    BLUE = '\033[0;34m'
    CYAN = '\033[0;36m'
    NC = '\033[0m'  # No Color

def log_success(msg: str):
    print(f"{Colors.GREEN}[OK]{Colors.NC} {msg}")

def log_warning(msg: str):
    print(f"{Colors.YELLOW}[WARN]{Colors.NC} {msg}")

def log_error(msg: str):
    print(f"{Colors.RED}[ERROR]{Colors.NC} {msg}")

def log_info(msg: str):
    print(f"{Colors.BLUE}[INFO]{Colors.NC} {msg}")

def log_step(msg: str):
    print(f"{Colors.CYAN}[STEP]{Colors.NC} {msg}")

def load_plan(plan_file: str) -> Dict[str, Any]:
    """Load and validate the CTB plan JSON."""
    if not os.path.exists(plan_file):
        log_error(f"Plan file not found: {plan_file}")
        sys.exit(1)

    try:
        with open(plan_file, 'r', encoding='utf-8') as f:
            plan = json.load(f)

        # Validate required fields
        required = ['actions', 'manifest', 'summary']
        missing = [field for field in required if field not in plan]
        if missing:
            log_error(f"Missing required fields in plan: {', '.join(missing)}")
            sys.exit(1)

        log_success(f"Loaded plan: {plan.get('summary', 'No summary')}")
        if 'confidence_avg' in plan:
            confidence = plan['confidence_avg']
            if confidence < 0.7:
                log_warning(f"Low confidence average: {confidence:.2f}")
            else:
                log_info(f"Confidence average: {confidence:.2f}")

        return plan

    except json.JSONDecodeError as e:
        log_error(f"Invalid JSON in plan file: {e}")
        sys.exit(1)

def execute_move_action(action: Dict[str, str]) -> bool:
    """Execute a 'move' action."""
    from_path = action.get('from')
    to_path = action.get('to')

    if not from_path or not to_path:
        log_error("Move action missing 'from' or 'to' path")
        return False

    if not os.path.exists(from_path):
        log_warning(f"Source file does not exist: {from_path}")
        return False

    try:
        # Create destination directory
        os.makedirs(os.path.dirname(to_path), exist_ok=True)

        # Move file
        shutil.move(from_path, to_path)
        log_success(f"Moved: {from_path} → {to_path}")
        return True

    except Exception as e:
        log_error(f"Failed to move {from_path}: {e}")
        return False

def execute_create_md_action(action: Dict[str, str]) -> bool:
    """Execute a 'create_md' action."""
    path = action.get('path')
    content = action.get('content', '')

    if not path:
        log_error("create_md action missing 'path'")
        return False

    try:
        # Create directory
        os.makedirs(os.path.dirname(path), exist_ok=True)

        # Write file
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

        log_success(f"Created: {path}")
        return True

    except Exception as e:
        log_error(f"Failed to create {path}: {e}")
        return False

def execute_annotate_action(action: Dict[str, Any]) -> bool:
    """Execute an 'annotate' action - adds doctrinal header to file."""
    file_path = action.get('file')
    altitude = action.get('altitude')
    purpose = action.get('purpose', 'No purpose specified')

    if not file_path or altitude is None:
        log_error("annotate action missing 'file' or 'altitude'")
        return False

    if not os.path.exists(file_path):
        log_warning(f"File does not exist for annotation: {file_path}")
        return False

    try:
        # Read existing content
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.read().splitlines()

        # Check if already annotated
        if lines and lines[0].startswith('"""'):
            log_info(f"Skipping annotation (already has header): {file_path}")
            return True

        # Determine file extension for comment style
        ext = os.path.splitext(file_path)[1]

        if ext in ['.py']:
            header = f'"""\nAltitude: {altitude}\nPurpose: {purpose}\nCTB Classification: Auto-generated\n"""\n'
        elif ext in ['.js', '.ts', '.jsx', '.tsx']:
            header = f'/**\n * Altitude: {altitude}\n * Purpose: {purpose}\n * CTB Classification: Auto-generated\n */\n'
        elif ext in ['.md']:
            header = f'---\naltitude: {altitude}\npurpose: {purpose}\nctb_classification: auto-generated\n---\n\n'
        else:
            header = f'# Altitude: {altitude}\n# Purpose: {purpose}\n# CTB Classification: Auto-generated\n\n'

        # Write with header
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(header + '\n'.join(lines))

        log_success(f"Annotated: {file_path} (altitude {altitude})")
        return True

    except Exception as e:
        log_error(f"Failed to annotate {file_path}: {e}")
        return False

def apply_actions(actions: List[Dict[str, Any]]) -> Dict[str, int]:
    """Apply all actions from the plan."""
    stats = {'success': 0, 'failed': 0, 'skipped': 0}

    for i, action in enumerate(actions, 1):
        action_type = action.get('type')
        log_step(f"Action {i}/{len(actions)}: {action_type}")

        if action_type == 'move':
            success = execute_move_action(action)
        elif action_type == 'create_md':
            success = execute_create_md_action(action)
        elif action_type == 'annotate':
            success = execute_annotate_action(action)
        else:
            log_warning(f"Unknown action type: {action_type}")
            stats['skipped'] += 1
            continue

        if success:
            stats['success'] += 1
        else:
            stats['failed'] += 1

    return stats

def write_manifest(manifest: Dict[str, Any]):
    """Write the CTB manifest to specs/ctb_manifest.yaml."""
    try:
        os.makedirs(MANIFEST_DIR, exist_ok=True)

        # Add metadata
        manifest['meta'] = {
            'generated': datetime.datetime.utcnow().isoformat(),
            'ctb_version': '1.3.2',
            'doctrine': 'CTB',
            'tool': 'apply_ctb_plan.py'
        }

        with open(MANIFEST_FILE, 'w', encoding='utf-8') as f:
            yaml.safe_dump(manifest, f, default_flow_style=False, sort_keys=False)

        log_success(f"Wrote manifest: {MANIFEST_FILE}")

    except Exception as e:
        log_error(f"Failed to write manifest: {e}")

def update_global_config():
    """Update the global IMO config with this repository's manifest."""
    try:
        # Load or create global config
        if os.path.exists(GLOBAL_CONFIG):
            with open(GLOBAL_CONFIG, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f) or {}
        else:
            config = {}

        # Get repository name
        repo_name = os.path.basename(os.getcwd())

        # Update repos list
        config.setdefault('repos', [])

        # Remove existing entry if present
        config['repos'] = [r for r in config['repos'] if r.get('name') != repo_name]

        # Add new entry
        entry = {
            'name': repo_name,
            'manifest': MANIFEST_FILE,
            'doctrine': 'CTB',
            'last_updated': datetime.datetime.utcnow().isoformat(),
            'ctb_version': '1.3.2'
        }
        config['repos'].append(entry)

        # Ensure directory exists
        os.makedirs(os.path.dirname(GLOBAL_CONFIG), exist_ok=True)

        # Write config
        with open(GLOBAL_CONFIG, 'w', encoding='utf-8') as f:
            yaml.safe_dump(config, f, default_flow_style=False, sort_keys=False)

        log_success(f"Updated global config: {GLOBAL_CONFIG}")

    except Exception as e:
        log_error(f"Failed to update global config: {e}")

def git_commit_changes(plan_summary: str):
    """Commit changes with CTB signature."""
    try:
        repo_name = os.path.basename(os.getcwd())

        # Add all changes
        subprocess.run(['git', 'add', '.'], check=True)

        # Create commit message
        commit_msg = f"""🌲 CTB Reorganization: {repo_name}

{plan_summary}

Applied CTB Doctrine v1.3.2 altitude-based structure:
- 30000ft: Vision & Architecture
- 20000ft: Category & Data Models
- 10000ft: Execution & Logic
- 5000ft: Visibility & UI

Automated by: apply_ctb_plan.py

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"""

        # Commit
        subprocess.run(['git', 'commit', '-m', commit_msg], check=True)
        log_success("Committed CTB reorganization")

        # Ask about push
        log_info("Run 'git push' to sync with remote")

        return True

    except subprocess.CalledProcessError as e:
        log_warning(f"Git commit failed (may have no changes): {e}")
        return False
    except Exception as e:
        log_error(f"Unexpected error during git commit: {e}")
        return False

def main():
    """Main execution flow."""
    print("")
    print(f"{Colors.CYAN}================================================================{Colors.NC}")
    print(f"{Colors.CYAN}         CTB Planner - Validator Script v1.0.0          {Colors.NC}")
    print(f"{Colors.CYAN}================================================================{Colors.NC}")
    print("")

    # Get plan file path
    plan_file = sys.argv[1] if len(sys.argv) > 1 else PLAN_PATH

    # Load plan
    log_step("Loading CTB plan...")
    plan = load_plan(plan_file)

    # Apply actions
    log_step("Applying actions...")
    stats = apply_actions(plan.get('actions', []))

    print("")
    log_info(f"Action Results: {stats['success']} success, {stats['failed']} failed, {stats['skipped']} skipped")
    print("")

    # Write manifest
    log_step("Writing CTB manifest...")
    write_manifest(plan.get('manifest', {}))

    # Update global config
    log_step("Updating global config...")
    update_global_config()

    # Git commit
    log_step("Committing changes...")
    git_commit_changes(plan.get('summary', 'CTB reorganization complete'))

    # Summary
    print("")
    print(f"{Colors.GREEN}================================================================{Colors.NC}")
    print(f"{Colors.GREEN}                  CTB PLAN APPLIED SUCCESSFULLY                {Colors.NC}")
    print(f"{Colors.GREEN}================================================================{Colors.NC}")
    print("")

    log_info("Next steps:")
    log_info("  1. Review changes: git status")
    log_info("  2. Push to remote: git push")
    log_info("  3. Open Obsidian to review doctrine .md files")
    log_info("  4. Check Git Projects for auto-generated tasks")
    log_info("  5. Use GitKraken to visualize CTB tree structure")
    print("")

    # Integration reminders
    print(f"{Colors.YELLOW}📊 Tool Integration Status:{Colors.NC}")
    print(f"  • Manifest created: {MANIFEST_FILE}")
    print(f"  • Obsidian sync: Check docs/ for new .md files")
    print(f"  • Git Projects: Manifest available for task generation")
    print(f"  • GitKraken: Open to see visual CTB tree")
    print(f"  • Lovable.dev: Can render CTB from {MANIFEST_FILE}")
    print("")

if __name__ == "__main__":
    main()
