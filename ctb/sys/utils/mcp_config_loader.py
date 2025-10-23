"""
MCP Configuration Loader
========================

Utility for loading global MCP endpoint configuration across repositories.
This allows other repos to dynamically fetch and use MCP server configurations.
"""

import json
import os
import requests
from typing import Dict, List, Optional
from datetime import datetime, timedelta


class MCPConfigLoader:
    """Loads and manages MCP server configurations from global config."""

    def __init__(self, config_url: Optional[str] = None, cache_duration: int = 3600):
        """
        Initialize MCP config loader.

        Args:
            config_url: URL to fetch config from. Defaults to GitHub raw URL.
            cache_duration: Cache duration in seconds (default: 1 hour)
        """
        self.config_url = config_url or "https://raw.githubusercontent.com/your-username/imo-creator/main/config/mcp_endpoints.json"
        self.cache_duration = cache_duration
        self.cache_file = ".mcp_config_cache.json"
        self._config = None
        self._cache_timestamp = None

    def _is_cache_valid(self) -> bool:
        """Check if cached config is still valid."""
        if not os.path.exists(self.cache_file) or not self._cache_timestamp:
            return False

        age = datetime.now() - self._cache_timestamp
        return age < timedelta(seconds=self.cache_duration)

    def _load_from_cache(self) -> Optional[Dict]:
        """Load configuration from cache file."""
        try:
            if os.path.exists(self.cache_file):
                with open(self.cache_file, 'r') as f:
                    cache_data = json.load(f)
                    self._cache_timestamp = datetime.fromisoformat(cache_data.get('timestamp', ''))
                    return cache_data.get('config')
        except Exception as e:
            print(f"Cache load error: {e}")
        return None

    def _save_to_cache(self, config: Dict) -> None:
        """Save configuration to cache file."""
        try:
            cache_data = {
                'timestamp': datetime.now().isoformat(),
                'config': config
            }
            with open(self.cache_file, 'w') as f:
                json.dump(cache_data, f, indent=2)
        except Exception as e:
            print(f"Cache save error: {e}")

    def _fetch_remote_config(self) -> Optional[Dict]:
        """Fetch configuration from remote URL."""
        try:
            response = requests.get(self.config_url, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Remote fetch error: {e}")
            return None

    def load_config(self, force_refresh: bool = False) -> Dict:
        """
        Load MCP configuration with caching.

        Args:
            force_refresh: Force refresh from remote even if cache is valid

        Returns:
            Dictionary containing MCP configuration
        """
        # Try cache first unless forced refresh
        if not force_refresh and self._is_cache_valid():
            if self._config is None:
                self._config = self._load_from_cache()
            if self._config:
                return self._config

        # Fetch from remote
        config = self._fetch_remote_config()
        if config:
            self._config = config
            self._cache_timestamp = datetime.now()
            self._save_to_cache(config)
            return config

        # Fallback to cache if remote fails
        cached_config = self._load_from_cache()
        if cached_config:
            print("Using cached config (remote fetch failed)")
            return cached_config

        # Default empty config
        return {
            "metadata": {"version": "1.0", "base_url": "https://mcpo-jte8.onrender.com"},
            "mcp_servers": []
        }

    def get_server_config(self, server_name: str) -> Optional[Dict]:
        """Get configuration for a specific MCP server."""
        config = self.load_config()
        servers = config.get('mcp_servers', [])

        for server in servers:
            if server.get('name') == server_name:
                return server
        return None

    def get_all_servers(self) -> List[Dict]:
        """Get all available MCP servers."""
        config = self.load_config()
        return config.get('mcp_servers', [])

    def get_server_url(self, server_name: str) -> Optional[str]:
        """Get the URL for a specific MCP server."""
        server = self.get_server_config(server_name)
        return server.get('url') if server else None

    def get_auth_config(self, server_name: str) -> Optional[Dict]:
        """Get authentication configuration for a server."""
        server = self.get_server_config(server_name)
        return server.get('auth') if server else None

    def build_headers(self, server_name: str) -> Dict[str, str]:
        """Build HTTP headers for a server request."""
        headers = {'Content-Type': 'application/json'}

        auth_config = self.get_auth_config(server_name)
        if auth_config:
            env_var = auth_config.get('env_var')
            header_name = auth_config.get('header_name', 'Authorization')
            format_template = auth_config.get('format', 'Bearer {token}')

            if env_var:
                token = os.getenv(env_var)
                if token:
                    headers[header_name] = format_template.format(token=token)

        return headers

    def is_server_available(self, server_name: str) -> bool:
        """Check if a server is available via health check."""
        server = self.get_server_config(server_name)
        if not server:
            return False

        health_url = server.get('health_check')
        if not health_url:
            return True  # Assume available if no health check

        try:
            headers = self.build_headers(server_name)
            response = requests.get(health_url, headers=headers, timeout=5)
            return response.status_code == 200
        except:
            return False


# Global instance for easy imports
mcp_config = MCPConfigLoader()


# Convenience functions
def get_mcp_server_url(server_name: str) -> Optional[str]:
    """Get URL for an MCP server."""
    return mcp_config.get_server_url(server_name)


def get_mcp_headers(server_name: str) -> Dict[str, str]:
    """Get headers for MCP server requests."""
    return mcp_config.build_headers(server_name)


def call_mcp_tool(server_name: str, tool_name: str, parameters: Dict) -> Optional[Dict]:
    """
    Call an MCP tool via the proxy.

    Args:
        server_name: Name of the MCP server
        tool_name: Name of the tool to call
        parameters: Tool parameters

    Returns:
        Tool execution result or None if failed
    """
    url = get_mcp_server_url(server_name)
    if not url:
        return None

    headers = get_mcp_headers(server_name)
    endpoint = f"{url}/tools/{tool_name}"

    try:
        response = requests.post(endpoint, json=parameters, headers=headers, timeout=30)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"MCP tool call failed: {e}")
        return None


if __name__ == "__main__":
    # Example usage
    loader = MCPConfigLoader()

    # Load all configs
    config = loader.load_config()
    print(f"Loaded {len(config.get('mcp_servers', []))} MCP servers")

    # Get specific server
    neon_config = loader.get_server_config('neon-db')
    if neon_config:
        print(f"Neon DB URL: {neon_config['url']}")

    # Test server availability
    for server in loader.get_all_servers():
        name = server['name']
        available = loader.is_server_available(name)
        print(f"{name}: {'✓' if available else '✗'}")