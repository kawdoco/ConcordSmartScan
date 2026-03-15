// components/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";

function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Concord Apparel</h2>
      <p style={styles.subtitle}>Machine Locator Suite</p>
      <nav style={styles.nav}>
        <Link style={isActive("/dashboard") ? styles.activeLink : styles.link} to="/dashboard">Dashboard</Link>
        <Link style={isActive("/users") ? styles.activeLink : styles.link} to="/users">Users</Link>
        <Link style={isActive("/machines") ? styles.activeLink : styles.link} to="/machines">Machines</Link>
        <Link style={isActive("/add") ? styles.activeLink : styles.link} to="/add">Add Machine</Link>
      </nav>

      <div style={styles.footerBlock}>
        <p style={styles.userEmail}>{user?.email || "admin@concord.com"}</p>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0f172a, #172554)",
    color: "white",
    padding: "26px 16px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid rgba(148, 163, 184, 0.2)"
  },
  logo: {
    margin: "0",
    fontSize: "1.25rem",
    fontWeight: "700",
    letterSpacing: "0.2px",
    color: "#fff"
  },
  subtitle: {
    margin: "6px 0 24px 0",
    color: "#cbd5e1",
    fontSize: "0.84rem"
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  link: {
    display: "block",
    padding: "11px 12px",
    color: "#cbd5e1",
    textDecoration: "none",
    borderRadius: "10px",
    fontSize: "0.94rem",
    transition: "all 0.2s",
    border: "1px solid transparent"
  },
  activeLink: {
    display: "block",
    padding: "11px 12px",
    color: "white",
    textDecoration: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    border: "1px solid rgba(255,255,255,0.2)",
    fontSize: "0.94rem",
    boxShadow: "0 6px 16px rgba(37,99,235,0.35)"
  },
  footerBlock: {
    marginTop: "auto",
    padding: "12px",
    borderRadius: "10px",
    background: "rgba(15, 23, 42, 0.35)",
    border: "1px solid rgba(148, 163, 184, 0.2)"
  },
  userEmail: {
    margin: "0 0 10px 0",
    color: "#e2e8f0",
    fontSize: "0.8rem",
    overflowWrap: "anywhere"
  },
  logoutBtn: {
    width: "100%",
    padding: "9px 12px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600"
  }
};

export default Sidebar;