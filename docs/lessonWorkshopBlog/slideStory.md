# Slide Story — TeachingMatters Seminar
**Simon Wang · Language Centre, HKBU · April 15, 2026**

---

## Origin of This Talk

This talk builds on an article published in *Times Higher Education Campus* (August 2024):
**"Where to start with generative AI chatbot customisation"**
https://www.timeshighereducation.com/campus/where-start-generative-ai-chatbot-customisation

That article introduced the idea of customising AI chatbots for teaching. Since then, the technology has moved fast. This seminar revisits the same core ideas but with a much more concrete implementation — and with a platform built specifically to make it accessible to any educator.

---

## The Argument in One Sentence

> Any educator can encode their pedagogical method into a content-aware AI tutor — without writing a single line of code — and own the data it produces.

---

## Narrative Arc (Five Acts)

---

### Act I — Something Real Is Being Left on the Table
**Slides 1–3**

*The question the audience arrives with: "Why should I care about AI in my teaching?"*

Open with a provocation, not a definition. The technology demonstrably works — Google's research shows an 11% average improvement in learning outcomes with AI-augmented materials. That number is the anchor of the whole talk. Return to it.

But immediately undercut it: the educators who achieved that result had an engineering team. A language teacher in Auckland — or Hong Kong — cannot replicate it. This is where credibility comes from. You're not overselling. You're naming the exact gap that the rest of the talk will close.

**Emotional move**: curiosity → recognition of frustration → "there might be a way out."

---

### Act II — Why the Gap Persists (and It's Not What You Think)
**Slides 4–5**

*The question: "Is this just a technical problem? Do I need to learn to code?"*

Most ed-tech pitches stop at "it's technically hard." That's obvious and uninteresting. The more important barrier is structural: commercial AI platforms are **data black boxes**. Teachers configure a chatbot on Poe or a similar platform, students use it, conversations happen — and the teacher sees nothing. The pedagogical loop is broken.

Then land the philosophical foundation: AI should imitate human intellectual behaviour, which means the right sequence is to **observe the teacher's method first**, then encode that into AI. This reversal — starting from pedagogy, not from AI's capabilities — is the counterintuitive insight that distinguishes this work from typical ed-tech thinking.

Slow down here. This is the intellectual heart.

---

### Act III — Concrete Proof: The Wordchoice Bot
**Slide 6**

*The question: "Can you show me what this actually looks like?"*

This is the most important slide for credibility. Walk through the wordchoice bot — a vocabulary tutor built for a specific language course. Show the student-facing menu (diagnose → guided practice → real-world context). Then show the system prompt on the right: it's plain English. Not code.

Ask the audience: *"Does this look like code?"* It doesn't.

**The key distinction to make clearly:**

| | Vibe Coding (Karpathy 2025) | Our approach |
|---|---|---|
| Input | Natural language | Natural language |
| Output | Generated code | AI behaviour |
| What runs | The generated code | The AI directly |

This is **natural language orchestration** — directing AI behaviour directly, without generating code. This matters because it positions this as a new skill educators can develop, not a coding skill they need to acquire.

The wordchoice system prompt took about 30 minutes to write in plain English. If you know how you teach, you can write this.

---

### Act IV — The Platform (LessonBuilder)
**Slides 7–10**

*The question: "Where do I actually do this? And what about my students' data?"*

Keep this section brief — the platform is evidence, not the thesis.

**The journey from the original idea to a platform:**
1. *THE Campus article (2024)*: Customising chatbots in Poe — the concept introduced
2. *Poe walkthrough*: Shows what's possible with existing tools, and exposes the data problem
3. *New setting (LessonBuilder)*: A dedicated platform that solves both barriers

**What LessonBuilder does:** Converts a chapter of source material (text, PDF) into a structured lesson — summary, glossary, quiz, mind map, AI tutor — using the educator's own API key. BYOK means zero platform cost and complete data control.

**The comparison table (Slide 8):** Let it speak. The row to pause on: *Student chat logs*. Commercial platforms keep them. LessonBuilder gives them to the educator.

**The closed loop (Slide 9):** Priority order matters. First, analyse logs to improve the **system prompt** — this is the fix that benefits every student at once. Then look at individual conversations for student-level follow-up. Treating AI tutoring as a system — not a product — is what separates thoughtful implementation from passive deployment.

**Three barriers addressed (Slide 10):**
- Technical complexity → no-code platform
- Incentive → 11% learning improvement (the anchor from Act I returns)
- Student motivation → interactive, content-aware tutor (not generic ChatGPT)

---

### Act V — The Question Returns to Teachers
**Slides 11–12**

*The question: "What does this mean for me, practically?"*

The bottleneck shifts. Once the technical barrier is removed and the data problem is solved, the limiting factor becomes **pedagogical clarity** — how well a teacher can articulate what they do and why. That is exactly the kind of expertise educators have that AI does not.

Close with:
> "AI's job in education is not to replace the teacher's knowledge. It is to scale the teacher's *method*."

This reframe is the gift of the talk. Teachers leave with their expertise more valued, not threatened.

---

## Slide-by-Slide Quick Reference

| # | Title | One Job |
|---|-------|---------|
| 1 | Title | Set the provocative frame |
| 2 | Problem | Name the gap quickly, don't dwell |
| 3 | Evidence | Anchor with 11%; earn trust by naming the catch |
| 4 | Barriers | Introduce the black box problem |
| 5 | Philosophy | Reversal: teacher's method first, AI second |
| 6 | Case Study | Wordchoice bot — plain English, not code |
| 7 | Platform | Brief — evidence of feasibility |
| 8 | Comparison | Table speaks; pause on chat logs row |
| 9 | Closed Loop | Prompt first, individual student second |
| 10 | Three Barriers | Connect back to Act II |
| 11 | Vision | Bottleneck shifts to pedagogy |
| 12 | Q&A | Land the closing line, then stop |

---

## Tone Notes

- **Credible, not salesy.** Acknowledge limitations before the audience asks. The catch on slide 3 is honesty, not weakness.
- **Slow down at Act II.** The philosophy slide is where the talk earns its intellectual weight.
- **Fast through Act IV.** Platform features are shown, not explained. Keep moving.
- **Confident at the close.** The closing line is a genuine reframe. Say it once, clearly, and stop.

---

## Common Audience Questions (Prepared)

**"How is this different from just using ChatGPT?"**
Three differences: content grounding (knows your specific chapter), workflow design (follows your pedagogical sequence), data ownership (you get the logs — ChatGPT keeps them).

**"What about hallucinations? Is this safe for students?"**
Content grounding reduces hallucination risk because the AI is constrained to specific material. The wordchoice bot also explicitly tells students: "I am powered by AI and can make mistakes — consult your teacher." That disclaimer is part of the pedagogical design, not a liability disclaimer.

**"What's vibe coding? Is that a real term?"**
Coined by Andrej Karpathy in 2025 — directing AI using natural language to generate code. What we do is different: we use natural language to direct AI behaviour directly, with no code generated or run. We call it natural language orchestration.

**"Who pays for the AI?"**
BYOK — Bring Your Own Key. The educator connects their own API key (OpenAI, Gemini, etc.). No platform subscription. The platform is free and open source.

**"Have you tested this with real students?"**
The wordchoice bot has been used in class. LessonBuilder is in active development. Formal outcome data collection is planned for next semester — this talk presents the design rationale and architecture.

**"Can teachers who aren't tech-savvy really do this?"**
The wordchoice system prompt took about 30 minutes to write in plain English. The question isn't technical ability — it's pedagogical clarity. If you know how you teach, you can write this. That's the design premise.
