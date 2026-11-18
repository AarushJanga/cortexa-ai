import json
import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user, AuthenticatedUser
from app.core.database import db
from app.services.ai_provider import ai_service
from app.services.embeddings import embedding_service
from app.models.schemas import (
    GenerateFlashcardsRequest, FlashcardDeckResponse, FlashcardSchema
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/flashcards", tags=["Flashcards"])


@router.post("/generate", response_model=dict)
async def generate_flashcards(
    req: GenerateFlashcardsRequest,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    context = f"Topic: {req.topic}" if req.topic else "Key definitions and concepts."

    if req.document_id:
        doc = await db.get_document(req.document_id, current_user.id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found or access denied")
        vec = await embedding_service.get_embedding(req.topic or "definitions and key terms")
        chunks = await db.similarity_search(
            user_id=current_user.id,
            query_embedding=vec,
            document_id=req.document_id,
            match_count=5
        )
        if chunks:
            context = "\n\n".join(c["chunk_text"] for c in chunks)

    prompt = (
        f"Create exactly {req.count} study flashcards for a student about: {req.topic or 'Key Definitions'}.\n"
        "Each flashcard should have a concise question on the front and a clear, complete answer on the back.\n"
        "IMPORTANT: Return ONLY a valid JSON array with this exact structure:\n"
        '[{"front": "What is ...?", "back": "... is ..."}]\n\n'
        f"<study_content>\n{context[:2500]}\n</study_content>\n\n"
        "Return ONLY the JSON array, no markdown, no extra text."
    )

    result = await ai_service.generate_completion([
        {"role": "system", "content": "You are a flashcard generator. Return only valid JSON arrays."},
        {"role": "user", "content": prompt}
    ], temperature=0.3)

    cards_raw = []
    try:
        raw = result["content"].strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        cards_raw = json.loads(raw.strip())
    except Exception as e:
        logger.warning(f"Flashcard JSON parse failed, using fallback: {e}")
        cards_raw = [
            {"front": "What is RAG?", "back": "Retrieval Augmented Generation — grounds AI outputs in verified document context."},
            {"front": "What is pgvector?", "back": "A PostgreSQL extension enabling vector similarity search for embeddings."},
            {"front": "What is cosine similarity?", "back": "A metric measuring the angle between two vectors; used to rank semantic relevance."},
        ]

    # Validate cards
    valid_cards = [c for c in cards_raw if isinstance(c, dict) and c.get("front") and c.get("back")]
    if not valid_cards:
        valid_cards = [{"front": f"Card {i+1}", "back": "Review your notes"} for i in range(req.count)]

    deck_title = f"Flashcards: {req.topic or 'Key Concepts'}"
    saved = await db.create_flashcard_deck(
        user_id=current_user.id,
        title=deck_title,
        description=f"AI-generated flashcards for: {req.topic or 'study material'}",
        cards=valid_cards[:req.count],
        document_id=req.document_id
    )

    return saved


@router.get("/decks", response_model=List[FlashcardDeckResponse])
async def list_decks(current_user: AuthenticatedUser = Depends(get_current_user)):
    return await db.get_flashcard_decks(current_user.id)


@router.get("/decks/{deck_id}/cards", response_model=List[FlashcardSchema])
async def get_deck_cards(deck_id: str, current_user: AuthenticatedUser = Depends(get_current_user)):
    cards = await db.get_deck_cards(deck_id, current_user.id)
    if cards is None:
        raise HTTPException(status_code=404, detail="Deck not found or access denied")
    return cards


@router.patch("/cards/{card_id}/known")
async def mark_card_known(
    card_id: str,
    is_known: bool = True,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    card = await db.toggle_flashcard_known(card_id, current_user.id, is_known)
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard not found or access denied")
    return card
