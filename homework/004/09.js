function factorial(n) {
    if (n < 0) return "輸入無效";
    let result = 1;
    let i = n;
    
    while (i > 1) {
        result *= i; // 乘上當前的數
        i--;         // 遞減
    }
    return result;
}

console.log(factorial(5)); // 5 * 4 * 3 * 2 * 1, 輸出: 120