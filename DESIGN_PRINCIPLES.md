# Design Principles: Bring Your Own Key & Platform Neutrality

*SmartTextbook / LessonBuilder — Living Document*
*First published: April 2026*

---

## Document Ownership & Update Cadence

This document is maintained alongside the codebase. It should be reviewed and updated whenever:

- A new AI provider is added or removed from the platform
- An export format is introduced, changed, or deprecated
- A data storage or credential-handling decision is made that affects either principle
- A significant architectural change alters how BYOK or platform neutrality is implemented

**Owner:** The principal maintainer of the SmartTextbook repository.
**Audience:** Developers, educators, AI researchers, institutional partners, and contributors.

The timeless sections — principle statements, rationale, and implications — should change rarely and only when the underlying conviction changes. The implementation-specific appendix at the end of this document should be updated regularly to reflect the current state of the codebase.

---

## Introduction

This document articulates two foundational design principles that underpin the SmartTextbook platform and its family of educational tools — including LessonBuilder, MartinPeaceBot, and the course-specific AI tutoring systems developed for research projects in university language education, diplomatic simulation, career coaching, and data journalism pedagogy.

These principles did not emerge from abstract theorising. They emerged from practical choices made while building real tools for real students in real courses — and then asking, each time, what kind of relationship between learner, educator, and technology those choices implied.

The two principles are:

1. **Bring Your Own Key / Compute (BYOK)** — the platform does not hold API credentials on behalf of users. Each user provisions their own access to AI services.
2. **Platform Neutrality** — the platform does not assume, prefer, or require any specific AI provider, LMS, institution, or technology stack. The pedagogical value travels independently of the tooling.

These principles are architectural decisions with pedagogical consequences. This document explains what they are, why they matter, what they demand of the platform, and what they mean for the educators, students, and developers who use and build with these tools.

---

## Principle 1 — Bring Your Own Key / Compute (BYOK)

### Statement

> *The platform does not intermediate between users and AI providers. Users supply their own API credentials, which are stored locally on their device and never transmitted to or stored on any platform server.*

### What This Means

In the SmartTextbook architecture, every AI call — lesson generation, quiz creation, AI tutor chat — is made with an API key the user has configured themselves. The key is stored in the browser's `localStorage`. The server acts as a stateless proxy: it forwards the request and the key to the chosen provider, receives the response, and returns it. No key is logged. No key is persisted in any database. When the user clears their browser data, their key is gone.

The exported standalone HTML lesson file extends this further: the file contains no server dependency at all. When a learner opens the exported lesson in any browser, they are prompted for their API key on first launch. That key is stored only in `localStorage` scoped to that file. The lesson — summary, glossary, quiz, embedded AI tutor — runs entirely in the browser. No platform server needs to be running. The learner's AI tutor conversation never leaves their device.

This is BYOK in its fullest form: the pedagogical value (the structured lesson, the tutor persona, the quiz) is separable from any ongoing relationship with the platform that created it.

### Why It Matters: The Rationale

**1. Trust is earned through architecture, not policy.**
A privacy policy that says "we don't store your API keys" is a claim. An architecture where the server is stateless with respect to credentials is a guarantee. The BYOK model makes the privacy commitment structural rather than contractual.

**2. Cost transparency is an AI literacy outcome.**
A learner who has signed up for an AI provider account, added their own credits, and watched the balance decrease as they generate lessons has learned something a learner using a shared school account cannot: that AI has a cost structure, a provider relationship, and a usage model. The understanding that AI is a service with economics and policies — not a magic box — is a core AI literacy competency. BYOK teaches this not through a workshop but through the act of using the tool.

**3. Democratisation requires decoupling.**
If the platform held keys and billed users, access would depend on the platform's pricing, survival, and geographic reach. Under BYOK, access depends only on whether the user can obtain a key from any one of the supported providers. This means access is not gated by whether the user can pay a subscription to a specific SaaS company, and it remains accessible even if the platform's own commercial model changes. The pedagogical design is the asset; the API access is the user's own.

**4. Institutional trust and compliance are preserved.**
When a platform holds API keys, it accumulates institutional risk: data residency questions, vendor relationship disclosures, potential for key leakage at scale. Under BYOK, the institution's exposure is minimal. Each educator or student's choice of provider is their own, governed by their institution's existing AI governance policies. This matters particularly in contexts where institutional policies are still evolving or vary significantly across organisations.

