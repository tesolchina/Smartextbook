# SimonSays x Smartextbook 模块化架构

## 两个系统的本质区别

```
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│   智能课本 Smartextbook (内容转化)     │     │    赛门说 SimonSays (学习管理+硬件)    │
│                                      │     │                                      │
│   定位: 把现有学习材料变成              │     │   定位: 在纸质环境中管理学生学习        │
│         AI 可处理的格式                │     │         并提供即时 AI 反馈             │
│                                      │     │                                      │
│   开源: 是 (MIT)                      │     │   开源: 否（初期测试阶段）              │
│   公开: 是 (GitHub + 发表文章)         │     │   公开: 否（内部开发中）                │
│   AI:   BYOK (学生自带密钥)           │     │   AI:   服务端处理（老师/学校配置）      │
│                                      │     │                                      │
│   github.com/tesolchina/Smartextbook │     │   本项目（私有仓库）                    │
└──────────────────────────────────────┘     └──────────────────────────────────────┘
```

### 核心架构差异

| 维度 | 智能课本 Smartextbook | 赛门说 SimonSays |
|------|---------------------|-----------------|
| **AI 模式** | BYOK — 学生自带 API 密钥，平台中立 | 服务端 AI — 老师/学校统一配置，学生设备零处理能力 |
| **学生设备角色** | 完整浏览器，运行 JS，本地存储密钥 | 纯粹的输入/输出终端，只做数据搬运 |
| **学习环境** | 数字化（屏幕阅读、在线答题） | 纸质+数字化混合（纸上做作业 → 拍照上传 → AI 处理） |
| **数据流向** | 浏览器 ↔ AI API（直连，不经过平台服务器） | 设备 → 服务器 → AI → 服务器 → 设备（全部经过中央处理） |
| **开放程度** | 完全开源，公开发展 | 闭源，内部测试阶段 |
| **侧重点** | 内容转化（PDF→课程）、自学工具 | 课堂管理、实时互动、纸质作业数码化、硬件设备管理 |

### 学生设备的处理能力对比

```
Smartextbook 的学生端:
  浏览器 ──→ 本地 API Key ──→ 直接调用 AI ──→ 获得反馈
  (有处理能力，有存储能力，有 AI 调用能力)

SimonSays 的学生端:
  安卓设备 ──→ 拍照/扫码/选择 ──→ 上传到服务器 ──→ 服务器调 AI ──→ 结果推回设备
  (零处理能力，只做搬运：输入 → 传输 → 显示输出)
```

这意味着 SimonSays 的学生设备就像一支"智能笔" — 它不思考，它只是把学生的动作（拍照、点选、扫码）传给后台，然后把后台的反馈显示出来。所有的"智能"都在服务器端。

---

## 两个系统各自负责什么

### 智能课本 Smartextbook（内容转化平台）
- 老师上传 PDF / URL / 文本
- AI 生成：摘要、术语表、思维导图、测验题、概念标签
- SCORM 导出（给 Moodle 等 LMS）
- 分享链接（学生自学、AI 辅导员聊天）
- **本质：把原始教材变成结构化的、AI 可理解的学习材料**

### 赛门说 SimonSays（学习管理 + 硬件平台）
- 课堂实时互动（Kahoot 式答题，用专属安卓设备）
- 纸质作业数码化（学生在纸上做 → 拍照上传 → AI 批改反馈）
- 扫码交互（扫教材上的二维码触发对应学习任务）
- 设备管理（50 台安卓手机的配置、监控、Kiosk 锁定）
- xAPI 学习记录采集（每个学习动作都记录）
- 教师大屏（实时显示全班学习状态）
- **本质：在保留纸质学习习惯的前提下，用硬件+AI 实现即时反馈和数据采集**

---

## 对接架构

```
         智能课本 Smartextbook                         赛门说 SimonSays
         (开源 · 公开)                                (闭源 · 内部)
        ┌────────────────┐                          ┌────────────────┐
        │                │                          │                │
        │  老师上传材料   │                          │   教师 Web 端   │
        │       ↓        │                          │       │        │
        │  AI 生成课程   │                          │       ↓        │
        │  (摘要+题目)   │                          │   服务器       │
        │       ↓        │                          │   (AI 处理)    │
        │  分享链接      │───── 课程 JSON ─────────→│       │        │
        │  /shared/:id   │                          │       ↓        │
        │                │                          │   安卓设备      │
        │                │                          │   (Kiosk)      │
        │                │                          │       │        │
        │                │                          │   学生答题      │
        │                │                          │   拍照上传      │
        │                │                          │   扫码交互      │
        │                │                          │       │        │
        │                │                          │       ↓        │
        │  教师报告      │←──── xAPI 学习记录 ──────│   成绩汇总      │
        │  (跨课程分析)  │     (未来阶段)            │   AI 反馈      │
        │                │                          │                │
        └────────────────┘                          └────────────────┘

        对接接口: Smartextbook 的 GET /api/shared/:id (已有，公开)
        数据方向: 课程数据 Smartextbook → SimonSays (单向拉取)
                  学习记录 SimonSays → Smartextbook (未来，xAPI 推送)
```

