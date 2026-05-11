const fs = require("fs-extra");
const path = require("path");

const OUTCOMES_PATH = path.join(__dirname, "outcomes.json");

async function recordOutcome({ task, result, repo, timestamp = Date.now() }) {
  let outcomes = [];
  try {
    outcomes = await fs.readJson(OUTCOMES_PATH);
  } catch (error) {
    if (error.code === 'ENOENT') {
      outcomes = [];
    } else {
      console.error("Error reading outcomes.json:", error);
      return; // Exit if we can't read the file
    }
  }

  outcomes.push({ task, result, repo, timestamp });
  await fs.writeJson(OUTCOMES_PATH, outcomes, { spaces: 2 });
}

module.exports = { recordOutcome };
