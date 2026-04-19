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

HKBU's Data Journalism Practicum publishes student work at DataStory (datastory.hkbu.edu.hk), yet a persistent gap separates student output from professional practice. Direct observation reveals three recurring patterns:

*Topic selection:* Students choose broad themes — "silver economy," "climate change" — producing unfocused, predictable stories. Professionals narrow instinctively to a specific industry (silver economy → food and catering); students lack the framework to do the same.

*Sourcing:* Students rely on public datasets. Professionals seek first-hand, industry-specific sources and frame stories around what public data cannot show. Students rarely know what they are missing.

*Perspective:* The hardest gap — finding an angle beyond common sense. Students cannot replicate professional intuition without industry knowledge or exposure to professional practice.

This project analyses published professional journalism to extract reusable patterns: how expert reporters establish newsworthiness, identify non-obvious data sources, and narrow broad topics to specific, untold angles. Students crowdsource these patterns and use AI scaffolding to apply them to their own stories: *Is this angle newsworthy? Which sources would a professional seek? What has not been told?*

**Expected outcomes:**
- Measurable gain in topic specificity and source diversity (pre/post rubric)
- A reusable newsworthiness and sourcing strategy toolkit students apply to every story
- An open-source pattern library for data journalism education, adoptable by any programme

---

### 2. Partnership

This project embodies the Trio model through a distinctive SaP structure: a student's own exemplary analytical work becomes the pedagogical foundation the entire AI system is built upon.

**Student partners [3 members — names to confirm]:**
The student partners have three distinct roles in this project. First, Bess [surname] contributes her analytical framework as the intellectual core of the AI scaffolding system — her data journalism analysis of NY Times articles serves as the benchmark all scaffolding prompts are trained toward. Second, all student partners co-design the AI scaffolding prompts, testing whether the system guides students toward the analytical behaviours Bess exhibited. Third, students conduct peer evaluation sessions during the pilot, using their own judgement to assess AI output quality. Students co-author the Methodology and Evaluation sections of the final report.

**Faculty partners [1–2: journalism teacher + Simon Wang]:**
The journalism teacher provides domain expertise: professional data journalism conventions, course assessment rubrics, and knowledge of the specific student misconceptions documented across previous cohorts. Simon Wang contributes AI integration and pedagogical design expertise. Both faculty partners learn from the students: specifically, what aspects of Bess's framework students find most opaque and why.

**GenAI tools — SmartTextbook platform (current default: DeepSeek; alternative: ChatGPT 4o):**
The scaffolding system is deployed via SmartTextbook, an open-source AI-in-education platform built on two principles that directly address institutional AI governance concerns.

*Bring Your Own Key (BYOK):* Students supply their own API credentials, stored locally in their browser and never transmitted to or held by the platform server. The institution bears no credential liability or data residency risk. Students also learn — through the act of using the tool — that AI is a service with a cost structure and a provider relationship, not a magic box. This is itself a data journalism literacy outcome: evaluating sources includes evaluating the technologies used to gather and analyse them.

*Platform Neutrality:* The five-module scaffolding prompt library (one module per identified student challenge) is provider-agnostic. DeepSeek is the recommended default for Hong Kong users; ChatGPT 4o is a fully supported alternative. If the journalism department or institution has a preferred approved provider, the pedagogical scaffolding functions identically — only the API endpoint changes. The deliverable of this project is the prompt library, not a subscription to a specific service. Any journalism programme can adopt it with any AI tool.

This approach aligns with the HKU GenAI Guidebook (Tsao & Wong, 2025) and complies with institutional policies on responsible AI use in teaching and learning.

---

### 3. Implementation

**Design Sprint preparation (June 2026)**
Trio team attends the RSLEIHE Design Sprint (6 June). Students and faculty jointly formalise the scaffolding framework: translating Bess's analytical approach into a structured sequence of AI prompts. By end of June, a first draft prompt library (five modules, one per student challenge) is ready for testing.

**Phase 1 — Baseline and Co-design (July–August 2026)**
Student partners test the prompt library with sample NY Times data articles, evaluating whether the AI scaffolding produces the analytical behaviours in the Bess framework. Faculty review and refine. A validated, tested prompt set is finalised before semester starts.

