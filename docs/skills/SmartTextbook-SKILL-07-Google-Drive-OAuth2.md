# SmartTextbook SKILL-07 — Google Drive OAuth2 文件管理

**项目**: SmartTextbook v1.0.0 · github.com/tesolchina/Smartextbook
**适用场景**: 自动上传文档到 Google Drive、生成并导出 PDF、云端归档项目文件

---

## 凭证体系（SmartTextbook 配置）

| Replit Secret 名称 | 用途 |
|-------------------|------|
| `GOOGLE_CLIENT_ID` | OAuth2 App Client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth2 App Client Secret |
| `Google_refresh_token_drive` | Drive API refresh token（长期有效）|
| `GOOGLE_DRIVE_PROJECT_FOLDER_ID` | 项目主文件夹 ID（env var，非 secret）|

**⚠️ 命名注意**: Replit Secrets 区分大小写。SmartTextbook 用 `Google_refresh_token_drive`（非全大写）与其他 Google 凭证区分。

---

## 如何获取 Refresh Token（标准流程）

1. 打开 [Google OAuth Playground](https://developers.google.com/oauthplayground)
2. 右上角齿轮 → 勾选 "Use your own OAuth credentials" → 填入 Client ID + Secret
3. 左侧选择 scope: `https://www.googleapis.com/auth/drive`（完整 Drive 权限）
4. 点 "Authorize APIs" → 用目标 Google 账号登录
5. 点 "Exchange authorization code for tokens"
6. 复制 **Refresh token** → 存入 Replit Secrets

---

## 核心代码模式（SmartTextbook 使用的 bash 脚本）

```bash
# scripts/src/generate-procomm-paper.mjs 生成 Word 文档后，用此模式上传

# 1. 用 refresh token 换取 access token（每次请求前执行）
TOKEN_RESPONSE=$(curl -s -X POST "https://oauth2.googleapis.com/token" \
  --data-urlencode "client_id=$GOOGLE_CLIENT_ID" \
  --data-urlencode "client_secret=$GOOGLE_CLIENT_SECRET" \
  --data-urlencode "refresh_token=$Google_refresh_token_drive" \
  --data-urlencode "grant_type=refresh_token")

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | node -e \
  "let d='';process.stdin.on('data',c=>d+=c);
   process.stdin.on('end',()=>console.log(JSON.parse(d).access_token))")

# 2. 上传文件（multipart）
curl -X POST \
  "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "metadata={\"name\":\"filename.docx\",\"parents\":[\"FOLDER_ID\"]};type=application/json" \
  -F "file=@/path/to/file.docx;type=application/vnd.openxmlformats-..."

# 3. 复制为 Google Doc（用于 PDF 导出）
GDOC=$(curl -X POST "https://www.googleapis.com/drive/v3/files/FILE_ID/copy" \
  -H "Authorization: Bearer $ACCESS_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Doc Name","mimeType":"application/vnd.google-apps.document"}')

GDOC_ID=$(echo "$GDOC" | node -e "...JSON.parse(d).id...")

# 4. 导出为 PDF
curl "https://www.googleapis.com/drive/v3/files/$GDOC_ID/export?mimeType=application/pdf" \
  -H "Authorization: Bearer $ACCESS_TOKEN" -o output.pdf
```

---

## 在 Node.js 中使用（代码执行沙箱）

```javascript
// Replit code_execution 沙箱中（listConnections 可用）
const conn = (await listConnections('google-drive'))[0];
const { access_token } = conn.getClient();

// 上传文件
await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=media", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "text/plain",
    "X-Upload-Content-Name": "file.txt",
  },
  body: fileContent,
});
```

**注意**: Replit 的 `google-drive` integration 的 access_token 可能过期，需要用 refresh token 手动刷新。

---

## SmartTextbook Google Drive 文件夹结构

```
主文件夹 ID: 10qWbdDC-jtFYJ-GuwUyjIe0x_f_FniIi
https://drive.google.com/drive/folders/10qWbdDC-jtFYJ-GuwUyjIe0x_f_FniIi

├── 📁 01 — Workshop Paper Drafts  (ID: 1FwTqnvujR4gYRSnzCbB3QI5ezm_dvYRw)
│   ├── procomm2026-workshop-paper-CAMERA-READY.docx
│   ├── procomm2026-workshop-paper-CAMERA-READY [Google Doc]
│   ├── procomm2026-workshop-paper-CAMERA-READY.pdf
│   ├── procomm2026-workshop-paper-FINAL.md
│   └── Workshop-template-ProComm2026.docx
├── 📁 02 — PDFs & References
├── 📁 03 — Research Study & IRB
├── 📁 04 — Consent Forms
├── 📁 05 — Data & xAPI Exports
└── 📁 06 — Shared with Dr Traci
```

---

## Word → PDF 自动化管线（SmartTextbook 实践）

```
生成 DOCX (docx npm 包)
  → 上传到 Google Drive
  → 复制为 Google Docs 格式（自动转换）
  → 导出为 PDF（Google Docs render 引擎）
  → 下载 PDF 到本地
  → 上传 PDF 回 Drive（归档）
```

相关脚本：`scripts/src/generate-procomm-paper.mjs`

---

## 移植到新项目

1. 在 Google Cloud Console 创建 OAuth2 凭证（或复用现有 Client ID/Secret）
2. 按上述步骤获取新的 refresh token（每个项目/账号需要独立的 token）
3. 将三个凭证存入 Replit Secrets（**命名加项目前缀以区分**，如 `ProjectName_GOOGLE_REFRESH_TOKEN`）
4. 将主文件夹 ID 存为 env var（非 secret，因为 folder ID 是公开路径标识符）
5. 用 `GOOGLE_DRIVE_PROJECT_FOLDER_ID` 作为所有上传操作的父文件夹
