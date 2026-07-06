/* ================= ICONS ================= */
function icon(p, color = "currentColor", size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
}
const P_BELL = '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>';
const P_ALERT = '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>';
const P_CHEVRON = '<polyline points="9 18 15 12 9 6"/>';
const P_CHECK = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>';
const P_CLOCK = '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>';
const P_SCAN = '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/>';
const P_ARROW_DOWN = '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>';
const P_ARROW_UP = '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>';
const P_BOX = '<path d="M21 8V7a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 7v10a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 17v-1"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>';
const P_FILE = '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>';

const bellSvg = icon(P_BELL, "var(--text-primary)", 18);
const alertSvg = icon(P_ALERT, "var(--red)", 16);
const chevronSvg = icon(P_CHEVRON, "var(--text-muted)", 16);
const scanSvg = icon(P_SCAN, "var(--green)", 36);
const arrowDownSvgOutline = icon(P_ARROW_DOWN, "var(--green)", 18);
const arrowUpSvgOutline = icon(P_ARROW_UP, "var(--amber)", 18);
const checkSvgOutline = icon(P_CHECK, "var(--green)", 18);
const boxSvgOutline = icon(P_BOX, "var(--green)", 18);
const fileSvgOutline = icon(P_FILE, "var(--green)", 18);
function checkCircleSvg(color) { return icon(P_CHECK, color, 16); }
function clockSvg(color) { return icon(P_CLOCK, color, 16); }
function arrowDownSvg(color) { return icon(P_ARROW_DOWN, color, 14); }
function arrowUpSvg(color) { return icon(P_ARROW_UP, color, 14); }

