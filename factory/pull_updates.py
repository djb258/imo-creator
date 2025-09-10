#!/usr/bin/env python3
"""
Factory Update Sync Tool
Pulls latest updates from imo-creator master repo to any target repository.

Syncs:
- HEIR/ORBT system updates
- MCP server configurations  
- Factory seeding improvements
- CTB generator updates
- Environment configurations
- Documentation systems

Usage:
  python factory/pull_updates.py /path/to/target-repo
  python factory/pull_updates.py .  # Update current repo from imo-creator
"""

import sys
import shutil
import json
import subprocess
from pathlib import Path
from datetime import datetime

class UpdateSyncer:
    def __init__(self, imo_creator_path, target_repo_path):
        self.imo_creator = Path(imo_creator_path).resolve()
        self.target_repo = Path(target_repo_path).resolve()
        self.synced_items = []
        
        # Validate paths
        if not self.imo_creator.exists():
            raise SystemExit(f"❌ imo-creator path not found: {self.imo_creator}")
        if not self.target_repo.exists():
            raise SystemExit(f"❌ Target repo not found: {self.target_repo}")
        if not (self.target_repo / ".git").exists():
            raise SystemExit(f"❌ Target is not a git repository: {self.target_repo}")
    
    def log(self, message, prefix="📋"):
        print(f"{prefix} {message}")
    
    def sync_directory(self, source_subpath, target_subpath=None, description=""):
        """Sync entire directory from imo-creator to target repo"""
        if target_subpath is None:
            target_subpath = source_subpath
            
        source_dir = self.imo_creator / source_subpath
        target_dir = self.target_repo / target_subpath
        
        if not source_dir.exists():
            self.log(f"⚠️  Skipped {description} - source not found: {source_subpath}", "⚠️")
            return False
            
        # Backup existing if it exists
        if target_dir.exists():
            backup_path = target_dir.parent / f"{target_dir.name}.backup.{int(datetime.now().timestamp())}"
            shutil.move(str(target_dir), str(backup_path))
            self.log(f"📦 Backed up existing {target_subpath} → {backup_path.name}")
        
        # Copy from source
        shutil.copytree(str(source_dir), str(target_dir))
        self.log(f"✅ Synced {description}: {target_subpath}")
        self.synced_items.append(f"{description} ({target_subpath})")
        return True
    
    def sync_file(self, source_subpath, target_subpath=None, description=""):
        """Sync single file from imo-creator to target repo"""
        if target_subpath is None:
            target_subpath = source_subpath
            
        source_file = self.imo_creator / source_subpath
        target_file = self.target_repo / target_subpath
        
        if not source_file.exists():
            self.log(f"⚠️  Skipped {description} - source not found: {source_subpath}", "⚠️")
            return False
        
        # Create target directory if needed
        target_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Backup existing if it exists
        if target_file.exists():
            backup_path = target_file.parent / f"{target_file.name}.backup.{int(datetime.now().timestamp())}"
            shutil.copy2(str(target_file), str(backup_path))
            self.log(f"📦 Backed up existing {target_file.name}")
        
        # Copy from source
        shutil.copy2(str(source_file), str(target_file))
        self.log(f"✅ Synced {description}: {target_subpath}")
        self.synced_items.append(f"{description} ({target_subpath})")
        return True
    
    def sync_mcp_servers(self):
        """Sync all MCP server configurations and updates"""
        self.log("\n🔧 Syncing MCP Server Updates", "🔧")
        
        # Sync entire mcp-servers directory
        if self.sync_directory("mcp-servers", description="MCP servers"):
            
            # Sync individual important files that might be outside mcp-servers
            self.sync_file("config/master.env", description="Master environment configuration")
            self.sync_file("scripts/install-composio-env.js", description="Environment installer")
            self.sync_file("scripts/mcp-auto-discovery.js", description="MCP auto-discovery")
            self.sync_file(".claude/mcp_discovery.json", description="Claude MCP configuration")
    
    def sync_heir_orbt_system(self):
        """Sync HEIR/ORBT compliance system updates"""
        self.log("\n🛡️  Syncing HEIR/ORBT System", "🛡️")
        
        # BMAD system
        self.sync_directory("bmad", description="BMAD measurement system")
        
        # Git hooks
        self.sync_directory("hooks", description="Git hooks")
        
        # HEIR/ORBT documentation and schemas
        heir_files = [
            "HEIR_COMPLIANCE.md",
            "ORBT_LAYERS.md", 
            "DOCTRINE_VALIDATION.md",
            "scripts/doctrine-enforcer.js"
        ]
        
        for file_path in heir_files:
            self.sync_file(file_path, description=f"HEIR/ORBT {Path(file_path).name}")
    
    def sync_factory_system(self):
        """Sync factory seeding and automation updates"""
        self.log("\n🏭 Syncing Factory System", "🏭")
        
        # Factory directory
        self.sync_directory("factory", description="Factory seeding system")
        
        # CTB generator and templates
        self.sync_file("tools/generate_ctb.py", description="CTB generator")
        self.sync_file("README_CTBG.md", description="CTB documentation")
        
        # GitHub workflows
        self.sync_file(".github/workflows/ctb-docs.yml", description="CTB auto-generation workflow")
    
    def sync_package_dependencies(self):
        """Sync package.json dependencies for new MCP tools"""
        self.log("\n📦 Syncing Package Dependencies", "📦")
        
        source_pkg = self.imo_creator / "package.json"
        target_pkg = self.target_repo / "package.json"
        
        if not source_pkg.exists():
            self.log("⚠️  No package.json in imo-creator to sync")
            return
            
        if not target_pkg.exists():
            self.log("⚠️  No package.json in target repo - creating new one")
            shutil.copy2(str(source_pkg), str(target_pkg))
            self.synced_items.append("Package dependencies (package.json)")
            return
        
        # Merge dependencies intelligently
        try:
            with open(source_pkg) as f:
                source_data = json.load(f)
            with open(target_pkg) as f:
                target_data = json.load(f)
            
            # Merge dependencies
            deps_added = 0
            for dep_type in ["dependencies", "devDependencies"]:
                if dep_type in source_data:
                    if dep_type not in target_data:
                        target_data[dep_type] = {}
                    
                    for pkg, version in source_data[dep_type].items():
                        if pkg not in target_data[dep_type]:
                            target_data[dep_type][pkg] = version
                            deps_added += 1
            
            if deps_added > 0:
                # Backup and save
                backup_path = target_pkg.parent / f"package.json.backup.{int(datetime.now().timestamp())}"
                shutil.copy2(str(target_pkg), str(backup_path))
                
                with open(target_pkg, 'w') as f:
                    json.dump(target_data, f, indent=2)
                
                self.log(f"✅ Merged {deps_added} new dependencies into package.json")
                self.synced_items.append(f"Package dependencies ({deps_added} new packages)")
            else:
                self.log("✅ Package dependencies already up to date")
                
        except Exception as e:
            self.log(f"⚠️  Could not merge package.json: {e}")
    
    def run_post_sync_setup(self):
        """Run any setup commands after sync"""
        self.log("\n⚡ Running Post-Sync Setup", "⚡")
        
        # Install new npm packages if package.json was updated
        if any("Package dependencies" in item for item in self.synced_items):
            try:
                self.log("📦 Installing updated npm packages...")
                result = subprocess.run(["npm", "install"], 
                                      cwd=self.target_repo, 
                                      capture_output=True, 
                                      text=True,
                                      timeout=120)
                if result.returncode == 0:
                    self.log("✅ npm install completed successfully")
                else:
                    self.log(f"⚠️  npm install had issues: {result.stderr}")
            except Exception as e:
                self.log(f"⚠️  Could not run npm install: {e}")
        
        # Run MCP auto-discovery if available
        discovery_script = self.target_repo / "scripts" / "mcp-auto-discovery.js"
        if discovery_script.exists():
            try:
                self.log("🔍 Running MCP auto-discovery...")
                result = subprocess.run(["node", "scripts/mcp-auto-discovery.js"], 
                                      cwd=self.target_repo,
                                      capture_output=True,
                                      text=True,
                                      timeout=30)
                if result.returncode == 0:
                    self.log("✅ MCP auto-discovery completed")
                else:
                    self.log(f"⚠️  MCP discovery had issues: {result.stderr}")
            except Exception as e:
                self.log(f"⚠️  Could not run MCP discovery: {e}")
    
    def generate_sync_report(self):
        """Generate summary of what was synced"""
        self.log("\n" + "=" * 60, "📊")
        self.log("SYNC COMPLETE", "🎉")
        self.log("=" * 60, "📊")
        
        self.log(f"Source: {self.imo_creator}")
        self.log(f"Target: {self.target_repo}")
        self.log(f"Timestamp: {datetime.now().isoformat()}")
        
        if self.synced_items:
            self.log(f"\n✅ Synced {len(self.synced_items)} components:")
            for item in self.synced_items:
                self.log(f"   • {item}")
        else:
            self.log("\n⚠️  No items were synced")
        
        self.log("\n💡 Next steps:")
        self.log("   1. Review synced changes")
        self.log("   2. Test MCP connections if applicable")
        self.log("   3. Commit changes to git")
        self.log("   4. Run project-specific setup if needed")
    
    def sync_all(self):
        """Run complete sync process"""
        self.log(f"🚀 Syncing updates from imo-creator to target repository")
        self.log(f"Source: {self.imo_creator}")
        self.log(f"Target: {self.target_repo}")
        
        # Run all sync operations
        self.sync_mcp_servers()
        self.sync_heir_orbt_system() 
        self.sync_factory_system()
        self.sync_package_dependencies()
        self.run_post_sync_setup()
        self.generate_sync_report()

def main():
    if len(sys.argv) < 2:
        print("Usage: python factory/pull_updates.py <target-repo-path>")
        print("\nExamples:")
        print("  python factory/pull_updates.py /path/to/my-project")
        print("  python factory/pull_updates.py .  # Update current directory")
        print("\nSyncs all HEIR/ORBT/MCP/Factory updates from imo-creator to target repo")
        sys.exit(1)
    
    # Determine imo-creator path (assume script is run from imo-creator/factory/)
    script_dir = Path(__file__).parent
    imo_creator_path = script_dir.parent
    target_repo_path = Path(sys.argv[1]).resolve()
    
    try:
        syncer = UpdateSyncer(imo_creator_path, target_repo_path)
        syncer.sync_all()
    except Exception as e:
        print(f"❌ Sync failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()