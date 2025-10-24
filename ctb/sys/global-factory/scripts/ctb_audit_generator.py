#!/usr/bin/env python3
"""
CTB Audit Generator
Generates compliance audit reports for CTB structure

Usage:
    python ctb_audit_generator.py
"""

import json
import os
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any


class CTBAuditGenerator:
    """Generate CTB compliance audit reports"""

    REQUIRED_STRUCTURE = {
        'ctb': {
            'sys': ['required', 'System integrations and infrastructure'],
            'ai': ['required', 'AI models, prompts, and training'],
            'data': ['required', 'Database schemas and migrations'],
            'docs': ['required', 'Documentation and guides'],
            'ui': ['optional', 'UI components and templates'],
            'meta': ['required', 'CTB metadata and registry']
        },
        'logs': ['required', 'Application and audit logs'],
        'global-config.yaml': ['required', 'Global configuration file']
    }

    def __init__(self, root_dir: str = '.'):
        self.root_dir = Path(root_dir).resolve()
        self.audit_results = {
            'audit_timestamp': datetime.utcnow().isoformat(),
            'repository': self.root_dir.name,
            'ctb_version': '1.0.0',
            'compliance_score': 0,
            'issues': [],
            'recommendations': [],
            'structure_check': {},
            'file_distribution': {}
        }

    def check_structure(self) -> Dict[str, Any]:
        """Check if CTB directory structure exists"""
        structure_check = {}

        for path, (requirement, description) in self.REQUIRED_STRUCTURE.items():
            full_path = self.root_dir / path
            exists = full_path.exists()

            structure_check[path] = {
                'exists': exists,
                'required': requirement == 'required',
                'description': description,
                'path': str(full_path)
            }

            if requirement == 'required' and not exists:
                self.audit_results['issues'].append({
                    'severity': 'HIGH',
                    'category': 'structure',
                    'message': f"Missing required path: {path}",
                    'recommendation': f"Create directory/file: {path}"
                })

        self.audit_results['structure_check'] = structure_check
        return structure_check

    def check_file_distribution(self) -> Dict[str, Any]:
        """Check file distribution across CTB branches"""
        distribution = {
            'sys': 0,
            'ai': 0,
            'data': 0,
            'docs': 0,
            'ui': 0,
            'meta': 0,
            'non_ctb': 0
        }

        ctb_dir = self.root_dir / 'ctb'
        if ctb_dir.exists():
            for branch in ['sys', 'ai', 'data', 'docs', 'ui', 'meta']:
                branch_dir = ctb_dir / branch
                if branch_dir.exists():
                    distribution[branch] = sum(1 for _ in branch_dir.rglob('*') if _.is_file())

        # Check for files outside CTB structure
        ignore_patterns = ['node_modules', '.git', '__pycache__', 'dist', 'build', '.next']
        for item in self.root_dir.iterdir():
            if item.is_file() and item.name != 'global-config.yaml':
                distribution['non_ctb'] += 1
            elif item.is_dir() and item.name not in ['ctb', 'logs'] + ignore_patterns:
                # Count files in non-CTB directories
                try:
                    distribution['non_ctb'] += sum(1 for _ in item.rglob('*') if _.is_file())
                except:
                    pass

        if distribution['non_ctb'] > 0:
            self.audit_results['recommendations'].append({
                'priority': 'MEDIUM',
                'category': 'organization',
                'message': f"Found {distribution['non_ctb']} files outside CTB structure",
                'action': "Run ctb_reorganizer.py to move files into CTB branches"
            })

        self.audit_results['file_distribution'] = distribution
        return distribution

    def check_metadata(self) -> Dict[str, Any]:
        """Check CTB metadata files"""
        metadata_check = {
            'registry_exists': False,
            'tags_exist': False,
            'valid_registry': False
        }

        # Check registry
        registry_path = self.root_dir / 'ctb' / 'meta' / 'ctb_registry.json'
        if registry_path.exists():
            metadata_check['registry_exists'] = True
            try:
                with open(registry_path, 'r') as f:
                    registry = json.load(f)
                    metadata_check['valid_registry'] = 'version' in registry
            except:
                self.audit_results['issues'].append({
                    'severity': 'MEDIUM',
                    'category': 'metadata',
                    'message': 'CTB registry exists but is invalid JSON',
                    'recommendation': 'Fix or regenerate ctb/meta/ctb_registry.json'
                })
        else:
            self.audit_results['issues'].append({
                'severity': 'MEDIUM',
                'category': 'metadata',
                'message': 'Missing CTB registry file',
                'recommendation': 'Create ctb/meta/ctb_registry.json'
            })

        # Check tags
        tags_path = self.root_dir / 'ctb' / 'meta' / 'ctb_tags.json'
        metadata_check['tags_exist'] = tags_path.exists()

        if not tags_path.exists():
            self.audit_results['recommendations'].append({
                'priority': 'LOW',
                'category': 'metadata',
                'message': 'Missing CTB tags file',
                'action': 'Run ctb_metadata_tagger.py to generate tags'
            })

        return metadata_check

    def check_global_factory(self) -> Dict[str, Any]:
        """Check global-factory installation"""
        factory_check = {
            'exists': False,
            'scripts_complete': False,
            'doctrine_complete': False
        }

        factory_dir = self.root_dir / 'ctb' / 'sys' / 'global-factory'
        if factory_dir.exists():
            factory_check['exists'] = True

            # Check scripts
            scripts_dir = factory_dir / 'scripts'
            required_scripts = [
                'ctb_metadata_tagger.py',
                'ctb_audit_generator.py',
                'ctb_remediator.py'
            ]
            factory_check['scripts_complete'] = all(
                (scripts_dir / script).exists() for script in required_scripts
            )

            # Check doctrine
            doctrine_dir = factory_dir / 'doctrine'
            required_doctrine = [
                'PROMPT_1_REORGANIZER.md',
                'PROMPT_2_TAGGER_AUDITOR_REMEDIATOR.md',
                'README.md'
            ]
            factory_check['doctrine_complete'] = all(
                (doctrine_dir / doc).exists() for doc in required_doctrine
            )
        else:
            self.audit_results['issues'].append({
                'severity': 'HIGH',
                'category': 'factory',
                'message': 'Global factory not installed',
                'recommendation': 'Run setup_ctb.sh to install global factory'
            })

        return factory_check

    def calculate_compliance_score(self) -> int:
        """Calculate overall compliance score (0-100)"""
        score = 100

        # Structure penalties
        for path, check in self.audit_results['structure_check'].items():
            if check['required'] and not check['exists']:
                score -= 15

        # Distribution penalties
        dist = self.audit_results['file_distribution']
        if dist['non_ctb'] > dist.get('sys', 0) + dist.get('data', 0'):
            score -= 10  # More files outside CTB than inside

        # Issue penalties
        for issue in self.audit_results['issues']:
            if issue['severity'] == 'HIGH':
                score -= 10
            elif issue['severity'] == 'MEDIUM':
                score -= 5

        self.audit_results['compliance_score'] = max(0, score)
        return self.audit_results['compliance_score']

    def generate_report(self, output_path: str = 'logs/ctb_audit_report.json') -> Dict[str, Any]:
        """Generate complete audit report"""
        print("🔍 Running CTB Compliance Audit...\n")

        # Run all checks
        print("📁 Checking directory structure...")
        self.check_structure()

        print("📊 Analyzing file distribution...")
        self.check_file_distribution()

        print("🏷️  Checking metadata...")
        self.check_metadata()

        print("🏭 Checking global factory...")
        self.check_global_factory()

        print("📈 Calculating compliance score...")
        score = self.calculate_compliance_score()

        # Save report
        output_file = self.root_dir / output_path
        output_file.parent.mkdir(parents=True, exist_ok=True)

        with open(output_file, 'w') as f:
            json.dump(self.audit_results, f, indent=2)

        # Print summary
        print(f"\n{'='*60}")
        print(f"🎯 CTB COMPLIANCE AUDIT REPORT")
        print(f"{'='*60}")
        print(f"Repository: {self.audit_results['repository']}")
        print(f"Audit Time: {self.audit_results['audit_timestamp']}")
        print(f"\n📊 COMPLIANCE SCORE: {score}/100")

        if score >= 90:
            print("✅ Status: EXCELLENT")
        elif score >= 70:
            print("⚠️  Status: GOOD (Improvements recommended)")
        elif score >= 50:
            print("⚠️  Status: NEEDS IMPROVEMENT")
        else:
            print("❌ Status: NON-COMPLIANT")

        print(f"\n📁 Structure Check:")
        for path, check in self.audit_results['structure_check'].items():
            status = "✅" if check['exists'] else "❌"
            req = "(required)" if check['required'] else "(optional)"
            print(f"   {status} {path} {req}")

        print(f"\n📊 File Distribution:")
        for branch, count in self.audit_results['file_distribution'].items():
            print(f"   {branch}: {count} files")

        if self.audit_results['issues']:
            print(f"\n❌ Issues Found ({len(self.audit_results['issues'])}):")
            for issue in self.audit_results['issues'][:5]:  # Show top 5
                print(f"   [{issue['severity']}] {issue['message']}")

        if self.audit_results['recommendations']:
            print(f"\n💡 Recommendations ({len(self.audit_results['recommendations'])}):")
            for rec in self.audit_results['recommendations'][:5]:  # Show top 5
                print(f"   [{rec['priority']}] {rec['message']}")

        print(f"\n📄 Full report saved to: {output_file}")
        print(f"{'='*60}\n")

        return self.audit_results


def main():
    print("🏗️  CTB Audit Generator\n")

    auditor = CTBAuditGenerator()
    report = auditor.generate_report()

    if report['compliance_score'] < 90:
        print("💡 Run ctb_remediator.py to automatically fix issues")


if __name__ == '__main__':
    main()
