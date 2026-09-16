const fs = require('fs');
let content = fs.readFileSync('app/api/analyzer/route.ts', 'utf8');

// Read the whole file to see if @google/genai is there
console.log(content);
