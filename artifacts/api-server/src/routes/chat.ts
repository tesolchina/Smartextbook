import { Router, type IRouter } from "express";
import { ChatWithTutorBody } from "@workspace/api-zod";
import { createLLMClient } from "../lib/llm-client";

const router: IRouter = Router();

router.post("/chat", async (req, res): Promise<void> => {
  const parsed = ChatWithTutorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { message, history, lessonContext, llmConfig } = parsed.data;

  const conceptsList = lessonContext.keyConcepts
    .map((c) => `- ${c.term}: ${c.definition}`)
    .join("\n");

  const systemPrompt = `You are an expert AI tutor helping a student learn from a book chapter. You have deep knowledge of the chapter content and can explain concepts clearly, answer questions, quiz the student, and provide examples.

Chapter title: ${lessonContext.title}

Chapter summary: ${lessonContext.summary}

Key concepts from this chapter:
${conceptsList}

Chapter content (first 4000 characters):
${lessonContext.chapterText.slice(0, 4000)}

Your role:
- Answer questions about the chapter content clearly and helpfully
- Explain concepts in different ways if the student doesn't understand
- Quiz the student if they ask (create your own questions based on the chapter)
- Be encouraging and educational
- Reference specific parts of the chapter when relevant
- If asked something not related to the chapter, gently redirect to the chapter content`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let client: ReturnType<typeof createLLMClient>["client"];
  let model: string;
  try {
    const result = createLLMClient(llmConfig);
    client = result.client;
    model = result.model;
  } catch (err: unknown) {
    res.write(`data: ${JSON.stringify({ error: err instanceof Error ? err.message : "AI error", done: true })}\n\n`);
    res.end();
    return;
  }

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...history.map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.content,
    })),
    { role: "user" as const, content: message },
  ];

  try {
    const stream = await client.chat.completions.create({
      model,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: unknown) {
    res.write(`data: ${JSON.stringify({ error: err instanceof Error ? err.message : "AI error", done: true })}\n\n`);
    res.end();
  }
});

export default router;
