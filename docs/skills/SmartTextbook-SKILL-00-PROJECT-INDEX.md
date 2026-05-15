# SmartTextbook — Project Skills Index

> **项目识别标识**: SmartTextbook v1.0.0 · Dr Simon Wang · HKBU Language Centre
> 所有文件名以 `SmartTextbook-` 开头，确保与其他项目区分。

## 项目链接

| 平台 | 链接 |
|------|------|
| **Replit 生产环境** | https://smartextbook.replit.app |
| **Replit 项目** | https://replit.com/@SimonWang23/Smartextbook?v=1 |
| **GitHub 仓库** | https://github.com/tesolchina/Smartextbook |
| **Google Drive 项目文件夹** | https://drive.google.com/drive/folders/10qWbdDC-jtFYJ-GuwUyjIe0x_f_FniIi |
| **Google Drive Skills 文件夹** | https://drive.google.com/drive/folders/1abYfZer-gale8EeWcnV4qXqrOBhDvVds |
| **Google Drive STILE 项目文件夹** | https://drive.google.com/drive/folders/1hyJXh3xkGyhX5B-nmwfi3OD7oV72N_uT |
| **SmartTextbook 应用** | https://smartextbook.replit.app/ |
| **IEEE 互动演示 Demo 1** | https://smartextbook.replit.app/listening-demo.html |
| **IEEE 互动演示 Demo 2** | https://smartextbook.replit.app/style-congruency-demo.html |
| **ProComm 2026 研讨会页面** | https://smartextbook.replit.app/procomm2026.html |
| **IEEE ProComm Pitch Deck** | https://smartextbook.replit.app/ieee-procomm-deck/ |

## 合作者

| 姓名 | 机构 | 邮箱 | 角色 |
|------|------|------|------|
| Dr Simon Wang | Language Centre, HKBU | simonwang@hkbu.edu.hk | 项目负责人 |
| Dr Traci Nathans-Kelly | Cornell / IEEE ProComm | tracink.ieee@gmail.com | VP Content, IEEE ProComm |

## 可复用 Skills 清单

| 文件 | 核心能力 | 适用场景 |
|------|----------|----------|
| [SKILL-01](SmartTextbook-SKILL-01-BYOK-LLM-Provider.md) | BYOK 多 LLM 提供商工厂 | 任何需要用户自带 API key 的 AI 应用 |
| [SKILL-02](SmartTextbook-SKILL-02-Server-Side-AI-Proxy.md) | 服务器端 AI 代理 + 访问码机制 | 工作坊/演示场景，用统一 access code 替代个人 key |
| [SKILL-03](SmartTextbook-SKILL-03-xAPI-Learning-Tracking.md) | xAPI 学习行为追踪 | EdTech 平台、在线课程、学习分析 |
| [SKILL-04](SmartTextbook-SKILL-04-Certificate-Generation.md) | SHA-256 防篡改证书生成 | 课程完成证书、成就认证 |
| [SKILL-05](SmartTextbook-SKILL-05-Content-Sharing-PostgreSQL.md) | 临时内容共享 + 自动过期清理 | 任何需要"生成→分享链接"功能的应用 |
| [SKILL-06](SmartTextbook-SKILL-06-SSE-Streaming-Chat.md) | SSE 流式 AI 对话 | 实时 AI 聊天、打字机效果输出 |
| [SKILL-07](SmartTextbook-SKILL-07-Google-Drive-OAuth2.md) | Google Drive OAuth2 文件管理 | 自动上传文档、生成 PDF、云端归档 |

## 技术栈快速参考

```
pnpm monorepo · TypeScript 5.9 · Express 5 · React + Vite · Tailwind + Shadcn
Drizzle ORM · PostgreSQL · Zod v4 · Orval codegen · esbuild
OpenAI SDK (多 provider 复用) · Replit AI Integration proxy
```

## Google Drive 文件夹结构

```
📁 SmartTextbook — IEEE ProComm 2026  (项目主文件夹)
   ├── 📁 01 — Workshop Paper Drafts
   ├── 📁 02 — PDFs & References
   ├── 📁 03 — Research Study & IRB
   ├── 📁 04 — Consent Forms
   ├── 📁 05 — Data & xAPI Exports
   └── 📁 06 — Shared with Dr Traci
📁 Skills & Architecture Docs  (本文件夹 — 跨项目复用)
```

## 关键环境变量

| 变量名 | 用途 | 存储位置 |
|--------|------|----------|
| `GOOGLE_CLIENT_ID` | Google OAuth2 client | Replit Secrets |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 secret | Replit Secrets |
| `Google_refresh_token_drive` | Drive API refresh token | Replit Secrets |
| `GOOGLE_DRIVE_PROJECT_FOLDER_ID` | 项目主文件夹 ID | Replit Env Vars (shared) |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | Replit AI proxy URL | Replit 自动注入 |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | Replit AI proxy key | Replit 自动注入 |
| `DATABASE_URL` | PostgreSQL | Replit 自动注入 |
| `DEEPSEEK_API_KEY` | DeepSeek 优先（HK可访问）| Replit Secrets (可选) |
