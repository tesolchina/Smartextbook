export interface PoeMessage {
  role: "user" | "bot" | "system";
  content: string;
}

export interface PoeClientError extends Error {
  statusCode?: number;
}

const POE_API = "https://api.poe.com/bot";

function makeError(message: string, statusCode?: number): PoeClientError {
  const err = new Error(message) as PoeClientError;
  err.statusCode = statusCode;
  return err;
}

export async function queryPoe(
  botName: string,
  apiKey: string,
  messages: PoeMessage[]
): Promise<string> {
  const res = await fetch(`${POE_API}/${encodeURIComponent(botName)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      version: "1.0",
      type: "query",
      query: messages.map((m) => ({
        role: m.role,
        content: m.content,
        content_type: "text/markdown",
        timestamp: 0,
        message_id: "",
        feedback: [],
        attachments: [],
      })),
      user_id: "",
      conversation_id: "",
      message_id: "",
    }),
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body?.detail ?? body?.error ?? body?.message ?? detail;
    } catch {
      try {
        const text = await res.text();
        if (text) detail = text.slice(0, 200);
      } catch {}
    }
    throw makeError(`Poe API error: ${detail}`, res.status);
  }

  const text = await res.text();
  const result = parseSseText(text);

  if (!result) {
    throw makeError("Poe returned an empty response. Check the bot name and your API key.");
  }

  return result;
}

function parseSseText(raw: string): string {
  const lines = raw.split("\n");
  let result = "";
  let pendingEventType: string | null = null;

  for (const line of lines) {
    if (line.startsWith("event:")) {
      pendingEventType = line.slice(6).trim();
      continue;
    }

    if (line.trim() === "") {
      pendingEventType = null;
      continue;
    }

    if (!line.startsWith("data:")) continue;

    const jsonStr = line.slice(5).trim();
    if (!jsonStr || jsonStr === "[DONE]") continue;

    let event: { text?: string; type?: string; error?: string; allow_retry?: boolean };
    try {
      event = JSON.parse(jsonStr);
    } catch {
      continue;
    }

    const eventType = pendingEventType ?? event.type;

    if (eventType === "error") {
      throw makeError(
        `Poe error: ${event.text ?? event.error ?? "unknown error"}`,
        500
      );
    }

    if (eventType === "text" && typeof event.text === "string") {
      result += event.text;
    }

    if (eventType === "replace_response" && typeof event.text === "string") {
      result = event.text;
    }
  }

  return result.trim();
}
