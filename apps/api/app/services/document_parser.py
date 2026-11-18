import io
import logging
from typing import List, Dict, Any
import pypdf
import docx
from pptx import Presentation

logger = logging.getLogger(__name__)


class DocumentExtractionResult:
    def __init__(self, full_text: str, pages: List[Dict[str, Any]], page_count: int):
        self.full_text = full_text
        self.pages = pages  # List of dicts with {"index": int, "text": str, "type": "page"|"slide"|"section"}
        self.page_count = page_count


class DocumentParser:
    @staticmethod
    def parse_pdf(file_bytes: bytes, max_pages: int = 300) -> DocumentExtractionResult:
        stream = io.BytesIO(file_bytes)
        reader = pypdf.PdfReader(stream)
        total_pages = len(reader.pages)
        pages_to_extract = min(total_pages, max_pages)

        pages = []
        full_text_parts = []
        for i in range(pages_to_extract):
            try:
                page_text = reader.pages[i].extract_text() or ""
                clean_text = page_text.strip()
                pages.append({"index": i + 1, "text": clean_text, "type": "page"})
                if clean_text:
                    full_text_parts.append(clean_text)
            except Exception as e:
                logger.warning(f"Failed to extract page {i + 1}: {e}")
                pages.append({"index": i + 1, "text": "", "type": "page"})

        return DocumentExtractionResult(
            full_text="\n\n".join(full_text_parts),
            pages=pages,
            page_count=total_pages
        )

    @staticmethod
    def parse_pptx(file_bytes: bytes, max_slides: int = 300) -> DocumentExtractionResult:
        stream = io.BytesIO(file_bytes)
        prs = Presentation(stream)
        total_slides = len(prs.slides)
        slides_to_extract = min(total_slides, max_slides)

        pages = []
        full_text_parts = []
        for i, slide in enumerate(prs.slides[:slides_to_extract]):
            slide_texts = []
            for shape in slide.shapes:
                if shape.has_text_frame:
                    for paragraph in shape.text_frame.paragraphs:
                        text = paragraph.text.strip()
                        if text:
                            slide_texts.append(text)
            # Check notes slide if available
            if slide.has_notes_slide and slide.notes_slide.notes_text_frame:
                notes = slide.notes_slide.notes_text_frame.text.strip()
                if notes:
                    slide_texts.append(f"[Notes: {notes}]")

            slide_content = "\n".join(slide_texts)
            pages.append({"index": i + 1, "text": slide_content, "type": "slide"})
            if slide_content:
                full_text_parts.append(slide_content)

        return DocumentExtractionResult(
            full_text="\n\n".join(full_text_parts),
            pages=pages,
            page_count=total_slides
        )

    @staticmethod
    def parse_docx(file_bytes: bytes) -> DocumentExtractionResult:
        stream = io.BytesIO(file_bytes)
        doc = docx.Document(stream)
        paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]

        # Approximate pages (~350 words per page)
        words_per_page = 350
        pages = []
        current_page_paras = []
        current_word_count = 0
        page_index = 1

        for p in paragraphs:
            p_words = len(p.split())
            current_page_paras.append(p)
            current_word_count += p_words
            if current_word_count >= words_per_page:
                pages.append({"index": page_index, "text": "\n".join(current_page_paras), "type": "page"})
                page_index += 1
                current_page_paras = []
                current_word_count = 0

        if current_page_paras or not pages:
            pages.append({"index": page_index, "text": "\n".join(current_page_paras), "type": "page"})

        return DocumentExtractionResult(
            full_text="\n\n".join(paragraphs),
            pages=pages,
            page_count=len(pages)
        )

    @staticmethod
    def parse_txt(file_bytes: bytes) -> DocumentExtractionResult:
        text = file_bytes.decode("utf-8", errors="replace")
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        pages = [{"index": 1, "text": "\n".join(lines), "type": "document"}]
        return DocumentExtractionResult(
            full_text="\n".join(lines),
            pages=pages,
            page_count=1
        )

    @classmethod
    def extract_document(cls, filename: str, content: bytes, max_pages: int = 300) -> DocumentExtractionResult:
        ext = filename.lower().split(".")[-1]
        if ext == "pdf":
            return cls.parse_pdf(content, max_pages)
        elif ext in ["pptx", "ppt"]:
            return cls.parse_pptx(content, max_pages)
        elif ext in ["docx", "doc"]:
            return cls.parse_docx(content)
        elif ext in ["txt", "md", "csv"]:
            return cls.parse_txt(content)
        else:
            raise ValueError(f"Unsupported file format: .{ext}")
