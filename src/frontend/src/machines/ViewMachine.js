// pages/ViewMachine.js
import React from "react";
import { useParams, Link } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PagePath from "../components/PagePath";

function ViewMachine() {
  const { id } = useParams();

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
    <section style={styles.page}>
      <PagePath items={[{ label: "Machines", to: "/machines" }, { label: `Machine Details: ${id}` }]} />

      <div style={styles.detailsCard}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>{`Machine Information: ${id}`}</h2>
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
            </div>
      </div>

      <div style={styles.footerSpacer} />
      <AppFooter />
    </section>
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
  page: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "6px 8px"
  },
  footerSpacer: {
    flex: 1
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
  }
};

export default ViewMachine;