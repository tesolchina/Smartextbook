# Lecture Preparation Notes
**Simon Wang · April 2026**
*Democratising AI-Augmented Textbook Creation Through No-Code Chatbot Customisation*

---

## The Core Message (one sentence)
> "AI in education only delivers on its promise when educators are empowered to encode their own pedagogical method into it — and own the data it produces."

---

## Narrative Arc (the argument chain)

1. **Evidence exists** — 11% learning improvement (Google). The technology works.
2. **But it's inaccessible** — two barriers: technical complexity + data black box
3. **Philosophical foundation** — AI imitates human intellectual behaviour, so the right sequence is: *observe the teacher first, then encode that into AI*
4. **Concrete proof** — the wordchoice bot: a full pedagogical method (diagnose → guided practice → real context) encoded in plain text, no code
5. **Important distinction** — this is NOT vibe coding (natural language → code). This is **natural language orchestration** — directing AI behaviour directly
6. **Platform** — LessonBuilder solves both barriers: no-code AND data ownership
7. **The closed loop** — chat logs → AI analysis → improve prompts FIRST → then individual student follow-up
8. **All three adoption barriers addressed** — ease of use, incentive (11%), student motivation
9. **Conclusion** — the bottleneck shifts from technology to pedagogy. The right question returns to teachers.

---

## Key Concept to Define Clearly (Slide 6)
**Natural language orchestration** ≠ vibe coding

| | Vibe coding (Karpathy) | Our approach |
|---|---|---|
| Input | Natural language | Natural language |
| Output | **Generated code** | **AI behaviour** |
| What runs | The generated code | The AI directly |

---

## Slide-by-Slide Speaking Notes

**Slide 1 — Title**
Open with: "How many of you have tried to use ChatGPT for teaching?" — pause — "How many felt it actually understood what your students needed to learn?" That gap is what this talk is about.

**Slide 2 — Problem**
Don't dwell. The audience knows this. Move quickly to the evidence.

**Slide 3 — Evidence**
The 11% number is your anchor. Return to it. But immediately acknowledge the catch — this is where credibility comes from. You're not overselling.

**Slide 4 — The Gap**
Introduce the BLACK BOX problem here. This is your original contribution beyond the technical barrier argument. Teachers already know technical is hard. The data problem is less obvious — land it clearly.

**Slide 5 — Philosophy**
This is the intellectual heart of the talk. Slow down here. The reversal ("start with the teacher's method, not with AI's capabilities") is counterintuitive to most ed-tech thinking.

**Slide 6 — Case Study**
This is your most concrete slide. Walk through the wordchoice bot. You built this yourself — say so. Show the menu, explain the sequence. The prompt box on the right is there to show this is just text. Ask: "Does this look like code?" — it doesn't.

**Slide 7 — Platform**
Brief. The platform is evidence, not the thesis.

**Slide 8 — Comparison**
Let the table speak. Pause on the "Student chat logs" row — that's where commercial platforms fail.

**Slide 9 — Closed Loop**
The key insight: first improve the PROMPT, then look at individual students. This prioritisation shows you treat AI tutoring as a system, not a product.

**Slide 10 — Three Barriers**
Connect back explicitly: "Earlier I said educators face three adoption barriers. Here's how the platform addresses each one."

**Slide 11 — Q&A**
End with the one-liner: "AI's job in education is not to replace the teacher's knowledge — it is to scale the teacher's method."

---

## Likely Audience Questions

**Q: How is this different from just using ChatGPT?**
A: Three differences. Content grounding (it knows your specific chapter, not general knowledge). Workflow design (it follows your pedagogical sequence, not open chat). Data ownership (you get the logs, ChatGPT keeps them).

**Q: What about hallucinations? Is this safe for students?**
A: Content grounding reduces hallucination risk because the AI is constrained to specific material. Also: the wordchoice bot explicitly reminds students "I am powered by AI and can make mistakes — consult your teacher." That disclaimer is part of the pedagogical design.

**Q: What's "vibe coding"? Is that a real term?**
A: Coined by Andrej Karpathy in 2025 — it refers to directing AI using natural language to generate code. We use the term loosely, but more precisely, we do *natural language orchestration* — directing AI behaviour directly, no code generated.

**Q: Who pays for the AI?**
A: BYOK — Bring Your Own Key. The educator connects their own API key (OpenAI, Gemini, etc.). No platform subscription. The platform is free and open source.

**Q: Have you tested this with real students?**
A: The wordchoice bot has been used in class. The broader platform (LessonBuilder) is in active development. Formal outcome data collection is planned for next semester — this talk presents the design rationale and architecture.

**Q: Can teachers who aren't tech-savvy really do this?**
A: The wordchoice system prompt took about 30 minutes to write — using plain English, no programming. The question isn't technical ability, it's pedagogical clarity. If you know *how you teach*, you can write this. That's the design premise.

---

## New Feature Under Consideration: Teacher Chatbot Builder

**Concept**: Enable teachers to build and publish Poe-style custom chatbots directly within LessonBuilder — without leaving the platform.

**Key difference from Poe**: All conversation data is stored in OUR database → teacher can access logs, run AI analysis, generate Learning Reports.

**Proposed Data Schema**:
```
custom_bots
  id, teacher_id, name, system_prompt, welcome_message,
  created_at, is_active, subject, audience_note

bot_sessions
  id, bot_id, student_identifier (email or anonymous token),
  started_at, ended_at, message_count

bot_messages
  id, session_id, role (user/assistant), content,
  created_at, token_count
```

**Data Privacy Options** (still to decide):
- Option A: Anonymous sessions — no student identity stored, just conversation text
- Option B: Student provides email at start — teacher can match to class list
- Option C: Shareable link with class code — sessions grouped by class

**Teacher-facing features**:
- Dashboard: number of sessions, average message count, common questions asked
- AI analysis: "Summarise what students struggled with most across all conversations"
- Export: download chat logs as CSV or PDF

**Student experience**:
- Access via shared URL (like Poe bot link)
- Start chatting immediately — no login required
- Disclaimer shown: "This AI is configured by your teacher and may make mistakes"

---

## Files in This Folder
- `slides.html` — 11-slide presentation (open in browser, arrow keys to navigate)
- `notes.md` — this file
