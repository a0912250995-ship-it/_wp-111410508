const productJson = '{"id": 101, "name": "無線滑鼠", "price": 1000}';

function applyDiscount(jsonString, discountRate) {
    // 1. 將 JSON 字串轉回 JS 物件
    let product = JSON.parse(jsonString);
    
    // 2. 計算折扣後的價格 (例如 0.8 代表八折)
    product.price = product.price * discountRate;
    
    // 3. 將物件轉回 JSON 字串
    return JSON.stringify(product, null, 2);
}

console.log(applyDiscount(productJson, 0.8));
// 輸出: JSON 字串，其 price 變為 800