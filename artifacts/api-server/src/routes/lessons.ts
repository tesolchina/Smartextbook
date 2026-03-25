import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, lessonsTable } from "@workspace/db";
import {
  CreateLessonBody,
  GetLessonParams,
  DeleteLessonParams,
  ChatWithTutorParams,
  ChatWithTutorBody,
  GetLessonChatHistoryParams,
} from "@workspace/api-zod";
import { createLLMClient, type LlmConfig } from "../lib/llm-client";

const router: IRouter = Router();

function serializeLesson(lesson: typeof lessonsTable.$inferSelect) {
  return {
    id: lesson.id,
    title: lesson.title,
    chapterText: lesson.chapterText,
    summary: lesson.summary,
    keyConcepts: lesson.keyConcepts as { term: string; definition: string }[],
    quizQuestions: lesson.quizQuestions as {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }[],
    status: lesson.status,
    createdAt: lesson.createdAt,
  };
}

async function processLessonWithAI(lessonId: number, chapterText: string, llmConfig: LlmConfig): Promise<void> {
  try {
    const { client, model } = createLLMClient(llmConfig);

    const prompt = `You are an expert educational content creator. Analyze the following book chapter and create structured lesson content.

Chapter text:
${chapterText.slice(0, 8000)}

Return a JSON object with this exact structure:
{
  "summary": "A clear 2-3 paragraph summary of the main ideas",
  "keyConcepts": [
    {"term": "concept name", "definition": "clear definition"},
    ...
  ],
  "quizQuestions": [
    {
      "question": "question text",
      "options": ["option A", "option B", "option C", "option D"],
      "correctIndex": 0,
      "explanation": "why this is correct"
    },
    ...
  ]
}

Requirements:
- Provide 5-10 key concepts that are central to understanding the chapter
- Create 5-8 multiple-choice quiz questions that test comprehension
- Make sure quiz questions have exactly 4 options (index 0-3)
- correctIndex must be 0, 1, 2, or 3

Return ONLY the JSON object, no other text.`;

    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0]?.message?.content ?? "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in AI response");

    const parsed = JSON.parse(jsonMatch[0]);

    await db
      .update(lessonsTable)
      .set({
        summary: parsed.summary ?? "",
        keyConcepts: parsed.keyConcepts ?? [],
        quizQuestions: parsed.quizQuestions ?? [],
        status: "ready",
        llmApiKey: null,
      })
      .where(eq(lessonsTable.id, lessonId));
  } catch (err) {
    await db
      .update(lessonsTable)
      .set({ status: "error", llmApiKey: null })
      .where(eq(lessonsTable.id, lessonId));
  }
}

router.get("/lessons", async (_req, res): Promise<void> => {
  const lessons = await db
    .select()
    .from(lessonsTable)
    .orderBy(lessonsTable.createdAt);
  res.json(lessons.map(serializeLesson));
});

router.post("/lessons", async (req, res): Promise<void> => {
  const parsed = CreateLessonBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { title, chapterText, llmConfig } = parsed.data;

  try {
    createLLMClient(llmConfig);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
    return;
  }

  const [lesson] = await db
    .insert(lessonsTable)
    .values({
      title,
      chapterText,
      summary: "",
      keyConcepts: [],
      quizQuestions: [],
      status: "processing",
      llmProvider: llmConfig.provider,
      llmApiKey: llmConfig.apiKey,
      llmModel: llmConfig.model,
      llmBaseUrl: llmConfig.baseUrl ?? null,
    })
    .returning();

  res.status(201).json(serializeLesson(lesson));

  processLessonWithAI(lesson.id, chapterText, llmConfig);
});

router.get("/lessons/:id", async (req, res): Promise<void> => {
  const params = GetLessonParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [lesson] = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.id, params.data.id));

  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  res.json(serializeLesson(lesson));
});

router.delete("/lessons/:id", async (req, res): Promise<void> => {
  const params = DeleteLessonParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [lesson] = await db
    .delete(lessonsTable)
    .where(eq(lessonsTable.id, params.data.id))
    .returning();

  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  res.sendStatus(204);
});

router.post("/lessons/:id/chat", async (req, res): Promise<void> => {
  const params = ChatWithTutorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = ChatWithTutorBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [lesson] = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.id, params.data.id));

  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  let client: ReturnType<typeof createLLMClient>["client"];
  let model: string;
  try {
    const result = createLLMClient(body.data.llmConfig);
    client = result.client;
    model = result.model;
  } catch (err: any) {
    res.status(400).json({ error: err.message });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const keyConcepts = lesson.keyConcepts as { term: string; definition: string }[];
  const conceptsList = keyConcepts.map((c) => `- ${c.term}: ${c.definition}`).join("\n");

  const systemPrompt = `You are an expert AI tutor helping a student learn from a book chapter. You have deep knowledge of the chapter content and can explain concepts clearly, answer questions, quiz the student, and provide examples.

Chapter title: ${lesson.title}

Chapter summary: ${lesson.summary}

Key concepts from this chapter:
${conceptsList}

Chapter content (first 4000 characters):
${lesson.chapterText.slice(0, 4000)}

Your role:
- Answer questions about the chapter content clearly and helpfully
- Explain concepts in different ways if the student doesn't understand
- Quiz the student if they ask (create your own questions based on the chapter)
- Be encouraging and educational
- Reference specific parts of the chapter when relevant
- If asked something not related to the chapter, gently redirect to the chapter content`;

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...body.data.history.map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.content,
    })),
    { role: "user" as const, content: body.data.message },
  ];

  try {
    const stream = await client.chat.completions.create({
      model,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: any) {
    const message = err?.message || "AI error occurred";
    res.write(`data: ${JSON.stringify({ error: message, done: true })}\n\n`);
    res.end();
  }
});

router.get("/lessons/:id/chat-history", async (req, res): Promise<void> => {
  const params = GetLessonChatHistoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  res.json([]);
});

export default router;
