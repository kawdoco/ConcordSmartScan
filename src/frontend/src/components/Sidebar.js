// components/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const role = String(user?.role || "").toUpperCase();

  const iconByKey = {
    dashboard: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" strokeWidth="1.8" />
      </svg>
    ),
    users: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="7" r="4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    machines: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 10h18v8H3zM7 10V6h10v4M7 18h.01M11 18h.01" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    stores: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 9l9-5 9 5v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    transferRequests: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 7h13M7 12h13M7 17h13M3 7h.01M3 12h.01M3 17h.01" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    purchase: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6h15l-1.5 9h-11zM6 6 5 3H3M9 20a1 1 0 1 0 0 .01M18 20a1 1 0 1 0 0 .01" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    approved: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 12l2 2 4-4M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    garments: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 18h1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 18h1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 18h1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    transferHistory: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 7h11M7 12h8M7 17h11M4 7l-2 2 2 2M20 15l2 2-2 2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    newRequest: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 5v14M5 12h14" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  };

  const navItemsByRole = {
    ADMIN: [
      { path: "/dashboard", label: "Dashboard", icon: iconByKey.dashboard },
      { path: "/users", label: "Users", icon: iconByKey.users },
      { path: "/machines", label: "Machines", icon: iconByKey.machines },
      { path: "/stores", label: "Stores", icon: iconByKey.stores },
      { path: "/garments", label: "Garments", icon: iconByKey.garments },
      { path: "/requests/approved", label: "Approved Requests", icon: iconByKey.approved }
    ],
    CHIEF_MANAGER: [
      { path: "/dashboard", label: "Dashboard", icon: iconByKey.dashboard },
      { path: "/machines", label: "Inventory", icon: iconByKey.machines },
      { path: "/stores", label: "Stores", icon: iconByKey.stores },
      { path: "/garments", label: "Garments", icon: iconByKey.garments },
      { path: "/requests/transfer", label: "Transfer Requests", icon: iconByKey.transferRequests },
      { path: "/requests/purchase", label: "Purchase Request", icon: iconByKey.purchase }
    ],
    TECHNICIAN: [
      { path: "/dashboard", label: "Dashboard", icon: iconByKey.dashboard },
      { path: "/machines", label: "Inventory", icon: iconByKey.machines },
      { path: "/requests/transfer", label: "Transfer History", icon: iconByKey.transferHistory },
      { path: "/requests/purchase", label: "Purchase History", icon: iconByKey.purchase },
      { path: "/requests/new", label: "New Request", icon: iconByKey.newRequest }
    ]
  };

  const navItems = navItemsByRole[role] || navItemsByRole.TECHNICIAN;

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const formatName = (name) => {
    if (!name) return "Admin User";
    return name
      .split(/[\s_.]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const rawName = user?.name || user?.fullName || user?.email?.split("@")[0] || "Admin User";
  const displayName = formatName(rawName);
  const displayEmail = user?.email || "admin@concord.com";
  const avatarLetter = (displayName?.trim()?.charAt(0) || "A").toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">C</span>
        </div>
        <div className="sidebar-brand">
          <h2 className="sidebar-brand-name">Concord Apparel</h2>
          <p className="sidebar-brand-subtitle">Machine Locator Suite</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-nav-item ${isActive(item.path) ? "active" : ""}`.trim()}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{avatarLetter}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{displayName}</div>
            <div className="sidebar-user-email">{displayEmail}</div>
          </div>
        </div>
        <button type="button" className="sidebar-logout-button" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
