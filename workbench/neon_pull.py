"""
Neon Pull Module
Connect to Neon PostgreSQL and pull table data.
"""

import os
import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor


def pull_table(table_name):
    """
    Connect to Neon PostgreSQL and pull a table as a Pandas DataFrame.

    Args:
        table_name (str): Name of the table to pull

    Returns:
        pandas.DataFrame: DataFrame containing the table data
    """
    postgres_url = os.getenv('POSTGRES_URL')

    if not postgres_url:
        raise ValueError(
            "Missing POSTGRES_URL environment variable. "
            "Please set POSTGRES_URL to your Neon connection string."
        )

    try:
        # Connect to PostgreSQL
        conn = psycopg2.connect(postgres_url)

        # Pull table data into DataFrame
        query = f"SELECT * FROM {table_name}"
        df = pd.read_sql_query(query, conn)

        conn.close()

        print(f"Successfully pulled {len(df)} rows from table '{table_name}'")
        return df

    except Exception as e:
        print(f"Error pulling table '{table_name}' from Neon: {e}")
        raise
