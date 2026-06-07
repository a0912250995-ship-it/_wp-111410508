# Homework 001 ~ 007 期末總統整

---

## 目錄結構

```
homework/
├── 001/          # HTML 自我介紹頁面
├── 002/          # HTML 綜合問卷表單
├── 003/          # Node.js 入門 (hello.js)
├── 004/          # JavaScript 基礎語法練習 (10題)
├── 005/          # Express.js 部落格專案 (Blog1 ~ Blog3)
├── 006/          # JavaScript 進階函式練習 (10題)
├── 007/          # JavaScript 實用語法練習 (10題)
├── 期中/         # 期中 README
└── 期末/         # 本文件
```

---

## 001 — HTML 自我介紹頁面

**檔案**：`001/01`

一個單頁自我介紹網頁，內容包含：

**個人資訊**
- **姓名**：謝宛玲
- **學校**：國立金門大學
- **科系**：資訊工程系 一年級
- **興趣**：程式設計、遊戲、音樂
- **Email**：s111410508@student.nqu.edu.tw

**設計特點**
- **CSS 漸層背景** (`linear-gradient(135deg, #74ebd5, #ACB6E5)`)
- **卡片式版面** (圓角 `15px`、陰影 `box-shadow`)

---

## 002 — HTML 綜合問卷表單

**檔案**：`002/02`

一個多功能 HTML 表單頁面，包含三區塊：
- **登入表單**：帳號、密碼輸入
- **基本資料**：姓名、Email、電話、出生日期、性別(Radio)、興趣(Checkbox)、職業(Select)、顏色選取、檔案上傳、滿意度滑桿(Range)、留言(Textarea)
- **表格調查**：服務品質、環境整潔、價格合理之滿意度評比（Radio 按鈕表格）

---

## 003 — Node.js 入門

**檔案**：`003/hello.js`

最簡單的 Node.js 程式：
```js
console.log('hello 你好')
```
執行：`node hello.js` → 輸出 `hello 你好`

---

## 004 — JavaScript 基礎語法練習 (10題)

**路徑**：`004/01.js` ~ `004/10.js`

| 題號 | 主題 | 說明 |
|------|------|------|
| 01 | 溫度轉換器 | 攝氏 ↔ 華氏互轉 |
| 02 | 陣列最大值 | for 迴圈遍歷找最大值 |
| 03 | 數字累加 | while 迴圈計算 1+2+...+n |
| 04 | 資料管理 | 物件操作、push 新增技能 |
| 05 | 過濾偶數 | for + if 篩選偶數 |
| 06 | 成績評等 | if/else 多重分級 (A~F) |
| 07 | JSON 解析 | JSON.parse / JSON.stringify 與折扣計算 |
| 08 | 圖書搜尋 | 在物件陣列中依作者搜尋 |
| 09 | 階乘計算 | while 迴圈計算 n! |
| 10 | 購物車計算 | 單價 × 數量加總 |

---

## 005 — Express.js 部落格專案

**路徑**：`005/blog/`

三個演化版本的部落格系統，使用 **Express.js + EJS + SQLite (sql.js)**：

### Blog 1 (port 3000)
```
005/blog/
├── app.js              # 主程式
├── public/style.css    # 淺色主題 CSS
├── views/
│   ├── layout.ejs      # 頁面佈局（導覽列）
│   ├── index.ejs       # 文章列表
│   ├── post.ejs        # 文章詳細
│   ├── create.ejs      # 新增文章
│   ├── edit.ejs        # 編輯文章
│   ├── login.ejs       # 登入
│   └── register.ejs    # 註冊
├── blog.db             # SQLite 資料庫
└── package.json
```
- 傳統部落格（標題 + 內文）
- 使用者認證（scrypt 密碼雜湊、session）
- CRUD 完整功能（新增、編輯、刪除、列表）
- `requireAuth` 中介層保護路由

### Blog 2 (port 3001)
```
005/blog/blog2/
```
與 Blog 1 程式碼相同，僅執行埠號不同 (3001)。已整合進 Blog 1。

