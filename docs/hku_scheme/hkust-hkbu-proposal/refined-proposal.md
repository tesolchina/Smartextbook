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

Grounded in Cook-Sather et al.'s (2014) principles of respect, reciprocity, and shared responsibility, each Trio member holds a distinct, non-interchangeable role.

**Teachers (Krista Du, Simon Wang) — the architects:** Teachers encode tacit expertise — what makes a CV internationally credible, which patterns of weakness recur, which questions drive genuine revision — into a structured prompt framework AI delivers at scale. Co-designing rubrics *with* student partners reveals which criteria students find culturally unfamiliar; that discovery improves the design and constitutes the reciprocal learning dimension.

**Student partners (one HKUST, one HKBU) — decision-makers and design intelligence:** Students contribute two forms of expertise teachers cannot access: current industry knowledge (the ground truth for rubric validity) and recent learner experience (where AI coaching fails language learners). They co-develop the prompt framework, stress-test outputs for cultural accuracy, and co-author the Evaluation section. Co-authorship is evidence of genuine partnership, not its symbol.

**GenAI (SmartTextbook; default: DeepSeek / alt: ChatGPT 4o) — the dictionary, not the architect:** The AI surfaces questions; students answer and revise. It never produces the revised CV. Students supply their own API credentials (BYOK); the prompt library functions with any compliant provider — only the endpoint changes if institutional policy requires it. Ethics clearance will be sought by July 2026 if required.

---

## 3. Implementation

This project follows four phases within the September–December 2026 window, deliberately establishing human coaching before AI is introduced.

**Phase 1 — Human Foundation (September):** A cohort of 10–15 students receives direct CV reviews and interview coaching from teacher partners. Baseline CV quality is scored using the co-designed rubric. Critically, teachers document their recurring feedback patterns — the raw material for Phase 2.

**Phase 2 — Expertise Transfer (October):** Documented feedback patterns are converted into AI training prompts. Student partners co-build the CV assessment module and interview simulation scenarios, then beta-test outputs under teacher supervision. This is the distillation stage: tacit expertise becomes structured scaffolding.

**Phase 3 — Integrated Deployment (November):** The AI-human model launches with 30–40 students across both institutions. Students use the AI tool for initial CV drafts and interview practice; teachers handle quality assurance and complex cases. Interaction transcripts and performance data are collected.

**Phase 4 — Evaluation (December):** Pre/post rubric analysis, AI literacy self-assessment, focus group with student partners, and prompt refinement based on findings. Outcomes documented for the final report.

*Framework: Creely & Carabott's (2025) Integrated AI-Oriented Pedagogical Model.*

---

## 4. Evaluation

Evidence will be collected using a mixed-methods design grounded in the HKU AI Assessment Integration Framework (Chan & Colloton, 2024) — specifically the human-machine partnership assessment type, which evaluates students' ability to collaborate with AI while keeping human judgement central.

**Quantitative measures:**
- *CV quality:* Pre/post rubric scores (content relevance, professional presentation, achievement articulation, industry alignment) for all participants; AI-generated and teacher evaluations compared for inter-rater reliability
- *Mock interview performance:* Structured rubric scores on audio recordings; AI feedback accuracy benchmarked against teacher judgements; student confidence self-report pre/post
- *Iteration depth:* Number of AI-assisted revision cycles per student, correlated with final rubric score
- *Cross-institutional comparison:* Rubric scores and AI literacy gains compared between HKUST and HKBU cohorts

**Qualitative measures:**
- *Interaction transcripts:* Conversation logs scored against the teacher-designed rubric — the process record that distinguishes a student who drove analytical choices from one who passively followed AI suggestions
- *Focus group:* Reciprocal learning documented — what did teachers learn from students? What surprised students about AI limitations?
- *Partnership quality indicator:* The Evaluation section of the final report is co-written by student partners — their authorial voice is evidence of genuine partnership, not its symbol

**Impact and reach:**
- Student cohort size across both institutions (30–40 direct participants)
- Post-project tracking of prompt playbook downloads and institutional adaptations via open-source GitHub repository analytics — adoptions beyond the original cohort are the primary long-term impact indicator

---

## 5. Ensuring Success

**Sustainability and wider adoption:** The primary deliverable is not the AI tool — it is the **open-source prompt engineering playbook and rubric framework**, published on GitHub alongside the RSLEIHE report. Any teacher at any institution can adopt it with any compliant AI provider, without budget negotiation or platform agreement. The cross-institutional structure (HKUST + HKBU) already demonstrates transferability across different student populations and is designed to serve as a replication template for other institutions. Post-project adoption is tracked via GitHub analytics and reported as a long-term impact indicator.

**AI output quality in cross-cultural contexts:** Prompts are trained specifically on LANG1422 rubrics and documented feedback patterns; student partners stress-test outputs for cultural accuracy before deployment.

**Student data privacy:** CV data anonymised for research; consent forms issued to all participants; only aggregated data in the final report. Ethics clearance sought from both institutions by July 2026.

**AI access inequality:** System built on free-tier compatible tools (DeepSeek, ChatGPT free). No paid subscription required — a deliberate design principle, not a fallback.

**Cross-institutional coordination:** Monthly Trio meetings from July; shared milestone ownership across HKUST and HKBU; cross-institutional differences treated as research data, not logistical friction.

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
