import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import StatsCards from "../components/StatsCards";
import "./MachineList.css";
import axios from "axios";

const API_URL = "http://localhost:8080/api/machines";

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function IconChevLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const PAGE_SIZE = 10;

function MachineList() {
  const navigate = useNavigate();

  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMachines(response.data);
    } catch (err) {
      setError("Failed to fetch machines");
    } finally {
      setLoading(false);
    }
  };

  const tabFiltered = machines.filter((m) => {
    if (activeTab === "stores") return m.location?.toUpperCase().startsWith("ST");
    if (activeTab === "garments") return m.location?.toUpperCase().startsWith("GR");
    return true;
  });

  const filtered = tabFiltered.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.machineId?.toLowerCase().includes(q) ||
      m.type?.toLowerCase().includes(q) ||
      m.location?.toLowerCase().includes(q) ||
      m.brand?.toLowerCase().includes(q) ||
      m.model?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    const deletedId = deleteConfirm;
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/${deletedId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchMachines();
      showNotification(`Machine ${deletedId} was deleted successfully.`, "success");
    } catch (err) {
      alert(`Error deleting machine`);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const getLocationLabel = () => {
    if (activeTab === "stores") return "Store Name";
    if (activeTab === "garments") return "Garment Name";
    return "Location";
  };

  return (
    <section className="machine-list-page">
      <StatsCards machines={machines} />

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="machine-list-modal-overlay">
          <div className="machine-list-modal">
            <h3 className="machine-list-modal-title">Delete machine?</h3>
            <p className="machine-list-modal-body">
              Are you sure you want to delete <strong>{deleteConfirm}</strong>? This action cannot be undone.
            </p>
            <div className="machine-list-modal-actions">
              <button className="machine-list-btn-ghost" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="machine-list-btn-danger" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className={`add-machine-notice ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="machine-list-tabs">
        {["all", "stores", "garments"].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`machine-list-tab${activeTab === tab ? " active" : ""}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab === "all" ? "All Machines" : tab === "stores" ? "At Stores" : "At Garments"}
          </button>
        ))}
      </div>

      <div className="machine-list-card">
        <div className="machine-list-card-header">
          <div>
            <div className="machine-list-card-title">Machine Inventory</div>
            <div className="machine-list-card-subtitle">
              Complete list of all machines in the replacement location system.
            </div>
          </div>
          <div className="machine-list-header-actions">
            <div className="machine-list-search">
              <span className="machine-list-search-icon"><IconSearch /></span>
              <input
                type="text"
                placeholder="Search machines..."
                value={search}
                onChange={handleSearch}
                className="machine-list-search-input"
              />
            </div>
            <button
              className="machine-list-btn-primary"
              type="button"
              onClick={() => navigate("/add")}
            >
              <IconPlus />
              Add Machine
            </button>
          </div>
        </div>

        <div className="machine-list-table-wrap">
          {loading ? (
            <div className="machine-list-state">Loading machines...</div>
          ) : error ? (
            <div className="machine-list-state error">
              {error}
              <button className="machine-list-retry" onClick={fetchMachines}>Retry</button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Machine ID</th>
                  <th>Type</th>
                  <th>Brand / Model</th>
                  <th>{getLocationLabel()}</th>
                  <th>Added Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? (
                  paginated.map((machine) => (
                    <tr key={machine.id}>
                      <td>
                        <Link to={`/machine/${machine.id}`} className="machine-list-machine-link">
                          {machine.machineId}
                        </Link>
                      </td>
                      <td>{machine.type}</td>
                      <td>
                        <span className="machine-list-model-text">
                          {machine.brand} {machine.model}
                        </span>
                      </td>
                      <td>
                        <span className="machine-list-location-pill">{machine.location}</span>
                      </td>
                      <td>{machine.date}</td>
                      <td>
                        <div className="machine-list-actions">
                          <Link to={`/machine/${machine.id}`} className="machine-list-icon-btn">
                            <IconEye />
                          </Link>
                          <button className="machine-list-icon-btn" onClick={() => navigate(`/edit/${machine.id}`)}>
                            <IconEdit />
                          </button>
                          <button className="machine-list-icon-btn delete" onClick={() => setDeleteConfirm(machine.id)}>
                            <IconTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
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
            {filtered.length === 0
              ? "No machines"
              : `Showing ${Math.min((currentPage - 1) * PAGE_SIZE + 1, filtered.length)}–${Math.min(
                  currentPage * PAGE_SIZE,
                  filtered.length
                )} of ${filtered.length} machines`}
          </span>
          <div className="machine-list-pagination">
            <button
              className="machine-list-pg-btn"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              <IconChevLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`machine-list-pg-btn${page === currentPage ? " active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="machine-list-pg-btn"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
            >
              <IconChevRight />
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <AppFooter />
    </section>
  );
}

export default MachineList;
