# Debug

This folder tracks known bugs, error logs, and debugging notes for the LessonBuilder project.

## How to Use
- Log bugs with steps to reproduce, expected vs. actual behavior
- Record root cause analysis after fixing
- Track recurring issues and patterns

---

## Bug Log

| # | Description | Priority | Status | Fixed In |
|---|-------------|----------|--------|----------|
| 1 | URL fetcher fails silently on SPA sites (React/Vue/Next.js) | High | ✅ Fixed | 2026-04-08 |
| 2 | SSE chat error leaves empty assistant message bubble in UI | High | ✅ Fixed | 2026-04-08 |
| 3 | Expired shared lessons never deleted from database | High | ✅ Fixed | 2026-04-08 |

---

## Fix Details

### Bug #1 — URL Fetching Fails on SPA Sites
**File:** `artifacts/api-server/src/routes/fetch-url.ts`

**Problem:** The server fetches HTML with a simple HTTP request and uses cheerio to parse it. SPA sites (React, Vue, Next.js, Angular, Nuxt) render content via JavaScript — the raw HTML is nearly empty. The scraper returned a generic "could not extract text" error with no guidance for the user.

**Root Cause:** cheerio is a static HTML parser. It cannot execute JavaScript, so it only sees the shell HTML of SPA pages.

**Fix Applied:**
- Added SPA detection by checking for common framework markers in the raw HTML (`id="root"`, `id="app"`, `id="__next"`, `data-reactroot`, `ng-version`, `__nuxt`, etc.)
- Added JSON-LD structured data extraction as a fallback — many modern and SPA sites embed their content in `<script type="application/ld+json">` blocks
- Returns a specific, actionable error message when a SPA is detected: _"This page is a JavaScript-rendered app and its content cannot be fetched directly. Please open the page in your browser, select all the text, and paste it manually."_

---

### Bug #2 — Empty AI Message Bubble Left After SSE Error
**File:** `artifacts/lesson-builder/src/hooks/use-chat.ts`

**Problem:** When the AI tutor stream begins, a placeholder assistant message (`{ role: "assistant", content: "" }`) is added to the chat UI immediately. If an error arrives from the server mid-stream (e.g., invalid API key, network failure), the error was correctly shown to the user, but the empty placeholder message bubble remained visible in the chat, creating a confusing blank AI message.

**Root Cause:** The error handling path (`data.error`) set the error state and stopped the stream but did not remove the placeholder message from the messages array.

**Fix Applied:**
- Added cleanup inside the `data.error` handler: after setting the error, if the last message in the array is an assistant message with no content, it is removed from state — same pattern used by `stopStreaming()`.

---

### Bug #3 — Expired Shared Lessons Accumulate in Database Forever
**File:** `artifacts/api-server/src/routes/share.ts`

**Problem:** Shared lessons have a 90-day TTL (`expiresAt` column). The GET handler correctly returns 404 for expired rows, but the rows were never actually deleted from PostgreSQL. Over time this would cause unbounded database growth.

**Root Cause:** No cleanup job existed. There was no cron scheduler or periodic worker in the codebase.

**Fix Applied:**
- Added `cleanupExpiredShares()` async function: deletes all rows in `shared_lessons` where `expiresAt < NOW()` using Drizzle ORM's `lt()` operator.
- Called on **server startup** (module load) to immediately purge old records.
- Called **probabilistically** (~2% chance) on each `POST /share` request — a lightweight approach that avoids the need for a separate cron service while ensuring cleanup happens regularly over time.
- Errors in cleanup are caught and silenced (non-fatal) so they never affect normal user requests.
