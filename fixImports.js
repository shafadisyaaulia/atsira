const fs = require('fs');
let content = fs.readFileSync('app/dashboard/pemasta/page.tsx', 'utf8');

content = content.replace(/import \{ Globe, LogOut, Users \} from "lucide-react";\n/g, "");
content = content.replace(/import Link from "next\/link";\nimport \{ useAuthStore \} from "@\/lib\/store";\nimport \{ useRouter \} from "next\/navigation";\nimport \{ getLang, subscribeLang, toggleLang \} from "@\/lib\/language";\n/g, "");

const additionalImports = `import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { getLang, subscribeLang, toggleLang } from "@/lib/language";
import { Globe, Users } from "lucide-react";\n`;
content = additionalImports + content;

content = content.replace(
  /subscribeLang\(\(l\) => setLang\(l as "ID"\|"EN"\)\)/g,
  `subscribeLang(() => setLang(getLang() as "ID"|"EN"))`
);

fs.writeFileSync('app/dashboard/pemasta/page.tsx', content, 'utf8');
console.log('Fixed imports and syntax');
