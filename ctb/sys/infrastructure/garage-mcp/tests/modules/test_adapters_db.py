import pytest
import os
import tempfile
from unittest.mock import patch, AsyncMock
from pathlib import Path
import sys

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from services.mcp.adapters.db_adapter import DatabaseAdapter
from tests.fakes.fake_db_driver import FakeDbDriver


class TestDatabaseAdapter:
    """Test database adapter with fake drivers"""
    
    @pytest.fixture
    def fake_driver_config(self):
        """Create fake driver configuration"""
        config_content = """
[database]
driver = "fake_db"

[database.drivers.fake_db]
description = "Fake database driver for testing"
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
        
        monkeypatch.setattr(DatabaseAdapter, "_load_config", mock_load_config)
    
    def test_driver_selection_from_config(self, mock_config_path):
        """Test driver selection from configuration"""
        with patch('services.mcp.adapters.db_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_module.FakeDbDriver = FakeDbDriver
            mock_import.return_value = fake_module
            
            adapter = DatabaseAdapter()
            assert adapter.driver_name == "fake_db"
            assert adapter.driver is not None
    
    def test_driver_selection_from_env(self, mock_config_path):
        """Test driver selection from environment variable"""
        with patch.dict(os.environ, {'DB_DRIVER': 'fake_db'}):
            with patch('services.mcp.adapters.db_adapter.importlib.import_module') as mock_import:
                fake_module = type('Module', (), {})
                fake_module.FakeDbDriver = FakeDbDriver
                mock_import.return_value = fake_module
                
                adapter = DatabaseAdapter()
                assert adapter.driver_name == "fake_db"
    
    @pytest.mark.asyncio
    async def test_migrate_success(self, mock_config_path):
        """Test successful migration"""
        with patch('services.mcp.adapters.db_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_driver = FakeDbDriver()
            fake_module.FakeDbDriver = lambda: fake_driver
            mock_import.return_value = fake_module
            
            # Mock sidecar client
            with patch('services.mcp.adapters.db_adapter.SidecarClient') as mock_sidecar:
                mock_sidecar_instance = AsyncMock()
                mock_sidecar.return_value = mock_sidecar_instance
                
                adapter = DatabaseAdapter()
                result = await adapter.migrate(target_version="1.1.0", dry_run=True)
                
                assert result["driver"] == "fake_db"
                assert result["target_version"] == "1.1.0"
                assert result["dry_run"] == True
                assert result["success"] == True
                
                # Verify sidecar logging was called
                mock_sidecar_instance.log_adapter_event.assert_called_once()
                call_args = mock_sidecar_instance.log_adapter_event.call_args
                assert call_args[1]["adapter_type"] == "database"
                assert call_args[1]["method"] == "migrate"
                assert call_args[1]["driver"] == "fake_db"
    
    @pytest.mark.asyncio
    async def test_migrate_error(self, mock_config_path):
        """Test migration error handling"""
        with patch('services.mcp.adapters.db_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_driver = FakeDbDriver()
            
            # Make migrate method raise an exception
            async def failing_migrate(*args, **kwargs):
                raise Exception("Migration failed")
            fake_driver.migrate = failing_migrate
            
            fake_module.FakeDbDriver = lambda: fake_driver
            mock_import.return_value = fake_module
            
            # Mock sidecar client
            with patch('services.mcp.adapters.db_adapter.SidecarClient') as mock_sidecar:
                mock_sidecar_instance = AsyncMock()
                mock_sidecar.return_value = mock_sidecar_instance
                
                adapter = DatabaseAdapter()
                
                with pytest.raises(RuntimeError, match="Migration failed with fake_db driver"):
                    await adapter.migrate()
                
                # Verify error was logged to sidecar
                mock_sidecar_instance.log_adapter_event.assert_called_once()
                call_args = mock_sidecar_instance.log_adapter_event.call_args
                assert call_args[1]["error"] == "Migration failed"
    
    @pytest.mark.asyncio
    async def test_backup_and_restore(self, mock_config_path):
        """Test backup and restore operations"""
        with patch('services.mcp.adapters.db_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_driver = FakeDbDriver()
            fake_module.FakeDbDriver = lambda: fake_driver
            mock_import.return_value = fake_module
            
            # Mock sidecar client
            with patch('services.mcp.adapters.db_adapter.SidecarClient') as mock_sidecar:
                mock_sidecar_instance = AsyncMock()
                mock_sidecar.return_value = mock_sidecar_instance
                
                adapter = DatabaseAdapter()
                
                # Test backup
                backup_result = await adapter.backup("test_backup", compress=True)
                assert backup_result["driver"] == "fake_db"
                assert backup_result["backup_id"] == "test_backup"
                
                # Test restore
                restore_result = await adapter.restore("test_backup")
                assert restore_result["driver"] == "fake_db"
                assert restore_result["restored"] == True
                
                # Check that both operations were logged
                assert mock_sidecar_instance.log_adapter_event.call_count == 2
    
    def test_secret_redaction(self, mock_config_path):
        """Test that secrets are properly redacted"""
        with patch('services.mcp.adapters.db_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_module.FakeDbDriver = FakeDbDriver
            mock_import.return_value = fake_module
            
            adapter = DatabaseAdapter()
            
            test_data = {
                "username": "user",
                "password": "secret123",
                "api_key": "key_abc123",
                "database_url": "postgres://user:pass@host/db",
                "normal_field": "normal_value"
            }
            
            redacted = adapter._redact_secrets(test_data)
            
            assert redacted["username"] == "user"
            assert redacted["password"] == "***REDACTED***"
            assert redacted["api_key"] == "***REDACTED***"
            assert redacted["normal_field"] == "normal_value"
    
    def test_get_driver_info(self, mock_config_path):
        """Test driver information retrieval"""
        with patch('services.mcp.adapters.db_adapter.importlib.import_module') as mock_import:
            fake_module = type('Module', (), {})
            fake_module.FakeDbDriver = FakeDbDriver
            mock_import.return_value = fake_module
            
            adapter = DatabaseAdapter()
            info = adapter.get_driver_info()
            
            assert info["driver_name"] == "fake_db"
            assert info["driver_class"] == "FakeDbDriver"
            assert "migrate" in info["available_methods"]
            assert "backup" in info["available_methods"]