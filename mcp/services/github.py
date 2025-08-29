#!/usr/bin/env python3
"""
GitHub Integration Service
==========================

Service for interacting with GitHub API.
Handles PR comments, repository information, and other GitHub operations.
"""

import aiohttp
from typing import Dict, Any, Optional, List
import logging

from config import settings
from utils.logger import get_logger, log_api_call

logger = get_logger(__name__)


class GitHubService:
    """
    Service for GitHub API interactions.
    
    Provides methods for posting comments, getting repository info,
    and other GitHub operations needed by MCP.
    """
    
    def __init__(self):
        self.api_url = settings.GITHUB_API_URL
        self.headers = settings.get_github_headers()
    
    async def post_pr_comment(
        self, 
        repo_name: str, 
        pr_number: int, 
        comment: str
    ) -> Dict[str, Any]:
        """
        Post a comment on a GitHub pull request.
        
        Args:
            repo_name: Repository name (owner/repo format)
            pr_number: Pull request number
            comment: Comment text to post
            
        Returns:
            GitHub API response
        """
        log_api_call(logger, "GitHub", "post_pr_comment", "started",
                    repo=repo_name, pr=pr_number)
        
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.api_url}/repos/{repo_name}/issues/{pr_number}/comments"
                
                payload = {
                    "body": comment
                }
                
                async with session.post(url, headers=self.headers, json=payload) as response:
                    if response.status == 201:
                        result = await response.json()
                        log_api_call(logger, "GitHub", "post_pr_comment", "completed",
                                   comment_id=result.get('id'))
                        return result
                    else:
                        error_text = await response.text()
                        raise Exception(f"GitHub API error {response.status}: {error_text}")
        
        except Exception as e:
            logger.error(f"Failed to post PR comment: {e}", exc_info=True)
            raise
    
    async def get_repository_info(self, repo_name: str) -> Optional[Dict[str, Any]]:
        """
        Get repository information from GitHub API.
        
        Args:
            repo_name: Repository name (owner/repo format)
            
        Returns:
            Repository information or None if not found
        """
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.api_url}/repos/{repo_name}"
                
                async with session.get(url, headers=self.headers) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        logger.warning(f"Repository not found: {repo_name}")
                        return None
        
        except Exception as e:
            logger.error(f"Failed to get repository info: {e}")
            return None
    
    async def get_pr_files(self, repo_name: str, pr_number: int) -> List[Dict[str, Any]]:
        """
        Get list of files changed in a pull request.
        
        Args:
            repo_name: Repository name (owner/repo format)
            pr_number: Pull request number
            
        Returns:
            List of changed files
        """
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.api_url}/repos/{repo_name}/pulls/{pr_number}/files"
                
                async with session.get(url, headers=self.headers) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        logger.warning(f"Failed to get PR files: {response.status}")
                        return []
        
        except Exception as e:
            logger.error(f"Failed to get PR files: {e}")
            return []