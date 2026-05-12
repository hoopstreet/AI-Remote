const axios = require("axios");

async function reviewTask(taskContent) {
    const prompt = `You are a Senior DevOps Reviewer. Analyze this Task.md for errors or risks: \n\n${taskContent}`;
    
    const res = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
    }, {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
    });
    
    return res.data.choices[0].message.content;
}

module.exports = { reviewTask };
