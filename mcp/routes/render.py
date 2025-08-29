#!/usr/bin/env python3
"""
CTB Rendering Routes
===================

Manual endpoints for triggering CTB processing and rendering.
Used for testing and manual operations outside of webhook flow.
"""

from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from typing import Dict, Any, Optional
import logging

from config import settings
from models.webhook import WebhookResponse
from services.ctb_parser import CTBParserService
from services.whimsical import WhimsicalService
from services.llm import LLMService
from utils.logger import get_logger, log_api_call

router = APIRouter()
logger = get_logger(__name__)


@router.post("/ctb")
async def render_ctb_from_repo(
    repo_url: str = Query(..., description="GitHub repository URL"),
    branch: str = Query("main", description="Branch to process"),
    whimsical_url: Optional[str] = Query(None, description="Whimsical project URL"),
    enhance_with_llm: bool = Query(True, description="Whether to enhance CTB with LLM")
) -> Dict[str, Any]:
    """
    Manually render CTB structure from a repository.
    
    This endpoint allows manual triggering of the CTB processing pipeline
    without requiring a GitHub webhook. Useful for testing and one-off operations.
    
    Args:
        repo_url: GitHub repository URL
        branch: Branch to process (default: main)
        whimsical_url: Optional Whimsical project URL (overrides repo metadata)
        enhance_with_llm: Whether to enhance CTB with LLM analysis
        
    Returns:
        Processing results and status
    """
    log_api_call(logger, "Manual", "render_ctb", "started", 
                repo=repo_url, branch=branch)
    
    try:
        # Initialize services
        ctb_parser = CTBParserService()
        whimsical_service = WhimsicalService()
        llm_service = LLMService()
        
        # Step 1: Parse CTB structure
        logger.info("Parsing CTB structure from repository")
        ctb_structure = await ctb_parser.parse_repo_ctb(repo_url, branch)
        
        if not ctb_structure:
            raise HTTPException(
                status_code=400,
                detail="No valid CTB structure found in repository"
            )
        
        # Step 2: Get Whimsical URL from repo or parameter
        if not whimsical_url:
            logger.info("Reading diagram metadata from repository")
            diagram_meta = await ctb_parser.get_diagram_metadata(repo_url, branch)
            whimsical_url = diagram_meta.get('whimsical_project_url') if diagram_meta else None
        
        if not whimsical_url:
            raise HTTPException(
                status_code=400,
                detail="No Whimsical project URL provided or found in repository"
            )
        
        # Step 3: Optional LLM enhancement
        processed_ctb = ctb_structure
        llm_enhancements = None
        
        if enhance_with_llm:
            logger.info("Enhancing CTB structure with LLM analysis")
            processed_ctb = await llm_service.analyze_and_enhance_ctb(
                ctb_structure=ctb_structure,
                repo_context={
                    'url': repo_url,
                    'branch': branch
                }
            )
            
            # Get enhancement details
            llm_enhancements = {
                "original_nodes": len(ctb_structure.get_all_nodes()),
                "enhanced_nodes": len(processed_ctb.get_all_nodes()),
                "enhancements_applied": True
            }
        
        # Step 4: Update Whimsical diagram
        logger.info("Updating Whimsical diagram")
        whimsical_result = await whimsical_service.update_diagram(
            project_url=whimsical_url,
            ctb_structure=processed_ctb
        )
        
        # Prepare response
        result = {
            "success": True,
            "message": "CTB rendering completed successfully",
            "repository": {
                "url": repo_url,
                "branch": branch
            },
            "ctb_structure": {
                "star_label": processed_ctb.label,
                "total_nodes": len(processed_ctb.get_all_nodes()),
                "branches": len(processed_ctb.subnodes)
            },
            "whimsical": {
                "project_url": whimsical_url,
                "diagram_id": whimsical_result.get('diagram_id'),
                "updated": True
            }
        }
        
        if llm_enhancements:
            result["llm_analysis"] = llm_enhancements
        
        log_api_call(logger, "Manual", "render_ctb", "completed",
                    nodes=len(processed_ctb.get_all_nodes()))
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in manual CTB rendering: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"CTB rendering failed: {str(e)}"
        )


