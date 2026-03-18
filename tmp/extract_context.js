const fs = require('fs');
const filePath = 'd:/Hokage X Pirate king/VeriLog/frontend/public/circuitverse/simulator-v0.js';
const content = fs.readFileSync(filePath, 'utf8');
const searchString = 'transformCallback';
const index = content.indexOf(searchString);

if (index === -1) {
    console.log('Not found');
} else {
    const start = Math.max(0, index - 1000);
    const end = Math.min(content.length, index + 1000);
    console.log('CONTEXT_START');
    console.log(content.substring(start, end));
    console.log('CONTEXT_END');
}
