# SmartTextbook SKILL-06 — SSE 流式 AI 对话（打字机效果）

**项目**: SmartTextbook v1.0.0 · github.com/tesolchina/Smartextbook
**适用场景**: 任何需要实时流式输出 AI 回复的应用（聊天机器人、AI 导师、写作助手）

---

## 核心思路

用 Server-Sent Events（SSE）把 AI 的流式 token 逐字推送给前端，前端用 `ReadableStream` 消费，实现打字机效果。SSE 比 WebSocket 更简单，只需普通 HTTP，适合 AI 流式输出场景。

---

## 代码位置（SmartTextbook 仓库）

| 文件 | 作用 |
|------|------|
| `artifacts/api-server/src/routes/chat.ts` | 服务端 SSE 流式 chat 端点 |
| `artifacts/lesson-builder/src/hooks/use-chat.ts` | 前端消费 SSE 流的 React hook |
| `artifacts/lesson-builder/src/components/chat-sidebar.tsx` | UI：聊天侧边栏 |

---

## 服务端实现

```typescript
// artifacts/api-server/src/routes/chat.ts

router.post("/chat", async (req, res): Promise<void> => {
  const { message, history, lessonContext, llmConfig } = req.body;

  // ① 设置 SSE 响应头
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // ② 创建 LLM 客户端（BYOK 工厂）
  const { client, model } = createLLMClient(llmConfig);

  // ③ 发起流式请求
  const stream = await client.chat.completions.create({
    model,
    messages: [...history, { role: "user", content: message }],
    stream: true,   // ← 关键
  });

  // ④ 逐 chunk 推送
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
    }
  }

  // ⑤ 发送结束信号
  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
});
```

**SSE 数据格式**: 每条消息格式为 `data: <json>\n\n`，前端解析 `content` 字段累加文字。

---

## 前端消费（React Hook）

```typescript
// artifacts/lesson-builder/src/hooks/use-chat.ts（简化版）

async function sendMessage(userMessage: string) {
  setIsStreaming(true);
  let accumulated = "";

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: abortRef.current?.signal,  // 支持取消
    body: JSON.stringify({ message: userMessage, history, lessonContext, llmConfig }),
  });

  // 消费 ReadableStream
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);
    // 解析 SSE 格式（可能一次收到多条）
    const lines = text.split("\n");
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const json = JSON.parse(line.slice(6));
      if (json.done) { setIsStreaming(false); return; }
      if (json.content) {
        accumulated += json.content;
        setStreamingContent(accumulated);  // 实时更新 UI
      }
    }
  }
}
```

---

## 无状态设计（重要）

SmartTextbook 的 chat 是**完全无状态**的：
- 每次请求都带完整 `history`（消息历史）和 `lessonContext`（课文内容）
- 服务端不存储任何会话状态
- 优点：可水平扩展，无需 session store
- 缺点：消息历史过长会消耗 token（可在前端截断最近 N 条）

---

## 系统提示词模式（AI 导师）

```typescript
const systemPrompt = `你是 ${lessonContext.title} 的 AI 导师。
课文摘要：${lessonContext.summary}
关键概念：${conceptsList}
课文内容（前4000字）：${lessonContext.chapterText.slice(0, 4000)}
请根据课文内容回答学生问题，不相关问题请引导回课文。`;
```

---

## 移植建议

- 服务端改动只需把 `createLLMClient()` 替换为你的 AI 客户端
- 前端 hook 可直接复用（只改 endpoint URL 和 request body 结构）
- 如需支持图片、文件等多模态输入，在 `messages` 中加 `content` 数组格式
- Abort 信号实现：`const ctrl = new AbortController()` + `ctrl.abort()` 即可中断
