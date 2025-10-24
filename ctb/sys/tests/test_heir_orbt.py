"""
HEIR/ORBT utilities tests
Tests for ctb/sys/utils/heir_orbt.py
"""

import pytest
import re
from datetime import datetime


class TestHEIRIDGeneration:
    """Test HEIR ID generation"""

    def test_generate_heir_id_format(self):
        """Test HEIR ID follows correct format"""
        # Expected format: HEIR-YYYY-MM-SYSTEM-MODE-VN
        heir_id = "HEIR-2025-10-SYS-TEST-01"

        pattern = r"^HEIR-\d{4}-\d{2}-[A-Z]+-[A-Z]+-\d{2}$"
        assert re.match(pattern, heir_id), f"HEIR ID '{heir_id}' does not match expected format"

    def test_heir_id_components(self):
        """Test HEIR ID components are correct"""
        heir_id = "HEIR-2025-10-SYS-TEST-01"

        parts = heir_id.split("-")
        assert parts[0] == "HEIR"
        assert len(parts[1]) == 4  # Year
        assert len(parts[2]) == 2  # Month
        assert parts[3].isupper()  # System in uppercase
        assert parts[4].isupper()  # Mode in uppercase
        assert len(parts[5]) == 2  # Version number


class TestProcessIDGeneration:
    """Test Process ID generation"""

    def test_process_id_format(self):
        """Test Process ID follows correct format"""
        # Expected format: PRC-SYSTEM-EPOCHTIMESTAMP
        process_id = "PRC-SYS-1729800000"

        pattern = r"^PRC-[A-Z]+-\d{10}$"
        assert re.match(pattern, process_id), f"Process ID '{process_id}' does not match expected format"

    def test_process_id_timestamp(self):
        """Test Process ID contains valid timestamp"""
        process_id = "PRC-SYS-1729800000"

        parts = process_id.split("-")
        timestamp = int(parts[2])
        assert timestamp > 0
        assert timestamp < 2000000000  # Reasonable future bound


class TestHEIRORBTPayload:
    """Test HEIR/ORBT payload creation and validation"""

    def test_valid_payload_structure(self, sample_heir_orbt_payload):
        """Test payload has all required fields"""
        required_fields = ["tool", "data", "unique_id", "process_id", "orbt_layer", "blueprint_version"]

        for field in required_fields:
            assert field in sample_heir_orbt_payload, f"Missing required field: {field}"

    def test_orbt_layer_range(self, sample_heir_orbt_payload):
        """Test ORBT layer is within valid range (1-4)"""
        orbt_layer = sample_heir_orbt_payload["orbt_layer"]
        assert 1 <= orbt_layer <= 4, f"ORBT layer {orbt_layer} is out of valid range (1-4)"

    def test_payload_data_types(self, sample_heir_orbt_payload):
        """Test payload field data types"""
        assert isinstance(sample_heir_orbt_payload["tool"], str)
        assert isinstance(sample_heir_orbt_payload["data"], dict)
        assert isinstance(sample_heir_orbt_payload["unique_id"], str)
        assert isinstance(sample_heir_orbt_payload["process_id"], str)
        assert isinstance(sample_heir_orbt_payload["orbt_layer"], int)


class TestORBTLayers:
    """Test ORBT layer definitions"""

    def test_orbt_layer_definitions(self):
        """Test ORBT layers are correctly defined"""
        layers = {
            1: "Infrastructure",
            2: "Integration",
            3: "Application",
            4: "Presentation"
        }

        for layer_num, layer_name in layers.items():
            assert 1 <= layer_num <= 4
            assert isinstance(layer_name, str)
            assert len(layer_name) > 0
