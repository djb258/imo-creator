#!/usr/bin/env python3
"""
Altitude Plan Validator
Validates altitude plans against schema and business rules
"""

import json
import sys
import os
from pathlib import Path
from typing import Dict, Any, List, Optional
import re

# ANSI color codes
class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    NC = '\033[0m'  # No Color
    BOLD = '\033[1m'


class PlanValidator:
    """Validates altitude plans"""
    
    def __init__(self):
        self.errors: List[str] = []
        self.warnings: List[str] = []
        
    def validate_file(self, plan_file: Path) -> bool:
        """Validate a single plan file"""
        print(f"{Colors.BLUE}Validating plan: {Colors.GREEN}{plan_file}{Colors.NC}")
        
        try:
            with open(plan_file, 'r') as f:
                plan = json.load(f)
        except json.JSONDecodeError as e:
            self.errors.append(f"Invalid JSON in {plan_file}: {e}")
            return False
        except FileNotFoundError:
            self.errors.append(f"File not found: {plan_file}")
            return False
        
        # Validate structure
        self._validate_structure(plan, plan_file)
        
        # Validate stages
        self._validate_stages(plan, plan_file)
        
        # Validate business rules
        self._validate_business_rules(plan, plan_file)
        
        return len(self.errors) == 0
    
    def _validate_structure(self, plan: Dict[str, Any], file_path: Path) -> None:
        """Validate basic plan structure"""
        required_fields = ['plan_id', 'version', 'stages']
        
        for field in required_fields:
            if field not in plan:
                self.errors.append(f"{file_path}: Missing required field '{field}'")
        
        # Validate plan_id format
        if 'plan_id' in plan:
            if not re.match(r'^[a-z0-9_]+$', plan['plan_id']):
                self.errors.append(f"{file_path}: Invalid plan_id format. Must be lowercase alphanumeric with underscores")
        
        # Validate version format (semver)
        if 'version' in plan:
            if not re.match(r'^\d+\.\d+\.\d+$', plan['version']):
                self.errors.append(f"{file_path}: Invalid version format. Must be semver (e.g., 1.0.0)")
    
    def _validate_stages(self, plan: Dict[str, Any], file_path: Path) -> None:
        """Validate stages array"""
        if 'stages' not in plan:
            return
        
        stages = plan['stages']
        if not isinstance(stages, list):
            self.errors.append(f"{file_path}: 'stages' must be an array")
            return
        
        if len(stages) == 0:
            self.warnings.append(f"{file_path}: Plan has no stages")
            return
        
        stage_ids = set()
        altitudes = set()
        
        for i, stage in enumerate(stages):
            stage_prefix = f"{file_path}:stages[{i}]"
            
            # Validate stage structure
            required_stage_fields = ['stage_id', 'altitude', 'steps']
            for field in required_stage_fields:
                if field not in stage:
                    self.errors.append(f"{stage_prefix}: Missing required field '{field}'")
            
            # Validate stage_id format
            if 'stage_id' in stage:
                stage_id = stage['stage_id']
                if not re.match(r'^[A-Z]\d+$', stage_id):
                    self.errors.append(f"{stage_prefix}: Invalid stage_id format. Must be like 'A1', 'B2', etc.")
                
                if stage_id in stage_ids:
                    self.errors.append(f"{stage_prefix}: Duplicate stage_id '{stage_id}'")
                stage_ids.add(stage_id)
            
            # Validate altitude
            if 'altitude' in stage:
                altitude = stage['altitude']
                valid_altitudes = [30000, 20000, 10000, 5000]
                if altitude not in valid_altitudes:
                    self.errors.append(f"{stage_prefix}: Invalid altitude {altitude}. Must be one of {valid_altitudes}")
                
                if altitude in altitudes:
                    self.warnings.append(f"{stage_prefix}: Duplicate altitude {altitude}")
                altitudes.add(altitude)
            
            # Validate steps
            self._validate_steps(stage.get('steps', []), f"{stage_prefix}:steps")
    
    def _validate_steps(self, steps: List[Dict[str, Any]], prefix: str) -> None:
        """Validate steps array"""
        if not isinstance(steps, list):
            self.errors.append(f"{prefix}: Must be an array")
            return
        
        if len(steps) == 0:
            self.warnings.append(f"{prefix}: No steps defined")
            return
        
        step_ids = set()
        
        for i, step in enumerate(steps):
            step_prefix = f"{prefix}[{i}]"
            
            # Validate step structure
            required_step_fields = ['step_id', 'agent_id', 'action']
            for field in required_step_fields:
                if field not in step:
                    self.errors.append(f"{step_prefix}: Missing required field '{field}'")
            
            # Validate step_id format
            if 'step_id' in step:
                step_id = step['step_id']
                if not re.match(r'^[a-z_]+$', step_id):
                    self.errors.append(f"{step_prefix}: Invalid step_id format. Must be lowercase with underscores")
                
                if step_id in step_ids:
                    self.errors.append(f"{step_prefix}: Duplicate step_id '{step_id}'")
                step_ids.add(step_id)
            
            # Validate agent_id
            if 'agent_id' in step:
                agent_id = step['agent_id']
                if not self._is_valid_agent_id(agent_id):
                    self.warnings.append(f"{step_prefix}: Unknown agent_id '{agent_id}'. Check agent registry.")
            
            # Validate conditional execution
            if 'when' in step:
                self._validate_condition(step['when'], step_prefix)
            
            # Validate error handling
            if 'on_error' in step:
                valid_strategies = ['continue', 'stop', 'retry', 'escalate']
                if step['on_error'] not in valid_strategies:
                    self.errors.append(f"{step_prefix}: Invalid on_error strategy. Must be one of {valid_strategies}")
            
            # Validate retry count
            if 'retry_count' in step:
                retry_count = step['retry_count']
                if not isinstance(retry_count, int) or retry_count < 0 or retry_count > 5:
                    self.errors.append(f"{step_prefix}: retry_count must be integer 0-5")
            
            # Validate timeout
            if 'timeout' in step:
                timeout = step['timeout']
                if not isinstance(timeout, int) or timeout < 1000:
                    self.errors.append(f"{step_prefix}: timeout must be integer >= 1000ms")
    
    def _validate_condition(self, condition: str, prefix: str) -> None:
        """Validate conditional expression"""
        # Simple validation for now - could be extended with proper expression parser
        if not isinstance(condition, str):
            self.errors.append(f"{prefix}: 'when' condition must be a string")
            return
        
        # Check for common patterns
        valid_patterns = [
            r'promotion\.decision\s*==\s*[\'"][A-Z]+[\'"]',
            r'stage\s*==\s*[\'"][a-z]+[\'"]',
            r'error_count\s*[<>=]+\s*\d+',
        ]
        
        if not any(re.search(pattern, condition) for pattern in valid_patterns):
            self.warnings.append(f"{prefix}: Condition '{condition}' may not be valid. Check syntax.")
    
    def _is_valid_agent_id(self, agent_id: str) -> bool:
        """Check if agent_id exists in registry"""
        # Try to load agent registry
        registry_file = Path('docs/subagents.registry.json')
        if not registry_file.exists():
            return True  # Skip validation if no registry
        
        try:
            with open(registry_file, 'r') as f:
                registry = json.load(f)
            
            for agent in registry.get('agents', []):
                if agent.get('role_id') == agent_id:
                    return True
            
            return False
        except (json.JSONDecodeError, FileNotFoundError):
            return True  # Skip validation on error
    
    def _validate_business_rules(self, plan: Dict[str, Any], file_path: Path) -> None:
        """Validate business rules and best practices"""
        stages = plan.get('stages', [])
        
        # Check altitude progression
        altitudes = [stage.get('altitude') for stage in stages if 'altitude' in stage]
        if altitudes:
            # Should generally go from high to low altitude
            if not self._is_descending_sequence(altitudes, allow_duplicates=True):
                self.warnings.append(f"{file_path}: Consider organizing stages from high to low altitude (30k → 5k)")
        
        # Check for orchestrator delegation pattern
        for stage in stages:
            if 'orchestrator' in stage:
                orchestrator = stage['orchestrator']
                steps = stage.get('steps', [])
                
                # Orchestrator should delegate to sub-agents
                for step in steps:
                    agent_id = step.get('agent_id')
                    if agent_id == orchestrator:
                        self.warnings.append(f"{file_path}: Orchestrator {orchestrator} acting as sub-agent. Consider delegation pattern.")
        
        # Check for conditional steps without enforcer
        has_enforcer = any(
            'enforcer' in step.get('agent_id', '')
            for stage in stages
            for step in stage.get('steps', [])
        )
        
        has_conditional = any(
            'when' in step
            for stage in stages
            for step in stage.get('steps', [])
        )
        
        if has_conditional and not has_enforcer:
            self.warnings.append(f"{file_path}: Plan has conditional steps but no enforcer agent. Consider adding enforcement.")
    
    def _is_descending_sequence(self, sequence: List[int], allow_duplicates: bool = False) -> bool:
        """Check if sequence is descending"""
        for i in range(1, len(sequence)):
            if allow_duplicates:
                if sequence[i] > sequence[i-1]:
                    return False
            else:
                if sequence[i] >= sequence[i-1]:
                    return False
        return True
    
    def print_results(self, file_path: Path) -> bool:
        """Print validation results"""
        if not self.errors and not self.warnings:
            print(f"  {Colors.GREEN}Plan is valid{Colors.NC}")
            return True
        
        if self.errors:
            print(f"  {Colors.RED}{len(self.errors)} error(s) found:{Colors.NC}")
            for error in self.errors:
                print(f"    {Colors.RED}- {error}{Colors.NC}")
        
        if self.warnings:
            print(f"  {Colors.YELLOW}{len(self.warnings)} warning(s):{Colors.NC}")
            for warning in self.warnings:
                print(f"    {Colors.YELLOW}- {warning}{Colors.NC}")
        
        return len(self.errors) == 0


