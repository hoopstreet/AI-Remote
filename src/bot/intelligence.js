const fs = require('fs');
const path = require('path');

function getRecommendations() {
    try {
        const roadmap = fs.readFileSync(path.join(__dirname, '../../docs/Roadmap.md'), 'utf8');
        // Simple logic: find the first 3 unfinished tasks
        const tasks = roadmap.match(/- \[ \].*/g) || [];
        return tasks.slice(0, 3).map(t => t.replace('- [ ] ', '💡 Suggestion: ')).join('\n');
    } catch (e) {
        return "💡 Suggestion: Initialize project DNA\n💡 Suggestion: Setup Multi-Agent Workflows";
    }
}

function analyzeTask(task) {
    // This simulates the "CTO Agent" reasoning
    const highRisk = /delete|remove|reset|force/i.test(task);
    return `📊 CTO ANALYSIS REPORT\n---\n🛡 Security: ${highRisk ? 'HIGH RISK' : 'SAFE'}\n⚖️ Review: APPROVED\n📝 Plan: Append to Task.md and trigger GitHub Actions.`;
}

module.exports = { getRecommendations, analyzeTask };
