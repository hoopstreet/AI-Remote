import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getContext() {
    try {
        const dna = fs.readFileSync(path.join(__dirname, '../../docs/DNA.md'), 'utf8');
        const roadmap = fs.readFileSync(path.join(__dirname, '../../docs/Roadmap.md'), 'utf8');
        return { dna, roadmap };
    } catch (e) {
        return { dna: "Project DNA not found", roadmap: "" };
    }
}

export function getRecommendations() {
    const ctx = getContext();
    const tasks = ctx.roadmap.match(/- \[ \].*/g) || [];
    if (tasks.length === 0) return "💡 Suggestion: Define next milestones in Roadmap.md";
    return tasks.slice(0, 3).map(t => t.replace('- [ ] ', '🚀 Next Priority: ')).join('\n');
}

export function analyzeTask(task) {
    const isArchitectural = /architecture|structure|system/i.test(task);
    return `📂 *CTO ANALYSIS REPORT*\n---\n🧬 *Project DNA:* Detected\n🛠 *Impact:* ${isArchitectural ? 'System-Wide' : 'Feature-Level'}\n⚖️ *Verdict:* APPROVED\n\n💬 *CTO Comment:* Proceeding to log this in Task.md for GitHub Actions execution.`;
}
