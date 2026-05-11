function scoreRisk(taskContent) {
  let score = 0;
  const lowerCaseTask = taskContent.toLowerCase();

  if (lowerCaseTask.includes("auth")) score += 3;
  if (lowerCaseTask.includes("database") || lowerCaseTask.includes("db schema")) score += 3;
  if (lowerCaseTask.includes("delete") || lowerCaseTask.includes("remove data")) score += 5;
  if (lowerCaseTask.includes("refactor core") || lowerCaseTask.includes("system architecture")) score += 4;
  if (lowerCaseTask.includes("production") || lowerCaseTask.includes("deploy to prod")) score += 4;
  if (lowerCaseTask.includes("security")) score += 2; // Security tasks themselves can be risky

  if (score >= 6) return "CRITICAL";
  if (score >= 4) return "HIGH";
  if (score >= 2) return "MEDIUM";
  return "LOW";
}

module.exports = { scoreRisk };
