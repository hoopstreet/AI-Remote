const fs = require('fs');
const path = require('path');

function getGlobalFailures() {
    try {
        const logs = fs.readFileSync(path.join(__dirname, '../../docs/CHANGELOG.md'), 'utf8');
        return logs.match(/FAILED:.*/g) || [];
    } catch (e) { return []; }
}

function analyzeArchitecture() {
    const failures = getGlobalFailures();
    const clusters = { AUTH: 0, DB: 0, API: 0 };
    
    failures.forEach(f => {
        if (f.includes('auth')) clusters.AUTH++;
        if (f.includes('db') || f.includes('supabase')) clusters.DB++;
        if (f.includes('api') || f.includes('network')) clusters.API++;
    });

    let report = "🧠 *ARCHITECTURE EVOLUTION REPORT*\n---\n";
    let evolutionNeeded = false;

    for (const [key, count] of Object.entries(clusters)) {
        if (count >= 3) {
            evolutionNeeded = true;
            report += `⚠️ *Systemic Issue:* ${key} layer has ${count} failures.\n💡 *Proposal:* Implement centralized ${key} controller.\n`;
        }
    }

    return evolutionNeeded ? report : "✅ *Architecture Stable:* No systemic patterns detected.";
}

module.exports = { analyzeArchitecture };
