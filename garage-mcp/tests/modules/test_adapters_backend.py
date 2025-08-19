import pytest
import os
import tempfile
from unittest.mock import patch, AsyncMock
from pathlib import Path
import sys

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from services.mcp.adapters.backend_adapter import BackendAdapter
from tests.fakes.fake_backend_driver import FakeBackendDriver


class TestBackendAdapter:
    """Test backend adapter with fake drivers"""
    
    @pytest.fixture
    def fake_driver_config(self):
        """Create fake driver configuration"""
        config_content = """
[backend]
driver = "fake_backend"

[backend.drivers.fake_backend]
description = "Fake backend driver for testing"
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
        
        monkeypatch.setattr(BackendAdapter, "_load_config", mock_load_config)
    
    def test_driver_selection_from_env(self, mock_config_path):
        """Test driver selection from environment variable"""
        with patch.dict(os.environ, {'BACKEND_DRIVER': 'fake_backend'}):
            with patch('services.mcp.adapters.backend_adapter.importlib.import_module') as mock_import:
                fake_module = type('Module', (), {})
                fake_module.FakeBackendDriver = FakeBackendDriver
                mock_import.return_value = fake_module
                
                adapter = BackendAdapter()
                assert adapter.driver_name == "fake_backend"
    
    @pytest.mark.asyncio
    async def test_scaffold_success(self, mock_config_path):
        """Test successful scaffolding"""
        with patch('services.mcp.adapters.backend_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_driver = FakeBackendDriver()
            fake_module.FakeBackendDriver = lambda: fake_driver
            mock_import.return_value = fake_module
            
            adapter = BackendAdapter()
            result = await adapter.scaffold("test-service", framework="django", database="mysql")
            
            assert result["driver"] == "fake_backend"
            assert result["project_name"] == "test-service"
            assert result["framework"] == "django"
            assert result["database"] == "mysql"
            assert result["files_created"] == 15
    
    @pytest.mark.asyncio
    async def test_lint_and_test(self, mock_config_path):
        """Test linting and testing operations"""
        with patch('services.mcp.adapters.backend_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_driver = FakeBackendDriver()
            fake_module.FakeBackendDriver = lambda: fake_driver
            mock_import.return_value = fake_module
            
            adapter = BackendAdapter()
            
            # Test linting with fix
            lint_result = await adapter.lint(fix=True, config_file=".pylintrc")
            assert lint_result["driver"] == "fake_backend"
            assert lint_result["issues_found"] == 0
            assert lint_result["issues_fixed"] == 5
            assert lint_result["passed"] == True
            
            # Test running tests
            test_result = await adapter.test(test_suite="unit", coverage=True)
            assert test_result["driver"] == "fake_backend"
            assert test_result["tests_run"] == 42
            assert test_result["tests_passed"] == 40
            assert test_result["coverage_percent"] == 85.5
    
    @pytest.mark.asyncio
    async def test_container_operations(self, mock_config_path):
        """Test container build operations"""
        with patch('services.mcp.adapters.backend_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_driver = FakeBackendDriver()
            fake_module.FakeBackendDriver = lambda: fake_driver
            mock_import.return_value = fake_module
            
            adapter = BackendAdapter()
            result = await adapter.container_build("myapp:v1.0", dockerfile="Dockerfile.prod", push=True)
            
            assert result["driver"] == "fake_backend"
            assert result["tag"] == "myapp:v1.0"
            assert result["size_mb"] == 256
            assert result["pushed"] == True
            assert result["dockerfile"] == "Dockerfile.prod"
    
    @pytest.mark.asyncio
    async def test_deployment(self, mock_config_path):
        """Test deployment operations"""
        with patch('services.mcp.adapters.backend_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_driver = FakeBackendDriver()
            fake_module.FakeBackendDriver = lambda: fake_driver
            mock_import.return_value = fake_module
            
            adapter = BackendAdapter()
            result = await adapter.deploy("my-service", environment="staging", replicas=3)
            
            assert result["driver"] == "fake_backend"
            assert result["environment"] == "staging"
            assert result["replicas"] == 3
            assert result["status"] == "deployed"
            assert "fake-my-service-staging.example.com" in result["endpoint"]
    
    @pytest.mark.asyncio
    async def test_cron_scheduling(self, mock_config_path):
        """Test cron job scheduling"""
        with patch('services.mcp.adapters.backend_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_driver = FakeBackendDriver()
            fake_module.FakeBackendDriver = lambda: fake_driver
            mock_import.return_value = fake_module
            
            adapter = BackendAdapter()
            result = await adapter.cron_schedule(
                job_name="daily_cleanup",
                schedule="0 2 * * *",
                command="python cleanup.py",
                enabled=True
            )
            
            assert result["driver"] == "fake_backend"
            assert result["job_name"] == "daily_cleanup"
            assert result["schedule"] == "0 2 * * *"
            assert result["status"] == "scheduled"
            assert result["command"] == "python cleanup.py"
    
    @pytest.mark.asyncio
    async def test_error_handling(self, mock_config_path):
        """Test error handling in backend operations"""
        with patch('services.mcp.adapters.backend_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_driver = FakeBackendDriver()
            
            # Make deploy method raise an exception
            async def failing_deploy(*args, **kwargs):
                raise Exception("Deployment failed")
            fake_driver.deploy = failing_deploy
            
            fake_module.FakeBackendDriver = lambda: fake_driver
            mock_import.return_value = fake_module
            
            adapter = BackendAdapter()
            
            with pytest.raises(RuntimeError, match="Deployment failed with fake_backend driver"):
                await adapter.deploy("test-service")
    
    def test_secret_redaction(self, mock_config_path):
        """Test that secrets are properly redacted"""
        with patch('services.mcp.adapters.backend_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_module.FakeBackendDriver = FakeBackendDriver
            mock_import.return_value = fake_module
            
            adapter = BackendAdapter()
            
            test_data = {
                "service_name": "my-service",
                "api_key": "key_abc123",
                "database_password": "secret_password",
                "config": {
                    "auth_token": "token_def456",
                    "public_endpoint": "https://api.example.com"
                },
                "deployment_key": "deploy_key_789"
            }
            
            redacted = adapter._redact_secrets(test_data)
            
            assert redacted["service_name"] == "my-service"
            assert redacted["api_key"] == "***REDACTED***"
            assert redacted["database_password"] == "***REDACTED***"
            assert redacted["config"]["auth_token"] == "***REDACTED***"
            assert redacted["config"]["public_endpoint"] == "https://api.example.com"
            assert redacted["deployment_key"] == "***REDACTED***"
    
    def test_get_driver_info(self, mock_config_path):
        """Test driver information retrieval"""
        with patch('services.mcp.adapters.backend_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_module.FakeBackendDriver = FakeBackendDriver
            mock_import.return_value = fake_module
            
            adapter = BackendAdapter()
            info = adapter.get_driver_info()
            
            assert info["driver_name"] == "fake_backend"
            assert info["driver_class"] == "FakeBackendDriver"
            assert "scaffold" in info["available_methods"]
            assert "deploy" in info["available_methods"]
            assert "cron_schedule" in info["available_methods"]