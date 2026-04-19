# RSLEIHE 2026-27 — Data Journalism Project
## Reading Like a Reporter: AI Scaffolding Through Reusable Patterns from Professional Journalism
*Updated: April 2026*
*Course: JOUR3306/3307 Journalism Practicum (Data) I/II/III — Dept of Journalism, HKBU*
*Output: DataStory (datastory.hkbu.edu.hk)*

---

## Course Context

| Item | Detail |
|------|--------|
| Course code | JOUR3306 / JOUR3307 |
| Title | Journalism Practicum (Data) I / II / III |
| Department | Department of Journalism, HKBU |
| Units | 2 units |
| Medium | Cantonese / English |
| Output | DataStory website + social media platforms |
| Workflow | PACE process: Preparation → Analysis → Conduct → Evaluation |
| Student roles | Data collecting, cleaning, wrangling, visualisation, drafting, publishing |

**Assessment directly relevant to this project:**
- *Story Ideas (20%)*: evaluated on **news value, originality, innovation, creativity, timeliness** — precisely the newsworthiness judgement students struggle with
- *CILO 2*: Establish relationships with news sources — connects to the first-hand sourcing gap

**AI tutor integration point:** The PACE *Preparation* stage — before students commit to a topic — is where topic-scoping, source planning, and newsworthiness decisions are made. This is where AI scaffolding adds most value.

---

## Team (to confirm)

- **Faculty:** Bess Wang (HKBU, Senior Lecturer, Journalism) + Simon Wang (HKBU, AI & Pedagogy)
- **Students:** [3 student partners — names to confirm]
- **GenAI:** DeepSeek (default) / ChatGPT 4o (alternative)

---

## Problem Statement

HKBU's Data Journalism Practicum already produces published, professional-grade reporting at DataStory. The gap is not in production — it is in the **upstream decisions** that determine story quality before a word is written.

Three documented student challenges:

### Challenge 1 — Topic Selection (Broad → Specific)
- Students default to broad themes: "silver economy," "climate change," "ageing population"
- Broad topics produce unfocused, predictable stories with no clear angle
- Professional strategy: narrow to a specific industry within the theme
  - e.g. Silver economy → food and catering restaurants serving elderly customers
  - e.g. Climate change → urban heat island effect in a specific district
- Students lack the framework to make this narrowing move systematically

### Challenge 2 — Data Source Selection (Public → Non-Obvious)
Frequently used by students (common but insufficient):
- Government statistics (Census & Statistics Department, data.gov.hk)
- Official press releases and policy documents
- Publicly available academic studies

Rare but high-value sources students miss:
- Industry association reports (e.g. Hong Kong Catering Industry Association)
- Company annual reports, financial filings, business registration data
- NGO / think tank datasets
- Import/export trade statistics broken down by sub-category
- First-hand interviews with industry insiders, frontline workers
- Cross-border data (Mainland China comparisons)
- Tender documents, court records, government gazette notices

**Key insight:** Students are not failing to find data — they do not know which source types transform a broad observation into a newsworthy, specific claim.

### Challenge 3 — Newsworthiness and Perspective (Common Sense → Beyond)
- Students cannot identify the angle that professional journalists instinctively find
- They lack industry-specific knowledge to know what is surprising, what is missing, what has not been told
- Gap between professional intuition (built on exposure) and student starting point

---

## Proposed Mechanism

### Step 1 — Build a Corpus from Published Professional Journalism
- Large-scale analysis of published data journalism articles from a **wide range of local and international media**, including:
  - *Local:* South China Morning Post, RTHK, HK01, Ming Pao, Stand News archives, DataStory itself
  - *International:* NY Times, The Guardian, Reuters, ProPublica, FiveThirtyEight, Caixin (财新)
- For each article, extract and annotate:
  - Topic → specific industry/community narrowed to
  - Data sources used (categorised: government / industry / first-hand / academic / cross-border)
  - The newsworthy angle and what makes it distinct from common-sense coverage
  - Source combinations that enabled the angle
- Students crowdsource this analysis: each student contributes annotations on 2–3 articles per semester
- Result: a growing, structured pattern database of professional journalism practice — improves each year

### Step 2 — AI Tutor Empowered by the Corpus
An AI assistant trained on / retrieval-augmented by the corpus acts as a decision-support tool for students **at the topic selection and pre-reporting stage**:

| Student decision point | AI tutor action |
|------------------------|-----------------|
| "I want to cover silver economy" | Surfaces corpus patterns: which industry sub-sectors have been covered vs. which are under-reported |
| "I'll use government statistics" | Asks: what source type do professionals combine with government data for this topic? Shows examples from corpus |
| "My angle is that elderly people face challenges" | Asks: is this claim verifiable? What specific data would distinguish *this* story from ten others on the same theme? |
| "I can't find a unique angle" | Retrieves comparable professional articles and highlights the narrowing move made by the journalist |

**The AI does not generate the story or the angle — it asks questions grounded in what professionals actually did.**

### Step 3 — Scaffolded Pre-Reporting Workflow
Students work through a structured AI-guided pre-reporting checklist:
1. *Topic scoping*: Have I narrowed to a specific industry or community?
2. *Source audit*: What source types does the corpus show are used for this topic? Which do I have? Which am I missing?
3. *Newsworthiness test*: What is the specific claim my story makes? Has this exact claim been published before?
4. *Gap identification*: What does my angle show that public data alone cannot?

---

## Pedagogical Innovation

**Traditional approach:** Teach students rules of good journalism (theory-first)

**This project:** Students *induce* professional practice patterns by analysing real published work, then apply those patterns to their own reporting with AI support

- Learning is grounded in actual professional practice, not abstract norms
- Students contribute to the corpus (crowdsourcing) — their analytical work builds the tool others use
- AI tutor is empowered by a domain-specific corpus, not a generic LLM — answers are grounded in data journalism evidence, not generic advice
- The corpus grows each semester, improving the AI tutor over time (sustainability)

---

## Expected Outcomes

**For students in the course:**
- Apply a systematic topic-narrowing framework to every story pitch
- Use a broader range of source types including first-hand and industry-specific sources
- Articulate a newsworthy angle distinct from existing coverage

**Measurable indicators:**
- Pre/post rubric: topic specificity, source diversity, newsworthiness of pitch
- Corpus contribution: number and quality of student annotations

**Institutional deliverables:**
- A structured corpus of professional data journalism patterns (open dataset)
- An AI tutor prompt system deployable with any LLM provider
- A practice-informed pre-reporting scaffold for any journalism programme

---

## Proposal Sections — Draft Status

| Section | Status | Key content |
|---------|--------|-------------|
| 1. Rationale | Draft exists | Challenges, mechanism, outcomes — needs team names |
| 2. Partnership | Needs rewrite | Bess Wang = faculty architect; students = corpus builders + co-designers |
| 3. Implementation | Needs draft | Phase 1: corpus building (Jul–Sep) → Phase 2: AI tutor dev (Oct) → Phase 3: pilot (Nov–Dec) |
| 4. Evaluation | Needs draft | Pre/post rubric + corpus quality + student reflection |
| 5. Ensuring Success | Needs draft | Corpus quality control, AI accuracy, student buy-in |

---

## Open Questions

- [ ] Three student partner names and institutions
- [ ] Course code for Data Journalism Practicum
- [ ] Approximate cohort size
- [ ] Corpus sources: which publications to include? (SCMP, RTHK, NY Times, local Chinese outlets?)
- [ ] AI tutor implementation: retrieval-augmented generation (RAG) vs. fine-tuned prompt system?
- [ ] Ethics clearance scope: student annotations as research data
