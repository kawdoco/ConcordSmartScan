// pages/ViewMachine.js
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PagePath from "../components/PagePath";

function ViewMachine() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMachine();
  }, [id]);

  const fetchMachine = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/machines/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔐 handle auth issues
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        throw new Error("Access denied (403)");
      }

      if (response.status === 404) {
        throw new Error("Machine not found");
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setMachine(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Loading UI ─────────────────────────
  if (loading) {
    return (
      <section style={styles.page}>
        <PagePath items={[{ label: "Machines", to: "/machines" }, { label: "Machine Details" }]} />
        <div style={styles.detailsCard}>Loading machine...</div>
      </section>
    );
  }

  // ─── Error UI ───────────────────────────
  if (error) {
    return (
      <section style={styles.page}>
        <PagePath items={[{ label: "Machines", to: "/machines" }, { label: "Machine Details" }]} />
        <div style={{ ...styles.detailsCard, color: "red" }}>
          {error}
          <br /><br />
          <Link to="/machines">← Back</Link>
        </div>
      </section>
    );
  }

  // ─── Safety check ───────────────────────
  if (!machine) return null;

  const displayMachineId = `MAC-${String(machine.id ?? "").padStart(3, "0")}`;

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
            <span style={styles.detailValue}>{displayMachineId}</span>
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
            <span style={styles.detailValue}>{machine.storeName || "—"}</span>
          </div>

          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Added Date</span>
            <span style={styles.detailValue}>{machine.date}</span>
          </div>

          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Status</span>
            <span style={{
              ...styles.statusBadge,
              background: machine.status === "Active" ? "#10b981" : "#f59e0b",
              color: "white"
            }}>
              {machine.status || "Unknown"}
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