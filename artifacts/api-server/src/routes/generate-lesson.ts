import { Router, type IRouter } from "express";
import { GenerateLessonBody } from "@workspace/api-zod";
import { createLLMClient } from "../lib/llm-client";
import { jsonrepair } from "jsonrepair";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const LESSON_PROMPT = (title: string, chapterText: string) => `\
You are an expert educational content creator. Analyze the following book chapter and create structured lesson content.

Chapter title: ${title}

Chapter text:
${chapterText.slice(0, 8000)}

Return a JSON object with this exact structure:
{
  "summary": "A clear 2-3 paragraph summary of the main ideas",
  "keyConcepts": [
    {"term": "concept name", "definition": "clear definition"}
  ],
  "quizQuestions": [
    {
      "question": "question text",
      "options": ["option A", "option B", "option C", "option D"],
      "correctIndex": 0,
      "explanation": "why this is correct"
    }
  ]
}

Requirements:
- Provide 5-10 key concepts that are central to understanding the chapter
- Create 5-8 multiple-choice quiz questions that test comprehension
- Each quiz question must have exactly 4 options (index 0-3)
- correctIndex must be 0, 1, 2, or 3

Return ONLY the JSON object, no other text.`;

router.post("/generate-lesson", async (req, res): Promise<void> => {
  const parsed = GenerateLessonBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { title, chapterText, llmConfig } = parsed.data;
  const prompt = LESSON_PROMPT(title, chapterText);

  logger.info(
    { provider: llmConfig.provider, model: llmConfig.model, hasKey: Boolean(llmConfig.apiKey) },
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

    // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
    const stripped = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();

    // Extract the outermost JSON object
    const jsonMatch = stripped.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      res.status(502).json({ error: "AI did not return valid JSON. Please try again." });
      return;
    }

    // Use jsonrepair to fix common LLM JSON issues (unescaped newlines, trailing commas, etc.)
    const data = JSON.parse(jsonrepair(jsonMatch[0]));

    // Sanitize keyConcepts — guard against null entries, missing fields, wrong types
    const keyConcepts = (Array.isArray(data.keyConcepts) ? data.keyConcepts : [])
      .filter((c: any) => c && typeof c === "object")
      .map((c: any) => ({
        term: String(c.term ?? "").trim(),
        definition: String(c.definition ?? "").trim(),
      }))
      .filter((c: { term: string; definition: string }) => c.term && c.definition);

    // Sanitize quizQuestions — coerce correctIndex to number, enforce 4 options, remove incomplete items
    const quizQuestions = (Array.isArray(data.quizQuestions) ? data.quizQuestions : [])
      .filter((q: any) => q && typeof q === "object")
      .map((q: any) => {
        const options: string[] = Array.isArray(q.options)
          ? q.options.slice(0, 4).map(String)
          : [];
        // LLMs sometimes return correctIndex as a string ("1") — always coerce to number
        const correctIndex = Math.min(3, Math.max(0, parseInt(String(q.correctIndex ?? 0), 10)));
        return {
          question: String(q.question ?? "").trim(),
          options,
          correctIndex,
          explanation: String(q.explanation ?? "").trim(),
        };
      })
      // Drop any question that ended up with wrong option count or missing required text
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
