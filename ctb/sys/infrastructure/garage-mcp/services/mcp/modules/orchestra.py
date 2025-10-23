"""
Orchestra MCP Tool - Single entrypoint for agent delegation
"""
import re
import asyncio
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from .error_sink import build_error_record


# Process ID validation regex
PROCESS_ID_PATTERN = re.compile(r'^PROC-[a-z0-9_]+-\d{8}-\d{6}-\d{3,6}$')
IDEMPOTENCY_KEY_PATTERN = re.compile(r'^IDEM-PROC-[a-z0-9_]+-\d{8}-\d{6}-\d{3,6}$')


class OrchestraError(Exception):
    """Custom exception for orchestra operations"""
    
    def __init__(self, message: str, error_id: str = None, agent_id: str = None):
        super().__init__(message)
        self.error_id = error_id
        self.agent_id = agent_id


async def orchestra_invoke(args: Dict[str, Any], ctx: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main MCP tool entrypoint for agent delegation
    
    Args:
        args: Invocation arguments containing:
            - agent_id: Agent role ID to invoke
            - action: Action to perform  
            - args: Action-specific arguments
            - process_id: Process identifier
            - idempotency_key: Duplicate detection key
            - timeout: Optional timeout in milliseconds
        ctx: Execution context containing HDO and other metadata
        
    Returns:
        Updated HDO with agent results
        
    Raises:
        OrchestraError: On validation or execution failures
    """
    
    # Extract and validate required arguments
    agent_id = args.get('agent_id')
    action = args.get('action')
    action_args = args.get('args', {})
    process_id = args.get('process_id')
    idempotency_key = args.get('idempotency_key')
    timeout = args.get('timeout', 30000)
    
    if not agent_id:
        raise OrchestraError("agent_id is required")
    
    if not action:
        raise OrchestraError("action is required", agent_id=agent_id)
    
    if not process_id:
        raise OrchestraError("process_id is required", agent_id=agent_id)
    
    # Validate ID patterns
    if not PROCESS_ID_PATTERN.match(process_id):
        raise OrchestraError(f"Invalid process_id format: {process_id}", agent_id=agent_id)
    
    if idempotency_key and not IDEMPOTENCY_KEY_PATTERN.match(idempotency_key):
        raise OrchestraError(f"Invalid idempotency_key format: {idempotency_key}", agent_id=agent_id)
    
    # Get HDO from context
    hdo = ctx.get('hdo', {})
    if not hdo:
        raise OrchestraError("HDO not found in context", agent_id=agent_id)
    
    # Post sidecar start event
    await _post_sidecar_event('start', {
        'agent_id': agent_id,
        'action': action,
        'process_id': process_id,
        'timestamp': datetime.now(timezone.utc).isoformat()
    })
    
    try:
        # Delegate to Claude sub-agent
        result = await _delegate_to_agent(agent_id, action, action_args, hdo, ctx, timeout)
        
        # Post sidecar success event
        await _post_sidecar_event('success', {
            'agent_id': agent_id,
            'action': action,
            'process_id': process_id,
            'result_summary': _summarize_result(result),
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
        return result
        
    except Exception as e:
        # Build error record for SHQ master error log
        error_record = build_error_record(hdo, {
            'agent_id': agent_id,
            'action': action,
            'stage': 'agent_delegation'
        }, e)
        
        error_id = error_record['error_id']
        
        # Insert into shq.master_error_log (simulated for now)
        await _insert_master_error_log(error_record)
        
        # Post sidecar error event
        await _post_sidecar_event('error', {
            'agent_id': agent_id,
            'action': action,
            'process_id': process_id,
            'error_id': error_id,
            'error_message': str(e),
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
        # Re-raise concise error with error_id
        raise OrchestraError(f"Agent {agent_id} failed; error_id={error_id}", 
                           error_id=error_id, agent_id=agent_id) from e


async def _delegate_to_agent(agent_id: str, action: str, args: Dict[str, Any], 
                           hdo: Dict[str, Any], ctx: Dict[str, Any], 
                           timeout: int) -> Dict[str, Any]:
    """
    Delegate task to specific Claude sub-agent
    
    In a real implementation, this would:
    1. Load agent configuration from registry
    2. Resolve agent implementation path
    3. Invoke Claude with agent-specific prompt
    4. Handle agent response and update HDO
    
    For now, this is a simulation.
    """
    
    # Simulate agent lookup and validation
    agent_info = await _lookup_agent(agent_id)
    if not agent_info:
        raise ValueError(f"Unknown agent_id: {agent_id}")
    
    # Simulate timeout handling
    try:
        result = await asyncio.wait_for(
            _simulate_agent_execution(agent_id, action, args, hdo),
            timeout=timeout / 1000.0  # Convert to seconds
        )
        
        # Update HDO with results
        if 'payload' not in hdo:
            hdo['payload'] = {}
        
        # Store agent result in payload
        result_key = f"{agent_id}_{action}_result"
        hdo['payload'][result_key] = result
        
        # Update timestamp
        hdo['timestamp_last_touched'] = datetime.now(timezone.utc).isoformat()
        
        # Add log entry
        if 'log' not in hdo:
            hdo['log'] = []
        
        hdo['log'].append({
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'level': 'INFO',
            'message': f"Agent {agent_id} completed action {action}",
            'agent_id': agent_id,
            'step': action
        })
        
        return hdo
        
    except asyncio.TimeoutError:
        raise TimeoutError(f"Agent {agent_id} timed out after {timeout}ms")


async def _lookup_agent(agent_id: str) -> Optional[Dict[str, Any]]:
    """Look up agent configuration from registry"""
    
    # In a real implementation, load from docs/subagents.registry.json
    # and docs/agent.bindings.json
    
    known_agents = {
        'overall-orchestrator': {'type': 'orchestrator', 'altitude': 30000},
        'input-orchestrator': {'type': 'orchestrator', 'altitude': 20000},
        'input-subagent-mapper': {'type': 'subagent', 'altitude': 20000},
        'input-subagent-validator': {'type': 'subagent', 'altitude': 20000},
        'middle-orchestrator': {'type': 'orchestrator', 'altitude': 10000},
        'middle-subagent-db': {'type': 'subagent', 'altitude': 10000},
        'middle-subagent-enforcer': {'type': 'subagent', 'altitude': 10000},
        'output-orchestrator': {'type': 'orchestrator', 'altitude': 5000},
        'output-subagent-notifier': {'type': 'subagent', 'altitude': 5000},
        'output-subagent-reporter': {'type': 'subagent', 'altitude': 5000}
    }
    
    return known_agents.get(agent_id)


async def _simulate_agent_execution(agent_id: str, action: str, args: Dict[str, Any], 
                                  hdo: Dict[str, Any]) -> Dict[str, Any]:
    """
    Simulate agent execution
    
    In a real implementation, this would:
    1. Load agent prompt from .claude/agents/{path}
    2. Construct Claude API call with agent context
    3. Parse agent response
    4. Extract structured results
    """
    
    # Simulate processing time
    await asyncio.sleep(0.1)
    
    # Return simulated result based on agent type
    if 'orchestrator' in agent_id:
        return {
            'delegated_to': f"{agent_id.replace('orchestrator', 'subagent')}-mock",
            'status': 'delegated',
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
    elif 'mapper' in agent_id:
        return {
            'mapped_fields': ['field1', 'field2', 'field3'],
            'transformation_count': 5,
            'status': 'mapped',
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
    elif 'validator' in agent_id:
        return {
            'validation_result': True,
            'errors': [],
            'warnings': [],
            'status': 'validated',
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
    elif 'db' in agent_id:
        if action == 'plan':
            return {
                'operations': ['INSERT', 'UPDATE'],
                'estimated_duration': '2.5s',
                'risk_assessment': 'LOW',
                'status': 'planned',
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
        elif action == 'apply':
            return {
                'operations_executed': 2,
                'rows_affected': 15,
                'transaction_id': 'txn_12345',
                'status': 'applied',
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
    elif 'enforcer' in agent_id:
        return {
            'decision': 'PROMOTE',
            'confidence_score': 0.92,
            'rules_evaluated': 8,
            'violations': [],
            'status': 'enforced',
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
    elif 'notifier' in agent_id:
        return {
            'notifications_sent': 3,
            'channels': ['email', 'slack'],
            'recipients': 5,
            'status': 'notified',
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
    elif 'reporter' in agent_id:
        return {
            'artifacts_generated': 2,
            'formats': ['pdf', 'csv'],
            'total_size_bytes': 45678,
            'status': 'reported',
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
    
    # Default result
    return {
        'action': action,
        'status': 'completed',
        'timestamp': datetime.now(timezone.utc).isoformat()
    }


async def _post_sidecar_event(event_type: str, data: Dict[str, Any]) -> None:
    """Post event to sidecar system"""
    # In a real implementation, this would call the sidecar API
    # For now, just log the event
    print(f"SIDECAR_EVENT[{event_type}]: {data}")


async def _insert_master_error_log(error_record: Dict[str, Any]) -> None:
    """Insert error record into shq.master_error_log"""
    # In a real implementation, this would insert into the database
    # For now, just log the error record
    print(f"MASTER_ERROR_LOG: {error_record}")


def _summarize_result(result: Dict[str, Any]) -> str:
    """Create brief summary of agent result"""
    status = result.get('status', 'unknown')
    
    if 'mapped_fields' in result:
        return f"Mapped {len(result['mapped_fields'])} fields"
    elif 'validation_result' in result:
        return f"Validation: {'passed' if result['validation_result'] else 'failed'}"
    elif 'operations' in result:
        return f"Planned {len(result['operations'])} operations"
    elif 'decision' in result:
        return f"Decision: {result['decision']}"
    elif 'notifications_sent' in result:
        return f"Sent {result['notifications_sent']} notifications"
    elif 'artifacts_generated' in result:
        return f"Generated {result['artifacts_generated']} artifacts"
    else:
        return f"Status: {status}"


# Export main function for MCP tool registration
__all__ = ['orchestra_invoke', 'OrchestraError']