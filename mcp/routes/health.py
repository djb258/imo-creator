#!/usr/bin/env python3
"""
Health Check Routes
==================

Health monitoring endpoints for the MCP backend server.
Used by Render and other monitoring systems to check service status.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import asyncio
import time
import logging

from config import settings
from utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

# Service start time for uptime calculation
SERVICE_START_TIME = time.time()


@router.get("/")
async def health_check() -> Dict[str, Any]:
    """
    Basic health check endpoint.
    
    Returns service status and basic information.
    Used by load balancers and monitoring systems.
    """
    uptime_seconds = time.time() - SERVICE_START_TIME
    
    return {
        "status": "healthy",
        "service": "MCP Backend",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "uptime_seconds": round(uptime_seconds, 2),
        "timestamp": time.time()
    }


@router.get("/status")
async def detailed_status() -> Dict[str, Any]:
    """
    Detailed service status with dependency checks.
    
    Performs health checks on external services and dependencies.
    Returns comprehensive status information.
    """
    logger.info("Performing detailed health check")
    
    uptime_seconds = time.time() - SERVICE_START_TIME
    
    # Basic service info
    status = {
        "service": {
            "name": "MCP Backend",
            "version": "1.0.0", 
            "environment": settings.ENVIRONMENT,
            "debug": settings.DEBUG,
            "uptime_seconds": round(uptime_seconds, 2)
        },
        "timestamp": time.time(),
        "overall_status": "healthy"
    }
    
    # Check external service configurations
    services = {
        "github": {
            "configured": bool(settings.GITHUB_TOKEN),
            "api_url": settings.GITHUB_API_URL,
            "webhook_secret_set": bool(settings.GITHUB_WEBHOOK_SECRET)
        },
        "whimsical": {
            "configured": bool(settings.WHIMSICAL_API_KEY),
            "api_url": settings.WHIMSICAL_API_URL
        },
        "plasmic": {
            "configured": bool(settings.PLASMIC_AUTH_TOKEN),
            "api_url": settings.PLASMIC_API_URL,
            "project_id_set": bool(settings.PLASMIC_PROJECT_ID)
        },
        "llm": {
            "configured": bool(settings.LLM_API_KEY),
            "model": settings.LLM_MODEL,
            "api_url": settings.LLM_API_URL
        }
    }
    
    status["services"] = services
    
    # Check if any critical services are misconfigured
    critical_services = ["github", "whimsical", "llm"]
    misconfigured = []
    
    for service_name in critical_services:
        if not services[service_name]["configured"]:
            misconfigured.append(service_name)
    
    if misconfigured and settings.is_production():
        status["overall_status"] = "degraded"
        status["warnings"] = [f"Service not configured: {', '.join(misconfigured)}"]
        logger.warning(f"Services not configured in production: {misconfigured}")
    
    # System resources (basic check)
    try:
        import psutil
        status["system"] = {
            "cpu_percent": psutil.cpu_percent(interval=1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent
        }
    except ImportError:
        status["system"] = {"note": "psutil not installed - system metrics unavailable"}
    
    logger.info(f"Health check completed - Status: {status['overall_status']}")
    return status


@router.get("/ready")
async def readiness_check() -> Dict[str, Any]:
    """
    Kubernetes-style readiness probe.
    
    Checks if the service is ready to receive traffic.
    Returns 200 if ready, 503 if not ready.
    """
    logger.debug("Performing readiness check")
    
    # Check critical dependencies
    ready = True
    issues = []
    
    # In production, ensure critical services are configured
    if settings.is_production():
        required_configs = [
            ("GITHUB_TOKEN", settings.GITHUB_TOKEN),
            ("WHIMSICAL_API_KEY", settings.WHIMSICAL_API_KEY),
            ("LLM_API_KEY", settings.LLM_API_KEY)
        ]
        
        for config_name, config_value in required_configs:
            if not config_value:
                ready = False
                issues.append(f"Missing configuration: {config_name}")
    
    # Check if service has been running for minimum time (avoid startup issues)
    min_uptime = 5  # 5 seconds
    uptime = time.time() - SERVICE_START_TIME
    if uptime < min_uptime:
        ready = False
        issues.append(f"Service not ready - uptime {uptime:.1f}s < {min_uptime}s")
    
    if not ready:
        logger.warning(f"Service not ready: {issues}")
        raise HTTPException(status_code=503, detail={
            "ready": False,
            "issues": issues,
            "timestamp": time.time()
        })
    
    return {
        "ready": True,
        "uptime_seconds": round(uptime, 2),
        "timestamp": time.time()
    }


@router.get("/live")
async def liveness_check() -> Dict[str, str]:
    """
    Kubernetes-style liveness probe.
    
    Simple check to verify the process is alive and responsive.
    Should always return 200 unless the process is completely dead.
    """
    return {
        "status": "alive",
        "timestamp": str(time.time())
    }


@router.get("/metrics")
async def basic_metrics() -> Dict[str, Any]:
    """
    Basic service metrics for monitoring.
    
    Returns simple metrics about service performance and status.
    For production, consider integrating with Prometheus/Grafana.
    """
    if not settings.DEBUG and not settings.is_production():
        raise HTTPException(status_code=404, detail="Metrics not available")
    
    uptime_seconds = time.time() - SERVICE_START_TIME
    
    metrics = {
        "service": {
            "uptime_seconds": round(uptime_seconds, 2),
            "uptime_hours": round(uptime_seconds / 3600, 2),
            "environment": settings.ENVIRONMENT,
            "version": "1.0.0"
        },
        "timestamp": time.time()
    }
    
    # Add basic system metrics if available
    try:
        import psutil
        process = psutil.Process()
        metrics["process"] = {
            "memory_rss_mb": round(process.memory_info().rss / 1024 / 1024, 2),
            "memory_vms_mb": round(process.memory_info().vms / 1024 / 1024, 2),
            "cpu_percent": process.cpu_percent(),
            "num_threads": process.num_threads(),
            "create_time": process.create_time()
        }
    except ImportError:
        metrics["process"] = {"note": "psutil not available"}
    
    return metrics