// components/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Concord Apparel</h2>
      <nav style={styles.nav}>
        <Link style={isActive("/dashboard") ? styles.activeLink : styles.link} to="/dashboard">Dashboard</Link>
        <Link style={isActive("/users") ? styles.activeLink : styles.link} to="/users">Users</Link>
        <Link style={isActive("/") ? styles.activeLink : styles.link} to="/">Machines</Link>
        <Link style={isActive("/stores") ? styles.activeLink : styles.link} to="/stores">Stores</Link>
        <Link style={isActive("/garments") ? styles.activeLink : styles.link} to="/garments">Garments</Link>
        <Link style={isActive("/approved") ? styles.activeLink : styles.link} to="/approved">Approved Requests</Link>
      </nav>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    height: "100vh",
    background: "#1e293b",
    color: "white",
    padding: "30px 20px",
    position: "fixed",
    top: 0,
    left: 0,
    boxSizing: "border-box"
  },
  logo: {
    margin: "0 0 40px 0",
    fontSize: "1.3rem",
    fontWeight: "600",
    letterSpacing: "0.5px",
    color: "#fff"
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },
  link: {
    display: "block",
    padding: "12px 15px",
    color: "#cbd5e1",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    transition: "all 0.2s"
  },
  activeLink: {
    display: "block",
    padding: "12px 15px",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    background: "#2563eb",
    fontSize: "0.95rem"
  }
};

export default Sidebar;