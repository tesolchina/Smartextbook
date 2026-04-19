# RSLEIHE 2026-27 — Refined Proposal Draft
## AI-Enhanced Career Coaching Partnership: A Cross-Institutional Student-Staff-AI Trio

**Team:**
- **Faculty:** Krista Du (HKUST), Simon Wang (HKBU)
- **Students:** [Student A name, HKUST], [Student B name, HKBU]
- **GenAI Platform:** SmartTextbook (BYOK; default provider: DeepSeek / alt: ChatGPT 4o)

**Sub-themes:** GenAI Tools and Pedagogy · Assessment and Feedback · Student AI Literacy and Digital Resilience

*Target length: ~200 words per section. Current draft includes annotations [in brackets] — delete before submission.*

---

## 1. Rationale, Purpose and Expected Outcomes

Hong Kong undergraduates face a documented gap between academic learning and career readiness. In LANG1422 *Chinese for Workplace Applications* at HKBU, each student typically receives one ten-minute tutorial slot for CV feedback — insufficient for the iterative improvement that real-world employers expect. A compounding challenge: previous course iterations did not emphasise CV editing for international contexts, because Chinese CVs are not typically required in local hiring. As graduates increasingly enter multilingual, international workplaces, this gap is widening.

When students seek help outside class hours, they turn to general-purpose AI chatbots (ChatGPT, Claude) and receive generic, culturally decontextualised feedback — what Ahmedtelba et al. (2025) call "unproductive cognitive offloading," where fluent AI output substitutes for genuine skill development.

This project addresses both gaps through a specific mechanism: *distilling teacher expertise into AI-delivered scaffolding.* The coaching knowledge that experienced teachers carry — what makes a CV culturally credible in an international workplace, what patterns of weakness recur across cohorts, what questions produce genuine revision rather than surface editing — exists but cannot be delivered to forty students individually. This project encodes that expertise into a structured prompt system that delivers it as a personalised, iterative dialogue with every student. The student remains the decision-maker at every stage: they judge which feedback to act on, which suggestions fit their context, and how to revise. The AI delivers the teacher's questioning framework, not the teacher's answers.

This design is the practical expression of the Trio model: teacher expertise sets the direction, AI scales the delivery, students do the intellectual work. The platform implementing this system is built on BYOK and platform-neutral principles — the prompt library, not the software, is the transferable asset. If institutional policy requires a change of AI provider, the pedagogical design functions identically.

**Expected outcomes:**
- Measurable improvement in CV quality scores (pre/post standardised rubric, targeting 25–30% gain)
- Growth in student AI literacy: ability to critically evaluate AI-generated career advice rather than accept it uncritically
- A documented, open-source "career coaching prompt library" — teacher expertise encoded in replicable, platform-agnostic format any course can adopt

---

## 2. Partnership

This project operationalises the Trio model through three non-interchangeable roles, grounded in Cook-Sather et al.'s (2014) principles of respect, reciprocity, and shared responsibility, and in Bovill's (2020) framework for co-creating pedagogy. Each party contributes what the other two cannot provide.

**Teacher partners (Krista Du, Simon Wang) — the architects:**
Teachers bring what AI cannot generate: years of accumulated knowledge about what makes a CV culturally credible in an international workplace, what patterns of weakness recur across cohorts, and which questions produce genuine revision rather than surface editing. This expertise exists but cannot be delivered individually to forty students. The teachers' role is to *encode* this knowledge — to make tacit expert judgement explicit enough that AI can deliver it as a structured dialogue. This is pedagogical design work, not technology oversight. Teachers also carry the reciprocal learning role: in co-designing rubrics *with* student partners, they discover which criteria students find ambiguous, culturally unfamiliar, or contextually irrelevant to their own professional backgrounds. That discovery improves the rubric.

