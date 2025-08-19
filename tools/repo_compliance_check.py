#!/usr/bin/env python3
"""
Repository Compliance Checker
Validates repositories against IMO Creator standards.

Usage:
    python tools/repo_compliance_check.py /path/to/target/repo
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Tuple, Optional

class ComplianceChecker:
    def __init__(self, repo_path: str):
        self.repo_path = Path(repo_path)
        self.results = {
            "repo_path": str(self.repo_path),
            "overall_score": 0,
            "checks": {},
            "recommendations": []
        }
        
    def check_git_repo(self) -> bool:
        """Verify target is a git repository"""
        return (self.repo_path / ".git").exists()
    
    def check_python_project(self) -> Tuple[bool, Dict]:
        """Check for Python project structure"""
        details = {}
        
        # Check for requirements.txt or pyproject.toml
        req_file = self.repo_path / "requirements.txt"
        pyproject_file = self.repo_path / "pyproject.toml"
        details["has_dependencies"] = req_file.exists() or pyproject_file.exists()
        
        # Check for src/ structure
        src_dir = self.repo_path / "src"
        details["has_src_structure"] = src_dir.exists() and src_dir.is_dir()
        
        # Check for main entry point
        main_candidates = [
            "src/server/main.py",
            "src/main.py", 
            "main.py",
            "app.py"
        ]
        details["has_main_entry"] = any((self.repo_path / path).exists() for path in main_candidates)
        
        return all(details.values()), details
    
    def check_documentation(self) -> Tuple[bool, Dict]:
        """Check for required documentation files"""
        details = {}
        
        readme_files = ["README.md", "README.rst", "README.txt"]
        details["has_readme"] = any((self.repo_path / f).exists() for f in readme_files)
        
        details["has_license"] = (self.repo_path / "LICENSE").exists()
        details["has_contributing"] = (self.repo_path / "CONTRIBUTING.md").exists()
        
        return all(details.values()), details
    
    def check_ci_cd(self) -> Tuple[bool, Dict]:
        """Check for CI/CD configuration"""
        details = {}
        
        # GitHub Actions
        gh_actions = self.repo_path / ".github" / "workflows"
        details["has_github_actions"] = gh_actions.exists() and any(gh_actions.glob("*.yml"))
        
        # Other CI systems
        ci_files = [
            ".travis.yml",
            ".circleci/config.yml", 
            "azure-pipelines.yml",
            ".gitlab-ci.yml"
        ]
        details["has_other_ci"] = any((self.repo_path / f).exists() for f in ci_files)
        
        details["has_ci"] = details["has_github_actions"] or details["has_other_ci"]
        
        return details["has_ci"], details
    
    def check_testing(self) -> Tuple[bool, Dict]:
        """Check for testing setup"""
        details = {}
        
        # Test directories
        test_dirs = ["tests", "test", "src/tests"]
        details["has_test_dir"] = any((self.repo_path / d).exists() for d in test_dirs)
        
        # Test files
        test_patterns = ["test_*.py", "*_test.py"]
        test_files = []
        for pattern in test_patterns:
            test_files.extend(list(self.repo_path.rglob(pattern)))
        details["has_test_files"] = len(test_files) > 0
        details["test_file_count"] = len(test_files)
        
        return details["has_test_dir"] and details["has_test_files"], details
    
    def check_deployment_config(self) -> Tuple[bool, Dict]:
        """Check for deployment configuration"""
        details = {}
        
        # Vercel
        details["has_vercel"] = (self.repo_path / "vercel.json").exists()
        
        # Docker
        details["has_docker"] = (self.repo_path / "Dockerfile").exists()
        
        # Other deployment configs
        deploy_files = [
            "docker-compose.yml",
            "k8s.yml",
            "kubernetes.yml",
            "Procfile",
            "app.yaml",
            "serverless.yml"
        ]
        details["has_other_deploy"] = any((self.repo_path / f).exists() for f in deploy_files)
        
        details["has_deployment"] = any([details["has_vercel"], details["has_docker"], details["has_other_deploy"]])
        
        return details["has_deployment"], details
    
    def check_code_quality(self) -> Tuple[bool, Dict]:
        """Check for code quality tools"""
        details = {}
        
        # Configuration files
        quality_configs = [
            ".ruff.toml",
            "ruff.toml", 
            "pyproject.toml",
            ".flake8",
            ".black",
            ".pre-commit-config.yaml"
        ]
        details["has_quality_config"] = any((self.repo_path / f).exists() for f in quality_configs)
        
        # Check if tools are in requirements
        req_file = self.repo_path / "requirements.txt"
        if req_file.exists():
            content = req_file.read_text()
            quality_tools = ["ruff", "black", "flake8", "mypy", "pylint"]
            details["quality_tools_in_deps"] = any(tool in content for tool in quality_tools)
        else:
            details["quality_tools_in_deps"] = False
            
        return details["has_quality_config"] or details["quality_tools_in_deps"], details
    
    def check_fastapi_compliance(self) -> Tuple[bool, Dict]:
        """Check FastAPI specific compliance"""
        details = {}
        
        # Look for FastAPI in dependencies
        req_file = self.repo_path / "requirements.txt"
        if req_file.exists():
            content = req_file.read_text()
            details["has_fastapi"] = "fastapi" in content.lower()
            details["has_uvicorn"] = "uvicorn" in content.lower()
        else:
            details["has_fastapi"] = False
            details["has_uvicorn"] = False
        
        # Check for CORS configuration
        main_files = list(self.repo_path.rglob("main.py"))
        details["has_cors"] = False
        for main_file in main_files:
            try:
                content = main_file.read_text()
                if "CORSMiddleware" in content or "add_middleware" in content:
                    details["has_cors"] = True
                    break
            except:
                continue
        
        return details["has_fastapi"] and details["has_uvicorn"], details
    
    def generate_recommendations(self) -> List[str]:
        """Generate recommendations based on failed checks"""
        recs = []
        
        for check_name, result in self.results["checks"].items():
            if not result["passed"]:
                if check_name == "git_repo":
                    recs.append("Initialize git repository: git init")
                elif check_name == "python_project":
                    if not result["details"].get("has_dependencies"):
                        recs.append("Add requirements.txt or pyproject.toml")
                    if not result["details"].get("has_src_structure"):
                        recs.append("Create src/ directory structure")
                    if not result["details"].get("has_main_entry"):
                        recs.append("Add main entry point (main.py or app.py)")
                elif check_name == "documentation":
                    if not result["details"].get("has_readme"):
                        recs.append("Add README.md file")
                    if not result["details"].get("has_license"):
                        recs.append("Add LICENSE file")
                    if not result["details"].get("has_contributing"):
                        recs.append("Add CONTRIBUTING.md file")
                elif check_name == "ci_cd":
                    recs.append("Add GitHub Actions workflow (.github/workflows/ci.yml)")
                elif check_name == "testing":
                    if not result["details"].get("has_test_dir"):
                        recs.append("Create tests/ directory")
                    if not result["details"].get("has_test_files"):
                        recs.append("Add test files (test_*.py)")
                elif check_name == "deployment_config":
                    recs.append("Add deployment configuration (vercel.json, Dockerfile, etc.)")
                elif check_name == "code_quality":
                    recs.append("Add code quality tools (ruff, black) and configuration")
                elif check_name == "fastapi_compliance":
                    if not result["details"].get("has_fastapi"):
                        recs.append("Add FastAPI to dependencies")
                    if not result["details"].get("has_uvicorn"):
                        recs.append("Add uvicorn to dependencies")
                    if not result["details"].get("has_cors"):
                        recs.append("Configure CORS middleware in FastAPI app")
        
        return recs
    
    def run_all_checks(self) -> Dict:
        """Run all compliance checks"""
        checks = [
            ("git_repo", self.check_git_repo),
            ("python_project", self.check_python_project),
            ("documentation", self.check_documentation),
            ("ci_cd", self.check_ci_cd),
            ("testing", self.check_testing),
            ("deployment_config", self.check_deployment_config),
            ("code_quality", self.check_code_quality),
            ("fastapi_compliance", self.check_fastapi_compliance)
        ]
        
        passed_count = 0
        total_count = len(checks)
        
        for check_name, check_func in checks:
            try:
                if check_name == "git_repo":
                    passed = check_func()
                    details = {}
                else:
                    passed, details = check_func()
                
                self.results["checks"][check_name] = {
                    "passed": passed,
                    "details": details
                }
                
                if passed:
                    passed_count += 1
                    
            except Exception as e:
                self.results["checks"][check_name] = {
                    "passed": False,
                    "details": {"error": str(e)}
                }
        
        self.results["overall_score"] = round((passed_count / total_count) * 100, 1)
        self.results["recommendations"] = self.generate_recommendations()
        
        return self.results


def print_results(results: Dict):
    """Print formatted results"""
    print(f"\nRepository Compliance Report")
    print(f"Path: {results['repo_path']}")
    print(f"Overall Score: {results['overall_score']}%")
    
    print(f"\nCheck Results:")
    for check_name, result in results["checks"].items():
        status = "PASS" if result["passed"] else "FAIL"
        name = check_name.replace("_", " ").title()
        print(f"  [{status}] {name}")
        
        if not result["passed"] and "details" in result:
            for key, value in result["details"].items():
                if key != "error" and not value:
                    print(f"    - Missing: {key.replace('_', ' ')}")
    
    if results["recommendations"]:
        print(f"\nRecommendations:")
        for i, rec in enumerate(results["recommendations"], 1):
            print(f"  {i}. {rec}")
    else:
        print(f"\nAll checks passed! Repository is compliant.")


def main():
    if len(sys.argv) != 2:
        print("Usage: python tools/repo_compliance_check.py /path/to/target/repo")
        sys.exit(1)
    
    target_repo = sys.argv[1]
    
    if not os.path.exists(target_repo):
        print(f"Error: Repository path does not exist: {target_repo}")
        sys.exit(1)
    
    checker = ComplianceChecker(target_repo)
    results = checker.run_all_checks()
    
    print_results(results)
    
    # Exit with non-zero code if compliance is below threshold
    if results["overall_score"] < 80:
        sys.exit(1)


if __name__ == "__main__":
    main()