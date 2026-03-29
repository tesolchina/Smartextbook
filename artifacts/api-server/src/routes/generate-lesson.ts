import { Router, type IRouter } from "express";
import { GenerateLessonBody } from "@workspace/api-zod";
import { createLLMClient } from "../lib/llm-client";
import { jsonrepair } from "jsonrepair";
import { logger } from "../lib/logger";

const router: IRouter = Router();

type Audience = "general" | "k12" | "university" | "professional";
type Goal = "understand" | "exam" | "apply" | "overview";
type QuizTemplate = "quick" | "standard" | "deep";
type Depth = "express" | "standard" | "deep";
type SubjectType = "general" | "language";

const AUDIENCE_LABELS: Record<Audience, string> = {
  general: "general audience (no assumed background knowledge)",
  k12: "high school students (ages 14–18)",
  university: "university / undergraduate students",
  professional: "working professionals in the field",
};

const AUDIENCE_STYLE: Record<Audience, string> = {
  general: "Use clear, everyday language. Avoid jargon. Use relatable analogies from daily life.",
  k12: "Use simple, engaging language. Connect ideas to things teenagers encounter. Avoid heavy technical terminology — define any necessary terms plainly.",
  university: "Use precise academic language. Retain domain-specific terminology from the source material. Assume foundational literacy in the subject area.",
  professional: "Be concise and technically precise. Focus on implications and applications. Assume strong domain knowledge.",
};

const GOAL_LABELS: Record<Goal, string> = {
  understand: "build deep conceptual understanding",
  exam: "prepare for an exam",
  apply: "apply knowledge in practice",
  overview: "get a quick high-level overview",
};

const GOAL_INSTRUCTIONS: Record<Goal, string> = {
  understand: "Explain the 'why' behind ideas, not just the 'what'. Use examples and analogies to make abstract concepts concrete. Prioritize clarity of reasoning.",
  exam: "Highlight testable facts, key definitions, and important distinctions. Note what students are most commonly tested on. Make the summary scannable for revision.",
  apply: "Emphasize practical applications, real-world use cases, and how to actually use this knowledge. Ground concepts in concrete scenarios.",
  overview: "Be concise. Cover only the most essential ideas. Omit supporting detail — the goal is orientation, not mastery.",
};

const QUIZ_CONFIGS: Record<QuizTemplate, { count: number; instructions: string }> = {
  quick: {
    count: 5,
    instructions: "Create 5 straightforward multiple-choice questions testing basic comprehension of the key facts and definitions in the source material.",
  },
  standard: {
    count: 10,
    instructions: "Create 10 multiple-choice questions with a mix of difficulty levels: 4 comprehension questions (recall key facts/definitions), 4 analysis questions (require understanding relationships and 'why'), and 2 application questions (apply concepts to a new situation).",
  },
  deep: {
    count: 15,
    instructions: "Create 15 multiple-choice questions across three tiers: 5 comprehension questions (recall), 5 analysis questions (understand and evaluate), and 5 application/synthesis questions (apply to novel scenarios, compare ideas, or draw conclusions). Include plausible distractors that test common misconceptions.",
  },
};

const DEPTH_CONFIGS: Record<Depth, { summaryLength: string; conceptCount: string }> = {
  express: {
    summaryLength: "1 focused paragraph (4–6 sentences)",
    conceptCount: "5–6 most critical concepts only",
  },
  standard: {
    summaryLength: "2–3 paragraphs covering all main ideas",
    conceptCount: "8–12 concepts spanning the full scope of the material",
  },
  deep: {
    summaryLength: "4–5 paragraphs: an overview paragraph, then a paragraph for each major section or theme, ending with a synthesis paragraph on broader significance",
    conceptCount: "12–15 concepts including nuanced distinctions and supporting terminology",
  },
};