### SimonSays 的 AI 处理流程

```
学生在纸上写作业
        ↓
拍照（安卓设备摄像头）
        ↓
照片上传到 SimonSays 服务器
        ↓
服务器调用 AI（用学校/老师配置的 API Key）
  - OCR 识别手写内容
  - 对比正确答案
  - 生成个性化反馈
        ↓
反馈推送回学生设备显示
        ↓
同时生成 xAPI 学习记录存储
```

**AI 密钥管理：**
- 学校或老师在 SimonSays 管理后台配置一个 AI API Key
- 所有学生设备的 AI 请求统一通过服务器处理
- 学生设备上没有任何 API Key，也无法直接调用 AI
- 这样做的好处：成本可控（学校统一付费）、安全（密钥不暴露）、管理方便

---

## 开发协调与信息隔离

### 原则

两个项目处于不同的公开阶段，必须保持信息边界：

| 规则 | 说明 |
|------|------|
| Smartextbook 代码中不出现 SimonSays 的具体实现细节 | 可以提到"支持外部系统对接"，但不暴露 SimonSays 的 API 结构或功能设计 |
| 对接接口使用通用标准 | 用 xAPI（国际标准）和通用 REST API，不暴露任何一方的内部架构 |
| SimonSays 拉取数据，不推送内部信息 | SimonSays 调用 Smartextbook 的公开 API 获取课程，但不向 Smartextbook 暴露自己的内部端点 |
| xAPI 数据推送时只发学习记录 | 不在 xAPI 数据中包含 SimonSays 的设备管理、内部架构等信息 |

### 两个项目的 Git 仓库完全独立

```
github.com/tesolchina/Smartextbook     ← 公开仓库，开源
  - 不包含任何 SimonSays 的代码或配置
  - 文档中可以写"支持 xAPI 标准的外部学习系统对接"
  - 不写 SimonSays 的具体 API 地址或接口设计

本项目 SimonSays                        ← 私有仓库，不公开
  - 包含 Smartextbook 对接代码（调用公开 API）
  - 包含本文档（对接架构设计）
  - 本文档不应出现在 Smartextbook 仓库中
```

### 在 Smartextbook 那边可以安全做的事情

1. **加 CORS 配置** — 允许更多域名访问 `/api/shared/:id`，这是通用功能，不暴露 SimonSays
2. **加一个通用的 xAPI 接收端点** — `POST /xapi/statements`，遵循 xAPI 标准，任何学习系统都可以对接，不专门为 SimonSays 设计
3. **在文档中写** — "LessonBuilder 支持通过分享链接与外部课堂互动系统集成"

### 在 Smartextbook 那边不应该做的事情

1. 不写 SimonSays 的具体域名或 API 地址
2. 不写 SimonSays 的内部功能细节（设备管理、Kiosk 模式等）
3. 不在 Smartextbook 的代码中硬编码 SimonSays 的任何信息

---

## Smartextbook 现有 API（已读源码确认）

| 功能 | API 端点 | 说明 |
|------|---------|------|
| AI 生成课程 | `POST /api/generate-lesson` | 输入文本/URL → 输出完整 lesson JSON |
| AI 聊天辅导 | `POST /api/chat` | SSE 流式聊天，带课程上下文 |
| 获取 URL 内容 | `POST /api/fetch-url` | 抓取网页文本 |
| 分享课程 | `POST /api/share` | 存到 PostgreSQL，返回 shareId |
| 获取分享课程 | `GET /api/shared/:id` | 用 shareId 获取完整课程 JSON |
| 评论 | `GET/POST /api/shared/:id/comments` | 学生评论 |

### 课程数据结构

