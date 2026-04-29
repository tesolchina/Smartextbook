import { Router } from "express";
import { db } from "@workspace/db";
import { ieeeSubmissionsTable } from "@workspace/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { createLLMClient } from "../lib/llm-client";
import { jsonrepair } from "jsonrepair";
import { logger } from "../lib/logger";
import { requireAuth, optionalAuth } from "../middlewares/require-auth";

const router = Router();

function getAdminKey(): string {
  const key = process.env.IEEE_ADMIN_KEY;
  if (!key) {
    logger.warn("IEEE_ADMIN_KEY env var is not set — admin endpoints are disabled");
    return "__DISABLED__";
  }
  return key;
}

function isAdminRequest(req: Parameters<typeof requireAuth>[0]): boolean {
  const expected = getAdminKey();
  if (expected === "__DISABLED__") return false;
  const key = req.headers["x-ieee-admin-key"];
  return typeof key === "string" && key === expected;
}

function buildParsePrompt(articleText: string): string {
  return `You are an expert in IEEE Professional Communication standards. Parse the following article into the IEEE Teaching Case format.

Extract or infer the following sections from the text. If a section is not present, return an empty string for it.

Article text:
${articleText.slice(0, 12000)}

Return ONLY this JSON (no other text, no markdown fences):
{
  "abstract": "The abstract or summary of the real-world communication problem",
  "learningObjectives": "Explicit, measurable learning objectives (Bloom's taxonomy). List each on a new line.",
  "caseNarrative": "The main professional communication scenario or case narrative",
  "discussionQuestions": "Open-ended reflection and discussion questions. List each on a new line.",
  "appendices": "Any supplementary materials, exhibits, rubrics mentioned or included",
  "teachingNotes": "Any instructor guidance, facilitation notes, or suggested answers",
  "suggestedTitle": "A clear, descriptive title for this teaching case",
  "topicArea": "Primary topic area (choose one: technical-writing, presentations, intercultural-communication, workplace-writing, digital-communication, research-communication, leadership-communication, other)",
  "bloomsLevel": "Highest Bloom's taxonomy level targeted (remember, understand, apply, analyze, evaluate, create)",
  "publicationYear": "Year of publication if identifiable, otherwise empty string",
  "estimatedMinutes": "Estimated completion time in minutes for the interactive lesson (as a number string)"
}`;
}

function buildGenerateIeeeLessonPrompt(sections: Record<string, string>, title: string): string {
  return `You are an expert educational designer specializing in IEEE Professional Communication. Generate a comprehensive interactive lesson from this IEEE Teaching Case.

Teaching Case: "${title}"

SECTIONS:
Abstract: ${sections.abstract || "Not provided"}
Learning Objectives: ${sections.learningObjectives || "Not provided"}
Case Narrative: ${sections.caseNarrative || "Not provided"}
Discussion Questions: ${sections.discussionQuestions || "Not provided"}

Generate a full interactive lesson with ALL of the following components.

Return ONLY this JSON (no other text, no markdown fences):
{
  "summary": "A 2-3 paragraph engaging summary of the case for learners, framed as a real-world professional communication challenge",
  "bloomsObjectives": [
    { "objective": "Identify the key communication barriers in the case", "level": "remember" },
    { "objective": "Explain why the communication strategy failed or succeeded", "level": "understand" },
    { "objective": "Apply the case lessons to a similar workplace scenario", "level": "apply" }
  ],
  "keyConcepts": [
    { "term": "concept name", "definition": "clear definition relevant to professional communication" }
  ],
  "glossary": [
    { "term": "domain-specific term", "definition": "plain-language definition" }
  ],
  "quizQuestions": [
    {
      "question": "Knowledge check question about the case",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this is correct based on the case"
    }
  ],
  "reflectionActivities": [
    {
      "prompt": "Open-ended reflection question or scenario for the learner",
      "guidance": "What a strong response should include or consider"
    }
  ]
}

CONSTRAINTS:
- bloomsObjectives: 3-5 objectives spanning at least 3 different Bloom's levels
- keyConcepts: 6-10 key professional communication concepts from the case
- glossary: 4-8 domain-specific or technical terms with plain definitions
- quizQuestions: exactly 8 questions mixing comprehension, analysis, and application levels; each must have exactly 4 options
- reflectionActivities: 3-4 open-ended activities derived from the Discussion Questions
- All content must be grounded in the provided case material`;
}

