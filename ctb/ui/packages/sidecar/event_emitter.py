"""Sidecar event emitter for IMO Creator"""
import os
import json
import requests
from datetime import datetime
from typing import Dict, Any, Optional
from pathlib import Path

class SidecarEventEmitter:
    """Emits events to HEIR sidecar service"""
    
    def __init__(self, sidecar_url: str = None, bearer_token: str = None):
        self.sidecar_url = sidecar_url or os.getenv('IMOCREATOR_SIDECAR_URL', 'http://localhost:8000')
        self.bearer_token = bearer_token or os.getenv('IMOCREATOR_BEARER_TOKEN', 'local-dev-only')
        self.session_id = self._generate_session_id()
        
    def _generate_session_id(self) -> str:
        """Generate unique session ID"""
        import uuid
        return f"imo-session-{uuid.uuid4().hex[:8]}"
    
    def emit(self, event_type: str, payload: Dict[str, Any], metadata: Dict[str, Any] = None) -> bool:
        """Emit event to sidecar"""
        event = {
            "type": event_type,
            "timestamp": datetime.utcnow().isoformat(),
            "session_id": self.session_id,
            "payload": payload,
            "metadata": metadata or {}
        }
        
        # Add HEIR doctrine metadata
        event["metadata"].update({
            "schema_version": "HEIR/1.0",
            "app_name": "imo-creator",
            "process_id": os.getenv('PROCESS_ID', self.session_id)
        })
        
        try:
            response = requests.post(
                f"{self.sidecar_url}/events",
                json=event,
                headers={
                    "Authorization": f"Bearer {self.bearer_token}",
                    "Content-Type": "application/json"
                },
                timeout=5
            )
            return response.status_code == 200
        except Exception as e:
            print(f"Failed to emit event: {e}")
            return False
    
    def emit_app_start(self, config: Dict[str, Any] = None) -> bool:
        """Emit app start event"""
        return self.emit("app.start", {
            "config": config or {},
            "environment": os.getenv('NODE_ENV', 'development')
        })
    
    def emit_blueprint_validated(self, blueprint_id: str, validation_result: Dict[str, Any]) -> bool:
        """Emit blueprint validation event"""
        return self.emit("blueprint.validated", {
            "blueprint_id": blueprint_id,
            "validation": validation_result
        })
    
    def emit_action_invoked(self, action: str, params: Dict[str, Any], result: Any = None) -> bool:
        """Emit action invoked event"""
        return self.emit("action.invoked", {
            "action": action,
            "params": params,
            "result": result
        })
    
    def emit_heir_check(self, check_type: str, status: str, details: Dict[str, Any] = None) -> bool:
        """Emit HEIR check event"""
        return self.emit("heir.check", {
            "check_type": check_type,
            "status": status,
            "details": details or {}
        })
    
    def emit_error(self, error_type: str, message: str, stack_trace: str = None) -> bool:
        """Emit error event"""
        return self.emit("error", {
            "error_type": error_type,
            "message": message,
            "stack_trace": stack_trace
        }, metadata={
            "severity": "error"
        })


# Global emitter instance
_emitter: Optional[SidecarEventEmitter] = None

def get_emitter() -> SidecarEventEmitter:
    """Get or create global emitter instance"""
    global _emitter
    if _emitter is None:
        _emitter = SidecarEventEmitter()
    return _emitter

def emit_event(event_type: str, payload: Dict[str, Any], metadata: Dict[str, Any] = None) -> bool:
    """Convenience function to emit events"""
    return get_emitter().emit(event_type, payload, metadata)