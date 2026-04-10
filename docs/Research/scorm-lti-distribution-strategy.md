# Distribution Strategy: SCORM & LTI
*LessonBuilder Research Note*

---

## Overview

LessonBuilder's core vision is to let any educator turn a textbook chapter into a fully interactive lesson — complete with summary, glossary, quiz, mind map, and an AI tutor — without depending on a specific AI provider or a permanently running server.

Two industry-standard formats make it possible to distribute those lessons broadly, into classrooms, LMS platforms, and open repositories, without the educator needing to maintain any infrastructure.

---

## Format 1: SCORM (Shareable Content Object Reference Model)

### What it is
SCORM is a packaging format for eLearning content. A SCORM package is a `.zip` file containing HTML, JavaScript, and an XML manifest. Any SCORM-compatible platform can unzip and run it directly.

### Who supports it
Virtually every LMS on the market: **Moodle, Canvas, Blackboard, Desire2Learn, Sakai**, and hundreds more. It is the most universally accepted eLearning format in existence.

### What a LessonBuilder SCORM package would contain
- Chapter summary (static, readable offline)
- Glossary of key concepts
- Interactive quiz (with scoring reported back to the LMS)
- Mind map diagram
- An embedded AI tutor chatbot, pre-loaded with the chapter context as its system prompt
- Ready-made prompts for external AI platforms (ChatGPT, Claude, Gemini, DeepSeek) in case the student prefers to use their own

### How AI fits in
Because the SCORM package runs JavaScript in the browser, a full AI chat interface can be embedded inside it. The student's API key (BYOK model) is stored locally in their browser. The AI's system prompt is baked into the package at generation time — so the chatbot only knows about this specific chapter and behaves as a dedicated tutor for it. No server required after the package is generated.

### Advantages for LessonBuilder
- **No server dependency after generation.** Once exported, the package lives independently.
- **Upload once to Moodle, works forever.** The teacher uploads the `.zip`, Moodle handles delivery and tracks student progress automatically.
- **GitHub-compatible.** SCORM packages can be stored in a GitHub repository, versioned, and shared as release assets.
- **Open by default.** If the package is placed in a public GitHub repo, any educator worldwide can download and use it.

---

## Format 2: LTI (Learning Tools Interoperability)

### What it is
LTI is not a file format — it is a **communication protocol**. It allows an external web application to connect directly into an LMS. When a student clicks an LTI link inside Moodle, Moodle authenticates the student and passes their identity and course context to the external app in real time. The app can then send grades and progress data back to Moodle automatically.

### Who supports it
Moodle, Canvas, Blackboard, and all major LMS platforms support LTI 1.3 (the current version).

### What LTI would look like for LessonBuilder
LessonBuilder itself would be registered as an LTI tool provider. A teacher adds a LessonBuilder activity to their Moodle course. When a student opens it, they land directly inside the LessonBuilder interface — fully branded, fully AI-powered — without ever leaving Moodle's environment. Grades from quizzes flow back into the Moodle gradebook automatically.

### Tradeoff vs. SCORM
LTI requires the LessonBuilder server to be online and maintained. It enables richer, real-time personalization but reintroduces the server dependency that SCORM avoids.

---

## Recommended Strategy for LessonBuilder

| Goal | Approach |
|------|----------|
| Distribute to any Moodle / LMS today | SCORM export |
| Share openly on GitHub | SCORM packages as repo assets |
| Zero server maintenance after publish | SCORM (client-side AI via BYOK) |
| Deep LMS gradebook integration at scale | LTI (future phase) |

**Phase 1 — SCORM export:** Add a "Export to SCORM" button alongside the existing JSON export. Each lesson becomes a self-contained, distributable `.zip` that any teacher on any LMS can use immediately.

**Phase 2 — LTI integration:** Once LessonBuilder has a stable user base and the infrastructure investment is justified, register as an LTI provider to enable seamless, server-powered integration with institutional Moodle deployments.

---

## Open Source Considerations

The web version of LessonBuilder, once published, can be open-sourced on GitHub (e.g., under MIT or Apache 2.0 license). This means:

- Any educator or developer can self-host their own instance
- SCORM packages generated from a self-hosted instance are equally valid
- The community can contribute new AI provider integrations, language support, and export formats
- Institutions with data-privacy requirements (e.g., no data leaving their servers) can run their own copy

Open-sourcing is strongly aligned with the SCORM distribution model — both reduce dependence on any single hosted service and give educators full ownership of their content.
