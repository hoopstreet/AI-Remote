const { getGlobalFailures } = require("../learner");
const { saveFailureClusters, loadFailureClusters } = require("./store");

async function clusterFailures() {
  const globalFailures = await getGlobalFailures();
  const clusters = await loadFailureClusters();

  globalFailures.forEach(f => {
    const key = detectPatternKey(f.task); // Use task content to detect pattern
    if (!clusters[key]) clusters[key] = [];
    clusters[key].push(f);
  });

  await saveFailureClusters(clusters);
  return clusters;
}

function detectPatternKey(taskContent) {
  const lowerCaseTask = taskContent.toLowerCase();
  if (lowerCaseTask.includes("auth") || lowerCaseTask.includes("authentication")) return "AUTH_SYSTEM";
  if (lowerCaseTask.includes("database") || lowerCaseTask.includes("db schema")) return "DATABASE_LAYER";
  if (lowerCaseTask.includes("api") || lowerCaseTask.includes("microservice")) return "API_GATEWAY";
  if (lowerCaseTask.includes("frontend") || lowerCaseTask.includes("ui")) return "FRONTEND_UI";
  if (lowerCaseTask.includes("ci/cd") || lowerCaseTask.includes("pipeline")) return "CI_CD_PIPELINE";
  return "GENERAL_SYSTEM";
}

module.exports = { clusterFailures, detectPatternKey };
