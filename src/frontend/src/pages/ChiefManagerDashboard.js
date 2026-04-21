import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";
import AppFooter from "../components/AppFooter";
import apiClient from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from "recharts";
import "./ChiefManagerDashboard.css";

/* ── 6-month mock data for request trends ── */
const SIX_MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

function buildMonthlyData(requests) {
  if (!requests.length) {
    /* Demo data so chart is never blank */
    return [
      { month: "Nov", Transfer: 4, Purchase: 3 },
      { month: "Dec", Transfer: 6, Purchase: 5 },
      { month: "Jan", Transfer: 5, Purchase: 4 },
      { month: "Feb", Transfer: 8, Purchase: 6 },
      { month: "Mar", Transfer: 7, Purchase: 8 },
      { month: "Apr", Transfer: 6, Purchase: 8 },
    ];
  }

  const now = new Date();
  const months = SIX_MONTHS.map((label, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return { month: label, monthNum: d.getMonth(), year: d.getFullYear(), Transfer: 0, Purchase: 0 };
  });

  requests.forEach(r => {
    const d = new Date(r.createdAt || Date.now());
    const idx = months.findIndex(m => m.monthNum === d.getMonth() && m.year === d.getFullYear());
    if (idx < 0) return;
    const type = (r.requestType || r.type || "").toLowerCase();
    if (type === "transfer") months[idx].Transfer++;
    else months[idx].Purchase++;
  });

  return months.map(({ month, Transfer, Purchase }) => ({ month, Transfer, Purchase }));
}

function buildApprovalData(requests) {
  if (!requests.length) {
    return [
      { month: "Nov", Approved: 3, Pending: 1, Declined: 0 },
      { month: "Dec", Approved: 4, Pending: 2, Declined: 1 },
      { month: "Jan", Approved: 5, Pending: 1, Declined: 1 },
      { month: "Feb", Approved: 7, Pending: 3, Declined: 1 },
      { month: "Mar", Approved: 6, Pending: 2, Declined: 2 },
      { month: "Apr", Approved: 5, Pending: 3, Declined: 2 },
    ];
  }

  const now = new Date();
  const months = SIX_MONTHS.map((label, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return { month: label, monthNum: d.getMonth(), year: d.getFullYear(), Approved: 0, Pending: 0, Declined: 0 };
  });

  requests.forEach(r => {
    const d = new Date(r.createdAt || Date.now());
    const idx = months.findIndex(m => m.monthNum === d.getMonth() && m.year === d.getFullYear());
    if (idx < 0) return;
    const status = (r.status || "pending").toLowerCase();
    if (status === "approved") months[idx].Approved++;
    else if (status === "declined") months[idx].Declined++;
    else months[idx].Pending++;
  });

  return months.map(({ month, Approved, Pending, Declined }) => ({ month, Approved, Pending, Declined }));
}

