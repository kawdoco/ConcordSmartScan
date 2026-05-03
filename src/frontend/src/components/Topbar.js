// components/Topbar.js
import React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";
import SearchBar from "./SearchBar";

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const role = String(user?.role || "").toUpperCase();
  const [searchParams, setSearchParams] = useSearchParams();

  const titleByPath = {
    "/dashboard": "Dashboard",
    "/users": "User Management",
    "/users/add": "Add New User",
    "/machines": role === "TECHNICIAN" || role === "CHIEF_MANAGER" ? "Inventory" : "Machine Management",
    "/stores": "Store Management",
    "/garments": "Garment Management",
    "/stores/add": "Add Store",
    "/garments/add": "Add Garment",
    "/garments/edit": "Edit Garment",
    "/stores/edit": "Edit Store",
    "/requests/transfer": role === "TECHNICIAN" ? "Transfer History" : "Transfer Requests",
    "/requests/purchase": role === "TECHNICIAN" ? "Purchase History" : "Purchase Request",
    "/requests/approved": "Approved Requests",
    "/requests/new": "New Request",
    "/add": "Add Machine"
  };

  const title = location.pathname.startsWith("/machine/")
    ? "Machine Details"
    : location.pathname.startsWith("/edit/")
      ? "Edit Machine"
      : (titleByPath[location.pathname] || "Concord Dashboard");

  const searchConfig = (() => {
    if (location.pathname === "/users") {
      return { placeholder: "Search users by ID, name, or role" };
    }
    if (location.pathname === "/machines") {
      return { placeholder: "Search machines by ID, type, location, or date" };
    }
    if (location.pathname === "/stores") {
      return { placeholder: "Search stores by ID, name, or address" };
    }
    if (location.pathname === "/garments") {
      return { placeholder: "Search garments by ID, name, or address" };
    }
    if (location.pathname === "/requests/transfer") {
      return { placeholder: "Search transfer requests" };
    }
    if (location.pathname === "/requests/purchase") {
      return { placeholder: "Search purchase requests" };
    }
    if (location.pathname === "/requests/approved") {
      return { placeholder: "Search approved requests" };
    }
    return null;
  })();

  const searchQ = searchParams.get("q") || "";

  const handleSearchChange = (event) => {
    const value = event.target.value;
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set("q", value);
    } else {
      nextParams.delete("q");
    }
    setSearchParams(nextParams, { replace: true });
  };

  const formatName = (name) => {
    if (!name) return "User";
    return name
      .split(/[\s_.]+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };

  const getVibrantColor = (letter) => {
    const colors = [
      "#FF6B6B", // Red-ish
      "#1E90FF", // Blue
      "#2ED573", // Green
      "#FFA502", // Orange
      "#9B59B6", // Purple
      "#FF4757"  // Pink/Watermelon
    ];
    const charCode = (letter || "U").toUpperCase().charCodeAt(0);
    return colors[charCode % colors.length];
  };

  const shortName = (user?.email || "User").split("@")[0];
  const rawName = user?.name || user?.fullName || shortName;
  const displayName = formatName(rawName);
  const firstLetter = displayName.slice(0, 1).toUpperCase();

  return (
    <div style={styles.topbar}>
      <div style={styles.leftWrap}>
        <h1 style={styles.title}>{title}</h1>
      </div>
      <div style={styles.centerWrap}>
        {searchConfig && (
          <SearchBar
            size="sm"
            value={searchQ}
            onChange={handleSearchChange}
            placeholder={searchConfig.placeholder}
            className="topbar-search"
          />
        )}
      </div>
      <div style={styles.menuWrap}>
        <div style={styles.userInfo}>
          <div style={styles.userTextWrap}>
            <span style={styles.userName}>{displayName}</span>
            <span style={styles.userRole}>{role || "USER"}</span>
          </div>
          <span style={{ ...styles.avatar, background: getVibrantColor(firstLetter) }}>
            {firstLetter}
          </span>
        </div>
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
  leftWrap: {
    display: "flex",
    alignItems: "center",
    minWidth: 0,
    flex: "0 1 auto"
  },
  centerWrap: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    justifyContent: "center",
    width: "280px",
    maxWidth: "42vw",
    minWidth: 0,
    zIndex: 1
  },
  title: {
    margin: 0,
    fontSize: "1.3rem",
    color: "#0f172a",
    whiteSpace: "nowrap"
  },
  menuWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  userInfo: {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    background: "transparent",
    padding: "4px"
  },
  userTextWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    lineHeight: "1.2"
  },
  userName: {
    fontWeight: "700",
    color: "#1e293b",
    fontSize: "0.95rem"
  },
  userRole: {
    fontWeight: "600",
    color: "#64748b",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.03em"
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "999px",
    color: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  
};

export default Topbar;