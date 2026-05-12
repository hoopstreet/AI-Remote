const { exec } = require('child_process');
const fs = require('fs');
const https = require('https');

// Manual .env loader
const config = {};
try {
  const envData = fs.readFileSync('.env', 'utf8');
  envData.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length > 0) config[key.trim()] = val.join('=').replace(/"/g, '').trim();
  });
} catch (e) { console.log("Env error"); }

const TOKEN = config.TELEGRAM_BOT_TOKEN;
let lastUpdateId = 0;

function sendMsg(id, text) {
  const data = JSON.stringify({ chat_id: id, text: text });
  const req = https.request(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  req.write(data);
  req.end();
}

function poll() {
  https.get(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${lastUpdateId + 1}`, (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.result) {
          json.result.forEach(upd => {
            lastUpdateId = upd.update_id;
            const msg = upd.message;
            if (!msg || !msg.text) return;

            if (msg.text.startsWith('/task')) {
              const task = msg.text.replace('/task', '').trim();
              sendMsg(msg.chat.id, `🛠 Processing: ${task}`);
              exec(`sh scripts/orchestrator.sh "${task}"`, (err, stdout) => {
                sendMsg(msg.chat.id, `分析结果:\n${stdout || 'Done.'}\n\n/confirm to deploy.`);
              });
            } else if (msg.text === '/confirm') {
              sendMsg(msg.chat.id, "🚀 Pushing to GitHub...");
              exec('sh scripts/push.sh', (err, stdout, stderr) => {
                if (err) sendMsg(msg.chat.id, `❌ Failed: ${stderr}`);
                else sendMsg(msg.chat.id, "✅ Pushed successfully!");
              });
            }
          });
        }
      } catch (e) {}
      setTimeout(poll, 1000);
    });
  }).on('error', () => setTimeout(poll, 5000));
}

console.log("🚀 Ultra-Lightweight Bot Started...");
poll();
