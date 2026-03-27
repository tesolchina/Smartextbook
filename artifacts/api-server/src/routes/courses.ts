import { Router } from "express";
import { db } from "@workspace/db";
import { coursesTable, sharedLessonsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { title, description, teacherName, teacherCredential, lessonIds, passScore } = req.body;
    if (!title || !description || !teacherName || !Array.isArray(lessonIds) || lessonIds.length === 0) {
      return res.status(400).json({ error: "title, description, teacherName, and lessonIds are required" });
    }

    const lessons = await db
      .select({ id: sharedLessonsTable.id })
      .from(sharedLessonsTable)
      .then((rows) => rows.map((r) => r.id));

    const missing = lessonIds.filter((id: string) => !lessons.includes(id));
    if (missing.length > 0) {
      return res.status(400).json({ error: `Lesson IDs not found: ${missing.join(", ")}` });
    }

    const id = randomUUID();
    await db.insert(coursesTable).values({
      id,
      title,
      description,
      teacherName,
      teacherCredential: teacherCredential || null,
      lessonIds,
      passScore: passScore ?? 70,
    });

    res.json({ id });
  } catch (err) {
    console.error("[courses] POST error:", err);
    res.status(500).json({ error: "Failed to create course" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [course] = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.id, req.params.id))
      .limit(1);

    if (!course) return res.status(404).json({ error: "Course not found" });

    const lessons = await db
      .select()
      .from(sharedLessonsTable)
      .then((rows) => rows.filter((r) => (course.lessonIds as string[]).includes(r.id)));

    const ordered = (course.lessonIds as string[]).map((id) => lessons.find((l) => l.id === id)).filter(Boolean);

    res.json({ course, lessons: ordered });
  } catch (err) {
    console.error("[courses] GET error:", err);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

export default router;
