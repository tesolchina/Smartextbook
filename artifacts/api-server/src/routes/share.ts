import { Router, type IRouter, type Request } from "express";
import { db, sharedLessonsTable, commentsTable } from "@workspace/db";
import { eq, asc, lt } from "drizzle-orm";
import { nanoid } from "nanoid";

const router: IRouter = Router();

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

async function cleanupExpiredShares(): Promise<void> {
  try {
    await db.delete(sharedLessonsTable).where(lt(sharedLessonsTable.expiresAt, new Date()));
  } catch {
    // Non-fatal: cleanup failures should not crash the server
  }
}

// Run cleanup once on module load (server startup)
cleanupExpiredShares();

interface ValidLesson {
  id: string;
  title: string;
  summary: string;
  keyConcepts: unknown[];
  quizQuestions: unknown[];
  chapterText: string;
}

function isValidLesson(v: unknown): v is ValidLesson {
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


function getOrigin(req: Request): string {
  const forwarded = req.headers["x-forwarded-proto"];
  const proto = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.protocol;
  const host = req.headers["x-forwarded-host"] ?? req.get("host") ?? "localhost";
  return `${proto}://${host}`;
}

router.post("/share", async (req, res): Promise<void> => {
  const { lesson } = req.body ?? {};
  if (!isValidLesson(lesson)) {
    res.status(400).json({ error: "Invalid lesson data" });
    return;
  }

  const shareId = nanoid(16);
  const expiresAt = new Date(Date.now() + NINETY_DAYS_MS);

  // Probabilistic background cleanup: ~1 in 50 share requests triggers a purge
  if (Math.random() < 0.02) {
    cleanupExpiredShares();
  }

  try {
    await db.insert(sharedLessonsTable).values({
      id: shareId,
      title: lesson.title,
      lessonData: lesson,
      expiresAt,
    });

    const shareUrl = `${getOrigin(req)}/shared/${shareId}`;
    res.json({ shareId, shareUrl, expiresAt: expiresAt.toISOString() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to share lesson";
    res.status(500).json({ error: message });
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

    if (!row || row.expiresAt < new Date()) {
      res.status(404).json({ error: "Shared lesson not found" });
      return;
    }

    res.json({
      lesson: row.lessonData,
      title: row.title,
      expiresAt: row.expiresAt.toISOString(),
      createdAt: row.createdAt.toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve shared lesson";
    res.status(500).json({ error: message });
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
        contactInfo: r.contactInfo ?? null,
        body: r.body,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load comments";
    res.status(500).json({ error: message });
  }
});

router.post("/shared/:id/comments", async (req, res): Promise<void> => {
  const { id } = req.params;
  const { authorName, body, contactInfo } = req.body ?? {};

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
  if (contactInfo !== undefined && (typeof contactInfo !== "string" || contactInfo.trim().length > 200)) {
    res.status(400).json({ error: "contactInfo must be at most 200 characters" });
    return;
  }

  try {
    const [row] = await db
      .select({ id: sharedLessonsTable.id, expiresAt: sharedLessonsTable.expiresAt })
      .from(sharedLessonsTable)
      .where(eq(sharedLessonsTable.id, id))
      .limit(1);

    if (!row || row.expiresAt < new Date()) {
      res.status(404).json({ error: "Shared lesson not found" });
      return;
    }

    const [inserted] = await db
      .insert(commentsTable)
      .values({
        lessonId: id,
        authorName: authorName.trim(),
        contactInfo: typeof contactInfo === "string" && contactInfo.trim() ? contactInfo.trim() : null,
        body: body.trim(),
      })
      .returning();

    res.status(201).json({
      comment: {
        id: inserted.id,
        authorName: inserted.authorName,
        contactInfo: inserted.contactInfo ?? null,
        body: inserted.body,
        createdAt: inserted.createdAt.toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to post comment";
    res.status(500).json({ error: message });
  }
});

export default router;
