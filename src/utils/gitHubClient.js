const axios = require('axios');
require('dotenv').config();

async function pushFile({ owner, repo, path, content, message }) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const headers = { 
        Authorization: `token ${process.env.GH_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
    };

    try {
        // Get the current file SHA if it exists
        let sha;
        try {
            const getFile = await axios.get(url, { headers });
            sha = getFile.data.sha;
        } catch (e) { sha = null; }

        const response = await axios.put(url, {
            message,
            content: Buffer.from(content).toString('base64'),
            sha
        }, { headers });

        return response.data;
    } catch (error) {
        console.error('GitHub Push Error:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = { pushFile };