```json
{
  "id": "uuid-xxx",
  "title": "Chapter 3: Cell Biology",
  "summary": "AI 生成的摘要...",
  "keyConcepts": [
    { "term": "线粒体", "definition": "细胞的能量工厂..." }
  ],
  "quiz": [
    {
      "question": "以下哪个是哺乳动物？",
      "options": ["鲤鱼", "海豚", "蜥蜴", "鹦鹉"],
      "correctAnswer": 1,
      "explanation": "海豚是哺乳类动物..."
    }
  ],
  "mindMap": "graph TD\n  A[细胞] --> B[细胞核]\n  ...",
  "chapterText": "原始章节文本..."
}
```

---

## 对接实现

### 第一步：课程导入（现在就能做）

**核心思路：利用 Smartextbook 现有的「分享」功能作为桥梁。**

老师在 Smartextbook 生成课程 → 分享 → SimonSays 教师端粘贴链接 → 拉取题目 → 开始上课。

```typescript
// artifacts/api-server/src/routes/import.ts

import express from 'express';
const router = express.Router();

router.post('/api/import/from-smartextbook', async (req, res) => {
  const { shareId, smartextbookUrl } = req.body;
  const baseUrl = smartextbookUrl || process.env.SMARTEXTBOOK_URL || 'https://smartextbook.replit.app';

  const response = await fetch(`${baseUrl}/api/shared/${shareId}`);
  if (!response.ok) {
    return res.status(404).json({ error: '找不到该课程，请检查分享链接' });
  }

  const lesson = await response.json();

  // 把 Smartextbook 的 quiz 格式转换为 SimonSays 的答题格式
  const questions = lesson.quiz.map((q: any, index: number) => ({
    id: `imported_${shareId}_${index}`,
    type: 'multiple_choice',
    content: q.question,
    options: q.options.map((text: string, i: number) => ({
      key: String.fromCharCode(65 + i),
      text: text,
    })),
    correct_answer: String.fromCharCode(65 + q.correctAnswer),
    explanation: q.explanation || '',
    time_limit: 30,
    points: 10,
  }));

  return res.json({
    success: true,
    lesson: {
      title: lesson.title,
      summary: lesson.summary,
      keyConcepts: lesson.keyConcepts,
      sourceShareId: shareId,
      questionCount: questions.length,
      questions,
    },
  });
});

export default router;
```

### 第二步：服务端 AI 处理（SimonSays 独有）

Smartextbook 用 BYOK 模式，但 SimonSays 的 AI 处理完全在服务端：

```typescript
// artifacts/api-server/src/lib/ai-service.ts
// SimonSays 的 AI 处理服务 — 用学校/老师配置的 API Key

class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    // AI Key 由学校管理员在后台配置，不暴露给学生
    this.apiKey = process.env.AI_API_KEY!;
    this.baseUrl = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
  }

  // 批改拍照上传的作业
  async gradePhotoSubmission(params: {
    imageBase64: string;
    lessonContext: string;
    questionText: string;
    correctAnswer: string;
  }) {
    // 1. OCR 识别手写内容
    // 2. 对比正确答案
    // 3. 生成反馈
    // 所有处理在服务器端完成，学生设备只收到结果
  }

  // 为实时答题提供 AI 辅助解释
  async generateExplanation(params: {
    questionText: string;
    studentAnswer: string;
    correctAnswer: string;
    lessonContext: string;
  }) {
    // 生成个性化解释，推送回学生设备
  }
}
```

### 第三步：xAPI 学习记录（两边共同）

SimonSays 生成标准 xAPI 格式的学习记录，未来可推送给 Smartextbook 的 LRS：

```typescript
// artifacts/api-server/src/lib/xapi.ts

const VERBS = {
  answered: { id: 'http://adlnet.gov/expapi/verbs/answered', display: { 'zh-CN': '回答了' } },
  completed: { id: 'http://adlnet.gov/expapi/verbs/completed', display: { 'zh-CN': '完成了' } },
  interacted: { id: 'http://adlnet.gov/expapi/verbs/interacted', display: { 'zh-CN': '互动了' } },
};

export function createAnswerStatement(params: {
  studentName: string;
  deviceId: string;
  questionText: string;
  answer: string;
  correct: boolean;
  timeSpentMs: number;
  lessonId: string;
  sessionId: string;
}) {
  return {
    actor: {
      name: params.studentName,
      account: { homePage: 'https://simonsays.replit.app', name: params.deviceId },
    },
    verb: VERBS.answered,
    object: {
      id: `urn:simonsays:session:${params.sessionId}:question`,
      definition: {
        type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
        name: { 'zh-CN': params.questionText },
        interactionType: 'choice',
      },
    },
    result: {
      success: params.correct,
      response: params.answer,
      duration: `PT${(params.timeSpentMs / 1000).toFixed(1)}S`,
    },
    timestamp: new Date().toISOString(),
  };
}

// 拍照作业提交也生成 xAPI 记录
export function createPhotoSubmissionStatement(params: {
  studentName: string;
  deviceId: string;
  assignmentTitle: string;
  sessionId: string;
  aiScore: number;
  maxScore: number;
}) {
  return {
    actor: {
      name: params.studentName,
      account: { homePage: 'https://simonsays.replit.app', name: params.deviceId },
    },
    verb: VERBS.interacted,
    object: {
      id: `urn:simonsays:session:${params.sessionId}:photo-submission`,
      definition: {
        type: 'http://adlnet.gov/expapi/activities/assessment',
        name: { 'zh-CN': params.assignmentTitle },
      },
    },
    result: {
      score: { raw: params.aiScore, max: params.maxScore },
    },
    timestamp: new Date().toISOString(),
  };
}
```