**Student partners (one HKUST, one HKBU) — decision-makers and design intelligence:**
Students are not tool testers. They are co-designers who contribute two kinds of expertise that teachers cannot access. First, *professional experience*: student partners bring current knowledge of their own industries, networks, and hiring contexts — the ground truth against which teacher-designed rubrics must be tested. Second, *learning experience*: they know, from recent direct experience, where generic AI coaching fails language learners and where culturally-specific scaffolding would change outcomes. Their role includes co-developing the prompt framework, stress-testing AI outputs for cultural accuracy before deployment, proposing improvements based on peer feedback, and co-authoring the Evaluation and Reflection sections of the final report. The final report's co-authorship is not symbolic — it is the evidence that genuine partnership occurred.

**GenAI tools (SmartTextbook platform; default: DeepSeek / alt: ChatGPT 4o) — the dictionary, not the architect:**
The AI's role is precisely delimited. Karamanis (2026) draws the line that governs our design: when a student uses AI as a sounding board, a question-generator, or a framework-deliverer, "the human is the architect. The machine holds the dictionary." The problem begins when AI makes the methodological choices — when it decides what feedback means rather than surfaces questions that help the student decide. Our coaching system is designed so that the AI *never* produces the revised CV, never recommends a specific wording, and never evaluates whether a choice is correct. It asks: *What industry is this achievement aimed at? What does this verb imply about your level of agency? What would an international employer need to know that isn't here?* The student answers. The student revises.

The coaching system is deployed via SmartTextbook, built on Bring Your Own Key (BYOK) and platform-neutral principles: students supply their own API credentials (stored only in their browser, never on any server), and the prompt library works equivalently with any compliant AI provider. If HKBU or HKUST policy requires a specific approved provider, only the API endpoint changes — the pedagogical design is untouched. The use of all AI tools will comply with both institutions' policies. Ethics clearance will be sought by July 2026 if required.

---

## 3. Implementation

The project executes across two institutions during the mandatory September–December 2026 window, in four phases:

**Phase 1 — Co-design Foundation (July–August 2026, pre-semester)**
Trio team attends the Design Sprint (6 June). Students and teachers jointly review existing LANG1422 rubrics and identify what current AI tools get wrong when students use them independently. Together, the team writes the first draft of the AI coaching prompt framework — students propose, teachers refine, and both evaluate outputs together. By August, a validated prompt set is ready for pilot testing.

**Phase 2 — Baseline & Soft Launch (September 2026)**
Students enrolled in LANG1422 (HKBU) and a parallel career skills module (HKUST) complete a baseline CV assessment using standardised rubrics. The Trio partners introduce the AI coaching system to a small initial cohort (10–15 students) with close monitoring. Student partners document real-time feedback on AI output quality.

**Phase 3 — Full Pilot (October–November 2026)**
Expanded deployment to 40–50 students across both institutions. Students complete at least three AI-assisted CV revision cycles. Interview coaching chatbot deployed for mock interview preparation. Student partners conduct peer coaching sessions using AI transcripts as evidence of progress.

**Phase 4 — Evaluation (December 2026)**
Post-test CV rubric scoring, student AI literacy self-assessment, focus group with student partners, and teacher reflection on workload and pedagogical insight gained.

*Framework reference: Creely & Carabott's (2025) Integrated AI-Oriented Pedagogical Model — Positionality of Teacher, Relationality in Pedagogy, Functionality of GenAI.*

---

## 4. Evaluation

Evidence will be collected using a mixed-methods design grounded in the HKU AI Assessment Integration Framework (Chan & Colloton, 2024), specifically the "Human-machine partnership assessment" type — evaluating students' ability to collaborate with AI while ensuring human judgement remains central.

**Quantitative measures:**
- CV Quality: Pre/post scores on standardised rubric (content relevance, professional presentation, achievement articulation, industry alignment) for all 40–50 participants
- AI Literacy Growth: Self-assessment rubric adapted from HKU AIED AI Literacy Framework, administered pre-semester and post-pilot
- Iteration Depth: Number of AI-assisted revision cycles per student; correlation with final rubric score
- Cross-institutional comparison: Rubric scores and AI literacy gains compared between HKUST and HKBU cohorts

**Qualitative measures:**
- Student partner co-authorship of report sections (evidence of genuine SaP agency)
- Focus group exploring reciprocal learning: what did teachers learn from students? What did students learn that surprised them?
- Student reflection on AI output quality — where did AI fail? Where did it help?
- Teacher workload diary: time spent on individual coaching before and after AI integration

