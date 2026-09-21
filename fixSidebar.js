const fs = require('fs');
let content = fs.readFileSync('app/dashboard/pemasta/page.tsx', 'utf8');

const oldSidebar = `<div className="border-t border-stone-100 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 bg-stone-200 rounded-full flex items-center justify-center font-bold text-stone-700 text-sm">KP</div>
            <div>
              <p className="text-xs font-bold text-stone-900">Kelompok Suling Jaya</p>
              <p className="text-[10px] text-stone-400">Petani Mitra ARC</p>
            </div>
          </div>
        </div>`;

const newSidebar = `<div className="border-t border-stone-100 pt-4 space-y-3">
          <Link href="/dashboard/community">
            <button className="w-full flex items-center justify-center gap-2 py-2 px-3 mb-2 rounded-xl bg-emerald-100/50 hover:bg-emerald-100 border border-emerald-200/50 text-emerald-800 text-xs font-bold transition-colors shadow-sm">
              <Users className="w-3.5 h-3.5" /> atSira Connect
            </button>
          </Link>
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/50">
            <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center font-bold text-stone-700 text-xs">KP</div>
            <div>
              <p className="text-xs font-bold text-stone-900">Kelompok Suling</p>
              <p className="text-[10px] text-stone-500">Petani Mitra ARC</p>
            </div>
          </div>
          <button onClick={toggleLang} className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-amber-200 bg-amber-50/50 text-amber-700 text-xs font-bold transition-colors hover:bg-amber-100 shadow-sm">
            <Globe className="w-3.5 h-3.5" /> {lang === "ID" ? "ID" : "EN"}
          </button>
          <button onClick={() => { logout(); router.push('/login'); }} className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold transition-colors hover:bg-red-100 border border-red-100/50 shadow-sm">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>`;

if (content.includes(oldSidebar)) {
    content = content.replace(oldSidebar, newSidebar);
    fs.writeFileSync('app/dashboard/pemasta/page.tsx', content, 'utf8');
    console.log("Replaced!");
} else {
    console.log("NOT FOUND!");
}
