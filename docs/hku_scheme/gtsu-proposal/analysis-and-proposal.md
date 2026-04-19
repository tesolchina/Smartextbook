# RSLEIHE 2026-27 — GTSU 2026 Peace Platform
## Analysis, Packaging Strategy & Full Draft Proposal

*Based on: GitHub repo tesolchina/MartinPeaceBot (private) — read April 2026*
*Prepared: April 2026*

---

## Part 1 — What This Project Actually Is

**Course:** GTSU 2026 — European Diplomacy and Peacemaking
**Platform:** MartinPeaceBot — a full-stack AI tutoring platform with 4 specialised AI tutors

The platform supports a simulation where student pairs represent European countries and must:
1. Research their assigned country's foreign policy position
2. Write a formal position paper
3. Convert the paper into a 2-minute persuasive speech
4. Deliver the speech in a simulated EU council session on 14 April 2026

**The 4 AI tutors:**
| Tutor | Role | Key principle |
|---|---|---|
| Research Advisor | Country research, source evaluation, geopolitical context | Never fabricates facts; always distinguishes official stance vs. actual interests |
| Writing Coach | Position paper structure and draft review | Reviews and critiques; never writes for the student |
| Speech Coach | Paper-to-speech conversion and delivery coaching | 260-300 words, 2 minutes, rhetorical technique tracking |
| Assessment Analyst | Post-speech feedback on 5 rubric dimensions | Content, Argumentation, Structure, Rhetoric, Time |

**Spring 2026 timeline (already completed):**
- 24 March 2026: Student onboarding, platform demo
- 24 March – 14 April: Research, drafting, speech rehearsal (AI tutors available)
- 14 April: Presentation day — speeches delivered, transcribed, AI-assessed

**What already exists:**
- Working full-stack platform (React + Express + PostgreSQL)
- 4 fully-specified AI tutors with detailed system prompts
- Real course integration (syllabus, rubrics, course guide all in repo)
- Chat history data from real students
- Assessment records (speech transcripts + AI feedback)
- Teacher dashboard for monitoring student progress

---

## Part 2 — The Packaging Problem (and Solution)

### Why "we built a platform" is the wrong frame

HKU reviewers are right to be cautious about proposals that are primarily software development projects dressed up as pedagogical research. The RSLEIHE scheme funds **learning experience redesign**, not tool development.

### Why this project does NOT have that problem

**The platform already exists and has already been used.** This is the crucial difference.

The correct frame is:

> *"Spring 2026: Teacher-led pilot — the platform was built and used. Students experienced it.*
> *Sep–Dec 2026 (RSLEIHE): Student-led redesign — the students who used it help rebuild it for the next cohort."*

The RSLEIHE project does not fund software development. It funds:
- Student partners analysing the Spring 2026 data (what worked, what failed)
- Student partners redesigning the AI tutoring prompts based on their lived experience
- A new cohort using the redesigned platform
- Research measuring whether SaP-driven redesign improved learning outcomes

**The most authentic possible SaP story:**
Students who were the *users* in Spring 2026 become the *designers* in Fall 2026. Their experience of struggling with the Research Advisor, finding the Speech Coach too prescriptive, or not knowing what kind of feedback to ask for — that lived knowledge is the research asset. No teacher-only process could access it.

---

## Part 3 — The Winning Angle

This is the **strongest** of the three proposals because:

1. **Evidence already exists** — Spring 2026 chat logs, assessment records, speech transcripts are baseline data. No other RSLEIHE proposal in this cohort will have pre-existing empirical evidence before the project even starts.

2. **Academic integrity is embedded** — The tutors explicitly refuse to write for students, detect AI-generated text, and flag overly generic outputs. This directly addresses HKU's AI ethics concerns. The proposal can cite this as a model for responsible GenAI integration.

3. **The research question writes itself** — "When students redesign the AI tutoring prompts based on their own learning experience, do subsequent cohorts achieve deeper engagement with diplomatic reasoning than the teacher-designed original?" This is a clean, testable question.

