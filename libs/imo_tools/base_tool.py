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