router.post("/ieee/parse-teaching-case", requireAuth, async (req, res) => {
  try {
    const { articleText, doi, llmConfig } = req.body;

    if (!articleText || typeof articleText !== "string") {
      return res.status(400).json({ error: "articleText is required" });
    }
    if (!llmConfig?.provider || !llmConfig?.apiKey || !llmConfig?.model) {
      return res.status(400).json({ error: "llmConfig with provider, apiKey, and model is required" });
    }

    logger.info({ doi, provider: llmConfig.provider }, "ieee: parse-teaching-case");

    const { client, model } = createLLMClient(llmConfig);
    const prompt = buildParsePrompt(articleText);

    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      stream: false,
    });

    const content = response.choices[0]?.message?.content ?? "";
    const stripped = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
    const jsonMatch = stripped.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(502).json({ error: "AI did not return valid JSON. Please try again." });
    }

    const data = JSON.parse(jsonrepair(jsonMatch[0]));
    res.json({ sections: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI provider error";
    logger.error({ err }, "ieee: parse-teaching-case failed");
    res.status(502).json({ error: message });
  }
});

router.post("/ieee/generate-lesson", requireAuth, async (req, res) => {
  try {
    const { sections, title, llmConfig } = req.body;

    if (!sections || typeof sections !== "object") {
      return res.status(400).json({ error: "sections object is required" });
    }
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "title is required" });
    }
    if (!llmConfig?.provider || !llmConfig?.apiKey || !llmConfig?.model) {
      return res.status(400).json({ error: "llmConfig with provider, apiKey, and model is required" });
    }

    logger.info({ title, provider: llmConfig.provider }, "ieee: generate-lesson");

    const { client, model } = createLLMClient(llmConfig);
    const prompt = buildGenerateIeeeLessonPrompt(sections as Record<string, string>, title);

    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      stream: false,
    });

    const content = response.choices[0]?.message?.content ?? "";
    const stripped = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
    const jsonMatch = stripped.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(502).json({ error: "AI did not return valid JSON. Please try again." });
    }

    const data = JSON.parse(jsonrepair(jsonMatch[0]));

    type RawObj = Record<string, unknown>;

    const bloomsObjectives = (Array.isArray(data.bloomsObjectives) ? data.bloomsObjectives as RawObj[] : [])
      .filter((o) => o && typeof o === "object" && o.objective && o.level)
      .map((o) => ({ objective: String(o.objective), level: String(o.level) }));

    const keyConcepts = (Array.isArray(data.keyConcepts) ? data.keyConcepts as RawObj[] : [])
      .filter((c) => c && typeof c === "object" && c.term && c.definition)
      .map((c) => ({ term: String(c.term), definition: String(c.definition) }));

    const glossary = (Array.isArray(data.glossary) ? data.glossary as RawObj[] : [])
      .filter((c) => c && typeof c === "object" && c.term && c.definition)
      .map((c) => ({ term: String(c.term), definition: String(c.definition) }));

    const quizQuestions = (Array.isArray(data.quizQuestions) ? data.quizQuestions as RawObj[] : [])
      .filter((q) => q && typeof q === "object" && q.question && Array.isArray(q.options) && (q.options as unknown[]).length === 4)
      .map((q) => ({
        question: String(q.question),
        options: (q.options as unknown[]).map(String),
        correctIndex: Math.min(3, Math.max(0, parseInt(String(q.correctIndex ?? 0), 10))),
        explanation: String(q.explanation ?? ""),
      }));

    const reflectionActivities = (Array.isArray(data.reflectionActivities) ? data.reflectionActivities as RawObj[] : [])
      .filter((r) => r && typeof r === "object" && r.prompt)
      .map((r) => ({ prompt: String(r.prompt), guidance: String(r.guidance ?? "") }));

    res.json({
      summary: String(data.summary ?? "").trim(),
      bloomsObjectives,
      keyConcepts,
      glossary,
      quizQuestions,
      reflectionActivities,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI provider error";
    logger.error({ err }, "ieee: generate-lesson failed");
    res.status(502).json({ error: message });
  }
});

