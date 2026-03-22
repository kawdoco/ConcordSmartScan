// components/Topbar.js
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const titleByPath = {
    "/dashboard": "Dashboard",
    "/users": "User Management",
    "/machines": "Machine Management",
    "/add": "Add Machine",
    "/profile": "Profile",
    "/settings": "Settings"
  };

  const title = location.pathname.startsWith("/machine/")
    ? "Machine Details"
    : (titleByPath[location.pathname] || "Concord Dashboard");

  useEffect(() => {
    const onClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const goProfile = () => {
    setOpen(false);
    navigate("/profile");
  };

  const goSettings = () => {
    setOpen(false);
    navigate("/settings");
  };

  const doLogout = () => {
    setOpen(false);
    logout();
    navigate("/", { replace: true });
  };

  const shortName = (user?.email || "User").split("@")[0];

  return (
    <div style={styles.topbar}>
      <div>
        <p style={styles.label}>Operations Console</p>
        <h1 style={styles.title}>{title}</h1>
      </div>
      <div style={styles.menuWrap} ref={menuRef}>
        <button style={styles.userBtn} onClick={() => setOpen(v => !v)}>
          <span style={styles.avatar}>{shortName.slice(0, 1).toUpperCase()}</span>
          <span style={styles.userText}>{shortName}</span>
          <span style={styles.caret}>{open ? "▴" : "▾"}</span>
        </button>

        {open && (
          <div style={styles.dropdown}>
            <button style={styles.item} onClick={goProfile}>Profile</button>
            <button style={styles.item} onClick={goSettings}>Settings</button>
            <button style={styles.itemDanger} onClick={doLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  topbar: {
    minHeight: "74px",
    background: "rgba(255,255,255,0.92)",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 22px",
    boxSizing: "border-box",
    backdropFilter: "blur(8px)",
    position: "sticky",
    top: 0,
    zIndex: 20
  },
  label: {
    margin: 0,
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#64748b",
    fontWeight: "700"
  },
  title: {
    margin: "3px 0 0 0",
    fontSize: "1.3rem",
    color: "#0f172a"
  },
  menuWrap: {
    position: "relative"
  },
  userBtn: {
    fontWeight: "600",
    color: "#1e293b",
    padding: "7px 10px",
    background: "#f8fafc",
    borderRadius: "999px",
    border: "1px solid #e2e8f0",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer"
  },
  avatar: {
    width: "24px",
    height: "24px",
    borderRadius: "999px",
    background: "linear-gradient(135deg,#2563eb,#7c3aed)",
    color: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem"
  },
  userText: {
    maxWidth: "120px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  caret: {
    color: "#475569",
    fontSize: "0.8rem"
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "calc(100% + 8px)",
    minWidth: "170px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    boxShadow: "0 14px 30px rgba(2,6,23,.12)",
    padding: "6px",
    zIndex: 40
  },
  item: {
    width: "100%",
    textAlign: "left",
    border: "none",
    background: "transparent",
    padding: "9px 10px",
    borderRadius: "8px",
    color: "#0f172a",
    cursor: "pointer",
    fontWeight: 600
  },
  itemDanger: {
    width: "100%",
    textAlign: "left",
    border: "none",
    background: "#fff1f2",
    padding: "9px 10px",
    borderRadius: "8px",
    color: "#b91c1c",
    cursor: "pointer",
    fontWeight: 700
  }
};

export default Topbar;