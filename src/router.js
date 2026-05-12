const { generatePlan } = require("./ai/planner");
const { addDraft, getDrafts } = require("./drafts/draftManager");
const { scoreRisk } = require("./agents/risk");
const { reviewTask } = require("./agents/reviewer");

async function handleMessage(ctx) {
    const text = ctx.message.text;
    const userId = ctx.from.id;

    // 1. View Drafts
    if (text === "/drafts") {
        const drafts = await getDrafts(userId);
        if (drafts.length === 0) return ctx.reply("📭 No pending drafts.");
        
        let list = "📑 **Current Draft Queue:**\n\n";
        drafts.forEach((d, i) => {
            list += `${i + 1}. [${d.risk}] Task generated at ${new Date(d.id).toLocaleTimeString()}\n`;
        });
        return ctx.reply(list + "\nUse `/review [num]` or `/push [num]`", { parse_mode: 'Markdown' });
    }

    // 2. Review a Draft
    if (text.startsWith("/review")) {
        const index = parseInt(text.split(" ")[1]) - 1;
        const drafts = await getDrafts(userId);
        const feedback = await reviewTask(drafts[index].content);
        return ctx.reply(`🧐 **Reviewer Feedback:**\n\n${feedback}`);
    }

    // 3. Natural Language -> Create Draft
    if (!text.startsWith("/")) {
        const taskContent = await generatePlan(text); 
        const risk = scoreRisk(taskContent);
        await addDraft(userId, taskContent, risk);
        
        return ctx.reply(`📝 **Draft Created!**\nRisk: ${risk}\n\nCheck it with /drafts before pushing.`);
    }
}
module.exports = { handleMessage };
