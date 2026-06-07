function fakeGet(sql, params, callback) {
    callback(null, { title: "Fake Title" });
}

// 測試
fakeGet("SELECT * FROM post", [], function(error, result) {
    if (error) {
        console.log("Error:", error);
        return;
    }

    console.log(result.title);
});