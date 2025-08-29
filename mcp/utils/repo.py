#!/usr/bin/env python3
"""
Repository Utilities
===================

Utilities for working with GitHub repositories and file operations.
Provides async operations for cloning, reading files, and repo management.
"""

import os
import tempfile
import asyncio
import aiofiles
from typing import Optional, Dict, Any, List
from pathlib import Path
import logging

from config import settings
from utils.logger import get_logger

logger = get_logger(__name__)


async def clone_repository(
    repo_url: str, 
    branch: str = "main",
    depth: int = 1
) -> str:
    """
    Clone a GitHub repository to a temporary directory.
    
    Args:
        repo_url: Repository URL (HTTPS or SSH)
        branch: Branch to clone
        depth: Git clone depth (1 for shallow clone)
        
    Returns:
        Path to cloned repository directory
        
    Raises:
        Exception: If clone operation fails
    """
    temp_dir = tempfile.mkdtemp(prefix="mcp_clone_")
    
    logger.info(f"Cloning {repo_url} (branch: {branch}) to {temp_dir}")
    
    # Build git clone command
    clone_cmd = ["git", "clone"]
    
    if depth > 0:
        clone_cmd.extend(["--depth", str(depth)])
    
    clone_cmd.extend(["--branch", branch, repo_url, temp_dir])
    
    try:
        process = await asyncio.create_subprocess_exec(
            *clone_cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await asyncio.wait_for(
            process.communicate(),
            timeout=settings.REPO_CLONE_TIMEOUT
        )
        
        if process.returncode != 0:
            error_msg = stderr.decode('utf-8', errors='ignore')
            raise Exception(f"Git clone failed (exit {process.returncode}): {error_msg}")
        
        logger.info(f"Successfully cloned repository to {temp_dir}")
        return temp_dir
        
    except asyncio.TimeoutError:
        raise Exception(f"Repository clone timed out after {settings.REPO_CLONE_TIMEOUT} seconds")
    except FileNotFoundError:
        raise Exception("Git command not found. Ensure Git is installed and in PATH.")
    except Exception as e:
        # Cleanup on failure
        await cleanup_directory(temp_dir)
        raise Exception(f"Failed to clone repository: {str(e)}")


async def read_file_from_repo(
    repo_path: str, 
    file_path: str,
    encoding: str = 'utf-8'
) -> Optional[str]:
    """
    Read a file from a cloned repository.
    
    Args:
        repo_path: Path to cloned repository
        file_path: Relative path to file within repo
        encoding: File encoding
        
    Returns:
        File content as string or None if file doesn't exist
    """
    full_path = Path(repo_path) / file_path
    
    if not full_path.exists():
        logger.warning(f"File not found: {file_path}")
        return None
    
    if not full_path.is_file():
        logger.warning(f"Path is not a file: {file_path}")
        return None
    
    try:
        async with aiofiles.open(full_path, 'r', encoding=encoding) as f:
            content = await f.read()
        
        logger.debug(f"Read file {file_path}: {len(content)} characters")
        return content
        
    except Exception as e:
        logger.error(f"Error reading file {file_path}: {e}")
        return None


async def list_files_in_repo(
    repo_path: str,
    pattern: Optional[str] = None,
    recursive: bool = True
) -> List[str]:
    """
    List files in a repository directory.
    
    Args:
        repo_path: Path to repository
        pattern: Optional glob pattern to filter files
        recursive: Whether to search recursively
        
    Returns:
        List of relative file paths
    """
    repo_path = Path(repo_path)
    files = []
    
    if not repo_path.exists():
        logger.warning(f"Repository path does not exist: {repo_path}")
        return files
    
    try:
        if recursive:
            search_pattern = "**/*" if not pattern else f"**/{pattern}"
            file_paths = repo_path.glob(search_pattern)
        else:
            search_pattern = "*" if not pattern else pattern
            file_paths = repo_path.glob(search_pattern)
        
        for file_path in file_paths:
            if file_path.is_file():
                # Get relative path from repo root
                rel_path = file_path.relative_to(repo_path)
                files.append(str(rel_path))
        
        logger.debug(f"Found {len(files)} files in repository")
        return sorted(files)
        
    except Exception as e:
        logger.error(f"Error listing files in repository: {e}")
        return files


async def get_repo_info(repo_path: str) -> Dict[str, Any]:
    """
    Get basic information about a cloned repository.
    
    Args:
        repo_path: Path to cloned repository
        
    Returns:
        Dictionary with repository information
    """
    info = {
        "path": repo_path,
        "exists": False,
        "is_git_repo": False,
        "current_branch": None,
        "remote_url": None,
        "last_commit": None,
        "file_count": 0
    }
    
    repo_path = Path(repo_path)
    
    if not repo_path.exists():
        return info
    
    info["exists"] = True
    
    # Check if it's a git repository
    git_dir = repo_path / ".git"
    if git_dir.exists():
        info["is_git_repo"] = True
        
        try:
            # Get current branch
            branch_result = await run_git_command(repo_path, ["branch", "--show-current"])
            if branch_result:
                info["current_branch"] = branch_result.strip()
            
            # Get remote URL
            remote_result = await run_git_command(repo_path, ["remote", "get-url", "origin"])
            if remote_result:
                info["remote_url"] = remote_result.strip()
            
            # Get last commit info
            commit_result = await run_git_command(
                repo_path, 
                ["log", "-1", "--pretty=format:%H|%an|%ad|%s", "--date=iso"]
            )
            if commit_result:
                parts = commit_result.strip().split("|", 3)
                if len(parts) == 4:
                    info["last_commit"] = {
                        "hash": parts[0],
                        "author": parts[1],
                        "date": parts[2],
                        "message": parts[3]
                    }
        
        except Exception as e:
            logger.warning(f"Error getting git info: {e}")
    
    # Count files
    try:
        files = await list_files_in_repo(str(repo_path))
        info["file_count"] = len(files)
    except Exception as e:
        logger.warning(f"Error counting files: {e}")
    
    return info


async def run_git_command(repo_path: Path, args: List[str]) -> Optional[str]:
    """
    Run a git command in the repository directory.
    
    Args:
        repo_path: Path to repository
        args: Git command arguments
        
    Returns:
        Command output or None if failed
    """
    try:
        process = await asyncio.create_subprocess_exec(
            "git", *args,
            cwd=repo_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await asyncio.wait_for(
            process.communicate(),
            timeout=30  # 30 second timeout for git commands
        )
        
        if process.returncode == 0:
            return stdout.decode('utf-8', errors='ignore')
        else:
            logger.warning(f"Git command failed: {stderr.decode('utf-8', errors='ignore')}")
            return None
            
    except Exception as e:
        logger.error(f"Error running git command: {e}")
        return None


async def cleanup_directory(directory_path: str):
    """
    Clean up a directory (typically a temp directory).
    
    Args:
        directory_path: Path to directory to remove
    """
    try:
        if os.path.exists(directory_path):
            import shutil
            shutil.rmtree(directory_path, ignore_errors=True)
            logger.debug(f"Cleaned up directory: {directory_path}")
    except Exception as e:
        logger.warning(f"Failed to cleanup directory {directory_path}: {e}")


async def validate_repo_size(repo_path: str) -> bool:
    """
    Validate that repository size is within acceptable limits.
    
    Args:
        repo_path: Path to repository
        
    Returns:
        True if size is acceptable, False otherwise
    """
    try:
        repo_path = Path(repo_path)
        total_size = 0
        
        for file_path in repo_path.rglob("*"):
            if file_path.is_file():
                total_size += file_path.stat().st_size
        
        size_mb = total_size / (1024 * 1024)
        
        if size_mb > settings.REPO_MAX_SIZE_MB:
            logger.warning(f"Repository size ({size_mb:.1f}MB) exceeds limit ({settings.REPO_MAX_SIZE_MB}MB)")
            return False
        
        logger.debug(f"Repository size: {size_mb:.1f}MB (within limit)")
        return True
        
    except Exception as e:
        logger.error(f"Error validating repository size: {e}")
        return False


class RepositoryContext:
    """
    Async context manager for working with repositories.
    
    Automatically handles cloning and cleanup.
    """
    
    def __init__(self, repo_url: str, branch: str = "main"):
        self.repo_url = repo_url
        self.branch = branch
        self.repo_path = None
    
    async def __aenter__(self):
        """Clone repository and return path"""
        self.repo_path = await clone_repository(self.repo_url, self.branch)
        return self.repo_path
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Cleanup repository"""
        if self.repo_path:
            await cleanup_directory(self.repo_path)