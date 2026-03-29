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

function buildPrompt(
  title: string,
  chapterText: string,
  prefs: {
    audience: Audience;
    goal: Goal;
    quizTemplate: QuizTemplate;
    depth: Depth;
    customGoal?: string;
  }
): string {
  const audienceLabel = AUDIENCE_LABELS[prefs.audience];
  const audienceStyle = AUDIENCE_STYLE[prefs.audience];
  const goalLabel = GOAL_LABELS[prefs.goal];
  const goalInstruction = GOAL_INSTRUCTIONS[prefs.goal];
  const quizConfig = QUIZ_CONFIGS[prefs.quizTemplate];
  const depthConfig = DEPTH_CONFIGS[prefs.depth];

  const customGoalSection = prefs.customGoal
    ? `\nSpecific learning objective stated by the teacher: "${prefs.customGoal}"\n`
    : "";

  return `\
You are an expert educational content designer. Your task is to transform the source material below into a structured, high-quality lesson tailored to a specific learner profile.

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
1. Stay FAITHFUL to the source material — do not invent facts, statistics, or examples not present in the text.
2. Use the author's original terminology and key phrases.
3. Adapt LANGUAGE and FRAMING (not content) to suit the learner profile.
4. Every quiz question must be answerable from the source material alone.

━━━ OUTPUT FORMAT ━━━
Return a JSON object with EXACTLY this structure (no other text):

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
      "explanation": "why this answer is correct, referencing the source material"
    }
  ]
}

CONSTRAINTS:
- summary: ${depthConfig.summaryLength}
- keyConcepts: ${depthConfig.conceptCount}
- quizQuestions: ${quizConfig.instructions}
- Each quiz question must have EXACTLY 4 options (index 0–3)
- correctIndex must be 0, 1, 2, or 3
- Explanations should cite specific ideas from the source text

Return ONLY the JSON object. No preamble, no markdown fences.`;
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
  };

  const prompt = buildPrompt(title, chapterText, prefs);

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
        const options: string[] = Array.isArray(q.options)
          ? q.options.slice(0, 4).map(String)
          : [];
        const correctIndex = Math.min(3, Math.max(0, parseInt(String(q.correctIndex ?? 0), 10)));
        return {
          question: String(q.question ?? "").trim(),
          options,
          correctIndex,
          explanation: String(q.explanation ?? "").trim(),
        };
      })
      .filter(
        (q: { question: string; options: string[]; explanation: string }) =>
          q.question && q.options.length === 4 && q.explanation
      );

    res.json({
      summary: String(data.summary ?? "").trim(),
      keyConcepts,
      quizQuestions,
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