def validate_schema_exists() -> bool:
    """Check if schema file exists"""
    schema_file = Path('blueprints/altitude.plan.schema.json')
    if not schema_file.exists():
        print(f"{Colors.RED}Schema file not found: {schema_file}{Colors.NC}")
        print(f"{Colors.YELLOW}Create schema with: make schema-create{Colors.NC}")
        return False
    
    print(f"{Colors.GREEN}Schema file found: {schema_file}{Colors.NC}")
    return True


def main():
    """Main validation function"""
    print(f"{Colors.BLUE}{'='*80}{Colors.NC}")
    print(f"{Colors.BLUE}{Colors.BOLD}Garage-MCP Altitude Plan Validator{Colors.NC}")
    print(f"{Colors.BLUE}{'='*80}{Colors.NC}")
    
    # Check if schema exists
    if not validate_schema_exists():
        sys.exit(1)
    
    # Find plan files
    blueprint_dir = Path('blueprints')
    if not blueprint_dir.exists():
        print(f"{Colors.RED}❌ Blueprints directory not found: {blueprint_dir}{Colors.NC}")
        sys.exit(1)
    
    plan_files = list(blueprint_dir.rglob('*.plan.json'))
    
    if not plan_files:
        print(f"{Colors.YELLOW}No plan files found in {blueprint_dir}{Colors.NC}")
        print(f"{Colors.YELLOW}Plans should be named: *.plan.json{Colors.NC}")
        sys.exit(0)
    
    print(f"{Colors.GREEN}Found {len(plan_files)} plan file(s){Colors.NC}")
    print("")
    
    # Validate each plan
    total_valid = 0
    total_files = len(plan_files)
    
    for plan_file in sorted(plan_files):
        validator = PlanValidator()
        is_valid = validator.validate_file(plan_file)
        validator.print_results(plan_file)
        
        if is_valid:
            total_valid += 1
        
        print("")
    
    # Print summary
    print(f"{Colors.BLUE}{'='*80}{Colors.NC}")
    if total_valid == total_files:
        print(f"{Colors.GREEN}All {total_files} plan(s) are valid{Colors.NC}")
        sys.exit(0)
    else:
        print(f"{Colors.RED}{total_files - total_valid} of {total_files} plan(s) have errors{Colors.NC}")
        print(f"{Colors.GREEN}{total_valid} plan(s) are valid{Colors.NC}")
        sys.exit(1)


if __name__ == '__main__':
    main()