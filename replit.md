# Workspace

## Overview

Chapter-to-Lesson Builder — an interactive tool that converts book chapters (or any web URL) into structured lessons with an embedded AI tutor. Paste in a chapter or provide a URL, and the app uses AI to generate a summary, key concepts glossary, and a comprehension quiz. A persistent AI tutor chatbot lets students ask questions about the material in real time.

Built as an open-source project for Replit and GitHub collaboration. Users bring their own LLM API keys (BYOK).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI Provider**: BYOK — users supply their own API keys for any OpenAI-compatible provider
- **Frontend**: React + Vite, Tailwind CSS, Shadcn UI

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (AI processing, CRUD, URL fetching)
│   └── lesson-builder/     # React + Vite frontend
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Features

### Core User Flows
1. **Create a Lesson** — Paste chapter text OR provide a URL to fetch content → pick a title → AI processes in background → Lesson card shows status
2. **View a Lesson** — Three tabs: Summary (AI-generated) + Key Concepts glossary, Quiz (multiple-choice), Original Chapter text
3. **AI Tutor Chat** — Sidebar chat in lesson view; tutor knows the full chapter + summary; streams responses

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

Keys are stored in `localStorage` only — never sent to our servers.

### URL Content Fetching
Users can provide a URL instead of pasting text. The backend fetches the page, extracts readable text using `cheerio`, and populates the form. Works best with articles, Wikipedia, documentation, and text-heavy pages.

### API Endpoints
- `GET /api/lessons` — List all lessons
- `POST /api/lessons` — Create lesson (requires `llmConfig: {provider, apiKey, model}`)
- `GET /api/lessons/:id` — Get lesson with full content
- `DELETE /api/lessons/:id` — Delete a lesson
- `POST /api/lessons/:id/chat` — SSE streaming chat (requires `llmConfig`)
- `GET /api/lessons/:id/chat-history` — (reserved, returns empty)
- `POST /api/fetch-url` — Fetch and extract text content from a URL

### AI Processing
- `LLM client factory` at `artifacts/api-server/src/lib/llm-client.ts` — creates an OpenAI-SDK client with the right base URL for each provider
- Lesson creation: immediately returns `{status: "processing"}`, then async AI call populates summary, key concepts, and quiz questions
- Chat: SSE streaming responses, tutor has full lesson context
- Frontend polls `GET /api/lessons/:id` every 3 seconds until `status === "ready"`

## Database Schema

### `lessons` table
| Column | Type | Notes |
|---|---|---|
| id | serial | PK |
| title | text | User-provided lesson title |
| chapter_text | text | Full input chapter |
| summary | text | AI-generated summary |
| key_concepts | jsonb | Array of {term, definition} |
| quiz_questions | jsonb | Array of {question, options[], correctIndex, explanation} |
| status | text | "processing" \| "ready" \| "error" |
| created_at | timestamptz | Auto |
| llm_provider | text | Provider used for this lesson |
| llm_api_key | text | Temp stored for async processing (cleared after) |
| llm_model | text | Model used |
| llm_base_url | text | Custom base URL (if provider=custom) |

## Development Commands

```bash
# Install dependencies
pnpm install

# Run codegen (after editing openapi.yaml)
pnpm --filter @workspace/api-spec run codegen

# Push DB schema
pnpm --filter @workspace/db run push

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
- DB schema changes: edit `lib/db/src/schema/`, then run `pnpm --filter @workspace/db run push`
- LLM provider definitions live in `artifacts/lesson-builder/src/lib/providers.ts`
