import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../components/Toast";
import AppFooter from "../components/AppFooter";
import ConfirmActionModal from "../components/ConfirmActionModal";
import { useSearchParams } from "react-router-dom";
import apiClient from "../services/api";
import { formatUserId } from "./userId";
import "./AddUser.css";
import "./UserManagement.css";

const Icons = {
  Users: () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  Eye: () => <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
  Edit: () => <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  Trash: () => <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>,
  Plus: () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>,
  X: () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  ChevLeft: () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>,
  ChevRight: () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
};

const today = () => new Date().toISOString().slice(0, 10);

const formatDate = (dateValue) => {
  if (!dateValue) return "-";
  try {
    // Handle array format [year, month, day, ...]
    if (Array.isArray(dateValue)) {
      const [year, month, day] = dateValue;
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }

    const d = new Date(dateValue);
    if (isNaN(d.getTime())) {
      return String(dateValue).slice(0, 10);
    }
    return d.toISOString().split("T")[0];
  } catch {
    return String(dateValue).slice(0, 10);
  }
};

const formatRoleDisplay = (role) => {
  if (role === "ADMIN") return "Admin";
  if (role === "CHIEF_MANAGER") return "Chief Manager";
  if (role === "TECHNICIAN") return "Technician";
  return role;
};

const formatAssignedLocation = (user) => {
  if (user?.garmentId != null && user.garmentId !== "") {
    return `GAR-${String(user.garmentId).padStart(3, "0")}`;
  }
  return user?.location || "";
};

const toNumericId = (value) => {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
};

const roleClass = (roleDisplay) => {
  switch (roleDisplay) {
    case "Admin":
      return "admin";
    case "Chief Manager":
      return "chief";
    case "Technician":
      return "tech";
    default:
      return "default";
  }
};

const ROWS_PER_PAGE = 8;