router.get("/ieee/catalog", async (req, res) => {
  try {
    const submissions = await db
      .select({
        id: ieeeSubmissionsTable.id,
        title: ieeeSubmissionsTable.title,
        authorName: ieeeSubmissionsTable.authorName,
        topicArea: ieeeSubmissionsTable.topicArea,
        bloomsLevel: ieeeSubmissionsTable.bloomsLevel,
        publicationYear: ieeeSubmissionsTable.publicationYear,
        estimatedMinutes: ieeeSubmissionsTable.estimatedMinutes,
        updatedAt: ieeeSubmissionsTable.updatedAt,
      })
      .from(ieeeSubmissionsTable)
      .where(eq(ieeeSubmissionsTable.status, "approved"))
      .orderBy(desc(ieeeSubmissionsTable.updatedAt));

    res.json({ lessons: submissions });
  } catch (err) {
    logger.error({ err }, "ieee: catalog GET failed");
    res.status(500).json({ error: "Failed to fetch catalog" });
  }
});

router.post("/ieee/submissions", requireAuth, async (req, res) => {
  try {
    const { title, doi, teachingCaseSections, lessonData, topicArea, bloomsLevel, publicationYear, estimatedMinutes } = req.body;

    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }

    const authorEmail = req.user!.email;
    const authorName = req.user!.displayName || authorEmail;

    const [submission] = await db
      .insert(ieeeSubmissionsTable)
      .values({
        title: String(title),
        doi: doi ? String(doi) : null,
        authorName: String(authorName),
        authorEmail,
        status: "draft",
        teachingCaseSections: (teachingCaseSections ?? {}) as Record<string, string>,
        lessonData: (lessonData ?? {}) as Record<string, unknown>,
        topicArea: topicArea ? String(topicArea) : null,
        bloomsLevel: bloomsLevel ? String(bloomsLevel) : null,
        publicationYear: publicationYear ? String(publicationYear) : null,
        estimatedMinutes: estimatedMinutes ? String(estimatedMinutes) : null,
      })
      .returning();

    res.json({ submission });
  } catch (err) {
    logger.error({ err }, "ieee: submissions POST failed");
    res.status(500).json({ error: "Failed to create submission" });
  }
});

router.post("/ieee/submissions/:id/submit", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid submission ID" });

    const callerEmail = req.user!.email;

    const [existing] = await db
      .select({ id: ieeeSubmissionsTable.id, status: ieeeSubmissionsTable.status, authorEmail: ieeeSubmissionsTable.authorEmail })
      .from(ieeeSubmissionsTable)
      .where(and(eq(ieeeSubmissionsTable.id, id), eq(ieeeSubmissionsTable.authorEmail, callerEmail)))
      .limit(1);

    if (!existing) {
      return res.status(404).json({ error: "Submission not found or you are not the author" });
    }

    if (existing.status !== "draft") {
      return res.status(409).json({ error: `Submission is already in status: ${existing.status}` });
    }

    const [submission] = await db
      .update(ieeeSubmissionsTable)
      .set({ status: "under_review", updatedAt: new Date() })
      .where(eq(ieeeSubmissionsTable.id, id))
      .returning();

    res.json({ submission });
  } catch (err) {
    logger.error({ err }, "ieee: submission submit failed");
    res.status(500).json({ error: "Failed to submit for review" });
  }
});

router.post("/ieee/submissions/:id/resubmit", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid submission ID" });

    const callerEmail = req.user!.email;

    const [existing] = await db
      .select({ id: ieeeSubmissionsTable.id, status: ieeeSubmissionsTable.status, authorEmail: ieeeSubmissionsTable.authorEmail })
      .from(ieeeSubmissionsTable)
      .where(and(eq(ieeeSubmissionsTable.id, id), eq(ieeeSubmissionsTable.authorEmail, callerEmail)))
      .limit(1);

    if (!existing) {
      return res.status(404).json({ error: "Submission not found or you are not the author" });
    }

    if (existing.status !== "rejected") {
      return res.status(409).json({ error: `Only rejected submissions can be resubmitted. Current status: ${existing.status}` });
    }

    const [submission] = await db
      .update(ieeeSubmissionsTable)
      .set({ status: "under_review", adminNotes: null, updatedAt: new Date() })
      .where(eq(ieeeSubmissionsTable.id, id))
      .returning();

    res.json({ submission });
  } catch (err) {
    logger.error({ err }, "ieee: submission resubmit failed");
    res.status(500).json({ error: "Failed to resubmit" });
  }
});

