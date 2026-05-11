function scorePriority(task) {
  let score = 0;
  // Higher score means higher priority

  // Based on Risk
  if (task.risk === "CRITICAL") score += 5;
  else if (task.risk === "HIGH") score += 3;
  else if (task.risk === "MEDIUM") score += 1;

  // Based on Type (common sense prioritization)
  if (task.type === "fix") score += 4; // Bugs are often high priority
  else if (task.type === "feature") score += 2;
  else if (task.type === "refactor") score += 1;

  // Based on keywords (can be refined with global-intel later)
  const lowerCaseContent = task.content.toLowerCase();
  if (lowerCaseContent.includes("security")) score += 3;
  if (lowerCaseContent.includes("performance")) score += 2;
  if (lowerCaseContent.includes("critical path")) score += 3;

  return score;
}

function sortDrafts(drafts) {
  // Assign a priority score to each draft and then sort
  return drafts.map(d => ({
    ...d,
    priorityScore: scorePriority(d)
  })).sort((a, b) => b.priorityScore - a.priorityScore);
}

module.exports = { scorePriority, sortDrafts };
