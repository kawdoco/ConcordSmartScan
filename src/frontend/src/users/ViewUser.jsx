import { useState } from "react";

// ─── Sample Data ───────────────────────────────────────────────────────────────
const SAMPLE_USERS = [
  {
    id: 1,
    name: "John Silva",
    email: "john.silva@concord.com",
    phone: "0771234567",
    role: "ADMIN",
    department: "Management",
    address: "No: 12, Kandy Road, Colombo 10.",
    joinedDate: "2023-01-15",
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Priya Fernando",
    email: "priya.fernando@concord.com",
    phone: "0779876543",
    role: "MANAGER",
    department: "Operations",
    address: "No: 34, Galle Road, Negombo.",
    joinedDate: "2023-06-22",
    status: "ACTIVE",
  },
  {
    id: 3,
    name: "Kasun Perera",
    email: "kasun.perera@concord.com",
    phone: "0761122334",
    role: "STAFF",
    department: "Warehouse",
    address: "No: 7, Temple Street, Kurunegala.",
    joinedDate: "2024-02-10",
    status: "INACTIVE",
  },
];

// ─── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ activeItem }) {
  const navItems = [
    { label: "Dashboard", icon: "⊞" },
    { label: "Users", icon: "👥" },
    { label: "Machines", icon: "🖨" },
    { label: "Stores", icon: "🏠" },
    { label: "Transfer Requests", icon: "≡" },
    { label: "Purchase Request", icon: "🛒" },
    { label: "Garments", icon: "👗" },
  ];

  return (
    <div style={{
      width: 220, minHeight: "100vh", background: "#1e3a5f", display: "flex",
      flexDirection: "column", padding: "0", fontFamily: "Inter, sans-serif",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 16px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: "#3b7dd8", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 18,
          }}>C</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Concord Apparel</div>
            <div style={{ color: "#8ab4d8", fontSize: 11 }}>Machine Locator Suite</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {navItems.map((item) => (
          <div key={item.label} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 20px", cursor: "pointer",
            background: item.label === activeItem ? "#3b7dd8" : "transparent",
            color: item.label === activeItem ? "#fff" : "#b0c8e0",
            fontSize: 13, fontWeight: item.label === activeItem ? 600 : 400,
            borderRadius: item.label === activeItem ? "0 24px 24px 0" : 0,
            marginRight: 8,
          }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      {/* Bottom user */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", background: "#3b7dd8",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 14, fontWeight: 600,
          }}>A</div>
          <div>
            <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Admin User</div>
            <div style={{ color: "#8ab4d8", fontSize: 11 }}>admin@concord.com</div>
          </div>
        </div>
        <button style={{
          width: "100%", padding: "7px 0", background: "transparent",
          border: "1px solid rgba(255,255,255,0.25)", borderRadius: 6,
          color: "#b0c8e0", fontSize: 12, cursor: "pointer",
        }}>Logout</button>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ title }) {
  return (
    <div style={{
      background: "#fff", padding: "14px 28px", display: "flex",
      alignItems: "center", justifyContent: "space-between",
      borderBottom: "1px solid #e8edf3",
    }}>
      <div style={{ fontWeight: 700, fontSize: 18, color: "#1e3a5f" }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%", background: "#3b7dd8",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 13, fontWeight: 700,
        }}>A</div>
        <span style={{ fontSize: 13, color: "#444", fontWeight: 500 }}>admin</span>
        <span style={{ color: "#aaa", fontSize: 12 }}>▾</span>
      </div>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ label, color }) {
  const colors = {
    blue:  { bg: "#e8f0fe", text: "#1a56db" },
    green: { bg: "#e6f4ea", text: "#1e7e34" },
    red:   { bg: "#fdecea", text: "#c0392b" },
    gray:  { bg: "#f1f3f4", text: "#5f6368" },
  };
  const c = colors[color] || colors.gray;
  return (
    <span style={{
      background: c.bg, color: c.text, fontSize: 11, fontWeight: 600,
      padding: "3px 10px", borderRadius: 12, letterSpacing: 0.5,
    }}>{label}</span>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, value, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 14, color: "#1e2d40", fontWeight: 400 }}>
        {children || value}
      </div>
    </div>
  );
}

