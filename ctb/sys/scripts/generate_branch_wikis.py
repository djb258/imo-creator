#!/usr/bin/env python3
# # CTB Metadata
# # Generated: 2025-10-23T14:32:35.762930
# # CTB Version: 1.3.3
# # Division: System Infrastructure
# # Category: scripts
# # Compliance: 100%
# # HEIR ID: HEIR-2025-10-SYS-SCRIPT-01

"""
Generate DeepWiki documentation for all branches in the imo-creator repository.

This script:
1. Lists all local branches
2. Creates a temporary repository for each branch
3. Runs DeepWiki against each branch
4. Saves the generated wiki to docs/branch-wikis/

Usage:
    python scripts/generate_branch_wikis.py [--api-key YOUR_KEY] [--provider google|openai]
"""

import subprocess
import os
import sys
import json
import requests
import time
from pathlib import Path

# Configuration
REPO_ROOT = Path(__file__).parent.parent
DEEPWIKI_API_URL = "http://localhost:8001"
WIKI_OUTPUT_DIR = REPO_ROOT / "docs" / "branch-wikis"
TEMP_DIR = REPO_ROOT / "temp_branch_repos"

# Branches to exclude from wiki generation
EXCLUDE_BRANCHES = [
    "HEAD",  # Not a real branch
]

def get_all_branches():
    """Get list of all local branches."""
    result = subprocess.run(
        ["git", "branch", "--format=%(refname:short)"],
        capture_output=True,
        text=True,
        check=True
    )
    branches = [b.strip() for b in result.stdout.strip().split('\n')]
    return [b for b in branches if b and b not in EXCLUDE_BRANCHES]

def check_deepwiki_health():
    """Check if DeepWiki API is running."""
    try:
        response = requests.get(f"{DEEPWIKI_API_URL}/health", timeout=5)
        return response.status_code == 200
    except:
        return False

def generate_wiki_for_branch(branch_name, api_key, provider="google"):
    """Generate wiki for a specific branch."""
    print(f"\n{'='*60}")
    print(f"Generating wiki for branch: {branch_name}")
    print(f"{'='*60}")

    # Create temp directory for this branch
    temp_repo = TEMP_DIR / branch_name.replace('/', '_')
    temp_repo.mkdir(parents=True, exist_ok=True)

    # Clone current repo and checkout the branch
    print(f"Creating temporary repository for {branch_name}...")
    try:
        # Initialize new repo
        subprocess.run(["git", "init"], cwd=temp_repo, check=True, capture_output=True)

        # Add remote
        subprocess.run(
            ["git", "remote", "add", "origin", str(REPO_ROOT)],
            cwd=temp_repo,
            check=True,
            capture_output=True
        )

        # Fetch the branch
        subprocess.run(
            ["git", "fetch", "origin", branch_name],
            cwd=temp_repo,
            check=True,
            capture_output=True
        )

        # Checkout the branch
        subprocess.run(
            ["git", "checkout", branch_name],
            cwd=temp_repo,
            check=True,
            capture_output=True
        )

        print(f"✓ Temporary repository created at: {temp_repo}")

    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to create temp repository: {e}")
        return False

    # Call DeepWiki API to generate wiki
    print(f"Calling DeepWiki API to analyze branch...")
    try:
        payload = {
            "repository_url": str(temp_repo.absolute()),
            "ai_provider": provider,
            "embedder_type": provider if provider == "google" else "openai",
            "generate_diagrams": True
        }

        response = requests.post(
            f"{DEEPWIKI_API_URL}/api/generate",
            json=payload,
            timeout=600  # 10 minutes timeout
        )

        if response.status_code == 200:
            wiki_data = response.json()

            # Save wiki output
            output_dir = WIKI_OUTPUT_DIR / branch_name.replace('/', '_')
            output_dir.mkdir(parents=True, exist_ok=True)

            # Save wiki JSON
            wiki_file = output_dir / "wiki.json"
            with open(wiki_file, 'w', encoding='utf-8') as f:
                json.dump(wiki_data, f, indent=2)

            # Save markdown version if available
            if 'markdown' in wiki_data:
                md_file = output_dir / "wiki.md"
                with open(md_file, 'w', encoding='utf-8') as f:
                    f.write(wiki_data['markdown'])

            print(f"✓ Wiki generated successfully!")
            print(f"  Output: {output_dir}")
            return True

        else:
            print(f"✗ DeepWiki API returned error: {response.status_code}")
            print(f"  Response: {response.text}")
            return False

    except requests.exceptions.Timeout:
        print(f"✗ Request timeout - branch may be too large or complex")
        return False
    except Exception as e:
        print(f"✗ Error calling DeepWiki API: {e}")
        return False
    finally:
        # Cleanup temp repo
        print(f"Cleaning up temporary repository...")
        import shutil
        if temp_repo.exists():
            shutil.rmtree(temp_repo, ignore_errors=True)

def main():
    """Main execution function."""
    import argparse

    parser = argparse.ArgumentParser(description="Generate DeepWiki documentation for all branches")
    parser.add_argument("--api-key", help="API key for AI provider (Google/OpenAI)")
    parser.add_argument("--provider", choices=["google", "openai"], default="google",
                       help="AI provider to use")
    parser.add_argument("--branches", nargs="+", help="Specific branches to generate (default: all)")
    parser.add_argument("--skip-health-check", action="store_true",
                       help="Skip DeepWiki health check")

    args = parser.parse_args()

    # Check if DeepWiki is running
    if not args.skip_health_check:
        print("Checking if DeepWiki API is running...")
        if not check_deepwiki_health():
            print("✗ DeepWiki API is not running!")
            print("\nPlease start DeepWiki first:")
            print("  1. cd deepwiki")
            print("  2. python -m api.main")
            print("\nOr use --skip-health-check to bypass this check")
            sys.exit(1)
        print("✓ DeepWiki API is running\n")

    # Set API key if provided
    if args.api_key:
        os.environ[f"{args.provider.upper()}_API_KEY"] = args.api_key

    # Create output directories
    WIKI_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    TEMP_DIR.mkdir(parents=True, exist_ok=True)

    # Get branches to process
    if args.branches:
        branches = args.branches
    else:
        branches = get_all_branches()

    print(f"Found {len(branches)} branches to process:")
    for branch in branches:
        print(f"  - {branch}")
    print()

    # Generate wikis for each branch
    success_count = 0
    failure_count = 0

    for i, branch in enumerate(branches, 1):
        print(f"\nProgress: {i}/{len(branches)}")
        if generate_wiki_for_branch(branch, args.api_key, args.provider):
            success_count += 1
        else:
            failure_count += 1

        # Brief pause between branches
        if i < len(branches):
            time.sleep(2)

    # Summary
    print(f"\n{'='*60}")
    print(f"SUMMARY")
    print(f"{'='*60}")
    print(f"Total branches: {len(branches)}")
    print(f"✓ Successful: {success_count}")
    print(f"✗ Failed: {failure_count}")
    print(f"\nWiki output directory: {WIKI_OUTPUT_DIR}")

if __name__ == "__main__":
    main()
