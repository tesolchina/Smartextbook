import { Router, type IRouter } from "express";
import { createLLMClient } from "../lib/llm-client";
import { queryPoe } from "../lib/poe-client";

const router: IRouter = Router();

router.post("/test-provider", async (req, res): Promise<void> => {
  const { provider, apiKey, model, baseUrl } = req.body ?? {};

  if (!provider || !apiKey || !model) {
    res.status(400).json({ ok: false, error: "Missing provider, apiKey, or model." });
    return;
  }

  try {
    if (provider === "poe") {
      await queryPoe(model, apiKey, [{ role: "user", content: "Say OK." }]);
      res.json({ ok: true });
      return;
    }

    const { client, model: resolvedModel } = createLLMClient({
      provider,
      apiKey,
      model,
      baseUrl,
    });

    await client.chat.completions.create({
      model: resolvedModel,
      messages: [{ role: "user", content: "Say OK." }],
      max_tokens: 5,
    });

    res.json({ ok: true });
  } catch (err: any) {
    const message = err?.message ?? "Connection failed";
    res.status(200).json({ ok: false, error: message });
  }
});

export default router;