// ─── UserDetailsPanel ─────────────────────────────────────────────────────────
function UserDetailsPanel({ user, onBack }) {
  const roleColor = user.role === "ADMIN" ? "blue" : user.role === "MANAGER" ? "green" : "gray";
  const statusColor = user.status === "ACTIVE" ? "green" : "red";

  return (
    <div style={{ flex: 1, background: "#f4f7fb", fontFamily: "Inter, sans-serif" }}>
      <Header title="Concord Dashboard" />

      <div style={{ padding: "20px 28px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
          <span style={{ color: "#3b7dd8", cursor: "pointer" }} onClick={onBack}>Users</span>
          {" / "}
          <span>User Details: {user.id}</span>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff", borderRadius: 12, padding: "24px 28px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          {/* Card Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>👤</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#1e2d40" }}>User Information</span>
            </div>
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#3b7dd8", color: "#fff", border: "none",
              borderRadius: 8, padding: "9px 18px", fontSize: 13,
              fontWeight: 600, cursor: "pointer",
            }}>
              ✏️ Edit User
            </button>
          </div>

          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "20px 24px", marginBottom: 24 }}>
            <Field label="User ID" value={user.id} />
            <Field label="Full Name" value={user.name} />
            <Field label="Phone Number" value={user.phone} />
            <Field label="Address" value={user.address} />
          </div>

          {/* Row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "20px 24px", marginBottom: 24 }}>
            <Field label="Email" value={user.email} />
            <Field label="Department" value={user.department} />
            <Field label="Role">
              <Badge label={user.role} color={roleColor} />
            </Field>
            <Field label="Status">
              <Badge label={user.status} color={statusColor} />
            </Field>
          </div>

          {/* Info box */}
          <div style={{
            background: "#f0f4ff", borderRadius: 10, padding: "16px 20px", marginBottom: 24,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e2d40", marginBottom: 6 }}>
              Account Information
            </div>
            <div style={{ fontSize: 13, color: "#555" }}>
              🗓 Joined: {user.joinedDate} &nbsp;&nbsp; | &nbsp;&nbsp; 📧 {user.email}
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={onBack}
            style={{
              padding: "9px 20px", background: "#fff", border: "1px solid #ccc",
              borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#333", fontWeight: 500,
            }}
          >
            ← Back to Users
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Users Table (Management View) ───────────────────────────────────────────
function UsersTable({ onView }) {
  return (
    <div style={{ flex: 1, background: "#f4f7fb", fontFamily: "Inter, sans-serif" }}>
      <Header title="Concord Dashboard" />

      <div style={{ padding: "20px 28px" }}>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Users</div>

        <div style={{
          background: "#fff", borderRadius: 12, padding: "24px 28px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>👥</span>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#1e2d40" }}>User Management</span>
            </div>
            <button style={{
              background: "#3b7dd8", color: "#fff", border: "none",
              borderRadius: 8, padding: "9px 18px", fontSize: 13,
              fontWeight: 600, cursor: "pointer",
            }}>+ Add User</button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f0f4ff" }}>
                {["ID", "Name", "Email", "Phone", "Department", "Role", "Status", "Actions"].map(h => (
                  <th key={h} style={{
                    textAlign: "left", padding: "10px 12px", fontSize: 12,
                    color: "#888", fontWeight: 600, letterSpacing: 0.4,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_USERS.map((user, i) => (
                <tr key={user.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafbfd" }}>
                  <td style={{ padding: "12px", fontSize: 13, color: "#555" }}>{user.id}</td>
                  <td style={{ padding: "12px", fontSize: 13, fontWeight: 500, color: "#1e2d40" }}>{user.name}</td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#555" }}>{user.email}</td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#555" }}>{user.phone}</td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#555" }}>{user.department}</td>
                  <td style={{ padding: "12px" }}>
                    <Badge
                      label={user.role}
                      color={user.role === "ADMIN" ? "blue" : user.role === "MANAGER" ? "green" : "gray"}
                    />
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Badge label={user.status} color={user.status === "ACTIVE" ? "green" : "red"} />
                  </td>
                  <td style={{ padding: "12px" }}>
                    <button
                      title="View User"
                      onClick={() => onView(user)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: 18, padding: "2px 6px", borderRadius: 6,
                        color: "#3b7dd8",
                      }}
                    >👁</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activeItem="Users" />
      {selectedUser
        ? <UserDetailsPanel user={selectedUser} onBack={() => setSelectedUser(null)} />
        : <UsersTable onView={setSelectedUser} />
      }
    </div>
  );
}

