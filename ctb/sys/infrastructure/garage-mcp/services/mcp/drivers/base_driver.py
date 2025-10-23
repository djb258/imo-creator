"""
Base driver interface for all database drivers
Provides common interface for Firebase, BigQuery, Neon, etc.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List, Union
from enum import Enum
import httpx
import os


class DatabaseType(Enum):
    """Supported database types"""
    FIREBASE = "firebase"
    BIGQUERY = "bigquery"
    NEON = "neon"
    POSTGRES_LOCAL = "postgres_local"
    SUPABASE = "supabase"


class QueryType(Enum):
    """Types of database queries"""
    SELECT = "select"
    INSERT = "insert"
    UPDATE = "update"
    DELETE = "delete"
    CREATE_TABLE = "create_table"
    DROP_TABLE = "drop_table"
    AGGREGATE = "aggregate"


class BaseDriver(ABC):
    """Base interface for all database drivers"""
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.client: Optional[httpx.AsyncClient] = None
        self.connection_string: Optional[str] = None
        self._validate_environment()
    
    @property
    @abstractmethod
    def driver_type(self) -> DatabaseType:
        """Return the database type this driver handles"""
        pass
    
    @property
    @abstractmethod
    def required_env_vars(self) -> List[str]:
        """Return list of required environment variables"""
        pass
    
    def _validate_environment(self):
        """Validate required environment variables"""
        missing = [var for var in self.required_env_vars if not os.getenv(var)]
        if missing:
            raise ValueError(f"Missing required environment variables for {self.driver_type.value}: {', '.join(missing)}")
    
    @abstractmethod
    async def connect(self) -> bool:
        """Establish connection to the database"""
        pass
    
    @abstractmethod
    async def disconnect(self) -> bool:
        """Close connection to the database"""
        pass
    
    @abstractmethod
    async def health_check(self) -> Dict[str, Any]:
        """Check database health and connectivity"""
        pass
    
    # CRUD Operations
    @abstractmethod
    async def query(self, query: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Execute a raw query"""
        pass
    
    @abstractmethod
    async def select(self, table: str, filters: Optional[Dict[str, Any]] = None, 
                    limit: Optional[int] = None, offset: Optional[int] = None) -> Dict[str, Any]:
        """Select data from table"""
        pass
    
    @abstractmethod
    async def insert(self, table: str, data: Union[Dict[str, Any], List[Dict[str, Any]]]) -> Dict[str, Any]:
        """Insert data into table"""
        pass
    
    @abstractmethod
    async def update(self, table: str, data: Dict[str, Any], 
                    filters: Dict[str, Any]) -> Dict[str, Any]:
        """Update data in table"""
        pass
    
    @abstractmethod
    async def delete(self, table: str, filters: Dict[str, Any]) -> Dict[str, Any]:
        """Delete data from table"""
        pass
    
    # Schema Operations
    @abstractmethod
    async def list_tables(self) -> List[str]:
        """List all tables in the database"""
        pass
    
    @abstractmethod
    async def get_schema(self, table: str) -> Dict[str, Any]:
        """Get schema information for a table"""
        pass
    
    @abstractmethod
    async def create_table(self, table: str, schema: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new table"""
        pass
    
    @abstractmethod
    async def drop_table(self, table: str, if_exists: bool = True) -> Dict[str, Any]:
        """Drop a table"""
        pass
    
    # Management Operations
    @abstractmethod
    async def backup(self, backup_name: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        """Create a backup"""
        pass
    
    @abstractmethod
    async def restore(self, backup_id: str, **kwargs) -> Dict[str, Any]:
        """Restore from backup"""
        pass
    
    @abstractmethod
    async def migrate(self, target_version: Optional[str] = None, 
                     dry_run: bool = False) -> Dict[str, Any]:
        """Run database migrations"""
        pass
    
    # Analytics Operations (especially for BigQuery)
    async def aggregate(self, table: str, aggregations: Dict[str, str], 
                       filters: Optional[Dict[str, Any]] = None,
                       group_by: Optional[List[str]] = None) -> Dict[str, Any]:
        """Perform aggregation queries - default implementation"""
        return {
            "driver": self.driver_type.value,
            "error": "Aggregation not implemented for this driver",
            "supported": False
        }
    
    # Real-time Operations (especially for Firebase)
    async def stream_data(self, table: str, filters: Optional[Dict[str, Any]] = None,
                         callback: Optional[callable] = None) -> Dict[str, Any]:
        """Stream real-time data - default implementation"""
        return {
            "driver": self.driver_type.value,
            "error": "Streaming not implemented for this driver",
            "supported": False
        }
    
    # Utility Methods
    def get_connection_info(self) -> Dict[str, Any]:
        """Get connection information (without sensitive data)"""
        return {
            "driver_type": self.driver_type.value,
            "connected": self.client is not None,
            "config_keys": list(self.config.keys()),
            "required_env_vars": self.required_env_vars
        }
    
    async def test_connection(self) -> Dict[str, Any]:
        """Test database connection"""
        try:
            if not self.client:
                await self.connect()
            
            health = await self.health_check()
            return {
                "driver": self.driver_type.value,
                "status": "connected",
                "health": health,
                "success": True
            }
        except Exception as e:
            return {
                "driver": self.driver_type.value,
                "status": "failed",
                "error": str(e),
                "success": False
            }


class DatabaseDriverFactory:
    """Factory for creating database drivers"""
    
    _drivers = {}
    
    @classmethod
    def register_driver(cls, driver_type: DatabaseType, driver_class):
        """Register a driver class"""
        cls._drivers[driver_type] = driver_class
    
    @classmethod
    def create_driver(cls, driver_type: DatabaseType, config: Optional[Dict[str, Any]] = None) -> BaseDriver:
        """Create a driver instance"""
        if driver_type not in cls._drivers:
            raise ValueError(f"Driver {driver_type.value} not registered")
        
        driver_class = cls._drivers[driver_type]
        return driver_class(config)
    
    @classmethod
    def list_available_drivers(cls) -> List[str]:
        """List all registered drivers"""
        return [driver_type.value for driver_type in cls._drivers.keys()]