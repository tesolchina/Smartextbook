# SmartTextbook & Theoretical Assessment Reforms
## How SmartTextbook Supports Assessment & Verification Reform

*Enriched with insights from the AI Literacy in Education panel discussion — Simon Wang (HKBU), Karina (NUS), Damaris (La Salle)*

---

## 1. The Problem, In the Room

The framework of seven assessment reforms did not emerge from theory alone. It was discussed in a live panel conversation between educators from Hong Kong Baptist University, the National University of Singapore, and La Salle — all grappling with the same pressure from different angles.

Damaris framed the core challenge precisely:

> *"With AI able to create really polished pieces of work, our job is to ensure that our students are really engaging with the materials and that they know what they're talking about when they're writing their essays."*

Simon Wang described what is actually happening at HKBU as a result:

> *"A lot of teachers actually just start going backwards — doing in-class things, or even paper-based assessment — mainly because we haven't really figured out a viable way to deal with this wave of AI."*

And from industry, the pressure is clear: graduates must be AI-literate, not AI-avoidant. As one participant noted:

> *"Feedback from industry is basically saying: we want AI-literate graduates. So we really have to make sure that we're not doing a disservice to our students."*

The reforms Damaris presented are framed deliberately as **a toolkit, not a mandate** — programmes can select what fits their discipline and cohort. This is precisely the spirit in which SmartTextbook is designed: not prescriptive, but enabling.

---

## 2. A Different Approach: Force Use, Don't Ban It

One of the most striking contributions came from a student perspective. Karina (NUS) noted that her US university took the opposite approach:

> *"Instead of banning AI, they force us to use it."*

This paradigm shift — from AI as a threat to AI as a required literacy — is exactly what SmartTextbook embodies. It does not bypass the learning process; it restructures it around intentional, verifiable AI use. The question is not whether students use AI, but whether they use it in ways that demonstrate genuine engagement.

At the institutional level, NUS is experimenting with mandatory AI literacy courses. One participant's university already requires all incoming Year 1 students to complete a 2-credit general education course ("AI for Good") offered by the computer science department. These courses create demand for structured, pedagogically grounded AI tools — the exact gap SmartTextbook fills.

---

## 3. Reform-by-Reform Mapping

---

### Reform 1 — Process-Based Weighting
> *Assign marks (e.g., 30%) to the 'research journey' via conceptual notebooks, logs, or drafts.*

The panel discussion surfaced an important nuance here: the challenge is not just measuring the final product, but capturing the iterative process of thinking. Simon noted that at HKBU, without a structured way to track this process, teachers default to in-class assessments — not because they are pedagogically superior, but because they are verifiable.

**SmartTextbook already does:**
- Every lesson stores a verifiable provenance record: source URL or text excerpt, generation settings (depth, audience, subject type, custom instruction), and creation timestamp.
- The lesson itself — summary → glossary → quiz → mind map — is a structured, documented trace of a student engaging with a specific chapter. It is a conceptual notebook, built from evidence.

**What could be added:**
- A **"Lesson Provenance Card"** export — a one-page PDF or HTML summary showing: source URL, date/time generated, depth setting, quiz scores, and a snippet of the source text used. Submittable as the "research journey" artefact.
- **Quiz attempt log** — record each attempt with timestamp and score, showing iterative engagement. A student who scored 4/10, re-read, and scored 9/10 has produced a documentable learning journey — more meaningful than a single polished submission.

**Assessment connection:** The lesson generation process is itself evidence of research. SmartTextbook makes the process visible without requiring teachers to surveil students — it is built into the workflow.

---

### Reform 2 — AI Engagement
> *Include AI prompt-and-response transcripts as assessable components to verify student interrogation of the tool.*

This reform is the most direct response to the core concern Damaris named: how do we know the student actually engaged with the AI rather than just accepting its output?

The critical distinction — raised implicitly throughout the discussion — is between a generic ChatGPT conversation (impossible to verify, easily fabricated) and a **source-grounded, context-specific AI interaction**. SmartTextbook produces the latter by design.

**SmartTextbook already does:**
- The AI tutor maintains a full in-session conversation history.
- The tutor is grounded in the specific lesson content — transcripts are content-specific and verifiably tied to the source the student supplied.
- Teaching styles (Socratic, Exam Coach) produce transcripts that visibly reveal the *quality* of student interrogation — whether they asked recall questions or probing synthesis questions.

**What could be added (high priority — very achievable):**
- A **"Export Chat Transcript"** button in the chat sidebar. One click generates a timestamped plain-text or PDF of the full AI tutor conversation. Students submit this alongside their essay.
- The transcript header would show: lesson title, source URL, date/time, AI model used, teaching style selected — all the verifiability markers the reform requires.
- A **"Conversation Quality Rubric"** mode — at session end, the AI reflects on the student's own questions: *"You asked 8 questions. 3 were probing synthesis questions; 5 were recall-level. Here is how to interrogate more deeply next time."* This turns AI engagement itself into a formative assessment signal.

