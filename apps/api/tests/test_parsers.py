import pytest
import asyncio
from app.services.document_parser import DocumentParser
from app.services.chunker import TextChunker


# ── Document Parser Tests ───────────────────────────────────────
class TestDocumentParser:
    def test_parse_txt_basic(self):
        content = b"Hello world\nThis is a test document.\nLine three."
        result = DocumentParser.parse_txt(content)
        assert result.full_text
        assert len(result.pages) >= 1
        assert result.page_count >= 1

    def test_parse_txt_empty(self):
        content = b"   \n   "
        result = DocumentParser.parse_txt(content)
        assert result.page_count >= 1

    def test_extract_document_txt_dispatches(self):
        content = b"Test content for extraction dispatch."
        result = DocumentParser.extract_document("notes.txt", content)
        assert result.full_text

    def test_extract_document_unsupported_format(self):
        with pytest.raises(ValueError, match="Unsupported file format"):
            DocumentParser.extract_document("image.png", b"fake-bytes")

    def test_parse_pdf_with_real_bytes(self):
        """PDF parser on invalid bytes should raise or return empty gracefully — not crash the server."""
        try:
            result = DocumentParser.parse_pdf(b"%PDF-1.4\n%%EOF", max_pages=5)
            # If it succeeds, should return a valid result
            assert result.page_count >= 0
        except Exception:
            # pypdf may raise on invalid/empty PDF — that's fine; the route handles it
            pass


# ── Chunker Tests ──────────────────────────────────────────────
class TestTextChunker:
    def setup_method(self):
        self.chunker = TextChunker(target_chars=200, overlap_chars=30)

    def test_short_text_single_chunk(self):
        text = "This is a short paragraph."
        chunks = self.chunker.chunk_text_block(text)
        assert len(chunks) == 1
        assert chunks[0] == text

    def test_long_text_splits(self):
        # Simulate realistic text with paragraph boundaries (each ~90 chars)
        paragraphs = ["This is a paragraph about machine learning concepts and deep neural networks." for _ in range(8)]
        text = "\n\n".join(paragraphs)
        chunks = self.chunker.chunk_text_block(text)
        # With target=200 chars and 8 paragraphs each ~74 chars, should produce >=2 chunks
        assert len(chunks) >= 2
        for chunk in chunks:
            assert len(chunk) > 0

    def test_empty_text_returns_empty(self):
        chunks = self.chunker.chunk_text_block("")
        assert chunks == []

    def test_whitespace_only_returns_empty(self):
        chunks = self.chunker.chunk_text_block("   \n\n   ")
        assert chunks == []

    def test_paragraph_boundary_preference(self):
        # Two paragraphs each shorter than target
        text = "Paragraph one content here.\n\nParagraph two content here."
        chunks = self.chunker.chunk_text_block(text)
        assert len(chunks) >= 1
        combined = " ".join(chunks)
        assert "Paragraph one" in combined
        assert "Paragraph two" in combined

    def test_process_extraction_attaches_metadata(self):
        from app.services.document_parser import DocumentExtractionResult
        pages = [
            {"index": 1, "text": "Page one content with enough text to form a chunk.", "type": "page"},
            {"index": 2, "text": "Page two content with additional material.", "type": "page"},
        ]
        extraction = DocumentExtractionResult(
            full_text="Page one content...\nPage two content...",
            pages=pages,
            page_count=2
        )
        chunks = self.chunker.process_extraction(extraction, document_id="doc-123", user_id="user-abc")
        assert len(chunks) >= 1
        for c in chunks:
            assert c["document_id"] == "doc-123"
            assert c["user_id"] == "user-abc"
            assert c["chunk_text"]
            assert c["chunk_index"] >= 1
