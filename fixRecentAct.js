const fs = require("fs");
let content = fs.readFileSync("app/dashboard/buyer/page.tsx", "utf8");

const injection = `
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  
  // existing useEffect...
`;

content = content.replace("  useEffect(() => {", "  const [recentActivities, setRecentActivities] = useState<any[]>([]);\n\n  useEffect(() => {");

fs.writeFileSync("app/dashboard/buyer/page.tsx", content, "utf8");
console.log("Fixed recentActivities");
