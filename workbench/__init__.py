"""
Workbench Module
Backblaze B2 + DuckDB integration for enrichment, diffing, and validator deltas.
"""

from .b2_client import get_b2_client
from .load_duckdb import load_workbench
from .save_duckdb import save_workbench

# Optional imports - only import if dependencies are available
try:
    from .neon_pull import pull_table
    __all__ = [
        'get_b2_client',
        'load_workbench',
        'save_workbench',
        'pull_table'
    ]
except ImportError:
    __all__ = [
        'get_b2_client',
        'load_workbench',
        'save_workbench'
    ]
