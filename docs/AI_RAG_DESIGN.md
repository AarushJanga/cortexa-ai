# CORTEXA AI — AI & RAG System Design Specification

## Overview
CORTEXA AI's Retrieval Augmented Generation (RAG) architecture is engineered for low latency, zero hallucinations on document context, and automatic fallback resilience.

## 1. Provider Topology & Fallback Policy

```
[User Query + Document Filter]
              │
              ▼
   [Embedding Generation] ──(1536 dim vector)
              │
              ▼
   [Supabase pgvector Match] ──(User-Isolated Filtered Retrieval)
              │
              ▼
    [Context Sanitizer] ──(Prompt Injection Quarantining)
              │
              ▼
   [Groq Primary Engine] ──(Llama 3.3 70B Versatile / Mixtral 8x7b)
        │            │
  (200 OK)       (5xx / Timeout / Rate Limit exhausted)
        │            │
        ▼            ▼
   [Response]   [Gemini Fallback Engine] ──(Gemini 1.5 Pro / Flash)
                     │
                 [Response]
```

### Circuit Breaker & Retry Constraints
- **Primary Provider**: Groq API (`llama-3.3-70b-versatile`)
- **Fallback Provider**: Google Gemini API (`gemini-1.5-flash` or `gemini-1.5-pro`)
- **Retry Policy**: 2 retries with exponential backoff and random jitter (1s base, factor 2).
- **Fallback Trigger**: Only retryable network failures, HTTP 500/502/503/504, or 429 rate limit errors trigger fallback. Client errors (400, 401, 403, 422) fail immediately and return user-facing actionable error messages.

## 2. Document Ingestion Pipeline

1. **Validation & Isolation**:
   - Supported Formats: `.pdf`, `.pptx`, `.docx`, `.txt`.
   - Max file size: 15 MB (configurable via `MAX_UPLOAD_MB`).
   - Magic bytes / MIME validation against extension spoofing.
   - Files stored with random UUID filenames in private Supabase Storage bucket (`student-documents`).

2. **Extraction**:
   - `pypdf`: Extracts text preserving page indices (`page_number`).
   - `python-docx`: Extracts document paragraphs and tables preserving section titles.
   - `python-pptx`: Extracts slide notes and shape text preserving `slide_number`.
   - Plain text / markdown: Preserves header structures.

3. **Boundary-Aware Chunking**:
   - Chunk size target: ~500-800 characters / ~150-200 tokens.
   - Overlap: 100 characters.
   - Boundary preference: Paragraph breaks (`\n\n`), sentence endings (`. `), then space boundaries. Never split mid-word.
   - Preserved metadata: `document_id`, `user_id`, `chunk_index`, `page_number`, `slide_number`, `char_length`.

4. **Vector Persisting**:
   - Embeddings generated via configured embedding provider.
   - Inserted into `document_chunks` table with `user_id` strictly attached.

## 3. Grounded Retrieval & Citation Mechanics

- Retrieval query executes `match_document_chunks` with `filter_user_id` set to the verified JWT user ID.
- Prompts delineate untrusted context:
  ```text
  <untrusted_document_context>
  [Page 3] Document content here...
  </untrusted_document_context>
  ```
- Strict instructions enforce:
  1. Rely only on the provided context.
  2. If the answer cannot be found in the context, explicitly state: *"I cannot find the answer to this question in your uploaded document."*
  3. Every claim must cite the specific source page or slide number using structured bracket format: `[Source: Page X]`.

## 4. Security & Prompt Injection Defenses
- Documents are never allowed to override system instructions or issue commands.
- External URLs are never rendered as raw executable tags.
- Logs strictly redact document text, user resumes, API tokens, and session JWTs.
