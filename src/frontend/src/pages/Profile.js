import React from "react";
import { useAuth } from "../authentication/AuthContext";
import { formatUserId } from "../users/userId";

function Profile() {
  const { user } = useAuth();

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Profile</h2>
      <div style={styles.card}>
        <div style={styles.row}>
          <span style={styles.label}>Email</span>
          <span style={styles.value}>{user?.email || "-"}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Role</span>
          <span style={styles.value}>{user?.role || "-"}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>User ID</span>
          <span style={styles.value}>{formatUserId(user?.id)}</span>
        </div>
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
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "10px 0",
    borderBottom: "1px dashed #e2e8f0"
  },
  label: {
    color: "#64748b",
    fontWeight: 600
  },
  value: {
    color: "#0f172a",
    fontWeight: 600
  }
};

export default Profile;
