# ProComm Interactive — 开源项目计划

## 项目定位

**名称**: ProComm Interactive（暂定）  
**目标**: 将 IEEE ProComm 网站 127 篇专业沟通文章，由志愿者社区用 Agentic AI 转化为互动学习页面  
**授权形式**: 开源 + 原作者内容授权双轨并行  
**GitHub**: 建议放在 `tesolchina/procomm-interactive` 或 `ieee-procomm/interactive`

---

## 开源项目的核心价值主张

> "把专业沟通知识从 PDF 里解放出来——任何人都可以贡献一个互动页面，任何人都可以免费学习。"

- 每篇文章的转化由一位志愿者完成（1人1篇）
- PITA 框架（Parse → Identify → Transform → Augment）作为标准化工作流
- 最终产物是独立 HTML 文件，可直接嵌入 ProComm 网站或独立使用
- 研究数据：志愿者如何使用 AI agent 完成转化任务 → Teaching Case

---

## 授权架构（需与 Traci 确认）

### 层次一：IEEE ProComm 机构授权
- 由 Traci Nathans-Kelly（VP Content）代表 ProComm 授权使用网站内容
- 允许以 AI 辅助方式创建衍生互动版本
- 衍生版本以 Creative Commons (CC BY-NC 4.0) 发布

### 层次二：原文作者授权
- 每篇文章单独获得原作者同意
- 同意书内容（见 `consent-forms/author-consent.md`）
- **可以自动化发送**：用邮件模板 + 作者联系方式批量发出，Traci 可提供联系方式

### 层次三：志愿者贡献协议
- 贡献者签署 CLA（Contributor License Agreement）
- 保证 AI 生成内容经人工审核
- 完整记录使用的 AI 工具和 prompt

---

## 志愿者招募策略

### 目标群体（优先级排序）
1. **genAI2026 工作坊参与者**（已有约 50-60 人/场，共 7 场）— 最熟悉工具
2. **IEEE ProComm 学生会员** — 动机最强（portfolio value）
3. **语言与传播专业学生**（HKBU、HKUST、EdUHK 等）
4. **全球技术写作社区**（Write the Docs, STC）

### 激励机制
| 贡献 | 回报 |
|------|------|
| 完成1篇转化 | 贡献者署名 + GitHub contributor |
| 完成3篇 | IEEE ProComm 证书（Traci 协助） |
| 完成5篇 + 反思文章 | 合著者 Teaching Case 致谢 |
| 工作坊助教 | ProComm 2026 会议演讲机会 |

---

## 自动化邮件系统（需讨论）

### 可以自动化的部分
- 给 127 位作者发送授权请求邮件（用模板，Traci 审核后批量发送）
- 追踪授权状态（已同意/待回复/拒绝）
- 通知志愿者领取任务

### 需要人工判断的部分
- 个别作者的特殊条件谈判
- 拒绝授权的处理方式（跳过该文章 or 另找替代）

### 技术实现
- 邮件系统：Resend API（已在 SmartTextbook 项目中集成）
- 状态追踪：Google Sheets（与 Traci 共享）
- 任务分配：GitHub Issues（每篇文章一个 issue，志愿者认领）

---

## 与 Teaching Case 的联动

这个开源项目本身就是研究数据来源：
- 志愿者如何使用 AI agent 完成转化？（RQ1）
- 哪些步骤对非编程背景的人最难？（RQ2）
- PITA 框架是否可复制？（RQ3）

**数据收集**：
- 每位志愿者提交转化记录（AI prompt log + 反思日志）
- 时间追踪（完成一篇需要多长时间？）
- 质量评分（同行审核）

---

## 时间线

| 时间 | 里程碑 |
|------|--------|
| 2026年5月 | 与 Traci 确认授权框架，开始发送作者同意书 |
| 2026年6月 | 开源仓库上线，招募首批 10 名志愿者 |
| 2026年7月 | ProComm 2026 工作坊展示（Edmonton）|
| 2026年8月 | 首批 15 篇互动页面发布到 ProComm 网站 |
| 2026年9月 | Teaching Case 投稿 IEEE TPC |
| 2026年12月 | 完成 50 篇转化，项目阶段性总结 |

---

## 开源仓库结构（建议）

```
procomm-interactive/
├── README.md               ← 项目介绍 + 参与方式
├── CONTRIBUTING.md         ← 志愿者指南（含 PITA 工作流）
├── LICENSE                 ← CC BY-NC 4.0
├── CLA.md                  ← 贡献者协议
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   └── article-claim.md    ← 认领文章的 issue 模板
│   └── workflows/
│       └── validate.yml        ← 自动检查提交的 HTML
├── articles/               ← 每篇转化后的互动页面
│   ├── listening-engineering-communication/
│   │   ├── index.html
│   │   ├── audio/
│   │   └── METADATA.md     ← 原文信息、贡献者、AI工具记录
│   └── ...
├── template/               ← 新贡献者的起点
│   ├── index.html          ← 空白模板
│   └── PITA-guide.md       ← 转化步骤指南
└── skills/                 ← AI agent skill 文件
    └── pita-transform.md   ← 给 AI agent 的指令
```

---

## 与 Traci 会议的关键决定点

1. ProComm 是否愿意将互动版本正式放到官网？
2. 作者联系方式由谁提供？（Traci 还是 Simon 自行搜索）
3. IEEE 的品牌和版权要求是什么？
4. ProComm 是否愿意共同主导这个开源项目（co-PI 模式）？
