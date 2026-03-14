// components/Topbar.js
import React from "react";

function Topbar({ onSearch }) {
  return (
    <div style={styles.topbar}>
      <input
        style={styles.search}
        type="text"
        placeholder="Search by Machine ID, Store ID, or Garment ID"
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
      <div style={styles.user}>
        Admin User
      </div>
    </div>
  );
}

const styles = {
  topbar: {
    height: "70px",
    background: "white",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
    boxSizing: "border-box"
  },
  search: {
    width: "400px",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
    ':focus': {
      borderColor: "#2563eb"
    }
  },
  user: {
    fontWeight: "500",
    color: "#1e293b",
    padding: "8px 15px",
    background: "#f8fafc",
    borderRadius: "8px"
  }
};

export default Topbar;