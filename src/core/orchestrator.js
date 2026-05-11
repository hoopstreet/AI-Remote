import { analyze } from "../agents/security.js";
import { check } from "../agents/reviewer.js";
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function getAIResponse(prompt) {
    try {
        const res = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "google/gemini-2.0-flash-001",
            messages: [{ role: "user", content: prompt }]
        }, {
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        return res.data.choices[0].message.content;
    } catch (e) {
        return "AI Logic Error: " + e.message;
    }
}

export async function runAgents(input, context) {
    console.log("--- Executing AI CTO Agent ---");
    
    // Step 1: Planner (OpenRouter)
    const plan = await getAIResponse(`Task: ${input}. Create a technical implementation plan for this repo.`);
    
    // Step 2: Security Agent (Local Logic)
    const risk = analyze(input);
    
    // Step 3: Reviewer Agent (Local Logic)
    const review = await check(plan);
    
    return { plan, review, risk };
}
