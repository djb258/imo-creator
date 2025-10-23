"""HEIR validation checks for IMO Creator"""
import os
import sys
import yaml
import json
import hashlib
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime

class HEIRValidator:
    """Validates HEIR doctrine compliance for IMO Creator"""
    
    def __init__(self, project_root: Path = None):
        self.project_root = project_root or Path.cwd()
        self.doctrine_path = self.project_root / "heir.doctrine.yaml"
        self.errors: List[str] = []
        self.warnings: List[str] = []
        
    def load_doctrine(self) -> Optional[Dict[str, Any]]:
        """Load HEIR doctrine file"""
        if not self.doctrine_path.exists():
            self.errors.append(f"HEIR doctrine file not found at {self.doctrine_path}")
            return None
            
        try:
            with open(self.doctrine_path, 'r') as f:
                return yaml.safe_load(f)
        except Exception as e:
            self.errors.append(f"Failed to parse HEIR doctrine: {e}")
            return None
    
    def check_meta(self, doctrine: Dict[str, Any]) -> bool:
        """Validate meta configuration"""
        meta = doctrine.get('meta', {})
        required_fields = ['app_name', 'repo_slug', 'stack', 'llm']
        
        for field in required_fields:
            if field not in meta:
                self.errors.append(f"Missing required meta field: {field}")
                return False
                
        # Check LLM configuration
        llm = meta.get('llm', {})
        if not llm.get('providers'):
            self.errors.append("No LLM providers configured")
            return False
            
        return True
    
    def check_doctrine(self, doctrine: Dict[str, Any]) -> bool:
        """Validate doctrine section"""
        doc = doctrine.get('doctrine', {})
        required_fields = ['unique_id', 'process_id', 'schema_version']
        
        for field in required_fields:
            if field not in doc:
                self.errors.append(f"Missing required doctrine field: {field}")
                return False
                
        # Validate schema version
        if doc.get('schema_version') != 'HEIR/1.0':
            self.warnings.append(f"Using non-standard schema version: {doc.get('schema_version')}")
            
        return True
    
    def check_deliverables(self, doctrine: Dict[str, Any]) -> bool:
        """Validate deliverables configuration"""
        deliverables = doctrine.get('deliverables', {})
        
        # Check repos
        repos = deliverables.get('repos', [])
        if not repos:
            self.warnings.append("No repositories defined in deliverables")
            
        # Check services
        services = deliverables.get('services', [])
        required_services = {'mcp', 'sidecar'}
        found_services = {s.get('name') for s in services}
        
        missing = required_services - found_services
        if missing:
            self.errors.append(f"Missing required services: {missing}")
            return False
            
        # Check environment variables
        env = deliverables.get('env', {})
        required_env = [
            'IMOCREATOR_MCP_URL',
            'IMOCREATOR_SIDECAR_URL', 
            'IMOCREATOR_BEARER_TOKEN'
        ]
        
        for var in required_env:
            if var not in env:
                self.warnings.append(f"Missing environment variable: {var}")
                
        return True
    
    def check_contracts(self, doctrine: Dict[str, Any]) -> bool:
        """Validate contracts section"""
        contracts = doctrine.get('contracts', {})
        acceptance = contracts.get('acceptance', [])
        
        if not acceptance:
            self.warnings.append("No acceptance criteria defined")
            
        # Check for required acceptance criteria
        required_checks = [
            "HEIR checks",
            "Sidecar event",
            "MCP bay"
        ]
        
        acceptance_text = ' '.join(acceptance).lower()
        for check in required_checks:
            if check.lower() not in acceptance_text:
                self.warnings.append(f"Missing acceptance criterion for: {check}")
                
        return True
    
    def check_build(self, doctrine: Dict[str, Any]) -> bool:
        """Validate build configuration"""
        build = doctrine.get('build', {})
        actions = build.get('actions', {})
        
        # Check MCP tools
        mcp_tools = actions.get('mcp_tools', [])
        if not mcp_tools:
            self.errors.append("No MCP tools defined")
            return False
            
        required_tools = {'heir.check', 'sidecar.event'}
        found_tools = set(mcp_tools)
        
        missing = required_tools - found_tools
        if missing:
            self.warnings.append(f"Missing recommended MCP tools: {missing}")
            
        # Check CI checks
        ci_checks = actions.get('ci_checks', [])
        if not ci_checks:
            self.warnings.append("No CI checks defined")
            
        # Check telemetry events
        events = actions.get('telemetry_events', [])
        if not events:
            self.warnings.append("No telemetry events defined")
            
        return True
    
    def check_manifest_integration(self) -> bool:
        """Check integration with IMO manifest"""
        manifest_paths = [
            self.project_root / "docs" / "blueprints" / "imo" / "manifest.yaml",
            self.project_root / "docs" / "blueprints" / "example" / "manifest.yaml"
        ]
        
        found_manifest = False
        for path in manifest_paths:
            if path.exists():
                found_manifest = True
                try:
                    with open(path, 'r') as f:
                        manifest = yaml.safe_load(f)
                        
                    # Check for HEIR-capable gates
                    middle_stages = manifest.get('buckets', {}).get('middle', {}).get('stages', [])
                    gates_stage = next((s for s in middle_stages if s.get('key') == 'gates'), None)
                    
                    if gates_stage:
                        if 'heir_ruleset_id' not in gates_stage.get('fields', {}):
                            self.warnings.append(f"Gates stage missing HEIR integration in {path}")
                    else:
                        self.warnings.append(f"No gates stage found in {path}")
                        
                except Exception as e:
                    self.warnings.append(f"Failed to check manifest at {path}: {e}")
                    
        if not found_manifest:
            self.warnings.append("No IMO manifest found")
            
        return True
    
    def run_all_checks(self) -> bool:
        """Run all HEIR validation checks"""
        print("[INFO] Running HEIR validation checks...")
        
        doctrine = self.load_doctrine()
        if not doctrine:
            return False
            
        checks = [
            ("Meta configuration", lambda: self.check_meta(doctrine)),
            ("Doctrine fields", lambda: self.check_doctrine(doctrine)),
            ("Deliverables", lambda: self.check_deliverables(doctrine)),
            ("Contracts", lambda: self.check_contracts(doctrine)),
            ("Build configuration", lambda: self.check_build(doctrine)),
            ("Manifest integration", self.check_manifest_integration)
        ]
        
        all_passed = True
        for name, check_func in checks:
            print(f"\n  Checking {name}...", end=" ")
            if check_func():
                print("PASSED")
            else:
                print("FAILED")
                all_passed = False
                
        # Print summary
        print("\n" + "="*50)
        print("HEIR Validation Summary")
        print("="*50)
        
        if self.errors:
            print(f"\n[ERROR] Errors ({len(self.errors)}):")
            for error in self.errors:
                print(f"  - {error}")
                
        if self.warnings:
            print(f"\n[WARNING] Warnings ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"  - {warning}")
                
        if not self.errors and not self.warnings:
            print("\n[SUCCESS] All checks passed! IMO Creator is HEIR-compliant.")
            
        return len(self.errors) == 0


def main():
    """Main entry point for HEIR checks"""
    validator = HEIRValidator()
    
    if validator.run_all_checks():
        print("\n[SUCCESS] HEIR validation completed successfully!")
        sys.exit(0)
    else:
        print("\n[ERROR] HEIR validation failed. Please fix the errors above.")
        sys.exit(1)


if __name__ == "__main__":
    main()