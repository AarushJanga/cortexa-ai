# CORTEXA AI — Professional Test Plan

## Test layers

### Unit
- File type and size validation
- PDF/PPTX/DOCX extraction
- Chunking and metadata preservation
- Embedding adapter
- Similarity retrieval filters
- Groq/Gemini provider routing
- Retry/fallback/circuit breaker
- Quiz scoring
- Task validation
- Resume parsing and analysis schema

### Integration
- Supabase Auth token verification
- RLS and backend ownership checks
- Private storage upload/download/delete
- Document-to-chunks lifecycle
- Chat persistence and citations
- Quiz generation and attempts
- Flashcard CRUD
- Task CRUD
- Resume consent and deletion
- Placement tracker CRUD

### Security
- User A cannot read/update/delete User B data
- Guessed document/chunk/conversation IDs
- Invalid/expired JWT
- Oversized and malformed uploads
- MIME spoofing and unsupported extensions
- Path traversal filenames
- Prompt injection in document content
- XSS in generated Markdown
- Rate-limit enforcement
- Secret scan

### Frontend E2E (Playwright)
1. Register/login using test configuration.
2. Open dashboard.
3. Upload synthetic fixture document.
4. Wait for ready state.
5. Ask a question whose answer is present.
6. Verify answer and page citation.
7. Ask a question not present and verify abstention.
8. Generate quiz, submit, and review score.
9. Create and complete a task.
10. Create and study flashcards.
11. Change light/dark theme.
12. Verify mobile navigation and key screens.

## Test fixtures
Use synthetic lecture notes and fake resumes only. Never use real student data in automated tests.

## CI gates
- Python formatting/lint
- Python type checking
- Backend unit/integration tests
- Frontend lint/typecheck
- Frontend unit tests
- Playwright smoke tests where CI secrets/config permit
- Dependency and secret scans
- Frontend production build
- Backend Docker build and image-size report

## Reporting
Report exact command, pass/fail count, skipped tests, environment prerequisites, and known gaps. Do not mark unexecuted tests as passed.