#### 本地存储（先做）

```sql
CREATE TABLE xapi_statements (
  id SERIAL PRIMARY KEY,
  statement_id UUID DEFAULT gen_random_uuid(),
  actor_name VARCHAR(255),
  actor_device_id VARCHAR(100),
  verb_id VARCHAR(255),
  result_success BOOLEAN,
  result_score_raw NUMERIC,
  context_session_id VARCHAR(100),
  full_statement JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  synced_to_lrs BOOLEAN DEFAULT FALSE
);
```

#### 推送到 Smartextbook LRS（未来）

```typescript
// 当 Smartextbook 的 LRS 端点准备好后
async function syncToLRS(statements: any[]) {
  await fetch(`${process.env.LRS_ENDPOINT}/xapi/statements`, {
    method: 'POST',
    headers: {
      'X-Experience-API-Version': '1.0.3',
      'Authorization': `Basic ${process.env.LRS_AUTH}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(statements),
  });
}
```

---

## SimonSays 独有功能（不在 Smartextbook 中）

这些功能是 SimonSays 的核心差异化能力，不会出现在开源的 Smartextbook 中：

| 功能 | 说明 | 与 Smartextbook 的关系 |
|------|------|---------------------|
| 纸质作业拍照批改 | 学生在纸上做作业 → 拍照 → AI 批改 | 无关，SimonSays 独有 |
| 扫码交互 | 扫教材上的二维码触发学习任务 | 无关，SimonSays 独有 |
| 安卓设备 Kiosk 管理 | 50 台设备的配置、监控、锁定 | 无关，SimonSays 独有 |
| 实时课堂大屏 | WebSocket 推送全班答题状态 | 是 Smartextbook Stage 4 的硬件实现 |
| 服务端 AI 处理 | 学校统一配置 API Key | 与 Smartextbook 的 BYOK 模式相反 |
| 设备配网/扫码入网 | 二维码配置 WiFi | 无关，硬件特有 |

---

## 在 Smartextbook 那边需要确认/添加的

| 项目 | 说明 | 信息安全 |
|------|------|---------|
| CORS 配置 | `/api/shared/:id` 允许更多域名跨域访问 | 安全 — 这是通用功能 |
| xAPI 接收端点 | 通用的 `POST /xapi/statements`，遵循标准 | 安全 — 不专门为 SimonSays 设计 |
| 分享链接有效期 | 90 天目前够用，可在 SimonSays 本地缓存 | 安全 |
| 文档措辞 | 写"支持外部学习系统对接"，不提 SimonSays | 安全 |

---

## 实施路线图

```
第 1 步 — 各自完善（当前阶段）
  Smartextbook: 继续开源开发，完善 AI 课程生成、SCORM 导出
  SimonSays:    完善答题系统、安卓 Kiosk、拍照上传、服务端 AI

第 2 步 — 单向对接
  SimonSays 调用 Smartextbook 的公开 API 获取课程
  不需要改 Smartextbook 的代码
  老师在 SimonSays 粘贴分享链接即可导入题目

第 3 步 — xAPI 数据回传
  SimonSays 生成标准 xAPI 学习记录
  Smartextbook 加通用 LRS 端点（不专门为 SimonSays 设计）
  学习数据流通，老师在 Smartextbook 看到跨平台报告

第 4 步 — 准备好后再公开
  SimonSays 的公开时机由你决定
  在此之前，Smartextbook 的开源代码和文档中不出现 SimonSays 的任何细节
```
