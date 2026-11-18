import re
import uuid
from typing import List, Dict, Any, Optional


class DocumentChunk:
    def __init__(
        self,
        chunk_index: int,
        chunk_text: str,
        page_number: int = 1,
        slide_number: int = None,
        metadata: Dict[str, Any] = None
    ):
        self.chunk_index = chunk_index
        self.chunk_text = chunk_text
        self.page_number = page_number
        self.slide_number = slide_number
        self.metadata = metadata or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "chunk_index": self.chunk_index,
            "chunk_text": self.chunk_text,
            "page_number": self.page_number,
            "slide_number": self.slide_number,
            "metadata": self.metadata,
        }


class TextChunker:
    def __init__(self, target_chars: int = 800, overlap_chars: int = 150):
        self.target_chars = target_chars
        self.overlap_chars = overlap_chars

    def chunk_text_block(self, text: str) -> List[str]:
        text = text.strip()
        if not text:
            return []
        if len(text) <= self.target_chars:
            return [text]

        # Split on paragraph boundaries first
        paragraphs = re.split(r"\n\s*\n", text)
        chunks = []
        current_chunk = ""

        for para in paragraphs:
            para = para.strip()
            if not para:
                continue

            if len(current_chunk) + len(para) + 2 <= self.target_chars:
                current_chunk = f"{current_chunk}\n\n{para}".strip()
            else:
                if current_chunk:
                    chunks.append(current_chunk)
                # If paragraph itself is longer than target, break into sentences
                if len(para) > self.target_chars:
                    sentences = re.split(r"(?<=[.!?])\s+", para)
                    temp_chunk = ""
                    for s in sentences:
                        if len(temp_chunk) + len(s) + 1 <= self.target_chars:
                            temp_chunk = f"{temp_chunk} {s}".strip()
                        else:
                            if temp_chunk:
                                chunks.append(temp_chunk)
                            temp_chunk = s
                    if temp_chunk:
                        current_chunk = temp_chunk
                else:
                    current_chunk = para

        if current_chunk:
            chunks.append(current_chunk)

        return chunks

    def process_extraction(
        self,
        extraction: Any,
        document_id: str,
        user_id: str,
        filename: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Splits extracted document pages into page-aware text chunks.
        Strictly preserves document_id, user_id, filename, page_number, chunk_index, and chunk_text.
        """
        chunks: List[Dict[str, Any]] = []
        chunk_index = 0

        for page in extraction.pages:
            page_text = page.get("text", "").strip()
            if not page_text:
                continue

            p_index = page.get("index", 1)
            p_type = page.get("type", "page")

            page_chunks = self.chunk_text_block(page_text)
            for text_chunk in page_chunks:
                chunk_index += 1
                chunk_id = str(uuid.uuid4())
                meta = {
                    "document_id": document_id,
                    "user_id": user_id,
                    "filename": filename,
                    "page_number": p_index if p_type != "slide" else 1,
                    "slide_number": p_index if p_type == "slide" else None,
                    "chunk_index": chunk_index,
                    "char_count": len(text_chunk),
                    "type": p_type,
                }
                chunk_obj = {
                    "id": chunk_id,
                    "document_id": document_id,
                    "user_id": user_id,
                    "filename": filename,
                    "chunk_index": chunk_index,
                    "chunk_text": text_chunk,
                    "page_number": p_index if p_type != "slide" else 1,
                    "slide_number": p_index if p_type == "slide" else None,
                    "metadata": meta,
                }
                chunks.append(chunk_obj)

        return chunks


chunker = TextChunker()
