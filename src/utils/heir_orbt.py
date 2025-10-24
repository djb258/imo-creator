"""
HEIR/ORBT Payload Format Utilities
Following Barton Doctrine compliance standards
"""

from datetime import datetime
from typing import Dict, Any, Optional
import time


def generate_heir_id(system: str, mode: str, version: int = 1) -> str:
    """
    Generate HEIR ID following the standard format

    Format: HEIR-YYYY-MM-SYSTEM-MODE-VN
    Example: HEIR-2025-10-IMO-CREATOR-01

    Args:
        system: System name (e.g., "IMO", "OUTREACH", "ACTION")
        mode: Mode or operation type (e.g., "CREATOR", "PIPELINE", "VERIFY")
        version: Version number (default: 1)

    Returns:
        HEIR ID string
    """
    now = datetime.utcnow()
    year = now.year
    month = now.month

    heir_id = f"HEIR-{year}-{month:02d}-{system.upper()}-{mode.upper()}-{version:02d}"

    return heir_id


def generate_process_id(system: str) -> str:
    """
    Generate Process ID following the standard format

    Format: PRC-SYSTEM-EPOCHTIMESTAMP
    Example: PRC-IMO-1729700000000

    Args:
        system: System name (e.g., "IMO", "OUTREACH", "ACTION")

    Returns:
        Process ID string
    """
    timestamp = int(time.time() * 1000)  # Epoch timestamp in milliseconds
    process_id = f"PRC-{system.upper()}-{timestamp}"

    return process_id


def create_heir_orbt_payload(
    tool: str,
    data: Dict[str, Any],
    system: str,
    mode: str,
    orbt_layer: int = 2,
    blueprint_version: str = "1.0",
    version: int = 1
) -> Dict[str, Any]:
    """
    Create a complete HEIR/ORBT compliant payload

    Args:
        tool: Tool name (e.g., "apify_run_actor", "gmail_send")
        data: Tool-specific data payload
        system: System name for HEIR ID (e.g., "IMO", "OUTREACH")
        mode: Mode for HEIR ID (e.g., "CREATOR", "VERIFY")
        orbt_layer: ORBT execution layer (1-4, default: 2)
        blueprint_version: Blueprint version (default: "1.0")
        version: HEIR version number (default: 1)

    Returns:
        Complete HEIR/ORBT payload dictionary
    """
    return {
        "tool": tool,
        "data": data,
        "unique_id": generate_heir_id(system, mode, version),
        "process_id": generate_process_id(system),
        "orbt_layer": orbt_layer,
        "blueprint_version": blueprint_version
    }


def validate_heir_orbt_payload(payload: Dict[str, Any]) -> tuple[bool, Optional[str]]:
    """
    Validate a payload against HEIR/ORBT standards

    Args:
        payload: Payload dictionary to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    required_fields = ["tool", "data", "unique_id", "process_id", "orbt_layer", "blueprint_version"]

    # Check all required fields are present
    for field in required_fields:
        if field not in payload:
            return False, f"Missing required field: {field}"

    # Validate unique_id format (HEIR-YYYY-MM-SYSTEM-MODE-VN)
    unique_id = payload["unique_id"]
    if not unique_id.startswith("HEIR-"):
        return False, "unique_id must start with 'HEIR-'"

    parts = unique_id.split("-")
    if len(parts) != 6:
        return False, "unique_id must follow format: HEIR-YYYY-MM-SYSTEM-MODE-VN"

    # Validate process_id format (PRC-SYSTEM-TIMESTAMP)
    process_id = payload["process_id"]
    if not process_id.startswith("PRC-"):
        return False, "process_id must start with 'PRC-'"

    proc_parts = process_id.split("-")
    if len(proc_parts) != 3:
        return False, "process_id must follow format: PRC-SYSTEM-TIMESTAMP"

    # Validate orbt_layer is between 1 and 4
    orbt_layer = payload["orbt_layer"]
    if not isinstance(orbt_layer, int) or orbt_layer < 1 or orbt_layer > 4:
        return False, "orbt_layer must be an integer between 1 and 4"

    # Validate data is a dictionary
    if not isinstance(payload["data"], dict):
        return False, "data must be a dictionary"

    return True, None


class HEIRORBTMiddleware:
    """
    Middleware for automatic HEIR/ORBT payload creation and validation
    """

    def __init__(self, system: str, default_mode: str = "API"):
        self.system = system
        self.default_mode = default_mode

    def wrap_payload(
        self,
        tool: str,
        data: Dict[str, Any],
        mode: Optional[str] = None,
        orbt_layer: int = 2
    ) -> Dict[str, Any]:
        """
        Wrap data in HEIR/ORBT payload

        Args:
            tool: Tool name
            data: Tool data
            mode: Mode (defaults to instance default_mode)
            orbt_layer: ORBT layer (default: 2)

        Returns:
            HEIR/ORBT compliant payload
        """
        return create_heir_orbt_payload(
            tool=tool,
            data=data,
            system=self.system,
            mode=mode or self.default_mode,
            orbt_layer=orbt_layer
        )

    def validate(self, payload: Dict[str, Any]) -> bool:
        """
        Validate payload

        Args:
            payload: Payload to validate

        Returns:
            True if valid, raises ValueError if invalid
        """
        is_valid, error = validate_heir_orbt_payload(payload)
        if not is_valid:
            raise ValueError(f"Invalid HEIR/ORBT payload: {error}")
        return True


# Example usage and testing
if __name__ == "__main__":
    # Generate HEIR ID
    heir_id = generate_heir_id("IMO", "CREATOR", 1)
    print(f"HEIR ID: {heir_id}")

    # Generate Process ID
    process_id = generate_process_id("IMO")
    print(f"Process ID: {process_id}")

    # Create complete payload
    payload = create_heir_orbt_payload(
        tool="apify_run_actor",
        data={
            "actorId": "apify~leads-finder",
            "runInput": {"search": "test"}
        },
        system="IMO",
        mode="CREATOR",
        orbt_layer=2
    )
    print(f"\nComplete Payload:\n{payload}")

    # Validate payload
    is_valid, error = validate_heir_orbt_payload(payload)
    print(f"\nPayload Valid: {is_valid}")
    if error:
        print(f"Validation Error: {error}")

    # Use middleware
    middleware = HEIRORBTMiddleware("IMO", "API")
    wrapped = middleware.wrap_payload(
        tool="gmail_send",
        data={"to": "test@example.com", "subject": "Test"}
    )
    print(f"\nMiddleware Wrapped:\n{wrapped}")

    try:
        middleware.validate(wrapped)
        print("\nMiddleware validation: PASSED")
    except ValueError as e:
        print(f"\nMiddleware validation: FAILED - {e}")
