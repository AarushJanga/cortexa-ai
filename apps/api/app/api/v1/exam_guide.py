import json
import logging
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.core.security import get_current_user, AuthenticatedUser
from app.core.database import db
from app.services.ai_provider import ai_service
from app.services.embeddings import embedding_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/exam-guide", tags=["Exam Guide"])


class ExamGuideRequest(BaseModel):
    document_id: Optional[str] = None
    subject: str = "General Subject"
    exam_date: Optional[str] = None
    topics_focus: Optional[List[str]] = None


@router.post("/generate")
async def generate_exam_guide(
    req: ExamGuideRequest,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    context = f"Subject: {req.subject}"

    if req.document_id:
        doc = await db.get_document(req.document_id, current_user.id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found or access denied")
        vec = await embedding_service.get_embedding(req.subject)
        chunks = await db.similarity_search(
            user_id=current_user.id,
            query_embedding=vec,
            document_id=req.document_id,
            match_count=6
        )
        if chunks:
            context = "\n\n".join(c["chunk_text"] for c in chunks)

    topics_note = ""
    if req.topics_focus:
        topics_note = f"Focus especially on these topics: {', '.join(req.topics_focus)}."

    exam_date_note = f"Exam date: {req.exam_date}." if req.exam_date else ""

    prompt = (
        f"You are an expert study coach creating a comprehensive exam preparation guide.\n"
        f"Subject: {req.subject}. {exam_date_note} {topics_note}\n\n"
        "Create a structured exam prep guide. Return ONLY valid JSON:\n"
        "{\n"
        '  "title": "...",\n'
        '  "key_topics": ["topic 1", "topic 2", ...],\n'
        '  "likely_questions": ["Q1", "Q2", ...],\n'
        '  "study_tips": ["tip 1", "tip 2", ...],\n'
        '  "revision_schedule": [{"day": "Day 1", "focus": "..."},...],\n'
        '  "time_management_strategy": "..."\n'
        "}\n\n"
        f"<study_content>\n{context[:3000]}\n</study_content>\n\nReturn ONLY the JSON object."
    )

    result = await ai_service.generate_completion([
        {"role": "system", "content": "You are an expert educator and exam strategist. Return only valid JSON."},
        {"role": "user", "content": prompt}
    ], temperature=0.3)

    try:
        raw = result["content"].strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        guide = json.loads(raw.strip())
    except Exception as e:
        logger.warning(f"Exam guide JSON parse failed: {e}")
        guide = {
            "title": f"Exam Prep Guide: {req.subject}",
            "key_topics": ["Core Concepts", "Important Formulas", "Case Studies", "Practice Problems"],
            "likely_questions": [
                f"Explain the fundamental principles of {req.subject}",
                "Compare and contrast the main approaches covered",
                "Solve a step-by-step numerical problem",
                "List and explain the key applications"
            ],
            "study_tips": [
                "Start with the most challenging topics first",
                "Use the Pomodoro technique: 25 min study, 5 min break",
                "Review your notes within 24 hours to improve retention by 60%",
                "Practice past exam questions under timed conditions"
            ],
            "revision_schedule": [
                {"day": "Day 1", "focus": "Core Concepts & Theory"},
                {"day": "Day 2", "focus": "Applications & Examples"},
                {"day": "Day 3", "focus": "Practice Problems & Past Papers"},
                {"day": "Day 4", "focus": "Full Revision & Weak Area Focus"},
                {"day": "Day 5 (Exam Eve)", "focus": "Light review only, rest well"}
            ],
            "time_management_strategy": "Allocate 60% of study time to your weaker topics. Reserve 20% for practice tests and 20% for full revision of well-understood material."
        }

    return {"guide": guide, "document_id": req.document_id, "subject": req.subject}
