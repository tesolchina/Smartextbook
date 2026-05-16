# STILE — Plug and Play Editor

**Dr Simon Wang** — Plug and Play Section Editor (incoming)
**Platform**: STiLE — Scholarship of Teaching in Language Education
**Journal URL**: https://www.stile.hk/osp
**Plug and Play section**: https://www.stile.hk/osp/catalog/category/PLUG-AND-PLAY

---

## Journal Identity (confirmed May 2026)

| Field | Value |
|-------|-------|
| Full title | STiLE — Scholarship of Teaching in Language Education |
| Abbreviation | STiLE |
| ISSN | **3005-5253** (online) |
| DOI prefix | **10.59936** (CrossRef-registered) |
| Platform | OJS 3.3 — self-hosted at stile.hk |
| First issue | Vol. 1, No. 1 — March 2023 |
| Latest | Vol. 4, No. 1 (2025–2026, in progress) |
| Total articles (sitemap) | **29** |
| Access | Fully open — all PDFs and MP4s publicly downloadable, no login |
| Languages | English + Chinese (Traditional + Simplified) |
| Sections | Research Articles · Reviews · Reflections · **Plug and Play** |

---

## Google Drive

[STILE — Plug and Play Editor (Dr Simon Wang)](https://drive.google.com/drive/folders/1hyJXh3xkGyhX5B-nmwfi3OD7oV72N_uT)

```
📁 STILE — Plug and Play Editor (Dr Simon Wang)
   ├── 📁 01 — Plug and Play Content
   ├── 📁 02 — Lesson Adaptations (SmartTextbook)
   ├── 📁 03 — Research & Editorial Notes
   └── 📁 04 — Collaboration Docs
```

---

## Machine Readability (assessed May 2026)

| Interface | Status | Notes |
|-----------|--------|-------|
| **OAI-PMH** | ✅ Active | `https://www.stile.hk/osp/oai` — set `osp:PAP` for Plug and Play |
| **Sitemap** | ✅ Complete | 64 URLs, 43 article pages — all discoverable |
| **HTML meta tags** | ✅ Rich | 53 `DC.*` + `citation_*` tags per article |
| **CrossRef DOIs** | ✅ Registered | All articles have DOIs; CrossRef member ID 38443 |
| **Google Scholar** | ✅ Indexed | Confirmed — articles appearing with citation counts |
| **PDF download** | ✅ Open | `/uploads/journals/1/pdf/…` and `/pdf/…` — HTTP 200, no auth |
| **MP4 download** | ✅ Open | `/uploads/journals/1/video/…` — HTTP 200, no auth |
| **REST API** | ❌ Auth-gated | `GET /api/v1/submissions` → 403 for anonymous requests |
| **OAI metadata quality** | ⚠️ Patchy | Titles/abstracts blank in OAI feed; rich in HTML — OJS settings issue |
| **robots.txt** | ✅ Permissive | Only `/cache/` blocked |

**Practical access path**: OAI-PMH (osp:PAP set) → article URLs → HTML scrape or direct PDF download.

---

## Content Downloaded (May 2026)

- **25 PDFs downloaded** → `plug-and-play-content/pdfs/` (15 MB total)
- **4 articles video-only** (no PDF): ids 79, 80, 167, 172
- Full metadata in `plug-and-play-content/catalog-full.json`
- Human-readable catalog in `plug-and-play-content/catalog.md`

---

## Current Indexing Status

| Index | Status |
|-------|--------|
| CrossRef | ✅ Registered |
| Google Scholar | ✅ Indexed (confirmed) |
| DOAJ | ❌ Not listed — **apply now, likely qualifies** |
| ERIC | ❌ Not listed — apply 2026–2027 |
| ESCI / Web of Science | ❌ Not listed — target 2027–2028 |
| Scopus | ❌ Not listed — target 2028–2029 |
| SSCI | ❌ Not listed — long-term aspiration |

Full strategy: `research/indexing-strategy.md`

---

## Folder Structure

```
projects/STILE/
├── README.md                            ← this file — project overview
├── plug-and-play-content/
│   ├── catalog.md                       ← all 29 articles, by volume/issue
│   ├── catalog-full.json                ← machine-readable metadata + PDF links
│   └── pdfs/                            ← 25 PDFs downloaded (15 MB)
├── editorial-notes/
│   └── editor-role-notes.md             ← role scope, action items, DOAJ checklist
├── research/
│   └── indexing-strategy.md             ← full DOAJ/ERIC/ESCI/Scopus/SSCI roadmap
├── lesson-adaptations/                  ← SmartTextbook-generated interactive versions
└── meeting-prep/                        ← editorial meeting notes
```

---

## Connection to SmartTextbook

See `docs/skills/SmartTextbook-SKILL-08-STILE-Connection-Analysis.md` for full analysis.

**Zero new code needed — direct reuse:**

| SmartTextbook feature | STiLE application |
|-----------------------|-------------------|
| `/api/fetch-url` + `/api/generate-lesson` | PITA pipeline: any STiLE article URL → interactive lesson |
| `/api/chat` SSE streaming | AI tutor embeddable in STiLE article pages |
| `IEEE2026` access code pattern | `STILE2026` — free AI access for workshop participants |
| xAPI tracking (`/api/xapi`) | Learning analytics for Plug and Play reader engagement |
| Certificate system | Completion certificates for multi-part Plug and Play modules |

**New endpoint to build** (medium effort — wraps existing code):
`POST /api/stile/transform-article` — takes STiLE article URL, runs PITA, returns embeddable interactive lesson

**Leverage as editor**: offer every accepted Plug and Play author an AI-generated interactive companion lesson — SmartTextbook already does this for IEEE ProComm. STiLE Plug and Play is a natural second community.

---

## Related Files in Codebase

| File | Purpose |
|------|---------|
| `docs/skills/SmartTextbook-SKILL-08-STILE-Connection-Analysis.md` | Full integration analysis |
| `artifacts/api-server/src/routes/ieee.ts` | Teaching Case pipeline to adapt for STiLE |
| `artifacts/api-server/src/routes/ai-tutor.ts` | Access code pattern (`IEEE2026` → `STILE2026`) |
| `artifacts/lesson-builder/public/listening-demo.html` | Demo HTML format for Plug and Play |
