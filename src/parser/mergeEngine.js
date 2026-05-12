const axios = require("axios");

async function mergeDrafts(drafts) {
    const combinedContent = drafts.map(d => d.content).join("\n---\n");
    
    const prompt = `You are a Senior Project Manager. Merge the following Task drafts into ONE unified, professional Task.md file. Ensure no duplicate steps and a logical execution order:\n\n${combinedContent}`;
    
    const res = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
    }, {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
    });
    
    return res.data.choices[0].message.content;
}

module.exports = { mergeDrafts };
