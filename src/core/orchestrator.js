import { analyze } from "../agents/security.js";
import { check } from "../agents/reviewer.js";

const planner = { generate: async (i) => "Plan: " + i };
const devops = { prepare: async () => ({ status: "ready" }) };

export async function runAgents(input, context) {
  console.log("--- Starting CTO Pipeline ---");
  const plan = await planner.generate(input, context);
  const review = await check(plan);
  const risk = analyze(plan);
  return { plan, review, risk };
}
