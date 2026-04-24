# 文献综述 — ProComm Interactive / Research Agenda

**目标期刊**: IEEE Transactions on Professional Communication  
**相关期刊**: British Journal of Educational Technology, Computers & Education, Journal of Learning Analytics, ACM ICER

*最后更新：2026年4月24日（通过 OpenAlex API 批量检索，新增 Section 六、七、八）*

---

## 零、论文格式选择备忘

**用户问题**：Teaching Case 还是 Research Article 更好？

| 维度 | Teaching Case（IEEE TPC） | Research Article（IEEE TPC 或其他期刊） |
|------|--------------------------|----------------------------------------|
| 数据要求 | 可以 laissez-faire，工作坊观察 + 问卷即可 | 需要 IRB 批准的系统性数据收集 |
| 分析深度 | 实践反思 + 主题分析 | 统计分析 / 严格质性分析 |
| 字数 | 约 5000–7000 字 | 约 6000–9000 字 |
| 编辑反馈 | Craig Baehr 已正面回应 Teaching Case | 需重新查询 |
| 发表周期 | 约 4 周初审 | 同样约 4 周，但修改轮次更多 |
| 建议 | ✅ **优先保持 Teaching Case** 投 IEEE TPC（Craig Baehr 邀请） | 可另写一篇 Research Article 投 BJET / C&E |

**结论**：保持 Teaching Case 格式投 Craig Baehr；若要写 Research Article，另开一个新研究设计，目标期刊改为 BJET 或 Computers & Education。

---

## 一、xAPI / Experience API 研究

xAPI（2013年发布）研究文献量少，是真实的研究缺口。

| 论文 | 来源 | 核心内容 |
|------|------|---------|
| **xAPI Made Easy: A Learning Analytics Infrastructure for Interdisciplinary Projects** | ResearchGate (2022) | 自动生成 xAPI 陈述的基础设施，最接近我们项目的技术参考 |
| **Recipe for Success — Lessons Learnt from Using xAPI within the Connected Learning Analytics Toolkit** | LAK Conference | 在真实系统中部署 xAPI 的挑战与经验 |
| **Experience API: Flexible, Decentralized and Activity-Centric Data Collection** | ResearchGate | xAPI 概念框架：Actor-Verb-Object 追踪任意学习行为 |
| **Model for Recording Learning Experience Data from Remote Laboratories Using xAPI** | ResearchGate | 在非传统学习环境（远程实验室）使用 xAPI 的模型 |

**研究缺口**：以上论文都是技术实现，没有论文把 xAPI 数据用于**人机协作评估的可靠性研究**。

---

## 二、人机协作评分 / AI 辅助评估

这是文献最丰富的方向（近两年 LLM 评分研究大爆发）。

| 论文 | 期刊 | 年份 | 关键发现 |
|------|------|------|---------|
| **Yavuz. Utilizing LLMs for EFL essay grading: reliability and validity in rubric-based assessments** | British Journal of Educational Technology | 2025 | GPT 在 rubric 评分中可靠性检验；与人工评分的一致性分析 |
| **AI and human scoring for postgraduate writing: score reliability, variability, and rater behaviours** | ScienceDirect | 2026 | AI 忽略语义和修辞细节，依赖表层语言特征——正是主观题的弱点 |
| **Evaluating LLMs as raters in large-scale writing assessments: A psychometric framework** | ScienceDirect | 2025 | Claude 评分稳定性优于 GPT；提出 psychometric 框架验证 AI 评分 |
| **AutoSCORE: Enhancing Automated Scoring with Multi-Agent LLMs via Structured Component Recognition** | arXiv | 2025 | 多 Agent 协作评分，用结构化组件识别提升自动评分准确性 |
| **A Study on the Reliability of ChatGPT in Grading IELTS** | ERIC | 2023 | ChatGPT 在 IELTS 写作中的评分可靠性，与人工评分一致性研究 |

**对我们研究的启示**：
- 现有研究集中在**写作**评分（essays），没有针对**对话式互动**（conversational assessment）的 AI 评分可靠性研究
- AI 在表层特征（语法、词汇）评分可靠，在**迁移与应用**（Bloom's Apply）层面的主观判断研究不足
- **我们的研究缺口**：自选场景 + AI 对话评估 + xAPI 过程数据 → 预测 AI 评分误差

---

## 三、众包教育内容创作

| 论文 | 来源 | 年份 | 核心内容 |
|------|------|------|---------|
| **A Review on Crowdsourcing for Education: State of the Art** | ResearchGate | 综述 | 教育众包现状系统综述，包括 learnersourcing 概念 |
| **Crowdsourcing in Computer Science Education** | ACM ICER 2021 | 2021 | CS 教育中的众包实践，质量控制机制 |
| **Educational crowdsourcing to support learning of computer programming** | Springer RPTEL | 2015 | 志愿者驱动的学习内容创作，动机分析 |
| **Crowdsourcing Education on the Web: A Role-based Analysis** | ResearchGate | 经典 | 在线学习社区的角色分析（内容创建者 / 策展人 / 消费者） |
| **Von Ahn (2013). Duolingo crowdsourced translation** | Science | 2013 | 贡献即学习：用户翻译互联网内容同时学语言 |

**核心概念** — Learnersourcing（Shah, 2012; Kim, 2015）：
- 学生完成任务的同时，为其他学生生产学习资源
- 与你的模型完全匹配：志愿者转化文章时，自己也在学 PITA 框架

---

## 四、能力认证 / 微证书 / 守门

