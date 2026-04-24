# IEEE ILN 集成策略

**IEEE ILN** = IEEE Learning Network (iln.ieee.org)  
**定性**: IEEE 的官方在线学习平台（LMS），不是开放 API，是机构内容托管平台

---

## ILN 是什么

| 维度 | 内容 |
|------|------|
| 定位 | IEEE 官方专业发展学习平台（类似 Coursera，但专属 IEEE 生态） |
| 用户群 | 全球 IEEE 会员（超过 400,000 人） + 企业团队 |
| 内容 | 工程、技术、管理类课程，覆盖所有 IEEE 学会 |
| 认证 | 完成课程可获 **PDH（专业发展学时）/ CEU（继续教育学分）** |
| 技术 | 标准 LMS，支持 **SCORM 1.2/2004** 内容上传 |

**`callApi.aspx` 是什么**：不是数据 API，是 **SSO 认证入口**——通过 IEEE Xplore 的用户 profile 来登录 ILN。没有公开的 REST 数据接口。

---

## 机会所在

### ProComm 在 ILN 上现在有什么？
目前 ProComm 在 ILN 上**几乎没有课程**（内容停留在 procomm.ieee.org 的静态文章形态）。

### 如果 Simon 把 127 篇文章都变成 SCORM 包会怎样？
- 127 门新课程上线 IEEE ILN
- 每门课程完成后颁发 PDH 学时（对工程师非常有价值）
- ProComm 在 ILN 上的存在感从 0 变成最活跃的学会之一
- **Traci 有极强动机推动这件事**——这是她 VP Content 任期内的重大成就

---

## 技术路径

```
原文（procomm.ieee.org）
    ↓ PITA 框架 + AI Agent
互动 HTML 页面（index.html）
    ↓ 打包
SCORM 1.2 zip 文件
    ↓ 通过 Traci → IEEE EAB（教育活动委员会）
IEEE ILN 课程（会员可访问，获 PDH 学时）
```

### SCORM 打包需要什么
```
procomm-listening/
├── imsmanifest.xml     ← SCORM 元数据（课程标题、版本、目标）
├── index.html          ← 已有的互动页面（零修改）
├── audio/              ← 音频文件
└── scorm-api.js        ← 轻量级 SCORM API 适配器（约 100 行）
```

`scorm-api.js` 的作用：
- 向 LMS 报告学习进度（已完成哪些章节）
- 提交测验分数
- 记录学习时间

**好消息**: 现有的 Listening Demo 是纯 HTML，加一个 100 行的 SCORM 适配器就可以打包成 ILN 课程。

---

## 开源 + ILN 双轨分发

```
开源 GitHub (procomm-interactive)
├── 免费开放，任何人可用
├── 志愿者贡献的互动 HTML
└── 供教师嵌入课程

                    ↕ 同一套内容，两种打包

IEEE ILN
├── SCORM 包，会员专属
├── 完成后获 PDH 学时
└── IEEE 官方品牌背书
```

这两个渠道不冲突——ProComm 文章本身是开放的，互动版本可以同时以开源和 ILN 课程两种形式存在。

---

## 与 Traci 会议新增讨论点

1. **ProComm 在 ILN 上的内容现状**：目前有哪些课程？谁负责提交？
2. **PDH 认证流程**：每门课程需要什么才能获得 PDH？需要多长时间？
3. **IEEE EAB 联系人**：谁是 Educational Activities Board 的对接人？
4. **SCORM vs 静态 HTML**：Traci 倾向于哪种发布形式？
5. **会员专属 vs 公开访问**：互动版本放 ILN（会员专属）还是 ProComm 网站（公开）？

---

## 战略价值总结

| 受益方 | 具体价值 |
|--------|---------|
| **IEEE 会员** | 127 门新专业传播课程，可获 PDH 学时 |
| **Traci / ProComm** | VP Content 任期内最大内容里程碑 |
| **Simon / HKBU** | 全球分发渠道，Teaching Case 实证数据 |
| **志愿者贡献者** | IEEE 认可的作品集 + 证书 |
| **IEEE 整体** | ProComm 内容利用率大幅提升 |

---

## 下一步行动

- [ ] 会议前：了解 ProComm 在 ILN 上现有内容
- [ ] 会议中：提出 SCORM 双轨分发方案
- [ ] 会议后：联系 IEEE EAB 确认 PDH 认证要求
- [ ] 技术：为 Listening Demo 添加 SCORM 适配器（验证可行性）
