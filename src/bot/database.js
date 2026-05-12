const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../../.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function logTaskToDB(task) {
    const { data, error } = await supabase
        .from('tasks') // Ensure your table is named 'tasks'
        .insert([{ content: task, status: 'pending', created_at: new Date() }]);
    return { data, error };
}

module.exports = { logTaskToDB };
