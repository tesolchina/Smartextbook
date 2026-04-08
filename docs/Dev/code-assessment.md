# Code Assessment — LessonBuilder (SmartTextbook)

Date: 2026-04-08

## Project Overview

LessonBuilder is a BYOK (Bring Your Own Key) educational platform. Users paste a chapter or URL and the app generates a summary, glossary, quiz, and mind map using their own AI API key. Lessons can be shared publicly via a 90-day link backed by PostgreSQL.

---

## Architecture

| Layer | Tech | Notes |
|-------|------|-------|
| Frontend | React + Vite + Tailwind + Shadcn | Client-side only, no SSR |
| Backend | Express 5 (Node.js) | Stateless proxy to LLM APIs |
| Storage (lessons) | Browser localStorage | Risk: 5–10 MB limit |
| Storage (shares) | PostgreSQL (Drizzle ORM) | 90-day TTL, no cleanup job |
| API Contract | OpenAPI 3.1 + Zod + Orval codegen | Strong typing enforced |
| AI Clients | llm-client.ts factory | Supports 10+ providers |

**Data flow:**
1. User submits text/URL → `POST /api/generate-lesson` → LLM → JSON → localStorage
2. AI Tutor → `POST /api/chat` → SSE stream → client renders
3. Share → `POST /api/share` → PostgreSQL → 16-char ID

---

## Strengths

- Strict TypeScript composite project setup with shared types
- Zod validation at API boundary (api-zod lib)
- `jsonrepair` library handles malformed LLM JSON responses gracefully
- Framer Motion + Shadcn give a polished, responsive UI
- BYOK model reduces server costs and privacy concerns

---

## Bugs & Issues

### High Priority

| # | File | Issue |
|---|------|-------|
| 1 | `api-server/src/routes/fetch-url.ts` | URL fetching uses simple cheerio selectors (`article`, `main`). Fails on SPAs (React/Vue/Angular sites) that require JS execution. |
| 2 | `api-server/src/routes/chat.ts` | If an error occurs mid-SSE stream, the server writes a JSON error object into the stream. Client must handle this edge case specifically or it shows as chat text. |
| 3 | `db/` (share feature) | No cron job or cleanup worker to delete expired share rows (90-day TTL). Database will grow indefinitely. |

### Medium Priority

| # | File | Issue |
|---|------|-------|
| 4 | `api-server/src/routes/generate-lesson.ts` (line ~103) | `chapterText` truncated to 9,000 chars. Long chapters lose detail silently. |
| 5 | `api-server/src/routes/chat.ts` (line ~30) | Chat context truncated to 4,000 chars. AI tutor "forgets" content from longer chapters. |
| 6 | `lesson-builder/src/hooks/use-lessons-store.ts` | Storing full lesson data in localStorage risks hitting the 5–10 MB browser limit with many lessons. |

### Low Priority

| # | File | Issue |
|---|------|-------|
| 7 | `lib/openai_ai_integrations/` | Appears to be a duplicate/legacy version of `lib/integrations-openai-ai-*`. Should be cleaned up. |
| 8 | Mind map prompt | Highly prescriptive Mermaid prompt limits AI creativity and flexibility. |

---

## Improvement Opportunities

### Performance
- Implement RAG (Retrieval-Augmented Generation): instead of truncating to 4,000 chars for chat, use lightweight client-side vector search to retrieve relevant chunks. This allows tutoring on full books.

### Reliability
- Add a database cleanup cron job (or Postgres scheduled function) to purge expired share rows.
- Add retry logic for LLM API calls on transient errors.

### UX
- Show a warning when a lesson's text was truncated before sending to the AI.
- Add a lesson size indicator in the library so users know when they're approaching localStorage limits.

### Code Quality
- Remove the duplicate `lib/openai_ai_integrations/` folder.
- Consider IndexedDB (via idb or Dexie.js) as a replacement for localStorage to support larger lesson data.

---

## File Map (Key Files)

| File | Purpose |
|------|---------|
| `lib/api-spec/openapi.yaml` | API source of truth |
| `artifacts/api-server/src/lib/llm-client.ts` | AI provider factory |
| `artifacts/api-server/src/routes/generate-lesson.ts` | Core lesson generation |
| `artifacts/api-server/src/routes/chat.ts` | AI tutor SSE stream |
| `artifacts/lesson-builder/src/hooks/use-lessons-store.ts` | All lesson data management |
| `artifacts/lesson-builder/src/pages/lesson-view.tsx` | Main learning UI |
| `artifacts/lesson-builder/src/pages/home.tsx` | Library + hero landing |