router.get("/ieee/submissions/:id", optionalAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid submission ID" });

    const admin = isAdminRequest(req);

    const [submission] = await db
      .select()
      .from(ieeeSubmissionsTable)
      .where(eq(ieeeSubmissionsTable.id, id))
      .limit(1);

    if (!submission) return res.status(404).json({ error: "Submission not found" });

    if (submission.status === "approved") {
      return res.json({ submission });
    }

    if (admin) {
      return res.json({ submission });
    }

    if (req.user?.email === submission.authorEmail) {
      return res.json({ submission });
    }

    return res.status(403).json({ error: "Access denied" });
  } catch (err) {
    logger.error({ err }, "ieee: submission GET failed");
    res.status(500).json({ error: "Failed to fetch submission" });
  }
});

router.get("/ieee/submissions", optionalAuth, async (req, res) => {
  try {
    const admin = isAdminRequest(req);

    if (!admin && !req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    let submissions;
    if (admin) {
      submissions = await db
        .select()
        .from(ieeeSubmissionsTable)
        .orderBy(desc(ieeeSubmissionsTable.createdAt));
    } else {
      submissions = await db
        .select()
        .from(ieeeSubmissionsTable)
        .where(eq(ieeeSubmissionsTable.authorEmail, req.user!.email))
        .orderBy(desc(ieeeSubmissionsTable.createdAt));
    }

    res.json({ submissions });
  } catch (err) {
    logger.error({ err }, "ieee: submissions list GET failed");
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

router.patch("/ieee/submissions/:id", optionalAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid submission ID" });

    const admin = isAdminRequest(req);

    if (!admin && !req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const callerEmail = req.user?.email ?? "";

    const [existing] = await db
      .select({ id: ieeeSubmissionsTable.id, status: ieeeSubmissionsTable.status, authorEmail: ieeeSubmissionsTable.authorEmail })
      .from(ieeeSubmissionsTable)
      .where(eq(ieeeSubmissionsTable.id, id))
      .limit(1);

    if (!existing) return res.status(404).json({ error: "Submission not found" });

    if (!admin) {
      if (callerEmail !== existing.authorEmail) {
        return res.status(403).json({ error: "Access denied: you are not the author of this submission" });
      }
      if (existing.status !== "draft" && existing.status !== "rejected") {
        return res.status(409).json({ error: "Only draft or rejected submissions can be edited by the author" });
      }
    }

    const { title, doi, teachingCaseSections, lessonData, topicArea, bloomsLevel, publicationYear, estimatedMinutes, status, adminNotes } = req.body;

    const updateFields: Partial<{
      title: string;
      doi: string | null;
      teachingCaseSections: Record<string, string>;
      lessonData: Record<string, unknown>;
      topicArea: string | null;
      bloomsLevel: string | null;
      publicationYear: string | null;
      estimatedMinutes: string | null;
      status: string;
      adminNotes: string | null;
      updatedAt: Date;
    }> = { updatedAt: new Date() };

    if (title !== undefined) updateFields.title = String(title);
    if (doi !== undefined) updateFields.doi = doi ? String(doi) : null;
    if (teachingCaseSections !== undefined) updateFields.teachingCaseSections = teachingCaseSections as Record<string, string>;
    if (lessonData !== undefined) updateFields.lessonData = lessonData as Record<string, unknown>;
    if (topicArea !== undefined) updateFields.topicArea = topicArea ? String(topicArea) : null;
    if (bloomsLevel !== undefined) updateFields.bloomsLevel = bloomsLevel ? String(bloomsLevel) : null;
    if (publicationYear !== undefined) updateFields.publicationYear = publicationYear ? String(publicationYear) : null;
    if (estimatedMinutes !== undefined) updateFields.estimatedMinutes = estimatedMinutes ? String(estimatedMinutes) : null;

    if (admin) {
      if (status !== undefined) {
        const validStatuses = ["draft", "under_review", "approved", "rejected"];
        if (!validStatuses.includes(String(status))) {
          return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }
        updateFields.status = String(status);
      }
      if (adminNotes !== undefined) {
        updateFields.adminNotes = adminNotes ? String(adminNotes) : null;
      }
    }

    const [submission] = await db
      .update(ieeeSubmissionsTable)
      .set(updateFields)
      .where(eq(ieeeSubmissionsTable.id, id))
      .returning();

    if (!submission) return res.status(404).json({ error: "Submission not found" });

    res.json({ submission });
  } catch (err) {
    logger.error({ err }, "ieee: submission PATCH failed");
    res.status(500).json({ error: "Failed to update submission" });
  }
});

export default router;
