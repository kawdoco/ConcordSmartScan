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

  const shortName = (user?.email || "User").split("@")[0];

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
          <span style={styles.avatar}>{shortName.slice(0, 1).toUpperCase()}</span>
          <span style={styles.userText}>{shortName}</span>
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
    fontWeight: "600",
    color: "#1e293b",
    padding: "7px 10px",
    background: "#f8fafc",
    borderRadius: "999px",
    border: "1px solid #e2e8f0",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px"
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
  
};

export default Topbar;