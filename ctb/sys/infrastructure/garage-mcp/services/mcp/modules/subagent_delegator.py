"""
Subagent Delegator for Repository Analysis
Coordinates Claude subagents for specialized repository improvement tasks.
"""

import json
import asyncio
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from pathlib import Path

from .orchestra import HeIROrchestra
from .error_sink import ErrorSink
from ..utils.heir_ids import generate_process_id, generate_idempotency_key

@dataclass
class SubagentCapability:
    """Defines what a subagent can do"""
    role: str
    altitude: int
    specializations: List[str]
    tools: List[str]
    max_concurrent_tasks: int = 1

class SubagentDelegator:
    """
    Manages delegation of tasks to Claude subagents with HEIR compliance
    """
    
    def __init__(self, orchestra: HeIROrchestra, error_sink: ErrorSink):
        self.orchestra = orchestra
        self.error_sink = error_sink
        
        # Define available subagent capabilities
        self.available_agents = {
            "code_analyzer": SubagentCapability(
                role="code_analyzer",
                altitude=20000,
                specializations=[
                    "Static code analysis",
                    "Architecture assessment", 
                    "Code complexity evaluation",
                    "Security vulnerability detection",
                    "Performance bottleneck identification"
                ],
                tools=["ast_parser", "complexity_analyzer", "security_scanner", "dependency_graph"]
            ),
            
            "documentation_writer": SubagentCapability(
                role="documentation_writer",
                altitude=15000,
                specializations=[
                    "README generation",
                    "API documentation",
                    "Code comment generation",
                    "User guide creation",
                    "Architecture documentation"
                ],
                tools=["markdown_generator", "api_extractor", "docstring_creator", "diagram_generator"]
            ),
            
            "compliance_checker": SubagentCapability(
                role="compliance_checker", 
                altitude=20000,
                specializations=[
                    "Standards compliance validation",
                    "Best practices verification",
                    "License compliance checking",
                    "Security policy validation",
                    "Code style enforcement"
                ],
                tools=["standards_validator", "license_checker", "style_enforcer", "security_auditor"]
            ),
            
            "fix_applicator": SubagentCapability(
                role="fix_applicator",
                altitude=10000,
                specializations=[
                    "Automated code fixes",
                    "File structure creation",
                    "Configuration generation",
                    "Dependency management",
                    "Build system setup"
                ],
                tools=["code_transformer", "file_creator", "config_generator", "dependency_resolver"]
            ),
            
            "test_generator": SubagentCapability(
                role="test_generator",
                altitude=15000,
                specializations=[
                    "Unit test generation",
                    "Integration test creation", 
                    "Test coverage analysis",
                    "Mock generation",
                    "Test data creation"
                ],
                tools=["test_creator", "coverage_analyzer", "mock_generator", "fixture_creator"]
            ),
            
            "repo_strategist": SubagentCapability(
                role="repo_strategist",
                altitude=30000,
                specializations=[
                    "Repository improvement planning",
                    "Architecture decision making",
                    "Priority assessment",
                    "Resource allocation",
                    "Risk assessment"
                ],
                tools=["strategy_planner", "priority_matrix", "risk_assessor", "roadmap_creator"]
            )
        }
        
        # Track active delegations
        self.active_delegations = {}
    
    async def delegate_task(self, 
                           agent_role: str, 
                           task_description: str,
                           task_data: Dict[str, Any],
                           context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Delegate a task to a specific Claude subagent
        """
        
        if agent_role not in self.available_agents:
            raise ValueError(f"Unknown agent role: {agent_role}")
        
        agent = self.available_agents[agent_role]
        delegation_id = generate_process_id(f"delegation-{agent_role}")
        
        try:
            # Prepare delegation payload
            delegation_payload = {
                "delegation_id": delegation_id,
                "agent_role": agent_role,
                "agent_capabilities": {
                    "specializations": agent.specializations,
                    "tools": agent.tools,
                    "altitude": agent.altitude
                },
                "task": {
                    "description": task_description,
                    "data": task_data,
                    "context": context or {}
                },
                "expectations": {
                    "response_format": "structured_json",
                    "include_reasoning": True,
                    "include_confidence_score": True
                }
            }
            
            # Track the delegation
            self.active_delegations[delegation_id] = {
                "agent_role": agent_role,
                "start_time": asyncio.get_event_loop().time(),
                "status": "active"
            }
            
            # Use HEIR orchestra for coordination
            result = await self.orchestra.delegate_to_altitude(
                target_altitude=agent.altitude,
                task_payload=delegation_payload,
                timeout_seconds=300
            )
            
            # Update delegation tracking
            self.active_delegations[delegation_id]["status"] = "completed"
            self.active_delegations[delegation_id]["result"] = result
            
            if result.get("success"):
                return {
                    "success": True,
                    "delegation_id": delegation_id,
                    "agent_role": agent_role,
                    "result": result.get("data", {}),
                    "metadata": {
                        "altitude": agent.altitude,
                        "processing_time": asyncio.get_event_loop().time() - self.active_delegations[delegation_id]["start_time"]
                    }
                }
            else:
                # Log delegation failure
                await self.error_sink.log_error(
                    process_id=delegation_id,
                    error_type="subagent_delegation_failure",
                    error_message=result.get("error", "Unknown delegation error"),
                    context={
                        "agent_role": agent_role,
                        "task_description": task_description
                    }
                )
                
                return {
                    "success": False,
                    "delegation_id": delegation_id,
                    "agent_role": agent_role,
                    "error": result.get("error", "Delegation failed"),
                    "metadata": {
                        "altitude": agent.altitude
                    }
                }
                
        except Exception as e:
            # Update delegation tracking
            self.active_delegations[delegation_id]["status"] = "failed"
            self.active_delegations[delegation_id]["error"] = str(e)
            
            # Log exception
            await self.error_sink.log_error(
                process_id=delegation_id,
                error_type="delegation_exception",
                error_message=str(e),
                context={
                    "agent_role": agent_role,
                    "task_description": task_description
                }
            )
            
            return {
                "success": False,
                "delegation_id": delegation_id,
                "agent_role": agent_role,
                "error": f"Delegation exception: {str(e)}"
            }
    
    async def delegate_batch_tasks(self, tasks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Delegate multiple tasks concurrently, respecting altitude coordination
        """
        batch_id = generate_process_id("batch-delegation")
        
        # Group tasks by altitude for proper HEIR coordination
        tasks_by_altitude = {}
        for task in tasks:
            agent_role = task.get("agent_role")
            if agent_role in self.available_agents:
                altitude = self.available_agents[agent_role].altitude
                if altitude not in tasks_by_altitude:
                    tasks_by_altitude[altitude] = []
                tasks_by_altitude[altitude].append(task)
        
        batch_results = {
            "batch_id": batch_id,
            "total_tasks": len(tasks),
            "results_by_altitude": {},
            "summary": {
                "successful": 0,
                "failed": 0,
                "total_processing_time": 0
            }
        }
        
        start_time = asyncio.get_event_loop().time()
        
        # Process tasks by altitude (highest first)
        for altitude in sorted(tasks_by_altitude.keys(), reverse=True):
            altitude_tasks = tasks_by_altitude[altitude]
            
            print(f"🎯 Processing {len(altitude_tasks)} tasks at altitude {altitude}")
            
            # Execute tasks at this altitude concurrently
            altitude_results = []
            tasks_to_execute = []
            
            for task in altitude_tasks:
                tasks_to_execute.append(self.delegate_task(
                    agent_role=task["agent_role"],
                    task_description=task["task_description"],
                    task_data=task.get("task_data", {}),
                    context=task.get("context", {})
                ))
            
            # Wait for all tasks at this altitude to complete
            altitude_task_results = await asyncio.gather(*tasks_to_execute, return_exceptions=True)
            
            for result in altitude_task_results:
                if isinstance(result, Exception):
                    altitude_results.append({
                        "success": False,
                        "error": f"Task execution exception: {str(result)}"
                    })
                    batch_results["summary"]["failed"] += 1
                else:
                    altitude_results.append(result)
                    if result.get("success"):
                        batch_results["summary"]["successful"] += 1
                    else:
                        batch_results["summary"]["failed"] += 1
            
            batch_results["results_by_altitude"][altitude] = altitude_results
        
        batch_results["summary"]["total_processing_time"] = asyncio.get_event_loop().time() - start_time
        
        return batch_results
    
    def get_agent_capabilities(self) -> Dict[str, Any]:
        """Return information about available agents and their capabilities"""
        return {
            agent_role: {
                "altitude": agent.altitude,
                "specializations": agent.specializations,
                "tools": agent.tools,
                "max_concurrent_tasks": agent.max_concurrent_tasks
            }
            for agent_role, agent in self.available_agents.items()
        }
    
    def get_active_delegations(self) -> Dict[str, Any]:
        """Return information about currently active delegations"""
        return {
            delegation_id: {
                "agent_role": info["agent_role"],
                "status": info["status"],
                "duration": asyncio.get_event_loop().time() - info["start_time"] if info["status"] == "active" else None
            }
            for delegation_id, info in self.active_delegations.items()
            if info["status"] == "active"
        }


# Factory function for creating delegator instances
def create_subagent_delegator(shq_database_url: str = None) -> SubagentDelegator:
    """Create a configured subagent delegator instance"""
    
    # Initialize HEIR orchestra
    orchestra = HeIROrchestra(
        process_id=generate_process_id("subagent-coordinator"),
        callpoint_altitude=30000
    )
    
    # Initialize error sink
    error_sink = ErrorSink(
        shq_database_url=shq_database_url or "sqlite:///garage-mcp/data/shq_errors.db"
    )
    
    return SubagentDelegator(orchestra, error_sink)