**Phase 2 — Pilot Introduction (September 2026)**
[Course code] students begin the semester. Baseline analytical assessment: students analyse a data journalism article without AI support; work scored against Bess's analytical framework rubric. Student partners introduce the AI scaffolding tools and facilitate an orientation session.

**Phase 3 — Scaffolded Practice (October–November 2026)**
Students use AI scaffolding tools across [3–4] data journalism analysis assignments. Each session produces a structured AI transcript showing the questions asked and the student's analytical responses. Student partners review transcripts for quality and flag edge cases.

**Phase 4 — Evaluation (December 2026)**
Post-test analytical assessment using the same rubric as the baseline. Focus group with student partners. Teacher reflection. Data collation for the written report.

*Theoretical framework: Creely & Carabott (2025) Integrated AI-Oriented Pedagogical Model — Functionality of GenAI as proactive scaffolding agent.*

---

### 4. Evaluation

Evidence collection uses a mixed-methods design focused on the analytical capabilities the project is designed to develop.

**Quantitative:**
- *Analytical depth rubric scores:* Pre/post assessment of student-written data journalism analyses scored on five dimensions (technical vocabulary, source classification, critical evaluation, multi-dimensional analysis, context-method connection). Rubric derived from the Bess framework and validated by the journalism faculty partner.
- *AI scaffolding engagement:* Average number of AI prompt exchanges per assignment; correlation between engagement depth and rubric improvement.
- *Technical vocabulary growth:* Pre/post count of specific instrument names, methodology terms, and institutional names in student writing.

**Qualitative:**
- *Student partner co-authorship:* Students write the Methodology and Evaluation sections of the final report — their authorial voice is evidence of genuine SaP partnership.
- *Focus group:* What did the students learn from Bess's framework? What did they find most difficult? What did they teach the faculty partners that surprised them? (reciprocal learning evidence)
- *AI transcript analysis:* Qualitative review of 10–15 student AI scaffolding sessions — what questions did students resist answering? Where did the scaffolding fail?

**Partnership quality indicator:** The journalism teacher's reflection on whether student partners changed any aspect of the scaffolding design that improved learning outcomes. If yes — this is the strongest possible evidence of genuine SaP partnership.

---

### 5. Ensuring Success

**Challenge 1 — Over-reliance on Bess's single framework**
The scaffolding system is built on one student's analysis of two articles. This risks being too narrow or idiosyncratic.
*Solution:* In the co-design phase (July–August), student partners test the scaffolding against multiple different data journalism articles from different contexts (not just NY Times). Framework is expanded where gaps appear. The goal is a transferable analytical method, not a Bess-specific template.

**Challenge 2 — Students bypassing scaffolding to get direct answers**
Students may use the AI to ask "just tell me what the methodology is" rather than engaging with the probing questions.
*Solution:* Scaffolding prompts are designed in "Socratic mode" — the AI is instructed never to provide direct analysis, only to ask the next guiding question. This is analogous to the SmartTextbook Socratic tutor style. Student partners test and stress-test this during Phase 1.

**Challenge 3 — Journalism faculty AI literacy**
The journalism teacher may not be familiar with prompt engineering or AI tool configuration.
*Solution:* Simon Wang takes primary responsibility for AI system setup and maintenance. The journalism teacher focuses on content expertise (what good analysis looks like); Simon handles the AI side. This is a genuine skill exchange between the two faculty partners.

**Challenge 4 — Student data privacy (student work as training data)**
Using Bess's analysis as the framework foundation involves a student's intellectual work.
*Solution:* Explicit consent obtained from Bess for use of her analytical framework in research. Her work is not used to train any external AI model — it is used to design human-authored scaffolding prompts. This distinction is clear in the ethics application.

**Challenge 5 — Sustaining the prompt library after December 2026**
*Solution:* The deliverable is an openly documented, platform-agnostic prompt library — not a proprietary tool. Any journalism teacher can use it with any AI tool. Published alongside the RSLEIHE report. The Bess framework lives on as a pedagogical contribution, not a software dependency.

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