/* ================= HELPERS ================= */
const RANK = { green: 0, yellow: 1, red: 2 };
function uid() { return "id_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8); }
function daysUntil(iso) { return (new Date(iso) - new Date()) / 86400000; }
function stockStatusOf(f) { return f.qty <= 0 ? "red" : f.qty < f.lowThreshold ? "yellow" : "green"; }
function freshStatusOf(f) {
  if (!f.expiry) return "green";
  const d = daysUntil(f.expiry);
  if (d < 0) return "red";
  if (d <= 1) return "yellow";
  return "green";
}
function overallStatus(f) {
  const a = stockStatusOf(f), b = freshStatusOf(f);
  return RANK[a] >= RANK[b] ? a : b;
}
function noteFor(f) {
  const parts = [];
  if (f.qty <= 0) parts.push("Stock Habis");
  else if (f.qty < f.lowThreshold) parts.push(`Stock Rendah · ${f.qty}${f.unit}`);
  if (f.expiry) {
    const d = Math.ceil(daysUntil(f.expiry));
    if (d < 0) parts.push(`Tamat Tempoh ${formatDateShort(f.expiry)}`);
    else if (d === 0) parts.push("Tamat Tempoh Hari Ini");
    else if (d === 1) parts.push("Tamat Tempoh Esok");
  }
  if (parts.length === 0) parts.push(`Segar · ${f.qty}${f.unit}`);
  return parts.join(" · ");
}
function formatFullDate(d) {
  const days = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
  const months = ["Januari","Februari","Mac","April","Mei","Jun","Julai","Ogos","September","Oktober","November","Disember"];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}
function formatTime(d) {
  let h = d.getHours(), m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12; if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
}
function formatDateShort(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function addDaysIso(n) {
  const d = new Date(); d.setDate(d.getDate() + n); d.setHours(9, 0, 0, 0);
  return d.toISOString();
}
function todayAt(h, m) {
  const d = new Date(); d.setHours(h, m, 0, 0);
  return d.getTime();
}

/* ================= STATE ================= */
const STORAGE_KEY = "inventoriBuahDataV1";

function seedState() {
  return {
    fruits: [
      { id: "f1", name: "Epal Fuji", brand: "Sunmoon", category: "Import", size: "M", unit: "kg", qty: 0, lowThreshold: 10, expiry: addDaysIso(-3) },
      { id: "f2", name: "Strawberry", brand: "Corona", category: "Import", size: "S", unit: "kg", qty: 3, lowThreshold: 5, expiry: addDaysIso(-1) },
      { id: "f3", name: "Pisang Cavendish", brand: "Ladang Setempat", category: "Tempatan", size: "L", unit: "kg", qty: 5, lowThreshold: 10, expiry: addDaysIso(10) },
      { id: "f4", name: "Oren Sunkist", brand: "Sunkist", category: "Import", size: "M", unit: "kg", qty: 12, lowThreshold: 10, expiry: addDaysIso(1) },
      { id: "f5", name: "Mangga Harum Manis", brand: "Thai Gold", category: "Import", size: "L", unit: "kg", qty: 200, lowThreshold: 20, expiry: addDaysIso(14) },
      { id: "f6", name: "Anggur Merah", brand: "Sunview", category: "Import", size: "M", unit: "kg", qty: 80, lowThreshold: 15, expiry: addDaysIso(9) },
      { id: "f7", name: "Nanas Moris", brand: "Ladang Setempat", category: "Tempatan", size: "M", unit: "kg", qty: 34, lowThreshold: 15, expiry: addDaysIso(20) },
    ],
    transactions: [
      { id: "t1", type: "in", fruitId: "f5", name: "Mangga Harum Manis", brand: "Thai Gold", qty: 150, unit: "kg", party: "Supplier · ABC Trading", ts: todayAt(9, 12) },
      { id: "t2", type: "out", fruitId: "f3", name: "Pisang Cavendish", brand: "Ladang Setempat", qty: 40, unit: "kg", party: "Ke Outlet KLCC", ts: todayAt(10, 5) },
      { id: "t3", type: "out", fruitId: "f7", name: "Nanas Moris", brand: "Ladang Setempat", qty: 20, unit: "kg", party: "Ke Warehouse B", ts: todayAt(11, 30) },
      { id: "t4", type: "in", fruitId: "f6", name: "Anggur Merah", brand: "Sunview", qty: 80, unit: "kg", party: "Supplier · Fresh Direct", ts: todayAt(12, 15) },
    ],
    weeklyChecks: [
      {
        id: "w1", session: "Sesi 1", date: "Isnin",
        items: [
          { fruitId: "f1", name: "Epal Fuji", brand: "Sunmoon", sistem: 20, fizikal: 20 },
          { fruitId: "f3", name: "Pisang Cavendish", brand: "Ladang Setempat", sistem: 30, fizikal: 26 },
          { fruitId: "f5", name: "Mangga Harum Manis", brand: "Thai Gold", sistem: 200, fizikal: 200 },
        ],
        submittedAt: addDaysIso(-2),
      },
    ],
  };
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

let state = loadState() || seedState();
saveState();

/* ================= TOAST ================= */
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => t.classList.remove("show"), 2500);
}

/* ================= SHARED ROW BUILDERS ================= */
function critRowHtml(f, status) {
  const cls = status === "red" ? "dot-red" : status === "yellow" ? "dot-yellow" : "dot-green";
  const noteColor = status === "red" ? "var(--red)" : status === "yellow" ? "var(--amber)" : "var(--green)";
  return `<div class="crit-row">
    <span class="dot ${cls}"></span>
    <div class="info">
      <p class="name">${f.name} <span>· ${f.brand}</span></p>
      <p class="note" style="color:${noteColor}">${noteFor(f)}</p>
    </div>
    <span class="size-tag">${f.size}</span>
  </div>`;
}
function activityRowHtml(tx) {
  const isIn = tx.type === "in";
  return `<div class="activity-row">
    <div class="activity-icon" style="background:${isIn ? "var(--green-bg)" : "var(--amber-bg)"}">${isIn ? arrowDownSvg("var(--green)") : arrowUpSvg("var(--amber)")}</div>
    <div class="info">
      <p class="name">${tx.name}</p>
      <p class="sub">${tx.party}</p>
    </div>
    <div class="right">
      <p class="qty" style="color:${isIn ? "var(--green)" : "var(--amber)"}">${isIn ? "+" : "−"}${tx.qty} ${tx.unit}</p>
      <p class="time">${formatTime(new Date(tx.ts))}</p>
    </div>
  </div>`;
}
function weeklyScheduleHtml() {
  const s1 = state.weeklyChecks.find((w) => w.session === "Sesi 1");
  const s2 = state.weeklyChecks.find((w) => w.session === "Sesi 2");
  return `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
      ${s1 ? checkCircleSvg("var(--green)") : clockSvg("var(--amber)")}
      <p style="flex:1;font-size:14px;margin:0;">Sesi 1 · Isnin</p>
      <span style="font-size:12px;color:${s1 ? "var(--green)" : "var(--amber)"}">${s1 ? "Selesai" : "Belum Mula"}</span>
    </div>
    <div style="display:flex;align-items:center;gap:10px;">
      ${s2 ? checkCircleSvg("var(--green)") : clockSvg("var(--amber)")}
      <p style="flex:1;font-size:14px;margin:0;">Sesi 2 · Khamis</p>
      <span style="font-size:12px;color:${s2 ? "var(--green)" : "var(--amber)"}">${s2 ? "Selesai" : "Akan Datang"}</span>
    </div>
  `;
}

/* ================= DASHBOARD ================= */
function renderDashboard() {
  const el = document.getElementById("screen-dashboard");
  const today = new Date();
  const isToday = (ts) => new Date(ts).toDateString() === today.toDateString();
  const totalJenis = state.fruits.length;
  const masukHariIni = state.transactions.filter((t) => t.type === "in" && isToday(t.ts)).reduce((s, t) => s + t.qty, 0);
  const keluarHariIni = state.transactions.filter((t) => t.type === "out" && isToday(t.ts)).reduce((s, t) => s + t.qty, 0);

  const statuses = state.fruits.map((f) => ({ fruit: f, status: overallStatus(f) }));
  const green = statuses.filter((s) => s.status === "green").length;
  const yellow = statuses.filter((s) => s.status === "yellow").length;
  const red = statuses.filter((s) => s.status === "red").length;
  const total = Math.max(green + yellow + red, 1);
  const pct = (n) => (n / total) * 100;

  const critical = statuses
    .filter((s) => s.status !== "green")
    .sort((a, b) => RANK[b.status] - RANK[a.status])
    .slice(0, 6);

  const lastCheck = [...state.weeklyChecks].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0];
  const lastCheckSelisih = lastCheck ? lastCheck.items.reduce((s, i) => s + Math.abs(i.sistem - i.fizikal), 0) : 0;

  const recentTx = [...state.transactions].sort((a, b) => b.ts - a.ts).slice(0, 6);

  el.innerHTML = `
    <div class="top-row">
      <div>
        <p class="page-sub">${formatFullDate(today)}</p>
        <h1 class="page-title">Gudang Utama</h1>
      </div>
      <button class="icon-btn" id="btn-notif">
        ${bellSvg}
        ${yellow + red > 0 ? `<span class="badge">${yellow + red}</span>` : ""}
      </button>
    </div>

    ${red > 0 ? `
    <div class="banner">
      ${alertSvg}
      <p><b>${red} buah stock kritikal</b> · ${yellow} perlu perhatian</p>
      ${chevronSvg}
    </div>` : ""}

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <p class="card-title">Kesihatan Stock Harian</p>
        <span style="font-size:11px;color:var(--text-faint);font-family:'JetBrains Mono'">${formatTime(today)}</span>
      </div>
      <div class="health-bar">
        <div style="width:${pct(green)}%;background:var(--green)"></div>
        <div style="width:${pct(yellow)}%;background:var(--amber)"></div>
        <div style="width:${pct(red)}%;background:var(--red)"></div>
      </div>
      <div class="health-legend">
        <div class="legend-item"><span class="dot dot-green"></span>Segar <b>${green}</b></div>
        <div class="legend-item"><span class="dot dot-yellow"></span>Perhatian <b>${yellow}</b></div>
        <div class="legend-item"><span class="dot dot-red"></span>Kritikal <b>${red}</b></div>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-card"><p class="stat-label">Jenis Buah Aktif</p><p class="stat-value">${totalJenis}</p></div>
      <div class="stat-card"><p class="stat-label">Masuk Hari Ini</p><p class="stat-value" style="color:var(--green)">+${masukHariIni} kg</p></div>
    </div>
    <div class="stats-row">
      <div class="stat-card"><p class="stat-label">Keluar Hari Ini</p><p class="stat-value" style="color:var(--amber)">−${keluarHariIni} kg</p></div>
      <div class="stat-card">
        <p class="stat-label">Selisih Check Lepas</p>
        <p class="stat-value" style="color:${lastCheckSelisih > 0 ? "var(--red)" : "var(--text-primary)"}">${lastCheckSelisih} unit</p>
        <p class="stat-sub">${lastCheck ? lastCheck.session + " · " + lastCheck.date : "-"}</p>
      </div>
    </div>

    <div class="section-head"><p>Perlu Tindakan</p><p>${critical.length} item</p></div>
    <div class="list-wrap">
      ${critical.length ? critical.map((s) => critRowHtml(s.fruit, s.status)).join("") : `<div class="empty-state">Semua stock dalam keadaan baik</div>`}
    </div>

    <div class="card">
      <p class="card-title">Stock Check Mingguan</p>
      ${weeklyScheduleHtml()}
    </div>

    <div class="section-head"><p>Aktiviti Terkini</p><p>${state.transactions.length} rekod</p></div>
    <div class="activity-card">
      ${recentTx.length ? recentTx.map(activityRowHtml).join("") : `<div class="empty-state">Belum ada aktiviti</div>`}
    </div>
  `;
  document.getElementById("btn-notif").onclick = () => switchTab("check");
}

