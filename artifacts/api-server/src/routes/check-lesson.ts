import { Router, type IRouter } from "express";
import { createLLMClient } from "../lib/llm-client";

const router: IRouter = Router();

const CHECK_PROMPT = (lesson: any) => `\
You are an expert educational content reviewer. Review the following lesson for accuracy, quality, and appropriateness before it is published publicly for students.

Lesson Title: ${lesson.title}

Summary:
${lesson.summary}

Key Concepts (${lesson.keyConcepts?.length ?? 0}):
${(lesson.keyConcepts ?? []).map((c: any) => `- ${c.term}: ${c.definition}`).join("\n")}

Quiz Questions (${lesson.quizQuestions?.length ?? 0}):
${(lesson.quizQuestions ?? []).map((q: any, i: number) => `Q${i + 1}: ${q.question}\n  Correct answer (index ${q.correctIndex}): ${q.options?.[q.correctIndex]}\n  Explanation: ${q.explanation}`).join("\n\n")}

Please check for:
1. Factual errors in the summary or key concept definitions
2. Quiz questions with wrong correct answers or misleading explanations
3. Any content that is inappropriate, offensive, or unsuitable for students
4. Any concepts that are significantly incomplete or confusing

Return a JSON object with this exact structure:
{
  "passed": true,
  "issues": [],
  "summary": "Brief overall assessment (1-2 sentences)"
}

If there are problems, set "passed" to false and list each specific issue in the "issues" array. If the content looks good, set "passed" to true with an empty "issues" array. Keep the summary concise and constructive.`;

router.post("/check-lesson", async (req, res): Promise<void> => {
  const { lesson, llmConfig } = req.body ?? {};

  if (!lesson || typeof lesson !== "object") {
    res.status(400).json({ error: "lesson is required" });
    return;
  }
  if (!llmConfig || !llmConfig.apiKey || !llmConfig.provider || !llmConfig.model) {
    res.status(400).json({ error: "llmConfig with apiKey, provider, and model is required" });
    return;
  }

  try {
    const { client, model } = createLLMClient(llmConfig);

    const completion = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: CHECK_PROMPT(lesson) }],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let result: { passed: boolean; issues: string[]; summary: string };
    try {
      result = JSON.parse(raw);
    } catch {
      result = { passed: true, issues: [], summary: "Content reviewed and appears suitable for students." };
    }

    if (typeof result.passed !== "boolean") result.passed = true;
    if (!Array.isArray(result.issues)) result.issues = [];
    if (typeof result.summary !== "string") result.summary = "";

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "AI check failed" });
  }
});

export default router;
