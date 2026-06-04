function filterEvens(arr) {
    let evenNumbers = []; // 準備存放結果的空陣列
    
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] % 2 === 0) { // 餘數為 0 代表是偶數
            evenNumbers.push(arr[i]);
        }
    }
    return evenNumbers;
}

console.log(filterEvens([1, 2, 3, 4, 5, 6, 7, 8])); // 輸出: [ 2, 4, 6, 8 ]