import pdfplumber
from .base_tool import BaseTool


class PDFMapperTool(BaseTool):
    """Handles PDF extraction and form filling."""

    def run(self, mode, data):
        if mode == "extract":
            self.log("Extracting structured data from PDF...")
            text_blocks = []
            try:
                with pdfplumber.open(data) as pdf:
                    for page in pdf.pages:
                        text = page.extract_text() or ""
                        text_blocks.append(text)
                full_text = "\n".join(text_blocks)
                return {"status": "extracted", "tool": "PDF Mapper", "content": full_text}
            except Exception as e:
                self.log(f"Error extracting PDF: {str(e)}")
                return {"status": "error", "tool": "PDF Mapper", "error": str(e)}

        elif mode == "fill":
            self.log("Filling PDF form with master data (placeholder)...")
            # Placeholder for form-fill logic using PyPDF2/pdfrw
            return {"status": "filled", "tool": "PDF Mapper"}

        else:
            self.log("Invalid mode. Use 'extract' or 'fill'.")
            return {"error": "Invalid mode"}
