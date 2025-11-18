"""
Save DuckDB Module
Upload modified DuckDB file back to Backblaze B2 storage.
"""

import os
from .b2_client import get_b2_client


def save_workbench(local_path):
    """
    Upload the modified DuckDB file back to Backblaze B2.

    Args:
        local_path (str): Local path of the DuckDB file to upload

    Returns:
        bool: True if upload successful, False otherwise
    """
    if not os.path.exists(local_path):
        raise FileNotFoundError(f"DuckDB file not found at {local_path}")

    s3_client, bucket = get_b2_client()

    try:
        # Upload the DuckDB file to B2
        s3_client.upload_file(local_path, bucket, 'workbench.duckdb')
        print(f"Successfully uploaded {local_path} to Backblaze B2")
        return True
    except Exception as e:
        print(f"Error uploading to Backblaze B2: {e}")
        return False
