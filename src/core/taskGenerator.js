const axios = require("axios");
const { searchContext } = require("../memory/vectorStore");
const { getGM } = require("../memory/memory");

async function generateTask(userInput, owner, repo) {
    const context = await searchContext(userInput, `./src/memory/vector-${owner}-${repo}.json`);
    const gm = await getGM();

    const prompt = `
    You are an AI DevOps Task Generator. Your goal is to create a well-structured Task.md file.
    Use the provided context and general memory to generate a COMPLETE Task.md.
    
    GENERAL MEMORY (for formatting and best practices):
    ${JSON.stringify(gm)}

    CONTEXT (relevant to the user's request):
    ${context}

    USER REQUEST:
    ${userInput}

    OUTPUT:
    Return ONLY the content for the Task.md file. Ensure it follows this strict format:

    # TASK ID: T-XXX (Generate a unique ID, e.g., T-001, T-002)
    Priority: (HIGH, MEDIUM, LOW)
    Type: (feature, fix, refactor, chore)
    ## Objective
    (Clear, concise objective)
    ## Context
    (Brief background, current state, why this task is needed, referencing context provided)
    ## Steps
    1. (Detailed, actionable step)
    2. (Another step)
    3. (And so on...)
    ## Validation
    (How to verify the task is complete and correct)
    ## Expected Output
    (What the successful outcome looks like)
    ## Source Reference
    (List relevant files or documents from the context, e.g., DNA.md, auth.js)
    `;

    const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
        }
    );
    return res.data.choices[0].message.content;
}

module.exports = { generateTask };
