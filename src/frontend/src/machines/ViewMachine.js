// pages/ViewMachine.js
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PagePath from "../components/PagePath";
import QRModal from "./QRModal";
import apiClient from "../services/api";
import { getMachineDisplayId } from "./machineId";
import { useAuth } from "../authentication/AuthContext";
import "./ViewMachine.css";

function IconMachine() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10h18v8H3z" />
      <path d="M7 10V6h10v4" />
      <path d="M7 18h.01" />
      <path d="M11 18h.01" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function ViewMachine() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = String(user?.role || "").toUpperCase();
  const canEditMachine = role === "ADMIN";

  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [qrOpen, setQrOpen]   = useState(false);

  useEffect(() => { fetchMachine(); }, [id]);

  const fetchMachine = async () => {
    try {
      setLoading(true); setError(null);
      const response = await apiClient.get(`/machines/${id}`);
      setMachine(response.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Access denied (403)");
      } else if (err.response?.status === 404) {
        setError("Machine not found");
      } else {
        setError(err.message || "Failed to load machine details");
      }
    }
    finally { setLoading(false); }
  };

  const getLocationDisplay = (machine) => {
    const normalized = normalizeLocationDisplay(machine.location);
    if (normalized) return normalized;
    if (machine.storeId) {
      return `STO-${String(machine.storeId).padStart(3, "0")}`;
    }
    if (machine.garmentId) {
      return `GAR-${String(machine.garmentId).padStart(3, "0")}`;
    }
    return "—";
  };

  const normalizeLocationDisplay = (value) => {
    const trimmed = String(value || "").trim();
    if (!trimmed) return "";
    const match = trimmed.match(/^(STO|GAR)-(\d+)$/i);
    if (!match) return trimmed;
    const prefix = match[1].toUpperCase();
    const numericPart = String(Number(match[2])).padStart(3, "0");
    return `${prefix}-${numericPart}`;
  };

  // Loading UI
  if (loading) {
    return (
      <section className="view-machine-page">
        <PagePath items={[{ label: "Machines", to: "/machines" }, { label: "Machine Details" }]} />
        <div className="view-machine-card">Loading machine...</div>
        <AppFooter />
      </section>
    );
  }

  // Error UI
  if (error) {
    return (
      <section className="view-machine-page">
        <PagePath items={[{ label: "Machines", to: "/machines" }, { label: "Machine Details" }]} />
        <div className="view-machine-card view-machine-error-card">
          {error}
          <br /><br />
          <Link to="/machines">← Back</Link>
        </div>
        <AppFooter />
      </section>
    );
  }
  if (!machine) return null;

const displayMachineId = getMachineDisplayId(machine);

  return (
    <section className="view-machine-page">
      <PagePath items={[{ label: "Machines", to: "/machines" }, { label: `Machine Details`}]} />
  
      {/* QR Modal */}
      {qrOpen && <QRModal machine={machine} onClose={() => setQrOpen(false)} />}

<div className="view-machine-card">
  <div className="view-machine-card-header">
    <div className="view-machine-header-content">
      <span className="view-machine-card-icon"><IconMachine /></span>
      <h2 className="view-machine-card-title">Machine Information</h2>
    </div>

    <div style={{ display: "flex", gap: "10px" }}>
      <button
        type="button"
        className="view-machine-edit-btn"
        onClick={() => setQrOpen(true)}
      >
        View QR Code
      </button>
      {canEditMachine && (
        <Link to={"/edit/" + id} className="view-machine-edit-btn">
          <IconEdit />
          Edit Machine
        </Link>
      )}
    </div>
  </div>

  <div className="view-machine-card-body">
    <div className="view-machine-details-grid">
      <div className="view-machine-detail-item">
        <span className="view-machine-detail-label">Machine ID</span>
        <span className="view-machine-detail-value">{displayMachineId}</span>
      </div>

      <div className="view-machine-detail-item">
        <span className="view-machine-detail-label">Type</span>
        <span className="view-machine-detail-value">{machine.type || "—"}</span>
      </div>

      <div className="view-machine-detail-item">
        <span className="view-machine-detail-label">Model</span>
        <span className="view-machine-detail-value">{machine.model || "—"}</span>
      </div>

      <div className="view-machine-detail-item">
        <span className="view-machine-detail-label">Serial Number</span>
        <span className="view-machine-detail-value">{machine.serialNumber || "—"}</span>
      </div>

      <div className="view-machine-detail-item">
        <span className="view-machine-detail-label">Brand</span>
        <span className="view-machine-detail-value">{machine.brand || "—"}</span>
      </div>

      <div className="view-machine-detail-item">
        <span className="view-machine-detail-label">Location</span>
        <span className="view-machine-detail-value">
          <span className="view-machine-location">{machine.location || "—"}</span>
        </span>
      </div>

      <div className="view-machine-detail-item">
        <span className="view-machine-detail-label">Store/Garment</span>
        <span className="view-machine-detail-value">{getLocationDisplay(machine)}</span>
      </div>

      <div className="view-machine-detail-item">
        <span className="view-machine-detail-label">Added Date</span>
        <span className="view-machine-detail-value">{machine.date || "—"}</span>
      </div>

      <div className="view-machine-detail-item">
        <span className="view-machine-detail-label">Status</span>
        <span className="view-machine-status-badge">
          Operational
        </span>
      </div>
    </div>

    <div className="view-machine-actions">
      <button
        type="button"
        className="view-machine-back-btn"
        onClick={() => navigate("/machines")}
      >
        Back to Machines
      </button>
    </div>
  </div>
</div>
<AppFooter />
    </section>
  );
}

export default ViewMachine;