/* ================= STOCK MASUK ================= */
function renderMasuk() {
  const el = document.getElementById("screen-masuk");
  const categories = [...new Set(state.fruits.map((f) => f.category))];
  const brands = [...new Set(state.fruits.map((f) => f.brand))];
  const names = [...new Set(state.fruits.map((f) => f.name))];
  const sizes = [...new Set(state.fruits.map((f) => f.size))];

  el.innerHTML = `
    <div class="header-block"><p class="page-sub">Rekod buah masuk</p><h1 class="page-title">Stock Masuk</h1></div>
    <div class="segmented" id="masuk-mode">
      <button class="active" data-mode="Scan">Scan</button>
      <button data-mode="Manual">Manual</button>
    </div>
    <div class="scan-box" id="masuk-scanbox">
      ${scanSvg}
      <p class="t1">Imbas Barcode / QR</p>
      <p class="t2">Kod akan auto-isi maklumat buah di bawah</p>
      <button class="btn-primary" style="width:auto;margin:16px auto 0;padding:10px 20px;" id="btn-simulate-scan">Simulasi Imbasan</button>
    </div>
    <div class="field"><label>Category</label><input list="dl-category" id="in-category" placeholder="cth: Import"/><datalist id="dl-category">${categories.map((x) => `<option value="${x}">`).join("")}</datalist></div>
    <div class="field"><label>Brand</label><input list="dl-brand" id="in-brand" placeholder="cth: Sunmoon"/><datalist id="dl-brand">${brands.map((x) => `<option value="${x}">`).join("")}</datalist></div>
    <div class="field"><label>Jenis Buah</label><input list="dl-name" id="in-name" placeholder="cth: Epal Fuji"/><datalist id="dl-name">${names.map((x) => `<option value="${x}">`).join("")}</datalist></div>
    <div class="field"><label>Size</label><input list="dl-size" id="in-size" placeholder="cth: M"/><datalist id="dl-size">${sizes.map((x) => `<option value="${x}">`).join("")}</datalist></div>
    <div class="field"><label>Quantity (kg)</label><input type="number" id="in-qty" placeholder="0" min="0"/></div>
    <div class="field"><label>Tarikh Luput (jika ada)</label><input type="date" id="in-expiry"/></div>
    <div class="field"><label>Supplier / Sumber</label><input type="text" id="in-supplier" placeholder="cth: ABC Trading"/></div>
    <button class="btn-primary" id="btn-save-masuk">Simpan ke Stock</button>
  `;

  const modeBtns = el.querySelectorAll("#masuk-mode button");
  modeBtns.forEach((b) => (b.onclick = () => {
    modeBtns.forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    document.getElementById("masuk-scanbox").classList.toggle("hidden", b.dataset.mode !== "Scan");
  }));

  document.getElementById("btn-simulate-scan").onclick = () => {
    if (state.fruits.length === 0) { showToast("Tiada data sedia ada untuk simulasi"); return; }
    const f = state.fruits[Math.floor(Math.random() * state.fruits.length)];
    document.getElementById("in-category").value = f.category;
    document.getElementById("in-brand").value = f.brand;
    document.getElementById("in-name").value = f.name;
    document.getElementById("in-size").value = f.size;
    showToast("Kod diimbas — maklumat auto-diisi");
  };

  document.getElementById("btn-save-masuk").onclick = () => {
    const category = document.getElementById("in-category").value.trim();
    const brand = document.getElementById("in-brand").value.trim();
    const name = document.getElementById("in-name").value.trim();
    const size = document.getElementById("in-size").value.trim();
    const qty = parseFloat(document.getElementById("in-qty").value);
    const expiry = document.getElementById("in-expiry").value;
    const supplier = document.getElementById("in-supplier").value.trim() || "Tidak dinyatakan";

    if (!name || !brand || !category || !size || !qty || qty <= 0) {
      showToast("Sila lengkapkan semua maklumat wajib");
      return;
    }

    let fruit = state.fruits.find(
      (f) => f.name.toLowerCase() === name.toLowerCase() && f.brand.toLowerCase() === brand.toLowerCase() && f.size.toLowerCase() === size.toLowerCase()
    );
    if (fruit) {
      fruit.qty += qty;
      if (expiry) fruit.expiry = new Date(expiry).toISOString();
    } else {
      fruit = { id: uid(), name, brand, category, size, unit: "kg", qty, lowThreshold: Math.max(5, Math.round(qty * 0.15)), expiry: expiry ? new Date(expiry).toISOString() : null };
      state.fruits.push(fruit);
    }
    state.transactions.push({ id: uid(), type: "in", fruitId: fruit.id, name: fruit.name, brand: fruit.brand, qty, unit: "kg", party: `Supplier · ${supplier}`, ts: Date.now() });
    saveState();
    showToast(`Berjaya: ${name} +${qty}kg disimpan`);
    renderDashboard();
    renderMasuk();
  };
}

