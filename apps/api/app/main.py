import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import health, profile, documents, chat, quizzes, flashcards, tasks, resume, placement, exam_guide

logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Cortexa AI API",
    description="Backend API for Cortexa AI — Your AI Study Companion",
    version="1.0.0",
    docs_url="/api/docs" if settings.APP_ENV != "production" else None,
    redoc_url="/api/redoc" if settings.APP_ENV != "production" else None,
    openapi_url="/api/openapi.json" if settings.APP_ENV != "production" else None,
)

# CORS — allow only configured frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

# ── Route registration ──────────────────────────────────────────
API_PREFIX = "/api/v1"

app.include_router(health.router, prefix=API_PREFIX)
app.include_router(profile.router, prefix=API_PREFIX)
app.include_router(documents.router, prefix=API_PREFIX)
app.include_router(chat.router, prefix=API_PREFIX)
app.include_router(quizzes.router, prefix=API_PREFIX)
app.include_router(flashcards.router, prefix=API_PREFIX)
app.include_router(tasks.router, prefix=API_PREFIX)
app.include_router(resume.router, prefix=API_PREFIX)
app.include_router(placement.router, prefix=API_PREFIX)
app.include_router(exam_guide.router, prefix=API_PREFIX)


@app.on_event("startup")
async def startup_event():
    logger.info(f"🚀 Cortexa AI API starting — env={settings.APP_ENV}, port={settings.PORT}")
    logger.info(f"   CORS origins: {settings.cors_origins}")
    logger.info(f"   Groq configured: {bool(settings.GROQ_API_KEY)}")
    logger.info(f"   Gemini configured: {bool(settings.GEMINI_API_KEY)}")
    logger.info(f"   Supabase configured: {bool(settings.SUPABASE_URL)}")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Cortexa AI API shutdown complete.")
