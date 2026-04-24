# Workshop: From Static to Interactive — Transforming Professional Communication Materials with Agentic AI and Vibe Coding

**ProComm-26 Submission #64 | Camera-ready | April 30, 2026**  
**Simon Wang** | Language Centre, Hong Kong Baptist University | simonwang@hkbu.edu.hk  
**Keywords**: Agentic AI, interactive learning materials, PITA framework, professional communication pedagogy, vibe coding

---

## Abstract

The IEEE Professional Communication Society hosts over 127 static articles of significant pedagogical value. This workshop introduces the PITA framework—Parse, Identify, Transform, Augment—a structured, no-code methodology for transforming these articles into interactive learning modules using agentic AI and vibe coding. Participants without programming backgrounds will direct an AI agent through each PITA stage using natural language instructions, producing a complete browser-based interactive lesson within the 75-minute session. A working prototype demonstrating the full workflow is available at https://simon.hkbu.me/aiworkshop/listeningdemo.

---

## 1. Introduction

Static professional communication articles rarely achieve their full pedagogical potential. Research consistently demonstrates that active engagement—through scenario-based questions, immediate feedback, and multimodal representation—produces deeper and more durable learning than passive reading [1]. The challenge for practitioners is not a shortage of good content but a shortage of accessible tools for transforming that content into interactive form.

Agentic AI systems can now execute multi-step document transformation tasks autonomously from natural language instructions—reading an article, identifying its structure, generating quiz items, producing narration scripts, and assembling HTML output without traditional programming. This capability, termed vibe coding [2], makes interactive learning design accessible to professional communicators whose expertise lies in language rather than software.

---

## 2. The PITA Framework

PITA is a four-stage workflow for transforming a static article into a self-contained interactive module.

**Parse.** The AI agent analyzes the source article, identifying key concepts, argumentative structure, and candidate learning objectives aligned to Bloom's Taxonomy.

**Identify.** The practitioner, guided by Parse output, selects which concepts require active practice and what activity types—scenario questions, classification tasks, reflection prompts—will reveal genuine understanding rather than surface recall.

**Transform.** The agent assembles a single-file HTML module with navigation, quiz logic, progress tracking, and instant feedback. The output requires no server infrastructure and runs in any browser.

**Augment.** The practitioner adds modalities: AI-generated audio narration, design rationale annotations for educators, source citations, and accessibility features.

---

## 3. Prototype: The Listening Demo

The workshop centers on a working example: an interactive transformation of Ly-dens and Lucena's 2009 *IEEE Transactions on Professional Communication* article on listening as an engineering skill [3]. The prototype demonstrates all four PITA stages in a completed artifact. Each section includes scenario-based quiz items targeting Bloom's Apply level, audio narration generated via ElevenLabs text-to-speech, and visible design annotations explaining each pedagogical decision. The entire module was produced through natural language instructions to an AI agent in under four hours, including content review. The original authors have reviewed and approved the transformation.

---

## 4. Workshop Design

The 75-minute session requires no prior programming experience. Participants need only a laptop with a browser and access to poe.com, a platform-neutral interface supporting multiple AI model providers.

| Time | Activity |
|------|---------|
| 0–10 min | Live demonstration of the Listening Demo prototype |
| 10–20 min | PITA framework introduction; participants receive a pre-built AI skill file |
| 20–35 min | Hands-on: Parse and Identify with a chosen ProComm article |
| 35–55 min | Hands-on: Transform—generating the interactive HTML |
| 55–68 min | Hands-on: Augment—adding narration and design annotations |
| 68–75 min | Debrief and next steps |

Each participant receives a PITA skill file (a structured system prompt encoding the workflow), a curated list of ProComm articles cleared for workshop use, and a contribution guide for the open-source ProComm Interactive repository.

---

## 5. Broader Initiative and Research Agenda

The workshop introduces ProComm Interactive, an open-source project aiming to transform all 127 IEEE ProComm Communication Resources articles through volunteer contribution. Each completed module is submitted as a single HTML file with a metadata record documenting source article, contributor, and AI tools used.

This repository constitutes a research dataset for studying how professional communicators develop computational thinking through natural language programming—directly supporting a parallel Teaching Case submission to *IEEE Transactions on Professional Communication* investigating non-programming practitioners' engagement with agentic AI tools.

---

## 6. Conclusion

Professional communicators already possess the core competency that agentic AI collaboration requires: precise, purposeful language. The PITA framework gives that competency a new application—not writing about communication, but actively transforming accumulated professional knowledge into interactive educational resources. Participants will leave with a replicable workflow and a completed artifact, ready to contribute to a growing open collection of interactive professional communication learning materials.

---

## References

[1] R. E. Mayer, *Multimedia Learning*, 2nd ed. Cambridge University Press, 2009.

[2] A. Sarkar and I. Drosos, "Vibe coding: programming through conversation with AI," arXiv:2506.23253, 2025.

[3] J. A. Ly-dens and J. C. Lucena, "Listening as an Engineering Skill," *IEEE Trans. Prof. Commun.*, vol. 52, no. 4, pp. 302–322, Dec. 2009.

---

*Word count: ~700 words (body text, excluding title block, table, and references)*
