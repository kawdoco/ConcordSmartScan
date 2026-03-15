// pages/MachineList.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatsCards from "../components/StatsCards";

function MachineList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const machines = [
    { id: "MAC-9021", type: "Single Needle Lockstitch", location: "ST-101", date: "2024-03-15" },
    { id: "MAC-8842", type: "Overlock Machine", location: "GR-202", date: "2024-04-02" },
    { id: "MAC-4512", type: "Button Hole Machine", location: "ST-105", date: "2024-04-18" },
    { id: "MAC-7729", type: "Flatlock Machine", location: "GR-205", date: "2024-05-10" }
  ];

  const filteredMachines = machines.filter(machine =>
    machine.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div style={styles.content}>
          <div style={styles.headerRow}>
            <div>
              <h1 style={styles.pageTitle}>Machine Management</h1>
              <p style={styles.pageSubtitle}>Track, inspect, and maintain machine inventory.</p>
            </div>
            <div style={styles.headerActions}>
              <input
                style={styles.searchInput}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by machine ID, type, or location"
              />
              <Link to="/add">
                <button style={styles.addButton}>
                  <span style={styles.addIcon}>+</span>
                  Add Machine
                </button>
              </Link>
            </div>
          </div>
          
          <StatsCards />

          <div style={styles.inventorySection}>
            <div style={styles.inventoryHeader}>
              <div>
                <h3 style={styles.inventoryTitle}>Machine Inventory</h3>
                <p style={styles.inventorySubtitle}>
                  Detected list of all machines in the replacement location system.
                </p>
              </div>
              <div style={styles.inventoryStats}>
                <span style={styles.totalCount}>Total: 4,821 machines</span>
              </div>
            </div>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead style={styles.thead}>
                  <tr>
                    <th style={styles.th}>MACHINE ID</th>
                    <th style={styles.th}>TYPE</th>
                    <th style={styles.th}>LOCATION</th>
                    <th style={styles.th}>ADDED DATE</th>
                    <th style={styles.th}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMachines.length > 0 ? (
                    filteredMachines.map((machine, index) => (
                      <tr key={machine.id} style={index % 2 === 0 ? styles.row : styles.rowAlt}>
                        <td style={styles.td}>
                          <Link to={`/machine/${machine.id}`} style={styles.machineLink}>
                            {machine.id}
                          </Link>
                        </td>
                        <td style={styles.td}>{machine.type}</td>
                        <td style={styles.td}>
                          <span style={styles.locationBadge}>{machine.location}</span>
                        </td>
                        <td style={styles.td}>{machine.date}</td>
                        <td style={styles.td}>
                          <button 
                            style={styles.actionButton}
                            onClick={() => handleViewMachine(machine.id)}
                            title="View Machine"
                          >
                            👁️
                          </button>
                          <button 
                            style={styles.actionButton}
                            onClick={() => handleEditMachine(machine.id)}
                            title="Edit Machine"
                          >
                            ✏️
                          </button>
                          <button 
                            style={styles.actionButton}
                            onClick={() => handleDeleteMachine(machine.id)}
                            title="Delete Machine"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={styles.noData}>
                        No machines found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={styles.pagination}>
              <p style={styles.paginationText}>
                Showing 1 to {filteredMachines.length} of 4,821 machines
              </p>
              <div style={styles.paginationControls}>
                <button style={styles.pageButton} disabled>⟨</button>
                <button style={{...styles.pageButton, ...styles.activePage}}>1</button>
                <button style={styles.pageButton}>2</button>
                <button style={styles.pageButton}>3</button>
                <button style={styles.pageButton}>4</button>
                <button style={styles.pageButton}>5</button>
                <button style={styles.pageButton}>⟩</button>
              </div>
            </div>
          </div>
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2024 Concord Apparel Pvt Ltd. Machine Replacement Location System.</p>
        <div style={styles.footerLinks}>
          <a href="#" style={styles.footerLink}>Privacy Policy</a>
          <span style={styles.separator}>|</span>
          <a href="#" style={styles.footerLink}>System Manual</a>
          <span style={styles.separator}>|</span>
          <a href="#" style={styles.footerLink}>Technical Support</a>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafc"
  },
  mainArea: {
    marginLeft: "250px",
    width: "calc(100% - 250px)",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  },
  content: {
    padding: "6px 8px",
    flex: 1
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    gap: "16px",
    flexWrap: "wrap"
  },
  pageSubtitle: {
    margin: "8px 0 0 0",
    color: "#64748b"
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap"
  },
  searchInput: {
    width: "340px",
    maxWidth: "100%",
    padding: "11px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    background: "#fff"
  },
  pageTitle: {
    fontSize: "2rem",
    margin: 0,
    color: "#0f172a",
    fontWeight: "600"
  },
  addButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "background 0.2s",
    boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)"
  },
  addIcon: {
    fontSize: "1.2rem",
    fontWeight: "600"
  },
  inventorySection: {
    background: "white",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    marginTop: "20px"
  },
  inventoryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  inventoryTitle: {
    margin: "0 0 8px 0",
    fontSize: "1.25rem",
    color: "#1e293b",
    fontWeight: "600"
  },
  inventorySubtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.95rem"
  },
  inventoryStats: {
    color: "#2563eb",
    fontWeight: "500",
    fontSize: "0.95rem"
  },
  totalCount: {
    background: "#eff6ff",
    padding: "6px 12px",
    borderRadius: "20px",
    color: "#2563eb"
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    marginTop: "20px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "800px"
  },
  thead: {
    background: "#f8fafc",
    borderBottom: "2px solid #e2e8f0"
  },
  th: {
    padding: "16px 20px",
    textAlign: "left",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  td: {
    padding: "16px 20px",
    borderBottom: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "0.95rem"
  },
  row: {
    background: "white",
    transition: "background 0.2s",
    ':hover': {
      background: "#f1f5f9"
    }
  },
  rowAlt: {
    background: "#fafafa",
    transition: "background 0.2s",
    ':hover': {
      background: "#f1f5f9"
    }
  },
  machineLink: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
    cursor: "pointer",
    ':hover': {
      textDecoration: "underline"
    }
  },
  locationBadge: {
    background: "#e2e8f0",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "500",
    color: "#475569",
    display: "inline-block"
  },
  actionButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.2rem",
    margin: "0 8px",
    padding: "5px",
    borderRadius: "4px",
    transition: "background 0.2s, transform 0.1s",
    ':hover': {
      background: "#f1f5f9",
      transform: "scale(1.1)"
    }
  },
  noData: {
    padding: "40px 20px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "1rem",
    borderBottom: "1px solid #e2e8f0"
  },
  pagination: {
    marginTop: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  paginationText: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.95rem"
  },
  paginationControls: {
    display: "flex",
    gap: "5px"
  },
  pageButton: {
    padding: "8px 12px",
    border: "1px solid #e2e8f0",
    background: "white",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#475569",
    fontSize: "0.95rem",
    minWidth: "38px",
    transition: "all 0.2s",
    ':hover': {
      background: "#f8fafc",
      borderColor: "#2563eb"
    },
    ':disabled': {
      opacity: 0.5,
      cursor: "not-allowed"
    }
  },
  activePage: {
    background: "#2563eb",
    color: "white",
    borderColor: "#2563eb",
    ':hover': {
      background: "#1d4ed8"
    }
  },
  footer: {
    background: "white",
    padding: "25px 40px",
    borderTop: "1px solid #e5e7eb",
    textAlign: "center"
  },
  footerText: {
    margin: "0 0 12px 0",
    color: "#64748b",
    fontSize: "0.95rem"
  },
  footerLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "15px"
  },
  footerLink: {
    color: "#2563eb",
    textDecoration: "none",
    fontSize: "0.95rem",
    transition: "color 0.2s",
    ':hover': {
      color: "#1d4ed8",
      textDecoration: "underline"
    }
  },
  separator: {
    color: "#cbd5e1"
  }
};

// Add hover effect using JavaScript since inline styles don't support :hover
// You can add a CSS file later or use a CSS-in-JS library
// For now, the hover effects will work when you add a CSS file

export default MachineList;