### What BYOK Demands of the Platform

BYOK is not a free lunch. It imposes real obligations on the platform:

**Provider breadth.** If users must bring their own keys, the platform must support enough providers that users can realistically obtain one. A narrow provider list defeats the purpose. See the Appendix for the current list of supported providers; the principle requires that this list remain broad and that adding new providers is straightforward. Supporting any OpenAI-compatible endpoint as a generic option is a baseline requirement.

**Connection testing.** Because users configure credentials themselves, the platform must provide clear, immediate feedback when a key is invalid, has insufficient credits, or points to the wrong endpoint — before the user invests time generating content.

**Graceful export.** Any content export feature (standalone files, SCORM packages) must work correctly with any supported provider, not just the one used during content creation. Export formats that require a running server implicitly break BYOK for the exported artefact; this constraint must be evaluated explicitly for each export type.

**Clear communication.** The BYOK model requires that every onboarding surface — landing page, credential configuration UI, export dialogs, README — explains plainly what "bring your own key" means, what it costs approximately, and what happens to the key after it is entered. Opacity here undermines the AI literacy rationale for the model.

### Prior Art and Industry References

BYOK is an established pattern in the AI infrastructure space. [LiteLLM](https://docs.litellm.ai/), an open-source LLM proxy gateway, implements BYOK as a core feature: users configure their own provider credentials, and LiteLLM routes requests accordingly without centralising key management. [Open WebUI](https://openwebui.com/) similarly enables users to bring API keys for any OpenAI-compatible backend. Major infrastructure providers — including Vercel, Cloudflare, and JetBrains — all offer BYOK modes in their AI products for the same reasons: to respect user privacy, avoid accumulating credential liability, and support users whose organisations prohibit third-party key custody. (See the References section for specific links.)

In the EdTech domain, BYOK is rarer — most educational platforms centralise AI access behind institutional contracts. This platform's BYOK model is intentionally unusual in EdTech because it prioritises learner agency and AI literacy over the convenience of managed access. The closest analogue in pedagogy is the philosophy behind the [xAPI / Experience API](https://xapi.com/) standard: the learner's data belongs to the learner's institution (or the learner), not the platform. BYOK applies that same conviction to credentials.

---

## Principle 2 — Platform Neutrality

### Statement

> *The pedagogical design is the asset. The platform's value must be expressible independently of any specific AI provider, learning management system, institution, or technology stack.*

### What This Means

Platform neutrality shows up at every layer of the ecosystem:

**At the AI layer:** A lesson generated with one provider should be substantively equivalent to one generated with any other. The system prompts, output schemas, and lesson structure are designed to be provider-agnostic. Adding a new provider must not require changes to the lesson generation logic or the tutor prompt system — only to the provider registry and, if necessary, a thin adapter for a non-standard protocol.

**At the LMS layer:** Lessons are exported in formats that any compliant LMS can import. SCORM 2004 is the baseline — a long-established open standard supported by every major learning management system. The platform does not require a proprietary plugin, a vendor-specific registration process, or a commercial relationship with any LMS provider.

**At the data layer:** The platform's vision for learning analytics uses [xAPI (Experience API)](https://xapi.com/) — the open standard maintained by ADL (Advanced Distributed Learning Initiative). xAPI records are stored in a Learning Record Store (LRS) that the institution controls, not one operated by this platform. An institution can choose any xAPI-compatible LRS, including open-source self-hosted options. The data belongs to the institution and travels in open formats.

**At the pedagogical layer:** The prompt library, rubric design, and scaffolding architecture developed through this platform's research projects are described and documented as platform-agnostic. The same prompting philosophy that underpins a diplomatic simulation tutor can be deployed on any system with a system-prompt interface. This is deliberate: well-designed pedagogical frameworks should outlast any particular tool.

### Why It Matters: The Rationale

**1. Vendor lock-in is an existential risk for educational institutions.**
Institutional adoption of any educational technology carries a multi-year commitment. If a platform's value is inseparable from a specific AI provider, the institution's pedagogical investment is exposed to that provider's pricing changes, policy shifts, geographic availability, and corporate decisions. The history of the AI services market demonstrates that pricing, access policies, and model availability can change substantially within a single academic year. Platform neutrality means that when any provider changes its terms, educators do not need to rebuild their lesson library or retrain their students.

**2. Educational equity depends on provider diversity.**
AI provider access is not globally uniform. In some jurisdictions, certain providers are blocked or require payment methods unavailable to local users. In others, cost differences make some providers accessible and others prohibitive. A platform that works only with one provider implicitly serves only users with convenient access to that provider's infrastructure. Platform neutrality is an equity position: it means any educator or student with internet access and the ability to register with any one of a broad set of providers can use the tool on equivalent terms.

**3. Interoperability standards exist precisely to prevent capture.**
The EdTech standards ecosystem — including 1EdTech (formerly IMS Global) standards such as LTI, OneRoster, and QTI, alongside ADL's SCORM and xAPI — exists because the industry learned through hard experience what happens when educational content is trapped in proprietary formats. A school that builds its curriculum around a vendor's proprietary quiz format loses it when the vendor exits the market. These standards are the accumulated institutional memory of that lesson. Platform neutrality is the commitment to build on them rather than around them.

**4. Research validity requires reproducibility.**
Pedagogical research findings are only useful to other educators if they can be replicated without access to the same platform, provider contract, or technology stack. If a tutoring prompt system produces measurable improvements in student learning, that finding must be expressible and reproducible independently of the platform that first implemented it. Platform neutrality is the condition for research that travels.

**5. Open source amplifies platform neutrality.**
An open-source codebase means that an educator who wants to deploy their own instance, an institution that wants to run the tool on its own infrastructure, or a developer who wants to adapt the lesson generation logic for a different subject domain can all do so without negotiating a license. This is the practical expression of platform neutrality at the distribution layer.

### What Platform Neutrality Demands of the Platform

Platform neutrality is also a constraint that imposes architectural discipline:

**Provider abstraction.** The LLM client layer must treat all providers equivalently at the interface level. Adding a new provider cannot require changes to the lesson generation logic or the tutor prompt system — only to the provider registry and, if necessary, a new protocol adapter. Where an industry-wide de facto standard API format exists (as the OpenAI-compatible format has become), the platform's architecture should exploit that convergence without depending on any one originating vendor.

**Standard-first data formats.** Lesson structure, quiz formats, and learning records should be expressible in open standard formats: JSON-LD for structured lesson data, QTI for quiz questions, xAPI statements for learning events. Where the current implementation uses a simpler format, the roadmap toward open standards should be explicit and the current format should not create path dependency that makes migration harder.

**No proprietary integrations in the core path.** The platform may offer convenience integrations with specific platforms or services. These must always be optional add-ons. The core lesson generation, tutor, quiz, and export workflow must function without any proprietary integration.

**Documentation that outlives the platform.** The README, this document, and research proposal documentation should all be written so that the pedagogical design can be understood, replicated, and extended independently of the platform's continued operation. The code is the current expression of the design; the design is the asset.

### Prior Art and Industry References

**LiteLLM** implements provider neutrality at the infrastructure level: a single unified API that routes to many LLM providers, allowing applications to switch providers by changing a configuration parameter rather than rewriting code. This is the infrastructure expression of the same principle this platform adopts at the pedagogical level.

**Open WebUI** exemplifies the separation of UI value from model access: the interface's value — conversation history, document upload, plugin system — is independent of which model powers it. Users bring their own self-hosted models, their own API keys, or their own proxy servers.

**The case for vendor-neutral AI education** has been articulated by practitioners and researchers who note that when an institution's AI literacy curriculum is built around one platform's specific interface, it teaches students to use a product rather than to reason about AI. Platform neutrality in the tool helps cultivate platform neutrality as a learner disposition.

**IMS Global / 1EdTech** has published the definitive EdTech interoperability standards since 1997. LTI allows any compliant tool to launch from any compliant LMS with authenticated user context. OneRoster standardises the exchange of class, enrollment, and grade data. QTI standardises quiz and assessment item formats. These standards exist because the alternative — each vendor's proprietary format — was tried and failed the institutions that adopted it.

**xAPI (Experience API)** was released as the successor to SCORM, designed to record learning experiences across any context — not just LMS-hosted courses. Its actor-verb-object statement model and LRS architecture — data owned by the institution, not the tool vendor — is the data-layer expression of platform neutrality.

---

## How These Principles Relate to Each Other

BYOK and Platform Neutrality are not independent principles that happen to coexist. They are two expressions of the same underlying conviction:

> *The learner's relationship with knowledge should not be intermediated by any single institution's commercial interests.*

BYOK applies this conviction to AI access: the learner controls which provider they use and pays for it directly, without the platform accumulating either the credential or the commercial relationship.

Platform Neutrality applies this conviction to content and interoperability: the lesson, the prompt design, and the learning data all travel in open formats and do not require the platform's continued operation or commercial viability to remain useful.

Together, they define what it means for an EdTech platform to be genuinely open — not just in source code, but in philosophy. A platform can be open source while still creating lock-in through proprietary data formats, single-provider AI dependencies, or opaque credential management. BYOK and Platform Neutrality close those lock-in vectors.

---

## Implications for Educators

These principles have concrete consequences for educators using the platform:

- **You are not tied to a subscription.** Your lessons, your prompt customisations, and your exported files are yours. They do not require a platform account or a platform server to function.
- **You choose your AI.** If your institution has a preferred or approved provider, you can use it. If you want to use the most cost-effective option for your budget, you can switch without migrating your lesson library.
- **Your students' conversations are private.** AI tutor conversations are stored in the student's browser only. You, the platform, and the AI provider do not receive a copy unless the student explicitly exports and shares it.
- **Your lessons are portable.** A lesson generated today can be opened in any browser, imported into any SCORM-compatible LMS, and used without any dependency on this platform's continued operation.

---

## Implications for Developers and Contributors

These principles are also constraints on development decisions:

- **Do not add features that require a specific AI provider.** If a feature only works with one provider's proprietary capabilities, it must either be abstracted to a provider-neutral interface or marked explicitly as a provider-specific extension that does not compromise the core experience for users of other providers.
- **Do not store credentials server-side.** The API proxy architecture must remain stateless with respect to user credentials. Session state for other purposes (rate limiting, shared lesson access) is acceptable; credential storage is not.
- **Prefer open standards over convenience.** When choosing between a proprietary export format and an open standard, choose the open standard even if the proprietary format is easier to implement. This is a long-term investment that pays for institutional trust.
- **Document the pedagogical design, not just the code.** The prompt system, the scaffolding architecture, and the assessment rubric design should be documented well enough that they can be reimplemented in a different codebase. The code is the current expression of the design; the design is the asset.

---

## References and Further Reading

### Open Standards

- **xAPI (Experience API / Tin Can API)** — ADL (Advanced Distributed Learning Initiative). Open standard for cross-context learning records. [xapi.com](https://xapi.com/) · [adlnet.gov](https://adlnet.gov/projects/xapi/)
- **SCORM 2004** — ADL. LMS-packaging standard for self-contained online courses. [adlnet.gov/projects/scorm](https://adlnet.gov/projects/scorm/)
- **LTI (Learning Tools Interoperability) 1.3** — 1EdTech Consortium (formerly IMS Global). Enables authenticated tool launch from any compliant LMS. [1edtech.org](https://www.1edtech.org/standards/lti)
- **QTI (Question and Test Interoperability) 3.0** — 1EdTech Consortium. Standard format for quiz and assessment item exchange. [1edtech.org](https://www.1edtech.org/standards/qti)
- **OneRoster 1.2** — 1EdTech Consortium. Standard for class, enrollment, and grade data exchange. [1edtech.org](https://www.1edtech.org/standards/oneroster)
- **CMI5** — ADL / AICC. Next-generation LMS-to-content specification built on xAPI. [aicc.org/cmi5](https://aicc.org/cmi5/)

### Open Source Projects

- **LiteLLM** — Open-source LLM proxy gateway with unified provider-neutral API and BYOK support. [litellm.ai](https://litellm.ai/) · [docs.litellm.ai](https://docs.litellm.ai/)
- **Open WebUI** — Browser-based AI interface separating UI value from model access; supports BYOK and self-hosted models. [openwebui.com](https://openwebui.com/)

### Industry References on BYOK

- Vercel AI Gateway — BYOK documentation: [vercel.com/docs/ai-gateway/authentication-and-byok/byok](https://vercel.com/docs/ai-gateway/authentication-and-byok/byok)
- Cloudflare AI Gateway — Bring Your Own Keys: [developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/)
- JetBrains AI — BYOK feature documentation: [blog.jetbrains.com/ai](https://blog.jetbrains.com/ai/)

### EdTech Vendor Neutrality

- AISDI — "The Case for Vendor-Neutral AI Education: Why Adaptability Matters More Than Platform Loyalty": [aisdi.ai](https://aisdi.ai/the-case-for-vendor-neutral-ai-education-why-adaptability-matters-more-than-platform-loyalty/)
- Aristek Systems — "eLearning Standards: SCORM, xAPI, cmi5, LTI, OneRoster and Ed-Fi Explained": [aristeksystems.com/blog/elearning-standards](https://aristeksystems.com/blog/elearning-standards/)

### Pedagogical Research Context

- Ahmedtelba et al. (2025) — On "unproductive cognitive offloading" in GenAI-assisted learning. Referenced in HKU RSLEIHE 2026-27 scheme documentation.
- Chan, C. & Colloton, T. (2024) — *AI Assessment Integration Framework* and "Human-Machine Partnership Assessment." Hong Kong University. [aied.talic.hku.hk](https://aied.talic.hku.hk/)
- Cook-Sather, A., Bovill, C., & Felten, P. (2014) — *Engaging Students as Partners in Learning and Teaching: A Guide for Faculty*. Jossey-Bass. Foundation reference for the Students as Partners (SaP) framework.
- Google Research / arXiv:2509.13348 (2025) — "Towards an AI-Augmented Textbook." Research validation for the structured lesson + Socratic tutor architecture.
- HKU GenAI Guidebook (Tsao & Wong, 2025): [commoncore.hku.hk](https://commoncore.hku.hk/wp-content/uploads/documents/Guidebook%20-%20GenAI%20in%20Teaching%20and%20Learning.pdf)

---

## Appendix — Current Implementation Details

*This appendix reflects the state of the codebase at the time of the document's most recent review. It changes more frequently than the principles above and should be updated whenever the relevant code changes.*

### Supported AI Providers (as of April 2026)

The platform currently supports the following providers. All except Poe use the OpenAI-compatible API format; any additional provider that uses this format can be added via the custom endpoint option.

| Provider | Notes |
|----------|-------|
| OpenAI | GPT-4o family, o-series reasoning models |
| Google Gemini | Gemini 1.5 and 2.x series |
| DeepSeek | Chat and Reasoner models |
| Grok (xAI) | Grok 2 and 3 series |
| Mistral AI | Mistral Large / Small / Codestral |
| OpenRouter | Aggregator: 300+ models across providers |
| Together AI | Open-weight model hosting |
| MiniMax | Chinese-language and multilingual models |
| Poe | Via server-side proxy (not available in standalone HTML export) |
| Kimi (Moonshot) | Long-context models |
| Custom endpoint | Any OpenAI-compatible API URL |

### Key Architectural Files

- `artifacts/api-server/src/lib/llm-client.ts` — Provider abstraction and routing layer
- `artifacts/lesson-builder/src/lib/providers.ts` — Provider registry (frontend)
- `artifacts/api-server/src/routes/` — API endpoints including stateless credential proxy
- `artifacts/lesson-builder/src/lib/generate-html/` — Standalone HTML export

### Roadmap Items Related to These Principles

The following are planned or in-progress. Their completion would deepen the platform's conformance with these principles:

- **SCORM 2004 export** — Enables LMS-neutral distribution of lessons
- **xAPI event emission** — Enables institution-controlled learning analytics
- **LTI 1.3 launch support** — Enables LMS-native deployment without accounts
- **Privacy dashboard** — Enables learners to see and delete all locally stored data

---

*Platform: [smartextbook.replit.app](https://smartextbook.replit.app) · GitHub: [github.com/tesolchina/Smartextbook](https://github.com/tesolchina/Smartextbook)*
*Built by Dr. Simon Wang, Lecturer in English & Innovation Officer, The Language Centre, Hong Kong Baptist University.*
