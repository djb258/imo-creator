"""
Database Utilities - Direct PostgreSQL Connection
Following Barton Doctrine compliance standards
"""

import os
import asyncio
from typing import Dict, Any, List, Optional
import asyncpg
from datetime import datetime


class DatabaseClient:
    """Direct PostgreSQL client for Neon database operations"""

    def __init__(self, connection_string: Optional[str] = None):
        self.connection_string = connection_string or os.getenv("DATABASE_URL") or os.getenv("NEON_DATABASE_URL")
        if not self.connection_string:
            raise ValueError("DATABASE_URL or NEON_DATABASE_URL environment variable must be set")

    async def get_connection(self):
        """Create and return a database connection"""
        return await asyncpg.connect(self.connection_string)

    async def execute_query(self, sql: str, params: Optional[List] = None) -> List[Dict[str, Any]]:
        """
        Execute a SELECT query and return results

        Args:
            sql: SQL query string
            params: Optional list of parameters for the query

        Returns:
            List of dictionaries containing query results
        """
        conn = await self.get_connection()
        try:
            if params:
                rows = await conn.fetch(sql, *params)
            else:
                rows = await conn.fetch(sql)

            # Convert asyncpg.Record objects to dictionaries
            return [dict(row) for row in rows]
        finally:
            await conn.close()

    async def execute_command(self, sql: str, params: Optional[List] = None) -> str:
        """
        Execute a command (INSERT, UPDATE, DELETE, CREATE, etc.)

        Args:
            sql: SQL command string
            params: Optional list of parameters for the command

        Returns:
            Status message
        """
        conn = await self.get_connection()
        try:
            if params:
                result = await conn.execute(sql, *params)
            else:
                result = await conn.execute(sql)
            return result
        finally:
            await conn.close()

    async def get_schema(self) -> Dict[str, Any]:
        """
        Get database schema information

        Returns:
            Dictionary containing schema information
        """
        query = """
        SELECT
            table_schema,
            table_name,
            column_name,
            data_type,
            is_nullable,
            column_default
        FROM information_schema.columns
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY table_schema, table_name, ordinal_position
        """

        rows = await self.execute_query(query)

        # Organize by schema and table
        schema = {}
        for row in rows:
            schema_name = row['table_schema']
            table_name = row['table_name']

            if schema_name not in schema:
                schema[schema_name] = {}
            if table_name not in schema[schema_name]:
                schema[schema_name][table_name] = {'columns': []}

            schema[schema_name][table_name]['columns'].append({
                'name': row['column_name'],
                'type': row['data_type'],
                'nullable': row['is_nullable'] == 'YES',
                'default': row['column_default']
            })

        return schema

    async def create_table(self, table_name: str, columns: List[Dict[str, str]]) -> str:
        """
        Create a new table

        Args:
            table_name: Name of the table to create
            columns: List of column definitions
                Example: [{'name': 'id', 'type': 'SERIAL PRIMARY KEY'},
                         {'name': 'email', 'type': 'VARCHAR(255) NOT NULL'}]

        Returns:
            Status message
        """
        column_defs = [f"{col['name']} {col['type']}" for col in columns]
        sql = f"CREATE TABLE IF NOT EXISTS {table_name} ({', '.join(column_defs)})"

        return await self.execute_command(sql)

    async def test_connection(self) -> Dict[str, Any]:
        """
        Test database connection and return connection info

        Returns:
            Dictionary with connection status and database info
        """
        conn = await self.get_connection()
        try:
            version = await conn.fetchval('SELECT version()')
            db_name = await conn.fetchval('SELECT current_database()')

            return {
                'connected': True,
                'database': db_name,
                'version': version,
                'timestamp': datetime.utcnow().isoformat()
            }
        except Exception as e:
            return {
                'connected': False,
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
        finally:
            await conn.close()


# Singleton instance for reuse
_db_client = None

def get_db_client() -> DatabaseClient:
    """Get or create the database client singleton"""
    global _db_client
    if _db_client is None:
        _db_client = DatabaseClient()
    return _db_client
