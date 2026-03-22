import React, { useState } from "react";

const garments = [
  { id: "GR-001", branch: "Katunayake", location: "6.9271, 79.8612", phone: "+94 11 445 1122", address: "Phase I, Katunayake EPZ, Katunayake" },
  { id: "GR-002", branch: "Kandy", location: "7.2906, 80.6337", phone: "+94 81 223 4455", address: "Werapitiya Road, Kandy Industrial Park" },
  { id: "GR-003", branch: "Galle", location: "6.0367, 80.2170", phone: "+94 91 334 2211", address: "Koggala EPZ, Habaraduwa" },
  { id: "GR-004", branch: "Biyagama", location: "7.1824, 79.8821", phone: "+94 11 556 7788", address: "Negombo Road, Seeduwa" },
  { id: "GR-005", branch: "Horana", location: "6.7167, 80.0667", phone: "+94 34 226 1100", address: "Horana Export Processing Zone" },
  { id: "GR-006", branch: "Mirigama", location: "7.2167, 80.1167", phone: "+94 33 227 5566", address: "Mirigama Industrial Estate" },
  { id: "GR-007", branch: "Seethawaka", location: "6.9833, 80.1167", phone: "+94 36 222 3344", address: "Seethawaka Industrial Zone" },
  { id: "GR-008", branch: "Nittambuwa", location: "7.1500, 80.0833", phone: "+94 33 229 8800", address: "Nittambuwa Road, Gampaha" },
];

const PAGE_SIZE = 4;

const EyeIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EditIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

function GarmentManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(garments.length / PAGE_SIZE);
  const paginated = garments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.pageTitle}>Garment Management</h1>

      <div style={styles.card}>
        {/* Card Header */}
        <div style={styles.cardHeader}>
          <div>
            <p style={styles.cardTitle}>Registered Garments</p>
            <p style={styles.cardSub}>Manage all garment manufacturing and storage units.</p>
          </div>
          <button style={styles.addBtn}>
            <span style={styles.addBtnIcon}>⊕</span>
            Add New Garment
          </button>
        </div>

        {/* Table */}
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>GARMENT ID</th>
              <th style={styles.th}>BRANCH NAME</th>
              <th style={styles.th}>LOCATION (LAT, LONG)</th>
              <th style={styles.th}>PHONE NUMBER</th>
              <th style={styles.th}>ADDRESS</th>
              <th style={{ ...styles.th, textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <tr key={row.id} style={styles.tbodyRow}>
                <td style={styles.td}>
                  <span style={styles.idText}>{row.id}</span>
                </td>
                <td style={{ ...styles.td, fontWeight: "600", color: "#111827" }}>{row.branch}</td>
                <td style={styles.td}>{row.location}</td>
                <td style={styles.td}>{row.phone}</td>
                <td style={styles.td}>{row.address}</td>
                <td style={{ ...styles.td, textAlign: "right" }}>
                  <div style={styles.actionGroup}>
                    <button style={styles.actionBtn} title="View"><EyeIcon /></button>
                    <button style={styles.actionBtn} title="Edit"><EditIcon /></button>
                    <button style={{ ...styles.actionBtn, color: "#ef4444" }} title="Delete"><TrashIcon /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={styles.pagination}>
          <span style={styles.paginationInfo}>
            Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(currentPage * PAGE_SIZE, garments.length)} of {garments.length} garments
          </span>
          <div style={styles.pageControls}>
            <button
              style={{ ...styles.pageBtn, ...(currentPage === 1 ? styles.pageBtnDisabled : {}) }}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                style={{ ...styles.pageBtn, ...(pg === currentPage ? styles.pageBtnActive : {}) }}
                onClick={() => setCurrentPage(pg)}
              >
                {pg}
              </button>
            ))}
            <button
              style={{ ...styles.pageBtn, ...(currentPage === totalPages ? styles.pageBtnDisabled : {}) }}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "32px 36px",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    color: "#111827",
    boxSizing: "border-box",
  },
  pageTitle: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "22px",
    marginTop: 0,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px 16px",
  },
  cardTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  cardSub: {
    fontSize: "12.5px",
    color: "#9ca3af",
    marginTop: "4px",
    marginBottom: 0,
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "13.5px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  addBtnIcon: {
    fontSize: "16px",
    lineHeight: 1,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  theadRow: {
    borderTop: "1px solid #f3f4f6",
    borderBottom: "1px solid #f3f4f6",
    backgroundColor: "#f9fafb",
  },
  th: {
    padding: "10px 20px",
    fontSize: "11.5px",
    fontWeight: "700",
    color: "#6b7280",
    letterSpacing: "0.04em",
    textAlign: "left",
  },
  tbodyRow: {
    borderBottom: "1px solid #f3f4f6",
  },
  td: {
    padding: "15px 20px",
    fontSize: "13.5px",
    color: "#374151",
  },
  idText: {
    color: "#9ca3af",
    fontFamily: "monospace",
    fontSize: "13px",
  },
  actionGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "4px",
  },
  actionBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "6px",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    borderTop: "1px solid #f3f4f6",
  },
  paginationInfo: {
    fontSize: "12.5px",
    color: "#9ca3af",
  },
  pageControls: {
    display: "flex",
    gap: "4px",
    alignItems: "center",
  },
  pageBtn: {
    minWidth: "30px",
    height: "30px",
    padding: "0 8px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    background: "#ffffff",
    color: "#374151",
    fontSize: "13px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "inherit",
  },
  pageBtnActive: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderColor: "#2563eb",
    fontWeight: "700",
  },
  pageBtnDisabled: {
    color: "#d1d5db",
    cursor: "not-allowed",
  },
};

export default GarmentManagement;