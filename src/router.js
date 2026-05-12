const { generatePlan } = require("./ai/planner");
const { addDraft, getDrafts } = require("./drafts/draftManager");
const { scoreRisk } = require("./agents/risk");
const { reviewTask } = require("./agents/reviewer");
const { mergeDrafts } = require("./parser/mergeEngine");
const { pushFile } = require("./github/github");
const { triggerReindex } = require("./context/reindex");

async function handleMessage(ctx) {
    const text = ctx.message.text;
    const userId = ctx.from.id;
    const project = "hoopstreet/ai-remote"; 
    const [owner, repo] = project.split("/");

    // 1. Context Refresh (Manual Re-index)
    if (text === "/refresh") {
        return await triggerReindex(owner, repo, ctx);
    }

    // 2. View Drafts
    if (text === "/drafts") {
        const drafts = await getDrafts(userId);
        if (drafts.length === 0) return ctx.reply("📭 No pending drafts.");
        let list = "📑 **Draft Queue:**\n\n";
        drafts.forEach((d, i) => {
            list += `${i + 1}. [${d.risk}] ${d.content.split('\n')[0].substring(0, 30)}...\n`;
        });
        return ctx.reply(list + "\nCommands:\n`/review [n]`\n`/merge 1,2`\n`/push [n]`\n`/refresh`", { parse_mode: 'Markdown' });
    }

    // 3. Merge Drafts
    if (text.startsWith("/merge")) {
        const indices = text.split(" ")[1].split(",").map(i => parseInt(i) - 1);
        const drafts = await getDrafts(userId);
        const selected = indices.map(i => drafts[i]);
        
        ctx.reply("🧠 **Merging tasks into a single release...**");
        const mergedTask = await mergeDrafts(selected);
        const risk = scoreRisk(mergedTask);
        await addDraft(userId, mergedTask, risk);
        
        return ctx.reply(`✅ **Merged Draft Created!**\nRisk: ${risk}\nCheck /drafts to push.`);
    }

    // 4. Push to GitHub
    if (text.startsWith("/push")) {
        const index = parseInt(text.split(" ")[1]) - 1;
        const drafts = await getDrafts(userId);
        const taskToPush = drafts[index].content;

        ctx.reply("🚀 **Pushing Task.md to GitHub...**");
        await pushFile({
            owner, repo,
            path: "docs/Task.md",
            content: taskToPush,
            message: "Autonomous task trigger from Telegram"
        });
        return ctx.reply("🏁 **Success!** GitHub Actions is now executing.");
    }

    // 5. Chat -> Draft (The Default Intelligence Mode)
    if (!text.startsWith("/")) {
        const taskContent = await generatePlan(text); 
        const risk = scoreRisk(taskContent);
        await addDraft(userId, taskContent, risk);
        return ctx.reply(`📝 **Draft Created!**\nRisk: ${risk}\n\nUse /drafts to manage.`);
    }
}
module.exports = { handleMessage };
