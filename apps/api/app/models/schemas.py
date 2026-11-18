from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


# ---------------- Profile Schemas ----------------
class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    persona: Optional[str] = Field(None, pattern="^(school_student|college_student|job_seeker)$")
    institution: Optional[str] = None
    target_role: Optional[str] = None
    preferred_job_locations: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    exam_date: Optional[str] = None
    timezone: Optional[str] = None


class ProfileResponse(BaseModel):
    id: str
    display_name: Optional[str]
    persona: str
    institution: Optional[str]
    target_role: Optional[str]
    preferred_job_locations: List[str]
    skills: List[str]
    exam_date: Optional[str]
    timezone: str
    created_at: str
    updated_at: str


# ---------------- Document Schemas ----------------
class DocumentResponse(BaseModel):
    id: str
    title: str
    file_name: str
    file_size: int
    mime_type: str
    status: str
    page_count: int
    summary: Optional[str] = None
    created_at: str
    updated_at: str


# ---------------- Chat & RAG Schemas ----------------
class ChatMessageRequest(BaseModel):
    conversation_id: Optional[str] = None
    document_id: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=4000)
    mode: Optional[str] = "rag"  # rag, summary, key_concepts, explain_simply


class Citation(BaseModel):
    chunk_id: str
    document_id: str
    file_name: Optional[str] = None
    page_number: Optional[int] = None
    slide_number: Optional[int] = None
    snippet: str
    similarity: float


class ChatMessageResponse(BaseModel):
    conversation_id: str
    user_message: str
    assistant_message: str
    citations: List[Citation]
    provider: str
    latency_ms: int


# ---------------- Quiz Schemas ----------------
class GenerateQuizRequest(BaseModel):
    document_id: Optional[str] = None
    topic: Optional[str] = "General Knowledge from Document"
    difficulty: str = "medium"  # easy, medium, hard
    question_count: int = Field(5, ge=1, le=20)


class QuizQuestionSchema(BaseModel):
    id: Optional[str] = None
    question_text: str
    options: List[str]
    correct_answer: str
    explanation: Optional[str] = None
    source_reference: Optional[str] = None


class QuizResponse(BaseModel):
    id: str
    title: str
    difficulty: str
    question_count: int
    questions: List[QuizQuestionSchema]
    created_at: str


class SubmitQuizRequest(BaseModel):
    answers: Dict[str, str]  # question_id -> selected_option


class QuizResultResponse(BaseModel):
    quiz_id: str
    score: int
    total_questions: int
    percentage: float
    feedback: str


# ---------------- Flashcard Schemas ----------------
class GenerateFlashcardsRequest(BaseModel):
    document_id: Optional[str] = None
    topic: Optional[str] = "Key Definitions & Formulae"
    count: int = Field(5, ge=1, le=25)


class FlashcardSchema(BaseModel):
    id: Optional[str] = None
    front: str
    back: str
    is_known: bool = False
    review_count: int = 0


class FlashcardDeckResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    card_count: int
    mastered_count: int
    created_at: str


# ---------------- Task Schemas ----------------
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    is_completed: bool = False
    priority: str = "medium"  # low, medium, high, urgent
    category: str = "study"   # study, assignment, exam, career, other
    due_date: Optional[str] = None
    document_id: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[str] = None


class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    is_completed: bool
    priority: str
    category: str
    due_date: Optional[str]
    document_id: Optional[str]
    created_at: str


# ---------------- Career & Resume Schemas ----------------
class ResumeAnalysisResponse(BaseModel):
    id: str
    overall_score: int
    target_role: str
    strengths: List[str]
    missing_skills: List[str]
    improvement_suggestions: List[str]
    created_at: str


class PlacementApplicationCreate(BaseModel):
    company: str
    role: str
    application_url: Optional[str] = None
    status: str = "applied"  # saved, applied, interviewing, offer, rejected
    application_date: Optional[str] = None
    notes: Optional[str] = None
    next_action: Optional[str] = None


class PlacementApplicationResponse(BaseModel):
    id: str
    company: str
    role: str
    application_url: Optional[str]
    status: str
    application_date: Optional[str]
    notes: Optional[str]
    next_action: Optional[str]
    created_at: str
