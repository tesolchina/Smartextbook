import { Router } from "express";
import { db } from "@workspace/db";
import { xapiStatementsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.post("/xapi", async (req, res) => {
  try {
    const stmt = req.body;
    if (!stmt?.verb || !stmt?.object?.id) {
      return res.status(400).json({ error: "verb and object.id are required" });
    }

    await db.insert(xapiStatementsTable).values({
      sessionId: stmt.context?.extensions?.sessionId ?? null,
      actorName: stmt.actor?.name ?? null,
      actorEmail: stmt.actor?.mbox?.replace("mailto:", "") ?? null,
      verb: stmt.verb.id ?? stmt.verb,
      objectId: stmt.object.id,
      objectName: stmt.object.definition?.name?.["en-US"] ?? null,
      resultSuccess: stmt.result?.success != null ? String(stmt.result.success) : null,
      resultScore: stmt.result?.score?.scaled != null
        ? Math.round(stmt.result.score.scaled * 100)
        : stmt.result?.score?.raw ?? null,
      resultMaxScore: stmt.result?.score?.max ?? null,
      resultResponse: stmt.result?.response ?? null,
      resultCompletion: stmt.result?.completion != null ? String(stmt.result.completion) : null,
      contextPlatform: stmt.context?.platform ?? null,
      raw: stmt,
    });

    res.status(204).end();
  } catch (err) {
    console.error("[xapi] POST error:", err);
    res.status(500).json({ error: "Failed to store xAPI statement" });
  }
});

router.get("/xapi/session/:sessionId", async (req, res) => {
  try {
    const statements = await db
      .select()
      .from(xapiStatementsTable)
      .where(eq(xapiStatementsTable.sessionId, req.params.sessionId))
      .orderBy(desc(xapiStatementsTable.timestamp));
    res.json({ statements });
  } catch (err) {
    console.error("[xapi] GET session error:", err);
    res.status(500).json({ error: "Failed to fetch statements" });
  }
});

export default router;