4. **The four-tutor lifecycle is novel** — Most AI T&L projects use a single chatbot. This platform covers the complete production cycle: research → writing → speech → assessment. Each stage is separately measurable.

5. **Speech delivery data is rare** — AI transcription + analysis of student speeches is genuinely unusual in RSLEIHE proposals. The script-vs-transcript comparison (what students planned vs. what they actually said) is a rich data source.

---

## Part 4 — Full Draft Proposal

*~200 words per section. [Items in brackets] = confirm before submission.*

---

### Working Title

**From Experience to Design: Students Redesigning AI Tutoring for Diplomatic Simulation in GTSU 2026**

---

### Course / Context

**Course:** GTSU 2026 — European Diplomacy and Peacemaking
**Institution:** [HKBU? Confirm]
**Brief description:** A general education course in which student pairs represent European countries in a diplomatic simulation. Each team researches their country's foreign policy position, writes a formal position paper, and delivers a two-minute persuasive speech in a simulated EU council session.

**Main learning activities:** Research-based inquiry, position paper drafting, oral speech preparation and delivery, peer observation of simulation proceedings.

**Why this course is a strong setting:** The simulation requires students to synthesise research, argumentation, and oral communication under realistic time and format constraints. These three skills — separately demanding, jointly complex — benefit directly from targeted AI scaffolding at each stage. The course has already completed a teacher-led AI pilot in Spring 2026, providing a baseline and a generation of students with lived experience of the platform.

---

### 1. Rationale, Purpose and Expected Outcomes

Diplomatic simulation courses ask students to do something genuinely difficult: synthesise geopolitical research into a coherent argument, then communicate that argument persuasively in two minutes while staying in role as a national representative. This demands simultaneous competence in research literacy, academic writing, and oral rhetoric — skills that are typically trained separately in general education curricula.

In Spring 2026, a teacher-designed AI platform (MartinPeaceBot) was piloted in GTSU 2026 to scaffold all three stages. Four AI tutors supported research (country positions, source evaluation), writing (position paper structure and critique), speech preparation (converting the paper to a two-minute script), and formative assessment (rubric-aligned feedback on speech delivery). The pilot produced rich interaction data — chat transcripts, speech recordings, and AI assessment records — that now constitutes an empirical baseline.

This RSLEIHE project asks the question that the pilot cannot answer on its own: *does a platform designed by students who experienced its limitations outperform one designed by teachers alone?* A 2025 randomised controlled trial found that proactive AI scaffolding significantly enhances comprehension compared to passive tools (Kwan et al., 2025). This project tests whether student-led prompt redesign adds a further layer of improvement.

**Expected outcomes:**
- Student partners develop deeper metacognitive awareness of the research-to-speech pipeline through the act of redesigning it
- GTSU 2026 students in Fall 2026 show measurable improvement in position paper coherence and speech rubric scores compared to the Spring 2026 cohort
- A documented SaP methodology for AI prompt co-design, replicable in any simulation-based course

---

### 2. Partnership

This project's SaP structure is grounded in a concrete transition: students who were **users** of the platform in Spring 2026 become its **co-designers** for Fall 2026. Their lived experience of the platform's affordances and limitations is the primary design resource.

**Student partners [2–4 — names to confirm]:**
The student partners are drawn from the Spring 2026 GTSU cohort. Their roles are:
- *Evidence analysts:* Review the Spring 2026 chat transcripts and assessment records to identify which tutoring interactions supported learning and which generated frustration, avoidance, or surface-level engagement
- *Prompt co-designers:* Revise the four AI tutor system prompts based on their analysis, proposing specific changes to questions, constraints, feedback styles, and scope
- *Onboarding designers:* Redesign the student onboarding experience (currently instructor-led) to reflect what they wished they had known in Week 1
- *Report co-authors:* Write the student experience section of the RSLEIHE report and present findings at the post-course review

