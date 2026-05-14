# SmartTextbook SKILL-03 — xAPI 学习行为追踪

**项目**: SmartTextbook v1.0.0 · github.com/tesolchina/Smartextbook
**适用场景**: EdTech 平台、在线课程、互动演示——记录学习者行为用于分析和研究

---

## 什么是 xAPI（Experience API / Tin Can API）

xAPI 是 e-learning 行业标准格式，用"Actor 做了 Verb 于 Object，结果是 Result"的结构记录任何学习行为。

**典型 statement**:
```json
{
  "actor": { "name": "张三", "mbox": "mailto:zhang@example.com" },
  "verb": { "id": "http://adlnet.gov/expapi/verbs/answered" },
  "object": { "id": "quiz-q1", "definition": { "name": { "en-US": "Quiz Question 1" } } },
  "result": { "success": true, "score": { "scaled": 0.8, "raw": 4, "max": 5 } }
}
```

---

## 代码位置（SmartTextbook 仓库）

| 文件 | 作用 |
|------|------|
| `artifacts/api-server/src/routes/xapi.ts` | xAPI 存储/检索 API |
| `lib/db/src/schema/xapi-statements.ts` | 数据库表结构 |
| `artifacts/lesson-builder/public/listening-demo.html` | 前端发送 xAPI 示例（inline JS）|
| `artifacts/lesson-builder/public/style-congruency-demo.html` | 前端发送 xAPI 示例 |

---

## 数据库表结构（Drizzle ORM）

```typescript
// lib/db/src/schema/xapi-statements.ts
export const xapiStatementsTable = pgTable("xapi_statements", {
  id:               serial("id").primaryKey(),
  sessionId:        text("session_id"),           // 匿名会话 ID
  actorName:        text("actor_name"),
  actorEmail:       text("actor_email"),           // 存前应哈希化（隐私保护）
  verb:             text("verb").notNull(),        // adlnet verb URL
  objectId:         text("object_id").notNull(),
  objectName:       text("object_name"),
  resultSuccess:    text("result_success"),        // "true" / "false"
  resultScore:      integer("result_score"),       // 0-100
  resultMaxScore:   integer("result_max_score"),
  resultResponse:   text("result_response"),
  resultCompletion: text("result_completion"),
  contextPlatform:  text("context_platform"),
  raw:              jsonb("raw"),                  // 完整原始 statement
  timestamp:        timestamp("timestamp").defaultNow(),
});
```

---

## API 端点

```typescript
// artifacts/api-server/src/routes/xapi.ts
POST /api/xapi           // 存储一条 statement（返回 204）
GET  /api/xapi/session/:sessionId  // 检索某会话所有 statements
```

---

## 前端发送示例（HTML demo 中的 vanilla JS）

```javascript
async function sendXAPIStatement(verb, objectId, objectName, result = {}) {
  const sessionId = localStorage.getItem('sessionId') || crypto.randomUUID();
  localStorage.setItem('sessionId', sessionId);

  const stmt = {
    actor: {
      name: participantName || "Anonymous",
      mbox: `mailto:anonymous@demo`
    },
    verb: {
      id: `http://adlnet.gov/expapi/verbs/${verb}`,
      display: { "en-US": verb }
    },
    object: {
      id: objectId,
      definition: { name: { "en-US": objectName } }
    },
    result,
    context: {
      platform: "SmartTextbook",
      extensions: { sessionId }
    }
  };

  await fetch('/api/xapi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stmt)
  });
}

// 使用示例
sendXAPIStatement('answered', 'quiz-q1', 'Q1: Active Listening', {
  success: true,
  score: { scaled: 1.0, raw: 1, max: 1 },
  response: 'option_b'
});
```

---

## 研究数据用途

SmartTextbook 用 xAPI 数据支撑以下研究设计：
- RQ1: 学习效果（xAPI 答题正确率 vs PDF 对照组）
- RQ3: xAPI 数据价值（描述性分析：完成率、常见错误、停留时长）

**隐私保护**: 用 `crypto.randomUUID()` 作 sessionId，actor email 存匿名值，不收集 PII。

---

## 移植建议

1. 复制 `xapi.ts` 路由和数据库 schema
2. 在 Drizzle migration 中运行 `push`
3. 前端按需发送 statements（建议封装为 `sendStatement(verb, objectId, result)` 函数）
4. 常用 verb：`experienced` / `answered` / `completed` / `passed` / `failed`
5. 可用 LRS（Learning Record Store）如 SCORM Cloud 替换自建数据库
