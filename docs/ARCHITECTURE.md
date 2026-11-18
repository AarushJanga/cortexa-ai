# CORTEXA AI — Architecture & Engineering Decisions

## Recommended MVP topology

- `apps/web`: Next.js App Router + TypeScript, deployed to Vercel.
- `apps/api`: FastAPI, deployed to Render as a slim container.
- Supabase: Auth, PostgreSQL + pgvector, private Storage.
- Groq + Gemini: text-generation providers behind a backend abstraction.
- Embeddings: separate configurable provider; select a lightweight API with explicit embedding support. Do not assume chat models can create embeddings.
- GitHub Actions: CI checks before deploy.

## Why PostgreSQL only?

Supabase PostgreSQL supports relational records, JSONB metadata, transactions, and pgvector similarity search. Adding MongoDB and Redis to an MVP adds operational work without a proven need. Introduce Redis only for a concrete need such as distributed rate limits, job queues, or cache coordination.

## RAG processing

Upload -> validate -> private storage -> extract -> chunk -> embed -> persist -> retrieve with owner/document filters -> generate grounded answer -> citations.

The vector search query must include authenticated ownership constraints. Never fetch global chunks and filter in application memory after retrieval.

## AI fallback policy

1. Normalize the provider interface.
2. Set per-provider timeout and maximum output tokens.
3. Retry transient network/5xx/rate-limit errors a bounded number of times.
4. On exhausted retryable failure, invoke Gemini fallback.
5. Do not fallback for invalid input, authentication failures, authorization failures, or policy rejection.
6. Record provider, model, latency, request ID, and outcome; redact content and secrets.
7. Add circuit breaker/cooldown to avoid hammering a failed provider.

## Render image budget

Use a slim Python base image, pinned minimal dependencies, no local model weights, no build tools in final image, no package cache, and `.dockerignore`. Measure with Docker after building. The 500 MB target is a target, not a guarantee.

## Background work

For MVP, small files can process synchronously with strict timeouts and limits. Keep a job interface so a managed queue can be added later. Do not use in-process background tasks for durable long-running jobs on multi-instance production.

## Domain and CORS

Initially use Vercel and Render provided domains. Configure exact allowed frontend origins. When a custom domain is purchased, update CORS, Supabase Auth redirect URLs, cookie settings, canonical URLs, and environment variables. Use HTTPS only.