/* ================= STOCK KELUAR ================= */
function renderKeluar() {
  const el = document.getElementById("screen-keluar");
  let destType = "Outlet";
  const optionsHtml = state.fruits.map((f) => `<option value="${f.id}">${f.name} · ${f.brand} · ${f.size} — baki ${f.qty}${f.unit}</option>`).join("");

  el.innerHTML = `
    <div class="header-block"><p class="page-sub">Rekod buah keluar</p><h1 class="page-title">Stock Keluar</h1></div>
    <div class="segmented" id="keluar-mode">
      <button class="active" data-mode="Scan">Scan</button>
      <button data-mode="Manual">Manual</button>
    </div>
    <div class="field" style="margin-bottom:8px;"><label>Destinasi</label></div>
    <div class="dest-row" id="dest-row">
      <button class="dest-chip active" data-dest="Outlet">Outlet</button>
      <button class="dest-chip" data-dest="Warehouse">Warehouse</button>
      <button class="dest-chip" data-dest="Dept Lain">Dept Lain</button>
    </div>
    <div class="field"><label id="dest-label">Pilih Outlet</label><input type="text" id="out-dest-name" placeholder="cth: Outlet KLCC"/></div>
    <div class="field">
      <label>Jenis Buah</label>
      <select id="out-fruit"><option value="">Pilih Buah</option>${optionsHtml}</select>
    </div>
    <div class="field"><label>Quantity (kg)</label><input type="number" id="out-qty" min="0" placeholder="0"/></div>
    <div id="out-info-strip"></div>
    <button class="btn-primary" id="btn-save-keluar">Kemaskini Stock</button>
  `;

  const destBtns = el.querySelectorAll(".dest-chip");
  const destLabel = document.getElementById("dest-label");
  const destNameInput = document.getElementById("out-dest-name");
  const placeholders = { Outlet: "cth: Outlet KLCC", Warehouse: "cth: Warehouse B", "Dept Lain": "cth: Dapur Pusat" };
  destBtns.forEach((b) => (b.onclick = () => {
    destBtns.forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    destType = b.dataset.dest;
    destLabel.textContent = destType === "Outlet" ? "Pilih Outlet" : destType === "Warehouse" ? "Pilih Warehouse" : "Pilih Department";
    destNameInput.placeholder = placeholders[destType];
  }));

  const modeBtns = el.querySelectorAll("#keluar-mode button");
  modeBtns.forEach((b) => (b.onclick = () => { modeBtns.forEach((x) => x.classList.remove("active")); b.classList.add("active"); }));

  const fruitSelect = document.getElementById("out-fruit");
  const infoStrip = document.getElementById("out-info-strip");
  fruitSelect.onchange = () => {
    const f = state.fruits.find((x) => x.id === fruitSelect.value);
    infoStrip.innerHTML = f
      ? `<div class="info-strip ok">${checkCircleSvg("var(--green)")}<span>Stock cukup — baki sistem: <b style="font-family:'JetBrains Mono';">${f.qty}${f.unit}</b></span></div>`
      : "";
  };

  document.getElementById("btn-save-keluar").onclick = () => {
    const f = state.fruits.find((x) => x.id === fruitSelect.value);
    const qty = parseFloat(document.getElementById("out-qty").value);
    const destName = destNameInput.value.trim();

    if (!f) { showToast("Sila pilih buah"); return; }
    if (!qty || qty <= 0) { showToast("Sila masukkan quantity"); return; }
    if (!destName) { showToast("Sila masukkan destinasi"); return; }
    if (qty > f.qty) {
      infoStrip.innerHTML = `<div class="info-strip err">${alertSvg}<span>Stock tidak cukup — baki sistem hanya <b style="font-family:'JetBrains Mono';">${f.qty}${f.unit}</b></span></div>`;
      showToast("Stock tidak mencukupi");
      return;
    }
    f.qty -= qty;
    state.transactions.push({ id: uid(), type: "out", fruitId: f.id, name: f.name, brand: f.brand, qty, unit: "kg", party: `Ke ${destName}`, ts: Date.now() });
    saveState();
    showToast(`Berjaya: ${f.name} −${qty}kg dihantar`);
    renderDashboard();
    renderKeluar();
  };
}

