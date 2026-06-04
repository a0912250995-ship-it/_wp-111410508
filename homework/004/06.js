function getGrade(score) {
    if (score < 0 || score > 100) {
        return "無效的分數";
    }
    
    if (score >= 90) {
        return 'A';
    } else if (score >= 80) {
        return 'B';
    } else if (score >= 70) {
        return 'C';
    } else if (score >= 60) {
        return 'D';
    } else {
        return 'F';
    }
}

console.log(getGrade(85)); // 輸出: B
console.log(getGrade(59)); // 輸出: F