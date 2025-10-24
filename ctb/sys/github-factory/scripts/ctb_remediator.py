#!/usr/bin/env python3
"""
CTB Remediator
Automatically fixes CTB compliance issues

Usage:
    python ctb_remediator.py [--dry-run]
"""

import json
import shutil
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any


class CTBRemediator:
    """Automatically remediate CTB compliance issues"""

    def __init__(self, root_dir: str = '.', dry_run: bool = False):
        self.root_dir = Path(root_dir).resolve()
        self.dry_run = dry_run
        self.actions_taken = []
        self.audit_report = None

    def load_audit_report(self) -> Dict[str, Any]:
        """Load the latest audit report"""
        audit_file = self.root_dir / 'logs' / 'ctb_audit_report.json'

        if not audit_file.exists():
            print("❌ No audit report found. Run ctb_audit_generator.py first.")
            sys.exit(1)

        with open(audit_file, 'r') as f:
            self.audit_report = json.load(f)

        return self.audit_report

    def create_missing_directories(self):
        """Create missing required directories"""
        print("\n📁 Creating missing directories...")

        if not self.audit_report:
            return

        for path, check in self.audit_report['structure_check'].items():
            if check['required'] and not check['exists']:
                full_path = self.root_dir / path

                if self.dry_run:
                    print(f"   [DRY RUN] Would create: {path}")
                else:
                    if '.' not in path:  # It's a directory
                        full_path.mkdir(parents=True, exist_ok=True)
                        print(f"   ✅ Created: {path}")
                    else:  # It's a file
                        full_path.parent.mkdir(parents=True, exist_ok=True)
                        full_path.touch()
                        print(f"   ✅ Created: {path}")

                self.actions_taken.append({
                    'action': 'create_directory',
                    'path': path,
                    'timestamp': datetime.utcnow().isoformat()
                })

    def create_ctb_registry(self):
        """Create or update CTB registry"""
        print("\n🏷️  Creating CTB registry...")

        registry_path = self.root_dir / 'ctb' / 'meta' / 'ctb_registry.json'
        registry_path.parent.mkdir(parents=True, exist_ok=True)

        registry = {
            'version': '1.0.0',
            'created_at': datetime.utcnow().isoformat(),
            'repository': self.root_dir.name,
            'ctb_structure': {
                'sys': 'System integrations and infrastructure',
                'ai': 'AI models, prompts, and training',
                'data': 'Database schemas and migrations',
                'docs': 'Documentation and guides',
                'ui': 'UI components and templates',
                'meta': 'CTB metadata and registry'
            },
            'enforcement': {
                'enabled': True,
                'min_score': 90,
                'auto_remediate': True
            },
            'branches': {
                'sys': {
                    'description': 'System integrations',
                    'subdirs': ['composio-mcp', 'firebase', 'neon', 'github-factory', 'gatekeeper', 'validator']
                },
                'ai': {
                    'description': 'AI systems',
                    'subdirs': ['models', 'prompts', 'blueprints', 'training']
                },
                'data': {
                    'description': 'Data layer',
                    'subdirs': ['firebase', 'neon', 'bigquery', 'zod']
                },
                'docs': {
                    'description': 'Documentation',
                    'subdirs': ['ctb', 'doctrine', 'ort', 'sops']
                },
                'ui': {
                    'description': 'User interfaces',
                    'subdirs': ['components', 'pages', 'templates']
                }
            }
        }

        if self.dry_run:
            print(f"   [DRY RUN] Would create: {registry_path}")
        else:
            with open(registry_path, 'w') as f:
                json.dump(registry, f, indent=2)
            print(f"   ✅ Created: {registry_path}")

        self.actions_taken.append({
            'action': 'create_registry',
            'path': str(registry_path),
            'timestamp': datetime.utcnow().isoformat()
        })

    def create_global_config(self):
        """Create global-config.yaml if missing"""
        print("\n⚙️  Creating global configuration...")

        config_path = self.root_dir / 'global-config.yaml'

        if config_path.exists():
            print(f"   ℹ️  Config already exists: {config_path}")
            return

        config_content = """# Global CTB Configuration
version: "1.0.0"
repository: ${self.root_dir.name}

# CTB Structure Configuration
ctb:
  enabled: true
  version: "1.0.0"
  branches:
    - sys      # System integrations
    - ai       # AI models and prompts
    - data     # Database schemas
    - docs     # Documentation
    - ui       # User interfaces
    - meta     # Metadata

# Doctrine Enforcement
doctrine_enforcement:
  ctb_factory: ctb/sys/global-factory/
  auto_sync: true
  min_score: 90
  composio_scenario: CTB_Compliance_Cycle
  auto_remediate: true

# Logging
logging:
  directory: logs/
  audit_enabled: true
  retention_days: 90

# Integration Settings
integrations:
  composio:
    enabled: true
    mcp_url: http://localhost:3001/tool
  firebase:
    enabled: true
  neon:
    enabled: true
"""

        if self.dry_run:
            print(f"   [DRY RUN] Would create: {config_path}")
        else:
            with open(config_path, 'w') as f:
                f.write(config_content)
            print(f"   ✅ Created: {config_path}")

        self.actions_taken.append({
            'action': 'create_config',
            'path': str(config_path),
            'timestamp': datetime.utcnow().isoformat()
        })

    def organize_files(self):
        """Move files into CTB structure based on tags"""
        print("\n📦 Organizing files into CTB structure...")

        tags_file = self.root_dir / 'ctb' / 'meta' / 'ctb_tags.json'

        if not tags_file.exists():
            print("   ⚠️  No tags file found. Run ctb_metadata_tagger.py first.")
            return

        with open(tags_file, 'r') as f:
            tags_data = json.load(f)

        moved_count = 0
        for file_data in tags_data.get('files', []):
            current_path = self.root_dir / file_data['file_path']
            suggested_path = self.root_dir / file_data['suggested_location']

            # Skip if already in correct location
            if current_path == suggested_path:
                continue

            # Skip if file doesn't exist
            if not current_path.exists():
                continue

            # Skip if already in CTB structure
            if str(current_path).startswith(str(self.root_dir / 'ctb')):
                continue

            if self.dry_run:
                print(f"   [DRY RUN] Would move: {file_data['file_path']} -> {file_data['suggested_location']}")
            else:
                suggested_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.move(str(current_path), str(suggested_path))
                print(f"   ✅ Moved: {file_data['file_path']} -> {file_data['suggested_location']}")
                moved_count += 1

            self.actions_taken.append({
                'action': 'move_file',
                'from': file_data['file_path'],
                'to': file_data['suggested_location'],
                'timestamp': datetime.utcnow().isoformat()
            })

            # Limit moves in one run
            if moved_count >= 50:
                print(f"   ℹ️  Moved {moved_count} files. Run again to continue.")
                break

    def save_remediation_log(self):
        """Save log of all remediation actions"""
        log_path = self.root_dir / 'logs' / 'ctb_remediation_log.json'
        log_path.parent.mkdir(parents=True, exist_ok=True)

        log_data = {
            'remediation_timestamp': datetime.utcnow().isoformat(),
            'dry_run': self.dry_run,
            'actions_count': len(self.actions_taken),
            'actions': self.actions_taken
        }

        with open(log_path, 'w') as f:
            json.dump(log_data, f, indent=2)

        print(f"\n📄 Remediation log saved: {log_path}")

    def run(self):
        """Run complete remediation process"""
        print("🔧 CTB Remediator")
        if self.dry_run:
            print("   [DRY RUN MODE - No changes will be made]\n")

        # Load audit report
        self.load_audit_report()
        print(f"📊 Loaded audit report (Score: {self.audit_report['compliance_score']}/100)")

        # Run remediation steps
        self.create_missing_directories()
        self.create_ctb_registry()
        self.create_global_config()
        # self.organize_files()  # Commented out for safety - run manually

        # Save log
        self.save_remediation_log()

        print(f"\n{'='*60}")
        print(f"✅ Remediation Complete!")
        print(f"   Actions taken: {len(self.actions_taken)}")
        if self.dry_run:
            print(f"   (Dry run - no actual changes made)")
        print(f"{'='*60}\n")

        print("💡 Next steps:")
        print("   1. Run ctb_audit_generator.py again to verify fixes")
        print("   2. Run ctb_metadata_tagger.py to tag files")
        print("   3. Review and commit changes to git")


def main():
    dry_run = '--dry-run' in sys.argv

    remediator = CTBRemediator(dry_run=dry_run)
    remediator.run()


if __name__ == '__main__':
    main()
