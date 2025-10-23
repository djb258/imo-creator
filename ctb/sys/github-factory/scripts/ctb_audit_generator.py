#!/usr/bin/env python3
# # CTB Metadata
# # Generated: 2025-10-23T14:32:38.875788
# # CTB Version: 1.3.3
# # Division: System Infrastructure
# # Category: github-factory
# # Compliance: 100%
# # HEIR ID: HEIR-2025-10-SYS-GITHUB-01

"""
CTB Audit Generator
Generates comprehensive audit reports for CTB compliance

Version: 1.0
Date: 2025-10-23
"""

import os
import sys
import json
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Set
from collections import defaultdict

# Fix Windows console encoding for emojis
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

class CTBAuditGenerator:
    def __init__(self, root_dir: str = "ctb"):
        self.root_dir = Path(root_dir)
        self.audit_data = {
            'timestamp': datetime.now().isoformat(),
            'version': '1.3.3',
            'structure': {},
            'compliance': {},
            'issues': [],
            'recommendations': [],
            'statistics': {}
        }

    def audit_structure(self) -> Dict:
        """Audit CTB directory structure"""
        print("📁 Auditing CTB structure...")

        required_divisions = ['sys', 'ai', 'data', 'docs', 'ui', 'meta']
        structure = {}

        for division in required_divisions:
            div_path = self.root_dir / division
            exists = div_path.exists()

            structure[division] = {
                'exists': exists,
                'path': str(div_path),
                'subdirectories': [],
                'file_count': 0,
                'total_size': 0
            }

            if exists:
                # Count subdirectories
                subdirs = [d.name for d in div_path.iterdir() if d.is_dir()]
                structure[division]['subdirectories'] = subdirs

                # Count files and calculate size
                files = list(div_path.rglob('*'))
                file_count = len([f for f in files if f.is_file()])
                total_size = sum(f.stat().st_size for f in files if f.is_file())

                structure[division]['file_count'] = file_count
                structure[division]['total_size'] = total_size

                print(f"  ✅ {division}: {file_count} files ({total_size:,} bytes)")
            else:
                print(f"  ❌ {division}: MISSING")
                self.audit_data['issues'].append({
                    'severity': 'critical',
                    'category': 'structure',
                    'message': f"Missing required division: {division}"
                })

        return structure

    def audit_metadata(self) -> Dict:
        """Audit metadata compliance"""
        print("\n🏷️  Auditing metadata compliance...")

        metadata_stats = {
            'total_files': 0,
            'tagged_files': 0,
            'untagged_files': 0,
            'compliance_scores': []
        }

        # Check for tagging data
        tagging_data_path = self.root_dir / 'meta' / 'tagging_data.json'
        if tagging_data_path.exists():
            tagging_data = json.loads(tagging_data_path.read_text())
            metadata_stats['tagged_files'] = tagging_data.get('total_tagged', 0)

            # Extract compliance scores
            for file in tagging_data.get('tagged_files', []):
                metadata_stats['compliance_scores'].append(file.get('compliance', 0))

        # Count total files
        for file_path in self.root_dir.rglob('*'):
            if file_path.is_file() and not any(skip in str(file_path) for skip in ['__pycache__', 'node_modules', '.git']):
                metadata_stats['total_files'] += 1

        metadata_stats['untagged_files'] = metadata_stats['total_files'] - metadata_stats['tagged_files']

        if metadata_stats['compliance_scores']:
            avg_compliance = sum(metadata_stats['compliance_scores']) / len(metadata_stats['compliance_scores'])
        else:
            avg_compliance = 0

        print(f"  Total files: {metadata_stats['total_files']}")
        print(f"  Tagged: {metadata_stats['tagged_files']}")
        print(f"  Untagged: {metadata_stats['untagged_files']}")
        print(f"  Avg Compliance: {avg_compliance:.1f}%")

        if metadata_stats['untagged_files'] > 0:
            self.audit_data['recommendations'].append({
                'priority': 'medium',
                'category': 'metadata',
                'message': f"Tag {metadata_stats['untagged_files']} untagged files for full compliance"
            })

        return metadata_stats

    def audit_heir_orbt(self) -> Dict:
        """Audit HEIR/ORBT compliance"""
        print("\n🎯 Auditing HEIR/ORBT compliance...")

        heir_stats = {
            'heir_pattern_matches': 0,
            'process_id_matches': 0,
            'composio_calls': 0,
            'compliant_calls': 0
        }

        # Scan for HEIR/ORBT patterns
        for file_path in self.root_dir.rglob('*.py'):
            if '__pycache__' in str(file_path):
                continue

            try:
                content = file_path.read_text(encoding='utf-8', errors='ignore')

                # Check for HEIR IDs
                heir_matches = re.findall(r'HEIR-\d{4}-\d{2}-[A-Z]+-[A-Z]+-\d{2}', content)
                heir_stats['heir_pattern_matches'] += len(heir_matches)

                # Check for Process IDs
                process_matches = re.findall(r'PRC-[A-Z]+-\d+', content)
                heir_stats['process_id_matches'] += len(process_matches)

                # Check for Composio calls
                if 'composio' in content.lower():
                    heir_stats['composio_calls'] += 1

                    # Check if call has proper payload
                    if 'unique_id' in content and 'process_id' in content and 'orbt_layer' in content:
                        heir_stats['compliant_calls'] += 1

            except Exception as e:
                pass

        print(f"  HEIR IDs found: {heir_stats['heir_pattern_matches']}")
        print(f"  Process IDs found: {heir_stats['process_id_matches']}")
        print(f"  Composio calls: {heir_stats['composio_calls']}")
        print(f"  Compliant calls: {heir_stats['compliant_calls']}")

        non_compliant = heir_stats['composio_calls'] - heir_stats['compliant_calls']
        if non_compliant > 0:
            self.audit_data['issues'].append({
                'severity': 'high',
                'category': 'heir_orbt',
                'message': f"{non_compliant} Composio calls missing HEIR/ORBT payload"
            })

        return heir_stats

    def audit_security(self) -> Dict:
        """Audit security compliance"""
        print("\n🔒 Auditing security compliance...")

        security_stats = {
            'hardcoded_secrets': 0,
            'env_files': 0,
            'forbidden_files': [],
            'mcp_vault_usage': False
        }

        # Check for hardcoded secrets
        for file_path in self.root_dir.rglob('*.py'):
            if '__pycache__' in str(file_path):
                continue

            try:
                content = file_path.read_text(encoding='utf-8', errors='ignore')

                # Check for secret patterns
                secret_patterns = [
                    r'password\s*=\s*["\'][^"\']+["\']',
                    r'api_key\s*=\s*["\'][^"\']+["\']',
                    r'secret\s*=\s*["\'][^"\']+["\']',
                    r'token\s*=\s*["\'][^"\']+["\']'
                ]

                for pattern in secret_patterns:
                    if re.search(pattern, content, re.I):
                        security_stats['hardcoded_secrets'] += 1
                        break

                # Check for MCP vault usage
                if 'mcp_vault' in content.lower() or 'process.env.MCP_' in content:
                    security_stats['mcp_vault_usage'] = True

            except Exception:
                pass

        # Check for .env files
        for env_file in self.root_dir.rglob('.env'):
            if '.env.example' not in str(env_file):
                security_stats['env_files'] += 1
                security_stats['forbidden_files'].append(str(env_file))

        print(f"  Hardcoded secrets: {security_stats['hardcoded_secrets']}")
        print(f"  .env files: {security_stats['env_files']}")
        print(f"  MCP vault usage: {'✅' if security_stats['mcp_vault_usage'] else '❌'}")

        if security_stats['hardcoded_secrets'] > 0:
            self.audit_data['issues'].append({
                'severity': 'critical',
                'category': 'security',
                'message': f"Found {security_stats['hardcoded_secrets']} files with hardcoded secrets"
            })

        if security_stats['env_files'] > 0:
            self.audit_data['issues'].append({
                'severity': 'critical',
                'category': 'security',
                'message': f"Found {security_stats['env_files']} forbidden .env files"
            })

        return security_stats

    def calculate_overall_score(self) -> int:
        """Calculate overall CTB compliance score"""
        score = 100

        # Deduct for critical issues
        critical_issues = [i for i in self.audit_data['issues'] if i['severity'] == 'critical']
        score -= len(critical_issues) * 15

        # Deduct for high issues
        high_issues = [i for i in self.audit_data['issues'] if i['severity'] == 'high']
        score -= len(high_issues) * 10

        # Deduct for medium issues
        medium_issues = [i for i in self.audit_data['issues'] if i['severity'] == 'medium']
        score -= len(medium_issues) * 5

        return max(0, min(100, score))

    def generate_audit(self) -> Dict:
        """Run full CTB audit"""
        print("🔍 CTB Audit Generator")
        print("=" * 50)
        print()

        # Run audits
        self.audit_data['structure'] = self.audit_structure()
        self.audit_data['metadata'] = self.audit_metadata()
        self.audit_data['heir_orbt'] = self.audit_heir_orbt()
        self.audit_data['security'] = self.audit_security()

        # Calculate statistics
        self.audit_data['statistics'] = {
            'total_divisions': len(self.audit_data['structure']),
            'total_files': self.audit_data['metadata']['total_files'],
            'total_issues': len(self.audit_data['issues']),
            'total_recommendations': len(self.audit_data['recommendations']),
            'compliance_score': self.calculate_overall_score()
        }

        print("\n" + "=" * 50)
        print(f"📊 Overall Compliance Score: {self.audit_data['statistics']['compliance_score']}%")
        print(f"❌ Issues: {self.audit_data['statistics']['total_issues']}")
        print(f"💡 Recommendations: {self.audit_data['statistics']['total_recommendations']}")

        return self.audit_data

    def generate_report_md(self) -> str:
        """Generate Markdown audit report"""
        stats = self.audit_data['statistics']
        score = stats['compliance_score']

        # Determine grade
        if score >= 90:
            grade = "A"
            status = "✅ COMPLIANT"
        elif score >= 75:
            grade = "B"
            status = "⚠️ NEEDS IMPROVEMENT"
        elif score >= 60:
            grade = "C"
            status = "❌ NON-COMPLIANT"
        else:
            grade = "F"
            status = "🚨 CRITICAL"

        md = f"""# CTB Audit Report

**Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**CTB Version**: 1.3.3
**Compliance Score**: {score}% (Grade: {grade})
**Status**: {status}

---

## Executive Summary

- **Total Files**: {stats['total_files']:,}
- **Total Issues**: {stats['total_issues']}
- **Total Recommendations**: {stats['total_recommendations']}
- **Divisions**: {stats['total_divisions']}/6

---

## Structure Audit

"""

        # Structure details
        for division, data in self.audit_data['structure'].items():
            status_icon = "✅" if data['exists'] else "❌"
            md += f"\n### {status_icon} {division.upper()}\n\n"

            if data['exists']:
                md += f"- **Files**: {data['file_count']:,}\n"
                md += f"- **Size**: {data['total_size']:,} bytes\n"
                md += f"- **Subdirectories**: {len(data['subdirectories'])}\n"

                if data['subdirectories']:
                    md += f"- **Structure**: {', '.join(data['subdirectories'])}\n"
            else:
                md += f"- **Status**: MISSING (CRITICAL)\n"

        # Issues
        if self.audit_data['issues']:
            md += "\n---\n\n## Issues\n\n"

            issues_by_severity = defaultdict(list)
            for issue in self.audit_data['issues']:
                issues_by_severity[issue['severity']].append(issue)

            for severity in ['critical', 'high', 'medium', 'low']:
                if severity in issues_by_severity:
                    md += f"\n### {severity.upper()} ({len(issues_by_severity[severity])})\n\n"
                    for issue in issues_by_severity[severity]:
                        md += f"- **{issue['category']}**: {issue['message']}\n"

        # Recommendations
        if self.audit_data['recommendations']:
            md += "\n---\n\n## Recommendations\n\n"

            for rec in self.audit_data['recommendations']:
                md += f"- **[{rec['priority'].upper()}]** {rec['message']}\n"

        # Security
        security = self.audit_data.get('security', {})
        md += "\n---\n\n## Security Status\n\n"
        md += f"- **Hardcoded Secrets**: {security.get('hardcoded_secrets', 0)}\n"
        md += f"- **Forbidden .env Files**: {security.get('env_files', 0)}\n"
        md += f"- **MCP Vault Usage**: {'✅ Implemented' if security.get('mcp_vault_usage') else '❌ Not Detected'}\n"

        # HEIR/ORBT
        heir = self.audit_data.get('heir_orbt', {})
        md += "\n---\n\n## HEIR/ORBT Compliance\n\n"
        md += f"- **HEIR IDs Found**: {heir.get('heir_pattern_matches', 0)}\n"
        md += f"- **Process IDs Found**: {heir.get('process_id_matches', 0)}\n"
        md += f"- **Composio Calls**: {heir.get('composio_calls', 0)}\n"
        md += f"- **Compliant Calls**: {heir.get('compliant_calls', 0)}/{heir.get('composio_calls', 0)}\n"

        md += "\n---\n\n*Generated by CTB Audit Generator v1.0*\n"

        return md


def main():
    # Initialize auditor
    auditor = CTBAuditGenerator(root_dir='ctb')

    # Run audit
    audit_data = auditor.generate_audit()

    # Generate report
    report_md = auditor.generate_report_md()

    # Save report
    report_path = Path('CTB_AUDIT_REPORT.md')
    report_path.write_text(report_md, encoding='utf-8')

    print(f"\n📄 Report saved: {report_path}")

    # Save JSON data
    json_path = Path('ctb/meta/audit_data.json')
    json_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps(audit_data, indent=2), encoding='utf-8')

    print(f"💾 Data saved: {json_path}")
    print()
    print("✅ CTB Audit Complete!")

    # Exit with error if score is below minimum
    min_score = 90
    actual_score = audit_data['statistics']['compliance_score']

    if actual_score < min_score:
        print(f"\n⚠️  WARNING: Compliance score {actual_score}% is below minimum {min_score}%")
        return 1

    return 0


if __name__ == '__main__':
    sys.exit(main())
