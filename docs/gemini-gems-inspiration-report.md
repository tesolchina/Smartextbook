# Gemini Gems — Research Report & SmartTextbook Inspiration
**Prepared for Simon Wang · SmartTextbook · April 2026**

---

## 1. What Are Gemini Gems?

Gemini Gems (launched August 2024) are **custom AI experts** built on top of Google Gemini. Think of them as saved, personalised versions of Gemini that remember a set of standing instructions — so you never repeat yourself.

The closest analogy: ChatGPT's Custom GPTs, but inside Google's ecosystem.

**Core idea:** Instead of typing the same setup instructions every conversation, you encode them once into a Gem. Every new chat with that Gem starts from those instructions automatically.

---

## 2. Key Features of Gemini Gems

### 2.1 Custom Instructions (Standing System Prompt)
The heart of a Gem is an **Instructions** field — a plain-English description of:
- What role the AI should play ("You are an expert English writing coach…")
- What tone and style to use ("Be encouraging but precise. Never rewrite the student's work for them.")
- What workflow to follow ("Always end with a guiding question.")
- What topics to stay within ("Only discuss topics related to academic writing.")

No code. No technical knowledge. Plain English only.

### 2.2 File Upload (Knowledge Base)
Users can **upload their own files** — PDFs, Google Docs, style guides, syllabi — that the Gem will consult in every response. This turns a general AI into a **domain expert grounded in specific materials**.

Example: Upload a company's brand guidelines → Gem always responds in that brand's voice.
Education parallel: Upload a textbook chapter → Gem only tutors on that chapter.

### 2.3 AI-Assisted Instruction Writing
A key UX innovation: you write a **rough draft** of your instructions, click a wand/pencil icon, and Gemini **rewrites and improves your instructions for you**. It turns informal ideas into precise, structured system prompts.

This dramatically lowers the bar for non-technical users who don't know how to write effective prompts.

### 2.4 Split-Screen Builder with Live Preview
The Gem builder shows a **left panel for instructions** and a **right panel for live testing**. You refine instructions and immediately see how the Gem responds — without leaving the editor. Instant feedback loop.

### 2.5 Pre-Built Gems from Google
Google offers a curated set of starter Gems:
| Gem | Purpose |
|-----|---------|
| **Learning Coach** | Helps study and understand any topic |
| **Brainstormer** | Generates ideas without judgement |
| **Career Guide** | Job search, interview prep, career advice |
| **Coding Partner** | Explains code, debugs, teaches programming |
| **Writing Editor** | Improves writing style and clarity |
| **Chess Champ** | Teaches chess strategy |

Users can **copy any pre-built Gem** and modify it as a starting point.

### 2.6 Gem Management
- **Pin** your most-used Gems to the sidebar for quick access
- **Duplicate** a Gem to create variations (e.g. "Writing Coach for Undergrads" vs "Writing Coach for PhD Students")
- **Edit** instructions and files at any time
- Access Gems on **web and mobile**

### 2.7 Availability
- **Free tier:** Access to Google's pre-built Gems
- **Gemini Advanced (paid):** Create and manage your own custom Gems
- Create/edit: web app only; use: web + mobile

---

## 3. What SmartTextbook Can Learn From Gems

### 3.1 ✅ Already Doing (Validation)
SmartTextbook already implements the core educational use case *better* than Gems for the classroom:

| Gemini Gems | SmartTextbook |
|---|---|
| Upload a file → Gem knows about it | Paste URL / upload PDF → whole lesson built around it |
| Custom instructions for the AI | Tutor system prompt grounded in specific chapter |
| Teaching style via instructions | 4 preset styles: Clear Explainer, Socratic, Exam Coach, Warm Mentor |
| Pre-built Learning Coach Gem | Full lesson package: summary + glossary + quiz + mind map + tutor |
| No code needed | No code needed |

**SmartTextbook goes further**: Gems produce a smarter chatbot. SmartTextbook produces a full structured learning package *plus* a smarter chatbot. Google's paper confirms these extra components (quizzes, mind maps, structured summaries) improve learning by 11% in an RCT.

---

### 3.2 🎯 Feature 1 — AI-Assisted Instruction Refinement
**What Gems do:** You write rough instructions → click a wand → Gemini rewrites them into a polished system prompt.

**Why it matters for SmartTextbook:** When educators set a "custom teaching instruction" before generating a lesson, they often write vague things like "make it easy to understand". A wand button that refines their intent into a precise prompt would immediately improve lesson quality — without requiring prompt engineering skills.

**Proposed feature:** On the lesson builder's "Custom Teaching Instruction" field, add a ✨ **Refine with AI** button. One click sends the rough instruction + the source text excerpt to the LLM and gets back a structured, pedagogically effective system prompt.

---

### 3.3 🎯 Feature 2 — Named AI Tutors (Gem-Style Personas)
**What Gems do:** Each Gem has a **name** — "Writing Coach", "History Expert", "Grammar Guru". The name makes the AI feel like a specific, trusted expert rather than a generic chatbot.

**Why it matters:** Students are more engaged when the AI tutor feels like a specific character with an identity. Research on pedagogical agents supports this.

**Proposed feature:** Let educators name their AI tutor when exporting a lesson. Instead of "AI Tutor", the embedded chat could say "Hi, I'm Dr. Li — your English grammar guide." The name is stored in the export's system prompt and displayed in the chat header.

---

### 3.4 🎯 Feature 3 — Saved Tutor Configurations (Gem Manager)
**What Gems do:** Gemini maintains a **Gem Manager** — a library of all your custom AI configurations. You save once, reuse forever.

