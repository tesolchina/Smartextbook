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
        role: m.role === "bot" ? "bot" : m.role,
        content: m.content,
      })),
    }),
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body?.detail ?? body?.error ?? detail;
    } catch {}
    throw makeError(`Poe API error: ${detail}`, res.status);
  }

  const text = await res.text();
  return parseSseText(text);
}

function parseSseText(raw: string): string {
  const lines = raw.split("\n");
  let result = "";

  for (const line of lines) {
    if (!line.startsWith("data:")) continue;
    const jsonStr = line.slice(5).trim();
    if (!jsonStr || jsonStr === "[DONE]") continue;

    try {
      const event = JSON.parse(jsonStr) as { text?: string; type?: string; error?: string };

      if (event.type === "error") {
        throw makeError(event.error ?? "Poe returned an error");
      }
      if (event.type === "text" && typeof event.text === "string") {
        result += event.text;
      }
      if (event.type === "replace_response" && typeof event.text === "string") {
        result = event.text;
      }
    } catch (err) {
      if ((err as PoeClientError).statusCode !== undefined) throw err;
    }
  }

  return result.trim();
}
