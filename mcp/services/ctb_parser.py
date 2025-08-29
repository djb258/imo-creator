#!/usr/bin/env python3
"""
CTB Parser Service
=================

Service for parsing CTB structure from GitHub repositories.
Integrates with the existing CTB structure system from ../ctb/ctb_structure.py.

This service:
1. Clones or fetches repository content
2. Reads CTB blueprint files
3. Parses diagram metadata
4. Validates CTB structure
5. Returns structured CTB data for processing
"""

import os
import tempfile
import asyncio
from typing import Optional, Dict, Any
from pathlib import Path
import yaml
import aiofiles
import logging

# Import existing CTB structure system
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'ctb'))

try:
    from ctb_structure import (
        CTBNode, ctb_from_yaml, validate_ctb_structure,
        ctb_to_yaml
    )
except ImportError as e:
    logging.error(f"Failed to import CTB structure system: {e}")
    raise ImportError(
        "CTB structure system not available. Ensure ctb/ctb_structure.py exists."
    )

from config import settings
from utils.logger import get_logger, log_processing_step
from utils.repo import clone_repository, read_file_from_repo

logger = get_logger(__name__)


class CTBParserService:
    """
    Service for parsing CTB structures from GitHub repositories.
    
    Provides methods to extract, validate, and process CTB blueprint files
    from remote repositories.
    """
    
    def __init__(self):
        self.temp_dirs = []  # Track temp directories for cleanup
    
    async def parse_repo_ctb(
        self, 
        repo_url: str, 
        branch: str = "main",
        ctb_file: str = "ctb/ctb_blueprint.yaml"
    ) -> Optional[CTBNode]:
        """
        Parse CTB structure from a GitHub repository.
        
        Args:
            repo_url: GitHub repository URL
            branch: Branch to fetch from
            ctb_file: Path to CTB blueprint file in repo
            
        Returns:
            CTBNode instance or None if parsing fails
        """
        log_processing_step(logger, "ctb_parsing", "started", 
                           repo=repo_url, branch=branch)
        
        try:
            # Clone repository to temporary directory
            temp_dir = await self._clone_repo(repo_url, branch)
            
            # Read CTB blueprint file
            ctb_file_path = Path(temp_dir) / ctb_file
            
            if not ctb_file_path.exists():
                logger.warning(f"CTB file not found: {ctb_file}")
                return None
            
            # Read and parse YAML
            async with aiofiles.open(ctb_file_path, 'r', encoding='utf-8') as f:
                yaml_content = await f.read()
            
            logger.info(f"Read CTB file: {len(yaml_content)} characters")
            
            # Parse CTB structure using existing system
            try:
                ctb_structure = ctb_from_yaml(yaml_content)
            except Exception as e:
                logger.error(f"Failed to parse CTB YAML: {e}")
                return None
            
            # Validate structure
            validation_errors = validate_ctb_structure(ctb_structure)
            
            if validation_errors:
                logger.warning(f"CTB validation warnings: {validation_errors}")
                # Continue with warnings - they're not necessarily fatal
            
            log_processing_step(logger, "ctb_parsing", "completed",
                               nodes=len(ctb_structure.get_all_nodes()),
                               validation_errors=len(validation_errors))
            
            return ctb_structure
            
        except Exception as e:
            logger.error(f"Error parsing CTB from repo: {e}", exc_info=True)
            return None
        
        finally:
            # Cleanup temporary directory
            await self._cleanup_temp_dir(temp_dir)
    
    async def get_diagram_metadata(
        self, 
        repo_url: str, 
        branch: str = "main",
        meta_file: str = "ctb/diagram.meta.yaml"
    ) -> Optional[Dict[str, Any]]:
        """
        Get diagram metadata from repository.
        
        Reads diagram.meta.yaml which should contain:
        - whimsical_project_url
        - diagram_id
        - last_updated
        - etc.
        
        Args:
            repo_url: GitHub repository URL
            branch: Branch to fetch from  
            meta_file: Path to metadata file in repo
            
        Returns:
            Dictionary with metadata or None if not found
        """
        log_processing_step(logger, "metadata_extraction", "started",
                           repo=repo_url, file=meta_file)
        
        try:
            # Clone repository
            temp_dir = await self._clone_repo(repo_url, branch)
            
            # Read metadata file
            meta_file_path = Path(temp_dir) / meta_file
            
            if not meta_file_path.exists():
                logger.info(f"Diagram metadata file not found: {meta_file}")
                return None
            
            # Read and parse YAML
            async with aiofiles.open(meta_file_path, 'r', encoding='utf-8') as f:
                yaml_content = await f.read()
            
            metadata = yaml.safe_load(yaml_content)
            
            log_processing_step(logger, "metadata_extraction", "completed",
                               keys=list(metadata.keys()) if metadata else [])
            
            return metadata
            
        except Exception as e:
            logger.error(f"Error reading diagram metadata: {e}", exc_info=True)
            return None
        
        finally:
            await self._cleanup_temp_dir(temp_dir)
    
    async def validate_repo_ctb(
        self, 
        repo_url: str, 
        branch: str = "main"
    ) -> Dict[str, Any]:
        """
        Validate CTB structure in repository without parsing.
        
        Performs quick validation checks and returns detailed results.
        
        Args:
            repo_url: GitHub repository URL
            branch: Branch to check
            
        Returns:
            Validation results dictionary
        """
        result = {
            "valid": False,
            "errors": [],
            "warnings": [],
            "info": {}
        }
        
        try:
            ctb_structure = await self.parse_repo_ctb(repo_url, branch)
            
            if not ctb_structure:
                result["errors"].append("Could not parse CTB structure")
                return result
            
            # Validate using existing validation system
            validation_errors = validate_ctb_structure(ctb_structure)
            
            if validation_errors:
                result["errors"].extend(validation_errors)
            else:
                result["valid"] = True
            
            # Add structure info
            all_nodes = ctb_structure.get_all_nodes()
            result["info"] = {
                "total_nodes": len(all_nodes),
                "star_label": ctb_structure.label,
                "branches": len(ctb_structure.subnodes),
                "altitudes": list(set(node.altitude for node in all_nodes))
            }
            
        except Exception as e:
            result["errors"].append(f"Validation failed: {str(e)}")
            logger.error(f"CTB validation error: {e}", exc_info=True)
        
        return result
    
    async def get_ctb_summary(
        self, 
        repo_url: str, 
        branch: str = "main"
    ) -> Optional[Dict[str, Any]]:
        """
        Get a summary of the CTB structure for quick overview.
        
        Args:
            repo_url: GitHub repository URL
            branch: Branch to analyze
            
        Returns:
            CTB summary dictionary or None
        """
        try:
            ctb_structure = await self.parse_repo_ctb(repo_url, branch)
            
            if not ctb_structure:
                return None
            
            all_nodes = ctb_structure.get_all_nodes()
            
            # Group nodes by altitude
            altitude_groups = {}
            for node in all_nodes:
                altitude = node.altitude
                if altitude not in altitude_groups:
                    altitude_groups[altitude] = []
                altitude_groups[altitude].append({
                    "label": node.label,
                    "node_id": node.node_id,
                    "has_imo": bool(node.imo and node.imo != "A"),
                    "has_orbt": bool(node.orbt and node.orbt != "A")
                })
            
            summary = {
                "star_label": ctb_structure.label,
                "total_nodes": len(all_nodes),
                "altitude_breakdown": altitude_groups,
                "validation_status": "valid" if not validate_ctb_structure(ctb_structure) else "warnings"
            }
            
            return summary
            
        except Exception as e:
            logger.error(f"Error creating CTB summary: {e}", exc_info=True)
            return None
    
    async def _clone_repo(self, repo_url: str, branch: str) -> str:
        """
        Clone repository to temporary directory.
        
        Args:
            repo_url: Repository URL
            branch: Branch to clone
            
        Returns:
            Path to temporary directory
        """
        temp_dir = tempfile.mkdtemp(prefix="mcp_repo_")
        self.temp_dirs.append(temp_dir)
        
        logger.debug(f"Cloning {repo_url}#{branch} to {temp_dir}")
        
        # Use git command to clone
        clone_cmd = [
            "git", "clone", 
            "--depth=1",  # Shallow clone for efficiency
            "--branch", branch,
            repo_url,
            temp_dir
        ]
        
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
                raise Exception(f"Git clone failed: {stderr.decode()}")
            
            logger.debug(f"Repository cloned successfully to {temp_dir}")
            return temp_dir
            
        except asyncio.TimeoutError:
            raise Exception(f"Repository clone timed out after {settings.REPO_CLONE_TIMEOUT}s")
        except Exception as e:
            await self._cleanup_temp_dir(temp_dir)
            raise Exception(f"Failed to clone repository: {str(e)}")
    
    async def _cleanup_temp_dir(self, temp_dir: str):
        """Clean up temporary directory"""
        try:
            if temp_dir in self.temp_dirs:
                self.temp_dirs.remove(temp_dir)
            
            if os.path.exists(temp_dir):
                import shutil
                shutil.rmtree(temp_dir, ignore_errors=True)
                logger.debug(f"Cleaned up temporary directory: {temp_dir}")
        except Exception as e:
            logger.warning(f"Failed to clean up temp directory {temp_dir}: {e}")
    
    async def __aenter__(self):
        """Async context manager entry"""
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit - cleanup all temp directories"""
        for temp_dir in self.temp_dirs.copy():
            await self._cleanup_temp_dir(temp_dir)