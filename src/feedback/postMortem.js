const axios = require("axios");

async function analyzeFailure(taskId, errorLogs) {
    const prompt = `Analyze this failure for Task ID ${taskId}:\n\n${errorLogs}\n\nIdentify the root cause and provide a "Lesson Learned" for future planning.`;
    
    const res = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
    }, {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
    });
    
    return res.data.choices[0].message.content;
}

module.exports = { analyzeFailure };
