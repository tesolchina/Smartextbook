# SmartTextbook SKILL-01 — BYOK 多 LLM 提供商工厂

**项目**: SmartTextbook v1.0.0 · github.com/tesolchina/Smartextbook
**适用场景**: 任何需要用户自带 API key、支持多个 AI 提供商的应用

---

## 核心思路

用单一 OpenAI SDK 实例统一调用所有主流 LLM 提供商——因为大多数提供商都提供 OpenAI 兼容的 REST API。用户在前端填入自己的 API key，key 只存在浏览器 localStorage，**永远不经过我们的服务器**（除非使用特殊 access code）。

---

## 代码位置（SmartTextbook 仓库）

| 文件 | 作用 |
|------|------|
| `artifacts/api-server/src/lib/llm-client.ts` | 核心工厂函数 `createLLMClient()` |
| `artifacts/lesson-builder/src/lib/providers.ts` | 前端提供商列表定义（名称、logo、默认 model）|
| `artifacts/lesson-builder/src/hooks/use-settings.ts` | localStorage 管理 hook |
| `artifacts/lesson-builder/src/components/settings-modal.tsx` | 用户设置 UI（provider 选择 + key 输入）|
| `artifacts/api-server/src/routes/chat.ts` | 服务端调用示例（SSE chat）|
| `artifacts/api-server/src/routes/generate-lesson.ts` | 服务端调用示例（同步 generation）|

---

## 核心实现

```typescript
// artifacts/api-server/src/lib/llm-client.ts

export interface LlmConfig {
  provider: string;   // "openai" | "gemini" | "deepseek" | "openrouter" | ...
  apiKey: string;     // 用户的个人 key，或特殊 access code
  model: string;      // 模型名，如 "gpt-4o" / "gemini-2.0-flash"
  baseUrl?: string;   // 仅 custom provider 需要
}

export const PROVIDER_BASE_URLS: Record<string, string> = {
  openai:      "https://api.openai.com/v1",
  gemini:      "https://generativelanguage.googleapis.com/v1beta/openai/",
  deepseek:    "https://api.deepseek.com/v1",         // ✓ HK/大陆可访问
  openrouter:  "https://openrouter.ai/api/v1",
  minimax:     "https://api.minimax.chat/v1",
  grok:        "https://api.x.ai/v1",
  mistral:     "https://api.mistral.ai/v1",
  together:    "https://api.together.xyz/v1",
  poe:         "https://api.poe.com/v1",
  kimi:        "https://api.moonshot.cn/v1",          // ✓ HK/大陆可访问
};

export function createLLMClient(config: LlmConfig) {
  const baseURL = config.provider === "custom"
    ? config.baseUrl!
    : PROVIDER_BASE_URLS[config.provider];

  const client = new OpenAI({
    apiKey: config.apiKey,
    baseURL,
    defaultHeaders: config.provider === "openrouter"
      ? { "HTTP-Referer": "https://yourapp.com", "X-Title": "YourApp" }
      : undefined,
  });

  return { client, model: config.model };
}
```

---

## HK/大陆访问注意事项

前端提供商下拉排序建议（SmartTextbook 的实践）：
1. **DeepSeek** ✓ HK 可直连 — 推荐首选
2. **Gemini** ✓ HK 可直连
3. **Kimi (Moonshot)** ✓ 大陆可直连
4. **MiniMax** ✓ 大陆可直连
5. OpenAI / Grok — 需要 VPN

---

## 移植到新项目的步骤

1. 复制 `llm-client.ts` 到新项目的 `src/lib/`
2. 在 `package.json` 添加 `openai` 依赖
3. 在前端决定如何收集用户的 `LlmConfig`（localStorage / form）
4. 调用时直接 `const { client, model } = createLLMClient(config)`
5. 用标准 OpenAI SDK API 发请求（`client.chat.completions.create(...)`)

---

## 前端 BYOK 数据流

```
用户填 key → localStorage → 请求时附带 llmConfig → 服务端 createLLMClient() → AI 调用
                                                     ↑
                                          key 只在这一次请求中传输
                                          服务端不持久化 key
```
