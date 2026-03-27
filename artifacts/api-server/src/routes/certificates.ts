import { Router } from "express";
import { db } from "@workspace/db";
import { certificatesTable, coursesTable, sharedLessonsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID, createHash } from "crypto";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { courseId, learnerName, learnerKey, scores } = req.body;
    if (!courseId || !learnerName || !learnerKey || !scores) {
      return res.status(400).json({ error: "courseId, learnerName, learnerKey, and scores are required" });
    }

    const [course] = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.id, courseId))
      .limit(1);

    if (!course) return res.status(404).json({ error: "Course not found" });

    const lessonIds = course.lessonIds as string[];
    const passScore = course.passScore;

    for (const lid of lessonIds) {
      const score = scores[lid];
      if (score === undefined || score < passScore) {
        return res.status(400).json({
          error: `Lesson ${lid} not passed. Required: ${passScore}%, got: ${score ?? 0}%`,
        });
      }
    }

    const totalScore = lessonIds.reduce((sum, lid) => sum + (scores[lid] ?? 0), 0);
    const overallScore = Math.round(totalScore / lessonIds.length);

    const lessons = await db
      .select({ id: sharedLessonsTable.id, title: sharedLessonsTable.title })
      .from(sharedLessonsTable)
      .then((rows) => rows.filter((r) => lessonIds.includes(r.id)));

    const contentHashInput = JSON.stringify({
      courseId,
      courseTitle: course.title,
      teacherName: course.teacherName,
      lessonTitles: lessons.map((l) => l.title).sort(),
      learnerName,
      learnerKey,
      scores,
      overallScore,
      issuedAt: new Date().toISOString().slice(0, 10),
    });
    const contentHash = createHash("sha256").update(contentHashInput).digest("hex");

    const id = randomUUID();
    await db.insert(certificatesTable).values({
      id,
      courseId,
      courseTitle: course.title,
      teacherName: course.teacherName,
      learnerName: learnerName.trim(),
      learnerKey,
      scores,
      overallScore,
      contentHash,
    });

    res.json({ id, contentHash });
  } catch (err) {
    console.error("[certificates] POST error:", err);
    res.status(500).json({ error: "Failed to issue certificate" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [cert] = await db
      .select()
      .from(certificatesTable)
      .where(eq(certificatesTable.id, req.params.id))
      .limit(1);

    if (!cert) return res.status(404).json({ error: "Certificate not found" });

    const [course] = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.id, cert.courseId))
      .limit(1);

    const lessonIds = course ? (course.lessonIds as string[]) : [];
    const lessons = await db
      .select({ id: sharedLessonsTable.id, title: sharedLessonsTable.title })
      .from(sharedLessonsTable)
      .then((rows) => rows.filter((r) => lessonIds.includes(r.id)));

    const ordered = lessonIds
      .map((id) => lessons.find((l) => l.id === id))
      .filter(Boolean) as { id: string; title: string }[];

    res.json({ cert, course: course ?? null, lessons: ordered });
  } catch (err) {
    console.error("[certificates] GET error:", err);
    res.status(500).json({ error: "Failed to fetch certificate" });
  }
});

export default router;
