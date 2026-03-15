import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./AppLayout.css";

function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell-main">
        <Topbar />
        <main className="app-shell-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
