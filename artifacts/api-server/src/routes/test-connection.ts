import { Router, type IRouter } from "express";
import { createLLMClient, PROVIDER_BASE_URLS } from "../lib/llm-client";

const router: IRouter = Router();

interface ProviderErrorBody {
  error?: { message?: string };
}

function extractSdkMessage(err: unknown): string {
  if (err instanceof Error) {
    const e = err as Error & {
      status?: number;
      response?: { status?: number };
      error?: { message?: string };
      cause?: { message?: string };
    };
    const msg =
      e.error?.message ??
      e.cause?.message ??
      e.message ??
      "Connection failed";
    const status = e.status ?? e.response?.status;
    return status ? `${msg} (HTTP ${status})` : msg;
  }
  return "Connection failed";
}

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
  } catch (sdkErr: unknown) {
    // The OpenAI SDK cannot parse some providers' non-standard error bodies
    // (e.g. Gemini wraps errors in an array: [{error:{...}}]).
    // Fall back to a raw fetch so we can surface the real provider error message.
    try {
      const base = provider === "custom"
        ? (baseUrl as string | undefined)
        : PROVIDER_BASE_URLS[provider as string];

      if (base) {
        const endpoint = base.replace(/\/?$/, "/") + "chat/completions";
        const rawRes = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey as string}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: "Say OK." }],
            max_tokens: 10,
          }),
        });

        const text = await rawRes.text();
        let parsed: unknown;
        try { parsed = JSON.parse(text); } catch { /* non-JSON body */ }

        // Handle array-wrapped format (Gemini) and standard object format
        const body = (Array.isArray(parsed) ? parsed[0] : parsed) as ProviderErrorBody | undefined;
        const providerMsg = body?.error?.message;
        if (providerMsg) {
          res.status(400).json({ ok: false, error: providerMsg });
          return;
        }
      }
    } catch {
      // ignore fallback errors — return original SDK error below
    }

    res.status(400).json({ ok: false, error: extractSdkMessage(sdkErr) });
  }
});

export default router;
