const { updateGlobalMemory } = require("../global-intel/learner");

async function handleCIResult(req, res) {
    const { status, repo, taskType, reason } = req.body;
    
    console.log(`[CI FEEDBACK] Repo: ${repo} | Status: ${status}`);
    
    await updateGlobalMemory({
        status,
        repo,
        taskType,
        reason
    });

    res.status(200).send({ message: "Intelligence updated." });
}

module.exports = { handleCIResult };
