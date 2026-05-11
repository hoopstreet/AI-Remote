const { generateTask } = require("../core/taskGenerator");
const { reviewTask } = require("./reviewer");
const { analyze } = require("./security");
const { prepare } = require("./devops");
const { mergeTasks } = require("./merger");

async function runAgents(taskContent, projectContext, agentType = 'all') {
    let plan = taskContent;
    let review = { status: 'SKIPPED', issues: [] };
    let risk = { risk: 'SKIPPED' };
    let execution = { groupedTasks: [], deploymentOrder: 'SKIPPED', requiresApproval: true };

    // Planner agent is usually run first to generate the task content itself
    // If taskContent is already a generated Task.md, we skip the initial planning phase here
    // and assume taskContent is the output of a planner.

    if (agentType === 'reviewer' || agentType === 'all') {
        review = await reviewTask(plan);
    }

    if (agentType === 'security' || agentType === 'all') {
        risk = await analyze(plan);
    }

    if (agentType === 'devops' || agentType === 'all') {
        execution = await prepare(plan);
    }

    if (agentType === 'merger') {
        // taskContent here is expected to be an array of draft objects
        plan = await mergeTasks(taskContent);
    }

    return {
        plan, // This will be the original taskContent or merged content
        review,
        risk,
        execution,
    };
}

module.exports = { runAgents };
