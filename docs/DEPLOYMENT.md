# CORTEXA AI — Deployment Runbook

## Before deployment
1. Create Supabase project.
2. Enable pgvector extension.
3. Apply checked-in SQL migrations.
4. Create a private Storage bucket.
5. Configure Auth redirect URLs for local and deployed frontend.
6. Create Groq and Gemini API credentials.
7. Select a supported embedding API and configure its key/model.
8. Set Vercel and Render environment variables.

## Vercel frontend
- Root directory: `apps/web` if using the recommended monorepo layout.
- Build command: package-manager build script.
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Add backend public base URL.
- Never add service-role or AI provider secrets to `NEXT_PUBLIC_*`.
- Configure production domain later and update Supabase redirect URLs.

## Render backend
- Build from `apps/api/Dockerfile` or configured root.
- Set start command to run Uvicorn on `0.0.0.0:$PORT`.
- Add backend secrets in Render environment settings.
- Add health check path `/api/v1/health`.
- Configure allowed frontend origins exactly.
- Use a persistent external object store (Supabase Storage) for uploads; do not rely on container filesystem persistence.
- Build and measure image. Target under 500 MB.

## GitHub Actions
Run lint, typecheck, unit tests, security checks, and build on pull requests. Configure deployment only after CI succeeds. Vercel/Render Git integration is convenient, but deployment automation is not a substitute for tests.

## Custom domain later
- Add DNS records exactly as provided by Vercel.
- Enable HTTPS.
- Update CORS allowlist.
- Update Supabase Auth Site URL and redirect allowlist.
- Update canonical metadata and sitemap host.
- Verify cookies, OAuth callbacks, email links, and CORS in production.

## Rollback
Keep prior successful deploys available. Use backward-compatible DB migrations. For destructive schema changes, deploy additive schema first, migrate data, then remove old columns in a later release.
