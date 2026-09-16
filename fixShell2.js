const fs = require('fs');
let content = fs.readFileSync('components/layout/DashboardShell.tsx', 'utf8');

// The issue: ROLE_LABEL was mangled. Let's find the broken segment and replace it.
const broken = `const ROLE_LABEL: Record<UserRole, string> = {
  petani: "Petani & Penyuling",
  }, []);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex">`;

const fixed = `const ROLE_LABEL: Record<UserRole, string> = {
  petani: "Petani & Penyuling",
  umkm: "Seller Panel",
  buyer: "Buyer Panel",
  peneliti: "Peneliti ARC-USK",
  pemasta: "Pemasta Node",
};

export function DashboardShell({ role: roleProp, children }: { role?: UserRole; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const role: UserRole = roleProp ?? (user?.role as UserRole) ?? "buyer";
  const navItems = NAV_BY_ROLE[role] ?? [];
  const [lang, setLang] = useState<"ID"|"EN">("ID");
  
  useEffect(() => {
    setLang(getLang() as "ID"|"EN");
    return subscribeLang(() => setLang(getLang() as "ID"|"EN"));
  }, []);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex">`;

content = content.replace(broken, fixed);
fs.writeFileSync('components/layout/DashboardShell.tsx', content, 'utf8');
console.log("Done. Replaced:", content.includes('umkm: "Seller Panel"'));
