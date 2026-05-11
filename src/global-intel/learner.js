const fs = require("fs-extra");
const path = require("path");

const GLOBAL_PATTERNS_PATH = path.join(__dirname, "patterns.json");
const GLOBAL_FAILURES_PATH = path.join(__dirname, "failures.json");
const GLOBAL_SUCCESSES_PATH = path.join(__dirname, "successes.json");

async function updateGlobalMemory(event) {
  // event should contain type (SUCCESS/FAILURE), task details, repo, and relevant keywords/patterns
  if (event.type === "SUCCESS") {
    let successes = await fs.readJson(GLOBAL_SUCCESSES_PATH).catch(() => []);
    successes.push(event);
    await fs.writeJson(GLOBAL_SUCCESSES_PATH, successes, { spaces: 2 });
  } else if (event.type === "FAILURE") {
    let failures = await fs.readJson(GLOBAL_FAILURES_PATH).catch(() => []);
    failures.push(event);
    await fs.writeJson(GLOBAL_FAILURES_PATH, failures, { spaces: 2 });
  }
  // Optionally, update a combined patterns.json if needed
}

async function getGlobalFailures() {
  return await fs.readJson(GLOBAL_FAILURES_PATH).catch(() => []);
}

async function getGlobalSuccesses() {
  return await fs.readJson(GLOBAL_SUCCESSES_PATH).catch(() => []);
}

module.exports = { updateGlobalMemory, getGlobalFailures, getGlobalSuccesses };
