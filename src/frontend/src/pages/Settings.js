import React, { useState } from "react";

function Settings() {
  const [apiUrl, setApiUrl] = useState(process.env.REACT_APP_API_URL || "http://localhost:8080/api");

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Settings</h2>
      <div style={styles.card}>
        <label style={styles.label}>API Base URL</label>
        <input
          style={styles.input}
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="http://localhost:8080/api"
        />
        <p style={styles.help}>This field is preview-only in current build.</p>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    padding: "8px"
  },
  title: {
    margin: "0 0 16px 0",
    color: "#0f172a"
  },
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "18px",
    maxWidth: "520px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#334155",
    fontWeight: 600
  },
  input: {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    boxSizing: "border-box"
  },
  help: {
    color: "#64748b",
    fontSize: "0.9rem",
    marginTop: "10px"
  }
};

export default Settings;
