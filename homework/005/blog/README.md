# 005 Blog 專案總覽

> **AI 輔助工具使用聲明**：本專案在開發過程中使用了 opencode (AI 程式設計助手) 作為輔助工具，用於除錯、語法諮詢、概念釐清與程式碼生成。

本目錄包含三個 Express.js 部落格專案，逐步演進從簡易 CRUD 到完整社群平台。

---

## 專案結構

```
005/blog/
├── app.js          # Blog 1 - 簡易部落格 + 使用者認證 (port 3000)
├── blog2/          # Blog 2 - 已整合進 Blog 1
├── blog3/          # Blog 3 - Threads 風格微部落格 (port 3002)
├── views/
├── public/
├── package.json
└── blog.db
```

---

## 各專案比較

| 功能 | Blog 1 | Blog 2 | Blog 3 |
|---|---|---|---|
| **類型** | 傳統部落格（標題+內文）+ 認證 | 已整合進 Blog 1 | Twitter / Threads 風格 |
| **Port** | 3000 | — | 3002 |
| **版面引擎** | express-ejs-layouts | — | 無 |
| **資料表** | posts, users | — | posts, users, likes |
| **文章欄位** | title + content | — | content 純內容 |
| **使用者認證** | ✅ (scrypt 密碼雜湊、session) | — | ✅ (scrypt 密碼雜湊、session) |
| **CRUD 防護** | ✅ 已套用 requireAuth | — | ✅ 建立/刪除需登入，刪除檢查擁有權 |
| **編輯文章** | ✅ | — | ❌ |
| **按讚系統** | ❌ | — | ✅ 切換式讚/收回 |
| **個人頁面** | ❌ | — | ✅ /profile 顯示使用者自己的貼文 |
| **頭像系統** | ❌ | — | ✅ 根據 username 雜湊產生色彩頭像 |
| **導覽列** | 上方（Home, New Post + 使用者） | — | 底部固定（Feed, Profile） |
| **主題** | 淺色白底藍色強調 | — | **深色**（黑底白字，X/Twitter 風格） |
| **CSS 行數** | 88 行 | — | 536 行 |

---

## 啟動方式

```bash
cd 005/blog

# Blog 1 - 簡易部落格 + 使用者認證（已整合 Blog 2 功能）
node app.js          # http://localhost:3000

# Blog 3 - Threads 微部落格
node blog3/app.js    # http://localhost:3002
```

---

## 演進摘要

1. **Blog 1** (`simple-blog`)：最基本的 CRUD 部落格，目前已整合 Blog 2 的註冊/登入/登出功能，密碼以 scrypt 鹽值雜湊儲存，且 CRUD 路由已全數套用 `requireAuth` 中介層。
2. **Blog 2** (`simple-blog2`)：已整合進 Blog 1，無需獨立執行。
3. **Blog 3** (`threads-blog3`)：轉變為 Threads/X 風格微部落格，捨棄標題與編輯功能，加入按讚切換、擁有權檢查、個人頁面、色彩頭像、底部導覽列與完整的深色主題，是三個專案中功能最完整者。