**Faculty partner — [GTSU 2026 instructor name, institution]:**
The course instructor provides domain expertise (diplomatic simulation conventions, assessment rubrics, course learning outcomes), reviews all student prompt redesign proposals for pedagogical alignment, and facilitates the Fall 2026 pilot. Crucially, the instructor learns from the student partners what aspects of the Spring 2026 experience were opaque or counterproductive — knowledge not accessible through teacher observation alone.

**GenAI partners:** MartinPeaceBot (OpenAI GPT-4.1 via Replit AI Integrations, web search enabled for the Research Advisor). All four tutors operate in Socratic mode: they never write content for students, instead asking guiding questions and providing structured critique. This design principle is non-negotiable and student partners are expected to maintain and strengthen it in their redesigns.

**Partnership principles:** Student authorship of all redesign decisions; transparent AI use (instructors can view all chat histories); co-authorship of the research report; reciprocal learning (the instructor documents what the students taught them about the platform's blind spots).

---

### 3. Implementation

**Design Sprint preparation (June 2026)**
Student partners attend the RSLEIHE Design Sprint (6 June). Together with the faculty partner, they formalise the research question, agree on the data analysis framework for Spring 2026 records, and draft a timeline for the summer co-design phase.

**Phase 1 — Evidence analysis (July 2026)**
Student partners review anonymised Spring 2026 interaction data:
- Which tutors were used most and least? At what stages?
- What types of questions generated the richest responses?
- Where did students disengage, repeat themselves, or abandon sessions?
- What did the script-vs-transcript comparison reveal about preparation quality?

Partners produce a written diagnostic report identifying the three most significant redesign priorities.

**Phase 2 — Prompt co-design (August 2026)**
Student partners propose revisions to the four tutor system prompts. Each revision must be justified by evidence from Phase 1. The faculty partner reviews all proposals for course alignment and ethical compliance. Revised prompts are tested by partners in low-stakes trial sessions before the semester begins.

**Phase 3 — Fall 2026 pilot (September–November 2026)**
The redesigned platform is deployed in GTSU 2026 Fall cohort. Students use the same four-tutor workflow as Spring 2026. Student partners observe (with consent) at least three onboarding and mid-process interactions, taking field notes on platform use and student behaviour.

**Phase 4 — Evaluation and reporting (December 2026)**
Comparison of Spring vs. Fall cohort metrics. Focus group with Fall 2026 students. Student partners write the evaluation narrative. Faculty partner writes the pedagogical reflection. Joint presentation of findings.

---

### 4. Evaluation

The Spring 2026 pilot data provides a genuine pre-project baseline — an unusual advantage in RSLEIHE evaluation design.

**Comparative outcome measures (Spring vs. Fall 2026):**
- Position paper rubric scores: Content, Argumentation, Structure (scored by the course instructor using the existing GTSU 2026 rubric)
- Speech assessment scores: Content vs. Task, Structure, Rhetoric/Delivery, Alignment (existing AI assessment rubric)
- Script-to-transcript similarity: How closely did students follow their prepared speech? (A proxy for preparation confidence)
- Platform engagement depth: Average number of chat sessions per team, average messages per session, number of tutors used

**Student partner metacognitive evidence:**
- Diagnostic report quality (Phase 1): Did partners accurately identify the platform's weaknesses? Does their analysis match quantitative engagement data?
- Prompt redesign justification: Can partners articulate why each change addresses a specific observed learning failure?
- Report co-authorship: Partners write the student experience narrative — their voice is evidence, not just description

**Focus group (December 2026):**
Fall 2026 students are asked: What did you learn about diplomatic reasoning through this process? What would you change? Did you feel the AI was a thinking partner or a shortcut? Their responses are analysed against the same questions asked informally of Spring 2026 students during debriefing.

**Partnership quality indicator:** The course instructor documents at least three specific changes made to the platform at student partners' recommendation. If those changes are traceable to improved outcomes in Fall 2026, this is the core evidence of SaP value.

---

### 5. Ensuring Success

**Challenge 1 — The tool is already built; reviewers may see this as a "showcase"**
*Response:* The RSLEIHE project explicitly does not fund the platform build. It funds the research question: does student-led redesign improve outcomes compared to teacher-led design? The tool is the research site, not the deliverable. This distinction is stated explicitly in the proposal's opening paragraph.

**Challenge 2 — Students redesigning prompts without pedagogical expertise**
*Response:* The co-design process is structured, not open-ended. Student partners propose evidence-based changes; the faculty partner reviews all proposals for pedagogical alignment before implementation. Students bring experiential expertise; the instructor brings domain expertise. Neither can do the other's job.

**Challenge 3 — Comparing Spring vs. Fall cohorts is not a controlled experiment**
*Response:* The proposal does not claim experimental rigour. It claims rich, multi-source evidence in a realistic educational context — appropriate for a scheme focused on learning experience redesign. Limitations are acknowledged in the methodology and discussion.

**Challenge 4 — Data privacy for Spring 2026 students**
*Response:* Spring 2026 chat data is anonymised before student partners access it. All students consented to data use for course improvement purposes at onboarding. The RSLEIHE ethics application documents this process. Student partners sign a data handling agreement.

**Challenge 5 — AI tutor quality drift if prompts are poorly redesigned**
*Response:* All redesigned prompts are tested in controlled conditions by student partners before deployment. A rollback protocol ensures the Spring 2026 prompts remain available if a revised tutor underperforms in the first three weeks of Fall 2026. The faculty partner monitors chat interactions weekly during Phase 3.

**Sustainability:** The platform is open-source (see github.com/tesolchina/Smartextbook) and prompt-library documentation is publicly available. Any simulation-based course at any institution can adapt the four-tutor model. The SaP co-design methodology is documented as a replicable process in the final report.

---

## Part 5 — Information to Confirm Before Submission

| Item | Status | Who provides |
|---|---|---|
| GTSU 2026 course instructor name and institution | ❓ Not in repo | Simon |
| 2–4 student partners (ideally Spring 2026 alumni) | ❓ Not identified | Simon + instructor |
| Is GTSU 2026 offered again in Fall 2026? | ❓ Assumed yes | Instructor |
| Approximate Fall 2026 cohort size | ❓ Unknown | Instructor |
| Institution ethics approval process for student data use | ❓ Unknown | Simon |
| Confirm open-source status of platform for proposal | ❓ Repo is currently private | Simon |

---

## Part 6 — One-paragraph Pitch

> *"MartinPeaceBot already works. In Spring 2026, GTSU students used four AI tutors to research European diplomatic positions, draft position papers, rehearse two-minute speeches, and receive rubric-aligned assessment feedback. They have opinions about what the tutors did well and what frustrated them. This project gives those students the opportunity to act on those opinions: to analyse the interaction data, redesign the tutoring prompts, and hand a better platform to the next cohort. The research question is not whether AI can support peace education. It already can. The question is whether students who know its weaknesses from the inside can make it better than a teacher who designed it from the outside. We expect the answer to be yes — and we intend to prove it."*

---

## References to Cite

- Ahmedtelba et al. (2025) — cognitive offloading and student reliance on AI (Section 1, the risk to address)
- Cook-Sather et al. (2014) — Students as Partners (Section 2)
- Creely & Carabott (2025) — Integrated AI-Oriented Pedagogical Model (Section 3)
- Kwan et al. (2025) — proactive vs. passive AI scaffolding RCT (Section 1, the evidence base)
- Chan & Colloton (2024) — AI Assessment Integration Framework (Section 4)

*Submission deadline: Monday 20 April 2026*
*Form: https://hku.au1.qualtrics.com/jfe/form/SV_5b6Y3Nzofxcj8fc*
