import { Router, type IRouter } from "express";
import { createLLMClient, PROVIDER_BASE_URLS } from "../lib/llm-client";

const router: IRouter = Router();

router.post("/test-connection", async (req, res): Promise<void> => {
  const { provider, apiKey, model, baseUrl } = req.body ?? {};

  if (!provider || !apiKey || !model) {
    res.status(400).json({ ok: false, error: "provider, apiKey, and model are required." });
    return;
  }

  try {
    const { client, model: resolvedModel } = createLLMClient({
      provider,
      apiKey,
      model,
      baseUrl,
    });

    await client.chat.completions.create({
      model: resolvedModel,
      messages: [{ role: "user", content: "Say OK." }],
      max_tokens: 10,
    });

    res.json({ ok: true });
  } catch (sdkErr: any) {
    // The OpenAI SDK cannot parse some providers' non-standard error bodies
    // (e.g. Gemini wraps errors in an array: [{error:{...}}]).
    // Fall back to a raw fetch so we can surface the real provider error message.
    try {
      const base = provider === "custom"
        ? baseUrl
        : PROVIDER_BASE_URLS[provider];

      if (base) {
        const endpoint = base.replace(/\/?$/, "/") + "chat/completions";
        const rawRes = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: "Say OK." }],
            max_tokens: 10,
          }),
        });

        const text = await rawRes.text();
        let parsed: any;
        try { parsed = JSON.parse(text); } catch { /* non-JSON body */ }

        // Handle array-wrapped format (Gemini) and standard object format
        const body = Array.isArray(parsed) ? parsed[0] : parsed;
        const providerMsg = body?.error?.message;
        if (providerMsg) {
          res.status(400).json({ ok: false, error: providerMsg });
          return;
        }
      }
    } catch {
      // ignore fallback errors — return original SDK error below
    }

    const message =
      sdkErr?.error?.message ||
      sdkErr?.cause?.message ||
      sdkErr?.message ||
      "Connection failed";
    const status = sdkErr?.status ?? sdkErr?.response?.status;
    const detail = status ? ` (HTTP ${status})` : "";
    res.status(400).json({ ok: false, error: message + detail });
  }
});

export default router;