/* ================= STOCK CHECK ================= */
function renderCheck() {
  const el = document.getElementById("screen-check");
  el.innerHTML = `
    <div class="header-block"><p class="page-sub">Monitor & audit stock</p><h1 class="page-title">Stock Check</h1></div>
    <div class="segmented" id="check-mode">
      <button class="active" data-mode="Harian">Harian</button>
      <button data-mode="Mingguan">Mingguan</button>
    </div>
    <div id="check-harian"></div>
    <div id="check-mingguan" class="hidden"></div>
  `;
  const modeBtns = el.querySelectorAll("#check-mode button");
  modeBtns.forEach((b) => (b.onclick = () => {
    modeBtns.forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    document.getElementById("check-harian").classList.toggle("hidden", b.dataset.mode !== "Harian");
    document.getElementById("check-mingguan").classList.toggle("hidden", b.dataset.mode !== "Mingguan");
  }));
  renderCheckHarian("Semua");
  renderCheckMingguan();
}

function renderCheckHarian(filter) {
  const wrap = document.getElementById("check-harian");
  const statuses = state.fruits.map((f) => ({ fruit: f, status: overallStatus(f) }));
  const filtered = filter === "Semua" ? statuses : statuses.filter((s) =>
    (filter === "Segar" && s.status === "green") || (filter === "Rendah" && s.status === "yellow") || (filter === "Kritikal" && s.status === "red")
  );
  wrap.innerHTML = `
    <div class="chip-row" id="harian-chips">
      ${["Semua", "Segar", "Rendah", "Kritikal"].map((f) => `<button class="chip ${f === filter ? "active" : ""}" data-filter="${f}">${f}</button>`).join("")}
    </div>
    <div class="list-wrap">
      ${filtered.length ? filtered.map((s) => critRowHtml(s.fruit, s.status)).join("") : `<div class="empty-state">Tiada item</div>`}
    </div>
  `;
  wrap.querySelectorAll(".chip").forEach((b) => (b.onclick = () => renderCheckHarian(b.dataset.filter)));
}

