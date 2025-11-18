"""
Load DuckDB Module
Download workbench.duckdb from Backblaze B2 storage.
"""

import os
import duckdb
from .b2_client import get_b2_client


def load_workbench(local_path=None):
    """
    Download workbench.duckdb from Backblaze B2 and open a connection.

    Args:
        local_path (str): Local path to save the DuckDB file.
                         Defaults to system temp directory

    Returns:
        tuple: (db_connection, local_path)
    """
    # Use system temp directory if not specified
    if local_path is None:
        import tempfile
        import sys
        if sys.platform == 'win32':
            temp_dir = tempfile.gettempdir()
            local_path = os.path.join(temp_dir, 'workbench.duckdb')
        else:
            local_path = '/tmp/workbench.duckdb'

    # Ensure the directory exists
    os.makedirs(os.path.dirname(local_path), exist_ok=True)

    # Get B2 client
    b2_client = get_b2_client()

    # Download the DuckDB file from B2
    try:
        b2_client.download_file('workbench.duckdb', local_path)
        print(f"Downloaded workbench.duckdb to {local_path}")
    except FileNotFoundError:
        print(f"Warning: workbench.duckdb not found in B2 bucket")
        print(f"Creating new DuckDB file at {local_path}")
    except Exception as e:
        print(f"Warning: Could not download workbench.duckdb: {e}")
        print(f"Creating new DuckDB file at {local_path}")

    # Open DuckDB connection
    db_connection = duckdb.connect(local_path)

    return db_connection, local_path
