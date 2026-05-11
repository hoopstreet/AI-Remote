const fs = require("fs-extra");
const path = require("path");

const OUTCOMES_PATH = path.join(__dirname, "../memory/outcomes.json");
const LEARNING_PATH = path.join(__dirname, "learning.json");

async function evolveSystem() {
  let outcomes = [];
  try {
    outcomes = await fs.readJson(OUTCOMES_PATH);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log("No outcomes.json found, starting fresh learning.");
      return; // No outcomes to learn from yet
    }
    console.error("Error reading outcomes.json for evolution:", error);
    return;
  }

  const failures = outcomes.filter(d => d.result === "failure");
  const successes = outcomes.filter(d => d.result === "success");

  const learning = {
    failurePatterns: extractPatterns(failures),
    successPatterns: extractPatterns(successes),
    lastEvolved: Date.now()
  };

  await fs.writeJson(LEARNING_PATH, learning, { spaces: 2 });
  console.log("System evolved and learning updated.");
}

function extractPatterns(list) {
  const patterns = {};
  list.forEach(item => {
    // Extract keywords or phrases from the task content
    const keywords = item.task.toLowerCase().match(/\b(\w+)\b/g) || [];
    keywords.forEach(kw => {
      patterns[kw] = (patterns[kw] || 0) + 1;
    });
    // Could also extract specific task types, modules affected, etc.
  });
  return patterns;
}

module.exports = { evolveSystem };
