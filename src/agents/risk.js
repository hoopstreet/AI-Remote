function scoreRisk(taskContent) {
    const content = taskContent.toLowerCase();
    let score = 0;
    
    if (content.includes("delete") || content.includes("remove")) score += 5;
    if (content.includes("auth") || content.includes("login")) score += 3;
    if (content.includes("database") || content.includes("schema")) score += 3;
    if (content.includes("refactor")) score += 2;

    if (score >= 5) return "🔴 HIGH";
    if (score >= 3) return "🟡 MEDIUM";
    return "🟢 LOW";
}
module.exports = { scoreRisk };
