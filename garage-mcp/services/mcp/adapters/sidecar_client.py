"""
Sidecar client for enhanced logging
"""
import os
import httpx
from typing import Dict, Any, Optional
from datetime import datetime


class SidecarClient:
    """Client for sending events to sidecar with driver information"""
    
    def __init__(self):
        self.sidecar_url = os.getenv("SIDECAR_URL", "http://localhost:8000")
    
    async def log_domain_event(
        self,
        domain: str,
        verb: str,
        driver: str,
        params: Dict[str, Any],
        result: Optional[Any] = None,
        error: Optional[str] = None
    ):
        """Log domain-specific event with driver information"""
        try:
            async with httpx.AsyncClient() as client:
                event_data = {
                    "tool": f"domains.{domain}.{verb}",
                    "domain": domain,
                    "verb": verb,
                    "driver": driver,
                    "params": params,
                    "result": result,
                    "error": error,
                    "timestamp": datetime.utcnow().isoformat()
                }
                
                await client.post(f"{self.sidecar_url}/events/mcp", json=event_data)
        except Exception as e:
            # Don't fail the main operation if logging fails
            print(f"Failed to log to sidecar: {e}")
    
    async def log_adapter_event(
        self,
        adapter_type: str,
        method: str,
        driver: str,
        params: Dict[str, Any],
        result: Optional[Any] = None,
        error: Optional[str] = None
    ):
        """Log adapter method call with driver information"""
        await self.log_domain_event(
            domain=adapter_type,
            verb=method,
            driver=driver,
            params=params,
            result=result,
            error=error
        )