/* ── Custom tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="cm-tooltip">
      <p className="cm-tooltip-label">{label}</p>
      {payload.map(entry => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function ChiefManagerDashboard() {
  useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/requests")
      .then(res => setRequests(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const transferRequests = requests.filter(r => (r.requestType || r.type || "").toLowerCase() === "transfer");
  const purchaseRequests = requests.filter(r => (r.requestType || r.type || "").toLowerCase() === "purchase");

  const totalTransfer  = transferRequests.length;
  const approvedTransfer = transferRequests.filter(r => (r.status || "").toLowerCase() === "approved").length;
  const pendingTransfer  = transferRequests.filter(r => (r.status || "").toLowerCase() === "pending").length;

  const totalPurchase  = purchaseRequests.length;
  const approvedPurchase = purchaseRequests.filter(r => (r.status || "").toLowerCase() === "approved").length;
  const pendingPurchase  = purchaseRequests.filter(r => (r.status || "").toLowerCase() === "pending").length;

  const monthlyData   = buildMonthlyData(requests);
  const approvalData  = buildApprovalData(requests);

  return (
    <section className="cm-page">
      {/* ── stat summary cards ── */}
      <div className="cm-stat-row">
        <div className="cm-stat-card cm-stat-transfer">
          <div className="cm-stat-body">
            <p className="cm-stat-label">TOTAL TRANSFER REQUESTS</p>
            <h2 className="cm-stat-value">{loading ? "—" : totalTransfer}</h2>
            <div className="cm-stat-sub">
              <span className="cm-sub-approved">{approvedTransfer} Approved</span>
              <span className="cm-sub-pending">{pendingTransfer} Pending</span>
            </div>
          </div>
          <div className="cm-stat-icon cm-icon-transfer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 8h11M14 5l4 3-4 3M17 16H6M10 13l-4 3 4 3" />
            </svg>
          </div>
        </div>

        <div className="cm-stat-card cm-stat-purchase">
          <div className="cm-stat-body">
            <p className="cm-stat-label">TOTAL PURCHASE REQUEST</p>
            <h2 className="cm-stat-value">{loading ? "—" : totalPurchase}</h2>
            <div className="cm-stat-sub">
              <span className="cm-sub-approved">{approvedPurchase} Approved</span>
              <span className="cm-sub-pending">{pendingPurchase} Pending</span>
            </div>
          </div>
          <div className="cm-stat-icon cm-icon-purchase">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" />
              <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L22 7H7" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── chart section ── */}
      <div className="cm-charts-row">
        {/* Bar chart: Request Volume by Month */}
        <div className="cm-chart-card">
          <div className="cm-chart-header">
            <div>
              <h3 className="cm-chart-title">Request Volume — Last 6 Months</h3>
              <p className="cm-chart-sub">Transfer vs Purchase requests per month</p>
            </div>
            <Link to="/requests/transfer" className="cm-chart-link">View All →</Link>
          </div>
          <div className="cm-chart-area">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData} margin={{ top: 4, right: 16, left: -20, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                <Legend wrapperStyle={{ fontSize: "0.8rem", paddingTop: "12px", color: "#475569" }} />
                <Bar dataKey="Transfer" name="Transfer Requests" fill="#2563eb" radius={[5, 5, 0, 0]} maxBarSize={36} />
                <Bar dataKey="Purchase" name="Purchase Requests" fill="#f59e0b" radius={[5, 5, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area chart: Approval Rate */}
        <div className="cm-chart-card">
          <div className="cm-chart-header">
            <div>
              <h3 className="cm-chart-title">Approval Rate Trend</h3>
              <p className="cm-chart-sub">Approved vs Pending vs Declined over 6 months</p>
            </div>
            <Link to="/requests/approved" className="cm-chart-link">View All →</Link>
          </div>
          <div className="cm-chart-area">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={approvalData} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradDeclined" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "0.8rem", paddingTop: "12px", color: "#475569" }} />
                <Area type="monotone" dataKey="Approved" name="Approved" stroke="#22c55e" strokeWidth={2.5} fill="url(#gradApproved)" dot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="Pending"  name="Pending"  stroke="#f59e0b" strokeWidth={2.5} fill="url(#gradPending)"  dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="Declined" name="Declined" stroke="#ef4444" strokeWidth={2.5} fill="url(#gradDeclined)" dot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── summary insight strip ── */}
      <div className="cm-insight-strip">
        <div className="cm-insight-item">
          <span className="cm-insight-dot cm-dot-blue" />
          <div>
            <p className="cm-insight-number">{loading ? "—" : totalTransfer + totalPurchase}</p>
            <p className="cm-insight-label">Total Requests (6 months)</p>
          </div>
        </div>
        <div className="cm-insight-sep" />
        <div className="cm-insight-item">
          <span className="cm-insight-dot cm-dot-green" />
          <div>
            <p className="cm-insight-number">{loading ? "—" : approvedTransfer + approvedPurchase}</p>
            <p className="cm-insight-label">Total Approved</p>
          </div>
        </div>
        <div className="cm-insight-sep" />
        <div className="cm-insight-item">
          <span className="cm-insight-dot cm-dot-amber" />
          <div>
            <p className="cm-insight-number">{loading ? "—" : pendingTransfer + pendingPurchase}</p>
            <p className="cm-insight-label">Pending Review</p>
          </div>
        </div>
        <div className="cm-insight-sep" />
        <div className="cm-insight-item">
          <span className="cm-insight-dot cm-dot-orange" />
          <div>
            <p className="cm-insight-number">
              {loading ? "—" : totalTransfer + totalPurchase > 0
                ? `${Math.round(((approvedTransfer + approvedPurchase) / (totalTransfer + totalPurchase)) * 100)}%`
                : "—"}
            </p>
            <p className="cm-insight-label">Approval Rate</p>
          </div>
        </div>
      </div>

      <AppFooter />
    </section>
  );
}