**Assessment connection:** A SmartTextbook transcript is fundamentally different from a ChatGPT printout. Because it is grounded in a specific source the student submitted, it constitutes evidence of genuine engagement with identifiable material — not generic AI interaction.

---

### Reform 3 — Mixed Workflows
> *Implement alternative formats like pictorial essays (1,500 words + images) to integrate unique artistic voice.*

The discussion touched on reducing lecture content and redirecting class time toward process workshops — on the mechanics of writing and oral presentation. This implies assessment tasks that capture process, not just polished prose. Multi-format, visually-inflected submissions naturally show individual process.

**SmartTextbook already does:**
- Generates a **visual mind map** as a standard lesson component — a unique visual representation of the student's conceptual understanding of the chapter.
- Produces multi-modal output: written summary, visual diagram, interactive quiz — different representations of the same content, aligned with the dual coding theory underpinning Google's *Learn Your Way* research.

**What could be added:**
- **"Reflection field"** — a plain-text box in the lesson view where students write 150–200 words responding to the AI's summary. This reflection is embedded in the export alongside the AI output, producing a genuine mixed-authorship document where the student's voice is distinguishable from the AI's.
- **Image upload in lesson creation** — allow students to photograph handwritten notes, sketches, or physical book pages and attach them to a lesson as an "Evidence Appendix."
- **"Annotated Mind Map" mode** — students add their own connections and labels to the generated mind map before exporting.

**Assessment connection:** The lesson export is already a mixed-format document. A reflection field makes the student's voice audible alongside the AI's — producing exactly the kind of mixed authorship these reforms are designed to surface.

---

### Reform 4 — Authorship Trails
> *Use Google Doc 'Edit History' or version tracking to provide a verifiable trail of iterative work.*

This reform generated one of the most interesting moments in the panel. Simon noted:

> *"The idea of using Google Docs revision history — I think that's a wonderful idea, because we have this technology that enables us to track the writing process. I need to check about the Google API, whether the API would be able to access the revision history, because then the AI can actually help to track the writing process."*

This is a genuine open question — and SmartTextbook offers a parallel, more purpose-built answer. Instead of retrofitting Google's revision history API into an AI tracking system, SmartTextbook can natively log every lesson generation event, creating a structured authorship trail without relying on external API access.

**SmartTextbook already does:**
- Lessons are saved to localStorage with a creation timestamp.
- Generation settings (depth, audience, custom instruction) are recorded per lesson.

**What could be added:**
- **Version history** — each time a student regenerates or modifies a lesson, save a snapshot (settings + quiz scores + timestamp). After three sessions, the "version trail" shows iterative engagement: initial generation → quiz attempt → re-generation at deeper depth → improved score.
- **"Learning Journal" export** — a chronological log of all lessons a student has created on a topic, with dates, sources, and quiz progression. This is a direct, purpose-built equivalent of the Google Doc revision history the panel discussed — but designed for learning, not document editing.
- **Diff view** — show what changed between lesson versions (e.g., the glossary grew from 8 to 12 terms as the student refined their source input).

**Assessment connection:** SmartTextbook can answer Simon's question without a Google API. The trail of lesson generations — each tied to a specific source and timestamp — is arguably a stronger authorship signal than a text edit history, because it proves the student engaged with external materials, not just revised their own words.

---

### Reform 5 — Information Discernment
> *Mandate verbatim quotes and verifiable links (DOIs/ISBNs) for all citations.*

The concern here is epistemic: in an age of fluent AI paraphrase, can students still identify the difference between a primary source and a synthesised summary? Damaris's framework asks educators to require students to demonstrate they can locate and cite the original text.

SmartTextbook's architecture is built on exactly this principle — every AI response is grounded in the text the student supplied.

**SmartTextbook already does:**
- Grounds the AI tutor in the exact text of the uploaded chapter. Responses are anchored to the source — not fabricated from general knowledge.
- Quiz explanations cite reasoning directly from the chapter content.
- Source URL is stored with every lesson.

**What could be added:**
- **DOI/ISBN metadata field** — an optional citation field at lesson creation (*"Source: DOI 10.xxxx/xxxx"*). This metadata is embedded in the lesson export and Provenance Card, making the primary source formally cited.
- **"Cite the Source" tutor mode** — a new AI teaching style where every response must include a verbatim quote from the chapter (*"According to the text: '…'"*). Students cannot receive synthesis that is not traceable to a specific passage — training them to demand the same standard of themselves.
- **Quotation highlighter** — when the tutor quotes from the source material, it is visually distinguished in the chat UI — teaching students to read AI output critically rather than treating synthesis and quotation as equivalent.

**Assessment connection:** SmartTextbook teaches information discernment by modelling it. A "Cite the Source" mode makes the distinction between primary evidence and AI synthesis structurally visible in every tutor interaction.

---

### Reform 6 — Hard Copy Proviso
> *Require screenshots of physical book pages in appendices for immediate source verification.*

This reform addresses a simple but important gap: paywalled and physical sources that AI cannot access. Requiring a photograph of the physical page forces students to obtain the source themselves — an act of genuine information-seeking that cannot be delegated.

