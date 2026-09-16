const fs = require('fs');
let content = fs.readFileSync('app/dashboard/pemasta/page.tsx', 'utf8');

const additionalImports = `import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { getLang, subscribeLang, toggleLang } from "@/lib/language";
import { Globe, LogOut, Users } from "lucide-react";\n`;

if (!content.includes('import Link')) {
  content = additionalImports + content;
}

if (!content.includes('const router = useRouter()')) {
  content = content.replace(
    `const [activeMenu, setActiveMenu] = useState<"dashboard" | "story-hub">("dashboard");`,
    `const [activeMenu, setActiveMenu] = useState<"dashboard" | "story-hub">("dashboard");\n  const router = useRouter();\n  const logout = useAuthStore((s) => s.logout);\n  const [lang, setLang] = useState<"ID"|"EN">("ID");\n  useEffect(() => { setLang(getLang() as "ID"|"EN"); const unsub = subscribeLang((l) => setLang(l as "ID"|"EN")); return unsub; }, []);`
  );
}

fs.writeFileSync('app/dashboard/pemasta/page.tsx', content, 'utf8');
console.log('Added imports prepended');
