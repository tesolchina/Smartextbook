# SmartTextbook SKILL-04 — SHA-256 防篡改证书生成

**项目**: SmartTextbook v1.0.0 · github.com/tesolchina/Smartextbook
**适用场景**: 课程完成证书、成就徽章、培训认证——需要防伪的可验证证书

---

## 核心思路

证书颁发时，把所有关键字段（课程、学员、成绩、日期）做 SHA-256 哈希，存入数据库。任何人持有证书 ID 都可以通过 API 验证其真实性——哈希不匹配则证书被篡改。

---

## 代码位置（SmartTextbook 仓库）

| 文件 | 作用 |
|------|------|
| `artifacts/api-server/src/routes/certificates.ts` | 证书颁发 + 查询 API |
| `lib/db/src/schema/certificates.ts` | 数据库表结构 |
| `artifacts/lesson-builder/public/listening-demo.html` | 前端证书申请 + 展示 UI |
| `artifacts/lesson-builder/public/style-congruency-demo.html` | 前端证书申请 + 展示 UI（含 closeCert() 修复）|

---

## 颁发流程

```typescript
// artifacts/api-server/src/routes/certificates.ts

POST /api/demo-cert   // 颁发
GET  /api/demo-cert/:id  // 查询

// 颁发逻辑要点：
// 1. 验证所有 lessonId 的成绩均达到 passScore
// 2. 计算平均分
// 3. 构造防篡改哈希
const contentHashInput = JSON.stringify({
  courseId,
  courseTitle: course.title,
  teacherName: course.teacherName,
  lessonTitles: lessons.map(l => l.title).sort(),  // sort() 保证顺序无关
  learnerName,
  learnerKey,
  scores,
  overallScore,
  issuedAt: new Date().toISOString().slice(0, 10),  // 只取日期部分
});
const contentHash = createHash("sha256").update(contentHashInput).digest("hex");

// 4. 存库（UUID 作为公开 ID）
const id = randomUUID();
await db.insert(certificatesTable).values({ id, contentHash, ...rest });
res.json({ id, contentHash });
```

---

## 数据库表结构

```typescript
// lib/db/src/schema/certificates.ts
export const certificatesTable = pgTable("certificates", {
  id:           uuid("id").primaryKey(),
  courseId:     text("course_id").notNull(),
  courseTitle:  text("course_title").notNull(),
  teacherName:  text("teacher_name").notNull(),
  learnerName:  text("learner_name").notNull(),
  learnerKey:   text("learner_key").notNull(),   // 学员自设密语，用于区分同名者
  scores:       jsonb("scores").notNull(),        // { lessonId: score% }
  overallScore: integer("overall_score").notNull(),
  contentHash:  text("content_hash").notNull(),  // SHA-256
  issuedAt:     timestamp("issued_at").defaultNow(),
});
```

---

## 前端证书模态框模式（HTML demo）

```javascript
// 关键修复：背景点击关闭 vs 内容点击不关闭（stopPropagation）
function closeCert() {
  document.getElementById('cert-modal').classList.add('hidden');
}
// HTML:
// <div id="cert-modal" onclick="closeCert()">           ← 点背景关闭
//   <div class="cert-inner" onclick="event.stopPropagation()">  ← 点内容不关闭
//     <button onclick="closeCert()">✕</button>
//   </div>
// </div>

async function claimCertificate() {
  const resp = await fetch('/api/demo-cert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ learnerName, scores, courseId })
  });
  const { id } = await resp.json();
  // 展示证书，显示验证链接
  document.getElementById('cert-link').href = `/api/demo-cert/${id}`;
}
```

---

## 证书验证 API 响应

```json
{
  "cert": {
    "id": "uuid-here",
    "learnerName": "张三",
    "courseTitle": "Listening as an Engineering Skill",
    "overallScore": 85,
    "issuedAt": "2026-07-12T...",
    "contentHash": "sha256-hash-here"
  },
  "course": { ... },
  "lessons": [ { "id": "...", "title": "..." } ]
}
```

---

## 移植建议

- `learnerKey`（自设密语）解决同名学员区分问题，比要求登录更轻量
- `contentHash` 字段可以打印在证书 PDF 上，供人工比对验证
- 可添加证书有效期（`expiresAt` 字段）
- 可用 QR Code 指向 `GET /api/demo-cert/:id` 实现扫码验证
