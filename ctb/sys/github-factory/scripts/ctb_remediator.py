#!/usr/bin/env python3
"""
CTB Remediator
Automatically fixes CTB compliance issues

Version: 1.0
Date: 2025-10-23
"""

import os
import sys
import json
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List

class CTBRemediator:
    def __init__(self, root_dir: str = "ctb"):
        self.root_dir = Path(root_dir)
        self.fixes_applied = []
        self.fixes_failed = []

        # Load audit data if available
        self.audit_data = self.load_audit_data()

    def load_audit_data(self) -> Dict:
        """Load audit data from previous run"""
        audit_path = self.root_dir / 'meta' / 'audit_data.json'
        if audit_path.exists():
            return json.loads(audit_path.read_text())
        return {}

    def fix_missing_divisions(self) -> int:
        """Create missing CTB divisions"""
        print("📁 Fixing missing divisions...")

        required_divisions = ['sys', 'ai', 'data', 'docs', 'ui', 'meta']
        fixes = 0

        for division in required_divisions:
            div_path = self.root_dir / division
            if not div_path.exists():
                div_path.mkdir(parents=True, exist_ok=True)
                self.fixes_applied.append({
                    'type': 'structure',
                    'action': 'created_division',
                    'path': str(div_path)
                })
                print(f"  ✅ Created: {division}/")
                fixes += 1

        return fixes

    def fix_heir_ids(self) -> int:
        """Fix missing or malformed HEIR IDs"""
        print("\n🎯 Fixing HEIR/ORBT compliance...")

        fixes = 0

        # Find Python files with Composio calls but missing HEIR tracking
        for file_path in self.root_dir.rglob('*.py'):
            if '__pycache__' in str(file_path):
                continue

            try:
                content = file_path.read_text(encoding='utf-8', errors='ignore')

                # Check if file has Composio calls
                if 'composio' not in content.lower():
                    continue

                # Check if missing proper payload
                needs_fix = False
                if 'composio' in content.lower():
                    if 'unique_id' not in content or 'process_id' not in content:
                        needs_fix = True

                if needs_fix:
                    # Add import for HEIR generator
                    if 'from ctb.ai.orbt-utils' not in content:
                        # Add import at top
                        lines = content.split('\n')
                        import_line = "from ctb.ai.orbt_utils.heir_generator import HeirGenerator"

                        # Find where to insert (after other imports)
                        insert_idx = 0
                        for i, line in enumerate(lines):
                            if line.startswith('import ') or line.startswith('from '):
                                insert_idx = i + 1

                        lines.insert(insert_idx, import_line)
                        new_content = '\n'.join(lines)

                        file_path.write_text(new_content, encoding='utf-8')

                        self.fixes_applied.append({
                            'type': 'heir_orbt',
                            'action': 'added_heir_import',
                            'path': str(file_path)
                        })
                        fixes += 1
                        print(f"  ✅ Added HEIR import: {file_path.name}")

            except Exception as e:
                self.fixes_failed.append({
                    'type': 'heir_orbt',
                    'path': str(file_path),
                    'error': str(e)
                })

        return fixes

    def fix_security_issues(self) -> int:
        """Fix security compliance issues"""
        print("\n🔒 Fixing security issues...")

        fixes = 0

        # Remove .env files (but keep .env.example)
        for env_file in self.root_dir.rglob('.env'):
            if '.env.example' not in str(env_file):
                try:
                    # Backup before removing
                    backup_path = env_file.with_suffix('.env.backup')
                    env_file.rename(backup_path)

                    self.fixes_applied.append({
                        'type': 'security',
                        'action': 'moved_env_file',
                        'from': str(env_file),
                        'to': str(backup_path)
                    })
                    print(f"  ✅ Moved to backup: {env_file.name}")
                    fixes += 1

                except Exception as e:
                    self.fixes_failed.append({
                        'type': 'security',
                        'path': str(env_file),
                        'error': str(e)
                    })

        # Check for hardcoded secrets and add warnings
        for file_path in self.root_dir.rglob('*.py'):
            if '__pycache__' in str(file_path):
                continue

            try:
                content = file_path.read_text(encoding='utf-8', errors='ignore')

                # Check for secret patterns
                secret_patterns = {
                    r'password\s*=\s*["\'][^"\']+["\']': 'Use process.env or MCP_VAULT',
                    r'api_key\s*=\s*["\'][^"\']+["\']': 'Use process.env or MCP_VAULT',
                    r'secret\s*=\s*["\'][^"\']+["\']': 'Use process.env or MCP_VAULT',
                }

                for pattern, warning in secret_patterns.items():
                    if re.search(pattern, content, re.I):
                        # Add warning comment
                        modified = re.sub(
                            pattern,
                            lambda m: f"# WARNING: {warning}\n{m.group(0)}",
                            content,
                            flags=re.I
                        )

                        if modified != content:
                            file_path.write_text(modified, encoding='utf-8')
                            self.fixes_applied.append({
                                'type': 'security',
                                'action': 'added_security_warning',
                                'path': str(file_path)
                            })
                            fixes += 1
                            print(f"  ⚠️  Added security warning: {file_path.name}")
                            break

            except Exception as e:
                self.fixes_failed.append({
                    'type': 'security',
                    'path': str(file_path),
                    'error': str(e)
                })

        return fixes

    def generate_registry(self) -> Dict:
        """Generate CTB registry"""
        print("\n📋 Generating CTB registry...")

        registry = {
            'version': '1.3.3',
            'generated': datetime.now().isoformat(),
            'repository': 'imo-creator',
            'divisions': {},
            'enforcement': {
                'scripts': [],
                'workflows': [],
                'status': 'active'
            }
        }

        # Scan divisions
        for division_path in self.root_dir.iterdir():
            if not division_path.is_dir():
                continue

            division_name = division_path.name
            if division_name.startswith('.') or division_name.startswith('_'):
                continue

            # Count files
            files = list(division_path.rglob('*'))
            file_count = len([f for f in files if f.is_file()])

            # Get subdirectories
            subdirs = [d.name for d in division_path.iterdir() if d.is_dir()]

            registry['divisions'][division_name] = {
                'path': str(division_path),
                'file_count': file_count,
                'subdirectories': subdirs,
                'status': 'active'
            }

        # Add enforcement scripts
        scripts_path = Path('ctb/sys/github-factory/scripts')
        if scripts_path.exists():
            for script in scripts_path.glob('ctb_*.py'):
                registry['enforcement']['scripts'].append({
                    'name': script.stem,
                    'path': str(script),
                    'version': '1.0'
                })

        # Add workflows
        workflows_path = Path('.github/workflows')
        if workflows_path.exists():
            for workflow in workflows_path.glob('ctb_*.yml'):
                registry['enforcement']['workflows'].append({
                    'name': workflow.stem,
                    'path': str(workflow)
                })

        return registry

    def remediate(self) -> Dict:
        """Run full remediation"""
        print("🔧 CTB Remediator")
        print("=" * 50)
        print()

        total_fixes = 0

        # Run fixes
        total_fixes += self.fix_missing_divisions()
        total_fixes += self.fix_heir_ids()
        total_fixes += self.fix_security_issues()

        # Generate registry
        registry = self.generate_registry()

        # Save registry
        registry_path = self.root_dir / 'meta' / 'ctb_registry.json'
        registry_path.parent.mkdir(parents=True, exist_ok=True)
        registry_path.write_text(json.dumps(registry, indent=2), encoding='utf-8')
        print(f"  ✅ Registry saved: {registry_path}")

        # Summary
        summary = {
            'timestamp': datetime.now().isoformat(),
            'total_fixes': total_fixes,
            'fixes_applied': self.fixes_applied,
            'fixes_failed': self.fixes_failed,
            'registry': registry
        }

        print("\n" + "=" * 50)
        print(f"✅ Applied: {total_fixes} fixes")
        print(f"❌ Failed: {len(self.fixes_failed)} fixes")

        return summary

    def generate_report_md(self, summary: Dict) -> str:
        """Generate Markdown remediation report"""
        md = f"""# CTB Remediation Summary

**Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**CTB Version**: 1.3.3

---

## Summary

- **Fixes Applied**: {summary['total_fixes']}
- **Fixes Failed**: {len(summary['fixes_failed'])}
- **Registry Generated**: ✅

---

## Fixes Applied by Category

"""

        # Group fixes by type
        fixes_by_type = {}
        for fix in summary['fixes_applied']:
            fix_type = fix['type']
            if fix_type not in fixes_by_type:
                fixes_by_type[fix_type] = []
            fixes_by_type[fix_type].append(fix)

        for fix_type, fixes in sorted(fixes_by_type.items()):
            md += f"\n### {fix_type.upper().replace('_', ' ')} ({len(fixes)} fixes)\n\n"

            for fix in fixes:
                md += f"- **{fix['action']}**: `{Path(fix['path']).name if 'path' in fix else 'N/A'}`\n"

        # Failed fixes
        if summary['fixes_failed']:
            md += f"\n---\n\n## Failed Fixes ({len(summary['fixes_failed'])})\n\n"

            for fail in summary['fixes_failed']:
                md += f"- **{fail['type']}** - `{Path(fail['path']).name}`: {fail['error']}\n"

        # Registry info
        registry = summary['registry']
        md += f"\n---\n\n## CTB Registry\n\n"
        md += f"- **Version**: {registry['version']}\n"
        md += f"- **Divisions**: {len(registry['divisions'])}\n"
        md += f"- **Enforcement Scripts**: {len(registry['enforcement']['scripts'])}\n"
        md += f"- **Workflows**: {len(registry['enforcement']['workflows'])}\n"

        md += "\n### Divisions\n\n"
        for div_name, div_data in registry['divisions'].items():
            md += f"- **{div_name}**: {div_data['file_count']} files, {len(div_data['subdirectories'])} subdirectories\n"

        md += "\n---\n\n*Generated by CTB Remediator v1.0*\n"

        return md


def main():
    # Initialize remediator
    remediator = CTBRemediator(root_dir='ctb')

    # Run remediation
    summary = remediator.remediate()

    # Generate report
    report_md = remediator.generate_report_md(summary)

    # Save report
    report_path = Path('CTB_REMEDIATION_SUMMARY.md')
    report_path.write_text(report_md, encoding='utf-8')

    print(f"\n📄 Report saved: {report_path}")

    # Save JSON data
    json_path = Path('ctb/meta/remediation_data.json')
    json_path.write_text(json.dumps(summary, indent=2), encoding='utf-8')

    print(f"💾 Data saved: {json_path}")
    print()
    print("✅ CTB Remediation Complete!")

    return 0 if len(summary['fixes_failed']) == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