**SmartTextbook already does:**
- Accepts URL, pasted text, and PDF uploads as source material.
- The exported lesson includes the source URL as metadata.

**What could be added:**
- **Image/photo upload alongside text** — students photograph a physical book page and upload it alongside their pasted text. The image is embedded in the lesson export as an "Evidence Appendix," satisfying the Hard Copy Proviso requirement within the SmartTextbook workflow.
- **"Physical Source" badge** — when a lesson is created from uploaded content (rather than a live URL), the export labels it as "Student-supplied source material" — signalling an active choice to obtain a physical or paywalled resource.

**Assessment connection:** SmartTextbook becomes the platform where the Hard Copy Proviso is operationalised — students upload the physical evidence, the platform generates the analysis, and both are packaged together in one submittable export.

---

### Reform 7 — Oral Defence (Vivas)
> *Supplement writing with 'viva-light' formats to ensure students can personally defend their logic.*

The panel noted that class time is being redirected toward workshops on the *mechanics* of communication — writing workshops, oral presentation practice. This is the institutional acknowledgement that polished written product is no longer a reliable signal of understanding. Oral defence — even in a lightweight "viva-light" format — remains the hardest thing to outsource.

**SmartTextbook already does:**
- The **Socratic Guide** teaching style functions as a viva simulator in text form. It refuses to give direct answers, instead asking: *"What evidence from the text supports that claim?"* and *"How would you respond to someone who disagreed?"*
- Quiz explanations require students to process *why* an answer is correct — not just recognise it from options.

**What could be added (high priority):**
- **"Viva Coach" teaching style** — the AI plays the role of an examiner, presenting the student's own generated summary back to them and asking them to defend it: *"You wrote that X is significant. Defend that claim."* / *"What are the limits of the argument in paragraph 2?"* / *"Your source says Y — do you personally agree? Why?"* This is precisely the viva-light format the reform describes.
- **"Likely Viva Questions" generator** — a one-click function after lesson generation that produces 8–10 oral examination questions based on the chapter content. These are harder and more synthetic than the multiple-choice quiz — requiring argument, not recall.
- **"Defend Your Summary" challenge** — the AI deliberately misreads the student's summary and asks them to identify and correct the error. Students who catch it demonstrate genuine comprehension that cannot be faked.

**Assessment connection:** The Socratic tutor mode is already a viva preparation tool. Formalising it as "Viva Coach" — with a framing the student and examiner both recognise — makes SmartTextbook a structured resource for scaffolding oral assessment across programmes.

---

## 4. Summary Table

| Reform | SmartTextbook Status | Key Addition Needed |
|---|---|---|
| Process-Based Weighting | ✅ Lesson = documented research journey | Provenance Card export + quiz attempt log |
| AI Engagement | ✅ Grounded tutor transcripts exist | **Export Chat Transcript** button |
| Mixed Workflows | ✅ Text + mind map already generated | Reflection field + image upload |
| Authorship Trails | ⚡ Timestamps exist; no version history yet | Version history + Learning Journal export |
| Information Discernment | ✅ Source-grounded by architecture | DOI/ISBN field + "Cite the Source" mode |
| Hard Copy Proviso | ⚡ PDF upload exists | Photo upload → embedded Evidence Appendix |
| Oral Defence (Vivas) | ✅ Socratic mode = viva practice | **Viva Coach** mode + Likely Viva Questions |

---

## 5. The Deeper Argument

These reforms exist because unverifiable AI use has made traditional assessment unreliable. The instinctive institutional response — retreating to paper-based or in-class exams — is understandable but, as Simon noted, unsustainable. The workplace demands AI-literate graduates. The question is not whether AI will be part of education, but whether its use will be verifiable, pedagogically grounded, and genuinely developmental.

SmartTextbook inverts the verification problem structurally. Because:

1. The AI tutor is **grounded in a specific source the student supplied** — not general internet knowledge,
2. Every conversation is **session-specific and content-tied** — fabrication produces a different, traceable transcript,
3. The lesson is **generated from student-chosen content** with student-chosen settings — the configuration choices are themselves evidence of intent,
4. Quiz results are **tied to that specific chapter** — a student cannot pass without engaging with the source,

...SmartTextbook produces AI-mediated learning that is *inherently more verifiable* than a ChatGPT interaction — and *inherently more educationally structured* than a Gemini Gem. The student cannot simply paste a question and copy an answer. They must supply a source, engage with generated structure, interrogate the AI tutor, and demonstrate comprehension through a source-specific quiz.

The reforms Damaris described as a "toolkit" find, in SmartTextbook, a technical infrastructure that was designed — without knowing about the framework — to implement them. The alignment is not coincidental. Both emerge from the same conviction: that the right response to AI in education is not to ban it, but to make its use structured, transparent, and verifiable.

---

*Sources: AI Literacy in Education panel discussion transcript (Otter.ai); "Theoretical Assessments — Assessment & Verification Reforms" framework (Damaris); SmartTextbook codebase (smartextbook.replit.app). Simon Wang, HKBU Language Centre. April 2026.*
