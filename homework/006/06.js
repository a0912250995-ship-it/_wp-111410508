function myFilter(arr, callback) {
    let result = [];

    for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i])) {
            result.push(arr[i]);
        }
    }

    return result;
}

const numbers = [1, 5, 8, 12];

const filtered = myFilter(numbers, function(item) {
    return item > 7;
});

console.log(filtered);