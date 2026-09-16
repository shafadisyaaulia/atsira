const fs = require('fs');

// 1. Update Login redirect
let loginContent = fs.readFileSync('app/(auth)/login/page.tsx', 'utf8');
loginContent = loginContent.replace(
  `if (detectedRole === "umkm") {
      detectedRole = "seller";
    }`,
  `if (detectedRole === "umkm" || detectedRole === "petani") {
      detectedRole = "seller";
    }`
);
fs.writeFileSync('app/(auth)/login/page.tsx', loginContent, 'utf8');

// 2. Update Register redirect
let registerContent = fs.readFileSync('app/(auth)/register/page.tsx', 'utf8');
registerContent = registerContent.replace(
  `if (role === "umkm") dashboardPath = \`/dashboard/seller\`;`,
  `if (role === "umkm" || role === "petani") dashboardPath = \`/dashboard/seller\`;`
);
fs.writeFileSync('app/(auth)/register/page.tsx', registerContent, 'utf8');

// 3. Update DashboardShell to give Petani the seller menu
let shellContent = fs.readFileSync('components/layout/DashboardShell.tsx', 'utf8');

const petaniMenu = `    petani: [
      { label: "Petani Home", href: "/dashboard/seller", icon: LayoutDashboard },
      { label: "AtBot QualitySense (AI)", href: "/dashboard/seller/qualitysense", icon: Sparkles },
      { label: "Minyak Mentah", href: "/dashboard/seller/produk", icon: Store },
      { label: "B2B Sourcing", href: "/dashboard/seller/pengadaan", icon: Package },
      { label: "Pesanan B2B", href: "/dashboard/seller/pesanan", icon: QrCode },
    ],`;

shellContent = shellContent.replace(/petani: \[\s*\{ label: "Dasbor Utama"[^\]]+\]\,/ms, petaniMenu);

fs.writeFileSync('components/layout/DashboardShell.tsx', shellContent, 'utf8');
