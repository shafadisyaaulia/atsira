const fs = require('fs');
let content = fs.readFileSync('components/layout/DashboardShell.tsx', 'utf8');

// The ROLE_LABEL is broken - needs to be a complete object. Let's fix it.
content = content.replace(
  `const ROLE_LABEL: Record<UserRole, string> = {
  petani: "Petani & Penyuling",
  }, []);`,
  `const ROLE_LABEL: Record<UserRole, string> = {
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
  // Pakai role dari store jika prop tidak diberikan
  const role: UserRole = roleProp ?? (user?.role as UserRole) ?? "buyer";
  const navItems = NAV_BY_ROLE[role] ?? [];
  const [lang, setLang] = useState<"ID"|"EN">("ID");
  
  useEffect(() => {
    setLang(getLang() as "ID"|"EN");
    return subscribeLang(() => setLang(getLang() as "ID"|"EN"));
  }, []);`
);

fs.writeFileSync('components/layout/DashboardShell.tsx', content, 'utf8');
