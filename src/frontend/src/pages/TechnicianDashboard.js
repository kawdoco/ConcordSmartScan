import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";
import AppFooter from "../components/AppFooter";
import apiClient from "../services/api";
import "./TechnicianDashboard.css";

/* ── tiny icons ── */
function IconStatus({ status }) {
  const s = (status || "").toLowerCase();
  if (s === "approved" || s === "completed" || s === "ordered") return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  );
  if (s === "pending" || s === "review" || s === "draft") return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  );
  return null;
}

function StatusChip({ status }) {
  const s = (status || "pending").toLowerCase();
  const map = {
    pending:   "tch-chip-pending",
    review:    "tch-chip-review",
    approved:  "tch-chip-approved",
    completed: "tch-chip-completed",
    ordered:   "tch-chip-ordered",
    draft:     "tch-chip-draft",
    "in transit": "tch-chip-transit",
  };
  const cls = map[s] || "tch-chip-pending";
  return (
    <span className={`tch-chip ${cls}`}>
      <IconStatus status={status} />
      {status}
    </span>
  );
}

export default function TechnicianDashboard() {
  useAuth();
  const [machines, setMachines] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get("/machines").catch(() => ({ data: [] })),
      apiClient.get("/requests").catch(() => ({ data: [] })),
    ]).then(([mRes, rRes]) => {
      setMachines(Array.isArray(mRes.data) ? mRes.data : []);
      setRequests(Array.isArray(rRes.data) ? rRes.data : []);
    }).finally(() => setLoading(false));
  }, []);

  const purchaseRequests = requests
    .filter(r => (r.requestType || r.type || "").toLowerCase() === "purchase")
    .slice(0, 6);

  const transferRequests = requests
    .filter(r => (r.requestType || r.type || "").toLowerCase() === "transfer")
    .slice(0, 4);

  const recentMachines = [...machines].slice(0, 5);

  /* Fallback demo data if API returns nothing */
  const demoPurchases = [
    { id: "PR-2041", machineType: "Heavy Duty Lockstitch", status: "Review" },
    { id: "PR-2040", machineType: "Automated Pocket Setter", status: "Approved" },
    { id: "PR-2039", machineType: "Ultrasonic Welder", status: "Ordered" },
    { id: "PR-2038", machineType: "4-Needle Flatlock", status: "Draft" },
    { id: "PR-2037", machineType: "Zig-Zag Stitcher", status: "Ordered" },
  ];

  const demoTransfers = [
    { id: "TR-8842", machineType: "Lockstitch Machine", date: "Oct 24, 2023", status: "Pending" },
    { id: "TR-8840", machineType: "Overlock Machine",   date: "Oct 23, 2023", status: "Completed" },
    { id: "TR-8839", machineType: "Flatlock Machine",   date: "Oct 23, 2023", status: "In Transit" },
    { id: "TR-8835", machineType: "Buttonhole Machine", date: "Oct 22, 2023", status: "Completed" },
  ];

  const demoMachines = [
    { machineId: "00125", machineType: "Juki DDL-8700",    location: "Floor 2, Bay A" },
    { machineId: "00124", machineType: "Brother S-7100A",   location: "Floor 1, Bay C" },
    { machineId: "00123", machineType: "Singer 191D",       location: "Floor 3, Bay B" },
    { machineId: "00122", machineType: "Pegasus M900",      location: "Floor 2, Bay D" },
    { machineId: "00121", machineType: "Yamato VC2700",     location: "Floor 1, Bay A" },
  ];

  const showMachines  = loading ? [] : (recentMachines.length ? recentMachines : demoMachines);
  const showPurchases = loading ? [] : (purchaseRequests.length ? purchaseRequests : demoPurchases);
  const showTransfers = loading ? [] : (transferRequests.length ? transferRequests : demoTransfers);

  return (
    <section className="tch-page">
      {/* ── top two-column panel ── */}
      <div className="tch-top-grid">
        {/* Recent Inventory */}
        <div className="tch-panel">
          <div className="tch-panel-header">
            <span className="tch-panel-icon tch-blue">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            </span>
            <h2 className="tch-panel-title">Recent Inventory</h2>
          </div>
          <div className="tch-table-wrap">
            <table className="tch-table">
              <thead>
                <tr>
                  <th>MACHINE ID</th>
                  <th>TYPE</th>
                  <th>LOCATION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" className="tch-empty">Loading…</td></tr>
                ) : showMachines.map((m, i) => (
                  <tr key={m.machineId || m.id || i}>
                    <td className="tch-machine-id">
                      MAC-{String(m.machineId || m.id || "00000").padStart(5, "0")}
                    </td>
                    <td>{m.machineType || m.type || "—"}</td>
                    <td className="tch-location">{m.location || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="tch-panel-footer">
            <Link to="/machines" className="tch-see-more">SEE MORE →</Link>
          </div>
        </div>

        {/* Recent Purchase Requests */}
        <div className="tch-panel">
          <div className="tch-panel-header">
            <span className="tch-panel-icon tch-amber">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" />
                <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L22 7H7" />
              </svg>
            </span>
            <h2 className="tch-panel-title">Recent Purchase Requests</h2>
          </div>
          <div className="tch-table-wrap">
            <table className="tch-table">
              <thead>
                <tr>
                  <th>REQUEST ID</th>
                  <th>MACHINE TYPE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" className="tch-empty">Loading…</td></tr>
                ) : showPurchases.map((r, i) => {
                  const code = r.requestCode || r.id || `PR-${2041 - i}`;
                  return (
                    <tr key={r.id || i}>
                      <td className="tch-req-id">{String(code).replace(/^PUR-/, "PR-")}</td>
                      <td>{r.machineType || r.type || "—"}</td>
                      <td><StatusChip status={r.status || "Review"} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="tch-panel-footer">
            <Link to="/requests/purchase" className="tch-see-more">SEE MORE →</Link>
          </div>
        </div>
      </div>

      {/* ── My Transfer Requests ── */}
      <div className="tch-panel">
        <div className="tch-panel-header">
          <span className="tch-panel-icon tch-indigo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 8h11M14 5l4 3-4 3M17 16H6M10 13l-4 3 4 3" />
            </svg>
          </span>
          <h2 className="tch-panel-title">My Transfer Requests</h2>
        </div>
        <div className="tch-table-wrap">
          <table className="tch-table">
            <thead>
              <tr>
                <th>REQUEST ID</th>
                <th>MACHINE TYPE</th>
                <th>DATE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="tch-empty">Loading…</td></tr>
              ) : showTransfers.map((r, i) => {
                const code = r.requestCode || r.id || `TR-${8842 - i}`;
                const dateStr = r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
                  : r.date || "—";
                return (
                  <tr key={r.id || i}>
                    <td className="tch-req-id">{String(code).replace(/^TRA?-0*/, "TR-")}</td>
                    <td>{r.machineType || r.type || "—"}</td>
                    <td className="tch-date">{dateStr}</td>
                    <td><StatusChip status={r.status || "Pending"} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="tch-panel-footer">
          <Link to="/requests/transfer" className="tch-see-more">SEE MORE →</Link>
        </div>
      </div>

      <AppFooter />
    </section>
  );
}
