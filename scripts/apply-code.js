const fs = require('fs');
const path = require('path');

// This script reads the approved changes and applies them
try {
    const approvedPath = path.join(process.cwd(), 'docs/APPROVED_CHANGES.md');
    if (!fs.existsSync(approvedPath)) {
        console.log("No approved changes to apply.");
        process.exit(0);
    }

    const content = fs.readFileSync(approvedPath, 'utf8');
    
    // Simple logic to extract code block (for now)
    const codeMatch = content.match(/CODE:\n([\s\S]*)/);
    if (codeMatch && codeMatch[1]) {
        const codeToApply = codeMatch[1].trim();
        
        // In a real scenario, we'd use AI to determine which file to update.
        // For this test, we will update src/core/engine.js
        const targetFile = path.join(process.cwd(), 'src/core/engine.js');
        fs.mkdirSync(path.dirname(targetFile), { recursive: true });
        fs.writeFileSync(targetFile, codeToApply);
        
        console.log(`✅ Applied code to ${targetFile}`);
    }
} catch (err) {
    console.error("Failed to apply code:", err);
    process.exit(1);
}
