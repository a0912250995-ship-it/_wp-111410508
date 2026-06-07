function fetchData(id, callback) {
    const data = {
        id: id,
        status: "success"
    };

    callback(null, data);
}

// 測試呼叫
fetchData(1, function(error, result) {
    if (error) {
        console.log("Error:", error);
        return;
    }

    console.log(result);
});