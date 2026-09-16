const fs = require('fs');
let content = fs.readFileSync('app/community/page.tsx', 'utf8');

// Replace import
content = content.replace(
  `import { useAuth } from "@/lib/context/AuthContext";`,
  `import { useAuthStore } from "@/lib/store";`
);

// Replace hook usage
content = content.replace(
  `const { user: userName, role: userRole } = useAuth();`,
  `const authUser = useAuthStore(s => s.user);
  const userName = authUser?.name;
  const userRole = authUser?.role;`
);

fs.writeFileSync('app/community/page.tsx', content, 'utf8');
console.log('Fixed Auth in Community page');
