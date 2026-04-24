# Author Consent Form — ProComm Interactive Transformation

**Project**: ProComm Interactive — Transforming IEEE ProComm Resources into Interactive Learning Experiences  
**Principal Investigator**: Dr Simon Wang, Language Centre, Hong Kong Baptist University  
**Collaborating Organisation**: IEEE Professional Communication Society  
**Contact**: [simon's email] | Traci Nathans-Kelly, tracink.ieee@gmail.com

---

## 邮件模板（自动发送版本）

**Subject**: Permission to Create an Interactive Version of Your ProComm Article — [Article Title]

Dear [Author Name],

I am Simon Wang, a language and AI educator at Hong Kong Baptist University, writing with the support of Traci Nathans-Kelly, IEEE ProComm VP of Content.

I am leading an open-source project to transform IEEE ProComm's professional communication resources into interactive learning experiences — with quizzes, audio narration, and scenario exercises — using AI agents. Your article, **"[Article Title]"** (published [Year]), is among the resources we would like to transform.

A live example of a transformed article can be seen here:  
https://simon.hkbu.me/aiworkshop/listeningdemo

**What we are asking**:  
Your permission to create an interactive HTML version of your article, which would:
- Remain freely accessible alongside the original
- Preserve your full authorship credit
- Be published under Creative Commons (CC BY-NC 4.0)
- Serve as a case study in academic research on AI-assisted educational design

**What we are NOT doing**:
- We will not alter your original text
- We will not claim authorship of your original work
- The interactive version will clearly link back to the original article

**To give consent**, simply reply with "I agree" — or complete the form at [link].  
**To decline**, no action is needed; we will skip your article.

Thank you for your contribution to professional communication education.

With warm regards,  
Simon Wang  
Language Centre, HKBU

---

## 正式同意书（完整版，附表格）

### CONSENT FOR AI-ASSISTED TRANSFORMATION OF PUBLISHED ARTICLE

**Article Information**:  
- Title: _______________________________________________  
- Original URL: _______________________________________________  
- Publication Year: __________

**Author Information**:  
- Name: _______________________________________________  
- Affiliation: _______________________________________________  
- Email: _______________________________________________

**I, the undersigned, consent to the following**:

☐ The creation of an interactive HTML version of my article using AI-assisted methods (PITA framework)

☐ The inclusion of AI-generated supplementary content alongside my original text, including:
  - Comprehension quizzes with explanatory feedback
  - AI-generated audio narration (with my original text as script)
  - Reflection prompts and scenario exercises
  - Design commentary explaining pedagogical choices

☐ Publication of the interactive version on the IEEE ProComm website and/or open-source repository

☐ Use of the transformation process as an anonymised/attributed case study in academic research targeting IEEE Transactions on Professional Communication

☐ Release of the interactive version under Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)

**Conditions I wish to add** (optional):
_______________________________________________

**Signature**: _______________  **Date**: _______________

---

## 授权追踪表（Google Sheets 格式）

| 文章标题 | 作者 | 邮件发送日期 | 回复状态 | 同意日期 | 备注 |
|---------|------|------------|---------|---------|------|
| Listening as Engineering Communication | Leydens & Lucena | — | ✅ 已同意（演示用） | — | 已转化 |
| [下一篇] | | | ⏳ 待发送 | | 优先级1 |

---

## 自动化发送流程

1. 从 Google Sheets 读取作者联系方式（Traci 提供）
2. 用 Resend API 批量发送（每天不超过 20 封，避免被识别为垃圾邮件）
3. 7天无回复自动发送跟进邮件（一次）
4. 在 GitHub Issues 更新授权状态
5. 已授权的文章自动分配给等待领取的志愿者
