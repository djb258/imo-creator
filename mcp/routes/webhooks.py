#!/usr/bin/env python3
"""
GitHub Webhook Routes
====================

Handles GitHub webhook events for repository changes.
Triggers CTB processing and orchestration workflow.

Flow:
1. GitHub sends webhook on repo changes
2. Validate webhook signature  
3. Parse CTB structure from repo
4. Enhance with LLM analysis
5. Update Whimsical diagram
6. Generate Plasmic components (optional)
7. Return status
"""

from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
from typing import Dict, Any, Optional
import hashlib
import hmac
import json
import logging

from config import settings
from models.webhook import GitHubWebhook, WebhookResponse
from services.ctb_parser import CTBParserService
from services.whimsical import WhimsicalService
from services.llm import LLMService
from services.github import GitHubService
from utils.logger import get_logger, log_api_call, log_processing_step

router = APIRouter()
logger = get_logger(__name__)


def verify_github_signature(payload: bytes, signature: str, secret: str) -> bool:
    """
    Verify GitHub webhook signature for security.
    
    Args:
        payload: Raw request body
        signature: GitHub signature header (sha256=...)
        secret: Webhook secret from GitHub
        
    Returns:
        True if signature is valid, False otherwise
    """
    if not secret:
        logger.warning("No webhook secret configured - skipping signature verification")
        return True  # Allow in development
    
    if not signature.startswith('sha256='):
        return False
    
    expected_signature = 'sha256=' + hmac.new(
        secret.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)


@router.post("/github")
async def handle_github_webhook(
    request: Request,
    background_tasks: BackgroundTasks
) -> WebhookResponse:
    """
    Handle GitHub webhook events.
    
    Primary entry point for GitHub-triggered CTB processing.
    Validates the webhook and triggers appropriate processing.
    """
    log_api_call(logger, "GitHub", "webhook", "received")
    
    # Get raw payload and headers
    payload = await request.body()
    signature = request.headers.get('X-Hub-Signature-256', '')
    event_type = request.headers.get('X-GitHub-Event', 'unknown')
    delivery_id = request.headers.get('X-GitHub-Delivery', 'unknown')
    
    logger.info(f"GitHub webhook received - Event: {event_type}, Delivery: {delivery_id}")
    
    # Verify signature
    if not verify_github_signature(payload, signature, settings.GITHUB_WEBHOOK_SECRET):
        logger.error("Invalid GitHub webhook signature")
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    # Parse payload
    try:
        webhook_data = json.loads(payload.decode('utf-8'))
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse webhook JSON: {e}")
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
    
    # Create webhook model
    try:
        webhook = GitHubWebhook(
            event_type=event_type,
            delivery_id=delivery_id,
            repository=webhook_data.get('repository', {}),
            payload=webhook_data
        )
    except Exception as e:
        logger.error(f"Failed to parse webhook data: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid webhook format: {str(e)}")
    
    # Check if we should process this event
    should_process = should_process_webhook(webhook)
    
    if not should_process:
        logger.info(f"Skipping webhook processing - Event: {event_type}")
        return WebhookResponse(
            success=True,
            message=f"Webhook received but not processed (event: {event_type})",
            processed=False,
            delivery_id=delivery_id
        )
    
    # Process webhook in background to avoid timeout
    background_tasks.add_task(
        process_webhook_background,
        webhook
    )
    
    logger.info(f"Webhook queued for processing - Delivery: {delivery_id}")
    return WebhookResponse(
        success=True,
        message="Webhook queued for processing",
        processed=True,
        delivery_id=delivery_id
    )


def should_process_webhook(webhook: GitHubWebhook) -> bool:
    """
    Determine if a webhook should trigger CTB processing.
    
    Args:
        webhook: GitHub webhook data
        
    Returns:
        True if webhook should be processed
    """
    # Process push events to main/master branches
    if webhook.event_type == 'push':
        ref = webhook.payload.get('ref', '')
        if ref in ['refs/heads/main', 'refs/heads/master']:
            # Check if CTB files were modified
            commits = webhook.payload.get('commits', [])
            for commit in commits:
                modified_files = commit.get('modified', []) + commit.get('added', [])
                for file_path in modified_files:
                    if file_path.startswith('ctb/') and file_path.endswith('.yaml'):
                        return True
        return False
    
    # Process pull request events
    if webhook.event_type == 'pull_request':
        action = webhook.payload.get('action')
        if action in ['opened', 'synchronized', 'reopened']:
            # TODO: Check if PR contains CTB changes
            return True
        return False
    
    # Process other events as needed
    logger.debug(f"Unhandled webhook event type: {webhook.event_type}")
    return False