function renderCheckMingguan() {
  const wrap = document.getElementById("check-mingguan");
  const s2 = state.weeklyChecks.find((w) => w.session === "Sesi 2");
  wrap.innerHTML = `
    <div class="session-row">
      <div class="left">${clockSvg("var(--amber)")} Sesi 2 · Khamis</div>
      <span class="tag ${s2 ? "done" : "pending"}">${s2 ? "Selesai" : "Sedang Berjalan"}</span>
    </div>
    <div class="list-wrap" id="mingguan-items">
      ${state.fruits.map((f) => `
        <div class="check-item">
          <div class="top"><p class="name">${f.name} <span>· ${f.brand}</span></p></div>
          <div class="check-cols">
            <div class="check-col"><p>Sistem</p><p>${f.qty} kg</p></div>
            <div class="check-col"><p>Fizikal</p><input type="number" data-fruit-id="${f.id}" class="fizikal-input" placeholder="${f.qty}"/></div>
          </div>
        </div>
      `).join("")}
    </div>
    <button class="btn-primary" id="btn-submit-check">Submit Laporan Check</button>
  `;
  document.getElementById("btn-submit-check").onclick = () => {
    const inputs = wrap.querySelectorAll(".fizikal-input");
    const items = [];
    inputs.forEach((inp) => {
      const f = state.fruits.find((x) => x.id === inp.dataset.fruitId);
      const fizikal = inp.value === "" ? f.qty : parseFloat(inp.value);
      items.push({ fruitId: f.id, name: f.name, brand: f.brand, sistem: f.qty, fizikal });
    });
    const record = { id: uid(), session: "Sesi 2", date: "Khamis", items, submittedAt: new Date().toISOString() };
    state.weeklyChecks = state.weeklyChecks.filter((w) => w.session !== "Sesi 2");
    state.weeklyChecks.push(record);
    saveState();
    const selisih = items.reduce((s, i) => s + Math.abs(i.sistem - i.fizikal), 0);
    showToast(selisih > 0 ? `Laporan disimpan — ${selisih} unit selisih dikesan` : "Laporan disimpan — tiada selisih");
    renderDashboard();
    renderCheck();
  };
}