function buildGeneralPrompt(
  title: string,
  chapterText: string,
  prefs: { audience: Audience; goal: Goal; quizTemplate: QuizTemplate; depth: Depth; customGoal?: string }
): string {
  const audienceLabel = AUDIENCE_LABELS[prefs.audience];
  const audienceStyle = AUDIENCE_STYLE[prefs.audience];
  const goalLabel = GOAL_LABELS[prefs.goal];
  const goalInstruction = GOAL_INSTRUCTIONS[prefs.goal];
  const quizConfig = QUIZ_CONFIGS[prefs.quizTemplate];
  const depthConfig = DEPTH_CONFIGS[prefs.depth];
  const customGoalSection = prefs.customGoal ? `\nSpecific learning objective: "${prefs.customGoal}"\n` : "";

  return `\
You are an expert educational content designer. Transform the source material below into a structured lesson tailored to a specific learner profile.

━━━ LEARNER PROFILE ━━━
• Target audience: ${audienceLabel}
• Primary learning goal: ${goalLabel}
• Content depth: ${prefs.depth}${customGoalSection}

━━━ WRITING STYLE ━━━
${audienceStyle}
${goalInstruction}

━━━ SOURCE MATERIAL ━━━
Title: ${title}

${chapterText.slice(0, 9000)}

━━━ CRITICAL RULES ━━━
1. Stay FAITHFUL to the source — do not invent facts not present in the text.
2. Use the author's original terminology and key phrases.
3. Adapt LANGUAGE and FRAMING (not content) to suit the learner profile.
4. Every quiz question must be answerable from the source material alone.

━━━ OUTPUT ━━━
Return ONLY this JSON (no other text, no markdown fences):

{
  "summary": "${depthConfig.summaryLength}",
  "keyConcepts": [
    { "term": "exact term from source", "definition": "clear, audience-appropriate definition" }
  ],
  "quizQuestions": [
    {
      "question": "question text",
      "options": ["option A", "option B", "option C", "option D"],
      "correctIndex": 0,
      "explanation": "why this answer is correct"
    }
  ]
}

CONSTRAINTS:
- summary: ${depthConfig.summaryLength}
- keyConcepts: ${depthConfig.conceptCount}
- quizQuestions: ${quizConfig.instructions}
- Each quiz question must have EXACTLY 4 options (index 0–3)
- correctIndex must be 0, 1, 2, or 3`;
}

function buildLanguagePrompt(
  title: string,
  chapterText: string,
  prefs: { audience: Audience; goal: Goal; quizTemplate: QuizTemplate; depth: Depth; customGoal?: string }
): string {
  const audienceLabel = AUDIENCE_LABELS[prefs.audience];
  const quizConfig = QUIZ_CONFIGS[prefs.quizTemplate];
  const depthConfig = DEPTH_CONFIGS[prefs.depth];
  const customGoalSection = prefs.customGoal ? `\nSpecific learning objective: "${prefs.customGoal}"\n` : "";

  return `\
You are an expert language and writing teacher. Transform the source material below into a structured lesson for language, writing, or academic literacy instruction.

━━━ LEARNER PROFILE ━━━
• Target audience: ${audienceLabel}
• Subject focus: Language, Writing & Academic Literacy${customGoalSection}

━━━ SOURCE MATERIAL ━━━
Title: ${title}

${chapterText.slice(0, 9000)}

━━━ YOUR TASK ━━━
Generate a lesson with THREE components:

1. SUMMARY — ${depthConfig.summaryLength}
   Focus on the communicative purpose, rhetorical structure, and key linguistic features of the text.
   Highlight how the author constructs arguments, uses evidence, and achieves their communicative goals.

2. KEY CONCEPTS — ${depthConfig.conceptCount}
   Include: key academic vocabulary used in the text, rhetorical/linguistic terms, writing techniques demonstrated.
   For each concept provide a definition AND a short usage example from the text where possible.

3. PRACTICE CARDS — 6–8 cards for language/writing skills development.
   Each card is a teaching task. Mix at least 4 of these card types:
   - Sentence Analysis: Quote a sentence → ask what technique/structure it uses
   - Vocabulary in Context: Quote a sentence with a key word → ask its meaning/role in context
   - Rewrite Task: Present a sentence → ask how to make it more academic, concise, or clear
   - Pattern Recognition: Show a writing pattern (e.g., hedging, concession) → explain name and function
   - Close Reading: Short passage extract → ask about writer's purpose or technique
   - Grammar Focus: Identify a grammatical structure used effectively in the source

   For REWRITE TASKS, the model answer must provide the improved version.
   All prompts must quote or reference actual sentences/passages from the source material.

━━━ CRITICAL RULES ━━━
1. All quoted sentences MUST come from the source material exactly as written.
2. Practice card tasks must be concrete and actionable — students should be able to attempt them independently.
3. Every quiz question must be answerable from the source material alone.

━━━ OUTPUT ━━━
Return ONLY this JSON (no other text, no markdown fences):

{
  "summary": "...",
  "keyConcepts": [
    { "term": "term", "definition": "definition — usage example if applicable" }
  ],
  "practiceCards": [
    {
      "prompt": "The full task description shown to the student. Quote exact sentences where relevant.",
      "model": "The model answer or analysis. For rewrite tasks, include the improved sentence.",
      "tip": "Optional: brief pedagogical note for the teacher (1 sentence)"
    }
  ],
  "quizQuestions": [
    {
      "question": "question text",
      "options": ["option A", "option B", "option C", "option D"],
      "correctIndex": 0,
      "explanation": "why this answer is correct"
    }
  ]
}

CONSTRAINTS:
- keyConcepts: ${depthConfig.conceptCount}
- practiceCards: exactly 6–8 cards, mixing at least 4 different card types
- quizQuestions: ${quizConfig.instructions} — focus on reading comprehension and language awareness
- Each quiz question must have EXACTLY 4 options (index 0–3)
- correctIndex must be 0, 1, 2, or 3`;
}