async def process_webhook_background(webhook: GitHubWebhook):
    """
    Process webhook in the background.
    
    Main orchestration logic for CTB processing workflow.
    """
    delivery_id = webhook.delivery_id
    repo_info = webhook.repository
    
    log_processing_step(logger, "webhook_processing", "started", 
                       delivery_id=delivery_id, repo=repo_info.get('full_name'))
    
    try:
        # Initialize services
        ctb_parser = CTBParserService()
        whimsical_service = WhimsicalService()
        llm_service = LLMService()
        github_service = GitHubService()
        
        # Extract repository information
        repo_url = repo_info.get('clone_url')
        repo_name = repo_info.get('full_name')
        default_branch = repo_info.get('default_branch', 'main')
        
        log_processing_step(logger, "repo_extraction", "completed",
                           repo=repo_name, branch=default_branch)
        
        # Step 1: Parse CTB structure from repository
        log_processing_step(logger, "ctb_parsing", "started")
        
        ctb_structure = await ctb_parser.parse_repo_ctb(
            repo_url=repo_url,
            branch=default_branch
        )
        
        if not ctb_structure:
            logger.error("No valid CTB structure found in repository")
            return
        
        log_processing_step(logger, "ctb_parsing", "completed",
                           nodes=len(ctb_structure.get_all_nodes()))
        
        # Step 2: Get diagram metadata (Whimsical project URL)
        log_processing_step(logger, "metadata_extraction", "started")
        
        diagram_meta = await ctb_parser.get_diagram_metadata(
            repo_url=repo_url,
            branch=default_branch
        )
        
        whimsical_url = diagram_meta.get('whimsical_project_url') if diagram_meta else None
        
        if not whimsical_url:
            logger.warning("No Whimsical project URL found in diagram.meta.yaml")
            # Could create new project or skip Whimsical update
            return
        
        log_processing_step(logger, "metadata_extraction", "completed",
                           whimsical_url=whimsical_url)
        
        # Step 3: LLM Enhancement (analyze and suggest improvements)
        log_processing_step(logger, "llm_analysis", "started")
        
        enhanced_ctb = await llm_service.analyze_and_enhance_ctb(
            ctb_structure=ctb_structure,
            repo_context={
                'name': repo_name,
                'url': repo_url,
                'branch': default_branch
            }
        )
        
        log_processing_step(logger, "llm_analysis", "completed",
                           original_nodes=len(ctb_structure.get_all_nodes()),
                           enhanced_nodes=len(enhanced_ctb.get_all_nodes()))
        
        # Step 4: Update Whimsical diagram
        log_processing_step(logger, "whimsical_update", "started")
        
        whimsical_result = await whimsical_service.update_diagram(
            project_url=whimsical_url,
            ctb_structure=enhanced_ctb
        )
        
        log_processing_step(logger, "whimsical_update", "completed",
                           diagram_id=whimsical_result.get('diagram_id'))
        
        # Step 5: Optional - Generate Plasmic components
        # TODO: Implement Plasmic integration if needed
        
        # Step 6: Optional - Post status back to GitHub PR
        if webhook.event_type == 'pull_request':
            pr_number = webhook.payload.get('pull_request', {}).get('number')
            if pr_number:
                await github_service.post_pr_comment(
                    repo_name=repo_name,
                    pr_number=pr_number,
                    comment=f"🎄 CTB diagram updated successfully!\n\n"
                           f"- Processed {len(enhanced_ctb.get_all_nodes())} nodes\n"
                           f"- Enhanced with LLM analysis\n"
                           f"- Updated Whimsical diagram: {whimsical_url}\n\n"
                           f"_Processed by MCP Backend_"
                )
        
        log_processing_step(logger, "webhook_processing", "completed",
                           delivery_id=delivery_id)
        
    except Exception as e:
        logger.error(f"Error processing webhook {delivery_id}: {str(e)}", exc_info=True)
        
        # Optional: Post error status to GitHub
        if webhook.event_type == 'pull_request':
            try:
                pr_number = webhook.payload.get('pull_request', {}).get('number')
                if pr_number:
                    await github_service.post_pr_comment(
                        repo_name=repo_name,
                        pr_number=pr_number,
                        comment=f"❌ CTB processing failed\n\n"
                               f"Error: {str(e)}\n\n"
                               f"_Processed by MCP Backend_"
                    )
            except Exception as comment_error:
                logger.error(f"Failed to post error comment: {comment_error}")


@router.post("/test")
async def test_webhook():
    """
    Test endpoint for webhook processing without GitHub.
    
    Useful for development and testing the webhook flow.
    Only available in debug mode.
    """
    if not settings.DEBUG:
        raise HTTPException(status_code=404, detail="Not found")
    
    logger.info("Test webhook triggered")
    
    # Create a mock webhook for testing
    test_webhook = GitHubWebhook(
        event_type='push',
        delivery_id='test-delivery',
        repository={
            'full_name': 'test/repo',
            'clone_url': 'https://github.com/test/repo.git',
            'default_branch': 'main'
        },
        payload={
            'ref': 'refs/heads/main',
            'commits': [
                {
                    'modified': ['ctb/ctb_blueprint.yaml'],
                    'message': 'Update CTB structure'
                }
            ]
        }
    )
    
    # Process in background  
    await process_webhook_background(test_webhook)
    
    return WebhookResponse(
        success=True,
        message="Test webhook processed",
        processed=True,
        delivery_id='test-delivery'
    )