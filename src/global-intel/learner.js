const fs = require("fs-extra");
const path = require("path");
const PATTERNS_PATH = path.join(__dirname, "patterns.json");

async function updateGlobalMemory(event) {
    const global = await fs.readJson(PATTERNS_PATH).catch(() => ({ successes: [], failures: [] }));
    
    const entry = {
        repo: event.repo,
        taskType: event.taskType,
        reason: event.reason,
        timestamp: Date.now()
    };

    if (event.status === "success") {
        global.successes.push(entry);
    } else {
        global.failures.push(entry);
    }
    
    await fs.writeJson(PATTERNS_PATH, global, { spaces: 2 });
}

module.exports = { updateGlobalMemory };
