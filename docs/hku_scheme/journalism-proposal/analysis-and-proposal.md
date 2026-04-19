# RSLEIHE 2026-27 — Data Journalism Project
## Reading Like a Reporter: AI Scaffolding Through Reusable Patterns from Professional Journalism

*Based on: Google Doc "overall plan-data journalism" + background research*
*Prepared: April 2026*

---

## Part 1 — Assessment: What This Project Has Going for It

This is the **stronger concept** of the two proposals — it just needs more scaffolding to become a full proposal.

**Exceptional strengths:**

1. **The most specific problem definition of any RSLEIHE proposal** — Five numbered, concrete student challenges, each illustrated with a real contrast between expert and student performance. Judges love specificity. Most proposals say "students struggle with AI." This one says "students write 'air quality sensors were used' when expert analysis names AirBeam2, PurpleAir PA-II, DustTrak II 8530, and UPAS." That is compelling.

2. **The "Bess framework" is an extraordinary SaP asset** — A *student's own exemplary work* serves as the pedagogical gold standard that the AI is trained to scaffold toward. This is the most authentic Students as Partners framing possible: student intellectual work shapes the learning experience of future students. The judges will notice this immediately.

3. **Data journalism is underserved** — Global curriculum surveys found that no standalone data journalism undergraduate programme existed as of the last major review. This is a genuine curricular gap with real workforce implications. HKU's journalism faculty will recognise this.

4. **Research backing is available and very recent** — A 2025 randomised controlled trial found that proactive AI scaffolding agents (versus passive chatbots) significantly enhance comprehension in journalism students, and the gains persist beyond the intervention. This is the exact design this project proposes.

---

## Part 2 — Critical Gaps

### Gap 1 — No people, no course [URGENT]
The document names Bess and references "three students" and "a journalism teacher" but gives no other names or course details. Before any proposal can be written, the team needs:
- Faculty member name and institution (journalism teacher at HKBU? HKUST?)
- All three student names and institutions
- The specific journalism course code and title that will serve as the pilot
- Approximate number of students in that course

### Gap 2 — Bess's role is unclear
Is Bess a student partner on the team, or an anonymous student whose work was studied? This distinction matters enormously for the proposal:
- **If Bess is a team member:** Her analysis IS the SaP story — she helped design the AI system based on her own expertise. The proposal should centre this.
- **If Bess is an anonymous student:** Her work is used as a benchmark (still valid, but a different framing).

### Gap 3 — The AI tools are not specified
The document proposes AI solutions (vocabulary scaffolding, classification templates, question banks) but does not name which GenAI tools will deliver them. The scheme requires naming 1–2 specific tools. Options to consider:
- **ChatGPT 4o** (HKU-sanctioned; students at HKBU/HKUST could use) — for interactive scaffolding conversations
- **A custom GPT / Claude Project** trained on Bess's framework — for structured template delivery
- **SmartTextbook itself** — the platform already has a Socratic AI tutor that asks probing questions rather than giving answers, which is precisely what the "critical question banks" solution requires

### Gap 4 — No full proposal sections drafted yet
The document contains only problem analysis. All five proposal sections (Rationale, Partnership, Implementation, Evaluation, Ensuring Success) need to be written from scratch.

---

## Part 3 — Full Draft Proposal

*~200 words per section. [Annotations in brackets] = notes for team to fill in before submission.*

---

### 1. Rationale, Purpose and Expected Outcomes

JOUR3306/3307 Journalism Practicum (Data) at HKBU produces published reporting at DataStory (datastory.hkbu.edu.hk), yet a persistent gap separates student output from professional practice. Three challenges recur:

*Topic selection:* Students default to broad themes — "silver economy," "ageing population" — producing unfocused, predictable stories. Professionals narrow to a specific industry; students lack the framework to do the same.

*Sourcing:* Students rely on public datasets. Professionals combine government data with industry reports, first-hand interviews, and trade statistics — source combinations that produce newsworthy, specific claims.

*Newsworthiness:* Students cannot find angles beyond common sense — the gap assessed directly by JOUR3306/3307's Story Ideas criterion (news value, originality, timeliness).

This project builds a corpus of annotated professional journalism — local and international — documenting how experienced reporters approached topic selection, sourcing, and framing across comparable stories. An AI tutor, drawing on this corpus, scaffolds students through pre-reporting decisions: *How did professionals narrow this kind of topic? Which sources made this angle possible?* Students crowdsource the annotations; the AI offers inspiration from documented practice.

**Expected outcomes:**
- Measurable improvement in topic specificity and source diversity (pre/post rubric)
- A practice-informed newsworthiness and sourcing guide students draw on for every story pitch
- An open-source professional practice library and AI scaffold adoptable by any journalism programme

---

### 2. Partnership

This project embodies the Trio model: teacher expertise defines the framework, students build the evidence base, AI scales the tutoring.

**Teachers — the architects:** The journalism faculty defines the annotation framework for expert topic selection, source identification, and newsworthiness; the language and AI faculty designs the scaffolding and pedagogical integration. Together they encode professional knowledge into an operationalised structure.

**Students — decision-makers and co-builders:** Students occupy three roles no faculty can fill: reporting where tools fail and which questions miss the mark; annotating the corpus and contributing judgements about what makes an angle distinctive; and testing new approaches in their own JOUR3306/3307 stories. Their difficulties are design data; their annotations are the intellectual foundation of the corpus.

**GenAI (ChatGPT 4o / DeepSeek) — the tutor at scale:** AI surfaces patterns from the corpus and delivers customised scaffolding simulating the journalism faculty's tutoring — asking what an expert would ask — for every student, unconstrained by class size. Implemented as a Custom GPT with the corpus embedded, requiring no specialised platform; students access it through their existing ChatGPT interface. The corpus annotations and tutor logic are the portable deliverables — reproducible with any provider that supports system prompts. Ethics clearance will be sought by July 2026 if required.

