const { generateTask } = require("./taskGenerator");
const { getProject, setProject } = require("../memory/memory");
const { pushFile } = require("../utils/gitHubClient");
const { addDraft, getDrafts, updateDraftStatus } = require("../drafts/draftManager");
const { runAgents } = require("../agents/orchestrator");
const { detectDependencies, getExecutionOrder, groupExecution } = require("../graph/graphBuilder");
const { detectConflicts } = require("../graph/conflictResolver");
const { sortDrafts } = require("../agents/priority");
const { explainTask } = require("../agents/explainer");
const { getRepoStatus } = require("../utils/githubClient");
const { indexProject } = require("../memory/vectorStore");

let lastGeneratedTasks = {}; // Store tasks generated for a user session

async function handleMessage(ctx) {
    const userId = ctx.from.id;
    const text = ctx.message.text;

    // --- Commands ---
    if (text.startsWith("/connect")) {
        const repoFullName = text.split(" ")[1]; // e.g., user/repo
        if (!repoFullName) return ctx.reply("Please specify a repository in the format: /connect owner/repo");
        setProject(userId, repoFullName);
        await ctx.reply(`✅ Connected to ${repoFullName}. Indexing project files...`);
        const [owner, repo] = repoFullName.split('/');
        await indexProject(owner, repo);
        return ctx.reply("Project indexed. You can now send task descriptions.");
    }

    const projectFullName = getProject(userId);
    if (!projectFullName) return ctx.reply("⚠️ No project connected. Use /connect owner/repo first.");
    const [owner, repo] = projectFullName.split('/');

    if (text === "/drafts") {
        let drafts = await getDrafts(userId);
        if (drafts.length === 0) return ctx.reply("No drafts available.");

        drafts = sortDrafts(drafts); // Sort by priority
        const conflicts = detectConflicts(drafts);

        let msg = "🧾 Draft Queue (Sorted by Priority):\n\n";
        drafts.forEach((d, i) => {
            msg += `${i + 1}. ${d.title || 'Untitled Task'}\n`;
            msg += `   Priority: ${d.priority}\n`;
            msg += `   Risk: ${d.risk}\n`;
            msg += `   Status: ${d.autoApproved ? 'AUTO-APPROVED' : 'NEEDS REVIEW'}\n\n`;
        });

        if (conflicts.length > 0) {
            msg += "⚠️ Conflicts Detected:\n";
            conflicts.forEach(c => {
                msg += `- Draft ${c.taskA} ↔ Draft ${c.taskB} (Files: ${c.files.join(', ')})\n`;
            });
            msg += "Recommendation: Merge or review before push.\n\n";
        }

        // Add dependency graph info
        const graphTasks = detectDependencies(drafts);
        const orderedTasks = getExecutionOrder(graphTasks);
        const groupedTasks = groupExecution(orderedTasks);

        msg += "📊 Execution Plan:\n";
        groupedTasks.forEach((group, idx) => {
            msg += `Phase ${idx + 1}:\n`;
            group.forEach(task => {
                msg += `- ${task.title || 'Untitled Task'}\n`;
            });
        });

        msg += "\n👉 Use /review <draft_num>, /explain <draft_num>, /merge <num1,num2>, /push <num1,num2>\n";
        return ctx.reply(msg);
    }

    if (text.startsWith("/review")) {
        const draftIndex = parseInt(text.split(" ")[1]) - 1;
        const drafts = await getDrafts(userId);
        if (isNaN(draftIndex) || !drafts[draftIndex]) return ctx.reply("Invalid draft number.");
        const reviewResult = await runAgents(drafts[draftIndex].content, { owner, repo }, 'reviewer');
        return ctx.reply(`🧠 Review for Draft ${draftIndex + 1}:\n${reviewResult.review.issues.join('\n') || 'No issues found.'}`);
    }

    if (text.startsWith("/explain")) {
        const draftIndex = parseInt(text.split(" ")[1]) - 1;
        const drafts = await getDrafts(userId);
        if (isNaN(draftIndex) || !drafts[draftIndex]) return ctx.reply("Invalid draft number.");
        const explanation = await explainTask(drafts[draftIndex].content);
        return ctx.reply(`🧠 Explanation for Draft ${draftIndex + 1}:\n${explanation}`);
    }

    if (text.startsWith("/merge")) {
        const indices = text.split(" ")[1].split(',').map(Number).map(n => n - 1);
        const drafts = await getDrafts(userId);
        if (indices.some(idx => isNaN(idx) || !drafts[idx])) return ctx.reply("Invalid draft numbers for merging.");
        
        const tasksToMerge = indices.map(idx => drafts[idx]);
        const mergedTask = await runAgents(tasksToMerge, { owner, repo }, 'merger'); // Assuming merger agent is integrated
        await addDraft(userId, mergedTask.plan); // Add the merged task as a new draft
        return ctx.reply("🧩 Tasks merged into a new draft. Use /drafts to view.");
    }

    if (text.startsWith("/push")) {
        const indices = text.split(" ")[1].split(',').map(Number).map(n => n - 1);
        const drafts = await getDrafts(userId);
        if (indices.some(idx => isNaN(idx) || !drafts[idx])) return ctx.reply("Invalid draft numbers for pushing.");

        for (const idx of indices) {
            const draft = drafts[idx];
            // Final check by DevOps agent before push
            const devopsCheck = await runAgents(draft.content, { owner, repo }, 'devops');
            if (devopsCheck.execution.requiresApproval === false) {
                return ctx.reply(`❌ Draft ${idx + 1} not approved by DevOps agent for push.`);
            }
            await pushFile({ owner, repo, path: "docs/Task.md", content: draft.content, message: `task: from telegram (draft ${idx + 1})` });
            updateDraftStatus(userId, draft.id, 'pushed');
            await ctx.reply(`🚀 Draft ${idx + 1} pushed to GitHub.`);
        }
        return ctx.reply("All selected drafts processed.");
    }

    if (text.startsWith("/status")) {
        const status = await getRepoStatus(owner, repo);
        return ctx.reply(`📊 Latest CI Status: ${status.status} (${status.conclusion})`);
    }

    // --- Natural Language Task Generation ---
    // If not a command, treat as a new task request
    await ctx.reply("🧠 Analyzing your request and generating a task draft...");
    const taskMD = await generateTask(text, owner, repo);
    const agentResults = await runAgents(taskMD, { owner, repo }, 'all'); // Run all agents for initial analysis

    const { plan, review, risk, execution } = agentResults;

    const titleMatch = plan.match(/# TASK ID: T-\d+\nPriority: (\w+)\nType: (\w+)\n## Objective\n(.+?)\n## Context/s);
    const title = titleMatch ? titleMatch[3].trim() : 'Untitled Task';
    const priority = titleMatch ? titleMatch[1].trim() : 'UNKNOWN';

    await addDraft(userId, {
        title: title,
        content: plan,
        priority: priority,
        risk: risk.risk, // Assuming risk agent returns { risk: 'HIGH' }
        autoApproved: review.status === 'APPROVED' && risk.risk !== 'CRITICAL'
    });

    lastGeneratedTasks[userId] = plan; // Store for potential /push without selection

    let responseMsg = `🧾 Draft created for: ${title}\n`;
    responseMsg += `   Priority: ${priority}\n`;
    responseMsg += `   Risk: ${risk.risk}\n`;
    responseMsg += `   Review: ${review.status} (${review.issues.join(', ')})\n`;
    responseMsg += `   Auto-Approved: ${review.status === 'APPROVED' && risk.risk !== 'CRITICAL' ? 'Yes' : 'No'}\n\n`;
    responseMsg += `👉 Use /drafts to view all pending tasks, /review <num>, /explain <num>, or /push <num> to send to GitHub.\n`;
    return ctx.reply(responseMsg);
}

module.exports = { handleMessage };
