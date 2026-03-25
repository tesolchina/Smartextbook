import { Router, type IRouter } from "express";
import { createLLMClient, PROVIDER_BASE_URLS } from "../llm-client.js";

const router: IRouter = Router();

router.post("/test-connection", async (req, res): Promise<void> => {
  const body = req.body as Record<string, unknown>;
  const provider = typeof body.provider === "string" ? body.provider : "";
  const apiKey = typeof body.apiKey === "string" ? body.apiKey : "";
  const model = typeof body.model === "string" ? body.model : "";
  const baseUrl = typeof body.baseUrl === "string" ? body.baseUrl : undefined;

  if (!provider || !apiKey || !model) {
    res.status(400).json({ error: "provider, apiKey, and model are required" });
    return;
  }

  if (!apiKey.trim()) {
    res.status(400).json({ error: "API key is required" });
    return;
  }

  if (provider !== "custom" && !PROVIDER_BASE_URLS[provider.toLowerCase()]) {
    res.status(400).json({ error: `Unknown provider: ${provider}` });
    return;
  }

  if (provider === "custom" && !baseUrl?.trim()) {
    res.status(400).json({ error: "Base URL is required for custom provider" });
    return;
  }

  try {
    const client = createLLMClient({ provider, apiKey, model, baseUrl });

    await client.chat.completions.create({
      model,
      max_tokens: 5,
      messages: [{ role: "user", content: "Hi" }],
    });

    res.json({ success: true });
  } catch (err: any) {
    const message =
      err?.error?.message ||
      err?.message ||
      "Connection failed";
    res.status(400).json({ error: message });
  }
});

export default router;
