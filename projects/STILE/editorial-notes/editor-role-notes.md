# Plug and Play Editor — Role Notes & Action Items

**Editor**: Dr Simon Wang, Language Centre, HKBU
**Platform**: STiLE (stile.hk) — OJS 3.3
**Section**: Plug and Play (OAI set: osp:PAP)
**Status**: Incoming — role to be formally confirmed

---

## What Plug and Play Is

Unlike STiLE's research articles, Plug and Play publishes **immediately deployable teaching resources** — not arguments or findings, but materials practitioners can pick up and use. Current formats include:

- Video micropodcasts (Tao Ren's 邏輯重音; Ryan Windsor's Schwa)
- Multi-video teaching scenarios (Nickalls' EAP discussions — 6 MP4s)
- Written resource packs with video abstracts (most Vol. 2–4 articles)
- Interactive modules (Michelle Tam et al.'s Multimodal Modules)

The Plug and Play editor's job is to **solicit, review, and curate these practical resources** — with a focus on pedagogical quality and immediate classroom applicability, not academic novelty.

---

## Immediate Action Items (as new editor)

### 1. DOAJ Application — Do First
STiLE almost certainly qualifies for DOAJ right now. Before applying, confirm:
- [ ] **CC license displayed on every article page** — DOAJ requires explicit Creative Commons licensing (CC BY 4.0 or similar) shown per article, not just in policy text
- [ ] **Open access statement on homepage** — one clear paragraph; DOAJ reviewers check this specifically
- [ ] **Apply at**: https://doaj.org/apply/
- [ ] **Timeline**: 3–6 months to decision

DOAJ listing is the single highest-leverage action for STiLE visibility. It feeds into Scopus and WoS applications as a positive signal, and is a requirement for many funders' OA compliance policies.

### 2. OAI-PMH Metadata Quality Fix
The OAI feed (https://www.stile.hk/osp/oai) returns blank titles and abstracts for most articles — this is an OJS workflow/settings issue, not a technical problem. When articles are published in OJS, metadata must be filled in the submission form for it to appear in OAI.
- [ ] Raise with the managing editor: ensure article metadata is complete in OJS at publication time (title, abstract, keywords, author affiliations, language)
- [ ] This directly improves Google Scholar indexing quality and DOAJ/ESCI eligibility

### 3. English Abstracts for All Chinese Articles
Currently ~9 articles are Chinese-only or bilingual. ESCI and Scopus require English titles + abstracts for all articles.
- [ ] Prioritise: ids 79, 80, 122, 160, 182, 186 — add English abstracts retroactively if OJS allows
- [ ] Set as a submission requirement for new Plug and Play articles going forward

### 4. Open the REST API for Machine Access
The OJS REST API (`/api/v1/submissions`) currently returns 403 for anonymous users. Opening it (read-only) would:
- Enable SmartTextbook's `GET /api/stile/catalog` auto-sync endpoint
- Allow external tools and researchers to harvest structured metadata
- [ ] Request from the OJS administrator — it is a one-setting change in OJS admin panel

---

## Editorial Strategy

### A. SmartTextbook as the Plug and Play Production Tool

**Proposal for editorial board**: every accepted Plug and Play article automatically gets an AI-generated interactive companion lesson via SmartTextbook. Workflow:

```
Author submits article → Accepted → SmartTextbook PITA pipeline runs →
Interactive lesson draft generated → Author reviews/approves →
Published alongside the article as "Interactive Version"
```

This positions STiLE Plug and Play as the most technologically forward practitioner-research journal in the HK language education space. It also gives SmartTextbook real content to demonstrate to other stakeholders (IEEE ProComm, HKBU, potential funders).

**Technical cost**: zero new code — uses existing `/api/fetch-url` + `/api/generate-lesson` + `STILE2026` access code.

### B. Propose a New Submission Category: "Plug and Play Interactive"

Articles that come with a SmartTextbook-style interactive module as standard:
- Summary + key concepts
- Self-check quiz (3–5 questions)
- AI tutor panel (BYOK, or `STILE2026` access code for workshop settings)
- xAPI completion tracking
- Optional: completion certificate

Authors submit the article PDF + approve the AI-generated interactive version. STiLE publishes both.

### C. Use xAPI Data for STiLE Research Publications

SmartTextbook's xAPI tracking generates real learning analytics data. Once Plug and Play articles have interactive versions hosted on SmartTextbook:
- Aggregate engagement data (time-on-task, quiz scores, completion rates) available for research
- This data can support STiLE research articles on learning analytics and OER effectiveness
- Feeds a virtuous cycle: more engagement data → more research output → higher journal standing

### D. Diversify Author Geography

For ESCI/Scopus applications, reviewers look at international spread of authors and editorial board. Current author pool is >80% Hong Kong. Priorities:
- Invite contributors from: mainland China, Taiwan, Singapore, Australia, UK, North America
- Use IEEE ProComm network as a bridge — many ProComm members teach EAP and professional communication
- Dr Traci Nathans-Kelly (Cornell) could write a cross-over Plug and Play resource linking technical communication to language education

---

## Connection to IEEE ProComm Work

| Dimension | STiLE Plug and Play | IEEE ProComm Interactive |
|-----------|--------------------|-----------------------|
| Audience | Language teachers / practitioners | Engineering/technical communication educators |
| Content type | Practical teaching resources | Interactive lessons from journal articles |
| AI tool | SmartTextbook PITA pipeline | SmartTextbook PITA pipeline |
| Tracking | xAPI → PostgreSQL | xAPI → PostgreSQL |
| Access code | `STILE2026` (proposed) | `IEEE2026` (live) |
| Certificate | SHA-256 completion cert | SHA-256 completion cert |

The SmartTextbook platform serves both communities simultaneously. Dr Simon Wang holds editorial standing in both — this is a unique position to build a cross-community open educational resource ecosystem.

---

## Key Contacts (to establish)

- [ ] STiLE Editor-in-Chief — confirm onboarding, get OJS editor access
- [ ] OJS administrator at stile.hk — request API access, metadata fix
- [ ] DOAJ application contact person at STiLE
- [ ] Potential international Plug and Play contributors (to diversify author geography)
