# Workspace

## Overview

**SmartTextbook v1.0.0** — AI-powered BYOK educational platform by Dr Simon Wang (Lecturer & Innovation Officer, Language Centre, Hong Kong Baptist University).

Dual focus:
1. **Chapter-to-Lesson Builder** — converts articles/chapters/URLs/PDFs into structured interactive lessons with summary, key concepts, quiz, mind map, and an AI tutor chat. BYOK: users supply their own LLM API key (or use access code `IEEE2026` for server-side compute).
2. **IEEE ProComm Workshop Demos** — open-source interactive lesson demos built from IEEE ProComm articles, with xAPI tracking, BYOK AI tutor, and certificate generation. Collaboration with Dr Traci Nathans-Kelly (Cornell / IEEE ProComm VP Content).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Validation**: Zod (`zod/v4`)
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (API server)
- **AI Provider**: BYOK + server-side proxy via Replit AI integration (IEEE2026 code)
- **Frontend**: React + Vite, Tailwind CSS, Shadcn UI
- **Storage**: Browser `localStorage` (primary) + PostgreSQL via Drizzle ORM

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/              # Express API — AI processing, xAPI, certificates, lesson gen
│   ├── lesson-builder/          # React + Vite frontend (Lesson Builder + IEEE demos)
│   │   └── public/
│   │       ├── listening-demo.html          # Demo 1: Leydens & Lucena (2009)
│   │       ├── style-congruency-demo.html   # Demo 2: Hendriks et al. (2012)
│   │       └── procomm2026.html             # ProComm 2026 workshop page
│   └── ieee-procomm-deck/       # 12-slide Vite React pitch deck for Dr Traci meeting
├── lib/
│   ├── api-spec/                # OpenAPI spec + Orval codegen config
│   ├── api-client-react/        # Generated React Query hooks
│   ├── api-zod/                 # Generated Zod schemas from OpenAPI
│   ├── db/                      # Drizzle ORM schema
│   ├── integrations-openai-ai-server/   # Server-side OpenAI batch/image/audio utilities
│   └── integrations-openai-ai-react/   # React hooks for OpenAI audio
├── scripts/                     # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Architecture

### Lesson Builder

1. **Lesson generation**: `POST /api/generate-lesson` — synchronous AI call, returns complete lesson JSON. Supports `IEEE2026` as `apiKey` for server-side compute (no personal key needed). Client stores lesson in `localStorage`.
2. **Chat**: `POST /api/chat` — stateless SSE streaming. Client sends full lesson context per request.
3. **URL fetching**: `POST /api/fetch-url` — fetches and extracts readable text from a URL.
4. **Lesson Sharing**: `POST /api/share` stores lesson JSON in PostgreSQL (90-day expiry). `GET /api/shared/:id` retrieves it.

### IEEE ProComm Demos

Interactive HTML demos with full lesson flow:
- 3-4 sections with narration (Web Speech API)
- 3 quiz questions with xAPI tracking
- BYOK AI tutor panel (DeepSeek/Gemini/OpenAI — DeepSeek/Gemini recommended for HK/mainland users)
- `IEEE2026` access code → server-side AI proxy via `/api/ai-tutor` (no personal key needed)
- Certificate generation via `/api/demo-cert`

xAPI statements sent to `/api/xapi` (stored in PostgreSQL).

## IEEE2026 Server-Side AI Access

When `apiKey === "IEEE2026"` is sent to `/api/generate-lesson` or `/api/ai-tutor`:
- Bypasses all external provider credentials
- Uses Replit AI proxy (`AI_INTEGRATIONS_OPENAI_BASE_URL` + `AI_INTEGRATIONS_OPENAI_API_KEY`)
- Falls back to DeepSeek if `DEEPSEEK_API_KEY` env var is set
- Designed for workshop participants — no personal API key required
- Demo AI tutor panels: DeepSeek → Gemini → OpenAI ordering (HK-accessible first)

## BYOK Providers

API keys stored in browser `localStorage` only — never sent to our servers (except when `IEEE2026` routes to our proxy).

Supported: OpenAI, Google Gemini, DeepSeek ✓ HK, OpenRouter, Groq, Mistral, Together AI, MiniMax, Grok, Kimi (Moonshot), Poe, Custom endpoint.

