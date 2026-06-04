function findMax(numbers) {
    if (numbers.length === 0) return null;
    
    let max = numbers[0]; // 先假設第一個數字是最大的
    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] > max) {
            max = numbers[i]; // 發現更大的數字，更新最大值
        }
    }
    return max;
}

console.log(findMax([12, 45, 7, 23, 56, 10])); // 輸出: 56