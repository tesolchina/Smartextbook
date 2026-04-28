# From Static to Interactive: Teaching Non-Programming Professionals to Transform Communication Resources Using Agentic AI

**IEEE ProComm 2026 — Workshop Paper (Camera-ready Draft)**  
**Edmonton, Canada | July 12–15, 2026**  
**Author**: Simon Wang, Hong Kong Baptist University  
**Status**: Draft for camera-ready submission by April 30, 2026

---

## Abstract

Static professional communication articles contain significant pedagogical value, yet their fixed format limits learner engagement and accessibility. This workshop introduces the PITA framework—Parse, Identify, Transform, Augment—a structured, no-code methodology for transforming published professional communication articles into interactive learning modules using agentic AI. Participants without programming backgrounds will use natural language instructions (vibe coding) to direct AI agents through each PITA stage, producing a complete interactive lesson within the 75-minute session. Drawing on a working prototype that converts IEEE ProComm articles into multimedia learning experiences—including adaptive quizzes, audio narration, and annotated design rationales—this workshop demonstrates how professional communicators can become active producers of educational technology rather than passive consumers. Participants will leave with a replicable workflow, a transferable template, and a conceptual framework for scaling this approach to institutional or community-based open educational resource (OER) initiatives.

**Keywords**: agentic AI, interactive learning, professional communication education, open educational resources, vibe coding, PITA framework

---

## I. Introduction

The IEEE Professional Communication Society hosts over 127 articles on its public website—a substantial repository of expert knowledge on topics ranging from listening and intercultural communication to visual design and AI ethics. Yet these articles remain largely in their original static form: text on a page, read once and forgotten.

This represents a missed opportunity. Research consistently demonstrates that active engagement with content—through questions, scenario application, and multimodal representation—produces deeper, more durable learning than passive reading [1], [2]. The challenge is not the absence of good content but the absence of tools and workflows that enable professional communicators, who are content experts rather than software engineers, to transform that content into interactive form.

Recent developments in agentic AI have begun to close this gap. Systems such as Claude, GPT-4o, and Gemini can now receive high-level natural language instructions and autonomously execute multi-step tasks: reading a document, identifying its pedagogical structure, generating quiz items, producing audio narration scripts, and assembling HTML output—all without a line of traditional code. This capability, sometimes termed "vibe coding" [3], democratizes software-mediated learning design in ways that parallel how word processors democratized document production a generation ago.

This workshop introduces participants to a structured workflow for leveraging these capabilities: the PITA framework. Through hands-on practice with a working prototype and an AI agent guided by pre-built skill files, participants will complete a full article transformation within the session.

---

## II. Related Work

### A. AI-Augmented Educational Content

Google's Project Tailwind and its successor "Learn Your Way" demonstrated that AI-mediated content augmentation—generating podcasts, structured notes, and practice questions from source documents—can improve learning outcomes by measurable margins [4]. Elidan et al. [1] describe an "AI-Augmented Textbook" that dynamically generates hints, explanations, and worked examples, showing particular gains for novice learners. These systems, however, require significant engineering infrastructure and remain inaccessible to practitioners without technical support.

### B. Vibe Coding and Natural Language Programming

Sarkar and Drosas [3] define vibe coding as "programming through conversation with AI," in which users express intent in natural language and AI systems translate that intent into executable code or structured output. Lin [5] applies this concept specifically to professional writing pedagogy, arguing that "writing is coding" when natural language instructions generate functional digital artifacts. These frameworks suggest that professional communicators—whose core competency is precise, purposeful language—are particularly well-positioned to adopt vibe coding practices.

### C. Professional Communication Education and AI

The ProComm community has actively engaged questions about AI's role in professional communication education, with calls for research on how AI tools change technical communicators' roles and competencies [6]. Current literature, however, focuses largely on AI as a writing assistant rather than as a medium for transforming existing expertise into pedagogical artifacts. This workshop addresses that gap directly.

### D. Learnersourcing and Open Educational Resources

