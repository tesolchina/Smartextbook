import { Router, type IRouter } from "express";
import { db, sharedLessonsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createLLMClient } from "../lib/llm-client";
import OpenAI from "openai";

const router: IRouter = Router();

interface MissedQuestion {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
}

interface LlmConfig {
  provider: string;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

const SAFE_PROVIDERS = new Set([
  "openai", "gemini", "deepseek", "openrouter", "minimax",
  "grok", "mistral", "together", "poe", "kimi",
]);

function buildReportPrompt(
  lessonTitle: string,
  score: number,
  total: number,
  missedQuestions: MissedQuestion[],
  studentNotes: string,
): string {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const missed = missedQuestions
    .map((q) => `- Q: "${q.question}" — you answered "${q.yourAnswer}", correct was "${q.correctAnswer}"`)
    .join("\n");

  return `\
You are an encouraging educational coach writing a personalized learning reflection for a student.

Lesson: "${lessonTitle}"
Quiz score: ${score}/${total} (${pct}%)
${missedQuestions.length > 0 ? `Missed questions:\n${missed}` : "The student answered all questions correctly."}
${studentNotes.trim() ? `Student's own notes: ${studentNotes.trim()}` : ""}

Write a brief (3–5 sentence) personalized reflection paragraph for this student.
- Acknowledge their score with genuine encouragement.
- Identify 1–2 key concepts they seem to have struggled with (based on missed questions), or praise their mastery if they scored perfectly.
- End with a motivating forward-looking sentence.
- Write in second person ("You did...", "You showed...").
- Do NOT use bullet points or headers — write flowing prose only.
- Keep it warm, specific, and concise.`;
}

function getServerLlmClient(): { client: OpenAI; model: string } | null {
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  if (!baseURL || !apiKey) return null;

  const client = new OpenAI({ apiKey, baseURL });
  return { client, model: "gpt-4o" };
}

router.post("/shared/:id/generate-report", async (req, res): Promise<void> => {
  const { id } = req.params;
  const { score, total, missedQuestions, studentNotes, llmConfig } = req.body ?? {};

  if (typeof score !== "number" || typeof total !== "number" || total <= 0) {
    res.status(400).json({ error: "score and total are required numbers" });
    return;
  }
  if (!Array.isArray(missedQuestions)) {
    res.status(400).json({ error: "missedQuestions must be an array" });
    return;
  }

  try {
    const [row] = await db
      .select({ id: sharedLessonsTable.id, title: sharedLessonsTable.title, expiresAt: sharedLessonsTable.expiresAt })
      .from(sharedLessonsTable)
      .where(eq(sharedLessonsTable.id, id))
      .limit(1);

    if (!row) {
      res.status(404).json({ error: "Shared lesson not found" });
      return;
    }
    if (row.expiresAt < new Date()) {
      res.status(410).json({ error: "This shared lesson link has expired" });
      return;
    }

    let llmClientPair: { client: OpenAI; model: string } | null = null;

    if (
      llmConfig &&
      typeof llmConfig.provider === "string" &&
      typeof llmConfig.apiKey === "string" &&
      llmConfig.apiKey.trim() &&
      typeof llmConfig.model === "string"
    ) {
      const config = llmConfig as LlmConfig;
      if (config.provider !== "custom" && !SAFE_PROVIDERS.has(config.provider)) {
        res.status(400).json({ error: `Unsupported provider: ${config.provider}` });
        return;
      }
      if (config.provider === "custom") {
        res.status(400).json({ error: "Custom base URL providers are not allowed for this endpoint" });
        return;
      }
      llmClientPair = createLLMClient(config);
    } else {
      llmClientPair = getServerLlmClient();
    }

    if (!llmClientPair) {
      res.status(422).json({ error: "No LLM configured. Please set an API key in settings." });
      return;
    }

    const prompt = buildReportPrompt(
      row.title,
      score,
      total,
      missedQuestions as MissedQuestion[],
      typeof studentNotes === "string" ? studentNotes : "",
    );

    const { client, model } = llmClientPair;
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      stream: false,
    });

    const reflection = response.choices[0]?.message?.content?.trim() ?? "";
    res.json({ reflection });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to generate report" });
  }
});

router.get("/email-capability", (_req, res): void => {
  const sendgridKey = process.env.SENDGRID_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const available = Boolean(sendgridKey || resendKey);
  res.json({ available, provider: sendgridKey ? "sendgrid" : resendKey ? "resend" : null });
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_RECIPIENTS = 2;
const MAX_BODY_CHARS = 50_000;
const MAX_SUBJECT_CHARS = 200;

router.post("/shared/:id/email-report", async (req, res): Promise<void> => {
  const sendgridKey = process.env.SENDGRID_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!sendgridKey && !resendKey) {
    res.status(503).json({ error: "Email service is not configured on this server" });
    return;
  }

  const { id } = req.params;
  const { to, subject, body } = req.body ?? {};

  if (
    !Array.isArray(to) ||
    to.length === 0 ||
    to.length > MAX_RECIPIENTS ||
    to.some((e) => typeof e !== "string" || !EMAIL_REGEX.test(e.trim()))
  ) {
    res.status(400).json({ error: `to must be 1–${MAX_RECIPIENTS} valid email addresses` });
    return;
  }
  if (typeof subject !== "string" || !subject.trim() || subject.length > MAX_SUBJECT_CHARS) {
    res.status(400).json({ error: `subject is required and must be at most ${MAX_SUBJECT_CHARS} characters` });
    return;
  }
  if (typeof body !== "string" || !body.trim() || body.length > MAX_BODY_CHARS) {
    res.status(400).json({ error: `body is required and must be at most ${MAX_BODY_CHARS} characters` });
    return;
  }

  const sanitizedTo = (to as string[]).map((e) => e.trim().toLowerCase());
  const sanitizedSubject = subject.trim().slice(0, MAX_SUBJECT_CHARS);
  const sanitizedBody = body.trim().slice(0, MAX_BODY_CHARS);

  try {
    const [row] = await db
      .select({ id: sharedLessonsTable.id, expiresAt: sharedLessonsTable.expiresAt })
      .from(sharedLessonsTable)
      .where(eq(sharedLessonsTable.id, id))
      .limit(1);

    if (!row) {
      res.status(404).json({ error: "Shared lesson not found" });
      return;
    }
    if (row.expiresAt < new Date()) {
      res.status(410).json({ error: "This shared lesson link has expired" });
      return;
    }

    if (resendKey) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "SmartTextbook <reports@smarttextbook.app>",
          to: sanitizedTo,
          subject: sanitizedSubject,
          text: sanitizedBody,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        res.status(502).json({ error: (data as any).message || "Failed to send email via Resend" });
        return;
      }
      res.json({ sent: true });
      return;
    }

    if (sendgridKey) {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: { "Authorization": `Bearer ${sendgridKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          personalizations: [{ to: sanitizedTo.map((email) => ({ email })) }],
          from: { email: "reports@smarttextbook.app", name: "SmartTextbook" },
          subject: sanitizedSubject,
          content: [{ type: "text/plain", value: sanitizedBody }],
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        res.status(502).json({ error: (data as any).errors?.[0]?.message || "Failed to send email via SendGrid" });
        return;
      }
      res.json({ sent: true });
      return;
    }

    res.status(503).json({ error: "Email service is not configured on this server" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to send email" });
  }
});

export default router;
