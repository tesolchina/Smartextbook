import { Router, type IRouter } from "express";

const router: IRouter = Router();

const SECRET_CODE = "IEEE2026";

router.post("/ai-tutor", async (req, res): Promise<void> => {
  const { messages, code } = req.body as {
    messages?: { role: string; content: string }[];
    code?: string;
  };

  if (code !== SECRET_CODE) {
    res.status(403).json({ error: "Invalid access code." });
    return;
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array is required." });
    return;
  }

  // Prefer DeepSeek if configured (accessible from HK/mainland), fall back to Replit AI proxy
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const useDeepSeek = !!deepseekKey;

  const baseUrl = useDeepSeek
    ? "https://api.deepseek.com/v1"
    : process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = useDeepSeek
    ? deepseekKey
    : process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  const model = useDeepSeek ? "deepseek-chat" : "gpt-5.1";

  if (!baseUrl || !apiKey) {
    res.status(503).json({ error: "AI integration not configured." });
    return;
  }

  try {
    const body: Record<string, unknown> = { model, messages };
    if (useDeepSeek) {
      body.max_tokens = 400;
      body.temperature = 0.5;
    } else {
      body.max_completion_tokens = 400;
    }

    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = (await upstream.json()) as {
      choices?: { message?: { content?: string } }[];
      error?: { message?: string };
    };

    if (!upstream.ok) {
      res
        .status(upstream.status)
        .json({ error: data.error?.message ?? "Upstream error" });
      return;
    }

    const reply = data.choices?.[0]?.message?.content?.trim() ?? "";
    res.json({ reply });
  } catch (err) {
    req.log.error({ err }, "ai-tutor proxy error");
    res.status(500).json({ error: "AI request failed." });
  }
});

export default router;
