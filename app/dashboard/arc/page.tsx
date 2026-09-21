"use client";

import { useState, useEffect } from "react";
import { 
  Activity, Beaker, FileBadge2, FlaskConical, LogOut, Globe, Search, Filter, CheckCircle, Clock, FileText, Sparkles, Users
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { useAuthStore, useArcStore } from "@/lib/store";
import { toggleLang, getLang, subscribeLang } from "@/lib/language";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import CoAPDFButton, { CoAData } from "@/components/shared/CoAPDFButton";

const T_ARC = {
  overview: { ID: "Ringkasan", EN: "Overview" },
  manifest: { ID: "Manifes Sampel", EN: "Sample Manifest" },
  coa: { ID: "Pusat Sertifikat", EN: "Certificate Center" },
  research: { ID: "Publikasi Riset", EN: "Research Hub" },
  
  headerOverview: { ID: "Dashboard Operasional ARC", EN: "ARC Operational Dashboard" },
  headerManifest: { ID: "Manifes Sampel Uji", EN: "Test Sample Manifest" },
  headerCoa: { ID: "Pusat Penerbitan Sertifikat (CoA)", EN: "Certificate Issuance Center (CoA)" },
  headerResearch: { ID: "Publikasi Riset & Jurnal", EN: "Research & Journal Publications" },
  
  descOverview: { ID: "Ringkasan metrik laboratorium dan aktivitas terbaru.", EN: "Summary of laboratory metrics and recent activities." },
  descManifest: { ID: "Kelola antrean sampel minyak nilam dari petani dan mitra.", EN: "Manage patchouli oil sample queues from farmers and partners." },
  descCoa: { ID: "Terbitkan dan kelola Certificate of Analysis resmi ARC-USK.", EN: "Issue and manage official ARC-USK Certificate of Analysis." },
  descResearch: { ID: "Bagikan temuan riset laboratorium sebagai edukasi petani.", EN: "Share laboratory research findings as farmer education." },

  statTotal: { ID: "Total Sampel", EN: "Total Samples" },
  statWait: { ID: "Menunggu Uji", EN: "Awaiting Test" },
  statTest: { ID: "Dalam Pengujian", EN: "In Testing" },
  statDone: { ID: "Sertifikat Terbit", EN: "Certificates Issued" },
  
  urgent: { ID: "Sampel Paling Mendesak", EN: "Most Urgent Samples" },
  processBtn: { ID: "Proses", EN: "Process" },
  noUrgent: { ID: "Tidak ada sampel mendesak.", EN: "No urgent samples." },
  
  recentAct: { ID: "Aktivitas Terakhir", EN: "Recent Activities" },
  issueCoaStr1: { ID: "Menerbitkan CoA", EN: "Issued CoA" },
  issueCoaStr2: { ID: "untuk batch", EN: "for batch" },
  
  searchPl: { ID: "Cari Batch ID atau Nama...", EN: "Search Batch ID or Name..." },
  filterAll: { ID: "Semua Status", EN: "All Status" },
  
  thBatch: { ID: "Batch ID", EN: "Batch ID" },
  thGroup: { ID: "Kelompok", EN: "Group" },
  thDate: { ID: "Tanggal", EN: "Date" },
  thStatus: { ID: "Status", EN: "Status" },
  thAction: { ID: "Ubah Status", EN: "Change Status" },
  
  sWait: { ID: "Menunggu", EN: "Waiting" },
  sTest: { ID: "Dalam Pengujian", EN: "In Testing" },
  sVerif: { ID: "Terverifikasi", EN: "Verified" },
  sReject: { ID: "Ditolak", EN: "Rejected" },
  noData: { ID: "Tidak ada data yang cocok.", EN: "No matching data." },

  formTitle: { ID: "Form Penerbitan Sertifikat", EN: "Certificate Issuance Form" },
  fBatch: { ID: "Batch ID *", EN: "Batch ID *" },
  fName: { ID: "Nama Petani", EN: "Farmer Name" },
  fParam: { ID: "Parameter Hasil Lab", EN: "Lab Result Parameters" },
  fPa: { ID: "Kadar PA (%) *", EN: "PA Level (%) *" },
  fMethod: { ID: "Metode *", EN: "Method *" },
  fColor: { ID: "Warna", EN: "Color" },
  fAcid: { ID: "Bilangan Asam", EN: "Acid Number" },
  fBtn: { ID: "Generate & Simpan CoA", EN: "Generate & Save CoA" },
  
  repoTitle: { ID: "Repositori Sertifikat", EN: "Certificate Repository" },
  
  rComingSoon: { ID: "Fasilitas ini sedang disiapkan menjadi repositori ilmiah publik. Nantinya ARC dapat mempublikasikan temuan metode distilasi agar diakses langsung oleh petani melalui atSira.", EN: "This facility is being prepared as a public scientific repository. Later ARC can publish new distillation methods to be accessed directly by farmers via atSira." },
  rBtn: { ID: "Fitur Segera Hadir (Tahap 2)", EN: "Coming Soon (Phase 2)" },
  
  sidebarRole: { ID: "Laboratorium Pusat", EN: "Central Laboratory" },
  signOut: { ID: "Keluar", EN: "Sign Out" },
};

const MOCK_LAB_QUEUE = [
  { id: "BCH-092", nodeName: "Kelompok Suling Jaya", status: "Menunggu", date: "2026-09-12", region: "Aceh Selatan" },
  { id: "BCH-071", nodeName: "Koperasi Nilam Babahrot", status: "Dalam Pengujian", date: "2026-09-11", region: "Aceh Barat" },
  { id: "BCH-068", nodeName: "Suling Murni Gayo", status: "Terverifikasi", date: "2026-09-10", region: "Gayo" },
];

const MOCK_COAS: CoAData[] = [
  {
    id: "COA-2026-001", batch_id: "BCH-068", product_name: "Minyak Nilam Mentah",
    farmer_name: "Mahmud", region: "Gayo", pa_level: 33.5, acid_number: 3.2,
    density: 0.95, color: "Kuning Muda", viscosity: "Cair", method: "GC-MS",
    confidence_score: 98, grade: "Grade A", notes: "Sesuai standar ekspor SNI",
    issued_by: "ARC-USK", analyzed_at: "2026-09-11",
  },
];

type MenuType = "overview" | "manifes" | "coa" | "riset";

function StatusBadge({ status, lang }: { status: string, lang: "ID" | "EN" }) {
  const cls =
    status === "Menunggu" ? "bg-amber-100 text-amber-800 border border-amber-200" :
    status === "Dalam Pengujian" ? "bg-purple-100 text-purple-800 border border-purple-200" :
    status === "Terverifikasi" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
    "bg-red-100 text-red-800 border border-red-200";
    
  let display = status;
  if (lang === "EN") {
    if (status === "Menunggu") display = "Waiting";
    else if (status === "Dalam Pengujian") display = "In Testing";
    else if (status === "Terverifikasi") display = "Verified";
    else if (status === "Ditolak") display = "Rejected";
  }
  return <span className={cls + " px-2.5 py-1 text-[10px] font-bold rounded-full shadow-sm"}>{display}</span>;
}

export default function ArcDashboard() {
  const [activeMenu, setActiveMenu] = useState<MenuType>("overview");
  const { queue, coas, updateStatus, addCoa } = useArcStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [lang, setLang] = useState<"ID"|"EN">("ID");

  const handleLogout = () => {
    logout();
    router.push("/");
  };
  const [searchManifes, setSearchManifes] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [coaForm, setCoaForm] = useState<Partial<CoAData>>({ pa_level: 0, method: "GC-MS" });

  useEffect(() => {
    setLang(getLang() as "ID"|"EN");
    return subscribeLang(() => setLang(getLang() as "ID"|"EN"));
  }, []);

  const handleUpdateStatus = (id: string, val: string) => updateStatus(id, val as any);

  const handleIssueCoa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coaForm.pa_level || !coaForm.batch_id) return;
    const pa = coaForm.pa_level || 0;
    const grade = pa >= 32 ? "Grade A" : pa >= 30 ? "Grade B" : "Grade C";
    const newCoa: CoAData = {
      id: "COA-2026-" + Math.floor(Math.random() * 9000 + 1000),
      batch_id: coaForm.batch_id || "",
      product_name: coaForm.product_name || "Minyak Nilam",
      farmer_name: coaForm.farmer_name || "",
      region: coaForm.region || "",
      pa_level: pa,
      acid_number: coaForm.acid_number,
      density: coaForm.density,
      color: coaForm.color || "",
      viscosity: coaForm.viscosity || "",
      method: coaForm.method || "GC-MS",
      confidence_score: 95 + Math.floor(Math.random() * 5),
      grade,
      notes: coaForm.notes || "",
      issued_by: "ARC-USK",
      analyzed_at: new Date().toISOString(),
    };
    addCoa(newCoa);
    setCoaForm({ pa_level: 0, method: "GC-MS" });
    alert(lang === "ID" ? "Sertifikat CoA berhasil diterbitkan! Notifikasi telah dikirim ke petani." : "CoA Certificate issued successfully! Notification sent to farmer.");
  };

  const filteredQueue = queue.filter(
    (q) =>
      (filterStatus === "Semua" || q.status === filterStatus) &&
      (q.id.toLowerCase().includes(searchManifes.toLowerCase()) ||
        q.nodeName.toLowerCase().includes(searchManifes.toLowerCase()))
  );

  const menuItems: { id: MenuType; labelID: string; labelEN: string; icon: typeof Activity }[] = [
    { id: "overview", labelID: T_ARC.overview.ID, labelEN: T_ARC.overview.EN, icon: Activity },
    { id: "manifes", labelID: T_ARC.manifest.ID, labelEN: T_ARC.manifest.EN, icon: FlaskConical },
    { id: "coa", labelID: T_ARC.coa.ID, labelEN: T_ARC.coa.EN, icon: FileBadge2 },
    { id: "riset", labelID: T_ARC.research.ID, labelEN: T_ARC.research.EN, icon: Beaker },
  ];

  return (
    <div className="flex min-h-screen bg-surface-container-lowest text-stone-900 font-body relative overflow-hidden">
      
      {/* Decorative background elements for styling */}
      <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-emerald-900/10 via-emerald-800/5 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200/20 blur-3xl rounded-full pointer-events-none" />

      {/* SIDEBAR */}
      <aside className="w-72 bg-white/70 backdrop-blur-3xl border-r border-stone-200/80 p-6 flex-col justify-between hidden md:flex fixed h-full z-30 shadow-sm">
        <div className="space-y-8">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-amber-400 font-black font-display text-xl shadow-lg shadow-emerald-900/20 border border-emerald-900">ARC</div>
            <div>
              <span className="font-display font-black text-stone-900 text-base block tracking-tight">atSira ARC</span>
              <span className="text-[10px] text-emerald-700 font-extrabold block uppercase tracking-widest">{T_ARC.sidebarRole[lang]}</span>
            </div>
          </div>
          <nav className="space-y-2 mt-4">
            {menuItems.map((menu) => {
              const Icon = menu.icon;
              const isActive = activeMenu === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => setActiveMenu(menu.id)}
                  className={
                    "w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold rounded-2xl transition-all duration-300 " +
                    (isActive ? "bg-emerald-700 text-white shadow-md shadow-emerald-900/20 translate-x-1" : "text-stone-500 hover:bg-stone-100/80 hover:text-stone-900")
                  }
                >
                  <Icon className={"w-4.5 h-4.5 " + (isActive ? "text-emerald-200" : "text-stone-400")} />
                  {lang === "ID" ? menu.labelID : menu.labelEN}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-stone-200/60 pt-6 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-stone-100/50 rounded-2xl border border-stone-200/60 shadow-sm mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-stone-200 to-stone-300 rounded-full flex items-center justify-center font-bold text-emerald-900 text-sm shadow-inner border border-stone-200">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black text-stone-900 truncate">{user?.name || "Dr. Analis"}</p>
              <p className="text-[10px] text-stone-500 truncate font-semibold">ARC-USK Validator</p>
            </div>
          </div>
          <button
            onClick={toggleLang}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-300 bg-amber-50/50 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors shadow-sm w-full"
          >
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            <span>{lang === "ID" ? "🇮🇩 ID" : "🇺🇸 EN"}</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-100/50 hover:border-red-200"
          >
            <LogOut className="w-4 h-4" />
            {T_ARC.signOut[lang]}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-72 p-8 md:p-12 min-h-screen relative z-10">
        <header className="mb-10 pb-6 border-b border-stone-200/60 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2.5 bg-white/80 shadow-sm border border-stone-200/50 backdrop-blur-sm rounded-xl">
                 {activeMenu === "overview" && <Activity className="w-6 h-6 text-emerald-700" />}
                 {activeMenu === "manifes" && <FlaskConical className="w-6 h-6 text-emerald-700" />}
                 {activeMenu === "coa" && <FileBadge2 className="w-6 h-6 text-emerald-700" />}
                 {activeMenu === "riset" && <Beaker className="w-6 h-6 text-emerald-700" />}
              </div>
              <h1 className="text-3xl font-black font-display text-emerald-950 tracking-tight">
                {activeMenu === "overview" && T_ARC.headerOverview[lang]}
                {activeMenu === "manifes" && T_ARC.headerManifest[lang]}
                {activeMenu === "coa" && T_ARC.headerCoa[lang]}
                {activeMenu === "riset" && T_ARC.headerResearch[lang]}
              </h1>
            </div>
            <p className="text-sm text-stone-500 font-medium ml-[68px]">
              {activeMenu === "overview" && T_ARC.descOverview[lang]}
              {activeMenu === "manifes" && T_ARC.descManifest[lang]}
              {activeMenu === "coa" && T_ARC.descCoa[lang]}
              {activeMenu === "riset" && T_ARC.descResearch[lang]}
            </p>
          </div>
          
          <Link href="/dashboard/community" className="group flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 text-emerald-900 px-5 py-2.5 rounded-full border border-emerald-300 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 mt-2">
            <Users className="w-4 h-4 text-emerald-700 group-hover:text-emerald-900" />
            <span className="text-xs font-black tracking-wide">atSira Connect</span>
          </Link>
        </header>

        {/* OVERVIEW */}
        {activeMenu === "overview" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: T_ARC.statTotal[lang], value: queue.length, icon: FileText, color: "text-blue-700 bg-blue-50 border-blue-200" },
                { label: T_ARC.statWait[lang], value: queue.filter((q) => q.status === "Menunggu").length, icon: Clock, color: "text-amber-700 bg-amber-50 border-amber-200" },
                { label: T_ARC.statTest[lang], value: queue.filter((q) => q.status === "Dalam Pengujian").length, icon: FlaskConical, color: "text-purple-700 bg-purple-50 border-purple-200" },
                { label: T_ARC.statDone[lang], value: coas.length, icon: CheckCircle, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="p-6 bg-white/70 backdrop-blur-xl border border-stone-200/80 shadow-sm hover:shadow-md rounded-3xl flex items-start justify-between transition-all group">
                    <div>
                      <p className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-4xl font-black mt-2 text-stone-800 tracking-tighter group-hover:text-emerald-900 transition-colors">{stat.value}</p>
                    </div>
                    <div className={"w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm " + stat.color}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </Card>
                );
              })}
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-7 rounded-3xl shadow-sm border border-stone-200/60 bg-white/80 backdrop-blur-xl">
                <h3 className="text-xs font-black text-stone-800 uppercase tracking-widest mb-5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" /> {T_ARC.urgent[lang]}
                </h3>
                <div className="space-y-3">
                  {queue
                    .filter((q) => q.status === "Menunggu")
                    .map((q) => (
                      <div key={q.id} className="flex items-center justify-between p-4 rounded-2xl border border-stone-100 hover:bg-white hover:border-emerald-100 hover:shadow-sm transition-all group">
                        <div>
                          <p className="text-sm font-black text-stone-900 group-hover:text-emerald-700 transition-colors">{q.id}</p>
                          <p className="text-[11px] font-bold text-stone-500 mt-0.5">{q.nodeName} &bull; {q.region}</p>
                        </div>
                        <button onClick={() => setActiveMenu("manifes")} className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-4 py-2 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                          {T_ARC.processBtn[lang]}
                        </button>
                      </div>
                    ))}
                  {queue.filter((q) => q.status === "Menunggu").length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 opacity-60">
                      <CheckCircle className="w-10 h-10 text-emerald-500 mb-3" />
                      <p className="text-sm font-bold text-stone-600">{T_ARC.noUrgent[lang]}</p>
                    </div>
                  )}
                </div>
              </Card>
              
              <Card className="p-7 rounded-3xl shadow-sm border border-stone-200/60 bg-white/80 backdrop-blur-xl">
                <h3 className="text-xs font-black text-stone-800 uppercase tracking-widest mb-5 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" /> {T_ARC.recentAct[lang]}
                </h3>
                <div className="space-y-5">
                  {coas.slice(0, 3).map((c) => (
                    <div key={c.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <FileBadge2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-sm text-stone-700 font-medium leading-snug">
                          {T_ARC.issueCoaStr1[lang]} <span className="font-black text-emerald-800">{c.id}</span> {T_ARC.issueCoaStr2[lang]} <span className="font-black text-stone-900">{c.batch_id}</span>.
                        </p>
                        <p className="text-[11px] font-bold text-stone-400 mt-1">
                          {c.analyzed_at ? new Date(c.analyzed_at).toLocaleDateString(lang === "ID" ? "id-ID" : "en-US", { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* MANIFES */}
        {activeMenu === "manifes" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row gap-4 bg-white/70 backdrop-blur-xl p-5 rounded-3xl shadow-sm border border-stone-200/60 items-center justify-between">
              <div className="relative w-full md:w-[400px]">
                <Search className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <Input
                  placeholder={T_ARC.searchPl[lang]}
                  className="pl-11 h-12 text-sm font-medium rounded-2xl bg-white border-stone-200 focus:border-emerald-500 shadow-sm transition-colors"
                  value={searchManifes}
                  onChange={(e) => setSearchManifes(e.target.value)}
                />
              </div>
              <div className="flex gap-3 items-center w-full md:w-auto bg-white p-1.5 rounded-2xl border border-stone-200 shadow-sm">
                <div className="pl-3">
                  <Filter className="w-4 h-4 text-stone-400" />
                </div>
                <select
                  className="text-xs font-bold border-none bg-transparent py-2.5 pr-4 outline-none text-stone-700 cursor-pointer"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="Semua">{T_ARC.filterAll[lang]}</option>
                  <option value="Menunggu">{T_ARC.sWait[lang]}</option>
                  <option value="Dalam Pengujian">{T_ARC.sTest[lang]}</option>
                  <option value="Terverifikasi">{T_ARC.sVerif[lang]}</option>
                </select>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-stone-200/60 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50/90 border-b border-stone-200/60">
                  <tr>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-stone-500 tracking-widest">{T_ARC.thBatch[lang]}</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-stone-500 tracking-widest">{T_ARC.thGroup[lang]}</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-stone-500 tracking-widest">{T_ARC.thDate[lang]}</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-stone-500 tracking-widest">{T_ARC.thStatus[lang]}</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-stone-500 tracking-widest text-right">{T_ARC.thAction[lang]}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-emerald-50/40 transition-colors group">
                      <td className="px-6 py-5 font-mono text-sm font-black text-emerald-900">{item.id}</td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-stone-800">{item.nodeName}</p>
                        <p className="text-[11px] font-medium text-stone-500 mt-0.5">{item.region}</p>
                      </td>
                      <td className="px-6 py-5 text-xs font-semibold text-stone-600">{item.date}</td>
                      <td className="px-6 py-5"><StatusBadge status={item.status} lang={lang} /></td>
                      <td className="px-6 py-5 text-right flex items-center justify-end gap-2">
                        <select
                          className="text-[11px] font-bold border border-stone-200 rounded-xl px-3 py-2 bg-stone-50 cursor-pointer hover:border-emerald-500 hover:bg-white outline-none transition-colors focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                          value={item.status}
                          onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                        >
                          <option value="Menunggu">{T_ARC.sWait[lang]}</option>
                          <option value="Dalam Pengujian">{T_ARC.sTest[lang]}</option>
                          <option value="Terverifikasi">{T_ARC.sVerif[lang]}</option>
                          <option value="Ditolak">{T_ARC.sReject[lang]}</option>
                        </select>
                        
                        {(item.status === "Menunggu" || item.status === "Dalam Pengujian") && (
                          <button
                            onClick={() => {
                              setActiveMenu("coa");
                              setCoaForm({
                                ...coaForm,
                                batch_id: item.id,
                                farmer_name: item.nodeName,
                                region: item.region
                              });
                            }}
                            className="bg-amber-100 text-amber-800 hover:bg-amber-200 px-3 py-2 rounded-xl text-[11px] font-bold transition-colors border border-amber-200 shadow-sm"
                          >
                            Buat CoA
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredQueue.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm font-medium text-stone-400">
                        <div className="flex flex-col items-center justify-center">
                          <Search className="w-8 h-8 mb-3 opacity-20" />
                          {T_ARC.noData[lang]}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COA */}
        {activeMenu === "coa" && (
          <div className="grid xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="xl:col-span-2">
              <Card className="p-8 rounded-3xl shadow-sm border border-stone-200/60 bg-white/80 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stone-100">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center border border-emerald-200/50">
                    <FileBadge2 className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h2 className="text-lg font-black text-stone-800 tracking-tight">
                    {T_ARC.formTitle[lang]}
                  </h2>
                </div>
                
                <form onSubmit={handleIssueCoa} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[11px] font-black text-stone-500 uppercase tracking-widest mb-2 block">{T_ARC.fBatch[lang]}</label>
                      <select 
                        required
                        className="w-full h-12 border border-stone-200 rounded-2xl px-4 font-bold text-sm bg-white shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={coaForm.batch_id || ""}
                        onChange={(e) => {
                          const batchId = e.target.value;
                          const selected = queue.find(q => q.id === batchId);
                          setCoaForm({ 
                            ...coaForm, 
                            batch_id: batchId, 
                            farmer_name: selected ? selected.nodeName : "",
                            region: selected ? selected.region : ""
                          });
                        }}
                      >
                        <option value="" disabled>-- {lang === "ID" ? "Pilih Batch dari Antrean" : "Select Batch from Queue"} --</option>
                        {queue.filter(q => q.status !== "Terverifikasi" && q.status !== "Ditolak").map(q => (
                          <option key={q.id} value={q.id}>{q.id} - {q.nodeName}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-stone-500 uppercase tracking-widest mb-2 block">{T_ARC.fName[lang]}</label>
                      <Input placeholder={lang === "ID" ? "Nama penyuling..." : "Distiller name..."} className="h-12 text-sm font-medium rounded-2xl bg-white border-stone-200 shadow-sm"
                        value={coaForm.farmer_name || ""}
                        onChange={(e) => setCoaForm({ ...coaForm, farmer_name: e.target.value })} />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-stone-50 to-stone-100/50 p-7 rounded-3xl border border-stone-200/60 space-y-6 shadow-inner">
                    <p className="text-[11px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg inline-flex shadow-sm border border-stone-200/50">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {T_ARC.fParam[lang]}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2 block">{T_ARC.fPa[lang]}</label>
                        <Input type="number" step="0.01" required className="h-12 text-lg font-black text-emerald-900 bg-white rounded-2xl shadow-inner border-stone-200" placeholder="32.50"
                          value={coaForm.pa_level || ""}
                          onChange={(e) => setCoaForm({ ...coaForm, pa_level: parseFloat(e.target.value) || 0 })} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2 block">{T_ARC.fMethod[lang]}</label>
                        <select className="w-full h-12 border border-stone-200 rounded-2xl px-4 font-bold text-sm bg-white shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={coaForm.method}
                          onChange={(e) => setCoaForm({ ...coaForm, method: e.target.value })}>
                          <option value="GC-MS">GC-MS</option>
                          <option value="HPLC">HPLC</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2 block">{T_ARC.fColor[lang]}</label>
                        <Input placeholder={lang === "ID" ? "Kuning pucat" : "Pale yellow"} className="h-12 text-sm font-medium rounded-2xl bg-white shadow-sm border-stone-200"
                          value={coaForm.color || ""}
                          onChange={(e) => setCoaForm({ ...coaForm, color: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2 block">{T_ARC.fAcid[lang]}</label>
                        <Input type="number" step="0.01" placeholder="3.5" className="h-12 text-sm font-mono rounded-2xl bg-white shadow-sm border-stone-200"
                          value={coaForm.acid_number || ""}
                          onChange={(e) => setCoaForm({ ...coaForm, acid_number: parseFloat(e.target.value) || undefined })} />
                      </div>
                    </div>
                  </div>
                  
                  <button type="submit" className="w-full flex justify-center items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm py-4 rounded-2xl transition-all shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:-translate-y-0.5">
                    <FileBadge2 className="w-5 h-5" /> {T_ARC.fBtn[lang]}
                  </button>
                </form>
              </Card>
            </div>
            
            <div className="space-y-5">
              <h3 className="text-xs font-black text-stone-800 uppercase tracking-widest pl-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" /> {T_ARC.repoTitle[lang]}
              </h3>
              <div className="space-y-4">
                {coas.map((coa) => (
                  <div key={coa.id} className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-stone-200/60 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-black text-stone-900 tracking-tight group-hover:text-emerald-800 transition-colors">{coa.id}</p>
                        <p className="text-[11px] font-bold text-stone-500 mt-1">Batch: {coa.batch_id} &bull; <span className="text-emerald-700">{coa.pa_level}% PA</span></p>
                      </div>
                      <span className={
                        "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm border " +
                        (coa.grade === "Grade A" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                         coa.grade === "Grade B" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200")
                      }>
                        {coa.grade}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-stone-100">
                      <CoAPDFButton data={coa} variant="button" className="w-full h-10 text-xs font-bold rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RISET */}
        {activeMenu === "riset" && (
          <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            <Card className="p-12 rounded-[3rem] shadow-sm border border-stone-200/60 bg-white/80 backdrop-blur-xl text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mb-6 shadow-inner border border-amber-300/50">
                <Beaker className="w-10 h-10 text-amber-600" />
              </div>
              <h2 className="text-3xl font-black text-stone-900 font-display mb-4 tracking-tight">{T_ARC.headerResearch[lang]}</h2>
              <p className="text-base text-stone-500 max-w-xl mb-8 leading-relaxed font-medium">
                {T_ARC.rComingSoon[lang]}
              </p>
              <div className="px-8 py-4 bg-stone-100 border border-stone-200 text-stone-400 text-sm font-black uppercase tracking-widest rounded-2xl shadow-inner">
                {T_ARC.rBtn[lang]}
              </div>
            </Card>
          </div>
        )}

      </main>
    </div>
  );
}
