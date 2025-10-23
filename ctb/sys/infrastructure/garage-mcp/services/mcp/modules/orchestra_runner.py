"""
Altitude Plan Runner - Executes plans with HDO integration
"""
import json
import asyncio
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from .orchestra import orchestra_invoke
from .error_sink import build_error_record


class AltitudePlanRunner:
    """Executes altitude-based plans with orchestrator delegation"""
    
    def __init__(self, mcp_call_handler=None):
        self.mcp_call = mcp_call_handler
        self.active_processes = {}
    
    async def run_altitude_plan(self, plan: Dict[str, Any], hdo: Dict[str, Any], 
                               mcp_call=None) -> Dict[str, Any]:
        """
        Execute altitude plan with HDO tracking
        
        Args:
            plan: Altitude plan configuration
            hdo: Hierarchical Data Object
            mcp_call: Optional MCP call handler override
            
        Returns:
            Updated HDO with execution results
        """
        process_id = hdo.get('process_id')
        if not process_id:
            raise ValueError("HDO must contain valid process_id")
        
        # Use provided mcp_call or fallback to instance handler
        call_handler = mcp_call or self.mcp_call
        if not call_handler:
            raise ValueError("No MCP call handler available")
        
        # Track process execution
        self.active_processes[process_id] = {
            'plan_id': plan.get('plan_id'),
            'started_at': datetime.now(timezone.utc),
            'current_stage': None,
            'status': 'running'
        }
        
        try:
            # Execute stages in sequence
            for stage in plan.get('stages', []):
                await self._execute_stage(stage, hdo, call_handler)
                
            # Mark as completed
            self.active_processes[process_id]['status'] = 'completed'
            self._log_to_hdo(hdo, 'INFO', f"Plan {plan.get('plan_id')} completed successfully")
            
            return hdo
            
        except Exception as e:
            # Log error and update process status
            self.active_processes[process_id]['status'] = 'failed'
            self._log_to_hdo(hdo, 'ERROR', f"Plan execution failed: {str(e)}")
            
            # Build error record for sink
            error_record = build_error_record(hdo, {'stage': 'plan_execution'}, e)
            
            # Add to HDO errors
            if 'errors' not in hdo:
                hdo['errors'] = []
            hdo['errors'].append(error_record)
            
            # Re-raise for upstream handling
            raise
            
        finally:
            # Clean up process tracking
            if process_id in self.active_processes:
                del self.active_processes[process_id]
    
    async def _execute_stage(self, stage: Dict[str, Any], hdo: Dict[str, Any], 
                           call_handler) -> None:
        """Execute a single stage with its steps"""
        stage_id = stage.get('stage_id')
        altitude = stage.get('altitude')
        orchestrator = stage.get('orchestrator')
        steps = stage.get('steps', [])
        parallel = stage.get('parallel', False)
        
        # Log stage start
        self._log_to_hdo(hdo, 'INFO', 
                        f"Starting stage {stage_id} at altitude {altitude}")
        
        # Update process tracking
        process_id = hdo.get('process_id')
        if process_id in self.active_processes:
            self.active_processes[process_id]['current_stage'] = stage_id
        
        if parallel:
            # Execute steps in parallel
            tasks = []
            for step in steps:
                if self._should_execute_step(step, hdo):
                    task = self._execute_step(step, hdo, call_handler)
                    tasks.append(task)
            
            if tasks:
                await asyncio.gather(*tasks)
        else:
            # Execute steps sequentially
            for step in steps:
                if self._should_execute_step(step, hdo):
                    await self._execute_step(step, hdo, call_handler)
        
        # Log stage completion
        self._log_to_hdo(hdo, 'INFO', f"Completed stage {stage_id}")
    
    def _should_execute_step(self, step: Dict[str, Any], hdo: Dict[str, Any]) -> bool:
        """Evaluate conditional step execution"""
        when_condition = step.get('when')
        if not when_condition:
            return True
        
        # Simple condition evaluation
        # In production, use a proper expression evaluator
        try:
            # Extract promotion decision check
            if 'promotion.decision' in when_condition:
                promotion = hdo.get('promotion', {})
                decision = promotion.get('decision')
                
                if '==' in when_condition:
                    expected = when_condition.split('==')[1].strip().strip("'\"")
                    return decision == expected
            
            return True
        except Exception:
            # If condition evaluation fails, default to execute
            return True
    
    async def _execute_step(self, step: Dict[str, Any], hdo: Dict[str, Any], 
                          call_handler) -> None:
        """Execute a single step using MCP orchestra invoke"""
        step_id = step.get('step_id')
        agent_id = step.get('agent_id')
        action = step.get('action')
        args = step.get('args', {})
        timeout = step.get('timeout', 30000)
        retry_count = step.get('retry_count', 0)
        on_error = step.get('on_error', 'stop')
        
        self._log_to_hdo(hdo, 'INFO', f"Executing step {step_id} with agent {agent_id}")
        
        # Prepare orchestra invoke arguments
        orchestra_args = {
            'agent_id': agent_id,
            'action': action,
            'args': args,
            'process_id': hdo.get('process_id'),
            'idempotency_key': hdo.get('meta', {}).get('idempotency_key'),
            'timeout': timeout
        }
        
        # Execute with retry logic
        last_error = None
        for attempt in range(retry_count + 1):
            try:
                # Call orchestra.invoke through MCP
                result = await orchestra_invoke(orchestra_args, {
                    'hdo': hdo,
                    'step_id': step_id,
                    'attempt': attempt + 1
                })
                
                # Update HDO with step result
                if 'payload' not in hdo:
                    hdo['payload'] = {}
                hdo['payload'][f'{step_id}_result'] = result
                
                self._log_to_hdo(hdo, 'INFO', 
                               f"Step {step_id} completed successfully on attempt {attempt + 1}")
                return
                
            except Exception as e:
                last_error = e
                self._log_to_hdo(hdo, 'WARN', 
                               f"Step {step_id} failed on attempt {attempt + 1}: {str(e)}")
                
                if attempt < retry_count:
                    # Wait before retry (exponential backoff)
                    wait_time = 2 ** attempt
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    # Handle final failure based on error strategy
                    if on_error == 'continue':
                        self._log_to_hdo(hdo, 'WARN', 
                                       f"Step {step_id} failed, continuing due to on_error=continue")
                        return
                    elif on_error == 'escalate':
                        self._log_to_hdo(hdo, 'ERROR', 
                                       f"Step {step_id} failed, escalating for manual review")
                        # In production, trigger escalation workflow
                        raise
                    else:  # stop (default)
                        raise
        
        # Should not reach here, but handle just in case
        if last_error:
            raise last_error
    
    def _log_to_hdo(self, hdo: Dict[str, Any], level: str, message: str) -> None:
        """Add log entry to HDO"""
        if 'log' not in hdo:
            hdo['log'] = []
        
        log_entry = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'level': level,
            'message': message
        }
        
        hdo['log'].append(log_entry)
        
        # Update last touched timestamp
        hdo['timestamp_last_touched'] = datetime.now(timezone.utc).isoformat()


# Global runner instance
_runner = None

def get_runner():
    """Get global runner instance"""
    global _runner
    if _runner is None:
        _runner = AltitudePlanRunner()
    return _runner

def set_mcp_handler(handler):
    """Set MCP call handler for runner"""
    runner = get_runner()
    runner.mcp_call = handler

async def run_altitude_plan(plan: Dict[str, Any], hdo: Dict[str, Any], 
                           mcp_call=None) -> Dict[str, Any]:
    """Convenience function for plan execution"""
    runner = get_runner()
    return await runner.run_altitude_plan(plan, hdo, mcp_call)