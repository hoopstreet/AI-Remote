const { loadFailureClusters } = require("./store");

async function analyzeArchitecture() {
  const clusters = await loadFailureClusters();
  const insights = [];

  for (const key in clusters) {
    const items = clusters[key];
    // Define a threshold for systemic issue (e.g., failure in 3 or more distinct repos/tasks for the same pattern)
    const uniqueRepos = new Set(items.map(item => item.repo));
    if (uniqueRepos.size >= 2 && items.length >= 3) { // At least 3 failures in 2+ distinct repos
      insights.push({
        issue: key,
        severity: "SYSTEMIC",
        description: `Repeated failures in ${key} across ${uniqueRepos.size} repositories. Total failures: ${items.length}.`,
        recommendation: `Consider a architectural review and potential redesign of the ${key} layer.`
      });
    }
  }
  return insights;
}

module.exports = { analyzeArchitecture };
