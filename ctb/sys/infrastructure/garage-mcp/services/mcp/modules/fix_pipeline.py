"""
Fix Application Pipeline
Applies automated fixes to repositories based on Claude subagent recommendations.
"""

import os
import json
import shutil
import subprocess
from pathlib import Path
from typing import Dict, Any, List, Optional, Union
from dataclasses import dataclass
from datetime import datetime

from .subagent_delegator import SubagentDelegator
from .auto_documenter import generate_repository_documentation
from ..utils.heir_ids import generate_process_id

@dataclass
class FixAction:
    """Represents a single fix action to be applied"""
    action_id: str
    action_type: str  # "create_file", "modify_file", "delete_file", "run_command"
    target_path: str
    content: Optional[str] = None
    command: Optional[str] = None
    description: str = ""
    priority: int = 1  # 1 = high, 5 = low
    dependencies: List[str] = None
    applied: bool = False
    error: Optional[str] = None

class FixPipeline:
    """
    Coordinates the application of fixes to repositories based on 
    analysis results from Claude subagents.
    """
    
    def __init__(self, repo_path: str, imo_creator_path: str, dry_run: bool = False):
        self.repo_path = Path(repo_path)
        self.imo_creator_path = Path(imo_creator_path)
        self.dry_run = dry_run
        
        self.fix_queue = []
        self.applied_fixes = []
        self.failed_fixes = []
        
        # Template paths in IMO Creator
        self.template_paths = {
            "github_actions_ci": ".github/workflows/ci.yml",
            "vercel_config": "vercel.json",
            "license": "LICENSE",
            "contributing": "CONTRIBUTING.md",
            "gitignore": ".gitignore",
            "requirements": "requirements.txt",
            "pyproject": "pyproject.toml"
        }
    
    def add_fix(self, fix_action: FixAction):
        """Add a fix action to the queue"""
        self.fix_queue.append(fix_action)
    
    def create_standard_fixes(self, compliance_issues: List[str]) -> List[FixAction]:
        """Create standard fix actions based on common compliance issues"""
        fixes = []
        
        for issue in compliance_issues:
            if "missing_readme" in issue:
                fixes.append(FixAction(
                    action_id=generate_process_id("fix-readme"),
                    action_type="create_file",
                    target_path="README.md",
                    description="Generate comprehensive README.md",
                    priority=1
                ))
            
            elif "missing_license" in issue:
                fixes.append(FixAction(
                    action_id=generate_process_id("fix-license"),
                    action_type="copy_template",
                    target_path="LICENSE",
                    description="Add MIT license",
                    priority=2
                ))
            
            elif "missing_contributing" in issue:
                fixes.append(FixAction(
                    action_id=generate_process_id("fix-contributing"),
                    action_type="copy_template", 
                    target_path="CONTRIBUTING.md",
                    description="Add contribution guidelines",
                    priority=2
                ))
            
            elif "missing_ci" in issue:
                fixes.append(FixAction(
                    action_id=generate_process_id("fix-ci"),
                    action_type="copy_template",
                    target_path=".github/workflows/ci.yml",
                    description="Add GitHub Actions CI workflow",
                    priority=1
                ))
            
            elif "missing_vercel_config" in issue:
                fixes.append(FixAction(
                    action_id=generate_process_id("fix-vercel"),
                    action_type="copy_template",
                    target_path="vercel.json",
                    description="Add Vercel deployment configuration",
                    priority=3
                ))
            
            elif "missing_requirements" in issue:
                fixes.append(FixAction(
                    action_id=generate_process_id("fix-requirements"),
                    action_type="create_file",
                    target_path="requirements.txt",
                    content=self._generate_basic_requirements(),
                    description="Create basic requirements.txt",
                    priority=2
                ))
            
            elif "missing_src_structure" in issue:
                fixes.append(FixAction(
                    action_id=generate_process_id("fix-src-structure"),
                    action_type="create_directory",
                    target_path="src",
                    description="Create src/ directory structure",
                    priority=1
                ))
            
            elif "missing_tests" in issue:
                fixes.append(FixAction(
                    action_id=generate_process_id("fix-tests"),
                    action_type="create_directory",
                    target_path="tests",
                    description="Create tests/ directory",
                    priority=2
                ))
                
                fixes.append(FixAction(
                    action_id=generate_process_id("fix-basic-test"),
                    action_type="create_file",
                    target_path="tests/test_basic.py",
                    content=self._generate_basic_test(),
                    description="Create basic test file",
                    priority=2,
                    dependencies=[generate_process_id("fix-tests")]
                ))
            
            elif "missing_main_entry" in issue:
                fixes.append(FixAction(
                    action_id=generate_process_id("fix-main-entry"),
                    action_type="create_file",
                    target_path="src/main.py",
                    content=self._generate_basic_fastapi_app(),
                    description="Create FastAPI application entry point",
                    priority=1,
                    dependencies=[generate_process_id("fix-src-structure")]
                ))
        
        # Always add the compliance heartbeat mechanism
        fixes.append(FixAction(
            action_id=generate_process_id("fix-compliance-heartbeat"),
            action_type="copy_template",
            target_path="imo-compliance-check.py",
            description="Add IMO Creator compliance monitoring",
            priority=5  # Low priority, apply last
        ))
        
        fixes.append(FixAction(
            action_id=generate_process_id("fix-compliance-config"),
            action_type="create_file",
            target_path=".imo-compliance.json",
            content=self._generate_compliance_config(),
            description="Create compliance configuration",
            priority=5
        ))
        
        return fixes
    
    def _generate_basic_requirements(self) -> str:
        """Generate a basic requirements.txt"""
        return """fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
pytest==7.4.3
ruff==0.1.6
black==23.10.1
"""
    
    def _generate_basic_test(self) -> str:
        """Generate a basic test file"""
        return '''"""Basic tests for the application"""
import pytest

def test_basic():
    """Basic test to ensure pytest is working"""
    assert True

def test_application_import():
    """Test that we can import our main application"""
    try:
        from src import main
        assert hasattr(main, 'app')
    except ImportError:
        # If different structure, skip this test
        pytest.skip("Main application not found in expected location")
'''
    
    def _generate_basic_fastapi_app(self) -> str:
        """Generate a basic FastAPI application"""
        return '''"""FastAPI application entry point"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="API Server",
    description="Generated by IMO Creator compliance system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "API is running", "status": "healthy"}

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "service": "api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
'''
    
    def _generate_compliance_config(self) -> str:
        """Generate compliance configuration file"""
        config = {
            "version": "1.0.0",
            "imo_creator_version": "1.0.0",
            "last_check": datetime.now().isoformat(),
            "last_update": datetime.now().isoformat(),
            "check_interval_hours": 24,
            "auto_update": False,
            "compliance_level": "standard",
            "excluded_files": [
                ".git/*",
                "node_modules/*", 
                ".venv/*",
                "__pycache__/*"
            ],
            "repo_metadata": {
                "processed_by_imo": True,
                "processing_date": datetime.now().isoformat(),
                "initial_compliance_score": 50,  # Will be updated after processing
                "current_compliance_score": 85,  # Estimated after fixes
                "repo_name": self.repo_path.name,
                "repo_path": str(self.repo_path.resolve())
            }
        }
        
        return json.dumps(config, indent=2)
    
    async def apply_fix(self, fix: FixAction) -> bool:
        """Apply a single fix action"""
        try:
            if self.dry_run:
                print(f"🔍 [DRY RUN] Would apply: {fix.description}")
                fix.applied = True
                return True
            
            if fix.action_type == "create_file":
                success = self._create_file(fix.target_path, fix.content)
            
            elif fix.action_type == "copy_template":
                success = self._copy_template(fix.target_path)
            
            elif fix.action_type == "create_directory":
                success = self._create_directory(fix.target_path)
            
            elif fix.action_type == "modify_file":
                success = self._modify_file(fix.target_path, fix.content)
            
            elif fix.action_type == "run_command":
                success = self._run_command(fix.command)
            
            elif fix.action_type == "delete_file":
                success = self._delete_file(fix.target_path)
            
            else:
                raise ValueError(f"Unknown action type: {fix.action_type}")
            
            if success:
                fix.applied = True
                self.applied_fixes.append(fix)
                print(f"✅ Applied: {fix.description}")
                return True
            else:
                fix.error = "Action failed"
                self.failed_fixes.append(fix)
                print(f"❌ Failed: {fix.description}")
                return False
                
        except Exception as e:
            fix.error = str(e)
            self.failed_fixes.append(fix)
            print(f"❌ Exception applying {fix.description}: {e}")
            return False
    
    def _create_file(self, target_path: str, content: str) -> bool:
        """Create a file with specified content"""
        try:
            full_path = self.repo_path / target_path
            
            # Check if file already exists
            if full_path.exists():
                print(f"⚠️  File already exists: {target_path}")
                return False
            
            # Create parent directories if needed
            full_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Handle special case where content needs to be generated
            if content is None and target_path == "README.md":
                docs = generate_repository_documentation(str(self.repo_path))
                content = docs.get("README.md", "# Project\n\nAuto-generated README")
            
            # Write the file
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content or "")
            
            return True
            
        except Exception as e:
            print(f"Error creating file {target_path}: {e}")
            return False
    
    def _copy_template(self, target_path: str) -> bool:
        """Copy a template file from IMO Creator"""
        try:
            # Find the template in IMO Creator
            template_key = target_path.replace('.github/workflows/', '').replace('.yml', '').replace('.json', '').replace('.md', '')
            
            # Map target path to template file
            template_source = None
            if target_path == ".github/workflows/ci.yml":
                template_source = self.imo_creator_path / ".github/workflows/ci.yml"
            elif target_path == "vercel.json":
                template_source = self.imo_creator_path / "vercel.json"
            elif target_path == "LICENSE":
                template_source = self.imo_creator_path / "LICENSE"
            elif target_path == "CONTRIBUTING.md":
                template_source = self.imo_creator_path / "CONTRIBUTING.md"
            elif target_path == "imo-compliance-check.py":
                template_source = self.imo_creator_path / "templates/imo-compliance-check.py"
            
            if not template_source or not template_source.exists():
                print(f"Template not found for {target_path}")
                return False
            
            target_full_path = self.repo_path / target_path
            
            # Check if target already exists
            if target_full_path.exists():
                print(f"⚠️  File already exists: {target_path}")
                return False
            
            # Create parent directories
            target_full_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Copy the template
            shutil.copy2(template_source, target_full_path)
            return True
            
        except Exception as e:
            print(f"Error copying template {target_path}: {e}")
            return False
    
    def _create_directory(self, target_path: str) -> bool:
        """Create a directory"""
        try:
            full_path = self.repo_path / target_path
            
            if full_path.exists():
                print(f"⚠️  Directory already exists: {target_path}")
                return False
            
            full_path.mkdir(parents=True, exist_ok=True)
            return True
            
        except Exception as e:
            print(f"Error creating directory {target_path}: {e}")
            return False
    
    def _modify_file(self, target_path: str, content: str) -> bool:
        """Modify an existing file"""
        try:
            full_path = self.repo_path / target_path
            
            if not full_path.exists():
                print(f"File does not exist for modification: {target_path}")
                return False
            
            # For now, simple replacement - in future could be more sophisticated
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return True
            
        except Exception as e:
            print(f"Error modifying file {target_path}: {e}")
            return False
    
    def _run_command(self, command: str) -> bool:
        """Run a shell command"""
        try:
            result = subprocess.run(
                command,
                shell=True,
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                return True
            else:
                print(f"Command failed: {command}")
                print(f"Error: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"Error running command {command}: {e}")
            return False
    
    def _delete_file(self, target_path: str) -> bool:
        """Delete a file"""
        try:
            full_path = self.repo_path / target_path
            
            if not full_path.exists():
                print(f"File does not exist for deletion: {target_path}")
                return True  # Consider this success
            
            full_path.unlink()
            return True
            
        except Exception as e:
            print(f"Error deleting file {target_path}: {e}")
            return False
    
    async def apply_all_fixes(self) -> Dict[str, Any]:
        """Apply all queued fixes in priority order, respecting dependencies"""
        
        # Sort fixes by priority (1 = highest priority)
        self.fix_queue.sort(key=lambda x: x.priority)
        
        results = {
            "total_fixes": len(self.fix_queue),
            "applied": 0,
            "failed": 0,
            "skipped": 0,
            "details": []
        }
        
        applied_fix_ids = set()
        
        for fix in self.fix_queue:
            # Check dependencies
            if fix.dependencies:
                missing_deps = [dep for dep in fix.dependencies if dep not in applied_fix_ids]
                if missing_deps:
                    print(f"⏳ Skipping {fix.description} - missing dependencies: {missing_deps}")
                    results["skipped"] += 1
                    continue
            
            # Apply the fix
            success = await self.apply_fix(fix)
            
            if success:
                results["applied"] += 1
                applied_fix_ids.add(fix.action_id)
            else:
                results["failed"] += 1
            
            results["details"].append({
                "action_id": fix.action_id,
                "description": fix.description,
                "applied": fix.applied,
                "error": fix.error
            })
        
        return results


async def create_and_apply_fixes(repo_path: str, 
                                imo_creator_path: str,
                                compliance_issues: List[str],
                                dry_run: bool = False) -> Dict[str, Any]:
    """
    Main function to create and apply fixes for a repository
    """
    
    pipeline = FixPipeline(repo_path, imo_creator_path, dry_run=dry_run)
    
    # Create standard fixes based on compliance issues
    standard_fixes = pipeline.create_standard_fixes(compliance_issues)
    
    for fix in standard_fixes:
        pipeline.add_fix(fix)
    
    print(f"🔧 Created {len(standard_fixes)} fix actions")
    
    # Apply all fixes
    results = await pipeline.apply_all_fixes()
    
    print(f"\n📊 Fix Pipeline Results:")
    print(f"  ✅ Applied: {results['applied']}")
    print(f"  ❌ Failed: {results['failed']}")
    print(f"  ⏳ Skipped: {results['skipped']}")
    
    return results