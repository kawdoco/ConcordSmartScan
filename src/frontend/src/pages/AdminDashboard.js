import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";
import AppFooter from "../components/AppFooter";
import apiClient from "../services/api";
import "./AdminDashboard.css";

/* ── tiny inline icons ── */
function IconMachine() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  );
}
function IconTransfer() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 8h11M14 5l4 3-4 3M17 16H6M10 13l-4 3 4 3" />
    </svg>
  );
}
function IconPurchase() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" />
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L22 7H7" />
    </svg>
  );
}
function IconEye() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function RequestTag({ type, status, code }) {
  const typeStr = (type || "").toLowerCase();
  const isTransfer = typeStr === "transfer" || typeStr === "relocation";
  const statusLower = (status || "").toLowerCase();
  const statusCls = statusLower === "pending" ? "adm-req-pending"
    : statusLower === "approved" ? "adm-req-approved"
    : statusLower === "declined" ? "adm-req-declined"
    : "adm-req-pending";
  return (
    <div className="adm-req-item">
      <span className={`adm-req-icon ${isTransfer ? "transfer" : "purchase"}`}>
        {isTransfer ? <IconTransfer /> : <IconPurchase />}
      </span>
      <div className="adm-req-body">
        <span className="adm-req-label">
          {isTransfer ? "Relocation Request" : "Purchase Request"}&nbsp;
          <span className="adm-req-code">{code ? `#${code}` : (isTransfer ? `#TR-${String(Math.floor(Math.random() * 900) + 100)}` : `#PUR-${String(Math.floor(Math.random() * 900) + 100)}`)}</span>
        </span>
        <span className="adm-req-sub">{isTransfer ? "Machine relocation between units" : "New machine procurement"}</span>
      </div>
      <span className={`adm-req-status ${statusCls}`}>{status || "Pending"}</span>
    </div>
  );
}

