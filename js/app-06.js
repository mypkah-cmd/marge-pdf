/* ==========================================================
   INDEXEDDB RECENT FILES
   ========================================================== */
const IDB_NAME='pdfnest_db', IDB_STORE='files', IDB_MAX=20;
function idbOpen() { return new Promise((resolve, reject) => { const req=indexedDB.open(IDB_NAME, 1); req.onupgradeneeded = () => { const db=req.result; if (!db.objectStoreNames.contains(IDB_STORE)) { const store=db.createObjectStore(IDB_STORE, { keyPath:'id', autoIncrement:true }); store.createIndex('created','created'); } }; req.onsuccess=() => resolve(req.result); req.onerror=() => reject(req.error); }); }
async function idbAddFile(name, blob, kind) { const db=await idbOpen(); return new Promise((resolve, reject) => { const tx=db.transaction(IDB_STORE, 'readwrite'); tx.objectStore(IDB_STORE).add({ name, blob, kind:kind||'pdf', created:Date.now(), size:blob.size }); tx.oncomplete = () => { db.close(); idbTrim(); resolve(); }; tx.onerror = () => { db.close(); reject(tx.error); }; }); }
async function idbAll() { const db=await idbOpen(); return new Promise((resolve, reject) => { const tx=db.transaction(IDB_STORE, 'readonly'); const req=tx.objectStore(IDB_STORE).getAll(); req.onsuccess = () => { db.close(); resolve(req.result.sort((a,b) => b.created - a.created)); }; req.onerror = () => { db.close(); reject(req.error); }; }); }
async function idbDelete(id) { const db=await idbOpen(); return new Promise((resolve, reject) => { const tx=db.transaction(IDB_STORE, 'readwrite'); tx.objectStore(IDB_STORE).delete(id); tx.oncomplete = () => { db.close(); resolve(); }; tx.onerror = () => { db.close(); reject(tx.error); }; }); }
async function idbTrim() { const all=await idbAll(); if (all.length <= IDB_MAX) return; for (let i=IDB_MAX; i<all.length; i++) await idbDelete(all[i].id); }
window.__idbAddFile = idbAddFile;
async function renderRecent() {
  const section = document.getElementById('recentSection'); const grid = document.getElementById('recentGrid');
  if (!section || !grid) return;
  let files = []; try { files = await idbAll(); } catch(e) { return; }
  if (!files.length) { section.classList.add('hidden'); return; }
  section.classList.remove('hidden'); grid.innerHTML = '';
  files.forEach(f => {
    const card = document.createElement('div'); card.className = 'recent-card';
    const sizeKB = Math.round(f.size / 1024); const date = new Date(f.created).toLocaleString();
    card.innerHTML = '<div style="font-size:24px;margin-bottom:6px;">📄</div><div style="font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + f.name + '</div><div style="font-size:11px;color:var(--muted);margin-top:4px;">' + sizeKB + ' KB · ' + date + '</div>';
    card.addEventListener('click', () => { const a=document.createElement('a'); a.href=URL.createObjectURL(f.blob); a.download=f.name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); });
    const del = document.createElement('button'); del.className = 'rc-del'; del.textContent = '×';
    del.addEventListener('click', async (e) => { e.stopPropagation(); await idbDelete(f.id); renderRecent(); });
    card.appendChild(del); grid.appendChild(card);
  });
}
