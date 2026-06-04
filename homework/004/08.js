const myLibrary = [
    { title: "JavaScript 基礎教程", author: "張三" },
    { title: "HTML5 與 CSS3 指南", author: "李四" },
    { title: "精通 JavaScript 異步編程", author: "張三" }
];

function searchByAuthor(books, searchName) {
    let results = [];
    for (let i = 0; i < books.length; i++) {
        // 如果書籍作者與搜尋目標一致
        if (books[i].author === searchName) {
            results.push(books[i].title);
        }
    }
    return results;
}

console.log(searchByAuthor(myLibrary, "張三")); 
// 輸出: [ 'JavaScript 基礎教程', '精通 JavaScript 異步編程' ]