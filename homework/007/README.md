# JavaScript 練習題 01 ~ 10 統整

> **AI 輔助工具使用聲明**：本專案在開發過程中使用了 opencode (AI 程式設計助手) 作為輔助工具，用於除錯、語法諮詢、概念釐清與程式碼生成。

## 01.js — 物件屬性存取
```js
const post = {
    id: 1,
    title: "Hello World",
    content: "Markdown content"
};

console.log(post.title);      // 點符號存取
console.log(post["title"]);   // 中括號存取
```
**說明**：展示 JavaScript 物件的兩種屬性存取方式：
- **點符號 (`.`)**：語法簡潔，適合屬性名稱為合法識別字時使用。
- **中括號 (`[]`)**：屬性名稱可為字串或變數，適合動態存取或屬性名含有特殊字元時使用。

---

## 02.js — 物件解構賦值
```js
const req = {
    body: { title: "JS教學", content: "內容在此", author: "Gemini" }
};

const { title, content } = req.body;

console.log(title);   // "JS教學"
console.log(content); // "內容在此"
```
**說明**：使用 ES6 解構賦值（Destructuring）直接從 `req.body` 中提取 `title` 與 `content` 屬性，減少重複的 `.` 存取寫法。

---

## 03.js — forEach 遍歷陣列
```js
const posts = [
    { id: 1, t: "A" },
    { id: 2, t: "B" }
];

let html = "";
posts.forEach(post => {
    html += `<div>${post.t}</div>`;
});

console.log(html); // "<div>A</div><div>B</div>"
```
**說明**：利用 `Array.forEach()` 遍歷文章陣列，並以模板字串（Template Literals）組合 HTML 字串。

---

## 04.js — 動態屬性新增
```js
const params = {};
params["id"] = 99;

console.log(params);    // { id: 99 }
console.log(params.id); // 99
```
**說明**：先建立空物件，再透過中括號語法動態新增屬性，最後以點符號讀取。

---

## 05.js — Callback 回呼函式
```js
function fetchData(id, callback) {
    const data = { id: id, status: "success" };
    callback(null, data);
}

fetchData(1, function(error, result) {
    if (error) { console.log("Error:", error); return; }
    console.log(result);
});
```
**說明**：模擬非同步回呼模式：
- `fetchData` 接收 `id` 與 `callback`，執行後呼叫回呼。
- 回呼採用 **Error-first** 風格（第一個參數為錯誤，第二個為結果）。

---

## 06.js — JSON 解析
```js
const jsonStr = '{"title": "Post 1", "tags": ["js", "node"]}';
let obj = JSON.parse(jsonStr);
console.log(obj.tags[1]); // "node"
```
**說明**：使用 `JSON.parse()` 將 JSON 字串轉為 JavaScript 物件，再存取其巢狀陣列元素。

---

## 07.js — 模擬資料庫查詢
```js
function fakeGet(sql, params, callback) {
    callback(null, { title: "Fake Title" });
}

fakeGet("SELECT * FROM post", [], function(error, result) {
    if (error) { console.log("Error:", error); return; }
    console.log(result.title);
});
```
**說明**：模擬資料庫查詢函式，接受 SQL 語句、參數與回呼，回傳假資料。與 05.js 相同採用 Error-first callback 模式。

---

## 08.js — 模板字串 + 三元運算子
```js
let user = "";
const html = `<h1>Welcome, ${user ? user : "Stranger"}</h1>`;
console.log(html); // "<h1>Welcome, Stranger</h1>"
```
**說明**：在模板字串中嵌入三元運算子（Ternary Operator），根據 `user` 是否為空來決定顯示的內容。

---

## 09.js — map 與字串截斷
```js
const arr = [
    "Very long content here",
    "Another Very long content here",
    "3rd Very long content here"
];

const result = arr.map(str => str.substring(0, 10) + "...");
console.log(result);
// ["Very long ...", "Another Ve...", "3rd Very l..."]
```
**說明**：使用 `Array.map()` 將每個字串截取前 10 個字元並加上 `"..."`，常用於文章摘要或列表預覽。

---

## 10.js — 角色權限檢查
```js
function checkAdmin(role, callback) {
    if (role !== "admin") {
        callback("Access Denied", null);
        return;
    }
    callback(null, "Welcome");
}
```
**說明**：簡易的授權檢查函式：
- 若 `role` 不是 `"admin"`，回呼傳入錯誤訊息 `"Access Denied"`。
- 若為 `"admin"`，則回呼成功訊息 `"Welcome"`。
- 採用 Error-first callback 模式，未實際呼叫（僅定義）。

---

## 總結：共同主題

| 主題 | 出現檔案 |
|------|----------|
| 物件屬性存取（`.` / `[]`） | 01, 04 |
| 解構賦值 | 02 |
| 陣列迭代（forEach / map） | 03, 09 |
| 模板字串（Template Literals） | 03, 08 |
| Error-first Callback 模式 | 05, 07, 10 |
| JSON 解析 | 06 |
| 三元運算子 | 08 |
| 字串操作 | 09 |
