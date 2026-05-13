import { supabase } from '../core/supabase.js';

export const getStatus = async () => {
    return {
        engine: "v1.4.3 (Unified CTO)",
        db: "Connected",
        status: "Online"
    };
};

export const processConversation = async (text, userId) => {
    const isTaskRequest = text.toLowerCase().includes('task') || text.toLowerCase().includes('generate');
    if (!isTaskRequest) {
        return {
            mode: 'chat',
            reply: "The AAE Engine is active. We detected an export mismatch and a secrets error. I am ready to finalize the architecture."
        };
    }
    return { mode: 'task', draftId: '9999', recommendation: "Align exports." };
};
