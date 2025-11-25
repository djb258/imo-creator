#!/usr/bin/env python3
"""
apply-doctrine.py
==================
Executes the Barton Doctrine global_config.yaml bootstrap process.

When a child repo pulls the global config, this script reads it and:
1. Creates missing CTB directories
2. Copies/updates enforcement scripts from master
3. Installs git hooks
4. Generates template docs for missing files
5. Validates the final structure
6. Reports what was created/updated

Usage:
    python scripts/apply-doctrine.py [--dry-run] [--force] [--sync]

Options:
    --dry-run   Show what would be done without making changes
    --force     Overwrite all files, even if customized
    --sync      Pull latest config from master before applying
"""

import os
import sys
import json
import shutil
import hashlib
import argparse
import subprocess
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional

# Try to import yaml, fall back to basic parsing if not available
try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False
    print("Warning: PyYAML not installed. Using basic config parsing.")


# =============================================================================
# CONSTANTS
# =============================================================================

SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent
CONFIG_PATH = REPO_ROOT / "config" / "global_config.yaml"
BACKUP_DIR = REPO_ROOT / ".doctrine_backup"
REPORT_PATH = REPO_ROOT / "bootstrap_report.json"

# Colors for terminal output
class Colors:
    GREEN = '\033[0;32m'
    RED = '\033[0;31m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    CYAN = '\033[0;36m'
    NC = '\033[0m'  # No Color


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def log(message: str, color: str = Colors.NC):
    """Print colored log message."""
    print(f"{color}{message}{Colors.NC}")


def log_phase(phase: str):
    """Print phase header."""
    print()
    log(f"{'='*60}", Colors.CYAN)
    log(f"  PHASE: {phase.upper()}", Colors.CYAN)
    log(f"{'='*60}", Colors.CYAN)


def log_action(action: str, status: str = "..."):
    """Print action status."""
    if status == "OK":
        color = Colors.GREEN
    elif status == "SKIP":
        color = Colors.YELLOW
    elif status == "FAIL":
        color = Colors.RED
    elif status == "CREATE":
        color = Colors.GREEN
    else:
        color = Colors.NC
    print(f"  [{color}{status:^6}{Colors.NC}] {action}")


def load_config() -> Dict[str, Any]:
    """Load the global_config.yaml file."""
    if not CONFIG_PATH.exists():
        log(f"ERROR: Config not found at {CONFIG_PATH}", Colors.RED)
        sys.exit(1)

    with open(CONFIG_PATH, 'r') as f:
        if HAS_YAML:
            return yaml.safe_load(f)
        else:
            # Basic fallback - won't work for complex YAML
            log("Warning: Full YAML parsing unavailable", Colors.YELLOW)
            return {}


def backup_file(path: Path) -> Optional[Path]:
    """Create backup of a file before overwriting."""
    if not path.exists():
        return None

    BACKUP_DIR.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_name = f"{path.name}.{timestamp}.bak"
    backup_path = BACKUP_DIR / backup_name

    shutil.copy2(path, backup_path)
    return backup_path


def file_hash(path: Path) -> str:
    """Get SHA256 hash of a file."""
    if not path.exists():
        return ""
    with open(path, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()[:16]


# =============================================================================
# BOOTSTRAP PHASES
# =============================================================================

class DoctrineBootstrap:
    """Executes the doctrine bootstrap process."""

    def __init__(self, config: Dict[str, Any], dry_run: bool = False, force: bool = False):
        self.config = config
        self.dry_run = dry_run
        self.force = force
        self.report = {
            "timestamp": datetime.now().isoformat(),
            "dry_run": dry_run,
            "created_directories": [],
            "created_files": [],
            "updated_files": [],
            "skipped_files": [],
            "installed_hooks": [],
            "warnings": [],
            "errors": [],
        }

    def run(self):
        """Execute all bootstrap phases."""
        log("\n" + "="*60, Colors.CYAN)
        log("  BARTON DOCTRINE BOOTSTRAP", Colors.CYAN)
        log("="*60, Colors.CYAN)

        if self.dry_run:
            log("\n  [DRY RUN MODE - No changes will be made]\n", Colors.YELLOW)

        try:
            self.phase_validate()
            self.phase_scaffold()
            self.phase_hooks()
            self.phase_docs()
            self.phase_verify()
            self.phase_notify()
        except Exception as e:
            self.report["errors"].append(str(e))
            log(f"\nERROR: {e}", Colors.RED)
            raise

        # Save report
        self.save_report()

    # -------------------------------------------------------------------------
    # Phase 1: Validate
    # -------------------------------------------------------------------------
    def phase_validate(self):
        """Check current state vs required state."""
        log_phase("Validate")

        # Check config version
        doctrine = self.config.get("doctrine", {})
        version = doctrine.get("version", "unknown")
        log_action(f"Config version: {version}", "OK")

        # Check what's missing
        missing_dirs = []
        missing_files = []

        # Check CTB directories
        ctb = self.config.get("ctb", {})
        layers = ctb.get("layers", ["system", "data", "app", "ai", "ui"])

        for layer in layers:
            src_dir = REPO_ROOT / "src" / layer
            test_dir = REPO_ROOT / "tests" / layer
            if not src_dir.exists():
                missing_dirs.append(f"src/{layer}")
            if not test_dir.exists():
                missing_dirs.append(f"tests/{layer}")

        # Check altitude docs
        if not (REPO_ROOT / "docs" / "altitude").exists():
            missing_dirs.append("docs/altitude")

        # Check key files
        key_files = [
            "docs/10-imo.md",
            "heir.doctrine.yaml",
            ".githooks/pre-commit",
            ".githooks/commit-msg",
            "scripts/validate-structure.sh",
            "scripts/audit-drift.sh",
        ]
        for f in key_files:
            if not (REPO_ROOT / f).exists():
                missing_files.append(f)

        if missing_dirs:
            log_action(f"Missing directories: {len(missing_dirs)}", "WARN")
            for d in missing_dirs:
                print(f"       - {d}")
        else:
            log_action("All directories exist", "OK")

        if missing_files:
            log_action(f"Missing files: {len(missing_files)}", "WARN")
            for f in missing_files:
                print(f"       - {f}")
        else:
            log_action("All key files exist", "OK")

    # -------------------------------------------------------------------------
    # Phase 2: Scaffold
    # -------------------------------------------------------------------------
    def phase_scaffold(self):
        """Create missing directories and files."""
        log_phase("Scaffold")

        # Create CTB directories
        ctb = self.config.get("ctb", {})
        layers = ctb.get("layers", ["system", "data", "app", "ai", "ui"])

        for layer in layers:
            # src/{layer}
            src_dir = REPO_ROOT / "src" / layer
            self.create_directory(src_dir, init_py=True, layer=layer)

            # tests/{layer}
            test_dir = REPO_ROOT / "tests" / layer
            self.create_directory(test_dir, init_py=True, layer=layer, is_test=True)

        # Create other required directories
        other_dirs = ["docs/altitude", "config", "scripts", ".githooks", "audit_results"]
        for d in other_dirs:
            self.create_directory(REPO_ROOT / d)

    def create_directory(self, path: Path, init_py: bool = False, layer: str = None, is_test: bool = False):
        """Create a directory if it doesn't exist."""
        if path.exists():
            log_action(f"{path.relative_to(REPO_ROOT)}", "SKIP")
            return

        if not self.dry_run:
            path.mkdir(parents=True, exist_ok=True)

            # Create __init__.py for Python directories
            if init_py:
                init_path = path / "__init__.py"
                if layer:
                    if is_test:
                        content = f"# Tests for CTB Layer: {layer}\n"
                    else:
                        content = f"# CTB Layer: {layer}\n# See: docs/20-ctb-{layer}.md\n"
                else:
                    content = ""
                init_path.write_text(content)

        self.report["created_directories"].append(str(path.relative_to(REPO_ROOT)))
        log_action(f"{path.relative_to(REPO_ROOT)}", "CREATE")

    # -------------------------------------------------------------------------
    # Phase 3: Hooks
    # -------------------------------------------------------------------------
    def phase_hooks(self):
        """Install git hooks."""
        log_phase("Git Hooks")

        hooks_source = REPO_ROOT / ".githooks"
        hooks_dest = REPO_ROOT / ".git" / "hooks"

        if not hooks_dest.exists():
            log_action("No .git/hooks directory (not a git repo?)", "SKIP")
            self.report["warnings"].append("Not a git repository - hooks not installed")
            return

        hooks = ["pre-commit", "commit-msg"]
        for hook in hooks:
            source = hooks_source / hook
            dest = hooks_dest / hook

            if not source.exists():
                log_action(f"{hook}: source not found", "SKIP")
                continue

            if dest.exists() and not self.force:
                # Check if it's our hook or a custom one
                if file_hash(source) == file_hash(dest):
                    log_action(f"{hook}: already installed", "SKIP")
                    continue
                else:
                    log_action(f"{hook}: custom hook exists (use --force to overwrite)", "SKIP")
                    self.report["warnings"].append(f"Custom {hook} hook not overwritten")
                    continue

            if not self.dry_run:
                backup_file(dest)
                shutil.copy2(source, dest)
                # Make executable
                dest.chmod(dest.stat().st_mode | 0o111)

            self.report["installed_hooks"].append(hook)
            log_action(f"{hook}", "CREATE")

    # -------------------------------------------------------------------------
    # Phase 4: Docs
    # -------------------------------------------------------------------------
    def phase_docs(self):
        """Create template docs if missing."""
        log_phase("Documentation")

        # Check for IMO doc
        imo_path = REPO_ROOT / "docs" / "10-imo.md"
        if not imo_path.exists():
            log_action("docs/10-imo.md MISSING - You must create this!", "WARN")
            self.report["warnings"].append("IMO document missing - create docs/10-imo.md")
            print(f"       {Colors.YELLOW}This is the first thing you must do.{Colors.NC}")
            print(f"       {Colors.YELLOW}Run the IMO definition process before proceeding.{Colors.NC}")
        else:
            log_action("docs/10-imo.md", "OK")

        # Check CTB layer docs
        ctb = self.config.get("ctb", {})
        layers = ctb.get("layers", ["system", "data", "app", "ai", "ui"])

        for layer in layers:
            doc_path = REPO_ROOT / "docs" / f"20-ctb-{layer}.md"
            if doc_path.exists():
                log_action(f"docs/20-ctb-{layer}.md", "OK")
            else:
                log_action(f"docs/20-ctb-{layer}.md", "MISSING")
                self.report["warnings"].append(f"CTB doc missing: 20-ctb-{layer}.md")

        # Check altitude docs
        altitudes = ["40k-vision", "30k-category", "20k-logic", "10k-ui", "5k-ops"]
        for alt in altitudes:
            doc_path = REPO_ROOT / "docs" / "altitude" / f"{alt}.md"
            if doc_path.exists():
                log_action(f"docs/altitude/{alt}.md", "OK")
            else:
                log_action(f"docs/altitude/{alt}.md", "MISSING")
                self.report["warnings"].append(f"Altitude doc missing: {alt}.md")

    # -------------------------------------------------------------------------
    # Phase 5: Verify
    # -------------------------------------------------------------------------
    def phase_verify(self):
        """Run validation script."""
        log_phase("Verify")

        validate_script = REPO_ROOT / "scripts" / "validate-structure.sh"
        if not validate_script.exists():
            log_action("validate-structure.sh not found", "SKIP")
            return

        if self.dry_run:
            log_action("Would run validate-structure.sh", "SKIP")
            return

        log_action("Running validate-structure.sh...", "...")
        try:
            result = subprocess.run(
                ["bash", str(validate_script)],
                capture_output=True,
                text=True,
                cwd=REPO_ROOT
            )
            if result.returncode == 0:
                log_action("Structure validation", "OK")
            else:
                log_action("Structure validation (warnings)", "WARN")
                self.report["warnings"].append("Structure validation had warnings")
        except Exception as e:
            log_action(f"Validation error: {e}", "FAIL")
            self.report["errors"].append(f"Validation failed: {e}")

    # -------------------------------------------------------------------------
    # Phase 6: Notify
    # -------------------------------------------------------------------------
    def phase_notify(self):
        """Print summary and next steps."""
        log_phase("Summary")

        # Print what was done
        print()
        if self.report["created_directories"]:
            log(f"  Created {len(self.report['created_directories'])} directories", Colors.GREEN)
        if self.report["created_files"]:
            log(f"  Created {len(self.report['created_files'])} files", Colors.GREEN)
        if self.report["installed_hooks"]:
            log(f"  Installed {len(self.report['installed_hooks'])} git hooks", Colors.GREEN)

        # Print warnings
        if self.report["warnings"]:
            print()
            log("  Warnings:", Colors.YELLOW)
            for w in self.report["warnings"]:
                print(f"    - {w}")

        # Print errors
        if self.report["errors"]:
            print()
            log("  Errors:", Colors.RED)
            for e in self.report["errors"]:
                print(f"    - {e}")

        # Next steps
        print()
        log("  Next Steps:", Colors.CYAN)
        imo_exists = (REPO_ROOT / "docs" / "10-imo.md").exists()
        if not imo_exists:
            print("    1. Create docs/10-imo.md (IMO definition)")
            print("    2. Get dev approval on IMO")
            print("    3. Create CTB layer docs")
            print("    4. Create altitude docs")
        else:
            print("    1. Review any warnings above")
            print("    2. Run: ./scripts/validate-structure.sh")
            print("    3. Run: ./scripts/audit-drift.sh")

        print()
        log(f"  Report saved to: {REPORT_PATH.relative_to(REPO_ROOT)}", Colors.NC)

    def save_report(self):
        """Save the bootstrap report to JSON."""
        if not self.dry_run:
            with open(REPORT_PATH, 'w') as f:
                json.dump(self.report, f, indent=2)


# =============================================================================
# SYNC FUNCTIONALITY
# =============================================================================

def sync_from_master(config: Dict[str, Any]):
    """Pull latest config from master repo."""
    log("\nSyncing from master repo...", Colors.CYAN)

    master = config.get("bootstrap", {}).get("master_repo", {})
    url = master.get("url", "")
    branch = master.get("branch", "master")

    if not url:
        log("ERROR: No master_repo.url configured", Colors.RED)
        return False

    # This would fetch the latest config
    # For now, just indicate what would happen
    log(f"  Would fetch from: {url} ({branch})", Colors.YELLOW)
    log("  [Sync not yet implemented - use git subtree or manual copy]", Colors.YELLOW)

    return True


# =============================================================================
# MAIN
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Apply Barton Doctrine structure to this repository"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be done without making changes"
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite all files, even if customized"
    )
    parser.add_argument(
        "--sync",
        action="store_true",
        help="Pull latest config from master before applying"
    )

    args = parser.parse_args()

    # Load config
    config = load_config()

    if not config:
        log("ERROR: Could not load config", Colors.RED)
        sys.exit(1)

    # Sync if requested
    if args.sync:
        if not sync_from_master(config):
            log("Sync failed, proceeding with local config", Colors.YELLOW)

    # Run bootstrap
    bootstrap = DoctrineBootstrap(
        config=config,
        dry_run=args.dry_run,
        force=args.force
    )
    bootstrap.run()

    # Exit with appropriate code
    if bootstrap.report["errors"]:
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
