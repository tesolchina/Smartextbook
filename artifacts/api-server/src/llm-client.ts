import OpenAI from "openai";

export interface LlmConfig {
  provider: string;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export const PROVIDER_BASE_URLS: Record<string, string> = {
  openai: "https://api.openai.com/v1",
  gemini: "https://generativelanguage.googleapis.com/v1beta/openai",
  deepseek: "https://api.deepseek.com/v1",
  openrouter: "https://openrouter.ai/api/v1",
  minimax: "https://api.minimaxi.chat/v1",
  groq: "https://api.groq.com/openai/v1",
  mistral: "https://api.mistral.ai/v1",
  togetherai: "https://api.together.xyz/v1",
};

export function createLLMClient(config: LlmConfig): OpenAI {
  const baseURL = config.baseUrl || PROVIDER_BASE_URLS[config.provider.toLowerCase()];

  if (!baseURL) {
    throw new Error(`Unknown provider "${config.provider}" and no custom baseUrl provided.`);
  }

  return new OpenAI({
    apiKey: config.apiKey,
    baseURL,
  });
}
