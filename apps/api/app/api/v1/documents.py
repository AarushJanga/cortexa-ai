import os
import uuid
import logging
from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from app.core.security import get_current_user, AuthenticatedUser
from app.core.database import db
from app.core.config import settings
from app.services.document_parser import DocumentParser
from app.services.chunker import chunker
from app.services.embeddings import embedding_service
from app.models.schemas import DocumentResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/documents", tags=["Documents"])

ALLOWED_EXTENSIONS = {"pdf", "pptx", "docx", "txt", "md"}


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    # 1. Validate file extension
    filename = file.filename or "untitled.txt"
    ext = filename.lower().split(".")[-1]
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension '.{ext}' is not supported. Allowed formats: PDF, PPTX, DOCX, TXT."
        )

    # 2. Read file content & validate size
    content = await file.read()
    file_size_mb = len(content) / (1024 * 1024)
    if file_size_mb > settings.MAX_UPLOAD_MB:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size ({file_size_mb:.1f} MB) exceeds maximum allowed limit of {settings.MAX_UPLOAD_MB} MB."
        )

    doc_id = str(uuid.uuid4())
    safe_storage_name = f"{current_user.id}/{doc_id}.{ext}"

    # 3. Create document record in uploading state
    doc_record = {
        "id": doc_id,
        "user_id": current_user.id,
        "title": os.path.splitext(filename)[0].replace("_", " ").title(),
        "file_name": filename,
        "file_size": len(content),
        "mime_type": file.content_type or "application/octet-stream",
        "storage_path": safe_storage_name,
        "status": "processing",
        "page_count": 1,
        "summary": None,
    }
    await db.create_document(doc_record)

    # 4. Extract document content
    try:
        extraction = DocumentParser.extract_document(filename, content, max_pages=settings.MAX_DOCUMENT_PAGES)
        
        # 5. Chunk text with filename preservation
        chunks = chunker.process_extraction(
            extraction,
            document_id=doc_id,
            user_id=current_user.id,
            filename=filename
        )
        if not chunks:
            # Create a single chunk from whatever text exists
            chunks = [{
                "id": str(uuid.uuid4()),
                "document_id": doc_id,
                "user_id": current_user.id,
                "filename": filename,
                "chunk_index": 1,
                "chunk_text": extraction.full_text[:1000] or "Document uploaded successfully.",
                "page_number": 1,
                "slide_number": None,
                "metadata": {
                    "filename": filename,
                    "document_id": doc_id,
                    "user_id": current_user.id,
                    "char_count": len(extraction.full_text),
                    "page_number": 1
                },
            }]

        # 6. Generate embeddings and save
        chunk_texts = [c["chunk_text"] for c in chunks]
        embeddings = await embedding_service.embed_chunks(chunk_texts)
        for i, c in enumerate(chunks):
            c["embedding"] = embeddings[i] if i < len(embeddings) else []

        await db.save_chunks(chunks)

        # Structured Server-Side Debugging Log (Section 9)
        char_count = sum(len(c.get("chunk_text", "")) for c in chunks)
        logger.info(
            f"[DOCUMENT UPLOAD] doc_id={doc_id} "
            f"user_id={current_user.id} "
            f"filename={filename} "
            f"extracted_pages={extraction.page_count} "
            f"extracted_chars={char_count} "
            f"chunk_count={len(chunks)} "
            f"embedding_model={settings.EMBEDDING_MODEL} "
            f"embedding_dimensions={settings.EMBEDDING_DIMENSIONS}"
        )

        # Brief summary from first 500 characters
        summary = (extraction.full_text[:350].strip() + "...") if extraction.full_text else "Document successfully processed and indexed."
        updated = await db.update_document_status(
            document_id=doc_id,
            user_id=current_user.id,
            status="ready",
            summary=summary,
            page_count=extraction.page_count
        )
        return updated or doc_record

    except Exception as e:
        logger.error(f"Document processing failed for {filename}: {e}", exc_info=True)
        await db.update_document_status(document_id=doc_id, user_id=current_user.id, status="failed")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to process document content: {str(e)}"
        )


@router.get("", response_model=List[DocumentResponse])
async def list_documents(current_user: AuthenticatedUser = Depends(get_current_user)):
    return await db.get_documents(current_user.id)


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document_detail(
    document_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    doc = await db.get_document(document_id, current_user.id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found or access denied")
    return doc


@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    success = await db.delete_document(document_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found or access denied")
    return {"message": "Document and associated embeddings deleted successfully"}
