# # CTB Metadata
# # Generated: 2025-10-23T14:32:36.472067
# # CTB Version: 1.3.3
# # Division: System Infrastructure
# # Category: libs
# # Compliance: 100%
# # HEIR ID: HEIR-2025-10-SYS-LIBS-01

import datetime


class BaseTool:
    """Lightweight parent class for all tools in the imo_tools library."""

    def __init__(self, tool_name: str, version: str = "0.1.0"):
        self.tool_name = tool_name
        self.version = version

    def log(self, message: str):
        ts = datetime.datetime.now().isoformat()
        print(f"[{ts}] [{self.tool_name}] {message}")

    def run(self, *args, **kwargs):
        """Override in subclasses."""
        raise NotImplementedError(f"{self.tool_name} must implement run().")
