# SmartTextbook SKILL-05 — 临时内容共享 + 自动过期清理

**项目**: SmartTextbook v1.0.0 · github.com/tesolchina/Smartextbook
**适用场景**: 任何"生成内容→一键分享链接→90天自动过期"的功能

---

## 核心思路

内容主要存在用户浏览器（localStorage），但用户可选择"发布"到服务器获取可分享的公开链接。服务端用 nanoid 生成 16 字符 ID，90 天自动过期，采用概率性后台清理避免每次请求都跑 DELETE。

---

## 代码位置（SmartTextbook 仓库）

| 文件 | 作用 |
|------|------|
| `artifacts/api-server/src/routes/share.ts` | 完整的共享 + 评论 API |
| `lib/db/src/schema/shared-lessons.ts` | 共享内容表 |
| `lib/db/src/schema/comments.ts` | 评论表 |
| `artifacts/lesson-builder/src/components/share-button.tsx` | 前端分享按钮组件 |
| `artifacts/lesson-builder/src/pages/shared-lesson.tsx` | 公开只读共享页面 |

---

## 分享 API

```typescript
POST /api/share               // 创建分享，返回 { shareId, shareUrl, expiresAt }
GET  /api/shared/:id          // 获取共享内容（过期返回 404）
GET  /api/shared/:id/comments // 获取评论列表
POST /api/shared/:id/comments // 发表评论
```

---

## 核心实现亮点

```typescript
// artifacts/api-server/src/routes/share.ts

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

// ① 概率性清理：~2% 的请求触发一次 DELETE 过期记录
//    避免定时任务，保持服务器无状态
if (Math.random() < 0.02) {
  cleanupExpiredShares();  // 后台运行，不 await
}

// ② 共享时生成 URL（正确处理反向代理的 host/proto）
function getOrigin(req: Request): string {
  const forwarded = req.headers["x-forwarded-proto"];
  const proto = typeof forwarded === "string"
    ? forwarded.split(",")[0].trim()
    : req.protocol;
  const host = req.headers["x-forwarded-host"] ?? req.get("host") ?? "localhost";
  return `${proto}://${host}`;
}

router.post("/share", async (req, res) => {
  const shareId = nanoid(16);       // URL 友好的随机 ID
  const expiresAt = new Date(Date.now() + NINETY_DAYS_MS);

  await db.insert(sharedLessonsTable).values({
    id: shareId,
    title: lesson.title,
    lessonData: lesson,   // jsonb 存完整内容
    expiresAt,
  });

  const shareUrl = `${getOrigin(req)}/shared/${shareId}`;
  res.json({ shareId, shareUrl, expiresAt: expiresAt.toISOString() });
});

// ③ 读取时双重检查：数据库查不到 OR 已过期 → 统一返回 404
const [row] = await db.select().from(sharedLessonsTable)
  .where(eq(sharedLessonsTable.id, id)).limit(1);

if (!row || row.expiresAt < new Date()) {
  res.status(404).json({ error: "Shared lesson not found" });
  return;
}
```

---

## 数据库表结构

```typescript
// lib/db/src/schema/shared-lessons.ts
export const sharedLessonsTable = pgTable("shared_lessons", {
  id:         varchar("id", { length: 16 }).primaryKey(),  // nanoid(16)
  title:      text("title").notNull(),
  lessonData: jsonb("lesson_data").notNull(),  // 任意 JSON 内容
  expiresAt:  timestamp("expires_at").notNull(),
  createdAt:  timestamp("created_at").defaultNow(),
});
```

---

## 评论系统（附加功能）

```typescript
// 评论输入验证（防止注入和过长内容）
if (authorName.trim().length === 0 || authorName.trim().length > 80)
  → 400 "authorName must be 1–80 characters"
if (body.trim().length === 0 || body.trim().length > 2000)
  → 400 "body must be 1–2000 characters"
```

---

## 移植建议

- `jsonb` 列可存任何 JSON，高度灵活（替换 `lessonData` 为你的内容类型）
- 过期时长可配置化（环境变量 `SHARE_TTL_DAYS`）
- 如内容量大可考虑只存 ID + 摘要，完整内容存 S3/对象存储
- 评论功能完全可选，删除 `commentsTable` 相关代码即可
- `nanoid(16)` 提供足够的碰撞抵抗力（约 10^29 空间）
