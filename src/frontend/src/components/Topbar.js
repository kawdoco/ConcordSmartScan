// components/Topbar.js
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";
import "./css/Topbar.css";

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
    <div className="topbar">
      <div>
        <p className="topbar__label">Operations Console</p>
        <h1 className="topbar__title">{title}</h1>
      </div>
      <div className="topbar__menu-wrap" ref={menuRef}>
        <button className="topbar__user-btn" onClick={() => setOpen(v => !v)}>
          <span className="topbar__avatar">{shortName.slice(0, 1).toUpperCase()}</span>
          <span className="topbar__user-text">{shortName}</span>
          <span className="topbar__caret">{open ? "▴" : "▾"}</span>
        </button>

        {open && (
          <div className="topbar__dropdown">
            <button className="topbar__item" onClick={goProfile}>Profile</button>
            <button className="topbar__item" onClick={goSettings}>Settings</button>
            <button className="topbar__item topbar__item--danger" onClick={doLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Topbar;