import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import StatsCards from "../components/StatsCards";
import "./MachineList.css";

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

function MachineList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  
  const machines = [
    { id: "MAC-9021", type: "Single Needle Lockstitch", location: "ST-101", storeName: "Colombo 03", garmentName: "", date: "2024-03-15" },
    { id: "MAC-8842", type: "Overlock Machine", location: "GR-202", storeName: "", garmentName: "Denim Jacket", date: "2024-04-02" },
    { id: "MAC-4512", type: "Button Hole Machine", location: "ST-105", storeName: "Peradeniya", garmentName: "", date: "2024-04-18" },
    { id: "MAC-7729", type: "Flatlock Machine", location: "GR-205", storeName: "", garmentName: "Cotton Crew", date: "2024-05-10" }
  ];

  const getLocationLabel = () => {
    if (activeTab === "stores") return "Store Name";
    if (activeTab === "garments") return "Garment Name";
    return "Location";
  };

  const getLocationValue = (machine) => {
    if (activeTab === "stores") return machine.storeName;
    if (activeTab === "garments") return machine.garmentName;
    return machine.location;
  };

  const tabFilteredMachines = machines.filter((machine) => {
    if (activeTab === "stores") return machine.location.toUpperCase().startsWith("ST");
    if (activeTab === "garments") return machine.location.toUpperCase().startsWith("GR");
    return true;
  });

  const filteredMachines = tabFilteredMachines;

  const handleViewMachine = (id) => {
    navigate(`/machine/${id}`);
  };

  const handleEditMachine = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteMachine = (id) => {
    if (window.confirm(`Are you sure you want to delete machine ${id}?`)) {
      alert(`Machine ${id} deleted successfully!`);
      // Here you would actually delete the machine
    }
  };

  const getPagesArr = () => {
    const totalPages = 5;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  return (
    <section className="machine-list-page">
      <StatsCards />

      <div className="machine-list-tabs">
        <button
          type="button"
          className={`machine-list-tab${activeTab === "all" ? " active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Machines
        </button>
        <button
          type="button"
          className={`machine-list-tab${activeTab === "stores" ? " active" : ""}`}
          onClick={() => setActiveTab("stores")}
        >
          At Stores
        </button>
        <button
          type="button"
          className={`machine-list-tab${activeTab === "garments" ? " active" : ""}`}
          onClick={() => setActiveTab("garments")}
        >
          At Garments
        </button>
      </div>

      <div className="machine-list-card">
        <div className="machine-list-card-header">
          <div>
            <div className="machine-list-card-title">Machine Inventory</div>
            <div className="machine-list-card-subtitle">Detected list of all machines in the replacement location system.</div>
          </div>
          <button className="machine-list-btn-primary" type="button" onClick={() => navigate("/add")}>
            <IconPlus />
            Add Machine
          </button>
        </div>

        <div className="machine-list-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Machine ID</th>
                <th>Type</th>
                <th>{getLocationLabel()}</th>
                <th>Added Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMachines.length > 0 ? (
                filteredMachines.map((machine) => (
                  <tr key={machine.id}>
                    <td>
                      <Link to={`/machine/${machine.id}`} className="machine-list-machine-link">
                        {machine.id}
                      </Link>
                    </td>
                    <td>{machine.type}</td>
                    <td>
                      <span className="machine-list-location-pill">{getLocationValue(machine)}</span>
                    </td>
                    <td>{machine.date}</td>
                    <td>
                      <div className="machine-list-actions">
                        <Link
                          to={`/machine/${machine.id}`}
                          className="machine-list-icon-btn"
                          title="View Machine"
                        >
                          <IconEye />
                        </Link>
                        <button
                          className="machine-list-icon-btn"
                          onClick={() => handleEditMachine(machine.id)}
                          title="Edit Machine"
                        >
                          <IconEdit />
                        </button>
                        <button
                          className="machine-list-icon-btn delete"
                          onClick={() => handleDeleteMachine(machine.id)}
                          title="Delete Machine"
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="machine-list-empty">
                    No machines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="machine-list-tfoot">
          <span>
            {filteredMachines.length === 0
              ? "No machines"
              : `Showing 1-${filteredMachines.length} of ${tabFilteredMachines.length} machines`}
          </span>
          <div className="machine-list-pagination">
            <button className="machine-list-pg-btn" disabled>
              <IconChevLeft />
            </button>
            {getPagesArr().map((pageNum) => (
              <button key={pageNum} className={`machine-list-pg-btn${pageNum === 1 ? " active" : ""}`}>
                {pageNum}
              </button>
            ))}
            <button className="machine-list-pg-btn">
              <IconChevRight />
            </button>
          </div>
        </div>
      </div>

      <AppFooter />
    </section>
  );
}

export default MachineList;