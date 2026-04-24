# Listening Demo — 技术分析

**URL**: https://simon.hkbu.me/aiworkshop/listeningdemo  
**原文**: https://procomm.ieee.org/listening-as-engineering-communication/  
**状态**: 已完成，是整个项目的样板 (Model Example)

---

## 技术架构

**完全不依赖框架** — 纯 Vanilla HTML/CSS/JavaScript，单一文件

| 功能 | 实现方式 |
|------|---------|
| 分段导航 | `.active` class 切换，无需路由 |
| 测验系统 | `onclick="checkAnswer(this, isCorrect, qId)"` 内联事件 |
| 音频旁白 | HTML5 `<audio>` + ElevenLabs TTS（通过 Poe API 生成） |
| 设计评注 | CSS class toggle (`.annotations-visible`) |
| 得分追踪 | 全局 `score` 变量，完成时显示个性化消息 |
| 进度条 | CSS 计算宽度 |

---

## 为什么这个架构对开源项目很重要

1. **零依赖** — 志愿者不需要安装任何环境
2. **单文件** — 每篇文章就是一个 `index.html`，可以直接用 GitHub Pages 托管
3. **可移植** — 可以直接嵌入 ProComm 网站，不需要后端
4. **SCORM 兼容** — 可打包为 SCORM 1.2 上传到任何 LMS（Moodle、Canvas）

---

## AI 生成的部分

- 内容分段（Parse 步骤）：AI 分析文章结构
- 测验题目（Identify + Transform）：AI 生成题目和解析
- 音频旁白脚本：AI 写旁白，ElevenLabs TTS 合成语音
- 设计评注（Augment）：AI 解释每个设计决策
- **HTML 代码本身**：由 AI agent (vibe coding) 生成，人工审核

---

## PITA 框架在 Listening Demo 中的体现

```
Parse:
  - AI 读取原文，识别5个核心概念（主动倾听、信噪比等）
  - 确定文章的pedagogical结构

Identify:
  - 每个概念选择互动形式（定义卡片→场景题→应用反思）
  - 识别适合音频旁白的段落

Transform:
  - 生成分段 HTML 页面
  - 每段配测验（2-3题）和即时反馈
  - 整合进度条和得分系统

Augment:
  - ElevenLabs 生成 MP3 音频文件
  - 添加设计评注（解释为什么用这个格式）
  - 添加引用来源标注
```

---

## 开源复制的步骤（给志愿者的指南草稿）

1. **领取文章** — 在 GitHub Issues 认领一篇 ProComm 文章
2. **运行 PITA Agent** — 用提供的 skill 文件给 AI agent，粘贴文章 URL
3. **审核输出** — 检查测验题准确性、音频质量、设计评注合理性
4. **提交 PR** — 将 `index.html` + `audio/` + `METADATA.md` 放入对应文件夹
5. **同行审核** — 另一位志愿者审核后合并

---

## 需要改进的地方（来自工作文档分析）

**UX**：
- 加可点击目录（非线性访问）
- 键盘导航支持（← → 箭头）
- 每节显示预计阅读时间
- LocalStorage 书签（保存进度）

**内容**：
- 在每节前加"为什么这很重要"的导入
- 测验题型多样化（拖放排序、填空、匹配）

**无障碍**：
- ARIA labels
- 确保色彩对比度达到 WCAG AA
- 音频旁边附文字稿

**音频播放器**：
- 加播放速度控制（0.75x / 1x / 1.25x / 1.5x）
- 更突出的视觉设计
