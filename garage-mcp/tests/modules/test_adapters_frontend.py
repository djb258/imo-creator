import pytest
import os
import tempfile
from unittest.mock import patch, AsyncMock
from pathlib import Path
import sys

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from services.mcp.adapters.frontend_adapter import FrontendAdapter
from tests.fakes.fake_frontend_driver import FakeFrontendDriver


class TestFrontendAdapter:
    """Test frontend adapter with fake drivers"""
    
    @pytest.fixture
    def fake_driver_config(self):
        """Create fake driver configuration"""
        config_content = """
[frontend]
driver = "fake_frontend"

[frontend.drivers.fake_frontend]
description = "Fake frontend driver for testing"
required_env = []
"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.toml', delete=False) as f:
            f.write(config_content)
            return f.name
    
    @pytest.fixture
    def mock_config_path(self, fake_driver_config, monkeypatch):
        """Mock the config path to use fake config"""
        def mock_load_config(self):
            import toml
            return toml.load(fake_driver_config)
        
        monkeypatch.setattr(FrontendAdapter, "_load_config", mock_load_config)
    
    def test_driver_selection_from_env(self, mock_config_path):
        """Test driver selection from environment variable"""
        with patch.dict(os.environ, {'FRONTEND_DRIVER': 'fake_frontend'}):
            with patch('services.mcp.adapters.frontend_adapter.importlib.import_module') as mock_import:
                fake_module = type('Module', (), {})
                fake_module.FakeFrontendDriver = FakeFrontendDriver
                mock_import.return_value = fake_module
                
                adapter = FrontendAdapter()
                assert adapter.driver_name == "fake_frontend"
    
    @pytest.mark.asyncio
    async def test_scaffold_success(self, mock_config_path):
        """Test successful scaffolding"""
        with patch('services.mcp.adapters.frontend_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_driver = FakeFrontendDriver()
            fake_module.FakeFrontendDriver = lambda: fake_driver
            mock_import.return_value = fake_module
            
            adapter = FrontendAdapter()
            result = await adapter.scaffold("test-app", framework="vue", template="default")
            
            assert result["driver"] == "fake_frontend"
            assert result["project_name"] == "test-app"
            assert result["framework"] == "vue"
            assert result["files_created"] == 25
    
    @pytest.mark.asyncio
    async def test_build_and_deploy(self, mock_config_path):
        """Test build and deploy operations"""
        with patch('services.mcp.adapters.frontend_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_driver = FakeFrontendDriver()
            fake_module.FakeFrontendDriver = lambda: fake_driver
            mock_import.return_value = fake_module
            
            adapter = FrontendAdapter()
            
            # Test build
            build_result = await adapter.build(environment="staging", optimize=True)
            assert build_result["driver"] == "fake_frontend"
            assert build_result["environment"] == "staging"
            assert build_result["bundle_size_kb"] == 512
            
            # Test deploy
            deploy_result = await adapter.deploy("my-app", environment="production")
            assert deploy_result["driver"] == "fake_frontend"
            assert deploy_result["environment"] == "production"
            assert deploy_result["status"] == "deployed"
    
    @pytest.mark.asyncio
    async def test_routes_sync(self, mock_config_path):
        """Test routes synchronization"""
        with patch('services.mcp.adapters.frontend_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_driver = FakeFrontendDriver()
            fake_module.FakeFrontendDriver = lambda: fake_driver
            mock_import.return_value = fake_module
            
            adapter = FrontendAdapter()
            result = await adapter.routes_sync("http://api.example.com", auto_generate=True)
            
            assert result["driver"] == "fake_frontend"
            assert result["routes_synced"] == 3
            assert "/api/users" in result["new_routes"]
            assert result["backend_url"] == "http://api.example.com"
    
    @pytest.mark.asyncio
    async def test_preview_mode(self, mock_config_path):
        """Test preview server functionality"""
        with patch('services.mcp.adapters.frontend_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_driver = FakeFrontendDriver()
            fake_module.FakeFrontendDriver = lambda: fake_driver
            mock_import.return_value = fake_module
            
            adapter = FrontendAdapter()
            result = await adapter.preview(port=4000, host="0.0.0.0")
            
            assert result["driver"] == "fake_frontend"
            assert result["preview_url"] == "http://0.0.0.0:4000"
            assert result["port"] == 4000
            assert result["status"] == "running"
    
    @pytest.mark.asyncio
    async def test_error_handling(self, mock_config_path):
        """Test error handling in frontend operations"""
        with patch('services.mcp.adapters.frontend_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_driver = FakeFrontendDriver()
            
            # Make scaffold method raise an exception
            async def failing_scaffold(*args, **kwargs):
                raise Exception("Scaffolding failed")
            fake_driver.scaffold = failing_scaffold
            
            fake_module.FakeFrontendDriver = lambda: fake_driver
            mock_import.return_value = fake_module
            
            adapter = FrontendAdapter()
            
            with pytest.raises(RuntimeError, match="Scaffolding failed with fake_frontend driver"):
                await adapter.scaffold("test-app")
    
    def test_secret_redaction(self, mock_config_path):
        """Test that secrets are properly redacted"""
        with patch('services.mcp.adapters.frontend_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_module.FakeFrontendDriver = FakeFrontendDriver
            mock_import.return_value = fake_module
            
            adapter = FrontendAdapter()
            
            test_data = {
                "project_name": "my-app",
                "deploy_token": "token_abc123",
                "api_key": "key_def456",
                "build_settings": {
                    "auth_secret": "secret_value",
                    "public_url": "https://example.com"
                }
            }
            
            redacted = adapter._redact_secrets(test_data)
            
            assert redacted["project_name"] == "my-app"
            assert redacted["deploy_token"] == "***REDACTED***"
            assert redacted["api_key"] == "***REDACTED***"
            assert redacted["build_settings"]["auth_secret"] == "***REDACTED***"
            assert redacted["build_settings"]["public_url"] == "https://example.com"
    
    def test_get_driver_info(self, mock_config_path):
        """Test driver information retrieval"""
        with patch('services.mcp.adapters.frontend_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_module.FakeFrontendDriver = FakeFrontendDriver
            mock_import.return_value = fake_module
            
            adapter = FrontendAdapter()
            info = adapter.get_driver_info()
            
            assert info["driver_name"] == "fake_frontend"
            assert info["driver_class"] == "FakeFrontendDriver"
            assert "scaffold" in info["available_methods"]
            assert "deploy" in info["available_methods"]