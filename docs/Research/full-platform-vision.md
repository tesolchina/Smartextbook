# LessonBuilder — Full Platform Vision
*From a PDF lesson plan to a fully connected, AI-powered learning ecosystem*

---

## The Problem This Solves

Teachers spend hours turning lesson plans, textbook chapters, and scanned PDFs into materials students will actually engage with. Once those materials are distributed, the teacher loses visibility — they don't know which concepts students are struggling with, how long students spent on each section, or whether the material landed at all. Assessment is batched, delayed, and often too late to change anything.

LessonBuilder's vision is to close this loop completely: from raw source material to personalised, trackable, interoperable learning — in minutes.

---

## The Complete Workflow

### Stage 1 — Input: Any Source Material

The starting point can be anything the teacher already has:

- A PDF lesson plan or unit plan
- A scanned textbook chapter (via OCR)
- A web article or URL
- Plain text pasted directly

LessonBuilder reads the content and uses AI to understand it — not just extract text, but identify the structure, the key concepts, and the learning objectives embedded in the material.

---

### Stage 2 — AI Transformation

The AI generates a full lesson package from the source material:

| Component | What it is |
|-----------|------------|
| **Summary** | Concise, readable overview of the chapter |
| **Glossary** | Key terms with plain-language definitions |
| **Mind Map** | Visual concept map showing how ideas connect |
| **Quiz** | Multiple-choice and short-answer questions at varying difficulty |
| **AI Tutor** | A chatbot pre-loaded with this chapter's content as its context |
| **Concept Tags** | A structured list of knowledge nodes (e.g. `biology:mitochondria`, `chemistry:oxidation`) |

The concept tags are the foundation for everything that comes after — they allow individual lessons to become nodes in a larger knowledge network.

---

### Stage 3 — Distribution: SCORM for Moodle (and any LMS)

The lesson is exported as a **SCORM 2004 package** — a single `.zip` file that any LMS can import.

**What the student experiences inside the SCORM package:**
- A clean, tablet-friendly reading view of the summary and glossary
- An interactive mind map they can explore
- A self-paced quiz with immediate feedback
- An embedded AI tutor they can ask questions at any time (using their own API key, stored locally — no data sent to LessonBuilder servers)

**What Moodle receives back automatically:**
- Quiz score and completion status
- Time spent
- Which learning objectives were met

The SCORM package works completely offline after download. No LessonBuilder server needs to be running.

---

### Stage 4 — Integration with Real-Time Classroom Systems

LessonBuilder is designed to be a **content source**, not a classroom management platform. Once a lesson is generated, its structured data (quiz questions, concept tags, learning objectives) can be pulled by any external real-time engagement system via the public sharing API.

This means a teacher can:
- Generate a lesson in LessonBuilder
- Share the lesson link with any compatible classroom system
- That system imports the questions and concept structure automatically — no copy-pasting

The integration point is the public `GET /api/shared/:id` endpoint, which returns the full lesson JSON including all quiz questions in a standard format. Any real-time classroom tool that can consume a REST API can build on top of this.

This keeps LessonBuilder focused on what it does best — **content generation and AI tutoring** — while allowing specialist classroom engagement tools to handle real-time interaction, hardware devices, and live session management.

---

### Stage 5 — Self-Paced Learning

Outside of class time, students work through the material at their own pace:

- The SCORM package (or a web version of it) is assigned in Moodle
- The student opens it any time, on any device
- They read, explore the mind map, chat with the AI tutor, and complete the quiz
- Their progress is saved locally and synced when connected

The AI tutor in this mode is particularly powerful: it knows exactly which concepts this chapter covers, and can detect from the student's questions which areas are unclear. If a student asks the same concept three times in different ways, the system flags it.

---

### Stage 6 — Learning Tracking with xAPI

xAPI is the data layer that makes all of the above meaningful over time.

Every significant learning action generates a structured record:

> *"[Student] [answered correctly] [the question about mitochondria] [in Biology Chapter 3] [on 2026-04-08 at 14:32] [on iPad]"*

