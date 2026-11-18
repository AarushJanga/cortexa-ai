import json
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user, AuthenticatedUser
from app.core.database import db
from app.services.ai_provider import ai_service
from app.models.schemas import (
    GenerateQuizRequest, QuizResponse, QuizQuestionSchema,
    SubmitQuizRequest, QuizResultResponse
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/quizzes", tags=["Quizzes"])


def _build_quiz_prompt(topic: str, difficulty: str, count: int, context: str) -> str:
    difficulty_guide = {
        "easy": "Write clear, straightforward questions testing basic recall and simple understanding.",
        "medium": "Write moderately challenging questions involving application and comprehension.",
        "hard": "Write analytically challenging questions requiring synthesis, evaluation, and critical reasoning."
    }
    return (
        f"You are a quiz generator for a student learning platform.\n"
        f"Based on the following study content, generate exactly {count} multiple-choice quiz questions about: {topic}.\n"
        f"Difficulty: {difficulty.upper()}. {difficulty_guide.get(difficulty, '')}\n\n"
        "FORMAT: Return ONLY a valid JSON array with this exact structure:\n"
        '[\n  {"question": "...", "options": ["A", "B", "C", "D"], "correct_answer": "...", "explanation": "...", "source_reference": "..."}\n]\n\n'
        f"<study_content>\n{context[:3000]}\n</study_content>\n\n"
        "Return ONLY the JSON array, no markdown, no commentary."
    )


@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(
    req: GenerateQuizRequest,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    # Gather context from document or use topic directly
    context = f"Topic: {req.topic}" if req.topic else "General study content"

    if req.document_id:
        doc = await db.get_document(req.document_id, current_user.id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found or access denied")
        # Pull top chunks for quiz context
        from app.services.embeddings import embedding_service
        vec = await embedding_service.get_embedding(req.topic or "quiz questions")
        chunks = await db.similarity_search(
            user_id=current_user.id,
            query_embedding=vec,
            document_id=req.document_id,
            match_count=6
        )
        if chunks:
            context = "\n\n".join(c["chunk_text"] for c in chunks)

    prompt = _build_quiz_prompt(req.topic or "Key Concepts", req.difficulty, req.question_count, context)
    result = await ai_service.generate_completion([
        {"role": "system", "content": "You are a quiz creation expert. Always return valid JSON arrays only."},
        {"role": "user", "content": prompt}
    ], temperature=0.4)

    # Parse AI-returned JSON
    questions_raw = []
    try:
        raw = result["content"].strip()
        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        questions_raw = json.loads(raw.strip())
    except Exception as e:
        logger.warning(f"Quiz JSON parse failed, using fallback: {e}")
        questions_raw = [
            {
                "question": f"What is a key concept in {req.topic or 'this topic'}?",
                "options": ["Retrieval Augmented Generation", "Bubble Sort", "Hash Tables", "Binary Trees"],
                "correct_answer": "Retrieval Augmented Generation",
                "explanation": "RAG is a core concept for grounding AI with document knowledge.",
                "source_reference": "Study Material"
            }
        ]

    quiz_title = f"{req.difficulty.title()} Quiz: {req.topic or 'Key Concepts'}"
    questions_to_save = []
    for i, q in enumerate(questions_raw[: req.question_count]):
        questions_to_save.append({
            "question_text": q.get("question", f"Question {i+1}"),
            "options": q.get("options", []),
            "correct_answer": q.get("correct_answer", ""),
            "explanation": q.get("explanation"),
            "source_reference": q.get("source_reference"),
            "sort_order": i,
        })

    saved = await db.create_quiz(
        user_id=current_user.id,
        quiz_data={
            "title": quiz_title,
            "document_id": req.document_id,
            "difficulty": req.difficulty,
            "question_count": len(questions_to_save),
        },
        questions=questions_to_save
    )

    quiz = saved["quiz"]
    questions = saved["questions"]

    return QuizResponse(
        id=quiz["id"],
        title=quiz["title"],
        difficulty=quiz["difficulty"],
        question_count=len(questions),
        questions=[
            QuizQuestionSchema(
                id=q["id"],
                question_text=q["question_text"],
                options=q["options"] if isinstance(q["options"], list) else json.loads(q["options"]),
                correct_answer=q["correct_answer"],
                explanation=q.get("explanation"),
                source_reference=q.get("source_reference"),
            ) for q in questions
        ],
        created_at=quiz["created_at"]
    )


@router.get("", response_model=List[dict])
async def list_quizzes(current_user: AuthenticatedUser = Depends(get_current_user)):
    return await db.get_quizzes(current_user.id)


@router.get("/{quiz_id}")
async def get_quiz(quiz_id: str, current_user: AuthenticatedUser = Depends(get_current_user)):
    data = await db.get_quiz(quiz_id, current_user.id)
    if not data:
        raise HTTPException(status_code=404, detail="Quiz not found or access denied")
    return data


@router.post("/{quiz_id}/submit", response_model=QuizResultResponse)
async def submit_quiz(
    quiz_id: str,
    submission: SubmitQuizRequest,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    data = await db.get_quiz(quiz_id, current_user.id)
    if not data:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions = data["questions"]
    correct = 0
    answers_log = []
    for q in questions:
        q_id = q.get("id", "")
        selected = submission.answers.get(q_id, "")
        is_correct = selected.strip().lower() == q.get("correct_answer", "").strip().lower()
        if is_correct:
            correct += 1
        answers_log.append({"question_id": q_id, "selected_answer": selected, "is_correct": is_correct})

    total = len(questions)
    pct = round((correct / total) * 100, 1) if total > 0 else 0

    if pct >= 80:
        feedback = "🏆 Excellent work! Outstanding score — you're mastering this material!"
    elif pct >= 60:
        feedback = "👍 Good effort! Review the explanations for missed questions and try again."
    else:
        feedback = "📚 Keep studying! Go back to your flashcards and notes, then retry the quiz."

    await db.record_quiz_attempt(quiz_id, current_user.id, correct, total, answers_log)

    return QuizResultResponse(quiz_id=quiz_id, score=correct, total_questions=total, percentage=pct, feedback=feedback)
