export interface ProviderModel {
  id: string;
  name: string;
}

export interface Provider {
  id: string;
  name: string;
  baseUrl: string;
  models: ProviderModel[];
  keyPlaceholder: string;
  keyHint: string;
  docsUrl: string;
}

export const PROVIDERS: Provider[] = [
  {
    id: "openai",
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    keyPlaceholder: "sk-...",
    keyHint: "Find your API key at platform.openai.com/api-keys",
    docsUrl: "https://platform.openai.com/api-keys",
    models: [
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
      { id: "o1", name: "o1" },
      { id: "o1-mini", name: "o1-mini" },
      { id: "o3-mini", name: "o3-mini" },
    ],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/",
    keyPlaceholder: "AIza...",
    keyHint: "Find your API key at aistudio.google.com/apikey",
    docsUrl: "https://aistudio.google.com/apikey",
    models: [
      { id: "gemini-2.5-pro-preview-03-25", name: "Gemini 2.5 Pro Preview (latest)" },
      { id: "gemini-2.0-flash",             name: "Gemini 2.0 Flash" },
      { id: "gemini-2.0-flash-lite",        name: "Gemini 2.0 Flash Lite" },
      { id: "gemini-1.5-pro",               name: "Gemini 1.5 Pro" },
      { id: "gemini-1.5-flash",             name: "Gemini 1.5 Flash" },
      { id: "gemini-1.5-flash-8b",          name: "Gemini 1.5 Flash 8B" },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    keyPlaceholder: "sk-...",
    keyHint: "Find your API key at platform.deepseek.com/api_keys",
    docsUrl: "https://platform.deepseek.com/api_keys",
    models: [
      { id: "deepseek-chat", name: "DeepSeek Chat (V3)" },
      { id: "deepseek-reasoner", name: "DeepSeek Reasoner (R1)" },
    ],
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    keyPlaceholder: "sk-or-...",
    keyHint: "Access 300+ models via one key. Get yours at openrouter.ai/keys",
    docsUrl: "https://openrouter.ai/keys",
    models: [
      { id: "anthropic/claude-sonnet-4-5", name: "Claude Sonnet 4.5" },
      { id: "anthropic/claude-3.5-haiku", name: "Claude 3.5 Haiku" },
      { id: "openai/gpt-4o", name: "GPT-4o" },
      { id: "google/gemini-2.0-flash-001", name: "Gemini 2.0 Flash" },
      { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B" },
      { id: "mistralai/mistral-large", name: "Mistral Large" },
      { id: "deepseek/deepseek-chat", name: "DeepSeek Chat" },
      { id: "qwen/qwen-2.5-72b-instruct", name: "Qwen 2.5 72B" },
    ],
  },
  {
    id: "grok",
    name: "Grok (xAI)",
    baseUrl: "https://api.x.ai/v1",
    keyPlaceholder: "xai-...",
    keyHint: "Find your API key at console.x.ai",
    docsUrl: "https://console.x.ai/",
    models: [
      { id: "grok-3", name: "Grok 3" },
      { id: "grok-3-mini", name: "Grok 3 Mini" },
      { id: "grok-2", name: "Grok 2" },
      { id: "grok-2-mini", name: "Grok 2 Mini" },
      { id: "grok-beta", name: "Grok Beta" },
    ],
  },
  {
    id: "mistral",
    name: "Mistral AI",
    baseUrl: "https://api.mistral.ai/v1",
    keyPlaceholder: "...",
    keyHint: "Find your API key at console.mistral.ai/api-keys",
    docsUrl: "https://console.mistral.ai/api-keys",
    models: [
      { id: "mistral-large-latest", name: "Mistral Large" },
      { id: "mistral-small-latest", name: "Mistral Small" },
      { id: "codestral-latest", name: "Codestral" },
      { id: "open-mistral-nemo", name: "Mistral Nemo (Free)" },
    ],
  },
  {
    id: "together",
    name: "Together AI",
    baseUrl: "https://api.together.xyz/v1",
    keyPlaceholder: "...",
    keyHint: "Find your API key at api.together.ai/settings/api-keys",
    docsUrl: "https://api.together.ai/settings/api-keys",
    models: [
      { id: "meta-llama/Llama-3.3-70B-Instruct-Turbo", name: "Llama 3.3 70B Turbo" },
      { id: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", name: "Llama 3.1 8B Turbo" },
      { id: "mistralai/Mixtral-8x7B-Instruct-v0.1", name: "Mixtral 8x7B" },
      { id: "Qwen/Qwen2.5-72B-Instruct-Turbo", name: "Qwen 2.5 72B" },
    ],
  },
  {
    id: "minimax",
    name: "MiniMax",
    baseUrl: "https://api.minimax.chat/v1",
    keyPlaceholder: "...",
    keyHint: "Find your API key at platform.minimaxi.com",
    docsUrl: "https://platform.minimaxi.com",
    models: [
      { id: "MiniMax-Text-01", name: "MiniMax Text 01" },
      { id: "abab6.5s-chat", name: "ABAB 6.5S" },
    ],
  },
  {
    id: "poe",
    name: "Poe (poe.com)",
    baseUrl: "https://api.poe.com/v1",
    keyPlaceholder: "your-poe-api-key",
    keyHint: "Get your API key at poe.com/api_key — requires a Poe subscription",
    docsUrl: "https://poe.com/api_key",
    models: [
      { id: "Claude-3.5-Sonnet", name: "Claude 3.5 Sonnet" },
      { id: "Claude-3-Haiku", name: "Claude 3 Haiku" },
      { id: "GPT-4o", name: "GPT-4o" },
      { id: "GPT-4o-Mini", name: "GPT-4o Mini" },
      { id: "Gemini-2.0-Flash", name: "Gemini 2.0 Flash" },
      { id: "Gemini-1.5-Pro", name: "Gemini 1.5 Pro" },
      { id: "Llama-3.1-70B-T", name: "Llama 3.1 70B" },
    ],
  },
  {
    id: "kimi",
    name: "Kimi (Moonshot AI)",
    baseUrl: "https://api.moonshot.cn/v1",
    keyPlaceholder: "sk-...",
    keyHint: "Find your API key at platform.moonshot.cn — supports Chinese & English",
    docsUrl: "https://platform.moonshot.cn/docs/overview",
    models: [
      { id: "moonshot-v1-8k", name: "Moonshot v1 8K" },
      { id: "moonshot-v1-32k", name: "Moonshot v1 32K" },
      { id: "moonshot-v1-128k", name: "Moonshot v1 128K" },
    ],
  },
  {
    id: "custom",
    name: "Custom (OpenAI-compatible)",
    baseUrl: "",
    keyPlaceholder: "...",
    keyHint: "Any API that follows the OpenAI chat completions format",
    docsUrl: "",
    models: [],
  },
];

export function getProvider(id: string): Provider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
