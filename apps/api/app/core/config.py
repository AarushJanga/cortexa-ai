from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Cortexa AI"
    APP_ENV: str = "development"
    PORT: int = 8000
    FRONTEND_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    # Supabase credentials
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_JWT_SECRET_OR_JWKS_URL: str = ""
    SUPABASE_STORAGE_BUCKET: str = "student-documents"

    # Groq primary
    GROQ_API_KEY: Optional[str] = None
    GROQ_CHAT_MODEL: str = "llama-3.3-70b-versatile"

    # Gemini fallback
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_CHAT_MODEL: str = "gemini-1.5-flash"

    # Embedding configuration
    EMBEDDING_PROVIDER: str = "gemini"  # gemini, openai, or mock
    EMBEDDING_API_KEY: Optional[str] = None
    EMBEDDING_MODEL: str = "text-embedding-004"
    EMBEDDING_DIMENSIONS: int = 1536

    # Upload & Processing Limits
    MAX_UPLOAD_MB: int = 15
    MAX_DOCUMENT_PAGES: int = 300
    MAX_CHUNKS_PER_DOCUMENT: int = 3000
    AI_REQUEST_TIMEOUT_SECONDS: int = 30
    AI_MAX_RETRIES: int = 2
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.FRONTEND_ORIGINS.split(",") if origin.strip()]


settings = Settings()
