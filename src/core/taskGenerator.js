import { supabase } from './supabase.js';

export const generateTaskReport = async (intent = "general") => {
  console.log(`🧠 [PLANNER] Analyzing intent: ${intent}`);
  
  // High-level structural audit
  const recommendations = [
    { task: "Consolidate handlers/bot.js into bot/telegramBot.js", priority: "High" },
    { task: "Validate GH_TOKEN workflow permissions for /push", priority: "Critical" },
    { task: "Sync SOURCE_MAP.md with new global-intel patterns", priority: "Medium" }
  ];

  const { data, error } = await supabase
    .from('drafts_v2')
    .insert([{ 
      title: `Analysis: ${intent}`, 
      details: JSON.stringify(recommendations), 
      status: "pending" 
    }]);

  if (error) throw new Error(error.message);
  return { status: "Drafted", id: data?.[0]?.id };
};
