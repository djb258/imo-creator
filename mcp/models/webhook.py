#!/usr/bin/env python3
"""
Webhook Data Models
==================

Pydantic models for GitHub webhook data and API responses.
Provides type safety and validation for webhook processing.
"""

from pydantic import BaseModel, validator
from typing import Dict, Any, Optional, List
from datetime import datetime


class GitHubRepository(BaseModel):
    """GitHub repository information from webhook"""
    id: int
    name: str
    full_name: str
    description: Optional[str] = None
    private: bool
    html_url: str
    clone_url: str
    ssh_url: str
    default_branch: str = "main"
    
    class Config:
        extra = "allow"  # Allow additional fields from GitHub


class GitHubWebhook(BaseModel):
    """
    GitHub webhook payload model.
    
    Standardizes webhook data across different GitHub events.
    """
    event_type: str
    delivery_id: str
    repository: Dict[str, Any]
    payload: Dict[str, Any]
    
    @validator('event_type')
    def validate_event_type(cls, v):
        """Validate supported GitHub event types"""
        supported_events = [
            'push', 'pull_request', 'issues', 'repository', 
            'workflow_run', 'workflow_dispatch'
        ]
        # Allow all events but log unsupported ones
        return v
    
    def get_repo_info(self) -> GitHubRepository:
        """Extract repository information as typed model"""
        return GitHubRepository(**self.repository)
    
    def is_main_branch_push(self) -> bool:
        """Check if this is a push to main/master branch"""
        if self.event_type != 'push':
            return False
        
        ref = self.payload.get('ref', '')
        return ref in ['refs/heads/main', 'refs/heads/master']
    
    def get_modified_files(self) -> List[str]:
        """Get list of modified files from push or PR"""
        modified_files = []
        
        if self.event_type == 'push':
            commits = self.payload.get('commits', [])
            for commit in commits:
                modified_files.extend(commit.get('modified', []))
                modified_files.extend(commit.get('added', []))
        
        elif self.event_type == 'pull_request':
            # For PR events, we'd need to fetch the file list via GitHub API
            # This is a placeholder - actual implementation would make API call
            modified_files = []
        
        return list(set(modified_files))  # Remove duplicates
    
    def has_ctb_changes(self) -> bool:
        """Check if CTB files were modified"""
        modified_files = self.get_modified_files()
        return any(
            file_path.startswith('ctb/') and file_path.endswith('.yaml')
            for file_path in modified_files
        )


class WebhookResponse(BaseModel):
    """Response model for webhook endpoints"""
    success: bool
    message: str
    processed: bool
    delivery_id: Optional[str] = None
    timestamp: Optional[datetime] = None
    details: Optional[Dict[str, Any]] = None
    
    def __init__(self, **data):
        if 'timestamp' not in data:
            data['timestamp'] = datetime.utcnow()
        super().__init__(**data)


class ProcessingStatus(BaseModel):
    """Status tracking for webhook processing"""
    delivery_id: str
    status: str  # pending, processing, completed, failed
    steps_completed: List[str] = []
    current_step: Optional[str] = None
    error_message: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    results: Optional[Dict[str, Any]] = None
    
    def mark_step_completed(self, step: str):
        """Mark a processing step as completed"""
        if step not in self.steps_completed:
            self.steps_completed.append(step)
    
    def set_current_step(self, step: str):
        """Set the current processing step"""
        self.current_step = step
    
    def mark_completed(self, results: Optional[Dict[str, Any]] = None):
        """Mark processing as completed"""
        self.status = "completed"
        self.completed_at = datetime.utcnow()
        self.current_step = None
        if results:
            self.results = results
    
    def mark_failed(self, error: str):
        """Mark processing as failed"""
        self.status = "failed"
        self.completed_at = datetime.utcnow()
        self.error_message = error
        self.current_step = None