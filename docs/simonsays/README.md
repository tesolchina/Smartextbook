# SimonSays 賽門說 — Interactive Classroom Tool

**GitHub:** https://github.com/tesolchina/Simonsays  
**Current version:** v0.11.0-beta  
**Type:** Full-stack TypeScript pnpm monorepo (K-12 classroom interactive system)

---

## What it is

A web-based "phygital learning companion" for K-12 classrooms:
- **Teachers** run live quizzes, presentations, courseware, flipped videos, and homework
- **Students** respond from a dedicated low-distraction device, or a phone/tablet via `/student-app/`
- Real-time stats, AI grading for photo/voice answers
- Closed-loop before/during/after class workflow

---

## Key features (from repo)

| Feature | Routes/Files |
|---------|-------------|
| Live presentations (QR + PIN) | `presentations-live.ts`, `ZoomableQR.tsx` |
| Live quizzes / games | `game-host.tsx`, `game-play.tsx` |
| Courseware editor | `courseware-editor.tsx` |
| Flipped videos | `flipped-video-*.tsx` |
| Photo/voice AI grading | `photo-grading.ts`, AI grading routes |
| Student simulator | `student-simulator.tsx` |
| Device provisioning | `device-provision.tsx` |

---

## Connection to IEEE ProComm project

The ProComm microlearning platform's **live workshop sync** (teacher drives slides, students scan QR to join, live poll bars) was directly inspired by SimonSays:
- Same model: Postgres-backed polling (autoscale-safe, no WebSocket/sticky-session issues)
- Same QR + PIN pattern: `ZoomableQR.tsx` → reimplemented for plain-Express/static stack
- Rule carried forward: **live state must live in Postgres, never server memory**

---

## Repo structure

```
artifacts/
  api-server/       Express API (AI grading, games, presentations, courseware)
  classroom/        Teacher-facing React app
  brochure/         Marketing/info slides
  hardware-test/    Device test console
  student-app/      Student-facing low-distraction app
lib/
  db/               Drizzle ORM schema
  api-spec/         OpenAPI spec + Orval codegen
  ...
```

---

## Notes

- `replit.md` in the repo has full architecture + AI red lines
- `threat_model.md` for security boundaries
- Docs in `docs/architecture/`, `docs/business/`, `docs/team/`, `docs/debug/`