## API Endpoints

- `POST /api/generate-lesson` — AI lesson generation (BYOK or `IEEE2026`)
- `POST /api/ai-tutor` — Demo AI tutor (IEEE2026 or BYOK)
- `POST /api/chat` — SSE streaming chat (BYOK)
- `POST /api/fetch-url` — Fetch and extract text from a URL
- `POST /api/generate-slides` — Generate Reveal.js HTML slide deck
- `POST /api/generate-mindmap` — Generate Mermaid mind map
- `POST /api/xapi` — Store xAPI statement (learning events from demos)
- `GET /api/xapi/session/:sessionId` — Retrieve xAPI statements by session
- `POST /api/demo-cert` — Issue demo completion certificate
- `GET /api/demo-cert/:id` — Retrieve demo certificate
- `POST /api/share` — Store lesson in DB
- `GET /api/shared/:id` — Retrieve shared lesson
- `GET/POST /api/shared/:id/comments` — Comments on shared lessons
- `POST /api/ieee/parse-teaching-case` — AI-parse article into IEEE Teaching Case sections
- `POST /api/ieee/generate-lesson` — Generate interactive lesson from Teaching Case
- `GET /api/ieee/catalog` — Public catalog of approved lessons
- `POST /api/ieee/submissions` — Create draft submission (auth required)
- `POST /api/ieee/submissions/:id/submit` — Submit draft for review (auth required)
- `POST /api/ieee/submissions/:id/resubmit` — Resubmit rejected submission (auth required)
- `GET /api/ieee/submissions/:id` — Get submission detail (admin/owner/approved)
- `GET /api/ieee/submissions` — List submissions (admin sees all, author sees own)
- `PATCH /api/ieee/submissions/:id` — Update submission (admin: any field; author: draft/rejected only)

## Frontend Routes (Lesson Builder)

- `/` — Landing page with Dr Simon Wang bio, project deck link
- `/app` — Lesson library + Create Lesson form
- `/lessons/:id` — Lesson view: summary, quiz, mind map, source, AI chat
- `/shared/:id` — Public shared lesson (no auth)
- `/credits` — Credits & inspiration page
- `/listening-demo.html` — IEEE ProComm Demo 1 (Leydens & Lucena 2009)
- `/style-congruency-demo.html` — IEEE ProComm Demo 2 (Hendriks et al. 2012)
- `/procomm2026.html` — IEEE ProComm 2026 workshop page

