# # CTB Metadata
# # Generated: 2025-10-23T14:32:41.010631
# # CTB Version: 1.3.3
# # Division: AI Agents & MCP
# # Category: orbt-utils
# # Compliance: 100%
# # HEIR ID: HEIR-2025-10-AI-ORBT-U-01

"""
HEIR/ORBT ID Generator
Version: 1.0.0
Date: 2025-10-23

Generates Barton Doctrine compliant HEIR and Process IDs
for tracking operations across the ORBT (Operational Resource Behavior Tracking) system

HEIR ID Format: HEIR-YYYY-MM-SYSTEM-MODE-VN
Process ID Format: PRC-SYSTEM-EPOCHTIMESTAMP

ORBT Layers:
- Layer 1: Input/Intake operations
- Layer 2: Processing/Middle operations
- Layer 3: Output/Generation operations
- Layer 4: Orchestration/Coordination operations
"""

import re
from datetime import datetime
from typing import Dict, Any


class HeirGenerator:
    """Generator for HEIR and Process IDs compliant with Barton Doctrine"""

    @staticmethod
    def generate_heir_id(system: str, mode: str, version: int = 1) -> str:
        """
        Generate a unique HEIR ID
        
        Args:
            system: System identifier (e.g., 'IMO', 'ACTION', 'INTAKE')
            mode: Operation mode (e.g., 'CREATOR', 'ACTION', 'VALIDATE')
            version: Version number (default: 1)
            
        Returns:
            HEIR ID in format HEIR-YYYY-MM-SYSTEM-MODE-VN
        """
        now = datetime.now()
        year = now.year
        month = f"{now.month:02d}"
        version_padded = f"{version:02d}"
        
        return f"HEIR-{year}-{month}-{system}-{mode}-{version_padded}"

    @staticmethod
    def generate_process_id(system: str) -> str:
        """
        Generate a unique Process ID
        
        Args:
            system: System identifier (e.g., 'IMO', 'ACTION', 'INTAKE')
            
        Returns:
            Process ID in format PRC-SYSTEM-EPOCHTIMESTAMP
        """
        timestamp = int(datetime.now().timestamp() * 1000)
        return f"PRC-{system}-{timestamp}"

    @staticmethod
    def generate_payload(
        tool: str,
        data: Dict[str, Any],
        system: str,
        mode: str,
        orbt_layer: int,
        blueprint_version: str = "1.0",
        version: int = 1
    ) -> Dict[str, Any]:
        """
        Generate a complete HEIR/ORBT payload
        
        Args:
            tool: Tool name (e.g., 'apify_run_actor', 'gmail_send')
            data: Tool-specific data payload
            system: System identifier
            mode: Operation mode
            orbt_layer: ORBT layer (1-4)
            blueprint_version: Blueprint version (default: '1.0')
            version: HEIR version number (default: 1)
            
        Returns:
            Complete HEIR/ORBT payload
            
        Raises:
            ValueError: If ORBT layer is not between 1 and 4
        """
        # Validate ORBT layer
        if orbt_layer < 1 or orbt_layer > 4:
            raise ValueError(f"Invalid ORBT layer: {orbt_layer}. Must be between 1 and 4.")

        return {
            "tool": tool,
            "data": data,
            "unique_id": HeirGenerator.generate_heir_id(system, mode, version),
            "process_id": HeirGenerator.generate_process_id(system),
            "orbt_layer": orbt_layer,
            "blueprint_version": blueprint_version
        }

    @staticmethod
    def parse_heir_id(heir_id: str) -> Dict[str, Any]:
        """
        Parse a HEIR ID into its components
        
        Args:
            heir_id: HEIR ID to parse
            
        Returns:
            Dictionary with parsed components
            
        Raises:
            ValueError: If HEIR ID format is invalid
        """
        pattern = r'^HEIR-(\d{4})-(\d{2})-([A-Z]+)-([A-Z]+)-(\d{2})$'
        match = re.match(pattern, heir_id)

        if not match:
            raise ValueError(f"Invalid HEIR ID format: {heir_id}")

        return {
            "year": match.group(1),
            "month": match.group(2),
            "system": match.group(3),
            "mode": match.group(4),
            "version": int(match.group(5))
        }

    @staticmethod
    def parse_process_id(process_id: str) -> Dict[str, Any]:
        """
        Parse a Process ID into its components
        
        Args:
            process_id: Process ID to parse
            
        Returns:
            Dictionary with parsed components
            
        Raises:
            ValueError: If Process ID format is invalid
        """
        pattern = r'^PRC-([A-Z]+)-(\d+)$'
        match = re.match(pattern, process_id)

        if not match:
            raise ValueError(f"Invalid Process ID format: {process_id}")

        timestamp = int(match.group(2))
        return {
            "system": match.group(1),
            "timestamp": timestamp,
            "date": datetime.fromtimestamp(timestamp / 1000)
        }

    @staticmethod
    def validate_payload(payload: Dict[str, Any]) -> bool:
        """
        Validate a HEIR/ORBT payload
        
        Args:
            payload: Payload to validate
            
        Returns:
            True if valid
            
        Raises:
            ValueError: If payload is invalid
        """
        required = ['tool', 'data', 'unique_id', 'process_id', 'orbt_layer', 'blueprint_version']
        
        for field in required:
            if field not in payload:
                raise ValueError(f"Missing required field: {field}")

        # Validate HEIR ID format
        HeirGenerator.parse_heir_id(payload['unique_id'])

        # Validate Process ID format
        HeirGenerator.parse_process_id(payload['process_id'])

        # Validate ORBT layer
        if payload['orbt_layer'] < 1 or payload['orbt_layer'] > 4:
            raise ValueError(f"Invalid ORBT layer: {payload['orbt_layer']}")

        return True

    @staticmethod
    def get_orbt_layer_description(layer: int) -> str:
        """
        Get ORBT layer description
        
        Args:
            layer: ORBT layer number (1-4)
            
        Returns:
            Layer description
        """
        descriptions = {
            1: 'Input/Intake - Data ingestion and validation',
            2: 'Processing/Middle - Data transformation and enrichment',
            3: 'Output/Generation - Result creation and formatting',
            4: 'Orchestration/Coordination - System-level coordination'
        }

        return descriptions.get(layer, 'Unknown layer')


# Example usage:
if __name__ == "__main__":
    # Generate a simple HEIR ID
    heir_id = HeirGenerator.generate_heir_id('IMO', 'CREATOR', 1)
    print(f"HEIR ID: {heir_id}")

    # Generate a Process ID
    process_id = HeirGenerator.generate_process_id('IMO')
    print(f"Process ID: {process_id}")

    # Generate a complete payload
    payload = HeirGenerator.generate_payload(
        'apify_run_actor',
        {'actorId': 'apify~leads-finder', 'runInput': {'query': 'test'}},
        'IMO',
        'ACTION',
        2,
        '1.0',
        1
    )
    print(f"\nPayload:\n{payload}")

    # Validate payload
    try:
        HeirGenerator.validate_payload(payload)
        print("\n✅ Payload is valid")
    except ValueError as error:
        print(f"\n❌ Payload validation failed: {error}")

    # Parse IDs
    parsed_heir = HeirGenerator.parse_heir_id(heir_id)
    print(f"\nParsed HEIR ID: {parsed_heir}")

    parsed_process = HeirGenerator.parse_process_id(process_id)
    print(f"Parsed Process ID: {parsed_process}")

    # Get layer description
    for layer in range(1, 5):
        desc = HeirGenerator.get_orbt_layer_description(layer)
        print(f"Layer {layer}: {desc}")
