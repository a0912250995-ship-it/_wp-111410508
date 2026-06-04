let userProfile = {
    name: "王小明",
    age: 20,
    skills: ["HTML", "CSS"]
};

function addSkill(user, newSkill) {
    user.skills.push(newSkill); // 使用 push 方法加入陣列
    return user;
}

console.log(addSkill(userProfile, "JavaScript"));
// 輸出: { name: '王小明', age: 20, skills: [ 'HTML', 'CSS', 'JavaScript' ] }