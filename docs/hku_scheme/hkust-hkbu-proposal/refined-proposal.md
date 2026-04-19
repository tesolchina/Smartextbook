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

This project embodies the Trio model (Students as Partners + GenAI) through three interlocking relationships, grounded in Cook-Sather et al.'s (2014) principles of reciprocity, shared ownership, and genuine student agency.

**Student partners (2 members: one HKUST, one HKBU):**
Students are not tool testers — they are **co-designers** of the coaching system. Their role includes: co-developing the AI prompt engineering rubrics from the ground up; evaluating AI-generated CV feedback against their own professional judgement; proposing improvements to the coaching workflows; and co-authoring the Evaluation and Reflection sections of the final report. This positions them as researchers, not users.

**Teacher partners (Krista Du, Simon Wang):**
Teachers contribute expert pedagogical knowledge: industry-aligned CV standards, culturally-specific interview conventions, and documented patterns from years of student coaching. Teachers do not build the AI system alone — they co-design it with students, sharing their reasoning for every rubric criterion. This is the reciprocal learning dimension: teachers discover what criteria students find ambiguous or culturally unfamiliar.

**GenAI tools — SmartTextbook platform (current default: DeepSeek; alternative: ChatGPT 4o):**
The coaching system is deployed via SmartTextbook, an open-source AI-in-education platform built on two architectural principles that directly address institutional AI governance concerns.

*Bring Your Own Key (BYOK):* Students and educators supply their own API credentials, which are stored only in the browser's local storage and never transmitted to or stored on any platform server. The institution accumulates no credential liability and no data residency risk. This model also teaches an under-discussed AI literacy competency: students learn that AI has a cost structure, a provider relationship, and a usage model — not just an output.

*Platform Neutrality:* The prompt library, rubric design, and scaffolding architecture developed in this project work equivalently across all supported AI providers. DeepSeek is the recommended default for Hong Kong-based users given its accessibility and cost profile; ChatGPT 4o is a fully supported alternative for institutions with existing OpenAI agreements. If HKBU or HKUST policy requires a specific approved provider, the pedagogical design is unchanged — only the API endpoint is redirected. Students learn to evaluate AI-generated feedback critically, not to depend on a specific platform's interface.

This approach aligns with the HKU GenAI Guidebook's emphasis on AI literacy as a transferable skill rather than platform proficiency (Tsao & Wong, 2025). The use of all AI tools will comply with HKBU and HKUST institutional policies. Ethics clearance will be obtained by July 2026 if required.

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
- Bhatia, A., Bhatia, P., & Sood, D. (2024). Leveraging AI to transform online higher education. *International Journal of Management and Humanities, 11*(1).
- Chan, C. K. Y., & Colloton, T. (2024). *Generative AI in higher education: The ChatGPT effect.* Routledge.
- Cook-Sather, A., Bovill, C., & Felten, P. (2014). *Engaging students as partners in learning and teaching.* Jossey-Bass.
- Creely, E., & Carabott, K. (2025). Teaching and learning with AI: An Integrated AI-Oriented Pedagogical Model. *Australian Educational Researcher, 52*, 4633–4654.

---

*Word count target: ~1,000 words for the five sections. Current draft is approximately 900 words (sections 1–5 only). Room to expand Section 1 with authentic stories.*
*Submission: https://hku.au1.qualtrics.com/jfe/form/SV_5b6Y3Nzofxcj8fc — Deadline: Monday 20 April 2026*
