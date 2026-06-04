function sumUpTo(n) {
    let sum = 0;
    let current = 1;
    
    while (current <= n) {
        sum += current; // 將當前的數字加進總和
        current++;      // 計數器加 1
    }
    return sum;
}

console.log(sumUpTo(10)); // 1+2+...+10, 輸出: 55