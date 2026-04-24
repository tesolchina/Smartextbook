# 研究议程 — 苏格拉底对话整理
*来源：2026年4月24日讨论*

---

## 核心研究问题（从对话中提炼）

> 如何设计一个可靠的、人机协作的能力评估系统，让学习者通过自选场景完成任务，AI初评、人工抽查，最终以证书守门？

---

## 评估框架（已共识）

| 层次 | 对应Bloom | 测法 | 工具 |
|------|-----------|------|------|
| 认识概念 | Remember / Understand | 选择题 | 传统quiz |
| **迁移应用** | **Apply / Integrate** | **学生自选场景 + AI对话** | **对话式AI + xAPI** |
| 创造 | Create | 开放写作/设计任务 | 人工评审 |

**关键标准**：能不能把概念放进自选的具体场景，用技巧解决问题。

---

## 评估流程（待标准化）

```
1. 学生自选场景（个性化）
        ↓
2. AI用该场景提问（Socratic mode）
        ↓
3. xAPI记录全过程（每一轮对话、每次答题、时间分布）
        ↓
4. AI初评（Bloom层级 + 迁移质量评分）
        ↓
5. 人工抽查（边缘案例 + 随机抽查）
        ↓
6. 证书守门（达到Apply层级 × N场景）
```

**最需要标准化的两步**：
- Step 4：AI如何评主观题（rubric设计）
- Step 6：守门门槛如何设定（及格线）

---

## 研究计划（多论文生态）

### 论文A — 方法论（最核心）
**题目方向**：A Human-AI Collaborative Assessment Framework for Competency Verification in Open Online Learning

**研究问题**：
- 如何设计AI评分rubric使其与人工评分一致性达到可接受水平？
- AI评分和人工评分何时最容易不一致？（边缘案例特征）
- xAPI过程数据能否预测AI评分的可靠性？

**数据来源**：5篇文章 × 20名志愿者学习者 × 完整评估流程

**目标期刊**：Journal of Learning Analytics / Computers & Education

---

### 论文B — xAPI数据分析
**题目方向**：What xAPI Traces Reveal About Competency Transfer: A Learning Analytics Study

**研究问题**：
- 哪些xAPI行为指标（对话轮数、时间、错误率）能预测学习者是否真正掌握？
- "AI高估"（AI给高分但人工认为不足）的学习者有什么行为特征？

**目标期刊**：IEEE Transactions on Learning Technologies

---

### 论文C — 众包内容质量
**题目方向**：Crowdsourced Interactive Learning Materials: Quality, Process, and Volunteer Experience

**研究问题**：
- 非编程背景的志愿者用AI agent转化专业文章，质量如何？与专家版本差距多少？
- 志愿者在哪些步骤最容易卡住？（Teaching Case数据）

**目标期刊**：IEEE Transactions on Professional Communication

---

### 论文D — 社区建设
**题目方向**：Building Sustainable Crowdsourcing Communities for Open Educational Resources

**研究问题**：
- 什么激励机制最有效？（证书 vs 署名 vs 社区归属感）
- 如何防止质量随规模扩大而下降？

**目标期刊**：British Journal of Educational Technology

---

## 待补充的文献（需要在Google Scholar / IEEE Xplore搜索）

### 众包教育
- [ ] Galaxy Zoo / Zooniverse 公民科学文献
- [ ] Von Ahn (2013) — Duolingo众包翻译
- [ ] OER可持续性文献（2020-2026）
- [ ] `crowdsourcing educational content quality` 系统综述

### xAPI研究
- [ ] ADL xAPI白皮书（技术规范）
- [ ] `xAPI learning analytics` in Journal of Learning Analytics
- [ ] `competency-based education AI assessment`
- [ ] `human-AI collaborative grading rubric`

### 人机协作评估
- [ ] Automated Essay Scoring (AES) 综述（2022-2026）
- [ ] `human-in-the-loop assessment` 近期文献
- [ ] `AI grading agreement inter-rater reliability`

---

## 最小可验证实验（MVP）

**规模**：5篇ProComm文章 × 20名学习者（从genAI2026志愿者中招募）

**流程**：
1. 学习者完成互动页面（现有Listening Demo格式）
2. 与AI聊天展示理解（自选场景）
3. xAPI记录全过程
4. AI评分 + 2名教师独立评同一批
5. 计算AI-人工一致性（Cohen's kappa）
6. 分析不一致案例

**产出**：论文A的第一个数据集 + 论文C的部分数据
