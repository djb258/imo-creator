#!/usr/bin/env python3
"""
Simple CTB Compliance Runner
Runs the compliance cycle without emoji issues
"""

import sys
import os
import json
from pathlib import Path
from datetime import datetime, timezone

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Import the classes
from ctb_metadata_tagger import CTBMetadataTagger
from ctb_audit_generator import CTBAuditGenerator
from ctb_remediator import CTBRemediator


def run_compliance_cycle(target_dir='ctb'):
    """Run complete compliance cycle"""
    target_path = Path(target_dir).resolve()
    root_dir = target_path.parent if target_path.name == 'ctb' else target_path
    logs_dir = root_dir / 'logs'
    logs_dir.mkdir(exist_ok=True)

    print("\n" + "=" * 60)
    print("CTB COMPLIANCE CYCLE")
    print("=" * 60)
    print(f"Target: {target_path}")
    print(f"Root: {root_dir}")
    print("=" * 60 + "\n")

    results = {
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'target': str(target_path),
        'steps': []
    }

    # STEP 1: Tagger
    print("\n[STEP 1] Running Metadata Tagger...")
    try:
        tagger = CTBMetadataTagger(str(target_path))
        tag_results = tagger.scan_directory()

        # Save tags
        tags_file = root_dir / 'ctb' / 'meta' / 'ctb_tags.json'
        tags_file.parent.mkdir(parents=True, exist_ok=True)
        with open(tags_file, 'w') as f:
            json.dump(tag_results, f, indent=2)

        print(f"  [OK] Tagged {tag_results['summary']['total_files']} files")
        print(f"  [OK] Saved to: {tags_file}")

        # Generate report
        tagging_report = logs_dir / 'CTB_TAGGING_REPORT.md'
        generate_tagging_report(tag_results, tagging_report, target_path)
        print(f"  [OK] Report: {tagging_report}")

        results['steps'].append({
            'name': 'tagger',
            'status': 'success',
            'files_tagged': tag_results['summary']['total_files'],
            'output': str(tags_file)
        })

    except Exception as e:
        print(f"  [ERROR] {e}")
        results['steps'].append({'name': 'tagger', 'status': 'failed', 'error': str(e)})
        return False, results

    # STEP 2: Auditor
    print("\n[STEP 2] Running Audit Generator...")
    try:
        auditor = CTBAuditGenerator(str(root_dir))
        auditor.check_structure()
        auditor.check_file_distribution()
        auditor.check_metadata()
        auditor.check_global_factory()
        score = auditor.calculate_compliance_score()

        # Save audit
        audit_file = logs_dir / 'ctb_audit_report.json'
        with open(audit_file, 'w') as f:
            json.dump(auditor.audit_results, f, indent=2)

        print(f"  [OK] Compliance Score: {score}/100")
        print(f"  [OK] Saved to: {audit_file}")

        # Generate report
        audit_report = logs_dir / 'CTB_AUDIT_REPORT.md'
        generate_audit_report(auditor.audit_results, score, audit_report)
        print(f"  [OK] Report: {audit_report}")

        results['steps'].append({
            'name': 'auditor',
            'status': 'success',
            'score': score,
            'output': str(audit_file)
        })

    except Exception as e:
        print(f"  [ERROR] {e}")
        import traceback
        traceback.print_exc()
        results['steps'].append({'name': 'auditor', 'status': 'failed', 'error': str(e)})
        return False, results

    # STEP 3: Remediator
    print("\n[STEP 3] Running Remediator...")
    try:
        remediator = CTBRemediator(str(root_dir), dry_run=False)
        remediator.load_audit_report()
        remediator.create_missing_directories()
        remediator.create_ctb_registry()
        remediator.create_global_config()
        remediator.save_remediation_log()

        print(f"  [OK] Actions taken: {len(remediator.actions_taken)}")
        print(f"  [OK] Saved to: {logs_dir}/ctb_remediation_log.json")

        # Generate report
        remediation_report = logs_dir / 'CTB_REMEDIATION_SUMMARY.md'
        generate_remediation_report(remediator.actions_taken, remediation_report)
        print(f"  [OK] Report: {remediation_report}")

        results['steps'].append({
            'name': 'remediator',
            'status': 'success',
            'actions': len(remediator.actions_taken),
            'output': str(logs_dir / 'ctb_remediation_log.json')
        })

    except Exception as e:
        print(f"  [ERROR] {e}")
        import traceback
        traceback.print_exc()
        results['steps'].append({'name': 'remediator', 'status': 'failed', 'error': str(e)})
        return False, results

    # Save overall results
    results_file = logs_dir / 'ctb_compliance_results.json'
    with open(results_file, 'w') as f:
        json.dump(results, f, indent=2)

    print("\n" + "=" * 60)
    print("CTB COMPLIANCE CYCLE COMPLETE")
    print("=" * 60)
    print(f"\nReports:")
    print(f"  - {logs_dir}/CTB_TAGGING_REPORT.md")
    print(f"  - {logs_dir}/CTB_AUDIT_REPORT.md")
    print(f"  - {logs_dir}/CTB_REMEDIATION_SUMMARY.md")
    print(f"\nCompliance Score: {score}/100")
    print("=" * 60 + "\n")

    return True, results


