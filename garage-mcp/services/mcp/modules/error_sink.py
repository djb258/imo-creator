"""
Error Sink - Builds error records for SHQ master error log
"""
import uuid
import json
import traceback
from datetime import datetime, timezone
from typing import Dict, Any, Optional, Union


def build_error_record(hdo: Dict[str, Any], ctx: Dict[str, Any], 
                      error: Exception) -> Dict[str, Any]:
    """
    Build comprehensive error record for shq.master_error_log
    
    Args:
        hdo: Hierarchical Data Object containing process context
        ctx: Additional context (stage, agent_id, etc.)
        error: Exception that occurred
        
    Returns:
        Complete error record ready for database insertion
    """
    # Generate unique error ID
    error_id = str(uuid.uuid4())
    
    # Extract process information
    process_id = hdo.get('process_id', 'UNKNOWN')
    blueprint_id = hdo.get('blueprint_id', 'UNKNOWN')
    plan_id = hdo.get('meta', {}).get('plan_id', 'UNKNOWN')
    plan_version = hdo.get('meta', {}).get('plan_version', '0.0.0')
    
    # Extract agent information
    agent_id = ctx.get('agent_id', 'UNKNOWN')
    stage = ctx.get('stage', hdo.get('stage', 'UNKNOWN'))
    
    # Determine severity based on error type
    severity = _determine_severity(error, ctx)
    
    # Get stack trace
    stack_trace = traceback.format_exc()
    
    # Create HDO snapshot (remove sensitive data)
    hdo_snapshot = _create_hdo_snapshot(hdo)
    
    # Build complete error record
    error_record = {
        'error_id': error_id,
        'occurred_at': datetime.now(timezone.utc).isoformat(),
        'process_id': process_id,
        'blueprint_id': blueprint_id,
        'plan_id': plan_id,
        'plan_version': plan_version,
        'agent_id': agent_id,
        'stage': stage,
        'severity': severity,
        'message': str(error),
        'error_type': type(error).__name__,
        'stacktrace': stack_trace,
        'hdo_snapshot': json.dumps(hdo_snapshot, default=str),
        'context': json.dumps(ctx, default=str),
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    
    return error_record


def _determine_severity(error: Exception, ctx: Dict[str, Any]) -> str:
    """Determine error severity based on error type and context"""
    
    # Critical errors that require immediate attention
    critical_errors = (
        ConnectionError,
        MemoryError,
        SystemError
    )
    
    # High priority errors
    high_errors = (
        ValueError,
        TypeError,
        KeyError,
        FileNotFoundError
    )
    
    # Medium priority errors
    medium_errors = (
        TimeoutError,
        PermissionError,
        RuntimeError
    )
    
    if isinstance(error, critical_errors):
        return 'CRITICAL'
    elif isinstance(error, high_errors):
        return 'HIGH'
    elif isinstance(error, medium_errors):
        return 'MEDIUM'
    else:
        return 'LOW'


def _create_hdo_snapshot(hdo: Dict[str, Any]) -> Dict[str, Any]:
    """Create sanitized HDO snapshot for error logging"""
    
    # Fields to include in snapshot
    include_fields = [
        'stage',
        'process_id',
        'blueprint_id',
        'validated',
        'promoted_to',
        'meta',
        'promotion',
        'errors'
    ]
    
    # Fields to exclude for security
    exclude_fields = [
        'secrets',
        'api_keys',
        'passwords',
        'tokens'
    ]
    
    snapshot = {}
    
    # Include basic fields
    for field in include_fields:
        if field in hdo:
            snapshot[field] = hdo[field]
    
    # Include last few log entries
    if 'log' in hdo and isinstance(hdo['log'], list):
        # Get last 5 log entries
        snapshot['recent_log'] = hdo['log'][-5:] if len(hdo['log']) > 5 else hdo['log']
    
    # Include payload summary (sanitized)
    if 'payload' in hdo:
        snapshot['payload_summary'] = _sanitize_payload(hdo['payload'], exclude_fields)
    
    # Include artifacts info
    if 'artifacts' in hdo:
        snapshot['artifacts'] = {k: v for k, v in hdo['artifacts'].items() 
                                if not any(exc in str(v).lower() for exc in exclude_fields)}
    
    return snapshot


def _sanitize_payload(payload: Any, exclude_fields: list) -> Any:
    """Recursively sanitize payload data"""
    
    if isinstance(payload, dict):
        sanitized = {}
        for key, value in payload.items():
            # Skip sensitive fields
            if any(exc in key.lower() for exc in exclude_fields):
                sanitized[key] = '[REDACTED]'
            else:
                sanitized[key] = _sanitize_payload(value, exclude_fields)
        return sanitized
    
    elif isinstance(payload, list):
        return [_sanitize_payload(item, exclude_fields) for item in payload[:10]]  # Limit to 10 items
    
    elif isinstance(payload, str):
        # Check if string contains sensitive patterns
        if any(exc in payload.lower() for exc in exclude_fields):
            return '[REDACTED]'
        # Truncate very long strings
        return payload[:1000] + '...' if len(payload) > 1000 else payload
    
    else:
        return payload


class ErrorSink:
    """Error sink for collecting and formatting errors"""
    
    def __init__(self):
        self.error_count = 0
        self.errors = []
    
    def capture_error(self, hdo: Dict[str, Any], ctx: Dict[str, Any], 
                     error: Exception) -> str:
        """
        Capture error and return error_id for reference
        
        Args:
            hdo: Hierarchical Data Object
            ctx: Error context
            error: Exception that occurred
            
        Returns:
            error_id for tracking
        """
        error_record = build_error_record(hdo, ctx, error)
        error_id = error_record['error_id']
        
        # Store locally for potential batch processing
        self.errors.append(error_record)
        self.error_count += 1
        
        return error_id
    
    def get_errors(self) -> list:
        """Get all captured errors"""
        return self.errors.copy()
    
    def clear_errors(self) -> None:
        """Clear captured errors"""
        self.errors.clear()
        self.error_count = 0
    
    def get_error_summary(self) -> Dict[str, Any]:
        """Get summary of captured errors"""
        if not self.errors:
            return {'total': 0, 'by_severity': {}, 'by_agent': {}}
        
        by_severity = {}
        by_agent = {}
        
        for error in self.errors:
            # Count by severity
            severity = error.get('severity', 'UNKNOWN')
            by_severity[severity] = by_severity.get(severity, 0) + 1
            
            # Count by agent
            agent = error.get('agent_id', 'UNKNOWN')
            by_agent[agent] = by_agent.get(agent, 0) + 1
        
        return {
            'total': self.error_count,
            'by_severity': by_severity,
            'by_agent': by_agent,
            'latest_error_at': self.errors[-1]['occurred_at'] if self.errors else None
        }


# Global error sink instance
_error_sink = ErrorSink()

def get_error_sink() -> ErrorSink:
    """Get global error sink instance"""
    return _error_sink

def capture_error(hdo: Dict[str, Any], ctx: Dict[str, Any], error: Exception) -> str:
    """Convenience function to capture error"""
    return _error_sink.capture_error(hdo, ctx, error)