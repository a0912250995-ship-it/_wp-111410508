function mathTool(num1, num2, action) {
    return action(num1, num2);
}

// 相加（匿名函數）
console.log(mathTool(10, 5, function(a, b) {
    return a + b;
}));

// 相減（匿名函數）
console.log(mathTool(10, 5, function(a, b) {
    return a - b;
}));