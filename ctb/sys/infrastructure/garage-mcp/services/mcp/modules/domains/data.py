"""
Data domain module - Unified API endpoints for Firebase, BigQuery, Neon
Exposes database operations via MCP tools
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional, List, Union
import asyncio

from ...adapters.data_adapter import DataAdapter

router = APIRouter(prefix="/tools/data", tags=["data"])

# Global data adapter instance
data_adapter: Optional[DataAdapter] = None

async def get_data_adapter() -> DataAdapter:
    """Get or create data adapter instance"""
    global data_adapter
    if not data_adapter:
        data_adapter = DataAdapter()
        await data_adapter.initialize()
    return data_adapter

# Request/Response Models
class DatabaseQueryRequest(BaseModel):
    database: str  # firebase, bigquery, neon
    table: str
    query: Optional[str] = None
    filters: Optional[Dict[str, Any]] = None
    limit: Optional[int] = 100

class DatabaseInsertRequest(BaseModel):
    database: str
    table: str
    data: Union[Dict[str, Any], List[Dict[str, Any]]]

class DataPipelineRequest(BaseModel):
    name: str
    source: str
    target: str
    source_table: str
    target_table: str
    filters: Optional[Dict[str, Any]] = None
    transform_rules: Optional[Dict[str, Any]] = None
    limit: Optional[int] = None

class CrossDbQueryRequest(BaseModel):
    queries: Dict[str, Union[str, Dict[str, Any]]]  # db_name -> query

# Health and Status Endpoints
@router.get("/health")
async def data_health_check():
    """Check health of all database connections"""
    adapter = await get_data_adapter()
    return await adapter.health_check_all()

@router.get("/drivers")
async def list_available_drivers():
    """List all available database drivers"""
    adapter = await get_data_adapter()
    return {
        "available_drivers": adapter.enabled_drivers,
        "connected_drivers": list(adapter.drivers.keys()),
        "driver_info": {
            driver_type.value: driver.get_connection_info()
            for driver_type, driver in adapter.drivers.items()
        }
    }

# Unified Database Operations
@router.post("/query")
async def execute_database_query(request: DatabaseQueryRequest):
    """Execute query on any database using unified interface"""
    adapter = await get_data_adapter()
    
    try:
        if request.query:
            # Direct SQL/Query execution
            driver = adapter.get_driver(request.database)
            if not driver:
                raise HTTPException(status_code=400, detail=f"Database {request.database} not available")
            
            result = await driver.query(request.query)
        else:
            # Structured query using select
            result = await adapter.select_unified(
                request.database,
                request.table,
                request.filters,
                request.limit
            )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/insert")
async def insert_database_data(request: DatabaseInsertRequest):
    """Insert data into any database using unified interface"""
    adapter = await get_data_adapter()
    
    try:
        result = await adapter.insert_unified(
            request.database,
            request.table,
            request.data
        )
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tables/{database}")
async def list_database_tables(database: str):
    """List all tables in a specific database"""
    adapter = await get_data_adapter()
    driver = adapter.get_driver(database)
    
    if not driver:
        raise HTTPException(status_code=400, detail=f"Database {database} not available")
    
    try:
        tables = await driver.list_tables()
        return {
            "database": database,
            "tables": tables,
            "count": len(tables)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/schema/{database}/{table}")
async def get_table_schema(database: str, table: str):
    """Get schema information for a specific table"""
    adapter = await get_data_adapter()
    driver = adapter.get_driver(database)
    
    if not driver:
        raise HTTPException(status_code=400, detail=f"Database {database} not available")
    
    try:
        schema = await driver.get_schema(table)
        return schema
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Data Pipeline Operations
@router.post("/pipeline/create")
async def create_data_pipeline(request: DataPipelineRequest):
    """Create a data pipeline between databases"""
    adapter = await get_data_adapter()
    
    pipeline_config = {
        "name": request.name,
        "source": request.source,
        "target": request.target,
        "source_table": request.source_table,
        "target_table": request.target_table,
        "filters": request.filters,
        "transform_rules": request.transform_rules,
        "limit": request.limit
    }
    
    try:
        result = await adapter.create_data_pipeline(pipeline_config)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/pipeline/status")
async def get_pipeline_status():
    """Get status of all data pipelines"""
    adapter = await get_data_adapter()
    return await adapter.get_pipeline_status()

@router.post("/pipeline/realtime")
async def setup_realtime_pipeline(config: Dict[str, Any]):
    """Set up real-time data pipeline (Firebase -> BigQuery -> Neon)"""
    adapter = await get_data_adapter()
    
    try:
        result = await adapter.setup_realtime_pipeline(config)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Cross-Database Analytics
@router.post("/analytics/cross-query")
async def execute_cross_database_query(request: CrossDbQueryRequest):
    """Execute queries across multiple databases simultaneously"""
    adapter = await get_data_adapter()
    
    try:
        result = await adapter.cross_database_query(request.queries)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics/summary")
async def get_analytics_summary():
    """Get summary analytics across all databases"""
    adapter = await get_data_adapter()
    
    # Example cross-database analytics
    summary_queries = {
        "firebase": {
            "table": "user_events",
            "filters": {"event_type": "page_view"},
            "limit": 100
        },
        "bigquery": "SELECT COUNT(*) as total_events, DATE(timestamp) as event_date FROM garage_analytics.events_raw WHERE DATE(timestamp) = CURRENT_DATE() GROUP BY event_date",
        "neon": {
            "table": "user_dashboard_metrics",
            "limit": 50
        }
    }
    
    try:
        result = await adapter.cross_database_query(summary_queries)
        
        # Add summary statistics
        result["summary"] = {
            "total_databases_queried": len(summary_queries),
            "successful_queries": sum(1 for r in result["cross_database_results"].values() if r.get("success")),
            "data_freshness": "real-time",
            "query_timestamp": result.get("timestamp")
        }
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Database Management
@router.post("/backup/{database}")
async def create_database_backup(database: str, backup_name: Optional[str] = None):
    """Create backup of specific database"""
    adapter = await get_data_adapter()
    driver = adapter.get_driver(database)
    
    if not driver:
        raise HTTPException(status_code=400, detail=f"Database {database} not available")
    
    try:
        result = await driver.backup(backup_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/restore/{database}")
async def restore_database_backup(database: str, backup_id: str):
    """Restore database from backup"""
    adapter = await get_data_adapter()
    driver = adapter.get_driver(database)
    
    if not driver:
        raise HTTPException(status_code=400, detail=f"Database {database} not available")
    
    try:
        result = await driver.restore(backup_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Real-time Operations
@router.get("/stream/{database}/{table}")
async def setup_data_stream(database: str, table: str, filters: Optional[Dict[str, Any]] = None):
    """Set up real-time data streaming from database"""
    adapter = await get_data_adapter()
    driver = adapter.get_driver(database)
    
    if not driver:
        raise HTTPException(status_code=400, detail=f"Database {database} not available")
    
    try:
        result = await driver.stream_data(table, filters)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Development and Testing
@router.post("/test/connection")
async def test_all_connections():
    """Test all database connections"""
    adapter = await get_data_adapter()
    
    connection_tests = {}
    for driver_type, driver in adapter.drivers.items():
        try:
            test_result = await driver.test_connection()
            connection_tests[driver_type.value] = test_result
        except Exception as e:
            connection_tests[driver_type.value] = {
                "driver": driver_type.value,
                "status": "error",
                "error": str(e),
                "success": False
            }
    
    return {
        "connection_tests": connection_tests,
        "total_drivers": len(adapter.drivers),
        "successful_connections": sum(1 for test in connection_tests.values() if test.get("success")),
        "overall_status": "healthy" if all(test.get("success") for test in connection_tests.values()) else "degraded"
    }

@router.delete("/cleanup")
async def cleanup_connections():
    """Clean up all database connections"""
    adapter = await get_data_adapter()
    result = await adapter.cleanup()
    
    # Reset global adapter
    global data_adapter
    data_adapter = None
    
    return result