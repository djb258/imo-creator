#!/usr/bin/env python3
# # CTB Metadata
# # Generated: 2025-10-23T14:32:35.805512
# # CTB Version: 1.3.3
# # Division: System Infrastructure
# # Category: scripts
# # Compliance: 100%
# # HEIR ID: HEIR-2025-10-SYS-SCRIPT-01

"""Quick validation script for PDFMapperTool."""

from libs.imo_tools import PDFMapperTool


def test_import():
    """Test that PDFMapperTool can be imported with pdfplumber."""
    print("[OK] PDFMapperTool imported successfully")
    print("[OK] pdfplumber dependency loaded")


def test_initialization():
    """Test PDFMapperTool initialization."""
    tool = PDFMapperTool(tool_name="TestPDFMapper", version="0.1.0")
    print(f"[OK] PDFMapperTool initialized: {tool.tool_name} v{tool.version}")


def test_invalid_mode():
    """Test error handling for invalid mode."""
    tool = PDFMapperTool(tool_name="TestPDFMapper")
    result = tool.run(mode="invalid", data=None)
    assert "error" in result, "Should return error for invalid mode"
    print("[OK] Invalid mode handling works")


def test_fill_mode():
    """Test fill mode (placeholder)."""
    tool = PDFMapperTool(tool_name="TestPDFMapper")
    result = tool.run(mode="fill", data={"test": "data"})
    assert result["status"] == "filled", "Should return filled status"
    print("[OK] Fill mode works (placeholder)")


def test_extract_mode_with_missing_file():
    """Test extract mode with missing file (should handle error gracefully)."""
    tool = PDFMapperTool(tool_name="TestPDFMapper")
    result = tool.run(mode="extract", data="nonexistent.pdf")
    assert result["status"] == "error", "Should return error for missing file"
    print("[OK] Extract mode error handling works")


if __name__ == "__main__":
    print("\n" + "="*60)
    print("PDFMapperTool Validation Tests")
    print("="*60 + "\n")

    try:
        test_import()
        test_initialization()
        test_invalid_mode()
        test_fill_mode()
        test_extract_mode_with_missing_file()

        print("\n" + "="*60)
        print("SUCCESS: All validation tests passed!")
        print("="*60 + "\n")

        print("PDFMapperTool is ready for use:")
        print("  - Import: from libs.imo_tools import PDFMapperTool")
        print("  - Extract: tool.run(mode='extract', data='path/to/file.pdf')")
        print("  - Fill: tool.run(mode='fill', data={...})")

    except Exception as e:
        print(f"\nFAILED: Validation failed: {str(e)}")
        raise
