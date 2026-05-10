// This React component renders the technician dashboard page for the Concord Smart Scan application.

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";
import AppFooter from "../components/AppFooter";
import TableEmptyState from "../components/TableEmptyState";
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
    .filter(r => (r.requestType || r.type || "").toLowerCase() === "purchase");

  const transferRequests = requests
    .filter(r => (r.requestType || r.type || "").toLowerCase() === "transfer");

  const recentMachines = machines.slice(0, 4);
  const recentPurchases = purchaseRequests.slice(0, 4);
  const recentTransfers = transferRequests.slice(0, 4);

  const showMachines  = loading ? [] : recentMachines;
  const showPurchases = loading ? [] : recentPurchases;
  const showTransfers = loading ? [] : recentTransfers;

  return (
    <section className="tch-page">
      {/* ── Recent Inventory (full width) ── */}
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
            {loading ? (
              <TableEmptyState message="Loading inventory..." minHeight={392} />
            ) : showMachines.length === 0 ? (
              <TableEmptyState message="No machines found" minHeight={392} />
            ) : (
              <table className="tch-table">
                <thead>
                  <tr>
                    <th>MACHINE ID</th>
                    <th>TYPE</th>
                    <th>LOCATION</th>
                    <th>ADDED DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {showMachines.map((m, i) => (
                    <tr key={m.machineId || m.id || i}>
                      <td className="tch-machine-id">
                        MAC-{String(m.machineId || m.id || "00000").padStart(5, "0")}
                      </td>
                      <td>{m.machineType || m.type || "—"}</td>
                      <td className="tch-location">
                        {m.location ? m.location : m.garmentId ? `GAR-${String(m.garmentId).padStart(3, "0")}` : m.storeId ? `STO-${String(m.storeId).padStart(3, "0")}` : "—"}
                      </td>
                      <td className="tch-date">{m.date || m.addedDate || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="tch-panel-footer">
            <Link to="/machines" className="tch-see-more">SEE MORE →</Link>
          </div>
        </div>



      {/* ── two-column grid: Transfer & Purchase Requests ── */}
      <div className="tch-top-grid">
        {/* Recent Transfer Requests */}
        <div className="tch-panel">
          <div className="tch-panel-header">
            <span className="tch-panel-icon tch-indigo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 8h11M14 5l4 3-4 3M17 16H6M10 13l-4 3 4 3" />
              </svg>
            </span>
            <h2 className="tch-panel-title">Recent Transfer Requests</h2>
          </div>
          <div className="tch-table-wrap">
            {loading ? (
              <TableEmptyState message="Loading transfer requests..." minHeight={260} />
            ) : showTransfers.length === 0 ? (
              <TableEmptyState message="No transfer requests found" minHeight={260} />
            ) : (
              <table className="tch-table">
                <thead>
                  <tr>
                    <th>REQUEST ID</th>
                    <th>MACHINE TYPE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {showTransfers.map((r, i) => {
                    const code = r.requestCode || r.id || `TR-${8842 - i}`;
                    return (
                      <tr key={r.id || i}>
                        <td className="tch-req-id">{String(code).replace(/^TRA?-0*/, "TR-")}</td>
                        <td>{r.machineType || r.type || "—"}</td>
                        <td><StatusChip status={r.status || "Pending"} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <div className="tch-panel-footer">
            <Link to="/requests/transfer" className="tch-see-more">My Transfer Requests →</Link>
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
            {loading ? (
              <TableEmptyState message="Loading purchase requests..." minHeight={260} />
            ) : showPurchases.length === 0 ? (
              <TableEmptyState message="No purchase requests found" minHeight={260} />
            ) : (
              <table className="tch-table">
                <thead>
                  <tr>
                    <th>REQUEST ID</th>
                    <th>MACHINE TYPE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {showPurchases.map((r, i) => {
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
            )}
          </div>
          <div className="tch-panel-footer">
            <Link to="/requests/purchase" className="tch-see-more">My Purchase Requests →</Link>
          </div>
        </div>
      </div>

      <AppFooter />
    </section>
  );
}
