// This React component serves as the main dashboard entry point, routing users to role-specific dashboards.

import React from "react";
import { useAuth } from "../authentication/AuthContext";
import AdminDashboard from "./AdminDashboard";
import ChiefManagerDashboard from "./ChiefManagerDashboard";
import TechnicianDashboard from "./TechnicianDashboard";

/**
 * Dashboard — role-based entry point.
 *
 * ADMIN        → AdminDashboard
 * CHIEF_MANAGER → ChiefManagerDashboard
 * TECHNICIAN   → TechnicianDashboard
 */
function Dashboard() {
  const { user } = useAuth();
  const role = String(user?.role || "").toUpperCase();

  if (role === "ADMIN") {
    return <AdminDashboard />;
  }

  if (role === "CHIEF_MANAGER") {
    return <ChiefManagerDashboard />;
  }

  /* Default: TECHNICIAN (or any unknown role) */
  return <TechnicianDashboard />;
}

export default Dashboard;