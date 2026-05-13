import { bot } from '../core/bot.js';
import { connectProject } from '../context/loader.js';

export function setupCommands() {
    bot.command('connect', async (ctx) => {
        const args = ctx.message.text.split(' ');
        if (args.length < 2) {
            return ctx.reply('❌ Usage: /connect <github_url>');
        }

        const url = args[1];
        const repoName = url.split('/').slice(-2).join('/'); // Extracts 'user/repo'

        ctx.reply(`⏳ Connecting to ${repoName}...`);
        
        const success = await connectProject(repoName, url);
        
        if (success) {
            ctx.reply(`✅ Connected to ${repoName}\nAuto-Indexing DNA & Roadmap...`);
        } else {
            ctx.reply('❌ Connection failed. Check database logs.');
        }
    });

    // Add other commands here as needed
}
