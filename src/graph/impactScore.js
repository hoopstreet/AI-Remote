function calculateImpact(task) {
  let score = 0;
  const text = task.content.toLowerCase();

  // Core system impact
  if (text.includes("auth") || text.includes("authentication")) score += 5;
  if (text.includes("database") || text.includes("db schema")) score += 5;
  if (text.includes("api") || text.includes("endpoint")) score += 3;
  if (text.includes("core logic") || text.includes("critical path")) score += 4;
  if (text.includes("ui") || text.includes("frontend")) score += 2;

  // Risk multipliers (from risk.js, but re-evaluated for impact context)
  if (text.includes("delete") || text.includes("remove data")) score += 5; // High impact
  if (text.includes("refactor")) score += 3; // Can be high impact if core
  if (text.includes("performance")) score += 2; // Impact on user experience

  return score;
}

function classifyImpact(score) {
  if (score >= 8) return "CRITICAL";
  if (score >= 5) return "HIGH";
  if (score >= 3) return "MEDIUM";
  return "LOW";
}

module.exports = { calculateImpact, classifyImpact };
