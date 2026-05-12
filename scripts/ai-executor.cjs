const fs = require('fs');

async function runTask(task) {
  console.log("--- [PHASE 2: AI EXECUTION] ---");
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "google/gemini-2.0-pro-exp-02-05:free",
      "messages": [
        { "role": "system", "content": "You are an expert dev. Output ONLY the raw code for the requested file. No markdown." },
        { "role": "user", "content": `Task: ${task}` }
      ]
    })
  });
  const data = await response.json();
  const code = data.choices[0].message.content;
  
  // Deterministic output path based on Task.md requirements
  fs.writeFileSync('src/status.js', code);
  console.log("File src/status.js created successfully.");
}

const taskDescription = process.argv[2] || "Create a simple status file";
runTask(taskDescription);
