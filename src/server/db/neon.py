import os, pathlib
from contextlib import contextmanager
from psycopg_pool import ConnectionPool

NEON_DATABASE_URL = os.getenv("NEON_DATABASE_URL")
if not NEON_DATABASE_URL:
    raise RuntimeError("NEON_DATABASE_URL is required")

# psycopg_pool handles connection reuse; Neon recommends pooling with SSL.
pool = ConnectionPool(
    conninfo=NEON_DATABASE_URL,
    min_size=1,
    max_size=5,
    max_idle=60,
)

@contextmanager
def get_conn():
    with pool.connection() as conn:
        yield conn

def run_sql_file(path: str):
    sql_path = pathlib.Path(path)
    if not sql_path.exists():
        raise FileNotFoundError(path)
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute(sql_path.read_text())

def init_migrations():
    # Simple idempotent runner (expand as needed)
    run_sql_file("src/server/db/migrations/0001_master_error_log.sql")