def generate_tagging_report(results, output_file, target_dir):
    """Generate tagging report"""
    total = results['summary']['total_files']
    content = f"""# CTB Tagging Report

**Generated**: {datetime.now(timezone.utc).isoformat()}
**Target**: {target_dir}
**Files Tagged**: {total}

## Distribution

| Branch | Count | Percentage |
|--------|-------|------------|
"""
    for branch, count in sorted(results['summary']['by_branch'].items()):
        pct = (count / total * 100) if total > 0 else 0
        content += f"| {branch} | {count} | {pct:.1f}% |\n"

    content += f"\n## Tagged Files\n\n"
    for file_data in results['files'][:20]:
        content += f"- **{file_data['file_path']}**\n"
        content += f"  - Branch: {file_data['ctb_branch']}\n"
        content += f"  - Suggested: {file_data['suggested_location']}\n\n"

    if len(results['files']) > 20:
        content += f"\n... and {len(results['files']) - 20} more files\n"

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)


def generate_audit_report(audit_results, score, output_file):
    """Generate audit report"""
    status = "EXCELLENT" if score >= 90 else "GOOD" if score >= 70 else "NEEDS WORK"

    content = f"""# CTB Audit Report

**Generated**: {audit_results['audit_timestamp']}
**Repository**: {audit_results['repository']}
**Score**: {score}/100 - {status}

## Structure Check

| Path | Required | Exists |
|------|----------|--------|
"""
    for path, check in audit_results['structure_check'].items():
        req = "Yes" if check['required'] else "No"
        exists = "Yes" if check['exists'] else "No"
        content += f"| {path} | {req} | {exists} |\n"

    content += f"\n## File Distribution\n\n"
    for branch, count in sorted(audit_results['file_distribution'].items()):
        content += f"- {branch}: {count} files\n"

    if audit_results['issues']:
        content += f"\n## Issues ({len(audit_results['issues'])})\n\n"
        for issue in audit_results['issues']:
            content += f"- [{issue['severity']}] {issue['message']}\n"

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)


def generate_remediation_report(actions, output_file):
    """Generate remediation report"""
    content = f"""# CTB Remediation Summary

**Generated**: {datetime.now(timezone.utc).isoformat()}
**Actions**: {len(actions)}

## Actions Performed

"""
    if not actions:
        content += "No actions needed - repository is compliant!\n"
    else:
        for i, action in enumerate(actions, 1):
            content += f"\n### {i}. {action['action']}\n\n"
            if 'path' in action:
                content += f"- Path: {action['path']}\n"

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)


if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else 'ctb'
    success, results = run_compliance_cycle(target)
    sys.exit(0 if success else 1)
