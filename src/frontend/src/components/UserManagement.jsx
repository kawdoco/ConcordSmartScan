import { useState, useEffect, useCallback } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, stroke = 2, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"
    strokeLinejoin="round" {...props}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const Icons = {
  Dashboard: () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
  Users: () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  Machines: () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M4.93 4.93a10 10 0 0 0 0 14.14" /></svg>,
  Stores: () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  Garments: () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h1.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" /></svg>,
  Approved: () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
  Bell: () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
  Search: () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>,
  Eye: () => <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
  Edit: () => <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  Trash: () => <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>,
  Plus: () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>,
  X: () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  ChevLeft: () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>,
  ChevRight: () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>,
  AlertTriangle: () => <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateUserId = () => `USR-${Math.floor(1000 + Math.random() * 9000)}`;
const today = () => new Date().toISOString().slice(0, 10);

// ─── Styles ───────────────────────────────────────────────────────────────────
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --blue:#1a3fd4; --blue-dk:#1230a8; --blue-lt:#eef1fd;
    --text:#0f1623; --muted:#6b7280; --border:#e5e7eb;
    --bg:#f4f6fb; --white:#fff;
    --red:#ef4444; --green:#10b981; --purple:#7c3aed;
    --sidebar:240px; --r:12px;
  }
  body { font-family:'Sora',sans-serif; background:var(--bg); color:var(--text); }
  .layout { display:flex; min-height:100vh; }

  /* ── Sidebar ── */
  .sidebar {
    width:var(--sidebar); background:var(--white);
    border-right:1px solid var(--border);
    display:flex; flex-direction:column;
    position:fixed; height:100vh; z-index:100;
    box-shadow:2px 0 12px rgba(0,0,0,.04);
  }
  .logo { padding:20px 20px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:10px; }
  .logo-icon {
    width:36px; height:36px; background:var(--blue); border-radius:8px;
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-weight:700; font-size:16px; flex-shrink:0;
  }
  .logo-brand { font-weight:700; font-size:15px; line-height:1.1; }
  .logo-sub { font-size:11px; color:var(--blue); font-weight:600; }
  nav { padding:14px 10px; flex:1; overflow-y:auto; }
  .nav-item {
    display:flex; align-items:center; gap:10px;
    padding:10px 12px; border-radius:8px; cursor:pointer;
    color:var(--muted); font-weight:500; font-size:13.5px;
    transition:all .15s; margin-bottom:2px; user-select:none;
    border:none; background:none; width:100%; text-align:left;
  }
  .nav-item:hover { background:var(--bg); color:var(--text); }
  .nav-item.active { background:var(--blue); color:#fff; }
  .sidebar-foot {
    padding:14px 16px; border-top:1px solid var(--border);
    display:flex; align-items:center; gap:10px;
  }
  .av {
    width:36px; height:36px; border-radius:50%;
    background:linear-gradient(135deg,#667eea,#764ba2);
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-weight:700; font-size:12px; flex-shrink:0;
  }
  .av-name { font-weight:600; font-size:13px; line-height:1.3; }
  .av-email { font-size:11px; color:var(--muted); }

  /* ── Main ── */
  .main { margin-left:var(--sidebar); flex:1; display:flex; flex-direction:column; }
  .topbar {
    background:var(--white); border-bottom:1px solid var(--border);
    padding:12px 28px; display:flex; align-items:center; justify-content:space-between;
    position:sticky; top:0; z-index:50;
  }
  .search {
    display:flex; align-items:center; gap:8px;
    background:var(--bg); border:1.5px solid var(--border);
    border-radius:9px; padding:8px 14px; width:340px; transition:border .15s;
  }
  .search:focus-within { border-color:var(--blue); }
  .search input { border:none; background:none; outline:none; font-family:inherit; font-size:13px; color:var(--text); width:100%; }
  .topbar-r { display:flex; align-items:center; gap:14px; }
  .notif-btn {
    position:relative; width:36px; height:36px;
    border:1.5px solid var(--border); border-radius:8px;
    background:var(--white); cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    transition:background .15s; color:var(--muted);
  }
  .notif-btn:hover { background:var(--bg); }
  .notif-dot {
    position:absolute; top:6px; right:7px;
    width:8px; height:8px; border-radius:50%;
    background:var(--red); border:2px solid #fff;
  }
  .topbar-user { display:flex; align-items:center; gap:10px; cursor:pointer; }
  .topbar-user .info { text-align:right; }
  .topbar-user .info .n { font-weight:600; font-size:13px; }
  .topbar-user .info .e { font-size:11px; color:var(--muted); }

  .content { padding:28px 28px; flex:1; }
  h1 { font-size:24px; font-weight:700; margin-bottom:24px; letter-spacing:-.4px; }

  /* ── Stats ── */
  .stats { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:28px; }
  .stat-card {
    background:var(--white); border:1px solid var(--border);
    border-radius:var(--r); padding:22px 20px;
    display:flex; align-items:center; gap:16px;
    transition:box-shadow .2s, transform .2s;
  }
  .stat-card:hover { box-shadow:0 6px 24px rgba(26,63,212,.1); transform:translateY(-1px); }
  .stat-icon {
    width:50px; height:50px; border-radius:12px;
    background:var(--blue-lt); display:flex; align-items:center; justify-content:center;
    flex-shrink:0; color:var(--blue);
  }
  .stat-lbl { font-size:11px; font-weight:600; color:var(--muted); letter-spacing:.07em; text-transform:uppercase; margin-bottom:5px; }
  .stat-val { font-size:30px; font-weight:700; letter-spacing:-.5px; }

  /* ── Tabs ── */
  .tabs { display:flex; border-bottom:1.5px solid var(--border); margin-bottom:20px; }
  .tab {
    padding:10px 20px; font-weight:500; font-size:13.5px; cursor:pointer;
    border-bottom:2.5px solid transparent; color:var(--muted);
    transition:all .15s; user-select:none; background:none; border-top:none; border-left:none; border-right:none;
    font-family:inherit; margin-bottom:-1.5px;
  }
  .tab:hover:not(.tab-active) { color:var(--text); }
  .tab-active { color:var(--blue); border-bottom-color:var(--blue); }

  /* ── Card / Table ── */
  .card { background:var(--white); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; }
  .card-hd {
    padding:18px 22px; display:flex; align-items:center; justify-content:space-between;
    border-bottom:1px solid var(--border);
  }
  .card-hd .ct { font-weight:700; font-size:15px; }
  .card-hd .cs { font-size:12px; color:var(--muted); margin-top:2px; }
  .btn-primary {
    display:flex; align-items:center; gap:8px;
    background:var(--blue); color:#fff; border:none;
    border-radius:8px; padding:10px 18px;
    font-family:inherit; font-size:13px; font-weight:600;
    cursor:pointer; transition:background .15s, transform .1s;
  }
  .btn-primary:hover { background:var(--blue-dk); }
  .btn-primary:active { transform:scale(.97); }

  table { width:100%; border-collapse:collapse; }
  thead th {
    font-size:11px; font-weight:600; color:var(--muted);
    text-transform:uppercase; letter-spacing:.07em;
    padding:11px 20px; text-align:left;
    border-bottom:1px solid var(--border); background:var(--bg);
  }
  tbody tr { transition:background .12s; }
  tbody tr:hover { background:#f8f9ff; }
  tbody td { padding:15px 20px; border-bottom:1px solid var(--border); font-size:13.5px; }
  tbody tr:last-child td { border-bottom:none; }
  .uid { font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted); }
  .name-c { font-weight:600; }
  .badge {
    display:inline-flex; padding:4px 12px; border-radius:20px;
    font-size:11.5px; font-weight:600; letter-spacing:.02em;
  }
  .badge-mgr { background:#ede9fe; color:#6d28d9; }
  .badge-tech { background:#d1fae5; color:#065f46; }
  .actions { display:flex; align-items:center; gap:6px; }
  .ic-btn {
    width:32px; height:32px; border-radius:7px;
    border:1.5px solid var(--border); background:var(--white);
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    transition:all .15s; color:var(--muted);
  }
  .ic-btn:hover { background:var(--blue-lt); color:var(--blue); border-color:#b8c8f8; }
  .ic-btn.del:hover { background:#fee2e2; color:var(--red); border-color:#fca5a5; }

  .tfoot {
    display:flex; align-items:center; justify-content:space-between;
    padding:13px 20px; border-top:1px solid var(--border);
    font-size:13px; color:var(--muted);
  }
  .pagination { display:flex; align-items:center; gap:4px; }
  .pg-btn {
    min-width:32px; height:32px; border-radius:7px;
    border:1.5px solid var(--border); background:var(--white);
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    font-size:13px; font-weight:500; color:var(--muted);
    transition:all .12s; padding:0 8px; font-family:inherit;
  }
  .pg-btn.pg-active { background:var(--blue); color:#fff; border-color:var(--blue); }
  .pg-btn:hover:not(.pg-active):not(:disabled) { background:var(--bg); color:var(--text); }
  .pg-btn:disabled { opacity:.35; cursor:default; }

  /* ── Empty state ── */
  .empty { text-align:center; padding:60px 20px; color:var(--muted); }
  .empty svg { width:48px; height:48px; margin-bottom:12px; opacity:.25; }

  /* ── Modal ── */
  .overlay {
    display:none; position:fixed; inset:0;
    background:rgba(15,22,35,.45); z-index:200;
    align-items:center; justify-content:center;
    backdrop-filter:blur(3px);
  }
  .overlay.open { display:flex; }
  .modal {
    background:var(--white); border-radius:16px;
    padding:28px; width:480px; max-width:95vw;
    box-shadow:0 24px 64px rgba(0,0,0,.18);
    animation:modalIn .2s ease;
  }
  @keyframes modalIn { from{transform:scale(.94) translateY(8px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
  .modal-hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; }
  .modal-hd h2 { font-size:17px; font-weight:700; letter-spacing:-.3px; }
  .mc-btn {
    width:32px; height:32px; border-radius:7px;
    border:1.5px solid var(--border); background:var(--white);
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    color:var(--muted); transition:all .12s;
  }
  .mc-btn:hover { background:var(--bg); }
  .fg { margin-bottom:15px; }
  .fg label { display:block; font-weight:600; font-size:12.5px; margin-bottom:6px; color:var(--text); }
  .fg input, .fg select {
    width:100%; border:1.5px solid var(--border); border-radius:8px;
    padding:10px 12px; font-family:inherit; font-size:13.5px; color:var(--text);
    outline:none; transition:border .15s; background:var(--white);
  }
  .fg input:focus, .fg select:focus { border-color:var(--blue); }
  .fg input::placeholder { color:var(--muted); font-size:13px; }
  .form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .modal-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:20px; }
  .btn-cancel {
    padding:10px 18px; border:1.5px solid var(--border); border-radius:8px;
    background:var(--white); cursor:pointer; font-family:inherit; font-size:13px;
    font-weight:600; color:var(--muted); transition:all .15s;
  }
  .btn-cancel:hover { background:var(--bg); color:var(--text); }
  .btn-save {
    padding:10px 22px; border:none; border-radius:8px;
    background:var(--blue); color:#fff; cursor:pointer;
    font-family:inherit; font-size:13px; font-weight:600; transition:background .15s;
  }
  .btn-save:hover { background:var(--blue-dk); }
  .btn-del-confirm {
    padding:10px 22px; border:none; border-radius:8px;
    background:var(--red); color:#fff; cursor:pointer;
    font-family:inherit; font-size:13px; font-weight:600; transition:background .15s;
  }
  .btn-del-confirm:hover { background:#dc2626; }

  /* View fields */
  .vf { margin-bottom:14px; display:flex; flex-direction:column; gap:3px; }
  .vf-lbl { font-size:11px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:.07em; }
  .vf-val { font-size:14px; font-weight:500; }
  .view-grid { display:grid; grid-template-columns:1fr 1fr; gap:4px 20px; }

  /* Delete */
  .del-center { text-align:center; margin-bottom:18px; }
  .del-center p { color:var(--muted); margin-top:8px; font-size:13px; line-height:1.5; }
  .del-center h3 { font-size:17px; font-weight:700; margin-top:10px; }

  /* Toast */
  .toast {
    position:fixed; bottom:24px; right:24px; z-index:400;
    padding:13px 20px; border-radius:10px;
    font-size:13px; font-weight:600; font-family:'Sora',sans-serif;
    box-shadow:0 8px 28px rgba(0,0,0,.18);
    transform:translateY(80px); opacity:0;
    transition:all .3s cubic-bezier(.34,1.56,.64,1);
    pointer-events:none;
  }
  .toast.visible { transform:translateY(0); opacity:1; }
  .toast-success { background:#065f46; color:#fff; }
  .toast-error { background:#991b1b; color:#fff; }
  .toast-info { background:var(--blue-dk); color:#fff; }

  footer {
    padding:16px 28px; border-top:1px solid var(--border);
    display:flex; justify-content:space-between; align-items:center;
    font-size:12px; color:var(--muted); background:var(--white);
  }
  footer a { color:var(--muted); text-decoration:none; transition:color .15s; }
  footer a:hover { color:var(--blue); }
  footer .flinks { display:flex; gap:20px; }

  @media(max-width:768px) {
    .sidebar { transform:translateX(-100%); }
    .main { margin-left:0; }
    .stats { grid-template-columns:1fr; }
    .search { width:200px; }
  }
`;

const ROWS_PER_PAGE = 8;

// ─── Main Component ────────────────────────────────────────────────────────────
export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [searchQ, setSearchQ] = useState("");
  const [activeNav, setActiveNav] = useState("Users");

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  // Form state
  const [form, setForm] = useState({ name: "", role: "Technician", location: "", email: "" });
  const [formErr, setFormErr] = useState({});

  // Toast
  const [toast, setToast] = useState({ msg: "", type: "", visible: false });

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  }, []);

  // ── Derived data ──
  const filtered = users.filter(u => {
    const tabMatch = activeTab === "all" || u.role === activeTab;
    const q = searchQ.toLowerCase();
    const qMatch = !q || u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q) || u.location.toLowerCase().includes(q);
    return tabMatch && qMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safeP = Math.min(page, totalPages);
  const paged = filtered.slice((safeP - 1) * ROWS_PER_PAGE, safeP * ROWS_PER_PAGE);

  const totalUsers = users.length;
  const managers = users.filter(u => u.role === "Chief Manager").length;
  const techs = users.filter(u => u.role === "Technician").length;

  useEffect(() => { setPage(1); }, [activeTab, searchQ]);

  // ── Form helpers ──
  const resetForm = () => { setForm({ name: "", role: "Technician", location: "", email: "" }); setFormErr({}); };

  const validate = (f) => {
    const e = {};
    if (!f.name.trim()) e.name = "Name is required";
    if (!f.location.trim()) e.location = "Location is required";
    if (!f.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Invalid email";
    return e;
  };

  const handleAdd = () => {
    const e = validate(form);
    if (Object.keys(e).length) { setFormErr(e); return; }
    const newUser = {
      id: generateUserId(),
      name: form.name.trim(),
      role: form.role,
      location: form.location.trim(),
      email: form.email.trim(),
      date: today(),
    };
    setUsers(prev => [newUser, ...prev]);
    setAddOpen(false);
    resetForm();
    showToast(`${newUser.name} added successfully`, "success");
  };

  const handleEdit = () => {
    const e = validate(form);
    if (Object.keys(e).length) { setFormErr(e); return; }
    setUsers(prev => prev.map(u => u.id === editUser.id
      ? { ...u, name: form.name.trim(), role: form.role, location: form.location.trim(), email: form.email.trim() }
      : u
    ));
    setEditUser(null);
    resetForm();
    showToast("User updated successfully", "success");
  };

  const handleDelete = () => {
    setUsers(prev => prev.filter(u => u.id !== deleteUser.id));
    showToast(`${deleteUser.name} removed`, "error");
    setDeleteUser(null);
  };

  const openEdit = (u) => {
    setForm({ name: u.name, role: u.role, location: u.location, email: u.email });
    setFormErr({});
    setEditUser(u);
  };

  // ── Pagination pages ──
  const getPagesArr = () => {
    if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (safeP > 3) pages.push("...");
    for (let i = Math.max(2, safeP - 1); i <= Math.min(totalPages - 1, safeP + 1); i++) pages.push(i);
    if (safeP < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const navItems = [
    { label: "Dashboard", Icon: Icons.Dashboard },
    { label: "Users", Icon: Icons.Users },
    { label: "Machines", Icon: Icons.Machines },
    { label: "Stores", Icon: Icons.Stores },
    { label: "Garments", Icon: Icons.Garments },
    { label: "Approved Requests", Icon: Icons.Approved },
  ];

  return (
    <>
      <style>{style}</style>
      <div className="layout">

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-icon">C</div>
            <div>
              <div className="logo-brand">Concord</div>
              <div className="logo-sub">Apparel</div>
            </div>
          </div>
          <nav>
            {navItems.map(({ label, Icon: Ic }) => (
              <button key={label}
                className={`nav-item${activeNav === label ? " active" : ""}`}
                onClick={() => setActiveNav(label)}>
                <Ic />{label}
              </button>
            ))}
          </nav>
          <div className="sidebar-foot">
            <div className="av">AU</div>
            <div>
              <div className="av-name">Admin User</div>
              <div className="av-email">system.admin@concord.com</div>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="main">
          <header className="topbar">
            <div className="search">
              <Icons.Search />
              <input
                placeholder="Search by name, user ID, or location…"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
              />
            </div>
            <div className="topbar-r">
              <button className="notif-btn" onClick={() => showToast("No new notifications", "info")}>
                <Icons.Bell />
                <span className="notif-dot" />
              </button>
              <div className="topbar-user">
                <div className="info">
                  <div className="n">Admin User</div>
                  <div className="e">system.admin@concord.com</div>
                </div>
                <div className="av">AU</div>
              </div>
            </div>
          </header>

          <div className="content">
            <h1>User Management</h1>

            {/* Stats */}
            <div className="stats">
              {[
                { lbl: "Total Users", val: totalUsers, Icon: Icons.Users },
                { lbl: "Chief Managers", val: managers, Icon: Icons.Users },
                { lbl: "Technicians", val: techs, Icon: Icons.Users },
              ].map(({ lbl, val, Icon: Ic }) => (
                <div className="stat-card" key={lbl}>
                  <div className="stat-icon"><Ic /></div>
                  <div>
                    <div className="stat-lbl">{lbl}</div>
                    <div className="stat-val">{val.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="tabs">
              {[["all", "All Users"], ["Chief Manager", "Chief Managers"], ["Technician", "Technicians"]].map(([val, lbl]) => (
                <button key={val}
                  className={`tab${activeTab === val ? " tab-active" : ""}`}
                  onClick={() => setActiveTab(val)}>{lbl}</button>
              ))}
            </div>

            {/* Table Card */}
            <div className="card">
              <div className="card-hd">
                <div>
                  <div className="ct">Registered Users</div>
                  <div className="cs">Manage user permissions and location assignments.</div>
                </div>
                <button className="btn-primary" onClick={() => { resetForm(); setAddOpen(true); }}>
                  <Icons.Plus /> Add New User
                </button>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Assigned Location</th>
                    <th>Added Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="empty">
                          <Icons.Users />
                          <p style={{ marginTop: 12, fontWeight: 600 }}>No users found</p>
                          <p style={{ fontSize: 13, marginTop: 4 }}>
                            {searchQ ? "Try a different search term." : 'Click "Add New User" to get started.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : paged.map(u => (
                    <tr key={u.id}>
                      <td><span className="uid">{u.id}</span></td>
                      <td><span className="name-c">{u.name}</span></td>
                      <td>
                        <span className={`badge ${u.role === "Chief Manager" ? "badge-mgr" : "badge-tech"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.location}</td>
                      <td>{u.date}</td>
                      <td>
                        <div className="actions">
                          <button className="ic-btn" title="View" onClick={() => setViewUser(u)}><Icons.Eye /></button>
                          <button className="ic-btn" title="Edit" onClick={() => openEdit(u)}><Icons.Edit /></button>
                          <button className="ic-btn del" title="Delete" onClick={() => setDeleteUser(u)}><Icons.Trash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="tfoot">
                <span>
                  {filtered.length === 0
                    ? "No users"
                    : `Showing ${(safeP - 1) * ROWS_PER_PAGE + 1}–${Math.min(safeP * ROWS_PER_PAGE, filtered.length)} of ${filtered.length} user${filtered.length !== 1 ? "s" : ""}`}
                </span>
                <div className="pagination">
                  <button className="pg-btn" disabled={safeP === 1} onClick={() => setPage(p => p - 1)}><Icons.ChevLeft /></button>
                  {getPagesArr().map((p, i) =>
                    p === "..." ? (
                      <button key={`dots-${i}`} className="pg-btn" disabled>…</button>
                    ) : (
                      <button key={p} className={`pg-btn${safeP === p ? " pg-active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                    )
                  )}
                  <button className="pg-btn" disabled={safeP === totalPages} onClick={() => setPage(p => p + 1)}><Icons.ChevRight /></button>
                </div>
              </div>
            </div>
          </div>

          <footer>
            <span>© 2024 Concord Apparel Pvt Ltd. Machine Replacement Locator System.</span>
            <div className="flinks">
              <a href="#">Privacy Policy</a>
              <a href="#">System Manual</a>
              <a href="#">Technical Support</a>
            </div>
          </footer>
        </div>
      </div>

      {/* ── Add Modal ── */}
      <div className={`overlay${addOpen ? " open" : ""}`} onClick={e => e.target === e.currentTarget && setAddOpen(false)}>
        <div className="modal">
          <div className="modal-hd">
            <h2>Add New User</h2>
            <button className="mc-btn" onClick={() => setAddOpen(false)}><Icons.X /></button>
          </div>
          <UserForm form={form} setForm={setForm} err={formErr} setErr={setFormErr} />
          <div className="modal-actions">
            <button className="btn-cancel" onClick={() => setAddOpen(false)}>Cancel</button>
            <button className="btn-save" onClick={handleAdd}>Add User</button>
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      <div className={`overlay${editUser ? " open" : ""}`} onClick={e => e.target === e.currentTarget && setEditUser(null)}>
        <div className="modal">
          <div className="modal-hd">
            <h2>Edit User</h2>
            <button className="mc-btn" onClick={() => setEditUser(null)}><Icons.X /></button>
          </div>
          {editUser && (
            <>
              <div className="fg">
                <label>User ID</label>
                <input value={editUser.id} disabled style={{ background: "var(--bg)", color: "var(--muted)" }} />
              </div>
              <UserForm form={form} setForm={setForm} err={formErr} setErr={setFormErr} />
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setEditUser(null)}>Cancel</button>
                <button className="btn-save" onClick={handleEdit}>Save Changes</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── View Modal ── */}
      <div className={`overlay${viewUser ? " open" : ""}`} onClick={e => e.target === e.currentTarget && setViewUser(null)}>
        <div className="modal">
          <div className="modal-hd">
            <h2>User Details</h2>
            <button className="mc-btn" onClick={() => setViewUser(null)}><Icons.X /></button>
          </div>
          {viewUser && (
            <>
              <div className="view-grid">
                {[
                  ["User ID", viewUser.id],
                  ["Full Name", viewUser.name],
                  ["Role", viewUser.role],
                  ["Email", viewUser.email],
                  ["Assigned Location", viewUser.location],
                  ["Added Date", viewUser.date],
                ].map(([lbl, val]) => (
                  <div className="vf" key={lbl}>
                    <div className="vf-lbl">{lbl}</div>
                    <div className="vf-val">
                      {lbl === "Role"
                        ? <span className={`badge ${val === "Chief Manager" ? "badge-mgr" : "badge-tech"}`}>{val}</span>
                        : val}
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setViewUser(null)}>Close</button>
                <button className="btn-save" onClick={() => { setViewUser(null); openEdit(viewUser); }}>Edit User</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Delete Modal ── */}
      <div className={`overlay${deleteUser ? " open" : ""}`} onClick={e => e.target === e.currentTarget && setDeleteUser(null)}>
        <div className="modal">
          <div className="modal-hd">
            <h2>Delete User</h2>
            <button className="mc-btn" onClick={() => setDeleteUser(null)}><Icons.X /></button>
          </div>
          {deleteUser && (
            <>
              <div className="del-center">
                <Icons.AlertTriangle />
                <h3>Remove {deleteUser.name}?</h3>
                <p>This will permanently delete <strong>{deleteUser.id}</strong> from the system. This action cannot be undone.</p>
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setDeleteUser(null)}>Cancel</button>
                <button className="btn-del-confirm" onClick={handleDelete}>Yes, Delete</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Toast ── */}
      <div className={`toast toast-${toast.type}${toast.visible ? " visible" : ""}`}>{toast.msg}</div>
    </>
  );
}

// ─── Reusable Form ─────────────────────────────────────────────────────────────
function UserForm({ form, setForm, err, setErr }) {
  const f = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErr(p => { const n = { ...p }; delete n[k]; return n; });
  };
  const inp = (k, ph, type = "text") => (
    <div className="fg">
      <label>{ph}</label>
      <input
        type={type}
        placeholder={ph}
        value={form[k]}
        onChange={e => f(k, e.target.value)}
        style={err[k] ? { borderColor: "var(--red)" } : {}}
      />
      {err[k] && <span style={{ fontSize: 11, color: "var(--red)", marginTop: 3, display: "block" }}>{err[k]}</span>}
    </div>
  );
  return (
    <>
      <div className="form-row">
        {inp("name", "Full Name")}
        {inp("email", "Email Address", "email")}
      </div>
      <div className="form-row">
        <div className="fg">
          <label>Role</label>
          <select value={form.role} onChange={e => f("role", e.target.value)}>
            <option value="Technician">Technician</option>
            <option value="Chief Manager">Chief Manager</option>
          </select>
        </div>
        {inp("location", "Assigned Location")}
      </div>
    </>
  );
}