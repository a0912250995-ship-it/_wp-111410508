const cartItems = [
    { name: "鍵盤", price: 1500, quantity: 1 },
    { name: "耳機", price: 2000, quantity: 2 },
    { name: "滑鼠墊", price: 300, quantity: 3 }
];

function calculateTotal(cart) {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        // 單價 * 數量
        let itemTotal = cart[i].price * cart[i].quantity;
        total += itemTotal;
    }
    return total;n
}

console.log("購物車總金額為：" + calculateTotal(cartItems) + " 元");
// 輸出: 購物車總金額為：6400 元