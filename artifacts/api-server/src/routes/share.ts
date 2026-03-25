import { Router, type IRouter } from "express";
import { db, sharedLessonsTable, commentsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router: IRouter = Router();

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

function isValidLesson(v: unknown): boolean {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    typeof o.summary === "string" &&
    Array.isArray(o.keyConcepts) &&
    Array.isArray(o.quizQuestions) &&
    typeof o.chapterText === "string"
  );
}

function generateId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}

router.post("/share", async (req, res): Promise<void> => {
  const { lesson } = req.body ?? {};
  if (!isValidLesson(lesson)) {
    res.status(400).json({ error: "Invalid lesson data" });
    return;
  }

  const shareId = generateId();
  const expiresAt = new Date(Date.now() + NINETY_DAYS_MS);

  try {
    await db.insert(sharedLessonsTable).values({
      id: shareId,
      title: (lesson as any).title as string,
      lessonData: lesson as any,
      expiresAt,
    });

    res.json({ shareId, expiresAt: expiresAt.toISOString() });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to share lesson" });
  }
});

router.get("/shared/:id", async (req, res): Promise<void> => {
  const { id } = req.params;

  try {
    const [row] = await db
      .select()
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

    res.json({
      lesson: row.lessonData,
      title: row.title,
      expiresAt: row.expiresAt.toISOString(),
      createdAt: row.createdAt.toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to retrieve shared lesson" });
  }
});

router.get("/shared/:id/comments", async (req, res): Promise<void> => {
  const { id } = req.params;

  try {
    const rows = await db
      .select()
      .from(commentsTable)
      .where(eq(commentsTable.lessonId, id))
      .orderBy(asc(commentsTable.createdAt));

    res.json({
      comments: rows.map((r) => ({
        id: r.id,
        authorName: r.authorName,
        body: r.body,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load comments" });
  }
});

router.post("/shared/:id/comments", async (req, res): Promise<void> => {
  const { id } = req.params;
  const { authorName, body } = req.body ?? {};

  if (
    typeof authorName !== "string" ||
    authorName.trim().length === 0 ||
    authorName.trim().length > 80
  ) {
    res.status(400).json({ error: "authorName must be 1–80 characters" });
    return;
  }
  if (
    typeof body !== "string" ||
    body.trim().length === 0 ||
    body.trim().length > 2000
  ) {
    res.status(400).json({ error: "body must be 1–2000 characters" });
    return;
  }

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

    const [inserted] = await db
      .insert(commentsTable)
      .values({
        lessonId: id,
        authorName: authorName.trim(),
        body: body.trim(),
      })
      .returning();

    res.status(201).json({
      comment: {
        id: inserted.id,
        authorName: inserted.authorName,
        body: inserted.body,
        createdAt: inserted.createdAt.toISOString(),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to post comment" });
  }
});

export default router;