### IEEE ProComm Platform Routes
- `/ieee` — Platform landing page explaining the IEEE Teaching Case → Interactive Lesson workflow
- `/ieee/catalog` — Public catalog of approved IEEE ProComm lessons (searchable, filterable by topic/Bloom's level/year)
- `/ieee/lesson/:id` — Modular learner experience: Introduction → Case Narrative → Key Concepts → Knowledge Check → Reflection → AI Tutor → Summary, with full xAPI statement emission
- `/ieee/author` — Volunteer author dashboard (shows submissions by email with status tracking)
- `/ieee/author/new` — 3-step submission wizard: upload article → parse IEEE Teaching Case sections → generate lesson → review & submit for review
- `/ieee/author/edit/:id` — Edit rejected submission and resubmit for review
- `/ieee/admin` — Admin review queue (key-protected): lists all submissions, inline content preview, approve/reject with notes

## IEEE ProComm Pitch Deck

12-slide Vite React deck at `/ieee-procomm-deck/`:
- Slide 1: Title (Dr Traci Nathans-Kelly + Dr Simon Wang)
- Slide 2: Progress (xAPI, DB, content library, demos)
- Slide 3: Live Demos (Listening + Style Congruency)
- Slide 4: Content Library (Google Sheet, author count)
- Slide 5: Author Outreach (14 emails, LinkedIn)
- Slide 6: Research Study Design
- Slide 7: Publications pipeline
- Slide 8: Timeline
- Slide 9: IEEE Learning Network context
- Slide 10: Next Steps
- Slides 11–12: Additional context

### Credits & Inspiration
- `/credits` route — shows Google Research's "Learn Your Way" and LearnLM as primary inspiration, learning science foundations (Dual Coding Theory, Active Recall), and 8 related open-source GitHub projects
- Landing page credits: **Dr. Simon Wang**, Lecturer in English & Innovation Officer, The Language Centre, Hong Kong Baptist University. GitHub: https://github.com/tesolchina/Smartextbook · Replit: https://replit.com/@SimonWang23/Smartextbook?v=1

## Development Commands

```bash
# Install dependencies
pnpm install

# Run codegen (after editing openapi.yaml)
pnpm --filter @workspace/api-spec run codegen

# Typecheck everything (must be zero errors before deploy)
pnpm run typecheck

# Build API server
pnpm --filter @workspace/api-server run build
```

## TypeScript Rules

- Always typecheck from the root: `pnpm run typecheck`
- Lib packages: composite + emitDeclarationOnly
- Artifacts: noEmit leaf packages
- Root `tsconfig.json` references only lib packages (not artifacts)
- `lib/api-zod/src/index.ts`: exports only from `./generated/api` (not `./generated/types` — would cause duplicate export errors)

## Project Links

| Platform | URL |
|----------|-----|
| **Replit Production** | https://smartextbook.replit.app |
| **Replit Project** | https://replit.com/@SimonWang23/Smartextbook?v=1 |
| **GitHub Repository** | https://github.com/tesolchina/Smartextbook |
| **Google Drive — Project Folder** | https://drive.google.com/drive/folders/10qWbdDC-jtFYJ-GuwUyjIe0x_f_FniIi |
| **Google Drive — Skills & Architecture Docs** | https://drive.google.com/drive/folders/1abYfZer-gale8EeWcnV4qXqrOBhDvVds |
| **IEEE Demo 1 (Listening)** | https://smartextbook.replit.app/listening-demo.html |
| **IEEE Demo 2 (Style Congruency)** | https://smartextbook.replit.app/style-congruency-demo.html |
| **ProComm 2026 Workshop Page** | https://smartextbook.replit.app/procomm2026.html |
| **IEEE ProComm Pitch Deck** | https://smartextbook.replit.app/ieee-procomm-deck/ |

## Key Collaborators

- **Dr Simon Wang** — simonwang@hkbu.edu.hk — Lecturer & Innovation Officer, Language Centre, HKBU
- **Dr Traci Nathans-Kelly** — tracink.ieee@gmail.com — VP Content, IEEE ProComm / Cornell University

## Reusable Skills (docs/skills/)

All skill docs are prefixed `SmartTextbook-` for cross-project distinction. Also uploaded to Google Drive Skills folder above.

| File | Pattern |
|------|---------|
| `SmartTextbook-SKILL-00-PROJECT-INDEX.md` | Master index with all links & env vars |
| `SmartTextbook-SKILL-01-BYOK-LLM-Provider.md` | Multi-provider LLM factory (BYOK) |
| `SmartTextbook-SKILL-02-Server-Side-AI-Proxy.md` | Access code → server-side AI proxy |
| `SmartTextbook-SKILL-03-xAPI-Learning-Tracking.md` | xAPI statements with PostgreSQL |
| `SmartTextbook-SKILL-04-Certificate-Generation.md` | SHA-256 tamper-proof certificates |
| `SmartTextbook-SKILL-05-Content-Sharing-PostgreSQL.md` | Temporary share links with auto-expiry |
| `SmartTextbook-SKILL-06-SSE-Streaming-Chat.md` | Server-Sent Events streaming AI chat |
| `SmartTextbook-SKILL-07-Google-Drive-OAuth2.md` | Google Drive OAuth2 + DOCX→PDF pipeline |

## Google Drive Credential Setup

| Secret Name | Purpose |
|-------------|---------|
| `GOOGLE_CLIENT_ID` | OAuth2 Client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth2 Client Secret |
| `Google_refresh_token_drive` | Drive API refresh token (mixed-case, project-specific) |
| `GOOGLE_DRIVE_PROJECT_FOLDER_ID` | Project root folder ID (env var, not secret) |

To get a new refresh token: [Google OAuth Playground](https://developers.google.com/oauthplayground) → scope `https://www.googleapis.com/auth/drive` → use own credentials → exchange for tokens.

## Privacy

- BYOK: keys in localStorage only, sent directly to chosen AI provider
- IEEE2026: access code only; AI requests proxied through Replit server — no personal credentials stored
- xAPI data: pseudonymised, stored in project PostgreSQL
