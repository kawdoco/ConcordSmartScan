import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f0f2f5; color: #1a1a2e; }

  .layout { display: flex; min-height: 100vh; }

  /* ── Sidebar ── */
  .sidebar {
    width: 210px; background: #fff;
    border-right: 1px solid #e4e7ec;
    display: flex; flex-direction: column; flex-shrink: 0;
  }
  .sidebar-logo {
    display: flex; align-items: center; gap: 10px;
    padding: 18px 20px 16px; border-bottom: 1px solid #e4e7ec;
  }
  .logo-icon {
    width: 36px; height: 36px; background: #1e3a8a; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 700; font-size: 15px;
  }
  .logo-text strong { display: block; font-size: 13px; font-weight: 600; color: #111; }
  .logo-text span { font-size: 11px; color: #2563eb; font-weight: 500; }

  .sidebar-nav { padding: 12px 10px; flex: 1; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 7px;
    font-size: 13px; color: #4b5563; cursor: pointer;
    font-weight: 500; transition: background 0.15s, color 0.15s; margin-bottom: 2px;
  }
  .nav-item:hover { background: #f1f5ff; color: #1e3a8a; }
  .nav-item.active { background: #2563eb; color: #fff; }

  .sidebar-footer {
    padding: 14px 16px; border-top: 1px solid #e4e7ec;
    display: flex; align-items: center; gap: 10px;
  }
  .avatar-sm {
    width: 32px; height: 32px; border-radius: 50%;
    background: #dbeafe; display: flex; align-items: center;
    justify-content: center; font-size: 12px; font-weight: 600;
    color: #1e40af; flex-shrink: 0;
  }
  .footer-info strong { font-size: 12px; color: #111; display: block; }
  .footer-info span { font-size: 11px; color: #9ca3af; }

  /* ── Main ── */
  .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

  .topbar {
    height: 56px; background: #fff; border-bottom: 1px solid #e4e7ec;
    display: flex; align-items: center; padding: 0 24px; gap: 16px;
  }
  .search-box {
    flex: 1; max-width: 420px; display: flex; align-items: center; gap: 8px;
    background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px;
    padding: 7px 12px; font-size: 13px; color: #9ca3af;
  }
  .topbar-right { margin-left: auto; display: flex; align-items: center; gap: 14px; }
  .bell-btn { background: none; border: none; cursor: pointer; color: #6b7280; display: flex; align-items: center; }
  .admin-info { text-align: right; }
  .admin-info strong { display: block; font-size: 12px; color: #111; }
  .admin-info span { font-size: 11px; color: #9ca3af; }
  .avatar-lg {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #1e40af);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 600; color: #fff;
  }

  /* ── Page ── */
  .page-content { padding: 28px 32px; flex: 1; }

  .breadcrumb {
    font-size: 12.5px; color: #9ca3af;
    display: flex; align-items: center; gap: 6px; margin-bottom: 6px;
  }
  .breadcrumb a { color: #9ca3af; text-decoration: none; }
  .breadcrumb a:hover { color: #2563eb; }
  .breadcrumb span { color: #4b5563; }
  .page-title { font-size: 22px; font-weight: 700; color: #111827; margin-bottom: 22px; }

  /* ── Form card ── */
  .form-card {
    background: #fff; border-radius: 12px;
    border: 1px solid #e5e7eb; padding: 28px; max-width: 740px;
  }

  .section-heading {
    display: flex; align-items: center; gap: 8px;
    font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 20px;
  }
  .section-heading svg { color: #2563eb; }
  .section-divider { border: none; border-top: 1px solid #f0f2f5; margin: 24px 0; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .form-row.full { grid-template-columns: 1fr; }
  .form-group { display: flex; flex-direction: column; gap: 5px; }

  .label-row {
    display: flex; align-items: center; justify-content: space-between;
  }
  label { font-size: 12.5px; font-weight: 500; color: #374151; }
  .label-icons { display: flex; gap: 4px; }
  .icon-btn {
    background: none; border: none; cursor: pointer;
    color: #9ca3af; padding: 2px; display: flex; align-items: center;
    border-radius: 4px; transition: color 0.15s, background 0.15s;
  }
  .icon-btn:hover { color: #2563eb; background: #eff6ff; }

  .field-hint { font-size: 11px; color: #9ca3af; margin-top: 3px; }

  input[type="text"], input[type="tel"], textarea {
    padding: 9px 12px; border: 1px solid #d1d5db; border-radius: 7px;
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    color: #111827; background: #fff; outline: none; width: 100%;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  input:focus, textarea:focus {
    border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
  }
  input:disabled {
    background: #f3f4f6; color: #9ca3af; cursor: not-allowed;
  }
  textarea { resize: vertical; min-height: 80px; }

  /* ── Actions ── */
  .form-actions {
    display: flex; justify-content: flex-end; align-items: center; gap: 12px;
    margin-top: 24px; padding-top: 20px; border-top: 1px solid #f0f2f5;
  }
  .btn-cancel {
    background: none; border: none; font-size: 13.5px; font-weight: 500;
    color: #4b5563; cursor: pointer; padding: 9px 18px; border-radius: 7px;
    transition: background 0.15s;
  }
  .btn-cancel:hover { background: #f3f4f6; }
  .btn-primary {
    display: flex; align-items: center; gap: 7px;
    background: #1e3a8a; color: #fff; border: none; border-radius: 7px;
    padding: 9px 20px; font-size: 13.5px; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: background 0.15s, transform 0.1s;
  }
  .btn-primary:hover { background: #1e40af; }
  .btn-primary:active { transform: scale(0.98); }

  /* ── Footer ── */
  .page-footer {
    padding: 16px 32px; border-top: 1px solid #e4e7ec;
    display: flex; justify-content: space-between; align-items: center;
    font-size: 11.5px; color: #9ca3af; background: #fff;
  }
  .footer-links { display: flex; gap: 16px; }
  .footer-links a { color: #9ca3af; text-decoration: none; }
  .footer-links a:hover { color: #2563eb; }
`;

const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const IC = {
  search:   "M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z",
  bell:     "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  dash:     "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  users:    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  machines: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  stores:   "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18",
  garments: "M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z",
  requests: "M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  location: "M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z M12 10a2 2 0 100-4 2 2 0 000 4z",
  pencil:   "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  lock:     "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4",
  save:     "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M17 21v-8H7v8 M7 3v5h8",
};

const navItems = [
  { label: "Dashboard",        icon: IC.dash },
  { label: "Users",            icon: IC.users },
  { label: "Machines",         icon: IC.machines },
  { label: "Stores",           icon: IC.stores },
  { label: "Garments",         icon: IC.garments, active: true },
  { label: "Approved Requests",icon: IC.requests },
];

export default function EditGarmentPage() {
  const [form, setForm] = useState({
    name:    "Slim Fit Cotton Shirt",
    garmentId: "GR012",
    phone:   "+94 11 234 5678",
    address: "No. 45, Industrial Zone, Colombo 03, Sri Lanka",
    lat:     "6.9271",
    lng:     "79.8612",
  });

  const [idLocked, setIdLocked] = useState(true);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <style>{styles}</style>
      <div className="layout">

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">C</div>
            <div className="logo-text">
              <strong>Concord</strong><span>Apparel</span>
            </div>
          </div>
          <nav className="sidebar-nav">
            {navItems.map(n => (
              <div key={n.label} className={`nav-item ${n.active ? "active" : ""}`}>
                <Icon d={n.icon} size={15} />{n.label}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="avatar-sm">AU</div>
            <div className="footer-info">
              <strong>Admin User</strong>
              <span>system.admin@concord.com</span>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="main">

          {/* Topbar */}
          <header className="topbar">
            <div className="search-box">
              <Icon d={IC.search} size={14} />
              Search by Garment ID, Style, or Material
            </div>
            <div className="topbar-right">
              <button className="bell-btn"><Icon d={IC.bell} size={18} /></button>
              <div className="admin-info">
                <strong>Admin User</strong>
                <span>system.admin@concord.com</span>
              </div>
              <div className="avatar-lg">AU</div>
            </div>
          </header>

          {/* Page content */}
          <div className="page-content">
            <div className="breadcrumb">
              <a href="#">Garments</a> › <span>Edit Garment</span>
            </div>
            <h1 className="page-title">Edit Garment</h1>

            <div className="form-card">

              {/* ── Garment Details ── */}
              <div className="section-heading">
                <Icon d={IC.garments} size={16} />
                Garment Details
              </div>

              {/* Garment Name */}
              <div className="form-row full">
                <div className="form-group">
                  <label>Garment Name</label>
                  <input type="text" value={form.name} onChange={set("name")} />
                </div>
              </div>

              {/* Garment ID + Phone */}
              <div className="form-row">
                <div className="form-group">
                  {/* Label row with edit/lock icons */}
                  <div className="label-row">
                    <label>Garment ID</label>
                    <div className="label-icons">
                      <button
                        className="icon-btn"
                        title={idLocked ? "Edit ID" : "Edit mode on"}
                        onClick={() => setIdLocked(false)}
                      >
                        <Icon d={IC.pencil} size={13} />
                      </button>
                      <button
                        className="icon-btn"
                        title="Lock ID"
                        onClick={() => setIdLocked(true)}
                      >
                        <Icon d={IC.lock} size={13} />
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={form.garmentId}
                    onChange={set("garmentId")}
                    disabled={idLocked}
                  />
                  <span className="field-hint">Fixed system identifier</span>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" value={form.phone} onChange={set("phone")} />
                </div>
              </div>

              {/* Address */}
              <div className="form-row full">
                <div className="form-group">
                  <label>Address</label>
                  <textarea value={form.address} onChange={set("address")} />
                </div>
              </div>

              <hr className="section-divider" />

              {/* ── Location Coordinates ── */}
              <div className="section-heading">
                <Icon d={IC.location} size={16} />
                Location Coordinates
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Latitude</label>
                  <input type="text" value={form.lat} onChange={set("lat")} />
                </div>
                <div className="form-group">
                  <label>Longitude</label>
                  <input type="text" value={form.lng} onChange={set("lng")} />
                </div>
              </div>

              {/* ── Actions ── */}
              <div className="form-actions">
                <button className="btn-cancel">Cancel</button>
                <button className="btn-primary">
                  <Icon d={IC.save} size={14} />
                  Update Garment
                </button>
              </div>

            </div>
          </div>

          {/* Footer */}
          <footer className="page-footer">
            <span>© 2024 Concord Apparel Pvt Ltd. Machine Replacement Locator System.</span>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">System Manual</a>
              <a href="#">Technical Support</a>
            </div>
          </footer>

        </div>
      </div>
    </>
  );
}