#!/usr/bin/env python3
"""
CTB Metadata Tagger
Injects CTB compliance metadata blocks into source files

Version: 1.0
Date: 2025-10-23
"""

import os
import sys
import json
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Set, Tuple

# Metadata template
METADATA_TEMPLATE = """
# CTB Metadata
# Generated: {timestamp}
# CTB Version: 1.3.3
# Division: {division}
# Category: {category}
# Compliance: {compliance}%
# HEIR ID: {heir_id}
"""

class CTBMetadataTagger:
    def __init__(self, root_dir: str = "ctb"):
        self.root_dir = Path(root_dir)
        self.tagged_files = []
        self.skipped_files = []
        self.errors = []

        # File extensions to tag
        self.taggable_extensions = {
            '.py', '.js', '.ts', '.jsx', '.tsx',
            '.sh', '.bash', '.yaml', '.yml', '.json',
            '.md', '.txt', '.sql'
        }

        # Files to skip
        self.skip_patterns = {
            '__pycache__', 'node_modules', '.git',
            'package-lock.json', 'yarn.lock', '.pyc'
        }

        # CTB divisions
        self.divisions = {
            'sys': 'System Infrastructure',
            'ai': 'AI Agents & MCP',
            'data': 'Data & Databases',
            'docs': 'Documentation',
            'ui': 'User Interface',
            'meta': 'Configuration & Tests'
        }

    def should_skip(self, file_path: Path) -> bool:
        """Check if file should be skipped"""
        path_str = str(file_path)
        for pattern in self.skip_patterns:
            if pattern in path_str:
                return True
        return False

    def get_division_category(self, file_path: Path) -> Tuple[str, str]:
        """Determine division and category from path"""
        parts = file_path.relative_to(self.root_dir).parts

        if len(parts) == 0:
            return 'unknown', 'unknown'

        division = parts[0] if parts[0] in self.divisions else 'unknown'
        category = parts[1] if len(parts) > 1 else 'root'

        return division, category

    def calculate_compliance(self, file_path: Path) -> int:
        """Calculate compliance score for file"""
        score = 100

        # Check for security issues
        content = file_path.read_text(encoding='utf-8', errors='ignore')

        # Deduct for hardcoded secrets
        if re.search(r'(password|secret|key)\s*=\s*["\'][^"\']+["\']', content, re.I):
            score -= 20

        # Deduct for missing HEIR tracking in API calls
        if 'composio' in content.lower() and 'unique_id' not in content:
            score -= 15

        # Deduct for poor structure
        if len(content) > 1000 and not any(x in content for x in ['def ', 'class ', 'function ']):
            score -= 10

        return max(0, score)

    def generate_heir_id(self, division: str, category: str) -> str:
        """Generate HEIR ID for file"""
        now = datetime.now()
        system = division.upper()[:3]
        mode = category.upper()[:6]
        return f"HEIR-{now.year}-{now.month:02d}-{system}-{mode}-01"

    def get_comment_style(self, file_path: Path) -> Tuple[str, str]:
        """Get comment style based on file extension"""
        ext = file_path.suffix.lower()

        styles = {
            '.py': ('#', '#'),
            '.sh': ('#', '#'),
            '.bash': ('#', '#'),
            '.js': ('//', '//'),
            '.ts': ('//', '//'),
            '.jsx': ('//', '//'),
            '.tsx': ('//', '//'),
            '.yaml': ('#', '#'),
            '.yml': ('#', '#'),
            '.sql': ('--', '--'),
            '.md': ('<!--', '-->'),
        }

        return styles.get(ext, ('#', '#'))

    def inject_metadata(self, file_path: Path) -> bool:
        """Inject metadata into file"""
        try:
            # Read file
            content = file_path.read_text(encoding='utf-8', errors='ignore')

            # Check if already tagged
            if 'CTB Metadata' in content:
                self.skipped_files.append(str(file_path))
                return False

            # Get file info
            division, category = self.get_division_category(file_path)
            compliance = self.calculate_compliance(file_path)
            heir_id = self.generate_heir_id(division, category)

            # Generate metadata
            timestamp = datetime.now().isoformat()
            metadata = METADATA_TEMPLATE.format(
                timestamp=timestamp,
                division=self.divisions.get(division, 'Unknown'),
                category=category,
                compliance=compliance,
                heir_id=heir_id
            )

            # Get comment style
            comment_start, comment_end = self.get_comment_style(file_path)

            # Format metadata with comments
            if file_path.suffix == '.md':
                formatted_metadata = f"<!--\n{metadata}\n-->\n\n"
            else:
                lines = metadata.strip().split('\n')
                formatted_metadata = '\n'.join([f"{comment_start} {line}" for line in lines]) + '\n\n'

            # Inject at top of file (after shebang if present)
            if content.startswith('#!'):
                shebang_end = content.find('\n') + 1
                new_content = content[:shebang_end] + formatted_metadata + content[shebang_end:]
            else:
                new_content = formatted_metadata + content

            # Write back
            file_path.write_text(new_content, encoding='utf-8')

            self.tagged_files.append({
                'path': str(file_path),
                'division': division,
                'category': category,
                'compliance': compliance,
                'heir_id': heir_id
            })

            return True

        except Exception as e:
            self.errors.append({
                'path': str(file_path),
                'error': str(e)
            })
            return False

    def tag_directory(self) -> Dict:
        """Tag all files in CTB directory"""
        print(f"🏷️  CTB Metadata Tagger")
        print(f"=" * 50)
        print(f"Scanning: {self.root_dir}")
        print()

        # Walk through directory
        for file_path in self.root_dir.rglob('*'):
            # Skip directories and non-taggable files
            if file_path.is_dir():
                continue

            if self.should_skip(file_path):
                continue

            if file_path.suffix not in self.taggable_extensions:
                continue

            # Tag file
            self.inject_metadata(file_path)

        # Generate report
        report = {
            'timestamp': datetime.now().isoformat(),
            'total_tagged': len(self.tagged_files),
            'total_skipped': len(self.skipped_files),
            'total_errors': len(self.errors),
            'tagged_files': self.tagged_files,
            'errors': self.errors
        }

        print(f"✅ Tagged: {len(self.tagged_files)} files")
        print(f"⏭️  Skipped: {len(self.skipped_files)} files")
        print(f"❌ Errors: {len(self.errors)} files")

        return report

    def generate_report_md(self, report: Dict) -> str:
        """Generate Markdown report"""
        md = f"""# CTB Tagging Report

**Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**CTB Version**: 1.3.3

---

## Summary

- **Files Tagged**: {report['total_tagged']}
- **Files Skipped**: {report['total_skipped']} (already tagged)
- **Errors**: {report['total_errors']}

---

## Tagged Files by Division

"""

        # Group by division
        by_division = {}
        for file in report['tagged_files']:
            div = file['division']
            if div not in by_division:
                by_division[div] = []
            by_division[div].append(file)

        for division, files in sorted(by_division.items()):
            md += f"\n### {division.upper()} ({len(files)} files)\n\n"
            md += "| File | Category | Compliance | HEIR ID |\n"
            md += "|------|----------|------------|----------|\n"

            for file in files:
                path = Path(file['path']).relative_to(self.root_dir)
                md += f"| `{path}` | {file['category']} | {file['compliance']}% | `{file['heir_id']}` |\n"

        # Errors section
        if report['errors']:
            md += f"\n---\n\n## Errors ({len(report['errors'])})\n\n"
            for error in report['errors']:
                md += f"- **{error['path']}**: {error['error']}\n"

        md += f"\n---\n\n*Generated by CTB Metadata Tagger v1.0*\n"

        return md


def main():
    # Initialize tagger
    tagger = CTBMetadataTagger(root_dir='ctb')

    # Tag files
    report = tagger.tag_directory()

    # Generate Markdown report
    report_md = tagger.generate_report_md(report)

    # Save report
    report_path = Path('CTB_TAGGING_REPORT.md')
    report_path.write_text(report_md, encoding='utf-8')

    print(f"\n📄 Report saved: {report_path}")

    # Save JSON data
    json_path = Path('ctb/meta/tagging_data.json')
    json_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps(report, indent=2), encoding='utf-8')

    print(f"💾 Data saved: {json_path}")
    print()
    print("✅ CTB Metadata Tagging Complete!")

    return 0 if len(report['errors']) == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
