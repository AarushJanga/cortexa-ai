# Environment variables (placeholders only)

## Frontend `.env.local`
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_BASE_URL=

## Backend `.env`
APP_ENV=development
PORT=8000
FRONTEND_ORIGINS=http://localhost:3000
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET_OR_JWKS_URL=
SUPABASE_STORAGE_BUCKET=student-documents

GROQ_API_KEY=
GROQ_CHAT_MODEL=
GEMINI_API_KEY=
GEMINI_CHAT_MODEL=

# Choose an actual embedding provider/model that supports embeddings.
EMBEDDING_PROVIDER=
EMBEDDING_API_KEY=
EMBEDDING_MODEL=
EMBEDDING_DIMENSIONS=

MAX_UPLOAD_MB=15
MAX_DOCUMENT_PAGES=300
MAX_CHUNKS_PER_DOCUMENT=3000
AI_REQUEST_TIMEOUT_SECONDS=30
AI_MAX_RETRIES=2
LOG_LEVEL=INFO

Do not commit real values. Never prefix backend secrets with NEXT_PUBLIC_. Use separate credentials and projects for development and production where practical.
