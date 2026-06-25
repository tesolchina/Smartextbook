# IEEE ProComm 2026 Workshop — Dr Simon Wang (Facilitator)

**Conference:** IEEE Professional Communication Society Annual Conference (ProComm 2026)  
**Location:** Edmonton, Alberta, Canada  
**EasyChair submission:** #64 (accepted as **workshop**, not paper — present-to-publish via IEEE Xplore)  
**Simon travels:** from July 3rd; meets Traci in Edmonton  
**Collaborator:** Dr Traci Nathans-Kelly (Cornell University / VP Content, IEEE ProComm)

---

## Workshop Title
**"From Static to Interactive: Transforming Professional Communication Materials with Agentic AI and Vibe Coding"**

A hands-on, mobile-first workshop. Participants join from their phones, tap to answer live Kahoot-style polls, and experience the platform's own story: static IEEE articles → interactive modules → Accredible badges → freemium access.

---

## GitHub Repo
**`tesolchina/procomm-microlearning`** — https://github.com/tesolchina/procomm-microlearning

> IEEE ProComm academic articles → AI-powered interactive microlearning modules (TTS + visualisation).  
> Status: Pilot — "Teams" collection (Jul 2026 board presentation)

### Repo structure

| Folder | Purpose |
|--------|---------|
| `modules/live-deck/` | **Workshop deck engine** — one generic HTML engine, one JSON per course |
| `modules/live-deck/decks/procomm-workshop.json` | **The ProComm 2026 workshop deck content** |
| `modules/live-deck/teacher.html` | Teacher mode (QR + PIN; phones follow slides, poll bars stream back) |
| `modules/teams/` | Pilot collection — "Communicating in Teams" (16 modules) |
| `modules/listening-engineering-comm/` | Listening / engineering comm module (audio narration) |
| `modules/workshop-20feb/` | Separate 20 Feb HKBU Ambassador session (KissingNumber case) — keep distinct |
| `platform/` | Express server + routes + catalog |
| `research/` | Research study design for IEEE ProComm journal |
| `permissions/` | Author authorisation records + permission request template |

### Workshop deck architecture
- **Engine:** `modules/live-deck/deck.html` — data-driven; derives slug from URL, fetches `decks/<slug>.json`
- **New course = new JSON only** — no code changes needed
- **Live sync:** `live-sync.js` hooks the deck's existing globals (`currentSlide`, `slides`) + `[data-quiz]` buttons
- **State:** Postgres-backed polling (not WebSockets) — autoscale-safe across multiple instances
- **Teacher/student split:** 6-digit PIN for joining; per-session secret token for slide control

---

## Live Platform
**Base URL:** https://ieeeprocommmicrolearning.replit.app

| Link | Description |
|------|-------------|
| [Workshop deck — student view](https://ieeeprocommmicrolearning.replit.app/module/procomm-workshop) | Tap-to-answer, participant phones |
| [Workshop deck — teacher mode](https://ieeeprocommmicrolearning.replit.app/module/procomm-workshop/teacher) | QR + PIN; phones follow slides, poll answers stream back |
| [Board-briefing pitch deck](https://ieeeprocommmicrolearning.replit.app/module/board-pitch) | Problem → pilot → badge tiers → pricing/revenue → roadmap |
| [Pilot — Communicating in Teams](https://ieeeprocommmicrolearning.replit.app/collection/teams) | 16 modules (7 Classics + 9 Newer 2020–2025) |
| [Interactive lesson player](https://ieeeprocommmicrolearning.replit.app/collection/teams/lesson) | Audio narration + quizzes; Bronze/Silver/Gold badges |
| [Illustrated AI-image lesson](https://ieeeprocommmicrolearning.replit.app/module/c-google-illustrated) | "What Google Learned About the Perfect Team" |
| [Split-frame explainer video](https://ieeeprocommmicrolearning.replit.app/remotion-video) | Remotion-based explainer |

---

## Key Documents

| Document | Link |
|----------|------|
| Google Drive (shared with Traci) | https://drive.google.com/drive/folders/1GVb-pDOvvlCvgkyDeQfq1QR_6FFT0b0L |
| Project update Google Doc | https://docs.google.com/document/d/1xu0WXJsQAMospjt2ImDkncdjpyPR1dyqp-8Xk_MZo-8/edit |
| Workshop paper (ProComm 2026) | https://docs.google.com/document/d/1VW5g-ixbckdhnVgkfd34T3VcPfCS0QQJKQZAs2gQNBU/edit |
| Research Study Plan | https://docs.google.com/document/d/1daIdioS7onsLIfg2jQWetC1cZ9mEpDYE0syH7NGmguU/edit |
| Teams article spreadsheet (Traci's tab) | https://docs.google.com/spreadsheets/d/1-QZA_CsFZsxfR7_Iv6P7BqSxQB21EWCfVw3qA4IaY_g/edit |
| Permission Request Template | https://docs.google.com/document/d/1o-JgbqSw7hOO4ufi9ad37azcFczAso57p86Q_EwlcO8/edit |
| Zoom walkthrough recording (Jun 25) | https://hkbu.zoom.us/rec/share/W0tqrDu_OOwkaGX62Ajee13TzacSxxO88EjACtekNQnsAByWh1MY6ek56cV9FjYz.ZqGIkmAdxL7Gukm2 |

---

## Pilot: "Communicating in Teams"

- **16 modules:** 7 Classics + 9 Newer (2020–2025)
- **Badge tiers:** Bronze / Silver / Gold (75% quiz score to progress)
- **Badge provider:** Accredible (wired, pending configuration)
- **Draft pricing:** $5/module (IEEE members) · $10 (non-members)
- **Revenue split:** 60% ProComm · 30% authors · 10% AI devs *(needs IEEE vetting)*
- **Deployment target:** IEEE Resource Center

---

## Collaborators

| Person | Role | Contact |
|--------|------|---------|
| Dr Traci Nathans-Kelly | VP Content, IEEE ProComm · Cornell University | tracink.ieee@gmail.com |
| Bremen Vance | Content Committee member | — |
| Joyce Karreman | Content Committee member | — |
| Dr Simon Wang | Platform builder · workshop facilitator | simonwang@hkbu.edu.hk |

**Traci's Zoom:** https://cornell.zoom.us/my/tracink?pwd=akloYXE0SnlSMzRLUnpqL2NGSXlTUT09

---

## Upcoming Milestones

- [ ] July board meeting — demo AI modules to IEEE ProComm board
- [ ] Confirm pricing structure with Traci
- [ ] Decide which Drive docs / modules to demo at board meeting
- [ ] Next Content Committee meeting (Traci, Simon, Bremen, Joyce)
- [ ] Accredible badge configuration
- [ ] Revenue-sharing model — IEEE vetting
- [ ] IEEE Resource Center migration proposal
- [ ] Author review process / human-in-the-loop QA

---

## Related Repos

| Repo | Purpose |
|------|---------|
| [`tesolchina/procomm-microlearning`](https://github.com/tesolchina/procomm-microlearning) | **This project** — ProComm microlearning platform + workshop deck |
| [`tesolchina/Simonsays`](https://github.com/tesolchina/Simonsays) | K-12 classroom interactive system (SimonSays 賽門說) — live quiz + QR/PIN sync pattern that inspired the ProComm live deck |
