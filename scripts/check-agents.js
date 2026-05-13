import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const agentsDir = path.join(__dirname, '../src/agents');
const coreFiles = ['../src/core/orchestrator.js', '../src/core/bot.js'];

console.log("🕵️ Checking Agent Visibility...");

if (fs.existsSync(agentsDir)) {
    fs.readdirSync(agentsDir).forEach(file => {
        console.log(`✅ Agent Found: ${file}`);
    });
} else {
    console.log("❌ Agents directory not found!");
}

console.log("\n🔗 Verifying Core Imports...");
coreFiles.forEach(cf => {
    const filePath = path.join(__dirname, cf);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const imports = content.match(/import.*from.*/g) || [];
        console.log(`📝 ${path.basename(cf)} has ${imports.length} active links.`);
    } else {
        console.log(`❌ Missing File: ${cf}`);
    }
});
