#!/usr/bin/env python3
"""
CTB Compliance Runner
Runs the three core CTB compliance scripts sequentially and generates reports

Usage:
    python run_ctb_compliance.py [directory]
"""

import sys
import os
import json
import subprocess
from pathlib import Path
from datetime import datetime


class CTBComplianceRunner:
    """Runs CTB compliance cycle and generates reports"""

    def __init__(self, target_dir='ctb'):
        self.target_dir = Path(target_dir).resolve()
        self.scripts_dir = Path(__file__).parent
        self.root_dir = self.target_dir.parent if self.target_dir.name == 'ctb' else self.target_dir
        self.reports_dir = self.root_dir / 'logs'
        self.reports_dir.mkdir(exist_ok=True)

        self.results = {
            'timestamp': datetime.utcnow().isoformat(),
            'target_directory': str(self.target_dir),
            'tagger': {'status': 'pending', 'output': None},
            'auditor': {'status': 'pending', 'output': None},
            'remediator': {'status': 'pending', 'output': None}
        }

    def run_tagger(self):
        """Run CTB metadata tagger"""
        print("=" * 60)
        print("STEP 1: CTB Metadata Tagger")
        print("=" * 60)
        print(f"Tagging files in: {self.target_dir}\n")

        try:
            # Import and run tagger
            sys.path.insert(0, str(self.scripts_dir))
            from ctb_metadata_tagger import CTBMetadataTagger

            tagger = CTBMetadataTagger(str(self.target_dir))
            results = tagger.scan_directory()

            # Save tags
            tags_file = self.root_dir / 'ctb' / 'meta' / 'ctb_tags.json'
            tags_file.parent.mkdir(parents=True, exist_ok=True)
            with open(tags_file, 'w') as f:
                json.dump(results, f, indent=2)

            self.results['tagger']['status'] = 'success'
            self.results['tagger']['output'] = results
            self.results['tagger']['tags_file'] = str(tags_file)

            # Generate report
            self._generate_tagging_report(results)

            print(f"\n[SUCCESS] Tagged {results['summary']['total_files']} files")
            print(f"[SUCCESS] Output: {tags_file}")
            print(f"[SUCCESS] Report: {self.reports_dir}/CTB_TAGGING_REPORT.md\n")

            return True

        except Exception as e:
            self.results['tagger']['status'] = 'failed'
            self.results['tagger']['error'] = str(e)
            print(f"\n[ERROR] Tagger failed: {e}\n")
            return False

    def run_auditor(self):
        """Run CTB audit generator"""
        print("=" * 60)
        print("STEP 2: CTB Audit Generator")
        print("=" * 60)
        print(f"Auditing: {self.root_dir}\n")

        try:
            # Import and run auditor
            sys.path.insert(0, str(self.scripts_dir))
            from ctb_audit_generator import CTBAuditGenerator

            auditor = CTBAuditGenerator(str(self.root_dir))

            # Run all checks
            auditor.check_structure()
            auditor.check_file_distribution()
            auditor.check_metadata()
            auditor.check_global_factory()
            score = auditor.calculate_compliance_score()

            # Save audit report
            audit_file = self.reports_dir / 'ctb_audit_report.json'
            with open(audit_file, 'w') as f:
                json.dump(auditor.audit_results, f, indent=2)

            self.results['auditor']['status'] = 'success'
            self.results['auditor']['output'] = auditor.audit_results
            self.results['auditor']['score'] = score
            self.results['auditor']['audit_file'] = str(audit_file)

            # Generate markdown report
            self._generate_audit_report(auditor.audit_results, score)

            status = "EXCELLENT" if score >= 90 else "GOOD" if score >= 70 else "NEEDS IMPROVEMENT"
            print(f"\n[SUCCESS] Compliance Score: {score}/100 - {status}")
            print(f"[SUCCESS] Output: {audit_file}")
            print(f"[SUCCESS] Report: {self.reports_dir}/CTB_AUDIT_REPORT.md\n")

            return True

        except Exception as e:
            self.results['auditor']['status'] = 'failed'
            self.results['auditor']['error'] = str(e)
            print(f"\n[ERROR] Auditor failed: {e}\n")
            return False

    def run_remediator(self, dry_run=False):
        """Run CTB remediator"""
        print("=" * 60)
        print(f"STEP 3: CTB Remediator {'(DRY RUN)' if dry_run else ''}")
        print("=" * 60)
        print(f"Remediating: {self.root_dir}\n")

        try:
            # Import and run remediator
            sys.path.insert(0, str(self.scripts_dir))
            from ctb_remediator import CTBRemediator

            remediator = CTBRemediator(str(self.root_dir), dry_run=dry_run)

            # Load audit report
            remediator.load_audit_report()

            # Run remediation
            remediator.create_missing_directories()
            remediator.create_ctb_registry()
            remediator.create_global_config()

            # Save log
            remediator.save_remediation_log()

            # Save results
            log_file = self.reports_dir / 'ctb_remediation_log.json'

            self.results['remediator']['status'] = 'success'
            self.results['remediator']['actions_count'] = len(remediator.actions_taken)
            self.results['remediator']['dry_run'] = dry_run
            self.results['remediator']['log_file'] = str(log_file)

            # Generate summary report
            self._generate_remediation_summary(remediator.actions_taken, dry_run)

            print(f"\n[SUCCESS] Remediation complete")
            print(f"[SUCCESS] Actions taken: {len(remediator.actions_taken)}")
            print(f"[SUCCESS] Output: {log_file}")
            print(f"[SUCCESS] Report: {self.reports_dir}/CTB_REMEDIATION_SUMMARY.md\n")

            return True

        except Exception as e:
            self.results['remediator']['status'] = 'failed'
            self.results['remediator']['error'] = str(e)
            print(f"\n[ERROR] Remediator failed: {e}\n")
            return False

    def _generate_tagging_report(self, results):
        """Generate CTB_TAGGING_REPORT.md"""
        report_file = self.reports_dir / 'CTB_TAGGING_REPORT.md'

        content = f"""# CTB Tagging Report

**Generated**: {datetime.utcnow().isoformat()}
**Target Directory**: {self.target_dir}
**Total Files Tagged**: {results['summary']['total_files']}

---

## Summary

Files have been classified into CTB branches based on content analysis.

### Distribution by Branch

| Branch | File Count | Percentage |
|--------|-----------|------------|
"""
        total = results['summary']['total_files']
        for branch, count in sorted(results['summary']['by_branch'].items()):
            pct = (count / total * 100) if total > 0 else 0
            content += f"| {branch} | {count} | {pct:.1f}% |\n"

        content += f"""
---

## Tagged Files

Total: {len(results['files'])} files

"""
        for i, file_data in enumerate(results['files'][:50], 1):  # Show first 50
            content += f"""
### {i}. {file_data['file_path']}

- **CTB Branch**: {file_data['ctb_branch']}
- **File Type**: {file_data['file_type']}
- **HEIR ID**: {file_data['heir_id']}
- **Suggested Location**: {file_data['suggested_location']}
"""

        if len(results['files']) > 50:
            content += f"\n... and {len(results['files']) - 50} more files\n"

        content += """
---

## Next Steps

1. Review suggested file locations
2. Run CTB auditor to check compliance
3. Run CTB remediator to fix issues

**Full details**: See `ctb/meta/ctb_tags.json`
"""

        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(content)

    def _generate_audit_report(self, audit_results, score):
        """Generate CTB_AUDIT_REPORT.md"""
        report_file = self.reports_dir / 'CTB_AUDIT_REPORT.md'

        status = "EXCELLENT" if score >= 90 else "GOOD" if score >= 70 else "NEEDS IMPROVEMENT" if score >= 50 else "NON-COMPLIANT"
        emoji = "✅" if score >= 90 else "⚠️" if score >= 70 else "❌"

        content = f"""# CTB Compliance Audit Report

**Generated**: {audit_results['audit_timestamp']}
**Repository**: {audit_results['repository']}
**CTB Version**: {audit_results['ctb_version']}

---

## {emoji} Compliance Score: {score}/100

**Status**: {status}

---

## Structure Check

| Path | Required | Exists | Status |
|------|----------|--------|--------|
"""
        for path, check in audit_results['structure_check'].items():
            req = "Yes" if check['required'] else "No"
            exists = "✅" if check['exists'] else "❌"
            content += f"| {path} | {req} | {exists} | {check['description']} |\n"

        content += f"""
---

## File Distribution

| Branch | File Count |
|--------|-----------|
"""
        for branch, count in sorted(audit_results['file_distribution'].items()):
            content += f"| {branch} | {count} |\n"

        if audit_results['issues']:
            content += f"""
---

## Issues Found ({len(audit_results['issues'])})

"""
            for i, issue in enumerate(audit_results['issues'], 1):
                content += f"""
### {i}. [{issue['severity']}] {issue['message']}

- **Category**: {issue['category']}
- **Recommendation**: {issue['recommendation']}
"""

        if audit_results['recommendations']:
            content += f"""
---

## Recommendations ({len(audit_results['recommendations'])})

"""
            for i, rec in enumerate(audit_results['recommendations'], 1):
                content += f"""
### {i}. [{rec['priority']}] {rec['message']}

- **Category**: {rec['category']}
- **Action**: {rec['action']}
"""

        content += """
---

## Next Steps

"""
        if score < 90:
            content += """
1. Review issues and recommendations above
2. Run CTB remediator to auto-fix issues
3. Manually address remaining issues
4. Re-run audit to verify improvements
"""
        else:
            content += """
1. Maintain current compliance level
2. Run monthly audits to catch drift
3. Update documentation as needed
"""

        content += """
---

**Full details**: See `logs/ctb_audit_report.json`
"""

        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(content)

    def _generate_remediation_summary(self, actions, dry_run):
        """Generate CTB_REMEDIATION_SUMMARY.md"""
        report_file = self.reports_dir / 'CTB_REMEDIATION_SUMMARY.md'

        content = f"""# CTB Remediation Summary

**Generated**: {datetime.utcnow().isoformat()}
**Mode**: {'DRY RUN (No changes made)' if dry_run else 'APPLIED'}
**Actions Taken**: {len(actions)}

---

## Actions Performed

"""
        if not actions:
            content += "No actions were needed. Repository is compliant!\n"
        else:
            for i, action in enumerate(actions, 1):
                action_type = action['action'].replace('_', ' ').title()
                content += f"""
### {i}. {action_type}

- **Timestamp**: {action['timestamp']}
"""
                if 'path' in action:
                    content += f"- **Path**: {action['path']}\n"
                if 'from' in action:
                    content += f"- **From**: {action['from']}\n"
                if 'to' in action:
                    content += f"- **To**: {action['to']}\n"

        content += """
---

## Next Steps

"""
        if dry_run:
            content += """
1. Review actions above
2. Run remediator without --dry-run to apply changes
3. Re-run audit to verify improvements
"""
        else:
            content += """
1. Run CTB auditor to verify improvements
2. Commit changes to git
3. Update documentation as needed
"""

        content += """
---

**Full details**: See `logs/ctb_remediation_log.json`
"""

        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(content)

    def run_full_cycle(self, dry_run=False):
        """Run complete CTB compliance cycle"""
        print("\n" + "=" * 60)
        print("CTB COMPLIANCE CYCLE")
        print("=" * 60)
        print(f"Target: {self.target_dir}")
        print(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")
        print("=" * 60 + "\n")

        # Step 1: Tagger
        if not self.run_tagger():
            print("[FAILED] Tagger failed. Stopping cycle.")
            return False

        # Step 2: Auditor
        if not self.run_auditor():
            print("[FAILED] Auditor failed. Stopping cycle.")
            return False

        # Step 3: Remediator
        if not self.run_remediator(dry_run=dry_run):
            print("[FAILED] Remediator failed. Stopping cycle.")
            return False

        # Save overall results
        results_file = self.reports_dir / 'ctb_compliance_results.json'
        with open(results_file, 'w') as f:
            json.dump(self.results, f, indent=2)

        print("=" * 60)
        print("CTB COMPLIANCE CYCLE COMPLETE")
        print("=" * 60)
        print(f"\nReports generated:")
        print(f"  - {self.reports_dir}/CTB_TAGGING_REPORT.md")
        print(f"  - {self.reports_dir}/CTB_AUDIT_REPORT.md")
        print(f"  - {self.reports_dir}/CTB_REMEDIATION_SUMMARY.md")
        print(f"  - {self.reports_dir}/ctb_compliance_results.json")

        if self.results['auditor']['status'] == 'success':
            score = self.results['auditor']['score']
            print(f"\nFinal Compliance Score: {score}/100")

        print("\n" + "=" * 60 + "\n")

        return True


def main():
    import argparse

    parser = argparse.ArgumentParser(description='Run CTB compliance cycle')
    parser.add_argument('directory', nargs='?', default='ctb', help='Target directory (default: ctb)')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes without applying')
    args = parser.parse_args()

    runner = CTBComplianceRunner(args.directory)
    success = runner.run_full_cycle(dry_run=args.dry_run)

    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
