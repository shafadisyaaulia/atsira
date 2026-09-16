const fs = require('fs');
let content = fs.readFileSync('app/dashboard/pemasta/page.tsx', 'utf8');
content = content.replace(
  `BookOpen, FileText, Plus, TrendingUp,`,
  `BookOpen, FileText, Plus,`
);
fs.writeFileSync('app/dashboard/pemasta/page.tsx', content, 'utf8');
console.log('Fixed');