Kim [7] describes learnersourcing as a process in which learners generate educational materials for other learners as a byproduct of their own learning activities. The PITA workflow instantiates this principle at the professional level: practitioners who transform articles develop deeper mastery of the content even as they produce resources for others. This dual benefit—personal learning and community contribution—mirrors successful models from citizen science (Galaxy Zoo) and collaborative translation (Duolingo's original crowdsourcing model) [8].

---

## III. The PITA Framework

PITA is a four-stage methodology for transforming a static article into an interactive learning module. Each stage maps to a distinct cognitive operation and a corresponding AI instruction pattern.

### Stage 1: Parse

The AI agent reads and analyzes the source article, identifying its argumentative structure, key claims, supporting evidence, and conceptual vocabulary. The practitioner instructs the agent in natural language: *"Read this article and identify the five most important concepts a learner needs to understand. For each concept, summarize the argument in two sentences."*

Parse outputs include a concept map, a summary outline, and a list of candidate learning objectives aligned to Bloom's Taxonomy.

### Stage 2: Identify

The practitioner, guided by the Parse output, makes pedagogical decisions: Which concepts require active practice rather than passive reading? What types of questions will reveal genuine understanding versus surface recall? What scenarios from learners' professional contexts would make abstract concepts concrete?

The AI agent assists by generating candidate quiz items, scenario descriptions, and scaffolded reflection prompts, which the practitioner reviews and selects from.

### Stage 3: Transform

The agent assembles the interactive module: HTML structure, navigation, quiz logic, feedback messages, and progress tracking. The practitioner provides natural language instructions (*"Put the definition quiz before the scenario question; make the feedback for wrong answers explain why the distractor is incorrect"*), and the agent iterates until the output matches the intended design.

Transform outputs are single-file HTML documents that require no server infrastructure, run entirely in the browser, and embed all interactivity without external dependencies.

### Stage 4: Augment

The practitioner adds modalities that deepen engagement: audio narration (generated via text-to-speech), design rationale annotations visible to educators studying the module's construction, source citations, and accessibility features. The Augment stage also includes metadata tagging for discoverability and open licensing for reuse.

Table I summarizes the PITA stages with corresponding AI instruction patterns and expected outputs.

**Table I: PITA Framework Summary**

| Stage | Cognitive Operation | AI Instruction Pattern | Output |
|-------|--------------------|-----------------------|--------|
| Parse | Analysis | "Read and identify structure" | Concept map, learning objectives |
| Identify | Evaluation | "Generate and select activities" | Quiz items, scenarios, prompts |
| Transform | Synthesis | "Assemble into HTML" | Single-file interactive module |
| Augment | Creation | "Add modalities and metadata" | Audio, annotations, citations |

---

## IV. Workshop Design

### A. Structure and Duration

The workshop runs 75 minutes and requires no prior programming experience. Participants need only a laptop with a modern browser and access to a conversational AI platform (the workshop uses poe.com for platform neutrality, supporting multiple model providers through a single interface).

| Time | Activity |
|------|---------|
| 0–10 min | Introduction: The case for interactive professional communication resources; live demonstration of the Listening Demo prototype |
| 10–20 min | Framework introduction: PITA explained with worked examples; participants receive a pre-built AI skill file |
| 20–35 min | Hands-on: Parse and Identify stages with a chosen article |
| 35–55 min | Hands-on: Transform stage — generating the interactive HTML |
| 55–68 min | Hands-on: Augment stage — adding narration and annotations |
| 68–75 min | Debrief, reflection, and next steps for scaling |

### B. Materials Provided

Each participant receives:
1. A PITA skill file for their AI agent (a structured system prompt encoding the framework)
2. A curated list of ProComm articles cleared for workshop use
3. An HTML template with pre-built quiz components, progress tracking, and accessibility defaults
4. A CONTRIBUTING guide for submitting their completed module to the open-source ProComm Interactive repository

### C. Expected Participant Outcomes

By the end of the workshop, participants will be able to:
- Explain the PITA framework and its pedagogical rationale
- Direct an AI agent through all four stages to produce a complete interactive module
- Identify appropriate activity types for different learning objectives
- Contribute a completed module to a shared open educational resource collection

---

## V. Prototype: The ProComm Interactive Listening Demo

The workshop builds on a working prototype: an interactive transformation of Ly-dens and Lucena's 2009 IEEE Transactions on Professional Communication article, "Listening as an Engineering Skill" [9].

The prototype, accessible at [https://smartextbook.replit.app/listening-demo.html], demonstrates all four PITA stages in a completed artifact:

- **Parse**: The original article's five core concepts (basic vs. contextual listening, engineering communication failure modes, listening as a learnable skill) are organized into a four-section navigable structure.
- **Identify**: Each section includes two to three quiz items targeting Bloom's Apply level—scenario-based questions asking learners to classify real engineering communication situations rather than recall definitions.
- **Transform**: The entire module is a single HTML file (394 lines, no external dependencies) that runs in any browser without installation.
- **Augment**: Audio narration for each section was generated using ElevenLabs text-to-speech; design rationale annotations—visible to educators studying the module—explain each pedagogical and technical decision. The module received formal consent from the original authors, who reviewed and approved the transformation.

The prototype was produced entirely through natural language instructions to an AI agent in under four hours, including content review time. This production efficiency is central to the workshop's argument: interactive professional communication education does not require a development team.

---

## VI. Scaling: The Open-Source ProComm Interactive Repository

The workshop introduces participants to a broader initiative: ProComm Interactive, an open-source project aiming to transform all 127 IEEE ProComm Communication Resources articles into interactive learning modules through volunteer contribution.

The repository architecture follows established open-source practices—GitHub Issues for article claiming, pull request review for quality assurance, and Creative Commons licensing (CC BY-NC 4.0) for content distribution. Each contribution includes a METADATA.md file recording the source article, contributor, AI tools used, and transformation decisions, creating a research dataset for studying how professional communicators engage with agentic AI tools.

This dataset directly supports the parallel research agenda described in the accompanying Teaching Case paper [Track B], enabling empirical investigation of how non-programming practitioners develop computational thinking through natural language programming.

---

## VII. Discussion: Implications for Professional Communication Practice

The PITA framework raises several questions worth surfacing in workshop discussion:

**Authorship and attribution.** When an AI agent generates quiz items and narration from a human author's article, what obligations does the transformer have to the original author? The ProComm Interactive model requires explicit author consent and preserves original attribution prominently. Participants will discuss how their institutions handle similar questions.

**Quality standards.** What makes an interactive module educationally effective rather than merely interactive? The workshop uses Bloom's Taxonomy as a shared vocabulary for evaluating activity design, but participants may surface additional criteria from their professional contexts.

**Sustainability and community governance.** Open educational resource initiatives face well-documented challenges of volunteer attrition and quality drift at scale [10]. The workshop will briefly introduce governance models from successful OER communities, inviting participants to consider how professional societies might sustain such initiatives differently from general-public crowdsourcing.

---

## VIII. Conclusion

Professional communication knowledge, accumulated over decades of practitioner scholarship, should not remain locked in formats that limit its pedagogical reach. The PITA framework and the agentic AI tools now available make it practical for professional communicators—without programming backgrounds—to transform their expertise into interactive, accessible, and sharable learning experiences.

This workshop offers participants not just a technique but a disposition: that the skills professional communicators already possess—clear analysis, purposeful structure, precise language—are exactly the skills that make effective AI collaboration possible. The most important transformation is not from static to interactive, but from consumer to creator.

---

## References

[1] G. Elidan, A. Hassidim, Y. Matias, A. Raghunathan, and A. Shashua, "Towards an AI-Augmented Textbook," arXiv:2509.13348, 2025.

[2] R. E. Mayer, *Multimedia Learning*, 2nd ed. Cambridge, UK: Cambridge University Press, 2009.

[3] A. Sarkar and I. Drosos, "Vibe coding: programming through conversation with AI," arXiv:2506.23253, 2025.

[4] Google DeepMind, "Learn Your Way: Personalized AI-powered learning," Technical Report, 2025.

[5] H.-C. K. Lin, "Writing Is Coding: Natural Language Programming in Professional Communication Pedagogy," *Int. J. Online Pedagogy and Course Design*, 2025.

[6] IEEE Professional Communication Society, "ProComm's AI Research Questions," procomm.ieee.org, 2024.

[7] P. J. Kim, "Learnersourcing: Improving Learning with Collective Student Work," PhD dissertation, MIT Media Lab, 2015.

[8] L. Von Ahn, B. Maurer, C. McMillen, D. Abraham, and M. Blum, "reCAPTCHA: Human-Based Character Recognition via Web Security Measures," *Science*, vol. 321, no. 5895, pp. 1465–1468, 2008.

[9] J. A. Ly-dens and J. C. Lucena, "Listening as an Engineering Skill," *IEEE Trans. Prof. Commun.*, vol. 52, no. 4, pp. 302–322, Dec. 2009.

[10] D. Wiley, T. T. Hilton, S. Ellington, and T. Hall, "A Preliminary Examination of the Cost Savings and Learning Impacts of Using Open Textbooks in Middle and High School Science Classes," *The International Review of Research in Open and Distributed Learning*, vol. 13, no. 3, 2012.

---

*Word count: ~1,850 (abstract + body). IEEE conference two-column format: approximately 5 pages.*  
*To format: paste into IEEE conference LaTeX template (IEEEtran) or Word template available at ieee.org/conferences.*