**Partnership quality indicator:** The Evaluation section of the final report will be co-written by the student partners — their authorial voice is itself evidence of genuine partnership.

---

## 5. Ensuring Success

**Challenge 1 — AI output quality varies by cultural context**
CVs for Hong Kong's international workplaces sit at a cross-cultural intersection that generic AI handles poorly. *Solution:* The co-design phase specifically trains prompts on LANG1422 rubrics and Simon Wang's documented feedback patterns. Student partners stress-test outputs for cultural accuracy before deployment. Bias detection is built into the evaluation rubric.

**Challenge 2 — Student data privacy (CV content is personal)**
*Solution:* All CV data is anonymised for research purposes. Students receive a clear data consent form before participation. Only aggregated, de-identified data is used in the final report. Ethics clearance is sought from both institutions by July 2026.

**Challenge 3 — AI platform dependency and access inequality**
Not all students have premium AI subscriptions. *Solution:* The coaching system is built on platform-agnostic principles — the prompt frameworks and evaluation rubrics work with free-tier tools (ChatGPT free, DeepSeek, open-source models). Students who cannot access paid tools are fully supported. This is a deliberate design choice, not a fallback.

**Challenge 4 — Cross-institutional coordination complexity**
*Solution:* Monthly Trio meetings (online) from July onwards; shared project management workspace; clear milestone ownership split between HKUST and HKBU teams. The cross-institutional structure is treated as an asset, not a logistical burden — it produces richer evaluation data.

**Challenge 5 — Sustaining the model beyond December 2026**
*Solution:* The deliverable is not the AI tool — it is the **prompt engineering playbook and rubric framework**, which any teacher at any institution can adapt with any AI tool. By design, no proprietary system is created. The playbook will be published open-source alongside the RSLEIHE report.

---

## Expected Deliverables

1. **AI Career Coaching Prompt Playbook** — open-source, platform-agnostic, replicable by any institution
2. **Final Written Report** — co-authored with student partners; submitted 29 December 2026
3. **Student Symposium Presentation** — 8-minute showcase at RSLEIHE Symposium, 27 February 2027
4. **Optional Pitch Video** (2 min) — for public showcase
5. **Journal Article** — potential contribution to TLTHE special issue (May 2027, TBC)

---

## References

- Ahmedtelba, A., Elycheikh, M., Mitereva, S., & Ponce, M. (2025). Critical integration of generative AI in higher education. *London Journal of Research in Humanities and Social Sciences, 25*(13), 45–62.
- Bovill, C. (2020). *Co-creating learning and teaching: Towards relational pedagogy in higher education.* Critical Publishing. https://doi.org/10.4324/9781041054597
- Chan, C. K. Y., & Colloton, T. (2024). *Generative AI in higher education: The ChatGPT effect.* Routledge. [Open Access] https://aied.talic.hku.hk/
- Cook-Sather, A., Bovill, C., & Felten, P. (2014). *Engaging students as partners in learning and teaching.* Jossey-Bass. ISBN: 978-1-118-43458-1
- Creely, E., & Carabott, K. (2025). Teaching and learning with AI: An Integrated AI-Oriented Pedagogical Model. *Australian Educational Researcher, 52*, 4633–4654. https://doi.org/10.1007/s13384-025-00913-6
- Karamanis, M. (2026, April 6). *The machines are fine. I'm worried about us.* ergosphere.blog. https://ergosphere.blog/posts/the-machines-are-fine/
- Tsao, B., & Wong, K. (2025). *GenAI in teaching and learning: A guidebook.* Common Core, University of Hong Kong. https://commoncore.hku.hk/wp-content/uploads/documents/Guidebook%20-%20GenAI%20in%20Teaching%20and%20Learning.pdf

---

*Word count target: ~1,000 words for the five sections. Current draft is approximately 900 words (sections 1–5 only). Room to expand Section 1 with authentic stories.*
*Submission: https://hku.au1.qualtrics.com/jfe/form/SV_5b6Y3Nzofxcj8fc — Deadline: Monday 20 April 2026*
