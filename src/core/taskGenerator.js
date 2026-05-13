import { supabase } from './supabase.js';

export const generateTaskReport = async (intent) => {
  const draftId = Math.floor(Math.random() * 9000) + 1000;
  
  const { data, error } = await supabase
    .from('drafts_v2')
    .insert([{ 
      id: draftId,
      title: `Task: ${intent.substring(0, 20)}...`, 
      details: intent, 
      status: "pending" 
    }]).select();

  return { 
    id: draftId, 
    recommendation: "💡 Next: 1. Refine Logic | 2. Bundle | 3. Push to GitHub" 
  };
};
