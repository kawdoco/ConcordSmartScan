// components/StatsCards.js
import React from "react";

function StatsCards() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <p style={styles.cardLabel}>Total Machines</p>
        <h2 style={styles.cardValue}>4,821</h2>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>At Stores</p>
        <h2 style={styles.cardValue}>2,140</h2>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>At Garments</p>
        <h2 style={styles.cardValue}>2,681</h2>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "25px",
    marginBottom: "30px"
  },
  card: {
    background: "white",
    padding: "25px 20px",
    borderRadius: "12px",
    width: "calc(33.333% - 17px)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    boxSizing: "border-box"
  },
  cardLabel: {
    margin: "0 0 10px 0",
    color: "#64748b",
    fontSize: "0.95rem",
    fontWeight: "500"
  },
  cardValue: {
    margin: 0,
    fontSize: "2.2rem",
    fontWeight: "600",
    color: "#0f172a"
  }
};

export default StatsCards;