/* ================= LAPORAN ================= */
function renderLaporan() {
  const el = document.getElementById("screen-laporan");
  const reports = [
    { key: "masuk", icon: arrowDownSvgOutline, title: "Rekod Stock Masuk", sub: "Log lengkap buah masuk" },
    { key: "keluar", icon: arrowUpSvgOutline, title: "Rekod Stock Keluar", sub: "Log lengkap buah keluar" },
    { key: "mingguan", icon: checkSvgOutline, title: "Stock Check Mingguan", sub: "Selisih sistem vs fizikal" },
    { key: "harian", icon: boxSvgOutline, title: "Stock Check Harian", sub: "Status kesihatan stock" },
    { key: "semasa", icon: fileSvgOutline, title: "Stock Semasa", sub: "Ikut category, brand, jenis, size" },
  ];
  el.innerHTML = `
    <div class="header-block"><p class="page-sub">Rekod & analisis</p><h1 class="page-title">Laporan</h1></div>
    <div class="list-wrap" id="report-list">
      ${reports.map((r) => `
        <div>
          <div class="report-row" data-key="${r.key}">
            <div class="report-icon">${r.icon}</div>
            <div class="info"><p>${r.title}</p><p>${r.sub}</p></div>
            ${chevronSvg}
          </div>
          <div class="hidden" id="detail-${r.key}" style="margin-top:8px;"></div>
        </div>
      `).join("")}
    </div>
    <div style="text-align:center;padding:20px 16px 0;">
      <button id="btn-reset" style="background:none;border:none;color:var(--text-faint);font-size:12px;text-decoration:underline;cursor:pointer;">Reset Data Demo</button>
    </div>
  `;
  el.querySelectorAll(".report-row").forEach((row) => {
    row.onclick = () => {
      const key = row.dataset.key;
      const detail = document.getElementById(`detail-${key}`);
      const isHidden = detail.classList.contains("hidden");
      el.querySelectorAll('[id^="detail-"]').forEach((d) => d.classList.add("hidden"));
      if (isHidden) {
        detail.innerHTML = reportDetailHtml(key);
        detail.classList.remove("hidden");
      }
    };
  });
  document.getElementById("btn-reset").onclick = () => {
    if (confirm("Reset semua data demo kepada nilai asal?")) {
      localStorage.removeItem(STORAGE_KEY);
      state = seedState();
      saveState();
      renderDashboard();
      renderLaporan();
      showToast("Data direset");
    }
  };
}