| 论文/资源 | 来源 | 核心内容 |
|----------|------|---------|
| **Can AI Be Leveraged to Support Competency-Based Assessments?** | Digital Promise (2023) | AI 支持 competency-based micro-credentials 的可行性分析 |
| **Foundation of Digital Badges and Micro-Credentials** | ResearchGate | 数字徽章和微证书的理论基础 |
| **Developing AI Education Competency Framework** | Open Praxis | AI 教育能力框架 |

---

## 五、ProComm 官方研究缺口（已确认）

来源：https://procomm.ieee.org/procomms-ai-research-questions/

Simon 项目直接对应 ProComm 官方列出的研究优先级：
- **Topic 3**：AI 与传播工作的未来——技术写作者角色转型
- **Topic 4**：教育、培训与 AI 素养——课程重设计，AI 素养教学策略

---

## 六、我们的研究缺口定位

**现有研究有**：
- AI 评写作 essay（大量，BJET/Computers & Education）
- xAPI 技术实现（少量，技术导向）
- 众包教育内容（中量，CS 教育为主）
- 能力认证框架（政策导向为主）

**现有研究没有**：
1. xAPI 数据用于**预测 AI 评分误差**的研究
2. **对话式评估**（conversational assessment）的 AI-人工一致性研究
3. **学习者自选场景** + AI 守门 + xAPI 全程追踪的完整系统研究
4. 非编程背景学习者用 AI agent **众包创作专业内容**的质量研究

→ **这四个缺口 = 四篇论文的空间**

---

## 六、自然语言编程 / Vibe Coding（新增 2026年4月）

| 论文 | 期刊/来源 | 年份 | DOI | 核心内容 |
|------|----------|------|-----|---------|
| **Why Johnny Can't Prompt: How Non-AI Experts Try (and Fail) to Design LLM Prompts** | CHI 2023 | 2023 | 10.1145/3544548.3581388 | 非 AI 专家设计 LLM prompt 的失败模式——与我们工作坊学生的挑战高度对应 |
| **What is it like to program with artificial intelligence?** | arXiv | 2022 | 10.48550/arxiv.2208.06213 | 第一视角研究：用 AI 编程的主观体验 |
| **A Review on Vibe Coding: Fundamentals, State-of-the-art, Challenges and Future Directions** | TechRxiv | 2025 | 10.36227/techrxiv.174681482.27435614/v1 | Vibe coding 综述——我们最重要的理论对话文献 |
| **Vibe Coding for Product Design: Understanding Product Team Members' Perceptions** | arXiv | 2025 | 10.48550/arxiv.2509.10652 | 非程序员在产品设计中使用 vibe coding 的感知研究——与我们的 case 平行 |

**对我们研究的意义**：
- "Why Johnny Can't Prompt" 是与我们 Case 直接对话的文献：我们的 PITA 框架是专门解决 non-expert prompt design 失败问题的教学干预
- Vibe Coding 2025 综述可以作为我们研究背景的核心引用

---

## 七、计算思维与语言教育（新增 2026年4月）

| 论文 | 期刊 | 年份 | DOI | 核心内容 |
|------|------|------|-----|---------|
| **Computational thinking integrated into the English language curriculum in primary education** | Education and Information Technologies | 2024 | 10.1007/s10639-024-12522-4 | CT 整合进英语课程的实证研究——验证 CT 与语言学习可以融合 |
| **FlowPilot: A Generative AI-Driven Visual Language for Computational Thinking Education** | VL/HCC 2024 | 2024 | 10.1109/vl/hcc60511.2024.00046 | 生成式 AI 驱动的可视化编程语言支持 CT 教育 |
| **Tracking Visual Programming Language-Based Learning Progress for Computational Thinking** | Sustainability | 2023 | 10.3390/su15031983 | 用可视化编程追踪 CT 发展——与 xAPI 追踪学习进度的研究方向呼应 |

---

## 八、Learnersourcing 新文献（新增 2026年4月）

| 论文 | 期刊/来源 | 年份 | DOI | 核心内容 |
|------|----------|------|-----|---------|
| **Learnersourcing: Student-generated Content @ Scale** | CHI Workshop 2022 | 2022 | 10.1145/3491140.3528286 | Learnersourcing 规模化研究——最新系统综述 |
| **Evaluating the quality of student-generated content in learnersourcing: A large language model approach** | Education and Information Technologies | 2024 | 10.1007/s10639-024-12851-4 | 用 LLM 评估 learnersourcing 内容质量——与我们的 AI 评估 + 证书颁发直接相关 |
| **Assessing the Quality of Student-Generated Short Answer Questions Using GPT-3** | AIED 2022 | 2022 | 10.1007/978-3-031-16290-9_18 | 用 GPT-3 评学生生成题目质量——技术参考 |

**对我们研究的意义**：
- 2024 年那篇"LLM 评估 learnersourcing 质量"是我们研究的最直接先行工作——我们是用 AI 对话评估学生能力，而不是评题目质量，差异明显，可作为研究对话入口

---

## 待进一步查找

- [ ] Kim (2015) Learnersourcing — MIT PhD thesis（核心理论）
- [ ] Shah (2012) Learnersourcing — 概念起源论文
- [ ] 更多 xAPI + LRS 在 IEEE ILN 或类似平台的实施案例
- [ ] Automated Essay Scoring (AES) 综述 2023-2024（BJET/CE）
- [ ] Wing (2006) Computational Thinking — *Communications of the ACM*（必引）
- [ ] Sarkar & Drosos (2025) Vibe coding — arXiv:2506.23253（已在草稿中引用，需确认 DOI）
