# Workspace

## Overview

Chapter-to-Lesson Builder — an interactive tool that converts book chapters (or any web URL) into structured lessons with an embedded AI tutor. Paste in a chapter or provide a URL, and the app uses AI to generate a summary, key concepts glossary, and a comprehension quiz. A persistent AI tutor chatbot lets students ask questions about the material in real time.

Built as an open-source project for Replit and GitHub collaboration. Users bring their own LLM API keys (BYOK). Lessons are stored in the browser's localStorage. Teachers can optionally publish lessons via a public share link (stored server-side in PostgreSQL for 90 days).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Validation**: Zod (`zod/v4`)
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI Provider**: BYOK — users supply their own API keys for any OpenAI-compatible provider
- **Frontend**: React + Vite, Tailwind CSS, Shadcn UI
- **Storage**: Browser `localStorage` (primary) + PostgreSQL via Drizzle ORM (shared lessons + comments)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (AI processing, URL fetching — fully stateless)
│   └── lesson-builder/     # React + Vite frontend
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM (kept for future use, not actively used)
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Architecture

Primarily stateless — lesson data lives in the browser:

1. **Lesson generation**: `POST /api/generate-lesson` — synchronous AI call, returns complete lesson JSON. Client generates a UUID and stores the lesson in `localStorage`.
2. **Chat**: `POST /api/chat` — stateless SSE streaming. Client sends the full lesson context (title, summary, keyConcepts, chapterText) in every request.
3. **URL fetching**: `POST /api/fetch-url` — fetches and extracts readable text from a URL.
4. **Frontend storage**: `useLessonsStore` hook reads/writes to `localStorage` under the key `lessonbuilder_lessons`.
5. **Lesson Sharing** (opt-in): `POST /api/share` stores lesson JSON in PostgreSQL with a 16-char UUID and 90-day expiry. `GET /api/shared/:id` retrieves it. Public `/shared/:id` page renders the lesson for students.
6. **Comments**: `GET/POST /api/shared/:id/comments` — students on the shared lesson page can read and leave comments stored in PostgreSQL.

## Features

### Core User Flows
1. **Create a Lesson** — Paste chapter text OR provide a URL to fetch content → pick a title → AI processes synchronously → saved to localStorage → redirected to lesson view
2. **View a Lesson** — Four tabs: Summary (AI-generated) + Key Concepts glossary, Quiz (multiple-choice), Mind Map (Mermaid), Source text
3. **AI Tutor Chat** — Sidebar chat in lesson view; tutor receives full lesson context per message; streams responses
4. **Share a Lesson** — Teacher clicks "Share" → confirms public → lesson stored to DB → copyable link generated → students visit `/shared/:id` and can read + leave comments
5. **Learning Report** — Students (or teachers) click "Report" → enter name + reflections → download as Markdown or email via their email client (mailto:). Quiz score auto-populated if quiz was completed.

### BYOK (Bring Your Own Key)
Users set their own API key via the "Set API Key" button in the navbar. Supported providers:
- **OpenAI** — GPT-4o, GPT-4o Mini, o3-mini, etc.
- **Google Gemini** — Gemini 2.0 Flash, 1.5 Pro, etc.
- **DeepSeek** — DeepSeek Chat (V3), Reasoner (R1)
- **OpenRouter** — Access 300+ models (Claude, Llama, Mistral, etc.)
- **Groq** — Fast Llama 3.3, Mixtral, Gemma 2
- **Mistral AI** — Mistral Large, Small, Nemo
- **Together AI** — Open source models at scale
- **MiniMax** — MiniMax Text-01
- **Custom** — Any OpenAI-compatible endpoint

API keys are stored in `localStorage` only — never sent to our servers.

### URL Content Fetching
Users can provide a URL instead of pasting text. The backend fetches the page, extracts readable text using `cheerio`, and populates the form. Works best with articles, Wikipedia, documentation, and text-heavy pages.

### API Endpoints
- `POST /api/generate-lesson` — Synchronous AI lesson generation (requires `llmConfig`)
- `POST /api/chat` — SSE streaming stateless chat (requires `llmConfig` + `lessonContext`)
- `POST /api/fetch-url` — Fetch and extract text content from a URL
- `POST /api/share` — Store lesson in DB, returns `{ shareId, expiresAt }` (90-day public link)
- `GET /api/shared/:id` — Retrieve shared lesson (404 if not found, 410 if expired)
- `GET /api/shared/:id/comments` — Get all comments for a shared lesson
- `POST /api/shared/:id/comments` — Post a new comment (`authorName`, `body`)

### AI Processing
- `LLM client factory` at `artifacts/api-server/src/lib/llm-client.ts` — creates an OpenAI-SDK client with the right base URL for each provider
- Lesson generation is **synchronous** — the API call waits for AI to complete and returns full JSON
- Chat is **stateless** — lesson context (title, summary, keyConcepts, chapterText) is sent with each request

### Frontend Routes
- `/` — Landing / teaser page: hero, 5-slide feature carousel ("How it works"), stats strip, Dr. Simon Wang credits card, GitHub + Replit remix links, CTA to open app
- `/app` — Lesson library (localStorage) + "Create a Lesson" form
- `/lessons/:id` — Individual lesson view: summary tab, interactive quiz, mind map, source text, chat sidebar; Share / Report / Export buttons
- `/shared/:id` — Public shared lesson view (no auth needed): same tabs + AI chat + student comments section
- `/credits` — Full credits page: Google "Learn Your Way" inspiration, LearnLM, 8+ related open-source projects
- `/about` links to `/` in the navbar

### Credits & Inspiration
- `/credits` route — shows Google Research's "Learn Your Way" and LearnLM as primary inspiration, learning science foundations (Dual Coding Theory, Active Recall), and 8 related open-source GitHub projects
- Landing page credits: **Dr. Simon Wang**, Lecturer in English & Innovation Officer, The Language Centre, Hong Kong Baptist University. GitHub: https://github.com/tesolchina/Smartextbook · Replit: https://replit.com/@SimonWang23/Smartextbook?v=1

## Development Commands

```bash
# Install dependencies
pnpm install

# Run codegen (after editing openapi.yaml)
pnpm --filter @workspace/api-spec run codegen

# Start API server
pnpm --filter @workspace/api-server run dev

# Start frontend
pnpm --filter @workspace/lesson-builder run dev

# Typecheck everything
pnpm run typecheck
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all lib packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — only `.d.ts` files during typecheck; JS bundling by esbuild/vite
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in `references`

## Collaborative Workflow Notes

This project is designed for open-source collaboration on Replit and GitHub. When contributing:
- All API contracts are defined first in `lib/api-spec/openapi.yaml`
- Run `pnpm --filter @workspace/api-spec run codegen` after any spec changes
- Backend routes live in `artifacts/api-server/src/routes/`
- Frontend pages live in `artifacts/lesson-builder/src/pages/`
- LLM provider definitions live in `artifacts/lesson-builder/src/lib/providers.ts`
- Lesson storage hook: `artifacts/lesson-builder/src/hooks/use-lessons-store.ts`
