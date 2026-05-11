const { getGlobalFailures, getGlobalSuccesses } = require("./learner");

function applyCrossProjectKnowledge(taskContent) {
  let adjustedRisk = 0;
  let adjustedPriority = 0;
  const lowerCaseTask = taskContent.toLowerCase();

  // Apply learnings from global failures
  const globalFailures = getGlobalFailures(); // This should be awaited or passed in
  globalFailures.forEach(f => {
    // Simple keyword matching for now, can be enhanced with embeddings
    if (lowerCaseTask.includes(f.keyword)) {
      adjustedRisk += 2; // Increase risk if task matches a globally failed pattern
    }
  });

  // Apply learnings from global successes
  const globalSuccesses = getGlobalSuccesses(); // This should be awaited or passed in
  globalSuccesses.forEach(s => {
    if (lowerCaseTask.includes(s.keyword)) {
      adjustedPriority += 1; // Increase priority if task matches a globally successful pattern
    }
  });

  return {
    adjustedRisk,
    adjustedPriority,
  };
}

module.exports = { applyCrossProjectKnowledge };