function reportDetailHtml(key) {
  if (key === "masuk") {
    const list = state.transactions.filter((t) => t.type === "in").sort((a, b) => b.ts - a.ts);
    return list.length ? `<div class="activity-card">${list.map(activityRowHtml).join("")}</div>` : `<div class="empty-state">Tiada rekod</div>`;
  }
  if (key === "keluar") {
    const list = state.transactions.filter((t) => t.type === "out").sort((a, b) => b.ts - a.ts);
    return list.length ? `<div class="activity-card">${list.map(activityRowHtml).join("")}</div>` : `<div class="empty-state">Tiada rekod</div>`;
  }
  if (key === "mingguan") {
    if (!state.weeklyChecks.length) return `<div class="empty-state">Tiada rekod</div>`;
    return [...state.weeklyChecks].reverse().map((w) => {
      const selisihItems = w.items.filter((i) => i.sistem !== i.fizikal);
      return `<div class="card" style="margin:0 0 8px;">
        <p class="card-title">${w.session} · ${w.date}</p>
        ${w.items.map((i) => `<div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;border-bottom:1px solid var(--border);">
          <span>${i.name} <span style="color:var(--text-faint)">· ${i.brand}</span></span>
          <span style="font-family:'JetBrains Mono';color:${i.sistem !== i.fizikal ? "var(--red)" : "var(--text-muted)"}">${i.fizikal}/${i.sistem}kg</span>
        </div>`).join("")}
        <p style="font-size:12px;color:var(--text-faint);margin:8px 0 0;">${selisihItems.length ? selisihItems.length + " item ada selisih" : "Tiada selisih"}</p>
      </div>`;
    }).join("");
  }
  if (key === "harian") {
    const statuses = state.fruits.map((f) => ({ fruit: f, status: overallStatus(f) }));
    return `<div class="list-wrap" style="padding:0;">${statuses.map((s) => critRowHtml(s.fruit, s.status)).join("")}</div>`;
  }
  if (key === "semasa") {
    return `<div class="list-wrap" style="padding:0;">${state.fruits.map((f) => `
      <div class="crit-row">
        <div class="info">
          <p class="name">${f.name} <span>· ${f.brand}</span></p>
          <p class="note" style="color:var(--text-muted)">${f.category} · Size ${f.size}</p>
        </div>
        <span class="size-tag">${f.qty}${f.unit}</span>
      </div>
    `).join("")}</div>`;
  }
  return "";
}

/* ================= NAV / INIT ================= */
function switchTab(tab) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.add("hidden"));
  document.getElementById("screen-" + tab).classList.remove("hidden");
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  if (tab === "dashboard") renderDashboard();
  if (tab === "masuk") renderMasuk();
  if (tab === "keluar") renderKeluar();
  if (tab === "check") renderCheck();
  if (tab === "laporan") renderLaporan();
  document.getElementById("screen-" + tab).scrollTop = 0;
}

function updateClock() {
  const el = document.getElementById("clock");
  if (el) el.textContent = formatTime(new Date());
}

document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 30000);
  document.querySelectorAll(".nav-btn").forEach((b) => (b.onclick = () => switchTab(b.dataset.tab)));
  document.getElementById("fab-scan").onclick = () => {
    switchTab("masuk");
    showToast("Sedia untuk imbas — tekan Simulasi Imbasan");
  };
  renderDashboard();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
});
