import { Router } from "express";
import { db } from "@workspace/db";
import { demoCompletionsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID, createHash } from "crypto";

const router = Router();

router.post("/demo-cert", async (req, res) => {
  try {
    const { moduleId, moduleTitle, learnerName, score, rawScore, maxScore, sessionId } = req.body;

    if (!moduleId || !moduleTitle || !learnerName || score == null || rawScore == null || maxScore == null) {
      return res.status(400).json({
        error: "moduleId, moduleTitle, learnerName, score, rawScore, and maxScore are required",
      });
    }

    const name = String(learnerName).trim();
    if (!name) return res.status(400).json({ error: "learnerName cannot be empty" });

    const issuedAt = new Date().toISOString().slice(0, 10);
    const contentHashInput = JSON.stringify({
      moduleId, moduleTitle, learnerName: name, score, rawScore, maxScore, issuedAt,
    });
    const contentHash = createHash("sha256").update(contentHashInput).digest("hex");

    const id = randomUUID();
    await db.insert(demoCompletionsTable).values({
      id,
      moduleId: String(moduleId),
      moduleTitle: String(moduleTitle),
      learnerName: name,
      score: Number(score),
      rawScore: Number(rawScore),
      maxScore: Number(maxScore),
      sessionId: sessionId ? String(sessionId) : null,
      contentHash,
    });

    res.json({ id, contentHash, issuedAt });
  } catch (err) {
    console.error("[demo-cert] POST error:", err);
    res.status(500).json({ error: "Failed to issue certificate" });
  }
});

router.get("/demo-cert/:id", async (req, res) => {
  try {
    const [record] = await db
      .select()
      .from(demoCompletionsTable)
      .where(eq(demoCompletionsTable.id, req.params.id))
      .limit(1);

    if (!record) return res.status(404).json({ error: "Certificate not found" });
    res.json(record);
  } catch (err) {
    console.error("[demo-cert] GET error:", err);
    res.status(500).json({ error: "Failed to fetch certificate" });
  }
});

export default router;
