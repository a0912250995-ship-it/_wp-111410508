# Reaction Click Game — 期末專案報告

## 專案簡介

這是一個**反應速度點擊遊戲**，結合**公開排名系統**的網頁應用程式。
玩家需要在 30 秒內盡可能點擊畫面上出現的彩色圓圈，分數會即時上傳至伺服器，
所有玩家的成績都會顯示在排行榜上。

---

## 專案結構

```
final-game/
├── app.js              # Express 伺服器主程式
├── package.json        # 專案設定與依賴
├── game.db             # SQLite 資料庫（自動產生）
├── public/
│   ├── game.js         # 前端遊戲邏輯（Canvas）
│   └── style.css       # 深色主題樣式
├── views/
│   ├── layout.ejs      # 頁面佈局（導覽列）
│   ├── index.ejs       # 遊戲主頁 + 排行榜
│   ├── login.ejs       # 登入頁面
│   ├── register.ejs    # 註冊頁面
│   └── leaderboard.ejs # 完整排行榜
└── README.md           # 本報告
```

---

## 使用技術

| 技術 | 用途 |
|------|------|
| **Node.js** | 伺服器執行環境 |
| **Express.js** | Web 應用框架 |
| **EJS** | 模板引擎，產生 HTML 頁面 |
| **SQLite (sql.js)** | 嵌入式資料庫，儲存使用者與分數 |
| **express-session** | Session 管理（登入狀態） |
| **Canvas API** | 前端遊戲繪圖與動畫 |
| **scrypt** | 密碼雜湊（內建 crypto 模組） |

---

## 功能說明

### 1. 使用者系統
- **註冊**：使用者可建立帳號（使用者名稱 + 密碼）
- **登入 / 登出**：Session 管理登入狀態
- **密碼安全**：使用 scrypt + salt 雜湊儲存

### 2. 遊戲機制
- **30 秒計時**：倒數計時遊戲
- **隨機生成圓圈**：不同顏色、大小、位置的圓圈持續出現
- **點擊得分**：點擊圓圈可獲得 10 分（基本分）
- **Combo 系統**：連續點擊成功可累積 combo，每 combo 加 2 分獎勵（上限 x10）
- **粒子特效**：點擊圓圈時會有色彩粒子爆炸效果
- **圓圈漸淡消失**：圓圈會隨著時間縮小並淡出

### 3. 排行榜系統
- **即時更新**：遊戲結束後自動提交分數
- **Top 10 顯示**：首頁顯示前 10 名
- **完整排行榜**：獨立頁面顯示所有記錄（最多 50 筆）
- **金銀銅標示**：前三名有獎牌圖示

### 4. API 端點

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/` | 遊戲首頁（含 Top 10 排行榜） |
| GET | `/leaderboard` | 完整排行榜頁面 |
| GET | `/login` | 登入頁面 |
| POST | `/login` | 登入驗證 |
| GET | `/register` | 註冊頁面 |
| POST | `/register` | 註冊新使用者 |
| GET | `/logout` | 登出 |
| POST | `/api/score` | 提交遊戲分數（需登入） |
| GET | `/api/leaderboard` | 取得 Top 10 排行榜（JSON） |

---

## 資料庫設計

```sql
-- 使用者資料表
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 分數資料表
CREATE TABLE scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 啟動方式

```bash
cd final-game
npm install
node app.js  # http://localhost:3003
```

然後在瀏覽器開啟 `http://localhost:3003`

---

## 開發心得

這次的期末專案從零開始建立了一個完整的**遊戲 + 排名系統**網頁應用，涵蓋了：

1. **前端遊戲開發**：使用 Canvas API 實現遊戲繪圖、動畫與碰撞檢測
2. **後端 API 設計**：RESTful API 設計、資料驗證
3. **資料庫操作**：使用 SQLite 儲存使用者與分數資料
4. **使用者認證**：Session 管理、密碼安全雜湊
5. **前後端整合**：Fetch API 非同步溝通、即時排行榜更新

過程中遇到最大的挑戰是 Canvas 遊戲的點擊座標換算（canvas 縮放時需考慮比例），
以及 combo 系統的數值平衡設計。

---

## AI 輔助工具使用聲明

本專案在開發過程中使用了 opencode (AI 程式設計助手) 作為輔助工具，用於除錯、語法諮詢與概念釐清。
