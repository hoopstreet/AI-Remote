const { reviewTask } = require("./reviewer");
const { analyze } = require("./security");
const { prepare } = require("./devops");

async function runAgents(content, context, type) {
    const review = await reviewTask(content);
    const risk = await analyze(content);
    const execution = await prepare(content);
    
    return {
        plan: content,
        review,
        risk,
        execution
    };
}

module.exports = { runAgents };
