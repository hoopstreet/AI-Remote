const { indexProject } = require("../vector/indexer");

async function triggerReindex(owner, repo, ctx) {
    await ctx.reply("🔄 **Codebase has changed. Re-indexing project DNA...**");
    try {
        await indexProject(owner, repo);
        await ctx.reply("🧠 **Memory updated.** I am now aware of the latest code changes.");
    } catch (e) {
        await ctx.reply("⚠️ Re-indexing failed. Check logs.");
    }
}

module.exports = { triggerReindex };
