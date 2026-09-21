const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const fileMap = new Map();
walkDir(".", (filePath) => {
  if (filePath.includes("node_modules") || filePath.includes(".git")) return;
  fileMap.set(filePath.replace(/\\/g, "/").toLowerCase(), filePath.replace(/\\/g, "/"));
});

let issues = [];
walkDir(".", (filePath) => {
  if (filePath.includes("node_modules") || filePath.includes(".git")) return;
  if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) return;
  
  const content = fs.readFileSync(filePath, "utf8");
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    let importPath = match[1];
    if (importPath.startsWith("@/") || importPath.startsWith("./") || importPath.startsWith("../")) {
      // Very basic check, skipping complex alias resolution for now
      // Just check if the file literally exists with exact casing
      // Let's do a simple check for components/ui since it's the most common
      if (importPath.startsWith("@/components/ui/")) {
        const expected = "components/ui/" + importPath.split("/").pop();
        const expectedLower = expected.toLowerCase();
        
        let found = false;
        for (let [lowerKey, realPath] of fileMap.entries()) {
          if (lowerKey.endsWith(expectedLower + ".tsx") || lowerKey.endsWith(expectedLower + ".ts")) {
            found = true;
            // Check exact casing
            const realName = realPath.split("/").pop().replace(".tsx", "").replace(".ts", "");
            const importedName = importPath.split("/").pop();
            if (realName !== importedName) {
              issues.push(`Mismatch in ${filePath}: imported '${importedName}', real file is '${realName}'`);
            }
          }
        }
      }
    }
  }
});
console.log("Casing issues found:");
console.log(issues.join("\n") || "None");
