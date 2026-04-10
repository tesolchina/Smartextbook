import { Router, type IRouter } from "express";

const router: IRouter = Router();

function esc(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function generateHTML(lesson: {
  title: string;
  summary: string;
  keyConcepts: { term: string; definition: string }[];
  quizQuestions: { question: string; options: string[]; correctAnswer: number; explanation?: string }[];
}): string {
  const { title, summary, keyConcepts, quizQuestions } = lesson;

  const conceptSlides = chunk(keyConcepts.slice(0, 18), 3)
    .map(
      (batch) => `
    <section>
      <h2 class="slide-heading">Key Concepts</h2>
      <div class="concept-grid">
        ${batch
          .map(
            (c) => `
          <div class="concept-card">
            <div class="concept-term">${esc(c.term)}</div>
            <div class="concept-def">${esc(c.definition)}</div>
          </div>`
          )
          .join("")}
      </div>
    </section>`
    )
    .join("\n");

  const quizSlides = quizQuestions
    .slice(0, 10)
    .map(
      (q, i) => `
    <section>
      <div class="quiz-num">Question ${i + 1}</div>
      <h2 class="quiz-question">${esc(q.question)}</h2>
      <div class="options-grid">
        ${q.options
          .map(
            (opt, idx) => `
          <div class="option ${idx === q.correctAnswer ? "correct" : ""}">
            <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
            <span>${esc(opt)}</span>
          </div>`
          )
          .join("")}
      </div>
      ${q.explanation ? `<div class="explanation"><strong>Explanation:</strong> ${esc(q.explanation)}</div>` : ""}
    </section>`
    )
    .join("\n");

  const summaryWords = summary.split(" ");
  const summaryShort = summaryWords.slice(0, 80).join(" ") + (summaryWords.length > 80 ? "…" : "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Lora:wght@700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/theme/black.css" />
  <style>
    :root {
      --navy:   #12172b;
      --card:   #1e2540;
      --accent: #e07a5f;
      --gold:   #f2cc8f;
      --text:   #f0f0f5;
      --muted:  #9ba3bf;
    }

    .reveal { font-family: 'Inter', sans-serif; background: var(--navy); }
    .reveal .slides section { background: var(--navy); color: var(--text); }
    .reveal h1, .reveal h2, .reveal h3 { font-family: 'Lora', serif; color: var(--text); text-transform: none; }

    /* ── Title slide ── */
    .title-slide { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; padding: 2rem; }
    .title-tag { background: var(--accent); color: #fff; font-size:0.6em; font-weight:700; letter-spacing:.12em; text-transform:uppercase; padding:.35em 1em; border-radius:2em; margin-bottom:1.4em; }
    .title-slide h1 { font-size:2.2em; line-height:1.15; margin:0 0 .6em; text-align:center; }
    .title-slide .subtitle { color:var(--muted); font-size:.72em; }
    .title-bar { width:60px; height:4px; background:var(--accent); border-radius:2px; margin:.8em auto 0; }

    /* ── Overview slide ── */
    .overview-slide { display:flex; flex-direction:column; padding:2.5rem 3rem; height:100%; }
    .slide-heading { font-size:1.3em; color:var(--gold); margin:0 0 .8em; text-align:left; }
    .summary-text { font-size:.8em; line-height:1.75; color:var(--text); flex:1; text-align:left; }

    /* ── Concept slides ── */
    .concept-grid { display:grid; grid-template-columns:1fr; gap:.7em; width:100%; }
    .concept-card { background:var(--card); border-left:4px solid var(--accent); border-radius:.5em; padding:.8em 1.1em; text-align:left; }
    .concept-term { font-size:.85em; font-weight:700; color:var(--gold); margin-bottom:.3em; }
    .concept-def  { font-size:.72em; color:var(--text); line-height:1.55; }

    /* ── Quiz slides ── */
    .quiz-num { font-size:.6em; color:var(--accent); font-weight:700; letter-spacing:.1em; text-transform:uppercase; margin-bottom:.4em; }
    .quiz-question { font-size:1.05em; color:var(--text); margin:0 0 1em; line-height:1.4; }
    .options-grid { display:grid; grid-template-columns:1fr 1fr; gap:.6em; }
    .option { display:flex; align-items:flex-start; gap:.6em; background:var(--card); border-radius:.5em; padding:.65em .85em; font-size:.72em; text-align:left; line-height:1.45; border:2px solid transparent; }
    .option.correct { border-color:var(--accent); background: rgba(224,122,95,.12); }
    .option-letter { background:var(--accent); color:#fff; font-weight:700; width:1.5em; height:1.5em; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; font-size:1em; }
    .option:not(.correct) .option-letter { background:var(--muted); }
    .explanation { margin-top:.8em; font-size:.65em; color:var(--muted); background:var(--card); border-radius:.4em; padding:.6em .9em; text-align:left; line-height:1.5; }

    /* ── Closing slide ── */
    .closing-slide { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; padding:2rem; text-align:center; }
    .closing-slide h2 { font-size:1.6em; margin-bottom:.6em; color:var(--gold); }
    .closing-slide p { font-size:.75em; color:var(--muted); max-width:580px; line-height:1.7; margin-bottom:1.2em; }
    .ai-chips { display:flex; flex-wrap:wrap; gap:.5em; justify-content:center; }
    .chip { background:var(--card); border:1px solid var(--accent); color:var(--text); border-radius:2em; font-size:.62em; padding:.35em 1em; font-weight:600; }
    .footer-tag { margin-top:2em; font-size:.55em; color:var(--muted); }
  </style>
</head>
<body>
<div class="reveal">
  <div class="slides">

    <!-- ── Title ── -->
    <section>
      <div class="title-slide">
        <div class="title-tag">AI-Generated Lesson</div>
        <h1>${esc(title)}</h1>
        <p class="subtitle">Summary · Key Concepts · Quiz</p>
        <div class="title-bar"></div>
      </div>
    </section>

    <!-- ── Overview ── -->
    <section>
      <div class="overview-slide">
        <h2 class="slide-heading">Overview</h2>
        <p class="summary-text">${esc(summaryShort)}</p>
      </div>
    </section>

    <!-- ── Concepts ── -->
    ${conceptSlides}

    <!-- ── Quiz ── -->
    ${quizSlides}

    <!-- ── Closing ── -->
    <section>
      <div class="closing-slide">
        <h2>Keep Learning with AI</h2>
        <p>
          Copy the key concepts or quiz questions above into any AI assistant
          to go deeper, get more examples, or quiz yourself further.
        </p>
        <div class="ai-chips">
          <span class="chip">ChatGPT</span>
          <span class="chip">Claude</span>
          <span class="chip">Gemini</span>
          <span class="chip">DeepSeek</span>
        </div>
        <p class="footer-tag">Generated by LessonBuilder &nbsp;·&nbsp; Bring Your Own Key</p>
      </div>
    </section>

  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.js"></script>
<script>
  Reveal.initialize({
    hash: true,
    slideNumber: true,
    controls: true,
    progress: true,
    center: true,
    transition: 'fade',
    backgroundTransition: 'none',
  });
</script>
</body>
</html>`;
}

router.post("/generate-slides", (req, res): void => {
  const { lesson } = req.body ?? {};

  if (
    !lesson ||
    typeof lesson.title !== "string" ||
    typeof lesson.summary !== "string" ||
    !Array.isArray(lesson.keyConcepts) ||
    !Array.isArray(lesson.quizQuestions)
  ) {
    res.status(400).json({ error: "Invalid lesson data" });
    return;
  }

  const html = generateHTML(lesson);

  const safeName = lesson.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "lesson";

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${safeName}-slides.html"`);
  res.send(html);
});

export default router;