---

### 3. Implementation

**Phase 0 — Needs Analysis (June–August 2026)**
Focus group discussions and interviews with students and teachers; analysis of existing story pitches and published articles to document recurring patterns of weakness.

**Phase 1 — Corpus Building (July–August 2026)**
Collection and annotation of professional journalism articles, beginning with topics common among JOUR3306/3307 students. Team identifies pedagogical insights, strategies, and patterns that distinguish professional from student practice.

**Phase 2 — AI Tutor Development (August–September 2026)**
Custom GPT built and connected to the annotated corpus. Internal testing with faculty and student partners before semester launch.

**Phase 3 — Pilot in JOUR3306/3307 (September–November 2026)**
Baseline assessment: students submit story pitches without AI support. AI tutor deployed from Week 3; students use it at the pre-reporting stage for each assignment. Chat histories collected. Tool iterated based on student and faculty feedback.

**Phase 4 — Evaluation (December 2026)**
Impact assessed by comparing story pitches and published articles: AI-supported students versus a comparison group without tool access. Focus group with student partners. Findings compiled for the RSLEIHE report.

---

### 4. Evaluation

Evidence collection uses a mixed-methods design aligned with the project's three core challenges.

**Quantitative:**
- *Story pitch quality:* Pre/post rubric assessment on topic specificity, source diversity, and newsworthiness — comparing student work produced with and without AI tutor access, and against archived student work from previous cohorts of JOUR3306/3307.
- *Chat history analysis:* Frequency and depth of AI tutor interactions; which query types correlate with improvements in story pitch quality.

**Qualitative:**
- *Pre and post reflections:* Students document their story-selection process before and after using the AI tutor, capturing changes in how they approach topic narrowing and source planning.
- *Focus group discussions:* Separate sessions with students and the journalism faculty, exploring what the tool changed, where it fell short, and what surprised them.
- *Chat transcript review:* Qualitative analysis of 10–15 sessions — which questions prompted genuine reconsideration of a topic; where students disengaged.

**Partnership quality indicator:** Student partners' co-authorship of the Evaluation section is itself evidence of genuine SaP collaboration — their analytical voice is the record.

---

### 5. Ensuring Success

**Challenge 1 — Keeping the corpus current**
A static corpus quickly becomes outdated as topics and journalistic practices evolve.
*Solution:* Each cohort annotates articles as part of JOUR3306/3307 participation, prioritising topics flagged as gaps in previous semester evaluation data. Student partners verify quality each semester. This transforms the deliverable into a self-renewing resource that improves with each intake — and gives future students ownership of a tool they will themselves use.

**Challenge 2 — Preventing AI-generated shortcuts**
Students may attempt to extract ready-made story ideas or angles directly from the tutor, bypassing the reflective process.
*Solution:* The Custom GPT is locked in Socratic mode — architecturally incapable of generating content; it can only ask questions. Where students find workarounds, they document and present the method as a class case study — turning attempted abuse into a lesson on AI limitations and journalistic integrity.

**Challenge 3 — Technical reliability**
Custom GPT retrieval may degrade as the corpus expands.
*Solution:* The corpus is maintained as a structured spreadsheet — simple, portable, and exportable. If retrieval limits are reached, annotations are partitioned by topic category across multiple Custom GPTs. A system-prompt-only fallback preserves tutoring continuity during any technical disruption.

---

## Part 4 — Information Needed from the Team

Before this proposal can be submitted, the following must be confirmed:

| Item | Status | Who provides |
|---|---|---|
| Journalism faculty partner name | ❓ Unknown | Simon / journalism teacher |
| Journalism faculty institution (HKBU? other?) | ❓ Unknown | Simon |
| All 3 student names + institutions | ❓ Only Bess first name known | Simon / journalism teacher |
| Whether Bess is a team partner or anonymous benchmark | ❓ Unclear | Simon |
| Specific pilot course code and title | ❓ Unknown | Journalism teacher |
| Approximate cohort size | ❓ Unknown | Journalism teacher |
| GenAI tools to name (confirm 1–2) | ❓ Draft says ChatGPT-4/Claude | Simon |
| HKBU/institution compliance for chosen AI tools | ❓ Unknown | Simon |

---

## Part 5 — The Winning Framing (One Paragraph)

> *"Every data journalism course teaches students what good analysis looks like in theory. This project asks: what if a student's own exemplary work became the model? Bess's analysis of NY Times data journalism — naming specific air quality instruments, classifying data sources hierarchically, evaluating methodological choices — reveals precisely what other students miss. This project co-designs AI scaffolding that guides students through Bess's framework step by step, asking probing questions rather than providing answers. The student partners who build this system develop deeper analytical understanding than any single assignment could produce. And the journalists they train become more rigorous data storytellers as a result."*

This framing:
- Makes the SaP origin story central (a student's work as the model)
- Distinguishes proactive AI scaffolding from passive chatbot use
- Shows broad impact (every journalism student, any institution, any AI tool)
- Aligns with HKU's AI literacy and assessment redesign goals

---

## References to Cite

- Ahmedtelba et al. (2025) — cognitive offloading (Section 1, defining the problem)
- Bhatia et al. (2024) — personalised learning via AI (Section 1, the opportunity)
- Cook-Sather et al. (2014) — Students as Partners (Section 2)
- Creely & Carabott (2025) — Integrated AI-Oriented Pedagogical Model (Section 3)
- Gupta et al. (2024) — adaptive, responsive, interactive learning (Section 1)

*Submission deadline: Monday 20 April 2026*
*Form: https://hku.au1.qualtrics.com/jfe/form/SV_5b6Y3Nzofxcj8fc*
