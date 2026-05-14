# SmartTextbook SKILL-02 — 服务器端 AI 代理 + 访问码机制

**项目**: SmartTextbook v1.0.0 · github.com/tesolchina/Smartextbook
**适用场景**: 工作坊/演示/教育场景——参与者无需个人 API key，用统一 access code 访问服务器端 AI

---

## 核心思路

当 `apiKey === "IEEE2026"`（或任意预设 access code）时，服务端**拦截**请求，改用自己的 AI 凭证（Replit AI 集成代理 / DeepSeek）来完成 AI 调用。参与者零配置，主办方承担 AI 费用。

---

## 代码位置（SmartTextbook 仓库）

| 文件 | 作用 |
|------|------|
| `artifacts/api-server/src/routes/ai-tutor.ts` | Demo AI 导师端点（仅接受 access code）|
| `artifacts/api-server/src/routes/generate-lesson.ts` | 课程生成端点（BYOK + IEEE2026 双模式）|
| `artifacts/lesson-builder/src/components/settings-modal.tsx` | 前端"Use IEEE2026"快捷填充按钮 |
| `artifacts/lesson-builder/public/listening-demo.html` | Demo 页面中的 AI tutor 面板 |
| `artifacts/lesson-builder/public/style-congruency-demo.html` | Demo 页面中的 AI tutor 面板 |

---

## 核心实现（ai-tutor.ts）

```typescript
const SECRET_CODE = "IEEE2026";  // 可改为任意 access code

router.post("/ai-tutor", async (req, res): Promise<void> => {
  const { messages, code } = req.body;

  // 访问码验证
  if (code !== SECRET_CODE) {
    res.status(403).json({ error: "Invalid access code." });
    return;
  }

  // 优先用 DeepSeek（HK 可直连），回退到 Replit AI proxy
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = deepseekKey
    ? "https://api.deepseek.com/v1"
    : process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;   // Replit 自动注入
  const apiKey = deepseekKey
    ? deepseekKey
    : process.env.AI_INTEGRATIONS_OPENAI_API_KEY;    // Replit 自动注入
  const model = deepseekKey ? "deepseek-chat" : "gpt-5.1";

  // 调用上游 AI（非流式，适合 demo 场景）
  const upstream = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, max_tokens: 400 }),
  });
  // ...
});
```

---

## Replit AI Integration 配置方式

在 Replit 项目中：
1. 侧边栏 → Integrations → 搜索 "OpenAI" → Connect
2. Replit 自动注入两个环境变量：
   - `AI_INTEGRATIONS_OPENAI_BASE_URL`
   - `AI_INTEGRATIONS_OPENAI_API_KEY`
3. 代码中直接用 `process.env.AI_INTEGRATIONS_OPENAI_BASE_URL` 即可

**注意**: 这两个变量是 Replit 平台管理的，不需要手动设置，也不会在 Secrets 面板中可见。

---

## 双模式生成端点模式（generate-lesson.ts）

```typescript
// 在 BYOK 路由中插入 IEEE2026 检测
const isIEEECode = llmConfig.apiKey === "IEEE2026";

if (isIEEECode) {
  // 用服务器端凭证
  client = createIEEEClient();  // DeepSeek 或 Replit AI proxy
} else {
  // 用用户的 BYOK key
  const result = createLLMClient(llmConfig);
  client = result.client;
}
```

---

## 前端 UI 模式（settings-modal.tsx）

```tsx
<Button onClick={() => {
  setProvider("openai");
  setApiKey("IEEE2026");
  setModel("gpt-4o");
}} variant="outline" className="border-green-500">
  <Zap className="h-4 w-4 mr-1" />
  Use IEEE2026 (No key needed)
</Button>
{apiKey === "IEEE2026" && (
  <Badge className="bg-green-100 text-green-700">
    Server-side compute — no personal key required
  </Badge>
)}
```

---

## 移植建议

- access code 可改为任意字符串（甚至多个 code 映射不同额度/模型）
- 可加 rate limiting（每 IP 每天 N 次）防止滥用
- 可加 code 有效期（数据库存 code 的 expiresAt）
- 适合：在线教育、研讨会演示、内测、教师账户
