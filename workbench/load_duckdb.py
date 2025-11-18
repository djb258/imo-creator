"""
Load DuckDB Module
Download workbench.duckdb from Backblaze B2 storage.
"""

import os
import duckdb
from .b2_client import get_b2_client


def load_workbench(local_path='/tmp/workbench.duckdb'):
    """
    Download workbench.duckdb from Backblaze B2 and open a connection.

    Args:
        local_path (str): Local path to save the DuckDB file.
                         Defaults to '/tmp/workbench.duckdb'

    Returns:
        tuple: (db_connection, local_path)
    """
    s3_client, bucket = get_b2_client()

    # Ensure the directory exists
    os.makedirs(os.path.dirname(local_path), exist_ok=True)

    # Download the DuckDB file from B2
    try:
        s3_client.download_file(bucket, 'workbench.duckdb', local_path)
        print(f"Downloaded workbench.duckdb to {local_path}")
    except Exception as e:
        print(f"Warning: Could not download existing workbench.duckdb: {e}")
        print(f"Creating new DuckDB file at {local_path}")

    # Open DuckDB connection
    db_connection = duckdb.connect(local_path)

    return db_connection, local_path
