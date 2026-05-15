# STILE — Plug and Play Editor

**Platform**: STiLE — Scholarship of Teaching in Language Education
**URL**: https://www.stile.hk
**Section**: Plug and Play — https://www.stile.hk/osp/catalog/category/PLUG-AND-PLAY
**Dr Simon Wang's role**: Plug and Play Section Editor

## Google Drive
https://drive.google.com/drive/folders/1hyJXh3xkGyhX5B-nmwfi3OD7oV72N_uT

```
📁 STILE — Plug and Play Editor (Dr Simon Wang)
   ├── 📁 01 — Plug and Play Content
   ├── 📁 02 — Lesson Adaptations (SmartTextbook)
   ├── 📁 03 — Research & Editorial Notes
   └── 📁 04 — Collaboration Docs
```

## About STiLE

STiLE (Scholarship of Teaching in Language Education) is an Open Journal Systems
(OJS 3.3) platform for language education practitioners in Hong Kong and beyond.

The **Plug and Play** section publishes ready-to-use teaching resources — not
traditional research papers, but practical materials: videos, interactive modules,
micropodcasts, annotated lesson plans. They are peer-reviewed for pedagogical
quality and immediately deployable in classrooms.

## Current Plug and Play Articles (fetched May 2026)

| Title | Author(s) | Format |
|-------|-----------|--------|
| "Sorry to interrupt you there…" — EAP authentic discussions | Richard Nickalls et al. | Video + activities |
| Multimodal Modules for Language Proficiency Enhancement | Michelle Tam, Eva Li, Agnes Tsang, Evangeline Hung | Modules |
| Creative Problem Solving and Communication in Entrepreneurship | YAN XIA | Course materials |
| Accurate Use of Schwa in British English | Ryan Windsor | Pronunciation practice |
| 邏輯重音──有聲語言表達手機微課 | Tao Ren | Micropodcast (Chinese) |
| Generative AI and its Potential Implications for EAP | Aditi Jhaveri | Reflective article |
| Bridging the Gap between Pedagogy and Workplace Needs | Mable Chan | Teaching design |
| "Let's Move on to the Recommendations." — Phrasal Verbs | Siyang Zhou, Hongzhu Wang | Corpus analysis |
| Professional Accreditation — Challenging but worth it | Mike Groves | Case study |

## Folder Structure (this codebase)

```
projects/STILE/
├── README.md                     ← this file
├── plug-and-play-content/        ← raw article text, metadata, URLs
├── lesson-adaptations/           ← SmartTextbook-generated interactive versions
├── editorial-notes/              ← review notes, submission guidelines, decisions
├── meeting-prep/                 ← notes for editorial meetings
└── research/                     ← any research directions emerging from editorial work
```

## Connection to SmartTextbook

See `docs/skills/SmartTextbook-SKILL-08-STILE-Connection-Analysis.md` for the full
analysis. Key integration points:

1. **PITA pipeline** — any Plug and Play article URL → SmartTextbook interactive lesson
   via existing `/api/fetch-url` + `/api/generate-lesson` endpoints
2. **AI Tutor embed** — SSE chat (`/api/chat`) embeddable in STILE article pages
3. **Access code** — `STILE2026` variant of the IEEE2026 server-side AI proxy
4. **xAPI tracking** — learning analytics for Plug and Play reader engagement
5. **Certificate** — completion certificates for multi-part Plug and Play modules

## Related Files

- `docs/skills/SmartTextbook-SKILL-08-STILE-Connection-Analysis.md`
- `artifacts/api-server/src/routes/ieee.ts` — Teaching Case pipeline to adapt for STILE
- `artifacts/api-server/src/routes/ai-tutor.ts` — access code pattern to reuse
- `artifacts/lesson-builder/public/listening-demo.html` — demo format for Plug and Play
