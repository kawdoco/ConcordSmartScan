import { useState } from "react";
import { useNavigate } from "react-router-dom";

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --blue: #1a3fd4; --blue-dk: #1230a8; --blue-lt: #eef1fd;
    --text: #0f1623; --muted: #6b7280; --border: #e5e7eb;
    --bg: #f4f6fb; --white: #fff; --red: #ef4444;
    --sidebar: 240px;
  }
`;

function IconDashboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function IconMachines() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
      <path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>
    </svg>
  );
}
function IconStores() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function IconGarments() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h1.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
    </svg>
  );
}
function IconApproved() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  );
}
function IconMapPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function IconChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

const NAV_ROUTES = {
  "Dashboard": "/dashboard",
  "Users": "/users",
  "Machines": "/machines",
  "Stores": "/stores/add",
  "Garments": "/garments",
  "Approved Requests": "/approved-requests",
};

const EMPTY_FORM = () => ({
  storeName: "",
  storeId: "",
  phoneNumber: "",
  address: "",
  latitude: "",
  longitude: "",
});

export default function AddStore() {
  const navigate = useNavigate();

  const NAV_ITEMS = [
    { label: "Dashboard",         Icon: IconDashboard },
    { label: "Users",             Icon: IconUsers },
    { label: "Machines",          Icon: IconMachines },
    { label: "Stores",            Icon: IconStores },
    { label: "Garments",          Icon: IconGarments },
    { label: "Approved Requests", Icon: IconApproved },
  ];

  const [form, setForm] = useState(EMPTY_FORM());
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const validate = () => {
    const e = {};
    if (!form.storeName.trim()) e.storeName = "Store name is required.";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Phone number is required.";
    else if (!/^\d{10}$/.test(form.phoneNumber.trim())) e.phoneNumber = "Phone number must be exactly 10 digits.";
    if (!form.address.trim()) e.address = "Address is required.";
    if (form.latitude !== "" && (isNaN(form.latitude) || Number(form.latitude) < -90 || Number(form.latitude) > 90))
      e.latitude = "Latitude must be between -90 and 90.";
    if (form.longitude !== "" && (isNaN(form.longitude) || Number(form.longitude) < -180 || Number(form.longitude) > 180))
      e.longitude = "Longitude must be between -180 and 180.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = () => {
    if (validate()) {
      showNotification("Store added successfully!", "success");
      setForm(EMPTY_FORM());
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM());
    setErrors({});
    showNotification("Form cleared.", "info");
  };

  const handleNav = (label) => {
    if (NAV_ROUTES[label]) navigate(NAV_ROUTES[label]);
  };

  return (
    <>
      <style>{globalStyle}</style>
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Sora', sans-serif", backgroundColor: "#f4f6fb" }}>

        {/* SIDEBAR */}
        <div style={{ width: "240px", background: "#fff", borderRight: "1px solid #e5e7eb", boxShadow: "2px 0 12px rgba(0,0,0,.04)", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 }}>
          <div>
            <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#1a3fd4", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "16px", flexShrink: 0 }}>C</div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "15px", color: "#0f1623", lineHeight: 1.1 }}>Concord</div>
                <div style={{ fontSize: "11px", color: "#1a3fd4", fontWeight: "600" }}>Apparel</div>
              </div>
            </div>
            <nav style={{ padding: "14px 10px" }}>
              {NAV_ITEMS.map(({ label, Icon }) => {
                const isActive = label === "Stores";
                return (
                  <button
                    key={label}
                    onClick={() => handleNav(label)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", border: "none", cursor: "pointer", background: isActive ? "#1a3fd4" : "transparent", color: isActive ? "#fff" : "#6b7280", fontWeight: isActive ? "600" : "500", fontSize: "13.5px", marginBottom: "2px", textAlign: "left", transition: "all 0.15s", fontFamily: "inherit", whiteSpace: "nowrap", overflow: "hidden" }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "#f4f6fb"; e.currentTarget.style.color = "#0f1623"; } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7280"; } }}
                  >
                    <Icon />
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>
          <div style={{ padding: "14px 16px", borderTop: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#667eea,#764ba2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "#fff", flexShrink: 0 }}>AU</div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f1623" }}>Admin User</div>
              <div style={{ fontSize: "11px", color: "#6b7280" }}>system.admin@concord.com</div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ marginLeft: "240px", flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

          {/* TOPBAR */}
          <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f4f6fb", border: "1.5px solid #e5e7eb", borderRadius: "9px", padding: "8px 14px", width: "340px" }}>
              <IconSearch />
              <input type="text" placeholder="Search by Store ID, Machine ID, or Address" style={{ border: "none", background: "none", outline: "none", fontFamily: "inherit", fontSize: "13px", color: "#0f1623", width: "100%" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <button onClick={() => showNotification("No new notifications.", "info")} style={{ position: "relative", width: "36px", height: "36px", border: "1.5px solid #e5e7eb", borderRadius: "8px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
                <IconBell />
                <span style={{ position: "absolute", top: "6px", right: "7px", width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", border: "2px solid #fff" }} />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "600", fontSize: "13px", color: "#0f1623" }}>Admin User</div>
                  <div style={{ fontSize: "11px", color: "#6b7280" }}>system.admin@concord.com</div>
                </div>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#667eea,#764ba2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "#fff" }}>AU</div>
              </div>
            </div>
          </div>

          {/* PAGE BODY */}
          <div style={{ padding: "28px", flex: 1 }}>

            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
              <span style={{ cursor: "pointer", color: "#1a3fd4", fontWeight: "500" }} onClick={() => navigate("/stores/add")}>Stores</span>
              <IconChevron />
              <span style={{ color: "#0f1623" }}>Add New Store</span>
            </div>

            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f1623", margin: "0 0 24px 0", letterSpacing: "-0.4px" }}>Add New Store</h1>

            {notification && (
              <div style={{ marginBottom: "20px", padding: "13px 20px", borderRadius: "10px", background: notification.type === "success" ? "#065f46" : "#1230a8", color: "#fff", fontSize: "13px", fontWeight: "600", boxShadow: "0 8px 28px rgba(0,0,0,.18)" }}>
                {notification.message}
              </div>
            )}

            {/* FORM CARD */}
            <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden", maxWidth: "780px" }}>

              <div style={{ padding: "18px 22px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#1a3fd4" }}><IconStores /></span>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "15px", color: "#0f1623" }}>Store Details</div>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>Fill in the details to register a new store.</div>
                </div>
              </div>

              <div style={{ padding: "22px" }}>

                {/* Store Name */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontWeight: "600", fontSize: "12.5px", marginBottom: "6px", color: "#0f1623" }}>Store Name</label>
                  <input
                    name="storeName" value={form.storeName} onChange={handleChange}
                    placeholder="Enter store name"
                    style={{ width: "100%", border: `1.5px solid ${errors.storeName ? "#ef4444" : "#e5e7eb"}`, borderRadius: "8px", padding: "10px 12px", fontFamily: "inherit", fontSize: "13.5px", color: "#0f1623", outline: "none", background: "#fff", boxSizing: "border-box" }}
                    onFocus={e => { if (!errors.storeName) e.target.style.borderColor = "#1a3fd4"; }}
                    onBlur={e => { if (!errors.storeName) e.target.style.borderColor = "#e5e7eb"; }}
                  />
                  {errors.storeName && <span style={{ fontSize: "11px", color: "#ef4444", marginTop: "3px", display: "block" }}>{errors.storeName}</span>}
                </div>

                {/* Store ID + Phone */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontWeight: "600", fontSize: "12.5px", marginBottom: "6px", color: "#0f1623" }}>Store ID</label>
                    <input
                      name="storeId" value={form.storeId} onChange={handleChange}
                      placeholder="Enter store ID"
                      style={{ width: "100%", border: `1.5px solid ${errors.storeId ? "#ef4444" : "#e5e7eb"}`, borderRadius: "8px", padding: "10px 12px", fontFamily: "inherit", fontSize: "13.5px", color: "#0f1623", outline: "none", background: "#fff", boxSizing: "border-box" }}
                      onFocus={e => { if (!errors.storeId) e.target.style.borderColor = "#1a3fd4"; }}
                      onBlur={e => { if (!errors.storeId) e.target.style.borderColor = "#e5e7eb"; }}
                    />
                    {errors.storeId && <span style={{ fontSize: "11px", color: "#ef4444", marginTop: "3px", display: "block" }}>{errors.storeId}</span>}
                  </div>
                  <div>
                    <label style={{ display: "block", fontWeight: "600", fontSize: "12.5px", marginBottom: "6px", color: "#0f1623" }}>Phone Number</label>
                    <input
                      name="phoneNumber" value={form.phoneNumber} onChange={handleChange} maxLength={10}
                      placeholder="Enter phone number"
                      style={{ width: "100%", border: `1.5px solid ${errors.phoneNumber ? "#ef4444" : "#e5e7eb"}`, borderRadius: "8px", padding: "10px 12px", fontFamily: "inherit", fontSize: "13.5px", color: "#0f1623", outline: "none", background: "#fff", boxSizing: "border-box" }}
                      onFocus={e => { if (!errors.phoneNumber) e.target.style.borderColor = "#1a3fd4"; }}
                      onBlur={e => { if (!errors.phoneNumber) e.target.style.borderColor = "#e5e7eb"; }}
                    />
                    {errors.phoneNumber && <span style={{ fontSize: "11px", color: "#ef4444", marginTop: "3px", display: "block" }}>{errors.phoneNumber}</span>}
                  </div>
                </div>

                {/* Address */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontWeight: "600", fontSize: "12.5px", marginBottom: "6px", color: "#0f1623" }}>Address</label>
                  <textarea
                    name="address" value={form.address} onChange={handleChange} rows={3}
                    placeholder="Enter store address"
                    style={{ width: "100%", border: `1.5px solid ${errors.address ? "#ef4444" : "#e5e7eb"}`, borderRadius: "8px", padding: "10px 12px", fontFamily: "inherit", fontSize: "13.5px", color: "#0f1623", outline: "none", resize: "vertical", background: "#fff", boxSizing: "border-box" }}
                    onFocus={e => { if (!errors.address) e.target.style.borderColor = "#1a3fd4"; }}
                    onBlur={e => { if (!errors.address) e.target.style.borderColor = "#e5e7eb"; }}
                  />
                  {errors.address && <span style={{ fontSize: "11px", color: "#ef4444", marginTop: "3px", display: "block" }}>{errors.address}</span>}
                </div>

                {/* Location */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", borderTop: "1px solid #e5e7eb", paddingTop: "18px" }}>
                  <span style={{ color: "#1a3fd4" }}><IconMapPin /></span>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "15px", color: "#0f1623" }}>Location Coordinates</div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>Optional — enter GPS coordinates for map pinning.</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "24px" }}>
                  <div>
                    <label style={{ display: "block", fontWeight: "600", fontSize: "12.5px", marginBottom: "6px", color: "#0f1623" }}>Latitude</label>
                    <input
                      name="latitude" value={form.latitude} onChange={handleChange} type="number"
                      placeholder="e.g. 6.9271"
                      style={{ width: "100%", border: `1.5px solid ${errors.latitude ? "#ef4444" : "#e5e7eb"}`, borderRadius: "8px", padding: "10px 12px", fontFamily: "inherit", fontSize: "13.5px", color: "#0f1623", outline: "none", background: "#fff", boxSizing: "border-box" }}
                      onFocus={e => { if (!errors.latitude) e.target.style.borderColor = "#1a3fd4"; }}
                      onBlur={e => { if (!errors.latitude) e.target.style.borderColor = "#e5e7eb"; }}
                    />
                    {errors.latitude && <span style={{ fontSize: "11px", color: "#ef4444", marginTop: "3px", display: "block" }}>{errors.latitude}</span>}
                  </div>
                  <div>
                    <label style={{ display: "block", fontWeight: "600", fontSize: "12.5px", marginBottom: "6px", color: "#0f1623" }}>Longitude</label>
                    <input
                      name="longitude" value={form.longitude} onChange={handleChange} type="number"
                      placeholder="e.g. 79.8612"
                      style={{ width: "100%", border: `1.5px solid ${errors.longitude ? "#ef4444" : "#e5e7eb"}`, borderRadius: "8px", padding: "10px 12px", fontFamily: "inherit", fontSize: "13.5px", color: "#0f1623", outline: "none", background: "#fff", boxSizing: "border-box" }}
                      onFocus={e => { if (!errors.longitude) e.target.style.borderColor = "#1a3fd4"; }}
                      onBlur={e => { if (!errors.longitude) e.target.style.borderColor = "#e5e7eb"; }}
                    />
                    {errors.longitude && <span style={{ fontSize: "11px", color: "#ef4444", marginTop: "3px", display: "block" }}>{errors.longitude}</span>}
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    onClick={handleCancel}
                    style={{ padding: "10px 18px", border: "1.5px solid #e5e7eb", borderRadius: "8px", background: "#fff", color: "#6b7280", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#f4f6fb"; e.currentTarget.style.color = "#0f1623"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6b7280"; }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    style={{ padding: "10px 22px", border: "none", borderRadius: "8px", background: "#1a3fd4", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontFamily: "inherit" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1230a8"}
                    onMouseLeave={e => e.currentTarget.style.background = "#1a3fd4"}
                  >
                    <IconPlus /> Add Store
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div style={{ padding: "16px 28px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#6b7280", background: "#fff" }}>
            <span>© 2024 Concord Apparel Pvt Ltd. Machine Replacement Locator System.</span>
            <div style={{ display: "flex", gap: "20px" }}>
              {["Privacy Policy", "System Manual", "Technical Support"].map(link => (
                <a key={link} href="#" style={{ color: "#6b7280", textDecoration: "none" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#1a3fd4"}
                  onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
                >{link}</a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}