router.post("/generate-lesson", async (req, res): Promise<void> => {
  const parsed = GenerateLessonBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { title, chapterText, llmConfig, learnerPreferences } = parsed.data;

  const prefs = {
    audience: (learnerPreferences?.audience ?? "university") as Audience,
    goal: (learnerPreferences?.goal ?? "understand") as Goal,
    quizTemplate: (learnerPreferences?.quizTemplate ?? "standard") as QuizTemplate,
    depth: (learnerPreferences?.depth ?? "standard") as Depth,
    customGoal: learnerPreferences?.customGoal,
    subjectType: (learnerPreferences?.subjectType ?? "general") as SubjectType,
  };

  const prompt = prefs.subjectType === "language"
    ? buildLanguagePrompt(title, chapterText, prefs)
    : buildGeneralPrompt(title, chapterText, prefs);

  logger.info(
    { provider: llmConfig.provider, model: llmConfig.model, hasKey: Boolean(llmConfig.apiKey), prefs },
    "generate-lesson: starting AI call"
  );

  try {
    const { client, model } = createLLMClient(llmConfig);
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      stream: false,
    });
    const content = response.choices[0]?.message?.content ?? "";

    const stripped = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
    const jsonMatch = stripped.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      res.status(502).json({ error: "AI did not return valid JSON. Please try again." });
      return;
    }

    const data = JSON.parse(jsonrepair(jsonMatch[0]));

    const keyConcepts = (Array.isArray(data.keyConcepts) ? data.keyConcepts : [])
      .filter((c: any) => c && typeof c === "object")
      .map((c: any) => ({
        term: String(c.term ?? "").trim(),
        definition: String(c.definition ?? "").trim(),
      }))
      .filter((c: { term: string; definition: string }) => c.term && c.definition);

    const quizQuestions = (Array.isArray(data.quizQuestions) ? data.quizQuestions : [])
      .filter((q: any) => q && typeof q === "object")
      .map((q: any) => {
        const options: string[] = Array.isArray(q.options) ? q.options.slice(0, 4).map(String) : [];
        const correctIndex = Math.min(3, Math.max(0, parseInt(String(q.correctIndex ?? 0), 10)));
        return { question: String(q.question ?? "").trim(), options, correctIndex, explanation: String(q.explanation ?? "").trim() };
      })
      .filter((q: { question: string; options: string[]; explanation: string }) => q.question && q.options.length === 4 && q.explanation);

    const practiceCards = Array.isArray(data.practiceCards)
      ? data.practiceCards
          .filter((c: any) => c && typeof c === "object")
          .map((c: any) => ({
            prompt: String(c.prompt ?? "").trim(),
            model: String(c.model ?? "").trim(),
            tip: c.tip ? String(c.tip).trim() : undefined,
          }))
          .filter((c: { prompt: string; model: string }) => c.prompt && c.model)
      : [];

    res.json({
      summary: String(data.summary ?? "").trim(),
      keyConcepts,
      quizQuestions,
      ...(practiceCards.length > 0 ? { practiceCards } : {}),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI provider error";
    logger.error(
      { provider: llmConfig.provider, model: llmConfig.model, hasKey: Boolean(llmConfig.apiKey), err },
      "generate-lesson: AI provider call failed"
    );
    res.status(502).json({ error: message });
  }
});

export default router;
