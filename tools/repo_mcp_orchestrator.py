#!/usr/bin/env python3
"""
Repository MCP Orchestrator
Uses garage-MCP and Claude subagents to analyze, document, and fix repositories.

This orchestrator delegates specialized tasks to Claude subagents through the 
garage-MCP system, following HEIR doctrine for error handling and altitude-based
coordination.
"""

import os
import sys
import json
import asyncio
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from datetime import datetime

# Import garage-MCP modules
sys.path.append(str(Path(__file__).parent.parent / "garage-mcp"))
from services.mcp.modules.orchestra import HeIROrchestra
from services.mcp.modules.error_sink import ErrorSink
from .utils.heir_ids import generate_process_id, generate_idempotency_key

@dataclass
class RepoAnalysisTask:
    """Represents a repository analysis task for subagent delegation"""
    task_id: str
    repo_path: str
    task_type: str  # "compliance_check", "documentation", "code_analysis", "fix_application"
    priority: int  # 1-5, with 1 being highest
    altitude: int  # 30000, 20000, 10000, 5000
    agent_role: str
    task_data: Dict[str, Any]
    status: str = "pending"
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class RepoMCPOrchestrator:
    """
    Main orchestrator that coordinates repository analysis and fixes
    using garage-MCP and Claude subagents.
    """
    
    def __init__(self, imo_creator_path: str):
        self.imo_creator_path = Path(imo_creator_path)
        self.garage_mcp_path = self.imo_creator_path / "garage-mcp"
        
        # Initialize HEIR orchestration
        self.orchestra = HeIROrchestra(
            process_id=generate_process_id("repo-orchestrator"),
            callpoint_altitude=30000  # Start at strategic level
        )
        
        # Initialize error sink for centralized error handling
        self.error_sink = ErrorSink(
            shq_database_url="sqlite:///garage-mcp/data/shq_errors.db"
        )
        
        # Subagent role definitions
        self.subagent_roles = {
            "code_analyzer": {
                "altitude": 20000,
                "specialization": "Code quality analysis, architecture review",
                "tools": ["ast_parser", "complexity_analyzer", "pattern_detector"]
            },
            "documentation_writer": {
                "altitude": 15000, 
                "specialization": "README, API docs, code comments generation",
                "tools": ["markdown_generator", "api_extractor", "example_creator"]
            },
            "compliance_checker": {
                "altitude": 20000,
                "specialization": "Standards compliance, best practices validation", 
                "tools": ["lint_runner", "security_scanner", "dependency_checker"]
            },
            "fix_applicator": {
                "altitude": 10000,
                "specialization": "Automated code fixes, file generation",
                "tools": ["code_transformer", "file_creator", "structure_builder"]
            },
            "test_generator": {
                "altitude": 15000,
                "specialization": "Unit test generation, test coverage analysis",
                "tools": ["test_creator", "coverage_analyzer", "mock_generator"]
            }
        }
        
        # Task queue organized by altitude for proper delegation
        self.task_queue = {
            30000: [],  # Strategic planning
            20000: [],  # Analysis and high-level decisions  
            15000: [],  # Documentation and testing
            10000: [],  # Implementation and fixes
            5000: []    # Validation and cleanup
        }
        
        self.results = {
            "session_id": generate_idempotency_key(),
            "start_time": datetime.now().isoformat(),
            "repo_path": None,
            "tasks_completed": [],
            "errors": [],
            "final_report": None
        }
    
    def analyze_repository_structure(self, repo_path: str) -> Dict[str, Any]:
        """Initial repository structure analysis"""
        repo = Path(repo_path)
        
        structure = {
            "path": str(repo),
            "name": repo.name,
            "is_git_repo": (repo / ".git").exists(),
            "languages": [],
            "frameworks": [],
            "file_counts": {},
            "directory_structure": {}
        }
        
        # Analyze file types
        file_extensions = {}
        for file_path in repo.rglob("*"):
            if file_path.is_file():
                ext = file_path.suffix.lower()
                file_extensions[ext] = file_extensions.get(ext, 0) + 1
        
        structure["file_counts"] = file_extensions
        
        # Detect languages and frameworks
        if ".py" in file_extensions:
            structure["languages"].append("python")
            
            # Check for common Python frameworks
            req_file = repo / "requirements.txt"
            if req_file.exists():
                requirements = req_file.read_text().lower()
                if "fastapi" in requirements:
                    structure["frameworks"].append("fastapi")
                if "django" in requirements:
                    structure["frameworks"].append("django")
                if "flask" in requirements:
                    structure["frameworks"].append("flask")
        
        if ".js" in file_extensions or ".ts" in file_extensions:
            structure["languages"].append("javascript/typescript")
            
            # Check for Node.js frameworks
            package_file = repo / "package.json"
            if package_file.exists():
                try:
                    package_data = json.loads(package_file.read_text())
                    deps = {**package_data.get("dependencies", {}), **package_data.get("devDependencies", {})}
                    
                    if "react" in deps:
                        structure["frameworks"].append("react")
                    if "vue" in deps:
                        structure["frameworks"].append("vue")
                    if "express" in deps:
                        structure["frameworks"].append("express")
                except:
                    pass
        
        return structure
    
    def create_analysis_tasks(self, repo_path: str, repo_structure: Dict[str, Any]) -> List[RepoAnalysisTask]:
        """Create task list based on repository analysis"""
        tasks = []
        
        # Strategic level (30k) - Overall planning
        tasks.append(RepoAnalysisTask(
            task_id=generate_process_id("strategic-planning"),
            repo_path=repo_path,
            task_type="strategic_planning",
            priority=1,
            altitude=30000,
            agent_role="orchestrator",
            task_data={
                "repo_structure": repo_structure,
                "objective": "Create comprehensive improvement plan"
            }
        ))
        
        # Tactical level (20k) - Analysis tasks
        tasks.append(RepoAnalysisTask(
            task_id=generate_process_id("compliance-analysis"),
            repo_path=repo_path,
            task_type="compliance_check",
            priority=2,
            altitude=20000,
            agent_role="compliance_checker",
            task_data={
                "check_standards": ["imo_creator", "python_pep8", "security_best_practices"],
                "output_format": "structured_report"
            }
        ))
        
        tasks.append(RepoAnalysisTask(
            task_id=generate_process_id("code-analysis"),
            repo_path=repo_path,
            task_type="code_analysis", 
            priority=2,
            altitude=20000,
            agent_role="code_analyzer",
            task_data={
                "analyze_patterns": True,
                "check_complexity": True,
                "identify_refactor_opportunities": True
            }
        ))
        
        # Operational level (15k) - Documentation and testing
        tasks.append(RepoAnalysisTask(
            task_id=generate_process_id("documentation-generation"),
            repo_path=repo_path,
            task_type="documentation",
            priority=3,
            altitude=15000,
            agent_role="documentation_writer",
            task_data={
                "generate_readme": True,
                "create_api_docs": "fastapi" in repo_structure.get("frameworks", []),
                "add_code_comments": True
            }
        ))
        
        if "python" in repo_structure.get("languages", []):
            tasks.append(RepoAnalysisTask(
                task_id=generate_process_id("test-generation"),
                repo_path=repo_path,
                task_type="test_generation",
                priority=3,
                altitude=15000,
                agent_role="test_generator",
                task_data={
                    "framework": "pytest",
                    "generate_unit_tests": True,
                    "target_coverage": 80
                }
            ))
        
        # Tactical level (10k) - Implementation
        tasks.append(RepoAnalysisTask(
            task_id=generate_process_id("fix-application"),
            repo_path=repo_path,
            task_type="fix_application",
            priority=4,
            altitude=10000,
            agent_role="fix_applicator",
            task_data={
                "apply_compliance_fixes": True,
                "create_missing_files": True,
                "fix_code_issues": True
            }
        ))
        
        # Ground level (5k) - Validation
        tasks.append(RepoAnalysisTask(
            task_id=generate_process_id("final-validation"),
            repo_path=repo_path,
            task_type="validation",
            priority=5,
            altitude=5000,
            agent_role="compliance_checker",
            task_data={
                "run_final_compliance_check": True,
                "generate_summary_report": True
            }
        ))
        
        return tasks
    
    async def delegate_task_to_subagent(self, task: RepoAnalysisTask) -> Dict[str, Any]:
        """
        Delegate a task to the appropriate Claude subagent via garage-MCP
        """
        try:
            # Prepare subagent invocation
            subagent_config = self.subagent_roles.get(task.agent_role, {})
            
            # Create MCP tool invocation payload
            mcp_payload = {
                "tool": "claude_subagent_invoke",
                "parameters": {
                    "agent_role": task.agent_role,
                    "task_id": task.task_id,
                    "altitude": task.altitude,
                    "specialization": subagent_config.get("specialization", "General purpose"),
                    "task_description": f"{task.task_type} for repository {task.repo_path}",
                    "task_data": task.task_data,
                    "available_tools": subagent_config.get("tools", []),
                    "expected_output": {
                        "compliance_check": "structured_compliance_report",
                        "code_analysis": "code_quality_assessment",
                        "documentation": "generated_documentation_files",
                        "test_generation": "test_files_and_coverage_report", 
                        "fix_application": "applied_fixes_summary",
                        "validation": "final_validation_report"
                    }.get(task.task_type, "task_completion_report")
                }
            }
            
            # Use HEIR orchestra to coordinate the delegation
            result = await self.orchestra.delegate_to_altitude(
                target_altitude=task.altitude,
                task_payload=mcp_payload,
                timeout_seconds=300  # 5 minutes per task
            )
            
            if result.get("success"):
                task.status = "completed"
                task.result = result.get("data", {})
                return result.get("data", {})
            else:
                task.status = "failed"
                task.error = result.get("error", "Unknown delegation error")
                
                # Log error to SHQ
                await self.error_sink.log_error(
                    process_id=task.task_id,
                    error_type="subagent_delegation_failure",
                    error_message=task.error,
                    context={"task_type": task.task_type, "agent_role": task.agent_role}
                )
                
                raise Exception(f"Subagent delegation failed: {task.error}")
                
        except Exception as e:
            task.status = "failed"
            task.error = str(e)
            
            await self.error_sink.log_error(
                process_id=task.task_id,
                error_type="orchestration_error",
                error_message=str(e),
                context={"task": task.__dict__}
            )
            
            return {"error": str(e)}
    
    async def execute_task_queue(self) -> Dict[str, Any]:
        """Execute tasks in altitude-based order (30k -> 20k -> 15k -> 10k -> 5k)"""
        execution_results = {}
        
        # Execute tasks by altitude (highest to lowest)
        for altitude in sorted(self.task_queue.keys(), reverse=True):
            altitude_tasks = self.task_queue[altitude]
            
            if not altitude_tasks:
                continue
                
            print(f"🎯 Executing altitude {altitude} tasks ({len(altitude_tasks)} tasks)")
            
            # Execute tasks at this altitude level
            altitude_results = []
            for task in altitude_tasks:
                print(f"  📋 {task.task_type} ({task.agent_role})")
                
                try:
                    result = await self.delegate_task_to_subagent(task)
                    altitude_results.append({
                        "task_id": task.task_id,
                        "task_type": task.task_type,
                        "status": task.status,
                        "result": result
                    })
                    
                    if task.status == "completed":
                        print(f"    ✅ Completed")
                    else:
                        print(f"    ❌ Failed: {task.error}")
                        
                except Exception as e:
                    print(f"    ❌ Exception: {str(e)}")
                    altitude_results.append({
                        "task_id": task.task_id,
                        "task_type": task.task_type,
                        "status": "failed",
                        "error": str(e)
                    })
            
            execution_results[f"altitude_{altitude}"] = altitude_results
        
        return execution_results
    
    async def orchestrate_repository_improvement(self, repo_path: str) -> Dict[str, Any]:
        """
        Main orchestration method that coordinates the entire repository 
        analysis and improvement process.
        """
        print(f"🚀 Starting MCP Repository Orchestration")
        print(f"📁 Target: {repo_path}")
        
        self.results["repo_path"] = repo_path
        
        try:
            # Step 1: Analyze repository structure
            print(f"\n🔍 Step 1: Repository Structure Analysis")
            repo_structure = self.analyze_repository_structure(repo_path)
            print(f"  📊 Detected: {', '.join(repo_structure['languages'])}")
            if repo_structure['frameworks']:
                print(f"  🛠️  Frameworks: {', '.join(repo_structure['frameworks'])}")
            
            # Step 2: Create task queue based on analysis
            print(f"\n📋 Step 2: Task Planning")
            tasks = self.create_analysis_tasks(repo_path, repo_structure)
            
            # Organize tasks by altitude
            for task in tasks:
                self.task_queue[task.altitude].append(task)
            
            total_tasks = sum(len(tasks) for tasks in self.task_queue.values())
            print(f"  📝 Created {total_tasks} tasks across {len([a for a in self.task_queue.keys() if self.task_queue[a]])} altitude levels")
            
            # Step 3: Execute tasks via subagent delegation
            print(f"\n🎭 Step 3: Subagent Task Execution")
            execution_results = await self.execute_task_queue()
            
            # Step 4: Compile final report
            print(f"\n📄 Step 4: Final Report Generation")
            final_report = self.generate_final_report(execution_results)
            
            self.results["tasks_completed"] = execution_results
            self.results["final_report"] = final_report
            self.results["end_time"] = datetime.now().isoformat()
            
            return self.results
            
        except Exception as e:
            error_msg = f"Orchestration failed: {str(e)}"
            print(f"❌ {error_msg}")
            
            await self.error_sink.log_error(
                process_id=self.results["session_id"],
                error_type="orchestration_failure",
                error_message=error_msg,
                context={"repo_path": repo_path}
            )
            
            self.results["errors"].append(error_msg)
            self.results["end_time"] = datetime.now().isoformat()
            
            return self.results
    
    def generate_final_report(self, execution_results: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a comprehensive final report"""
        report = {
            "summary": {
                "total_tasks": 0,
                "successful_tasks": 0,
                "failed_tasks": 0,
                "improvement_score": 0
            },
            "by_category": {},
            "recommendations": [],
            "next_steps": []
        }
        
        # Analyze results by altitude/category
        for altitude_key, altitude_results in execution_results.items():
            category_name = altitude_key.replace("altitude_", "") + "k_level"
            
            successful = len([r for r in altitude_results if r.get("status") == "completed"])
            total = len(altitude_results)
            
            report["by_category"][category_name] = {
                "total_tasks": total,
                "successful": successful,
                "success_rate": (successful / total * 100) if total > 0 else 0,
                "tasks": altitude_results
            }
            
            report["summary"]["total_tasks"] += total
            report["summary"]["successful_tasks"] += successful
            report["summary"]["failed_tasks"] += (total - successful)
        
        # Calculate overall improvement score
        if report["summary"]["total_tasks"] > 0:
            report["summary"]["improvement_score"] = round(
                (report["summary"]["successful_tasks"] / report["summary"]["total_tasks"]) * 100, 1
            )
        
        # Generate recommendations
        if report["summary"]["improvement_score"] < 100:
            report["recommendations"] = [
                "Review failed tasks and address blocking issues",
                "Consider manual intervention for complex problems",
                "Re-run orchestration after addressing critical errors"
            ]
        else:
            report["recommendations"] = [
                "Repository successfully improved to IMO Creator standards",
                "Consider setting up monitoring for ongoing compliance",
                "Document the changes made for team awareness"
            ]
        
        return report


async def main():
    if len(sys.argv) != 2:
        print("Usage: python tools/repo_mcp_orchestrator.py /path/to/target/repo")
        sys.exit(1)
    
    target_repo = sys.argv[1]
    
    if not os.path.exists(target_repo):
        print(f"Error: Repository path does not exist: {target_repo}")
        sys.exit(1)
    
    # Get IMO Creator path (parent of this script)
    imo_creator_path = Path(__file__).parent.parent
    
    # Initialize orchestrator
    orchestrator = RepoMCPOrchestrator(str(imo_creator_path))
    
    # Run orchestration
    results = await orchestrator.orchestrate_repository_improvement(target_repo)
    
    # Save results
    results_file = imo_creator_path / "data" / f"orchestration_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    results_file.parent.mkdir(exist_ok=True)
    
    with open(results_file, 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n📊 ORCHESTRATION COMPLETE")
    print(f"📈 Improvement Score: {results['final_report']['summary']['improvement_score']}%")
    print(f"📄 Full results saved: {results_file}")
    
    # Exit with appropriate code
    if results['final_report']['summary']['improvement_score'] >= 80:
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())