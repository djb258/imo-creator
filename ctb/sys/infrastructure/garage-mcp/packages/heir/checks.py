"""
HEIR compliance checks for garage-mcp project
Enforces project structure and quality standards
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Any, Optional
import subprocess
import sys

HEIR_VERSION = "0.1.0"

def _optional_imports_ok() -> Dict[str, Any]:
    """Check for optional dependencies used by HEIR checks"""
    missing = []
    try:
        import toml
    except ImportError:
        missing.append("toml")
    
    # Add other optional dependencies here as needed
    return {"missing": missing}


def check_lowercase_filenames(project_root: Path) -> Dict[str, Any]:
    """Check that all filenames are lowercase (except allowed patterns)"""
    violations = []
    allowed_patterns = [
        r'^[A-Z]+\.md$',  # README.md, LICENSE.md, etc.
        r'^Makefile$',
        r'^Dockerfile',
        r'\.toml$',  # TOML config files
    ]
    
    for root, dirs, files in os.walk(project_root):
        # Skip hidden directories and node_modules
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']
        
        for file in files:
            # Skip if matches allowed patterns
            if any(re.match(pattern, file) for pattern in allowed_patterns):
                continue
            
            # Check if filename has uppercase letters
            if file != file.lower():
                violations.append(os.path.join(root, file))
    
    return {
        "name": "lowercase_filenames",
        "passed": len(violations) == 0,
        "message": f"Found {len(violations)} files with uppercase names" if violations else "All filenames are lowercase",
        "violations": violations
    }


def check_migrations_location(project_root: Path) -> Dict[str, Any]:
    """Check that migration files are only in allowed directories"""
    violations = []
    migration_patterns = [
        r'^\d{3,}_.*\.(sql|py)$',  # 001_init.sql, 002_add_users.py
        r'^migrate.*\.(sql|py)$',
        r'^migration.*\.(sql|py)$',
    ]
    
    allowed_dirs = ['migrations', 'db/migrations', 'database/migrations']
    
    for root, dirs, files in os.walk(project_root):
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        
        for file in files:
            # Check if file looks like a migration
            if any(re.match(pattern, file) for pattern in migration_patterns):
                rel_path = os.path.relpath(root, project_root)
                # Check if it's in an allowed directory
                if not any(allowed in rel_path for allowed in allowed_dirs):
                    violations.append(os.path.join(rel_path, file))
    
    return {
        "name": "migrations_location",
        "passed": len(violations) == 0,
        "message": f"Found {len(violations)} migration files outside allowed directories" if violations else "All migrations in correct locations",
        "violations": violations
    }


def check_tool_documentation(project_root: Path) -> Dict[str, Any]:
    """Check that all tools have documentation stubs"""
    violations = []
    docs_dir = project_root / "docs" / "tools"
    
    # Find all tool definitions in modules
    modules_dir = project_root / "services" / "mcp" / "modules"
    
    if modules_dir.exists():
        for module_file in modules_dir.rglob("*.py"):
            if module_file.name == "__init__.py":
                continue
            
            # Extract tool names from router definitions
            content = module_file.read_text()
            # Look for router.post patterns
            tool_patterns = re.findall(r'@router\.(post|get)\("([^"]+)"', content)
            
            for method, path in tool_patterns:
                # Convert path to expected doc filename
                # /tools/fs/read -> fs_read.md
                tool_name = path.replace("/tools/", "").replace("/", "_")
                doc_file = docs_dir / f"{tool_name}.md"
                
                if not doc_file.exists():
                    violations.append(f"Missing doc for tool: {tool_name}")
    
    return {
        "name": "tool_documentation",
        "passed": len(violations) == 0,
        "message": f"Found {len(violations)} tools without documentation" if violations else "All tools have documentation",
        "violations": violations
    }


def check_test_coverage(project_root: Path) -> Dict[str, Any]:
    """Check that all modules have corresponding tests"""
    violations = []
    modules_dir = project_root / "services" / "mcp" / "modules"
    tests_dir = project_root / "tests" / "modules"
    
    if modules_dir.exists():
        for module_file in modules_dir.rglob("*.py"):
            if module_file.name == "__init__.py":
                continue
            
            # Construct expected test file name
            rel_path = module_file.relative_to(modules_dir)
            test_name = f"test_{rel_path.stem}.py"
            namespace = rel_path.parent.name
            
            # Check if test file exists
            expected_test = tests_dir / f"test_{namespace}_{rel_path.stem}.py"
            if not expected_test.exists():
                violations.append(f"Missing test for module: {namespace}/{rel_path.stem}")
    
    return {
        "name": "test_coverage",
        "passed": len(violations) == 0,
        "message": f"Found {len(violations)} modules without tests" if violations else "All modules have tests",
        "violations": violations
    }


def check_namespace_compliance(project_root: Path) -> Dict[str, Any]:
    """Check that tools only exist in allowed namespaces"""
    violations = []
    allowed_namespaces = ['core', 'intake', 'domains', 'docs']
    modules_dir = project_root / "services" / "mcp" / "modules"
    
    if modules_dir.exists():
        for item in modules_dir.iterdir():
            if item.is_dir() and not item.name.startswith('__'):
                if item.name not in allowed_namespaces:
                    violations.append(f"Invalid namespace: {item.name}")
    
    return {
        "name": "namespace_compliance",
        "passed": len(violations) == 0,
        "message": f"Found {len(violations)} invalid namespaces" if violations else "All namespaces are valid",
        "violations": violations
    }


def run_checks(target_path: str = ".", strict: bool = False, branch: Optional[str] = None, commit_sha: Optional[str] = None) -> Dict[str, Any]:
    """
    Run HEIR compliance checks. Returns a dict with {status, missing, details}.
    Never raises on missing optional libs; report them instead.
    """
    info = _optional_imports_ok()
    project_root = Path(target_path).resolve()
    
    # If running in CI, use current directory
    if os.getenv("CI"):
        project_root = Path.cwd()
    
    try:
        checks = [
            check_lowercase_filenames(project_root),
            check_migrations_location(project_root),
            check_tool_documentation(project_root),
            check_test_coverage(project_root),
            check_namespace_compliance(project_root),
        ]
        
        all_passed = all(check["passed"] for check in checks)
        
        if info["missing"]:
            status = "degraded" if not strict else "fail"
        else:
            status = "ok" if all_passed else "fail"
            
        details = {
            "checked_path": str(project_root),
            "version": HEIR_VERSION,
            "checks": checks,
            "all_passed": all_passed
        }
        
        return {
            "status": status,
            "missing": info["missing"],
            "details": details
        }
        
    except Exception as e:
        return {
            "status": "error",
            "missing": info["missing"],
            "details": {
                "checked_path": str(project_root),
                "version": HEIR_VERSION,
                "error": str(e)
            }
        }


def run_checks_legacy(branch: Optional[str] = None, commit_sha: Optional[str] = None) -> List[Dict[str, Any]]:
    """Legacy interface for backwards compatibility"""
    result = run_checks(".", False, branch, commit_sha)
    return result.get("details", {}).get("checks", [])


def main():
    """CLI entry point for running checks"""
    result = run_checks()
    checks = result.get("details", {}).get("checks", [])
    
    # Print results
    print("\n=== HEIR Compliance Check Results ===\n")
    print(f"Status: {result['status']}")
    if result.get("missing"):
        print(f"Missing optional dependencies: {', '.join(result['missing'])}")
    print()
    
    all_passed = True
    for check in checks:
        status = "✓" if check["passed"] else "✗"
        print(f"{status} {check['name']}: {check['message']}")
        
        if not check["passed"]:
            all_passed = False
            if check.get("violations"):
                for violation in check["violations"][:5]:  # Show first 5 violations
                    print(f"  - {violation}")
                if len(check["violations"]) > 5:
                    print(f"  ... and {len(check['violations']) - 5} more")
    
    print("\n" + "=" * 40)
    
    if result["status"] == "ok":
        print("All checks passed! ✓")
        sys.exit(0)
    elif result["status"] == "degraded":
        print("Checks completed with degraded functionality (missing optional deps)")
        sys.exit(0)
    else:
        print("Some checks failed. Please fix the violations.")
        sys.exit(1)


if __name__ == "__main__":
    main()