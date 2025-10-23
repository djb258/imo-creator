#!/usr/bin/env python3
"""
IMO Creator Compliance Heartbeat
Auto-update mechanism for repositories processed by IMO Creator.

This script is added to repositories to automatically check for updates
to compliance standards and apply them.
"""

import os
import sys
import json
import hashlib
import requests
import subprocess
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

class IMOCreatorHeartbeat:
    """
    Heartbeat client that checks IMO Creator for compliance updates
    and applies them to the local repository.
    """
    
    def __init__(self, repo_path: str = "."):
        self.repo_path = Path(repo_path)
        self.config_file = self.repo_path / ".imo-compliance.json"
        self.imo_creator_remote = "https://github.com/djb258/imo-creator.git"
        self.compliance_api = "https://imo-creator.vercel.app/api"
        
        # Load or create configuration
        self.config = self._load_config()
    
    def _load_config(self) -> Dict[str, Any]:
        """Load compliance configuration"""
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Warning: Could not load config: {e}")
        
        # Default configuration
        return {
            "version": "1.0.0",
            "imo_creator_version": "unknown",
            "last_check": None,
            "last_update": None,
            "check_interval_hours": 24,
            "auto_update": False,
            "compliance_level": "standard",  # "minimal", "standard", "strict"
            "excluded_files": [
                ".git/*",
                "node_modules/*",
                ".venv/*",
                "__pycache__/*"
            ],
            "repo_metadata": {
                "processed_by_imo": True,
                "initial_compliance_score": 0,
                "current_compliance_score": 0
            }
        }
    
    def _save_config(self):
        """Save compliance configuration"""
        try:
            with open(self.config_file, 'w') as f:
                json.dump(self.config, f, indent=2)
        except Exception as e:
            print(f"Error saving config: {e}")
    
    def should_check_for_updates(self) -> bool:
        """Determine if it's time to check for updates"""
        if not self.config.get("last_check"):
            return True
        
        last_check = datetime.fromisoformat(self.config["last_check"])
        interval = timedelta(hours=self.config["check_interval_hours"])
        
        return datetime.now() - last_check > interval
    
    def get_current_compliance_hash(self) -> str:
        """Generate a hash of current compliance-related files"""
        compliance_files = [
            ".github/workflows/ci.yml",
            "vercel.json",
            "LICENSE",
            "CONTRIBUTING.md",
            "requirements.txt",
            "pyproject.toml",
            "tests/test_*.py"
        ]
        
        file_contents = []
        
        for pattern in compliance_files:
            if "*" in pattern:
                # Handle glob patterns
                for file_path in self.repo_path.glob(pattern):
                    if file_path.is_file():
                        try:
                            with open(file_path, 'r', encoding='utf-8') as f:
                                file_contents.append(f.read())
                        except:
                            continue
            else:
                file_path = self.repo_path / pattern
                if file_path.exists():
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            file_contents.append(f.read())
                    except:
                        continue
        
        combined_content = "\\n".join(file_contents)
        return hashlib.sha256(combined_content.encode()).hexdigest()[:16]
    
    async def check_for_imo_creator_updates(self) -> Dict[str, Any]:
        """Check if IMO Creator has new compliance standards"""
        try:
            # Try to fetch latest version info from API
            response = requests.get(f"{self.compliance_api}/version", timeout=10)
            
            if response.status_code == 200:
                remote_info = response.json()
                
                local_version = self.config.get("imo_creator_version", "unknown")
                remote_version = remote_info.get("version", "unknown")
                
                return {
                    "update_available": remote_version != local_version,
                    "local_version": local_version,
                    "remote_version": remote_version,
                    "changes": remote_info.get("changes", []),
                    "compliance_updates": remote_info.get("compliance_updates", {})
                }
            
        except Exception as e:
            print(f"Could not check remote updates: {e}")
        
        # Fallback: check if local IMO Creator clone exists
        imo_local_path = Path.home() / ".imo-creator"
        if imo_local_path.exists():
            try:
                # Check git status
                result = subprocess.run(
                    ["git", "fetch", "origin", "master"],
                    cwd=imo_local_path,
                    capture_output=True,
                    timeout=30
                )
                
                # Check if we're behind
                result = subprocess.run(
                    ["git", "status", "-uno"],
                    cwd=imo_local_path,
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                
                behind = "Your branch is behind" in result.stdout
                
                return {
                    "update_available": behind,
                    "local_version": "git-clone",
                    "remote_version": "latest",
                    "changes": ["Check git log for details"],
                    "compliance_updates": {}
                }
                
            except Exception as e:
                print(f"Could not check local IMO Creator: {e}")
        
        return {
            "update_available": False,
            "local_version": self.config.get("imo_creator_version", "unknown"),
            "remote_version": "unknown",
            "changes": [],
            "compliance_updates": {}
        }
    
    async def fetch_compliance_updates(self) -> Optional[Dict[str, Any]]:
        """Fetch specific compliance updates for this repository"""
        try:
            # Get repository metadata
            repo_metadata = {
                "path": str(self.repo_path.resolve()),
                "name": self.repo_path.name,
                "compliance_hash": self.get_current_compliance_hash(),
                "current_score": self.config["repo_metadata"]["current_compliance_score"]
            }
            
            # Request compliance check from IMO Creator API
            response = requests.post(
                f"{self.compliance_api}/compliance/check",
                json=repo_metadata,
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()
            
        except Exception as e:
            print(f"Could not fetch compliance updates: {e}")
        
        return None
    
    def apply_compliance_updates(self, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Apply compliance updates to the repository"""
        
        if not updates.get("fixes_available"):
            return {"applied": 0, "message": "No updates to apply"}
        
        print("🔄 Applying compliance updates...")
        
        applied_count = 0
        failed_count = 0
        
        for fix in updates.get("suggested_fixes", []):
            try:
                if fix["type"] == "file_update":
                    self._apply_file_update(fix)
                    applied_count += 1
                    print(f"✅ Updated: {fix['file']}")
                    
                elif fix["type"] == "file_create":
                    self._apply_file_create(fix)
                    applied_count += 1
                    print(f"✅ Created: {fix['file']}")
                    
                elif fix["type"] == "command":
                    self._apply_command(fix)
                    applied_count += 1
                    print(f"✅ Executed: {fix['command']}")
                    
            except Exception as e:
                failed_count += 1
                print(f"❌ Failed to apply {fix.get('description', 'update')}: {e}")
        
        # Update configuration
        self.config["last_update"] = datetime.now().isoformat()
        self.config["imo_creator_version"] = updates.get("imo_version", "unknown")
        self.config["repo_metadata"]["current_compliance_score"] = updates.get("new_compliance_score", 0)
        
        self._save_config()
        
        return {
            "applied": applied_count,
            "failed": failed_count,
            "message": f"Applied {applied_count} updates, {failed_count} failed"
        }
    
    def _apply_file_update(self, fix: Dict[str, Any]):
        """Apply a file update"""
        file_path = self.repo_path / fix["file"]
        
        # Backup existing file
        if file_path.exists():
            backup_path = file_path.with_suffix(file_path.suffix + ".backup")
            file_path.rename(backup_path)
        
        # Write new content
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(fix["content"])
    
    def _apply_file_create(self, fix: Dict[str, Any]):
        """Create a new file"""
        file_path = self.repo_path / fix["file"]
        
        if file_path.exists():
            print(f"File already exists: {fix['file']}")
            return
        
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(fix["content"])
    
    def _apply_command(self, fix: Dict[str, Any]):
        """Execute a command"""
        result = subprocess.run(
            fix["command"],
            shell=True,
            cwd=self.repo_path,
            capture_output=True,
            text=True,
            timeout=60
        )
        
        if result.returncode != 0:
            raise Exception(f"Command failed: {result.stderr}")
    
    async def run_heartbeat_check(self) -> Dict[str, Any]:
        """Main heartbeat check routine"""
        print("💓 IMO Creator Compliance Heartbeat")
        
        # Update last check time
        self.config["last_check"] = datetime.now().isoformat()
        self._save_config()
        
        results = {
            "timestamp": datetime.now().isoformat(),
            "repo_path": str(self.repo_path),
            "checks_performed": [],
            "updates_applied": False,
            "summary": ""
        }
        
        # Check for IMO Creator updates
        print("🔍 Checking for IMO Creator updates...")
        update_info = await self.check_for_imo_creator_updates()
        results["checks_performed"].append("imo_creator_version_check")
        
        if update_info["update_available"]:
            print(f"📦 IMO Creator update available: {update_info['remote_version']}")
            
            # Fetch compliance updates for this repo
            print("🔍 Checking compliance requirements...")
            compliance_updates = await self.fetch_compliance_updates()
            results["checks_performed"].append("compliance_requirements_check")
            
            if compliance_updates and self.config.get("auto_update", False):
                print("🔄 Auto-applying updates...")
                apply_results = self.apply_compliance_updates(compliance_updates)
                results["updates_applied"] = apply_results["applied"] > 0
                results["apply_results"] = apply_results
                results["summary"] = apply_results["message"]
            else:
                results["summary"] = "Updates available but auto-update disabled"
                print("💡 Updates available. Run with --apply to install them.")
        else:
            results["summary"] = "Repository is up to date with IMO Creator standards"
            print("✅ Repository is up to date")
        
        return results


def main():
    import argparse
    import asyncio
    
    parser = argparse.ArgumentParser(description="IMO Creator Compliance Heartbeat")
    parser.add_argument("--repo", default=".", help="Repository path")
    parser.add_argument("--apply", action="store_true", help="Auto-apply updates")
    parser.add_argument("--force", action="store_true", help="Force check even if recently checked")
    parser.add_argument("--config", action="store_true", help="Show current configuration")
    
    args = parser.parse_args()
    
    heartbeat = IMOCreatorHeartbeat(args.repo)
    
    if args.config:
        print("Current configuration:")
        print(json.dumps(heartbeat.config, indent=2))
        return
    
    # Enable auto-update if requested
    if args.apply:
        heartbeat.config["auto_update"] = True
    
    # Check if we should run (unless forced)
    if not args.force and not heartbeat.should_check_for_updates():
        print("⏰ Heartbeat check not needed yet")
        print(f"Next check scheduled: {heartbeat.config.get('last_check', 'unknown')}")
        return
    
    # Run the heartbeat check
    async def run():
        results = await heartbeat.run_heartbeat_check()
        
        print(f"\\n📊 Heartbeat Results:")
        print(f"  Checks: {', '.join(results['checks_performed'])}")
        print(f"  Updates Applied: {results['updates_applied']}")
        print(f"  Summary: {results['summary']}")
        
        return 0 if not results.get("errors") else 1
    
    exit_code = asyncio.run(run())
    sys.exit(exit_code)


if __name__ == "__main__":
    main()