These records accumulate in a **Learning Record Store (LRS)** — a database specifically designed for this kind of data. The LRS can be:

- Hosted by the school or institution (full data ownership)
- A third-party service (e.g. SCORM Cloud, Learning Locker)
- Eventually, built into LessonBuilder itself

**What xAPI enables that SCORM alone cannot:**

| Capability | Description |
|-----------|-------------|
| Cross-lesson concept tracking | "This student has seen 'ATP' in 4 different lessons — and still gets it wrong" |
| Long-term learning curves | Mastery of a concept tracked over weeks, not just within one quiz session |
| Cross-device continuity | Progress on iPad continues seamlessly on laptop |
| AI personalisation input | The AI tutor can be informed by past performance across all lessons |
| Teacher early warning | Flag students who are falling behind before the exam, not after |

---

### Stage 7 — Identity, Privacy, and Data Ownership

This is the most critical layer — everything else depends on getting it right.

**How students are identified:**

Within a Moodle deployment, identity is handled by **LTI** (Learning Tools Interoperability). When a student launches a lesson from Moodle:
- Moodle passes the student's name, anonymised ID, and course context to LessonBuilder
- LessonBuilder never needs to manage usernames or passwords
- The school's existing authentication system (Google, Microsoft, local accounts) is used

For standalone use (without Moodle), students can identify themselves with an email address or an anonymised code assigned by the teacher.

**What data is collected, and who owns it:**

| Data Type | Where it lives | Who controls it |
|-----------|---------------|-----------------|
| Lesson content | Teacher's device / Moodle | Teacher / Institution |
| Student quiz responses | LRS (school-hosted or chosen provider) | Institution |
| AI tutor conversation | Student's browser only (localStorage) | Student |
| API keys | Student's browser only | Student |
| xAPI learning records | LRS | Institution |

LessonBuilder itself, in its default configuration, **does not store any student personal data**. The shared lesson database (for public share links) contains only lesson content, not student information.

**Privacy principles:**

- **Data minimisation:** only collect what is needed to improve learning
- **Purpose limitation:** learning data is used only for learning — never sold or profiled for advertising
- **Right to erasure:** students can request deletion of their xAPI records at any time
- **Anonymisation option:** institutions can configure LessonBuilder to send xAPI records with anonymised actor IDs rather than real names
- **GDPR / FERPA alignment:** the architecture is designed to be compliant with both the EU and US education privacy frameworks

---

## The Full Picture

```
[Source Material]
   PDF / scan / URL / text
         │
         ▼
[LessonBuilder AI]
   Summary · Glossary · Mind Map · Quiz · Concept Tags
         │
    ┌────┴──────────────────────────┐
    │                               │
    ▼                               ▼
[SCORM Package]            [Public Sharing API]
  Moodle / any LMS           GET /api/shared/:id
  Offline capable             Standard JSON format
  Self-paced AI tutor         Any external system
    │                         can pull lesson data
    │                               │
    └──────────────┬────────────────┘
                   │
                   ▼
               [xAPI / LRS]
         Every learning action recorded
         (from SCORM, external systems,
          or direct web access)
                   │
            ┌──────┴──────┐
            │             │
            ▼             ▼
      [Student View]  [Teacher View]
      Personal        Class-wide
      knowledge map   concept heatmap
      Learning path   Early warning
      AI tutor        flags
```

---

## Phased Roadmap

| Phase | What gets built | Outcome |
|-------|----------------|---------|
| **1 — Now** | Core lesson generation (done), JSON export (done), bug fixes (done) | Working product |
| **2 — Near** | SCORM export, basic xAPI event emission | Moodle-ready lessons |
| **3 — Mid** | External system integration (xAPI receive endpoint, richer sharing API) | Compatible with real-time classroom tools |
| **4 — Later** | Cross-lesson concept graph, personalised learning paths | Full ecosystem |
| **5 — Scale** | LTI registration, institution identity federation, privacy dashboard | Institutional deployment |

---

*Last updated: 2026-04-08*
