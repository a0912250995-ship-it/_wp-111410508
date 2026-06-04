function convertTemp(value, unit) {
    if (unit === 'C') {
        let fahrenheit = (value * 9) / 5 + 32;
        return `${value}°C 轉換為華氏是 ${fahrenheit.toFixed(1)}°F`;
    } else if (unit === 'F') {
        let celsius = ((value - 32) * 5) / 9;
        return `${value}°F 轉換為攝氏是 ${celsius.toFixed(1)}°C`;
    } else {
        return "不支援的溫度單位，請輸入 'C' 或 'F'";
    }
}

console.log(convertTemp(30, 'C')); // 輸出: 30°C 轉換為華氏是 86.0°F
console.log(convertTemp(98.6, 'F')); // 輸出: 98.6°F 轉換為攝氏是 37.0°C