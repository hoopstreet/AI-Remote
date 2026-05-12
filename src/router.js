const { orchestrateTask } = require("./ai/agents");
const { pushFile } = require("./github/github");

async function handleMessage(ctx) {
    const text = ctx.message.text;
    const project = getActiveProject(ctx.from.id);

    if (text.startsWith("/connect")) return handleConnect(ctx); 

    if (text.startsWith("/push")) {
        const selection = text.split(" ")[1] || "all";
        return ctx.reply(`🚀 Preparing bundle [${selection}] for secure push...`);
    }

    if (!text.startsWith("/")) {
        if (!project) return ctx.reply("⚠️ Please /connect a project first.");
        const [owner, repo] = project.split("/");
        const result = await orchestrateTask(text, owner, repo);
        return ctx.reply(
            `🧠 **AI Planner Analysis:**\n${result.critique}\n\n` +
            `⚖️ **Risk Score:** ${result.riskScore}/10\n` +
            `📝 **Draft ID:** #772\n\n` +
            `👉 Reply with **'Generate'** to refine or **'/push 772'** to execute.`
        );
    }
}
