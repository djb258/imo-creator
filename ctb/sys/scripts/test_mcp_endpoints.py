#!/usr/bin/env python3
"""
MCP Endpoints Testing Script
===========================

Post-deployment testing to verify MCP endpoints are accessible and functional.
Tests Composio API integration and validates tool execution capabilities.
"""

import json
import sys
import requests
import time
from pathlib import Path
from typing import Dict, List, Optional, Tuple


class MCPEndpointTester:
    """Tests MCP endpoint functionality after deployment."""

    def __init__(self, config_dir: str = "config"):
        self.config_dir = Path(config_dir)
        self.passed = 0
        self.failed = 0
        self.results = []

    def run_all_tests(self) -> bool:
        """Run comprehensive endpoint testing."""
        print("🧪 Testing MCP Endpoints...")

        # Load configuration
        config = self.load_config()
        if not config:
            return False

        # Run test suites
        self.test_basic_connectivity(config)
        self.test_composio_api_access(config)
        self.test_authentication(config)
        self.test_tool_discovery(config)

        # Report results
        self.print_results()

        return self.failed == 0

    def load_config(self) -> Optional[Dict]:
        """Load MCP endpoints configuration."""
        endpoints_file = self.config_dir / "mcp_endpoints.json"

        if not endpoints_file.exists():
            print("❌ mcp_endpoints.json not found")
            return None

        try:
            with open(endpoints_file) as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON in mcp_endpoints.json: {e}")
            return None

    def test_basic_connectivity(self, config: Dict) -> None:
        """Test basic HTTP connectivity to all endpoints."""
        print("\n📡 Testing Basic Connectivity...")

        servers = config.get("mcp_servers", [])
        for server in servers:
            name = server.get("name", "unknown")
            url = server.get("url")
            health_check = server.get("health_check")

            if health_check:
                self.test_endpoint(
                    f"Health Check - {name}",
                    health_check,
                    method="GET",
                    expected_status=200
                )
            elif url:
                self.test_endpoint(
                    f"Basic Connection - {name}",
                    url,
                    method="GET",
                    expected_status=[200, 404, 405]  # 405 Method Not Allowed is OK
                )

    def test_composio_api_access(self, config: Dict) -> None:
        """Test Composio-specific API endpoints."""
        print("\n🔧 Testing Composio API Access...")

        composio_servers = [
            server for server in config.get("mcp_servers", [])
            if "composio" in server.get("name", "").lower()
        ]

        for server in composio_servers:
            name = server.get("name")
            base_url = server.get("url")
            auth = server.get("auth", {})

            if not base_url:
                continue

            # Test tools endpoint
            tools_url = f"{base_url.rstrip('/')}/tools"
            headers = self.build_headers(auth)

            self.test_endpoint(
                f"Composio Tools - {name}",
                tools_url,
                method="GET",
                headers=headers,
                expected_status=200
            )

            # Test apps endpoint
            apps_url = f"{base_url.rstrip('/')}/apps"
            self.test_endpoint(
                f"Composio Apps - {name}",
                apps_url,
                method="GET",
                headers=headers,
                expected_status=200
            )

    def test_authentication(self, config: Dict) -> None:
        """Test authentication mechanisms."""
        print("\n🔐 Testing Authentication...")

        for server in config.get("mcp_servers", []):
            name = server.get("name")
            url = server.get("url")
            auth = server.get("auth", {})

            if not auth:
                self.log_result(f"Auth Check - {name}", False, "No auth configuration")
                continue

            # Test with valid auth
            headers = self.build_headers(auth)
            if headers:
                self.test_endpoint(
                    f"Valid Auth - {name}",
                    url,
                    headers=headers,
                    expected_status=[200, 404, 405]
                )

                # Test without auth (should fail)
                self.test_endpoint(
                    f"No Auth - {name}",
                    url,
                    expected_status=[401, 403],
                    expect_failure=True
                )

    def test_tool_discovery(self, config: Dict) -> None:
        """Test tool discovery and basic functionality."""
        print("\n🛠️  Testing Tool Discovery...")

        for server in config.get("mcp_servers", []):
            if "composio" not in server.get("name", "").lower():
                continue

            name = server.get("name")
            base_url = server.get("url")
            auth = server.get("auth", {})

            if not base_url:
                continue

            headers = self.build_headers(auth)
            tools_url = f"{base_url.rstrip('/')}/tools"

            # Test getting available tools
            try:
                response = requests.get(tools_url, headers=headers, timeout=10)
                if response.status_code == 200:
                    try:
                        tools_data = response.json()
                        tool_count = len(tools_data) if isinstance(tools_data, list) else len(tools_data.get("tools", []))
                        self.log_result(
                            f"Tool Discovery - {name}",
                            True,
                            f"Found {tool_count} tools"
                        )
                    except json.JSONDecodeError:
                        self.log_result(
                            f"Tool Discovery - {name}",
                            False,
                            "Invalid JSON response"
                        )
                else:
                    self.log_result(
                        f"Tool Discovery - {name}",
                        False,
                        f"HTTP {response.status_code}"
                    )
            except requests.RequestException as e:
                self.log_result(f"Tool Discovery - {name}", False, str(e))

    def test_endpoint(
        self,
        test_name: str,
        url: str,
        method: str = "GET",
        headers: Optional[Dict] = None,
        data: Optional[Dict] = None,
        expected_status: int | List[int] = 200,
        expect_failure: bool = False,
        timeout: int = 10
    ) -> None:
        """Test a specific endpoint."""
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method.upper() == "POST":
                response = requests.post(url, headers=headers, json=data, timeout=timeout)
            else:
                self.log_result(test_name, False, f"Unsupported method: {method}")
                return

            # Check status code
            if isinstance(expected_status, list):
                status_ok = response.status_code in expected_status
            else:
                status_ok = response.status_code == expected_status

            if expect_failure:
                # For tests that should fail, we expect non-2xx status
                success = response.status_code >= 400
                message = f"HTTP {response.status_code} (expected failure)"
            else:
                success = status_ok
                message = f"HTTP {response.status_code}"

            self.log_result(test_name, success, message)

        except requests.RequestException as e:
            success = expect_failure  # Exceptions might be expected for some tests
            message = f"Connection error: {str(e)[:100]}"
            self.log_result(test_name, success, message)

    def build_headers(self, auth: Dict) -> Dict[str, str]:
        """Build HTTP headers from auth configuration."""
        headers = {"Content-Type": "application/json"}

        if not auth:
            return headers

        auth_type = auth.get("type", "")

        if auth_type == "bearer":
            token = auth.get("token")
            header_name = auth.get("header_name", "Authorization")
            format_template = auth.get("format", "Bearer {token}")

            if token:
                headers[header_name] = format_template.format(token=token)

        elif auth_type == "api_key":
            token = auth.get("token")
            header_name = auth.get("header_name", "X-API-Key")

            if token:
                headers[header_name] = token

        return headers

    def log_result(self, test_name: str, success: bool, message: str) -> None:
        """Log a test result."""
        status = "✅" if success else "❌"
        print(f"  {status} {test_name}: {message}")

        self.results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": time.time()
        })

        if success:
            self.passed += 1
        else:
            self.failed += 1

    def print_results(self) -> None:
        """Print final test results summary."""
        total = self.passed + self.failed
        success_rate = (self.passed / total * 100) if total > 0 else 0

        print(f"\n📊 Test Results Summary:")
        print(f"  ✅ Passed: {self.passed}")
        print(f"  ❌ Failed: {self.failed}")
        print(f"  📈 Success Rate: {success_rate:.1f}%")

        if self.failed > 0:
            print(f"\n⚠️  {self.failed} tests failed. Check configuration and connectivity.")
        else:
            print(f"\n🎉 All tests passed! MCP endpoints are ready for production.")

    def save_results(self, output_file: str = "test_results.json") -> None:
        """Save test results to file."""
        results_data = {
            "summary": {
                "passed": self.passed,
                "failed": self.failed,
                "total": self.passed + self.failed,
                "success_rate": (self.passed / (self.passed + self.failed) * 100) if (self.passed + self.failed) > 0 else 0,
                "timestamp": time.time()
            },
            "tests": self.results
        }

        with open(output_file, "w") as f:
            json.dump(results_data, f, indent=2)

        print(f"\n💾 Results saved to {output_file}")


def main():
    """Main testing function."""
    tester = MCPEndpointTester()

    # Run all tests
    success = tester.run_all_tests()

    # Save results
    tester.save_results()

    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()