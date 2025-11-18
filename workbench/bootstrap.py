#!/usr/bin/env python3
"""
Workbench Bootstrap Script
Validates Backblaze B2 connectivity and initializes the Workbench environment.

This script will be inherited by all child repos.
"""

import os
import sys
from pathlib import Path

# Add parent directory to sys.path to allow imports from workbench module
parent_dir = Path(__file__).parent.parent
sys.path.insert(0, str(parent_dir))

from dotenv import load_dotenv


def main():
    """
    Bootstrap the Workbench environment:
    1. Load .env variables
    2. Validate Backblaze B2 connectivity
    3. Download workbench.duckdb
    4. Open DuckDB and run SELECT 1
    5. Print "Workbench ready"
    """
    print("=" * 60)
    print("Workbench Bootstrap")
    print("=" * 60)

    # Step 1: Load .env
    print("\n[1/4] Loading environment variables...")
    load_dotenv()

    required_vars = ['B2_ENDPOINT', 'B2_KEY_ID', 'B2_APPLICATION_KEY', 'B2_BUCKET']
    missing_vars = [var for var in required_vars if not os.getenv(var)]

    if missing_vars:
        print(f"ERROR: Missing required environment variables: {', '.join(missing_vars)}")
        print("Please check your .env file and ensure all required variables are set.")
        sys.exit(1)

    print("Environment variables loaded successfully")

    # Step 2: Validate Backblaze B2 connectivity
    print("\n[2/4] Validating Backblaze B2 connectivity...")
    try:
        from workbench.b2_client import get_b2_client
        b2_client = get_b2_client()

        # Attempt to list files in the bucket
        files = b2_client.list_files(max_files=5)
        print(f"Successfully connected to Backblaze B2 bucket: {b2_client.bucket_name}")
        print(f"Bucket contains {len(files)} files (showing max 5)")

    except Exception as e:
        print(f"ERROR: Failed to connect to Backblaze B2: {e}")
        sys.exit(1)

    # Step 3: Download workbench.duckdb
    print("\n[3/4] Downloading workbench.duckdb from Backblaze B2...")
    try:
        from workbench.load_duckdb import load_workbench

        # Use system temp directory on Windows
        if sys.platform == 'win32':
            import tempfile
            temp_dir = tempfile.gettempdir()
            local_path = os.path.join(temp_dir, 'workbench.duckdb')
        else:
            local_path = '/tmp/workbench.duckdb'

        db_connection, db_path = load_workbench(local_path)
        print(f"DuckDB loaded at: {db_path}")

    except Exception as e:
        print(f"WARNING: Could not load DuckDB: {e}")
        print("Continuing anyway...")
        db_connection = None

    # Step 4: Open DuckDB and run SELECT 1
    if db_connection:
        print("\n[4/4] Testing DuckDB connection...")
        try:
            result = db_connection.execute("SELECT 1 as test").fetchall()
            print(f"DuckDB test query successful: {result}")
            db_connection.close()
        except Exception as e:
            print(f"ERROR: DuckDB test query failed: {e}")
            sys.exit(1)
    else:
        print("\n[4/4] Skipping DuckDB test (connection not established)")

    # Success!
    print("\n" + "=" * 60)
    print("Workbench ready")
    print("=" * 60)
    print("\nAll systems operational. You can now use the Workbench module.")


if __name__ == '__main__':
    main()
