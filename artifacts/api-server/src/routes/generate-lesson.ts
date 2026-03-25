import { Router, type IRouter } from "express";
import { GenerateLessonBody } from "@workspace/api-zod";
import { createLLMClient } from "../lib/llm-client";

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

  try {
    const { client, model } = createLLMClient(llmConfig);
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
    });
    const content = response.choices[0]?.message?.content ?? "";

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      res.status(502).json({ error: "AI did not return valid JSON. Please try again." });
      return;
    }

    const data = JSON.parse(jsonMatch[0]);
    res.json({
      summary: data.summary ?? "",
      keyConcepts: data.keyConcepts ?? [],
      quizQuestions: data.quizQuestions ?? [],
    });
  } catch (err: any) {
    res.status(502).json({ error: err.message || "AI provider error" });
  }
});

export default router;