export default function AdminDashboard() {
  useAuth();
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get("/machines").catch(() => ({ data: [] })),
      apiClient.get("/requests").catch(() => ({ data: [] })),
    ]).then(([machinesRes, requestsRes]) => {
      setMachines(Array.isArray(machinesRes.data) ? machinesRes.data : []);
      setRequests(Array.isArray(requestsRes.data) ? requestsRes.data : []);
    }).finally(() => setLoading(false));
  }, []);

  const totalMachines = machines.length;
  const transferRequests = requests.filter(r => {
    const t = (r.requestType || r.type || "").toLowerCase();
    return t === "transfer" || t === "relocation";
  });
  const purchaseRequests = requests.filter(r => (r.requestType || r.type || "").toLowerCase() === "purchase");
  const pendingTransfers = transferRequests.filter(r => (r.status || "").toLowerCase() === "pending").length;
  const approvedTransfers = transferRequests.filter(r => (r.status || "").toLowerCase() === "approved").length;
  const pendingPurchases = purchaseRequests.filter(r => (r.status || "").toLowerCase() === "pending").length;

  const recentMachines = [...machines].slice(0, 4);
  const recentRequests = [...requests].slice(0, 4);

  const statCards = [
    {
      label: "Total Machines",
      value: loading ? "—" : totalMachines.toLocaleString(),
      sub: "+12.5% this month",
      subCls: "adm-stat-up",
      icon: <IconMachine />,
      iconCls: "adm-stat-icon-blue",
      to: "/machines",
    },
    {
      label: "Pending Transfers",
      value: loading ? "—" : pendingTransfers,
      sub: `${approvedTransfers} Approved`,
      subCls: "adm-stat-neutral",
      icon: <IconTransfer />,
      iconCls: "adm-stat-icon-orange",
      to: "/requests/approved",
    },
    {
      label: "Pending Buy Requests",
      value: loading ? "—" : pendingPurchases,
      sub: pendingPurchases > 0 ? "Needs approval" : "All clear",
      subCls: pendingPurchases > 0 ? "adm-stat-warn" : "adm-stat-up",
      icon: <IconPurchase />,
      iconCls: "adm-stat-icon-amber",
      to: "/requests/approved",
    },
  ];

  return (
    <section className="adm-page">
      {/* ── page action bar ── */}
      <div className="adm-page-action-bar">
        <div>
          <h2 className="adm-page-heading">System Overview</h2>
        </div>
        <button
          type="button"
          className="adm-add-machine-btn"
          onClick={() => navigate("/add")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Machine
        </button>
      </div>

      {/* ── stat cards ── */}
      <div className="adm-stat-row">
        {statCards.map(card => (
          <button
            key={card.label}
            type="button"
            className="adm-stat-card"
            onClick={() => navigate(card.to)}
          >
            <div className="adm-stat-left">
              <p className="adm-stat-label">{card.label}</p>
              <h2 className="adm-stat-value">{card.value}</h2>
              <p className={`adm-stat-sub ${card.subCls}`}>{card.sub}</p>
            </div>
            <div className={`adm-stat-icon ${card.iconCls}`}>{card.icon}</div>
          </button>
        ))}
      </div>

      {/* ── recent machines table ── */}
      <div className="adm-card">
        <div className="adm-card-header">
          <h2 className="adm-card-title">Recent Machines</h2>
          <Link to="/machines" className="adm-view-all">View all Machines →</Link>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>MACHINE ID</th>
                <th>MACHINE TYPE</th>
                <th>LOCATION</th>
                <th>DATE ADDED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="adm-table-empty">Loading machines…</td></tr>
              ) : recentMachines.length === 0 ? (
                <tr><td colSpan="5" className="adm-table-empty">No machines found</td></tr>
              ) : recentMachines.map(m => (
                <tr key={m.machineId || m.id}>
                  <td className="adm-machine-id">
                    <Link to={`/machine/${m.machineId || m.id}`} className="adm-id-link">
                      #{`MCH-${String(m.machineId || m.id).padStart(5, "0")}`}
                    </Link>
                  </td>
                  <td>
                    <div className="adm-type-cell">
                      <span className="adm-type-dot" />
                      {m.machineType || m.type || "—"}
                    </div>
                  </td>
                  <td>
                    {m.status === "In Repair"
                      ? <span className="adm-badge adm-badge-repair">{m.location || "—"}</span>
                      : (m.location || "—")}
                  </td>
                  <td className="adm-date-cell">
                    {m.createdAt
                      ? new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
                      : "—"}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="adm-icon-btn"
                      aria-label="View machine"
                      onClick={() => navigate(`/machine/${m.machineId || m.id}`)}
                    >
                      <IconEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="adm-table-footer">
            <span>Showing {Math.min(recentMachines.length, 4)} of {totalMachines} machines</span>
            <div className="adm-pagination">
              <button type="button" className="adm-page-btn" disabled>Previous</button>
              <button type="button" className="adm-page-btn adm-page-active">1</button>
              <button type="button" className="adm-page-btn">2</button>
              <button type="button" className="adm-page-btn">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* ── recent requests ── */}
      <div className="adm-card">
        <div className="adm-card-header">
          <h2 className="adm-card-title">Recent Requests</h2>
          <button type="button" className="adm-filter-btn" aria-label="Filter requests">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
          </button>
        </div>
        <div className="adm-req-grid">
          {loading ? (
            <p className="adm-table-empty">Loading requests…</p>
          ) : recentRequests.length === 0 ? (
            <p className="adm-table-empty">No requests found</p>
          ) : recentRequests.map((r, idx) => (
            <RequestTag key={r.id || idx} type={r.requestType || r.type} status={r.status} code={r.requestCode} />
          ))}
          {!loading && recentRequests.length === 0 && (
            <>
              <RequestTag type="transfer" status="Pending" />
              <RequestTag type="purchase" status="Approval Required" />
              <RequestTag type="transfer" status="Pending" />
              <RequestTag type="purchase" status="Completed" />
            </>
          )}
        </div>
      </div>

      <AppFooter />
    </section>
  );
}
