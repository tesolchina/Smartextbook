import OpenAI from "openai";

export interface LlmConfig {
  provider: string;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

const PROVIDER_BASE_URLS: Record<string, string> = {
  openai: "https://api.openai.com/v1",
  gemini: "https://generativelanguage.googleapis.com/v1beta/openai/",
  deepseek: "https://api.deepseek.com/v1",
  openrouter: "https://openrouter.ai/api/v1",
  minimax: "https://api.minimax.chat/v1",
  grok: "https://api.x.ai/v1",
  mistral: "https://api.mistral.ai/v1",
  together: "https://api.together.xyz/v1",
};

export function createLLMClient(config: LlmConfig): { client: OpenAI; model: string } {
  let baseURL: string;

  if (config.provider === "custom") {
    if (!config.baseUrl) {
      throw new Error("A base URL is required for custom provider");
    }
    baseURL = config.baseUrl;
  } else {
    const resolved = PROVIDER_BASE_URLS[config.provider];
    if (!resolved) {
      throw new Error(`Unknown provider: ${config.provider}. Use one of: ${Object.keys(PROVIDER_BASE_URLS).join(", ")}, or custom`);
    }
    baseURL = resolved;
  }

  const client = new OpenAI({
    apiKey: config.apiKey,
    baseURL,
    defaultHeaders:
      config.provider === "openrouter"
        ? { "HTTP-Referer": "https://lessonbuilder.app", "X-Title": "LessonBuilder" }
        : undefined,
  });

  return { client, model: config.model };
}
