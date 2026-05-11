import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { runAgents } from '../core/orchestrator.js';
dotenv.config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${TOKEN}`;
let lastUpdateId = 0;

function telegramApi(method, data) {
    const dataString = JSON.stringify(data).replace(/'/g, "'\\''");
    const cmd = `curl -s -X POST ${BASE_URL}/${method} -H "Content-Type: application/json" -d '${dataString}'`;
    try {
        const response = execSync(cmd).toString();
        return JSON.parse(response);
    } catch (e) {
        return { ok: false, error: e.message };
    }
}

async function poll() {
    try {
        const response = telegramApi('getUpdates', { offset: lastUpdateId + 1, timeout: 10 });
        
        if (response.ok && response.result) {
            for (const update of response.result) {
                lastUpdateId = update.update_id;
                const message = update.message;
                if (message && message.text) {
                    const chatId = message.chat.id;
                    console.log(`📩 Received via Curl: ${message.text}`);
                    
                    telegramApi('sendMessage', { chat_id: chatId, text: "🧠 *CTO Agents analyzing (CURL Bridge)...*", parse_mode: 'Markdown' });
                    
                    const result = await runAgents(message.text, { repo: 'ai-remote' });
                    const report = `
📊 *CTO ANALYSIS REPORT*
---
🛡 *Security:* ${result.risk}
⚖️ *Review:* ${result.review.status}
📝 *Plan:* ${result.plan}
`;
                    telegramApi('sendMessage', { chat_id: chatId, text: report, parse_mode: 'Markdown' });
                }
            }
        }
    } catch (err) {
        console.error("Bridge Error:", err.message);
    }
    setTimeout(poll, 2000);
}

console.log("🚀 iSH Native-Curl Bridge Active...");
poll();