@router.get("/validate")
async def validate_repo_ctb(
    repo_url: str = Query(..., description="GitHub repository URL"),
    branch: str = Query("main", description="Branch to validate")
) -> Dict[str, Any]:
    """
    Validate CTB structure in a repository without processing.
    
    Performs validation checks and returns detailed results without
    triggering any updates or processing.
    
    Args:
        repo_url: GitHub repository URL
        branch: Branch to validate
        
    Returns:
        Validation results and CTB structure summary
    """
    log_api_call(logger, "Manual", "validate_ctb", "started",
                repo=repo_url, branch=branch)
    
    try:
        ctb_parser = CTBParserService()
        
        # Validate CTB structure
        validation_result = await ctb_parser.validate_repo_ctb(repo_url, branch)
        
        # Get CTB summary if valid
        ctb_summary = None
        if validation_result["valid"] or not validation_result["errors"]:
            ctb_summary = await ctb_parser.get_ctb_summary(repo_url, branch)
        
        result = {
            "repository": {
                "url": repo_url,
                "branch": branch
            },
            "validation": validation_result
        }
        
        if ctb_summary:
            result["ctb_summary"] = ctb_summary
        
        log_api_call(logger, "Manual", "validate_ctb", "completed",
                    valid=validation_result["valid"])
        
        return result
        
    except Exception as e:
        logger.error(f"Error validating CTB: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"CTB validation failed: {str(e)}"
        )


@router.get("/summary")
async def get_repo_ctb_summary(
    repo_url: str = Query(..., description="GitHub repository URL"),
    branch: str = Query("main", description="Branch to analyze")
) -> Dict[str, Any]:
    """
    Get a summary of CTB structure in repository.
    
    Returns high-level information about the CTB structure
    without full processing or validation.
    
    Args:
        repo_url: GitHub repository URL
        branch: Branch to analyze
        
    Returns:
        CTB structure summary
    """
    log_api_call(logger, "Manual", "ctb_summary", "started",
                repo=repo_url, branch=branch)
    
    try:
        ctb_parser = CTBParserService()
        
        # Get CTB summary
        summary = await ctb_parser.get_ctb_summary(repo_url, branch)
        
        if not summary:
            raise HTTPException(
                status_code=404,
                detail="No CTB structure found in repository"
            )
        
        result = {
            "repository": {
                "url": repo_url,
                "branch": branch
            },
            "summary": summary
        }
        
        log_api_call(logger, "Manual", "ctb_summary", "completed",
                    nodes=summary.get("total_nodes", 0))
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting CTB summary: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get CTB summary: {str(e)}"
        )


@router.post("/test")
async def test_ctb_processing():
    """
    Test endpoint for CTB processing pipeline.
    
    Uses a predefined test repository to verify the complete
    processing pipeline is working correctly.
    Only available in debug mode.
    """
    if not settings.DEBUG:
        raise HTTPException(status_code=404, detail="Not found")
    
    # Use the current repository as test subject
    test_repo_url = "https://github.com/djb258/imo-creator.git"
    test_branch = "feature/bmad-solo-mode"
    
    logger.info(f"Running test CTB processing with {test_repo_url}")
    
    try:
        # Process the test repository
        result = await render_ctb_from_repo(
            repo_url=test_repo_url,
            branch=test_branch,
            enhance_with_llm=False  # Skip LLM for testing
        )
        
        # Add test metadata
        result["test_info"] = {
            "test_repo": test_repo_url,
            "test_branch": test_branch,
            "timestamp": "2024-08-29T12:00:00Z"
        }
        
        return result
        
    except Exception as e:
        logger.error(f"Test processing failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Test processing failed: {str(e)}"
        )