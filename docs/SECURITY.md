# CORTEXA AI — Security Checklist & Threat Model

Security is continuous risk reduction, not a promise of perfect security.

## Main assets
- Student identity and profile
- Uploaded lecture notes and documents
- Resume and career information
- Chat history and generated study material
- API keys and service credentials
- Database and storage access

## Threats and mitigations

| Threat | Required mitigation |
|---|---|
| IDOR / cross-user access | Verify JWT; derive user ID server-side; ownership checks on every operation; RLS |
| Leaked service-role key | Backend only; secret manager/env; secret scanning |
| Malicious uploads | Size/type/signature checks; random names; parser timeouts; isolated processing; malware scan integration |
| Prompt injection in files | Treat retrieved text as untrusted; never execute instructions/tools from documents |
| XSS | Safe Markdown renderer; sanitize HTML; CSP |
| SQL injection | Parameterized queries; no string-built SQL |
| Brute force / AI abuse | Rate limits, quotas, bounded tokens, request size limits |
| SSRF | No arbitrary server-side URL fetching; strict allowlists if URL import is added |
| Sensitive logs | Redaction; no raw resume/document content or tokens |
| Provider outage | Bounded retry, fallback, circuit breaker, graceful errors |
| Storage exposure | Private bucket, short-lived signed URLs, ownership validation |
| Data loss | Migrations, backups, deletion workflow, restore procedure |

## Release checklist
- [ ] RLS enabled on all user-owned tables.
- [ ] Policies tested with at least two separate test users.
- [ ] Backend verifies Supabase JWT signature/claims.
- [ ] Every route checks object ownership.
- [ ] Private storage bucket and signed URL expiry configured.
- [ ] File size, format, and parser limits enforced.
- [ ] Secrets absent from Git history and frontend bundle.
- [ ] CORS restricted to known origins.
- [ ] Rate limits on expensive endpoints.
- [ ] CSP and security headers reviewed.
- [ ] Safe Markdown rendering.
- [ ] Provider prompts defend against untrusted retrieved text.
- [ ] Account/data deletion behavior tested.
- [ ] Dependency and secret scans in CI.
- [ ] Privacy notice and retention policy prepared before public launch.

## Privacy principles
Collect only what is needed. Obtain explicit consent before resume analysis. Explain third-party AI processing. Provide a deletion path. Avoid using uploaded student content for model training. Confirm provider data-retention terms before production.
