# 📚 SmartTextbook — Chapter to Lesson Builder

> **Turn any chapter into a living lesson.**
> Paste a textbook chapter or URL and get an AI-powered summary, key-concept glossary, interactive quiz, and a personal AI tutor — all in your browser, with your own API key.

**🌐 Live demo → [smartextbook.replit.app](https://smartextbook.replit.app/)**
**🔁 Remix on Replit → [replit.com/@SimonWang23/Smartextbook](https://replit.com/@SimonWang23/Smartextbook?v=1)**

---

## ✨ What it does

| Step | Action | Output |
|------|--------|--------|
| 1 | Paste a chapter or drop in a URL | Text extracted automatically |
| 2 | AI generates a structured lesson | Summary + key-concept glossary |
| 3 | Take the interactive quiz | 5–8 multiple-choice questions with explanations |
| 4 | Chat with your AI tutor | Context-aware Q&A grounded in the chapter |
| 5 | Export a standalone lesson | Self-contained HTML file with embedded tutor |

### Key features

- **BYOK (Bring Your Own Key)** — supports 9+ LLM providers; keys stay in your browser, never on any server
- **Zero accounts** — all lessons stored in browser `localStorage`
- **AI tutor chat** — context-aware chatbot knows the full chapter text
- **Interactive quiz** — instant feedback, explanations, and score
- **HTML export** — download a self-contained lesson page with a customisable embedded tutor (choose name, teaching style, additional focus)
- **Open source** — fork it, remix it, self-host it

---

## 🤖 Supported AI providers

| Provider | Models | API key page |
|----------|--------|-------------|
| **OpenAI** | GPT-4o, GPT-4o Mini, GPT-4 Turbo, o1, o3-mini… | [platform.openai.com](https://platform.openai.com/api-keys) |
| **Google Gemini** | Gemini 2.0 Flash, 1.5 Pro, 1.5 Flash | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| **DeepSeek** | DeepSeek Chat (V3), Reasoner (R1) | [platform.deepseek.com](https://platform.deepseek.com) |
| **Grok (xAI)** | Grok 3, Grok 3 Mini, Grok 2, Grok Beta | [console.x.ai](https://console.x.ai) |
| **Mistral** | Mistral Large, Mistral Small, Codestral | [console.mistral.ai](https://console.mistral.ai) |
| **OpenRouter** | Claude, Llama, Mistral, 300+ models | [openrouter.ai](https://openrouter.ai/keys) |
| **Together AI** | Llama 3.3 70B, Qwen 2.5 72B, Mistral… | [api.together.ai](https://api.together.ai) |
| **MiniMax** | MiniMax Text-01, ABAB 6.5S | [intl.minimaxi.com](https://intl.minimaxi.com) |
| **Poe** | Claude 3.5, GPT-4o, Gemini, Llama… | [poe.com](https://poe.com) (subscription) |
| **Custom** | Any OpenAI-compatible endpoint | — |

---

## 🚀 Getting started

### Option A — Use the live site (no setup needed)

Go to **[smartextbook.replit.app](https://smartextbook.replit.app/)**, click **Open App**, enter your API key, and start building lessons.

### Option B — Remix on Replit (one click)

Click **[Remix on Replit](https://replit.com/@SimonWang23/Smartextbook?v=1)** and Replit will fork the project into your account. The AI agent will help you configure and run it.

### Option C — Deploy locally with an AI agent

> These instructions are written so an AI coding agent (Cursor, GitHub Copilot, Replit AI, etc.) can read this file and set up the project for you with minimal manual steps. Paste this README into your agent and ask it to follow the setup instructions below.

#### Prerequisites (tell your agent to check these)

- **Node.js 20+** — `node --version`
- **pnpm 9+** — `npm install -g pnpm` if missing
- **Git** — `git --version`

#### Step-by-step for the agent

```bash
# 1. Clone the repository
git clone https://github.com/tesolchina/Smartextbook.git
cd Smartextbook

# 2. Install all workspace dependencies
pnpm install

# 3. Set the session secret (used by the API server)
#    Create a .env file in artifacts/api-server/ with:
echo 'SESSION_SECRET=replace-with-a-random-string' > artifacts/api-server/.env

# 4. Start the API server (terminal 1)
pnpm --filter @workspace/api-server run dev
# → Runs on http://localhost:8080

# 5. Start the frontend (terminal 2)
pnpm --filter @workspace/lesson-builder run dev
# → Runs on http://localhost:5173 (or next free port)

# 6. Open the app
open http://localhost:5173
```

#### What the agent should verify after setup

- [ ] `http://localhost:8080/health` returns `{"status":"ok"}`
- [ ] `http://localhost:5173` shows the LessonBuilder landing page
- [ ] Clicking "Open App" navigates to the lesson library
- [ ] "Set API Key" button opens the provider/key configuration modal
- [ ] Entering a valid API key and clicking "Test Connection" returns a success message
- [ ] Creating a lesson with a short text sample completes successfully

#### Troubleshooting (give these hints to your agent)

| Symptom | Fix |
|---------|-----|
| `pnpm: command not found` | Run `npm install -g pnpm` |
| Port 8080 already in use | Set `PORT=8081` in `artifacts/api-server/.env` |
| Frontend shows blank screen | Check the Vite dev server console; ensure `VITE_API_BASE_URL` is not overriding the default |
| "API error: 401" in lesson generation | Your API key is invalid or has no credits |
| Poe provider fails | Poe requires a server-side proxy — it works on the live Replit deployment but not in pure browser mode locally |

#### Running the test suite

```bash
# Unit + integration tests (Vitest)
cd artifacts/lesson-builder
pnpm test

# Expected: 3 test files, 34 tests, all passing
```

---

## 🏗️ Project structure

```
Smartextbook/
├── artifacts/
│   ├── api-server/          # Express 5 API (AI calls, URL fetch, streaming chat)
│   │   └── src/
│   │       ├── routes/      # generate-lesson, chat, fetch-url, test-provider
│   │       └── lib/         # llm-client, poe-client
│   └── lesson-builder/      # React + Vite frontend
│       └── src/
│           ├── pages/       # landing, home (library), lesson-view, credits
│           ├── components/  # chat-sidebar, quiz-view, export-modal, …
│           ├── hooks/       # use-lessons-store, use-settings, use-chat
│           └── lib/         # providers, generate-html
├── lib/
│   ├── api-spec/            # OpenAPI spec + Orval codegen config
│   ├── api-client-react/    # Generated React Query hooks
│   └── api-zod/             # Generated Zod schemas
└── scripts/
    └── post-merge.sh        # Post-merge environment reconciliation
```

### Frontend routes

| Route | Page |
|-------|------|
| `/` | Landing page — feature carousel, credits, links |
| `/app` | Lesson library + create-lesson form |
| `/lessons/:id` | Lesson view — summary, quiz, chat, export |
| `/credits` | Full credits and inspiration page |

### Key API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/generate-lesson` | Synchronous AI lesson generation |
| `POST` | `/api/chat` | SSE streaming chat (stateless, full context per request) |
| `POST` | `/api/fetch-url` | Extract readable text from a URL |
| `POST` | `/api/test-provider` | Test an LLM provider connection (CORS-safe proxy) |

---

## 🛠️ Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI |
| Animation | Framer Motion |
| Backend | Express 5, TypeScript, esbuild |
| AI clients | OpenAI SDK (OpenAI-compatible) + custom Poe SSE client |
| Validation | Zod v4 |
| API codegen | Orval (from OpenAPI 3 spec) |
| Monorepo | pnpm workspaces |
| Storage | Browser `localStorage` only — no database |
| Testing | Vitest + Testing Library (34 unit tests) |

---

## 📦 HTML export

Every lesson can be exported as a **fully self-contained HTML file** — no server, no internet connection required after download. The export modal lets you:

- Name your AI tutor (default: "Aria")
- Choose a teaching style: *Clear Explainer*, *Socratic Guide*, *Exam Coach*, *Warm Mentor*
- Add a custom focus instruction
- Preview the generated system prompt before downloading

The downloaded file opens in any browser. On first load it asks the learner for their own API key, which is stored in that file's own `localStorage` slot. Poe is excluded from exports (Poe's API requires a server-side proxy which cannot run in a static file).

---

## 🤝 Contributing

Contributions are welcome. The fastest ways to contribute:

1. **Remix on Replit** — [replit.com/@SimonWang23/Smartextbook](https://replit.com/@SimonWang23/Smartextbook?v=1) — fork and edit directly in the browser with AI help
2. **Fork on GitHub** — clone, make changes, open a pull request against `master`

### Adding a new LLM provider

1. Add an entry to `artifacts/lesson-builder/src/lib/providers.ts`
2. If the provider is OpenAI-compatible, no backend changes are needed — the LLM client factory in `artifacts/api-server/src/lib/llm-client.ts` handles it automatically
3. For non-standard protocols (like Poe's SSE), add a custom client in `artifacts/api-server/src/lib/`
4. Update this README's provider table

### Code standards

- All source files should stay ≤ 500 lines — extract components if needed
- Run `pnpm run typecheck` from the root before opening a PR
- All new hooks/utilities should have Vitest unit tests

---

## 👤 Built by

**Dr. Simon Wang**
Lecturer in English & Innovation Officer
The Language Centre, Hong Kong Baptist University

Built with [Replit](https://replit.com) as an open educational tool to help language learners and educators transform dense reading material into structured, interactive study experiences.

Inspired by [Google's "Learn Your Way"](https://learnyourway.withgoogle.com/) experiment ([arXiv 2509.13348](https://arxiv.org/abs/2509.13348)) and the [LearnLM](https://blog.google/outreach-initiatives/education/google-learnlm-gemini-generative-ai/) research on AI-augmented textbooks.

---

## 📄 License

Open source — free to use, fork, and remix.

---

*Made with ❤️ and Replit AI — [smartextbook.replit.app](https://smartextbook.replit.app/)*
