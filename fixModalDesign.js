const fs = require('fs');
let content = fs.readFileSync('app/dashboard/community/page.tsx', 'utf8');

const regex = /\{showAddModal && \([\s\S]*?<\/div>\s*<\/div>\s*\)\}/;

const newModal = `{showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100">
              <span className="text-stone-500 font-bold text-sm px-1">X</span>
            </button>
            <h2 className="font-black text-stone-800 text-lg mb-1">{T_COMM.modalAddTitle[lang]}</h2>
            <p className="text-xs text-stone-500 mb-5">Komunitas bisa diikuti oleh semua pengguna atSira sesuai kategori.</p>
            <form onSubmit={handleAddCommunity} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">{T_COMM.modalAddName[lang]} *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Petani Nilam Aceh Selatan"
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
                  value={newComm.name}
                  onChange={e => setNewComm({...newComm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">{T_COMM.modalAddDesc[lang]}</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Ceritakan tujuan komunitas ini..."
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-emerald-400"
                  value={newComm.desc}
                  onChange={e => setNewComm({...newComm, desc: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">{T_COMM.modalAddCat[lang]}</label>
                  <select 
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
                    value={newComm.category}
                    onChange={e => setNewComm({...newComm, category: e.target.value})}
                  >
                    <option value="Umum">Umum</option>
                    <option value="Petani & Penyuling">Petani & Penyuling</option>
                    <option value="UMKM & Buyer">UMKM & Buyer</option>
                    <option value="ARC-USK">ARC-USK</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">{T_COMM.modalAddType[lang]}</label>
                  <select 
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
                    value={newComm.type}
                    onChange={e => setNewComm({...newComm, type: e.target.value as "public"|"private"})}
                  >
                    <option value="public">🌐 Publik</option>
                    <option value="private">🔒 Privat</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors mt-2 shadow-sm">
                {T_COMM.modalAddBtn[lang]}
              </button>
            </form>
          </div>
        </div>
      )}`;

if (regex.test(content)) {
    content = content.replace(regex, newModal);
    fs.writeFileSync('app/dashboard/community/page.tsx', content, 'utf8');
    console.log("Replaced!");
} else {
    console.log("Not found!");
}
