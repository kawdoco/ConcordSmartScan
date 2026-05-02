import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";
import AppFooter from "../components/AppFooter";
import StatsCards from "../components/StatsCards";
import { useToast } from "../components/Toast";
import ConfirmActionModal from "../components/ConfirmActionModal";
import TableEmptyState from "../components/TableEmptyState";
import QRModal from "./QRModal";
import ScanModal from "./ScanModal";
import apiClient from "../services/api";
import { getMachineDisplayId } from "./machineId";
import "./MachineShared.css";
import "./MachineList.css";

function IconSearch() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>);
}
function IconPlus() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>);
}
function IconEye() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>);
}
function IconEdit() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>);
}
function IconTrash() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>);
}
function IconChevLeft() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>);
}
function IconChevRight() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>);
}
function IconQr() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3z"/><path d="M17 17h4"/><path d="M17 21v-4"/><path d="M21 14h-4v3"/></svg>);
}
function IconScan() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>);
}

const PAGE_SIZE = 10;

function MachineList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQ = searchParams.get("q") || "";
  const { showToast } = useToast();
  const { user } = useAuth();
  const role = String(user?.role || "").toUpperCase();
  const canManageMachines = role === "ADMIN";

  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState(searchQ);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [qrMachine, setQrMachine] = useState(null);
  const [scanOpen, setScanOpen] = useState(false);

  useEffect(() => {
    fetchMachines();
  }, []);

  useEffect(() => {
    setSearch(searchQ);
    setCurrentPage(1);
  }, [searchQ]);

  const fetchMachines = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/machines");
      setMachines(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Access denied. Your role does not have permission to view machines.");
      } else if (err.response?.status === 401) {
        setError("Your session has expired. Please sign in again.");
      } else {
        setError("Failed to fetch machines. Please check server connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getLocationDisplay = (machine) => {
    if (machine.storeId) {
      return `STR-${String(machine.storeId).padStart(5, "0")}`;
    }
    if (machine.garmentId) {
      return `GAR-${String(machine.garmentId).padStart(5, "0")}`;
    }
    return "-";
  };

  const tabFiltered = machines.filter((m) => {
    if (activeTab === "stores") return Boolean(m.storeId);
    if (activeTab === "garments") return Boolean(m.garmentId);
    return true;
  });

  const filtered = tabFiltered.filter((m) => {
    const q = search.toLowerCase();
    const displayMachineId = getMachineDisplayId(m).toLowerCase();
    return (
      m.machineId?.toLowerCase().includes(q) ||
      displayMachineId.includes(q) ||
      m.type?.toLowerCase().includes(q) ||
      getLocationDisplay(m).toLowerCase().includes(q) ||
      m.brand?.toLowerCase().includes(q) ||
      m.model?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    const deletedMachine = deleteConfirm;
    try {
      await apiClient.delete(`/machines/${deletedMachine.id}`);
      await fetchMachines();
      showToast(`Machine ${getMachineDisplayId(deletedMachine)} was deleted successfully.`, "success");
    } catch {
      showToast("Error deleting machine", "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const getLocationLabel = () => {
    if (activeTab === "stores") return "Store ID";
    if (activeTab === "garments") return "Garment ID";
    return "Location";
  };

  return (
    <section className="machine-list-page">
      <StatsCards machines={machines} />

      <ConfirmActionModal
        isOpen={canManageMachines && Boolean(deleteConfirm)}
        title="Delete machine?"
        message={`Are you sure you want to delete ${deleteConfirm ? getMachineDisplayId(deleteConfirm) : "this machine"}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="decline"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
      />

      {qrMachine && <QRModal machine={qrMachine} onClose={() => setQrMachine(null)} />}

      {scanOpen && (
        <ScanModal
          onClose={() => setScanOpen(false)}
          showToast={(msg, type) => showToast(msg, type || "success")}
        />
      )}

      <div className="machine-list-tabs">
        {[ ["all", "All Machines"], ["stores", "At Stores"], ["garments", "At Garments"] ].map(([tab, lbl]) => (
          <button key={tab} type="button" className={`machine-list-tab${activeTab === tab ? " active" : ""}`}
            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}>{lbl}</button>
        ))}
      </div>

      <div className="machine-list-card">
        <div className="machine-list-card-header">
          <div>
            <div className="machine-list-card-title">Machine Inventory</div>
            <div className="machine-list-card-subtitle">Complete list of all machines in the replacement location system.</div>
          </div>
          <div className="machine-list-header-actions">
            <div className="machine-list-search">
              <span className="machine-list-search-icon"><IconSearch /></span>
              <input type="text" placeholder="Search machines..." value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="machine-list-search-input" />
            </div>
            <button
              className="machine-list-btn-scan"
              type="button"
              onClick={() => setScanOpen(true)}
            >
              <IconScan />
              Scan QR
            </button>

            {canManageMachines && (
              <button
                className="machine-list-btn-primary"
                type="button"
                onClick={() => navigate("/add")}
              >
                <IconPlus />
                Add Machine
              </button>
            )}
          </div>
        </div>

        <div className="machine-list-table-wrap">
          {loading ? (
            <div className="machine-list-state">Loading machines...</div>
          ) : error ? (
            <div className="machine-list-state error">{error}<button className="machine-list-retry" onClick={fetchMachines}>Retry</button></div>
          ) : machines.length === 0 ? (
            <TableEmptyState message="No machines found" minHeight={392} />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Machine ID</th><th>Type</th><th>Brand / Model</th>
                  <th>{getLocationLabel()}</th><th>Added Date</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? (
                  paginated.map((machine) => {
                    const displayMachineId = getMachineDisplayId(machine);

                    return (
                      <tr key={machine.id}>
                        <td>
                          <Link to={`/machine/${machine.id}`} className="machine-list-machine-link">
                            {displayMachineId}
                          </Link>
                        </td>
                        <td>{machine.type}</td>
                        <td>
                          <span className="machine-list-model-text">
                            {machine.brand} {machine.model}
                          </span>
                        </td>
                        <td>
                          <span className="machine-list-location-pill">{getLocationDisplay(machine)}</span>
                        </td>
                        <td>{machine.date || machine.addedDate || "-"}</td>
                        <td>
                          <div className="machine-list-actions">
                            <Link to={`/machine/${machine.id}`} className="machine-list-icon-btn" title="View">
                              <IconEye />
                            </Link>

                            {canManageMachines && (
                              <button
                                className="machine-list-icon-btn"
                                title="Edit"
                                onClick={() => navigate(`/edit/${machine.id}`)}
                              >
                                <IconEdit />
                              </button>
                            )}

                            <button
                              className="machine-list-icon-btn qr"
                              title="View / Download QR Code"
                              onClick={() => setQrMachine(machine)}
                            >
                              <IconQr />
                            </button>

                            {canManageMachines && (
                              <button
                                className="machine-list-icon-btn delete"
                                title="Delete"
                                onClick={() => setDeleteConfirm(machine)}
                              >
                                <IconTrash />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="machine-list-empty">
                      No machines found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="machine-list-tfoot">
          <span>
            {filtered.length === 0 ? "No machines"
              : `Showing ${Math.min((currentPage - 1) * PAGE_SIZE + 1, filtered.length)}-${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length} machines`}
          </span>
          <div className="machine-list-pagination">
            <button className="machine-list-pg-btn" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}><IconChevLeft /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} className={`machine-list-pg-btn${page === currentPage ? " active" : ""}`} onClick={() => setCurrentPage(page)}>{page}</button>
            ))}
            <button className="machine-list-pg-btn" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}><IconChevRight /></button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <AppFooter />
    </section>
  );
}

export default MachineList;
