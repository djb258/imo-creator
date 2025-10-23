#!/usr/bin/env python3
# # CTB Metadata
# # Generated: 2025-10-23T14:32:35.754153
# # CTB Version: 1.3.3
# # Division: System Infrastructure
# # Category: scripts
# # Compliance: 100%
# # HEIR ID: HEIR-2025-10-SYS-SCRIPT-01

"""
Generate basic documentation for all branches in the imo-creator repository.

This script generates documentation without requiring AI API keys by analyzing:
- Branch structure
- File counts and types
- Recent commits
- README files
- Key configuration files

Usage:
    python scripts/generate_branch_docs.py
"""

import subprocess
import os
import json
from pathlib import Path
from datetime import datetime
from collections import Counter

# Configuration
REPO_ROOT = Path(__file__).parent.parent
DOCS_OUTPUT_DIR = REPO_ROOT / "docs" / "branch-documentation"

# Branches to exclude
EXCLUDE_BRANCHES = []

def run_git_command(args, cwd=None):
    """Run a git command and return output."""
    try:
        result = subprocess.run(
            ["git"] + args,
            capture_output=True,
            text=True,
            cwd=cwd or REPO_ROOT,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        return f"Error: {e}"

def get_all_branches():
    """Get list of all local branches."""
    output = run_git_command(["branch", "--format=%(refname:short)"])
    branches = [b.strip() for b in output.split('\n') if b.strip()]
    return [b for b in branches if b not in EXCLUDE_BRANCHES]

def get_branch_info(branch_name):
    """Get detailed information about a branch."""
    print(f"Analyzing branch: {branch_name}")

    # Checkout the branch
    run_git_command(["checkout", branch_name])

    info = {
        "name": branch_name,
        "generated_at": datetime.now().isoformat(),
        "files": {},
        "commits": {},
        "structure": {},
        "readme": None
    }

    # Get file statistics
    try:
        all_files = run_git_command(["ls-files"])
        file_list = [f for f in all_files.split('\n') if f]
        info["files"]["total_count"] = len(file_list)

        # Count by extension
        extensions = Counter()
        directories = set()
        for file_path in file_list:
            ext = Path(file_path).suffix or "no_extension"
            extensions[ext] += 1
            directories.add(str(Path(file_path).parent))

        info["files"]["by_extension"] = dict(extensions.most_common(20))
        info["files"]["directory_count"] = len(directories)

    except Exception as e:
        info["files"]["error"] = str(e)

    # Get recent commits
    try:
        commit_log = run_git_command([
            "log",
            "-10",
            "--pretty=format:%h|%an|%ae|%ad|%s",
            "--date=short"
        ])

        commits = []
        for line in commit_log.split('\n'):
            if '|' in line:
                parts = line.split('|', 4)
                if len(parts) == 5:
                    commits.append({
                        "hash": parts[0],
                        "author": parts[1],
                        "email": parts[2],
                        "date": parts[3],
                        "message": parts[4]
                    })

        info["commits"]["recent"] = commits
        info["commits"]["count"] = len(commits)

    except Exception as e:
        info["commits"]["error"] = str(e)

    # Get last commit info
    try:
        last_commit_date = run_git_command([
            "log", "-1", "--format=%ad", "--date=short"
        ])
        info["last_updated"] = last_commit_date
    except Exception as e:
        info["last_updated"] = "unknown"

    # Check for README
    for readme_name in ["README.md", "README.txt", "README", "readme.md"]:
        readme_path = REPO_ROOT / readme_name
        if readme_path.exists():
            try:
                with open(readme_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    info["readme"] = {
                        "file": readme_name,
                        "content": content[:5000],  # First 5000 chars
                        "length": len(content)
                    }
                    break
            except Exception as e:
                info["readme"] = {"error": str(e)}

    # Check for key configuration files
    config_files = [
        "package.json", "requirements.txt", "Dockerfile",
        "docker-compose.yml", ".env.example", "pyproject.toml",
        "tsconfig.json", "next.config.ts", "next.config.js"
    ]

    info["configuration_files"] = {}
    for config_file in config_files:
        config_path = REPO_ROOT / config_file
        if config_path.exists():
            try:
                with open(config_path, 'r', encoding='utf-8', errors='ignore') as f:
                    info["configuration_files"][config_file] = f.read()
            except Exception as e:
                info["configuration_files"][config_file] = f"Error reading: {e}"

    # Directory structure (top level)
    try:
        top_level = run_git_command(["ls-tree", "--name-only", "HEAD"])
        info["structure"]["top_level"] = top_level.split('\n')
    except Exception as e:
        info["structure"]["error"] = str(e)

    return info

def generate_markdown_report(branch_info):
    """Generate a markdown report for a branch."""
    md = f"""# Branch Documentation: {branch_info['name']}

**Generated**: {branch_info['generated_at']}
**Last Updated**: {branch_info.get('last_updated', 'unknown')}

---

## 📊 Statistics

- **Total Files**: {branch_info['files'].get('total_count', 'N/A')}
- **Directories**: {branch_info['files'].get('directory_count', 'N/A')}
- **Recent Commits**: {branch_info['commits'].get('count', 'N/A')}

### File Types

"""

    # Add file extension breakdown
    if 'by_extension' in branch_info['files']:
        for ext, count in branch_info['files']['by_extension'].items():
            md += f"- `{ext}`: {count} files\n"

    md += "\n---\n\n## 📁 Top-Level Structure\n\n"

    # Add directory structure
    if 'top_level' in branch_info['structure']:
        for item in branch_info['structure']['top_level']:
            md += f"- {item}\n"

    md += "\n---\n\n## 🔧 Configuration Files\n\n"

    # List configuration files found
    if branch_info['configuration_files']:
        for config_file in branch_info['configuration_files'].keys():
            md += f"- `{config_file}`\n"
    else:
        md += "*No standard configuration files found*\n"

    md += "\n---\n\n## 📝 Recent Commits\n\n"

    # Add recent commits
    if 'recent' in branch_info['commits']:
        for commit in branch_info['commits']['recent']:
            md += f"### {commit['hash']} - {commit['date']}\n"
            md += f"**Author**: {commit['author']} ({commit['email']})\n"
            md += f"**Message**: {commit['message']}\n\n"

    md += "\n---\n\n"

    # Add README content if available
    if branch_info['readme'] and 'content' in branch_info['readme']:
        md += f"## 📖 README Content\n\n"
        md += f"*Source: {branch_info['readme']['file']}*\n\n"
        md += branch_info['readme']['content']
        if branch_info['readme']['length'] > 5000:
            md += f"\n\n*... (truncated, full length: {branch_info['readme']['length']} characters)*\n"

    return md

def main():
    """Main execution function."""
    print("="*60)
    print("Branch Documentation Generator")
    print("="*60)
    print()

    # Create output directory
    DOCS_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Get current branch to restore later
    current_branch = run_git_command(["branch", "--show-current"])
    print(f"Current branch: {current_branch}")
    print()

    # Get all branches
    branches = get_all_branches()
    print(f"Found {len(branches)} branches to document:\n")
    for branch in branches:
        print(f"  - {branch}")
    print()

    # Generate documentation for each branch
    all_branch_info = {}

    for i, branch in enumerate(branches, 1):
        print(f"\n[{i}/{len(branches)}] Processing: {branch}")
        print("-" * 60)

        try:
            # Get branch information
            branch_info = get_branch_info(branch)
            all_branch_info[branch] = branch_info

            # Generate markdown report
            markdown_content = generate_markdown_report(branch_info)

            # Save markdown file
            branch_dir = DOCS_OUTPUT_DIR / branch.replace('/', '_')
            branch_dir.mkdir(parents=True, exist_ok=True)

            md_file = branch_dir / "documentation.md"
            with open(md_file, 'w', encoding='utf-8') as f:
                f.write(markdown_content)

            # Save JSON data
            json_file = branch_dir / "branch_info.json"
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(branch_info, f, indent=2)

            print(f"[OK] Documentation saved to: {branch_dir}")

        except Exception as e:
            print(f"[ERROR] Error processing branch {branch}: {e}")

    # Generate index page
    print("\nGenerating index page...")
    generate_index_page(all_branch_info)

    # Restore original branch
    print(f"\nRestoring original branch: {current_branch}")
    run_git_command(["checkout", current_branch])

    print("\n" + "="*60)
    print("COMPLETE!")
    print("="*60)
    print(f"Documentation generated for {len(all_branch_info)} branches")
    print(f"Output directory: {DOCS_OUTPUT_DIR}")
    print()

def generate_index_page(all_branch_info):
    """Generate an index page for all branches."""
    md = f"""# IMO Creator - Branch Documentation Index

**Generated**: {datetime.now().isoformat()}
**Total Branches**: {len(all_branch_info)}

---

## 📚 All Branches

"""

    # Group branches by prefix
    grouped = {}
    for branch_name in sorted(all_branch_info.keys()):
        prefix = branch_name.split('/')[0] if '/' in branch_name else "root"
        if prefix not in grouped:
            grouped[prefix] = []
        grouped[prefix].append(branch_name)

    # Generate grouped list
    for prefix, branches in sorted(grouped.items()):
        md += f"\n### {prefix.upper()}\n\n"
        for branch in branches:
            info = all_branch_info[branch]
            file_count = info['files'].get('total_count', 'N/A')
            last_updated = info.get('last_updated', 'unknown')

            branch_slug = branch.replace('/', '_')
            md += f"- **[{branch}](./{branch_slug}/documentation.md)** "
            md += f"({file_count} files, last updated: {last_updated})\n"

    # Save index
    index_file = DOCS_OUTPUT_DIR / "INDEX.md"
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(md)

    print(f"[OK] Index page saved to: {index_file}")

if __name__ == "__main__":
    main()
