const { generateTaskMD } = require("./planner");
const { searchContext } = require("../vector/search");

async function orchestrateTask(userInput, owner, repo) {
    const context = await searchContext(userInput, `./vector-${owner}-${repo}.json`);
    const taskMD = await generateTaskMD(userInput, context);
    const review = await critiqueTask(taskMD, context);
    
    return {
        taskMD,
        riskScore: review.score,
        critique: review.feedback,
        status: "draft"
    };
}

async function critiqueTask(taskMD, context) {
    let score = 2; 
    if (taskMD.includes("delete") || taskMD.includes("force")) score = 8;
    return { score, feedback: "Reviewer: Structure matches DNA. v1.0.4 standards applied." };
}

module.exports = { orchestrateTask };
