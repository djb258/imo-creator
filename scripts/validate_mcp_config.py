#!/usr/bin/env python3
"""
MCP Configuration Validation Script
==================================

Pre-deployment validation to ensure MCP configurations are correct and complete.
Validates Composio endpoints, authentication tokens, and configuration structure.
"""

import json
import sys
import requests
from pathlib import Path
from typing import Dict, List, Optional


class MCPConfigValidator:
    """Validates MCP configuration files before deployment."""

    def __init__(self, config_dir: str = "config"):
        self.config_dir = Path(config_dir)
        self.errors = []
        self.warnings = []

    def validate_all(self) -> bool:
        """Validate all MCP configuration files."""
        print("[INFO] Validating MCP Configuration...")

        # Validate main config files
        self.validate_mcp_endpoints()
        self.validate_mcp_registry()
        self.validate_config_loader()

        # Report results
        if self.errors:
            print("\n[ERROR] Validation FAILED:")
            for error in self.errors:
                print(f"  - {error}")

        if self.warnings:
            print("\n[WARNING] Warnings:")
            for warning in self.warnings:
                print(f"  - {warning}")

        if not self.errors:
            print("\n[SUCCESS] All MCP configurations are valid!")
            return True

        return False

    def validate_mcp_endpoints(self) -> None:
        """Validate mcp_endpoints.json structure and content."""
        endpoints_file = self.config_dir / "mcp_endpoints.json"

        if not endpoints_file.exists():
            self.errors.append("mcp_endpoints.json not found")
            return

        try:
            with open(endpoints_file) as f:
                config = json.load(f)
        except json.JSONDecodeError as e:
            self.errors.append(f"mcp_endpoints.json is invalid JSON: {e}")
            return

        # Check required structure
        required_keys = ["metadata", "mcp_servers", "usage_instructions"]
        for key in required_keys:
            if key not in config:
                self.errors.append(f"mcp_endpoints.json missing required key: {key}")

        # Validate metadata
        if "metadata" in config:
            metadata = config["metadata"]
            if not metadata.get("base_url"):
                self.errors.append("metadata.base_url is required")

            # Check if using Composio endpoints
            base_url = metadata.get("base_url", "")
            if "api.composio.dev" not in base_url:
                self.warnings.append("Not using Composio native API endpoints")

        # Validate MCP servers
        if "mcp_servers" in config:
            servers = config["mcp_servers"]
            if not isinstance(servers, list) or len(servers) == 0:
                self.errors.append("mcp_servers must be a non-empty list")

            for i, server in enumerate(servers):
                self.validate_server_config(server, f"mcp_servers[{i}]")

        # Check for Composio token
        found_composio_token = False
        if "mcp_servers" in config:
            for server in config["mcp_servers"]:
                if "auth" in server and "token" in server["auth"]:
                    token = server["auth"]["token"]
                    if token.startswith("oak_"):
                        found_composio_token = True
                        if token != "oak_d4qEQhMSdWBgvAI3XELr":
                            self.warnings.append(f"Composio token may be outdated: {token}")

        if not found_composio_token:
            self.errors.append("No valid Composio API token found")

    def validate_server_config(self, server: Dict, context: str) -> None:
        """Validate individual server configuration."""
        required_fields = ["name", "description", "url"]
        for field in required_fields:
            if field not in server:
                self.errors.append(f"{context}: missing required field '{field}'")

        # Validate URL format
        if "url" in server:
            url = server["url"]
            if not url.startswith(("http://", "https://")):
                self.errors.append(f"{context}: invalid URL format: {url}")

        # Validate auth config
        if "auth" in server:
            auth = server["auth"]
            if "type" not in auth:
                self.errors.append(f"{context}: auth section missing 'type'")

            if auth.get("type") == "bearer" and "token" not in auth:
                self.errors.append(f"{context}: bearer auth missing 'token'")

    def validate_mcp_registry(self) -> None:
        """Validate mcp_registry.json structure."""
        registry_file = self.config_dir / "mcp_registry.json"

        if not registry_file.exists():
            self.errors.append("mcp_registry.json not found")
            return

        try:
            with open(registry_file) as f:
                config = json.load(f)
        except json.JSONDecodeError as e:
            self.errors.append(f"mcp_registry.json is invalid JSON: {e}")
            return

        # Check required structure
        required_keys = ["engine_capabilities", "production_urls"]
        for key in required_keys:
            if key not in config:
                self.errors.append(f"mcp_registry.json missing required key: {key}")

        # Validate engine capabilities
        if "engine_capabilities" in config:
            capabilities = config["engine_capabilities"]
            if not isinstance(capabilities, list):
                self.errors.append("engine_capabilities must be a list")

            # Check for Composio integration
            composio_found = False
            for capability in capabilities:
                if isinstance(capability, dict) and "tool" in capability:
                    if "Composio" in capability["tool"]:
                        composio_found = True
                        # Validate Composio-specific fields
                        if "api_key" in capability:
                            if not capability["api_key"].startswith("oak_"):
                                self.warnings.append("Composio API key format may be incorrect")

            if not composio_found:
                self.warnings.append("No Composio integration found in engine_capabilities")

    def validate_config_loader(self) -> None:
        """Validate mcp_config_loader.py exists and is importable."""
        loader_file = Path("utils") / "mcp_config_loader.py"

        if not loader_file.exists():
            self.errors.append("utils/mcp_config_loader.py not found")
            return

        # Basic syntax check
        try:
            with open(loader_file) as f:
                content = f.read()
                compile(content, str(loader_file), "exec")
        except SyntaxError as e:
            self.errors.append(f"mcp_config_loader.py has syntax errors: {e}")

        # Check for required classes/functions
        required_items = ["MCPConfigLoader", "mcp_config", "call_mcp_tool"]
        with open(loader_file) as f:
            content = f.read()
            for item in required_items:
                if item not in content:
                    self.warnings.append(f"mcp_config_loader.py missing expected item: {item}")

    def test_endpoint_connectivity(self) -> None:
        """Test actual connectivity to configured endpoints."""
        endpoints_file = self.config_dir / "mcp_endpoints.json"

        if not endpoints_file.exists():
            return

        try:
            with open(endpoints_file) as f:
                config = json.load(f)
        except:
            return

        print("\n[INFO] Testing endpoint connectivity...")

        for server in config.get("mcp_servers", []):
            name = server.get("name", "unknown")
            health_url = server.get("health_check")

            if not health_url:
                continue

            try:
                response = requests.get(health_url, timeout=5)
                if response.status_code == 200:
                    print(f"  [OK] {name}: Connected")
                else:
                    print(f"  [ERROR] {name}: HTTP {response.status_code}")
                    self.warnings.append(f"Endpoint {name} returned HTTP {response.status_code}")
            except requests.RequestException as e:
                print(f"  [ERROR] {name}: Connection failed")
                self.warnings.append(f"Cannot connect to {name}: {e}")


def main():
    """Main validation function."""
    validator = MCPConfigValidator()

    # Run validation
    is_valid = validator.validate_all()

    # Test connectivity if validation passes
    if is_valid:
        validator.test_endpoint_connectivity()

    # Exit with appropriate code
    sys.exit(0 if is_valid else 1)


if __name__ == "__main__":
    main()