### Blog 3 — Threads 風格微部落格 (port 3002)
```
005/blog/blog3/
├── app.js
├── public/style.css    # 深色主題 CSS (536行)
├── views/
│   ├── layout.ejs      # 底部導覽列
│   ├── index.ejs       # Feed 首頁
│   ├── post.ejs        # 單篇貼文
│   ├── profile.ejs     # 個人頁面
│   ├── login.ejs
│   └── register.ejs
├── blog.db
└── package.json
```
- **Threads / X (Twitter) 風格**：純內容、無標題
- **按讚系統**：切換式讚 / 收回讚
- **個人頁面**：`/profile` 顯示自己的貼文
- **色彩頭像**：根據 username 雜湊產生
- **深色主題**：黑底白字、完整 CSS
- **權限控制**：刪除檢查擁有權

### 啟動方式
```bash
cd 005/blog
node app.js          # Blog 1 → http://localhost:3000
node blog3/app.js    # Blog 3 → http://localhost:3002
```

---

## 006 — JavaScript 進階函式練習 (10題)

**路徑**：`006/01.js` ~ `006/10.js`

| 題號 | 主題 | 說明 |
|------|------|------|
| 01 | 高階函式 | 將函式作為參數傳入 (mathTool) |
| 02 | IIFE | 立即呼叫函式表達式 |
| 03 | map 折扣 | 陣列 map 搭配箭頭函式計算 8 折 |
| 04 | 陣列變異 | pop() 移除、unshift() 插入 |
| 05 | 閉包 | 回傳函式的工廠模式 (multiplier) |
| 06 | 自訂 filter | 實作類似 Array.filter 的自訂函式 |
| 07 | filter 過濾 | 過濾成年使用者 (age >= 18) |
| 08 | 參考傳遞 | 兩個變數指向同一陣列 |
| 09 | setTimeout | 非同步計時器 (延遲 2 秒輸出) |
| 10 | 折扣函式 | 將折扣邏輯以 callback 傳入計算總額 |

---

## 007 — JavaScript 實用語法練習 (10題)

**路徑**：`007/01.js` ~ `007/10.js`

| 題號 | 主題 | 說明 |
|------|------|------|
| 01 | 物件屬性存取 | 點符號 vs 中括號 |
| 02 | 解構賦值 | 從巢狀物件中提取屬性 |
| 03 | forEach | 遍歷陣列組合 HTML 字串 |
| 04 | 動態屬性 | 中括號動態新增物件屬性 |
| 05 | Callback 回呼 | Error-first 非同步回呼模式 |
| 06 | JSON 解析 | JSON.parse 與巢狀陣列存取 |
| 07 | 模擬資料庫查詢 | 仿 SQL 查詢的回呼函式 |
| 08 | 模板 + 三元 | 模板字串內嵌條件判斷 |
| 09 | map 截字 | 字串截取前 10 字元 + "..." |
| 10 | 權限檢查 | Error-first callback 授權模式 |

---

## 技術棧總覽

| 技術 | 使用於 |
|------|--------|
| HTML5 | 001, 002 |
| CSS3 | 001, 002, 005 (style.css) |
| JavaScript (ES6+) | 003, 004, 006, 007 |
| Node.js | 003, 004, 006, 007 |
| Express.js | 005 |
| EJS 模板引擎 | 005 |
| SQLite (sql.js) | 005 |
| express-session | 005 |
| scrypt 密碼雜湊 | 005 |

---

## 各目錄檔案統計

| 目錄 | 檔案數 | 說明 |
|------|--------|------|
| 001 | 1 | HTML 頁面 |
| 002 | 1 | HTML 頁面 |
| 003 | 2 | 1 個 JS + README |
| 004 | 11 | 10 個 JS 練習 + README |
| 005 | ~40+ | 3 個 Express 部落格專案 (JS、EJS、CSS、JSON) |
| 006 | 11 | 10 個 JS 練習 + README |
| 007 | 11 | 10 個 JS 練習 + README |
| **總計** | **~77+** | 不包含 node_modules |

---

## AI 輔助工具使用聲明

本作業在開發與撰寫過程中，使用了以下 AI 工具輔助完成：

- **ChatGPT** — 用於程式碼除錯、語法諮詢與概念釐清

### 相關對話記錄連結

| 說明 | 連結 |
|------|------|
| 對話記錄 1 | https://chatgpt.com/share/6a25b6cf-5f94-83a8-b752-b1ade74deb18 |
| 對話記錄 2 | https://chatgpt.com/c/6a217445-2000-83ab-bc73-57d38878a382 |
| 對話記錄 3 | https://chatgpt.com/c/69badd3b-c5fc-83a5-9c80-5ff9226e6a2d |
| 對話記錄 4 | https://chatgpt.com/c/69badd92-c0ac-8321-b022-b4ecb4079597 |