export default function UserManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQ = searchParams.get("q") || "";
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [form, setForm] = useState({ fullName: "", role: "Technician", location: "", email: "", password: "" });
  const [formErr, setFormErr] = useState({});

  // Clear search params when navigating back to this page
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (newParams.has("q")) {
      newParams.delete("q");
      setSearchParams(newParams, { replace: true });
    }
  }, [location.pathname, setSearchParams, searchParams]);

  const loadUsers = useCallback((search = "") => {
    return apiClient
      .get("/users", {
        params: search ? { search } : undefined,
      })
      .then((res) => {
        const mapped = (Array.isArray(res.data) ? res.data : []).map((user) => ({
          id: String(user.id),
          fullName: user.name || "",
          role: formatRoleDisplay(user.role),
          location: formatAssignedLocation(user),
          email: user.email,
          date: formatDate(user.createdAt),
        }));
        mapped.sort((a, b) => toNumericId(a.id) - toNumericId(b.id));
        setUsers(mapped);
      })
      .catch(() => showToast("Failed to load users", "error"));
  }, [showToast]);

  useEffect(() => {
    loadUsers(searchQ);
  }, [loadUsers, searchQ]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const filtered = users.filter((user) => activeTab === "all" || user.role === activeTab);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

  const totalUsers = users.length;
  const managers = users.filter((user) => user.role === "Chief Manager").length;
  const techs = users.filter((user) => user.role === "Technician").length;

  useEffect(() => { setPage(1); }, [activeTab, searchQ]);

  // ── Form helpers ──
  const resetForm = () => {
    setForm({ fullName: "", role: "Technician", location: "", email: "", password: "" });
    setFormErr({});
  };

  const validate = (draft) => {
    const nextErrors = {};
    if (!draft.fullName.trim()) nextErrors.fullName = "Name is required";
    if (!draft.location.trim()) nextErrors.location = "Location is required";
    if (!draft.email.trim()) nextErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) nextErrors.email = "Invalid email";
    return nextErrors;
  };

  const handleAdd = () => {
    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setFormErr(nextErrors);
      return;
    }

    const payload = {
      name: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password || "changeme123",
      role: form.role === "Chief Manager" ? "CHIEF_MANAGER" : form.role.toUpperCase(),
      location: form.location.trim()
    };

    apiClient
      .post("/users", payload)
      .then((res) => {
        const user = res.data;
        setUsers((previous) => [
          {
            id: String(user.id),
            fullName: user.name || "",
            role: formatRoleDisplay(user.role),
            location: user.location || "",
            email: user.email,
            date: formatDate(user.createdAt)
          },
          ...previous
        ]);

        setAddOpen(false);
        resetForm();
        setActiveTab("all");
        setPage(1);
        showToast(`${user.name || "User"} added successfully`, "success");
      })
      .catch((err) => {
        const message = err.response?.data?.message || "Failed to add user";
        showToast(message, "error");
      });
  };

  const handleDelete = () => {
    if (!deleteUser) return;

    apiClient
      .delete(`/users/${deleteUser.id}`)
      .then(() => {
        setUsers((previous) => previous.filter((user) => user.id !== deleteUser.id));
        showToast(`${deleteUser.fullName || "User"} removed`, "error");
        setDeleteUser(null);
      })
      .catch(() => showToast("Failed to delete user", "error"));
  };

  const pages = (() => {
    if (totalPages <= 6) return Array.from({ length: totalPages }, (_, index) => index + 1);
    const result = [1];
    if (safePage > 3) result.push("...");
    for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i += 1) {
      result.push(i);
    }
    if (safePage < totalPages - 2) result.push("...");
    result.push(totalPages);
    return result;
  })();

  return (
    <section className="user-management-page">
      <div className="user-management-content">
        <div className="user-management-stats">
          {[
            { label: "Total Users", value: totalUsers, Icon: Icons.Users },
            { label: "Chief Managers", value: managers, Icon: Icons.Users },
            { label: "Technicians", value: techs, Icon: Icons.Users }
          ].map(({ label, value, Icon }) => (
            <div className="user-management-stat-card" key={label}>
              <div className="user-management-stat-icon"><Icon /></div>
              <div>
                <div className="user-management-stat-label">{label}</div>
                <div className="user-management-stat-value">{value.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="user-management-tabs">
          {["all", "Chief Manager", "Technician"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`user-management-tab${activeTab === tab ? " active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "all" ? "All Users" : `${tab}s`}
            </button>
          ))}
        </div>

        <div className="user-management-card">
          <div className="user-management-card-header">
            <div>
              <div className="user-management-card-title">Registered Users</div>
              <div className="user-management-card-subtitle">Manage user permissions and location assignments.</div>
            </div>
            <button type="button" className="user-management-btn-primary" onClick={() => navigate("/users/add")}>
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
                    <div className="user-management-empty">
                      <Icons.Users />
                      <p className="user-management-empty-title">No users found</p>
                      <p className="user-management-empty-subtitle">Click "Add New User" to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((user) => (
                  <tr key={user.id}>
                    <td><span className="user-management-uid">{formatUserId(user.id)}</span></td>
                    <td><span className="user-management-name">{user.fullName}</span></td>
                    <td>
                      <span className={`user-management-badge ${roleClass(user.role)}`}>{user.role}</span>
                    </td>
                    <td>{user.location || "-"}</td>
                    <td>{user.date}</td>
                    <td>
                      <div className="user-management-actions">
                        <button type="button" className="user-management-icon-btn" title="View" onClick={() => navigate(`/users/view/${user.id}`)}><Icons.Eye /></button>
                        <button type="button" className="user-management-icon-btn" title="Edit" onClick={() => navigate(`/users/edit/${user.id}`)}><Icons.Edit /></button>
                        <button type="button" className="user-management-icon-btn delete" title="Delete" onClick={() => setDeleteUser(user)}><Icons.Trash /></button>
                      </div>
                    </td>
                  </tr>
                 ))
              )}
             </tbody>
            </table>

            <div className="user-management-footer">
            <span>
              {filtered.length === 0
                ? "No users"
                : `Showing ${(safePage - 1) * ROWS_PER_PAGE + 1}-${Math.min(safePage * ROWS_PER_PAGE, filtered.length)} of ${filtered.length} user${filtered.length !== 1 ? "s" : ""}`}
            </span>
            <div className="user-management-pagination">
              <button type="button" className="user-management-pg-btn" disabled={safePage === 1} onClick={() => setPage((previous) => previous - 1)}>
                <Icons.ChevLeft />
              </button>
              {pages.map((value, index) =>
                value === "..." ? (
                  <button key={`dots-${index}`} type="button" className="user-management-pg-btn" disabled>
                    ...
                  </button>
                ) : (
                  <button
                    key={value}
                    type="button"
                    className={`user-management-pg-btn${safePage === value ? " active" : ""}`}
                    onClick={() => setPage(value)}
                  >
                    {value}
                  </button>
                )
              )}
              <button type="button" className="user-management-pg-btn" disabled={safePage === totalPages} onClick={() => setPage((previous) => previous + 1)}>
                <Icons.ChevRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`user-management-overlay${addOpen ? " open" : ""}`} onClick={(event) => event.target === event.currentTarget && setAddOpen(false)}>
        <div className="user-management-modal">
          <div className="user-management-modal-header">
            <h2>Add New User</h2>
            <button type="button" className="user-management-modal-close" onClick={() => setAddOpen(false)}><Icons.X /></button>
          </div>
          <UserForm form={form} setForm={setForm} err={formErr} setErr={setFormErr} />
          <div className="user-management-modal-actions">
            <button type="button" className="user-management-btn-secondary" onClick={() => setAddOpen(false)}>Cancel</button>
            <button type="button" className="user-management-btn-primary" onClick={handleAdd}>Add User</button>
          </div>
        </div>
      </div>

      <ConfirmActionModal
        isOpen={Boolean(deleteUser)}
        title="Delete user?"
        message={deleteUser ? `Are you sure you want to delete ${deleteUser.fullName || "this user"} (${formatUserId(deleteUser.id)})? This action cannot be undone.` : ""}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="decline"
        onConfirm={handleDelete}
        onCancel={() => setDeleteUser(null)}
      />

      <AppFooter />
    </section>
  );
}

function UserForm({ form, setForm, err, setErr }) {
  const updateField = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErr((previous) => {
      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  const field = (key, label, type = "text") => (
    <div className="add-user-field">
      <label>{label}</label>
      <input
        type={type}
        placeholder={label}
        value={form[key]}
        onChange={(event) => updateField(key, event.target.value)}
        className={err[key] ? "field-error" : ""}
      />
      {err[key] && <span className="field-error-text">{err[key]}</span>}
    </div>
  );

  return (
    <div className="user-management-form">
      <div className="add-user-grid-two user-management-form-grid">
        {field("fullName", "Full Name")}
        {field("email", "Email Address", "email")}
      </div>

      <div className="add-user-grid-two user-management-form-grid">
        <div className="add-user-field">
          <label>Role</label>
          <select value={form.role} onChange={(event) => updateField("role", event.target.value)}>
            <option value="Technician">Technician</option>
            <option value="Chief Manager">Chief Manager</option>
          </select>
        </div>
        {field("location", "Assigned Location")}
      </div>

      {field("password", "Password (leave blank to keep existing)", "password")}
    </div>
  );
}
