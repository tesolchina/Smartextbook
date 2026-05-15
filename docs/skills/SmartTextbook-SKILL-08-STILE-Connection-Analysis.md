# SmartTextbook SKILL-08 — STILE Connection Analysis & Reuse Opportunities

**项目**: SmartTextbook v1.0.0 · github.com/tesolchina/Smartextbook
**新平台**: STiLE — Scholarship of Teaching in Language Education · https://www.stile.hk
**Dr Simon Wang 身份**: Plug and Play Section Editor

---

## STiLE 平台概览

| 属性 | 详情 |
|------|------|
| 平台 | Open Journal Systems (OJS) 3.3.0 — 学术出版平台 |
| 定位 | 香港语言教育教学研究期刊 |
| Plug and Play 版块 | 即用型教学资源（非传统学术论文，面向实践者）|
| URL | https://www.stile.hk/osp/catalog/category/PLUG-AND-PLAY |
| RSS | https://www.stile.hk/osp/gateway/plugin/WebFeedGatewayPlugin/rss2 |

## Plug and Play 已发表内容（2025年抓取）

| 标题 | 作者 | 类型 |
|------|------|------|
| "Sorry to interrupt you there…" (EAP authentic discussions) | Richard Nickalls et al. | 视频/互动 |
| Multimodal Modules for Language Proficiency Enhancement | Michelle Tam, Eva Li, Agnes Tsang, Evangeline Hung | 模块 |
| Creative Problem Solving and Communication in Entrepreneurship | YAN XIA | 课程材料 |
| Accurate Use of Schwa in British English | Ryan Windsor | 发音练习 |
| 邏輯重音──有聲語言表達手機微課 | Tao Ren | 微课（中文）|
| Generative AI and its Potential Implications for EAP | Aditi Jhaveri | 反思文章 |
| Bridging the Gap between Pedagogy and Workplace Needs | Mable Chan | 教学设计 |
| Let's Move on to the Recommendations (Phrasal Verbs) | Siyang Zhou, Hongzhu Wang | 语料分析 |
| Professional Accreditation — Challenging but worth it | Mike Groves | 案例研究 |

---

## SmartTextbook → STILE 可直接复用的功能

### 1. PITA 框架 → Plug and Play 内容制作流程
SmartTextbook 的 PITA（Parse-Identify-Transform-Augment）框架完全适用于将 STILE 文章转化为互动课程：

```
STILE Plug and Play 文章
  → Parse（AI 提取关键概念、学习目标）
  → Identify（选择适合互动化的内容点）
  → Transform（生成 SmartTextbook 互动课程）
  → Augment（添加音频旁白、测验、AI 导师）
  → 发布回 STILE Plug and Play 版块
```

**代码入口**: `artifacts/api-server/src/routes/ieee.ts` 中的 `parse-teaching-case` + `generate-lesson` 端点可直接复用，只需替换 prompt 中的"IEEE Teaching Case"为"STiLE Plug and Play"格式。

---

### 2. BYOK AI 导师 → STiLE 语言学习辅助
SmartTextbook 的 AI 导师（`/api/chat` SSE 流式对话）可嵌入 STILE 文章页面：
- 学习者读完文章后，可对 AI 导师提问
- AI 导师以文章内容为上下文
- 支持粤语/普通话/英文切换（通过 provider 选择）
- 代码: `artifacts/api-server/src/routes/chat.ts` + `artifacts/lesson-builder/src/hooks/use-chat.ts`

---

### 3. xAPI 追踪 → STILE 学习分析研究
STILE 本身是学术研究平台，xAPI 数据直接支持：
- 追踪读者与 Plug and Play 材料的互动（阅读时长、测验完成率）
- 支持 STiLE 的研究论文（学习分析、教学效果研究）
- 代码: `artifacts/api-server/src/routes/xapi.ts`

---

### 4. IEEE2026 Access Code → STiLE Workshop Access
可将 `IEEE2026` 替换为 `STILE2026` 作为 STiLE 工作坊的免 API key 访问码：
- 工作坊参与者无需自备 LLM 密钥
- 主办方（Dr Simon Wang）通过 Replit AI proxy 承担计算成本
- 代码: `artifacts/api-server/src/routes/ai-tutor.ts` — 只需改 `SECRET_CODE` 常量

---

### 5. 证书系统 → STiLE 完成认证
将 SmartTextbook 的 SHA-256 证书系统用于：
- 读者完成 Plug and Play 互动模块后颁发数字证书
- 证书可链接回 STILE 文章 DOI
- 代码: `artifacts/api-server/src/routes/certificates.ts`

---

## 建议的新功能：STiLE Plug and Play 互动化管线

```
新端点: POST /api/stile/transform-article
  输入: { articleUrl, accessCode, llmConfig }
  步骤: 
    1. fetch-url 抓取 STILE 文章全文
    2. 调用 IEEE 教学案例 parse 流程（复用 ieee.ts）
    3. 生成 SmartTextbook 互动课程 JSON
    4. 返回可嵌入 STILE 的 HTML 模块
```

这可以成为 STILE Plug and Play 版块的"投稿辅助工具"：
作者提交文章 → AI 自动生成互动版本草稿 → 作者审核修改 → 提交给 Plug and Play

---

## 技术整合路径

| 整合方式 | 复杂度 | 说明 |
|----------|--------|------|
| iframe 嵌入 SmartTextbook 课程 | 低 | STILE OJS 支持 HTML 嵌入，直接用 `/shared/:id` |
| STILE 文章 URL → 一键生成课程 | 中 | 复用 `fetch-url` + `generate-lesson` |
| STILE 专属 Plug and Play 提交工具 | 高 | 新页面 `/stile` + 新 API 端点 |
| OJS 插件集成 | 高 | 需要 PHP，超出当前栈范围 |

**推荐起点**: iframe 嵌入（最快）+ URL→课程生成（复用现有 API，对 STILE 编辑最实用）

---

## Google Drive 文件夹

**STILE 项目文件夹**: 见 SmartTextbook-SKILL-00-PROJECT-INDEX.md 中的链接表
- `01 — Plug and Play Content` — 已发表文章和待处理材料
- `02 — Lesson Adaptations (SmartTextbook)` — 用 PITA 流程生成的互动版本
- `03 — Research & Editorial Notes` — 编辑工作记录
- `04 — Collaboration Docs` — 与 STILE 团队共享文档