**Why it matters for SmartTextbook:** Right now, educators configure the tutor (teaching style, audience level, custom instruction) each time they create a lesson. A saved "profile" would let a lecturer apply their exact same pedagogical configuration to every new chapter instantly.

**Proposed feature:** A **Tutor Profiles** library. Save a named configuration (e.g. "Year 1 Writing Course — Socratic, University, +grammar focus"). Select it from a dropdown when starting a new lesson. Stored in localStorage, same BYOK model.

---

### 3.5 🎯 Feature 4 — Duplicate / Fork a Lesson Tutor
**What Gems do:** Duplicate a Gem to create a close variant — different knowledge file, same base behaviour.

**Why it matters:** An educator might teach the same chapter to different cohorts (undergrads vs postgrads, L1 vs L2 speakers). They want the same lesson structure but a different tutor calibration.

**Proposed feature:** "Clone this lesson" — duplicates the lesson with all settings. The educator then adjusts the audience level or custom instruction for the new cohort. Already close to possible given localStorage architecture; needs a Clone button in the lesson view.

---

### 3.6 🎯 Feature 5 — Split-Screen Prompt Testing
**What Gems do:** The builder has a **live preview panel** on the right. You test your instructions in real time as you write them.

**Why it matters:** Currently, educators have to generate a full lesson, then open the AI tutor, then discover the instructions aren't quite right. A preview step before generation would save time.

**Proposed feature:** On the "Custom Instruction" field, add a small **Try it** popover that opens a mini chat — sending just the instruction + a sample question to preview how the tutor will respond. No full lesson generation needed. Fast, cheap, one-off API call.

---

### 3.7 🎯 Feature 6 — Pre-Built Lesson Templates (Gems equivalent)
**What Gems do:** Google ships curated Gems as starting points — Learning Coach, Writing Editor, etc.

**Why it matters:** Non-technical educators are uncertain where to start. Pre-built templates lower the barrier dramatically.

**Proposed feature:** A **Starter Templates** gallery on the lesson builder. Pre-configured combinations of subject type, audience, depth, and custom instruction. Examples:
- 📖 **Academic Reading (University)** — Standard depth, Socratic tutor, focus on main argument
- 🔤 **English as L2 (Intermediate)** — Express depth, Warm Mentor, language mode
- 💼 **Professional Development** — Standard depth, Clear Explainer, vocabulary focus
- 🧪 **Exam Preparation** — Deep, Exam Coach, heavy quiz weighting

---

### 3.8 🎯 Feature 7 — Shareable Gem / Tutor Link
**What Gems do (Workspace version):** Organisations can share Gems with colleagues. A Gem becomes a shared resource — one educator builds it, all colleagues use it.

**Why it matters for SmartTextbook:** This maps perfectly onto the existing export model. SmartTextbook already generates shareable standalone HTML lessons. But there is no way to share just the *tutor configuration* without a full lesson.

**Proposed feature:** Export a **Tutor Card** — a small JSON/URL with the tutor name, instructions, teaching style, and (optionally) topic. A colleague imports it with one click. They then apply it to their own chapter.

---

## 4. Priority Roadmap

| Priority | Feature | Effort | Impact |
|---|---|---|---|
| 🔴 High | Pre-Built Lesson Templates | Low | Immediately helps new users |
| 🔴 High | AI-Assisted Instruction Refinement | Medium | Core UX improvement |
| 🟡 Medium | Named AI Tutors | Low | Engagement + pedagogy |
| 🟡 Medium | Saved Tutor Profiles | Medium | Repeat user retention |
| 🟡 Medium | Clone a Lesson | Low | Practical classroom need |
| 🟢 Later | Split-Screen Preview | High | Nice to have |
| 🟢 Later | Shareable Tutor Card | Medium | Collaboration feature |

---

## 5. What SmartTextbook Does That Gems Cannot

It is worth noting where SmartTextbook has a genuine structural advantage:

1. **Full lesson generation** — Gems produce a smarter chatbot. SmartTextbook produces a full structured learning package (summary, glossary, quiz, mind map, AI tutor) grounded in specific source material. Gems cannot do this.
2. **BYOK — model agnostic** — Gems only work with Gemini. SmartTextbook works with DeepSeek, Gemini, OpenAI, Anthropic — any OpenAI-compatible provider. Critical for Hong Kong access.
3. **Export to standalone HTML** — The entire lesson + tutor lives in a single portable file. No platform lock-in. No account required for students.
4. **Pedagogical structure** — Gems are flexible but unstructured. SmartTextbook imposes a learning-science-informed structure (SRL, dual coding, formative assessment) aligned with what Google's own Learn Your Way RCT validated.
5. **SCORM / xAPI export** — Gems cannot integrate into Moodle or any LMS. SmartTextbook can.
6. **Educator authorship** — Gems are personal tools. SmartTextbook is designed for an educator to create something a class of students uses — a fundamentally different production model.

---

## 6. Summary

Gemini Gems is the consumer-facing expression of what SmartTextbook does at a pedagogical level. Google's insight — *save your instructions once, apply them everywhere* — is exactly right. What Gems lack is the structured, evidence-based lesson generation layer that SmartTextbook provides.

The three highest-leverage borrowings from Gems for SmartTextbook are:
1. **AI-assisted instruction refinement** — let the AI improve what educators type
2. **Pre-built starter templates** — lower the entry barrier for new users
3. **Named, saveable tutor configurations** — make repeat use frictionless

These features would make SmartTextbook feel as polished as Gemini for first-time users, while retaining its structural depth that Gems cannot match.

---

*Sources: Google Gemini overview (gemini.google/overview/gems), Zapier guide to Gemini Gems, Google's "Towards an AI-Augmented Textbook" (arXiv:2509.13348), SmartTextbook codebase analysis.*
