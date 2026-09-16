const fs = require('fs');
let content = fs.readFileSync('app/dashboard/pemasta/page.tsx', 'utf8');

// IMPORTS
if (!content.includes('import Link')) {
  content = content.replace(
    `import { Activity, BookOpen, Calendar, Droplet, FileText, Layers, LayoutDashboard, MapPin, PenSquare, Plus, Sparkles, TrendingUp } from "lucide-react";`,
    `import { Activity, BookOpen, Calendar, Droplet, FileText, Layers, LayoutDashboard, MapPin, PenSquare, Plus, Sparkles, TrendingUp, Users, Globe, LogOut } from "lucide-react";\nimport Link from "next/link";\nimport { useAuthStore } from "@/lib/store";\nimport { useRouter } from "next/navigation";\nimport { getLang, subscribeLang, toggleLang } from "@/lib/language";`
  );
}

// LOGIC
if (!content.includes('const router = useRouter()')) {
  content = content.replace(
    `const [activeMenu, setActiveMenu] = useState<"dashboard" | "story-hub">("dashboard");`,
    `const [activeMenu, setActiveMenu] = useState<"dashboard" | "story-hub">("dashboard");\n  const router = useRouter();\n  const logout = useAuthStore((s) => s.logout);\n  const [lang, setLang] = useState<"ID"|"EN">("ID");\n  useEffect(() => { setLang(getLang() as "ID"|"EN"); const unsub = subscribeLang((l) => setLang(l as "ID"|"EN")); return unsub; }, []);`
  );
}

fs.writeFileSync('app/dashboard/pemasta/page.tsx', content, 'utf8');
console.log('Added imports and logic');
