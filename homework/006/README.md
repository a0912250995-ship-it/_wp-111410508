# 📘 JavaScript 函數與回呼練習題（10題整理）

本專案整理 JavaScript 常見函數觀念，包括：

- Callback（回呼函數）
- Arrow Function（箭頭函數）
- IIFE（立即執行函數）
- map / filter
- Closure（閉包）
- setTimeout
- 陣列操作與參考傳遞
- 高階函數

---

## 📌 1. Callback 基礎（mathTool）

**題目**

建立 mathTool(num1, num2, action)，使用 callback 進行加減運算。

**解答**

```javascript
function mathTool(num1, num2, action) {
    return action(num1, num2);
}

console.log(mathTool(10, 5, (a, b) => a + b)); // 15
console.log(mathTool(10, 5, (a, b) => a - b)); // 5
```

---

## 📌 2. IIFE（立即執行函數）

**題目**

建立 IIFE，定義 count = 100 並立即輸出。

**解答**

```javascript
(function () {
    let count = 100;
    console.log("Count is: " + count);
})();
```

---

## 📌 3. map + 箭頭函數

**題目**

將價格全部打 8 折。

**解答**

```javascript
const prices = [100, 200, 300, 400];

const discounted = prices.map(p => p * 0.8);

console.log(discounted);
```

---

## 📌 4. 破壞性修改（陣列）

**題目**

移除最後一個元素，前面加 "Start"

**解答**

```javascript
function cleanData(arr) {
    arr.pop();
    arr.unshift("Start");
}

let myData = [1, 2, 3];

cleanData(myData);

console.log(myData);
```

---

## 📌 5. 高階函數（回傳函數）

**題目**

multiplier 回傳函數進行倍數計算

**解答**

```javascript
const multiplier = (factor) => (n) => n * factor;

const double = multiplier(2);

console.log(double(10)); // 20
```

---

## 📌 6. 自製 filter（myFilter）

**題目**

手寫 filter 功能

**解答**

```javascript
function myFilter(arr, callback) {
    let result = [];

    for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i])) {
            result.push(arr[i]);
        }
    }

    return result;
}

console.log(myFilter([1,5,8,12], x => x > 7));
```

---

## 📌 7. 物件陣列 filter

**題目**

篩選 age >= 18 的 user

**解答**

```javascript
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 17 }
];

const adults = users.filter(user => user.age >= 18);

console.log(adults);
```

---

## 📌 8. 參數傳遞陷阱

**題目**

```javascript
let listA = [1, 2];
let listB = [3, 4];

function process(a, b) {
  a.push(99);
  b = [100];
}

process(listA, listB);
```

**結果**

```
listA = [1, 2, 99]
listB = [3, 4]
```

**原因**

push → 修改原陣列
b = [...] → 重新指向，不影響外部

---

## 📌 9. setTimeout 延遲執行

**題目**

2 秒後輸出 Task Completed

**解答**

```javascript
const data = ["Task", "Completed"];

setTimeout(() => {
    console.log(data[0] + " " + data[1]);
}, 2000);
```

---

## 📌 10. 綜合應用（計算總價 + 折扣）

**題目**

計算 cart 總價後套用折扣 callback

**解答**

```javascript
function calculateTotal(cart, discountFunc) {
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        total += cart[i];
    }

    return discountFunc(total);
}

const cart = [100, 200, 300];

const result = calculateTotal(cart, function(total) {
    return total - 50;
});

console.log(result);
```

---

## 📚 重點整理

| 觀念 | 說明 |
|------|------|
| Callback | 函數當參數傳入 |
| Closure | 函數記住外部變數 |
| map / filter | 陣列處理工具 |
| IIFE | 立即執行 + 隱藏變數 |
| setTimeout | 延遲執行 callback |
| 參考傳遞 | push → 會改原陣列；reassign → 不會影響外部 |

---

## 🚀 學習建議

如果要考試：
👉 先背「callback + filter + closure + array操作」
👉 再練「手寫 map / filter」
