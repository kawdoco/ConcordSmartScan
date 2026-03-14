// pages/ViewMachine.js
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function ViewMachine() {
  const { id } = useParams();
  const navigate = useNavigate();

  const machine = {
    id: "MAC-9021",
    type: "Single Needle Lockstitch",
    model: "JUKI DDL-8700",
    serialNumber: "SN12345678",
    location: "ST-101",
    addedDate: "2024-03-15",
    status: "Active",
    lastMaintenance: "2024-09-15",
    nextMaintenance: "2024-12-15",
    storeName: "Main Street Store",
    assignedOperator: "John Doe"
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      
      <div style={styles.mainArea}>
        <Topbar />
        
        <div style={styles.content}>
          <div style={styles.header}>
            <button onClick={() => navigate(-1)} style={styles.backButton}>
              ← Back
            </button>
            <h1 style={styles.pageTitle}>Machine Details: {id}</h1>
          </div>
          
          <div style={styles.detailsCard}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Machine Information</h2>
              <Link to={`/edit/${id}`} style={styles.editButton}>Edit Machine</Link>
            </div>
            
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Machine ID</span>
                <span style={styles.detailValue}>{machine.id}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Type</span>
                <span style={styles.detailValue}>{machine.type}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Model</span>
                <span style={styles.detailValue}>{machine.model}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Serial Number</span>
                <span style={styles.detailValue}>{machine.serialNumber}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Location</span>
                <span style={styles.detailValue}>
                  <span style={styles.location}>{machine.location}</span>
                </span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Store/Garment</span>
                <span style={styles.detailValue}>{machine.storeName}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Added Date</span>
                <span style={styles.detailValue}>{machine.addedDate}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Status</span>
                <span style={{
                  ...styles.statusBadge,
                  background: machine.status === "Active" ? "#10b981" : "#f59e0b",
                  color: "white"
                }}>
                  {machine.status}
                </span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Assigned Operator</span>
                <span style={styles.detailValue}>{machine.assignedOperator}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Last Maintenance</span>
                <span style={styles.detailValue}>{machine.lastMaintenance}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Next Maintenance</span>
                <span style={styles.detailValue}>{machine.nextMaintenance}</span>
              </div>
            </div>
          </div>

          <div style={styles.actionButtons}>
            <button style={styles.maintenanceButton}>Schedule Maintenance</button>
            <button style={styles.transferButton}>Transfer Location</button>
            <button style={styles.deleteButton}>Delete Machine</button>
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
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh"
  },
  mainArea: {
    marginLeft: "250px",
    width: "calc(100% - 250px)",
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  },
  content: {
    padding: "30px 40px",
    flex: 1
  },
  header: {
    marginBottom: "30px"
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "1rem",
    padding: "0 0 10px 0",
    display: "block"
  },
  pageTitle: {
    fontSize: "2rem",
    margin: 0,
    color: "#0f172a",
    fontWeight: "600"
  },
  detailsCard: {
    background: "white",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e2e8f0"
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.25rem",
    color: "#1e293b",
    fontWeight: "600"
  },
  editButton: {
    padding: "8px 20px",
    background: "#2563eb",
    border: "none",
    borderRadius: "8px",
    color: "white",
    textDecoration: "none",
    fontSize: "0.95rem",
    fontWeight: "500"
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "25px 30px"
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  detailLabel: {
    color: "#64748b",
    fontSize: "0.9rem",
    fontWeight: "500"
  },
  detailValue: {
    color: "#1e293b",
    fontSize: "1.1rem",
    fontWeight: "500"
  },
  location: {
    background: "#e2e8f0",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.95rem",
    display: "inline-block"
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.95rem",
    fontWeight: "500",
    display: "inline-block",
    width: "fit-content"
  },
  actionButtons: {
    display: "flex",
    gap: "15px",
    marginTop: "25px"
  },
  maintenanceButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500"
  },
  transferButton: {
    background: "white",
    color: "#2563eb",
    border: "1px solid #2563eb",
    padding: "12px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500"
  },
  deleteButton: {
    background: "white",
    color: "#ef4444",
    border: "1px solid #ef4444",
    padding: "12px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500"
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
    ':hover': {
      textDecoration: "underline"
    }
  },
  separator: {
    color: "#cbd5e1"
  }
};

export default ViewMachine;