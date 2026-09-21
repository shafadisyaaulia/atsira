const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let badFiles = [];
walkDir("app", (filePath) => {
  if (filePath.endsWith(".tsx") || filePath.endsWith(".ts")) {
    const buffer = fs.readFileSync(filePath);
    // Basic check for UTF-16 LE BOM (FF FE) or UTF-16 BE BOM (FE FF)
    if ((buffer[0] === 0xFF && buffer[1] === 0xFE) || (buffer[0] === 0xFE && buffer[1] === 0xFF)) {
      badFiles.push(filePath);
    }
  }
});
console.log("UTF-16 Files:", badFiles.join(", ") || "None");
