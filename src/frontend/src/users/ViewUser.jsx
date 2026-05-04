import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PagePath from "../components/PagePath";
import apiClient from "../services/api";
import "./ViewUser.css";

function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function formatRole(value) {
  const role = String(value || "").toUpperCase();
  if (role === "CHIEF_MANAGER") return "Chief Manager";
  if (role === "TECHNICIAN") return "Technician";
  if (role === "ADMIN") return "Admin";
  return value || "N/A";
}

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString().slice(0, 10);
}

function getRoleBadgeClass(role) {
  const normalized = String(role || "").toUpperCase();
  if (normalized === "ADMIN") return "view-user-role-admin";
  if (normalized === "CHIEF_MANAGER") return "view-user-role-chief";
  if (normalized === "TECHNICIAN") return "view-user-role-tech";
  return "view-user-role-default";
}

export default function ViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("User ID not found");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    apiClient
      .get(`/users/${id}`)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        setError("Failed to load user details. Please try again.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <section className="view-user-page">
        <div className="view-user-status">Loading user details...</div>
        <AppFooter />
      </section>
    );
  }

  if (error || !user) {
    return (
      <section className="view-user-page">
        <div className="view-user-status view-user-status-error">{error || "User not found"}</div>
        <AppFooter />
      </section>
    );
  }

  const roleRaw = user.role || user.userType;
  const userName = user.name || "N/A";

  return (
    <section className="view-user-page">
      <PagePath items={[{ label: "Users", to: "/users" }, { label: "User Details" }]} />

      <div className="view-user-card">
        <div className="view-user-card-header">
          <div className="view-user-header-content">
            <span className="view-user-card-icon"><IconUser /></span>
            <h2 className="view-user-card-title">User Information</h2>
          </div>
          <button
            type="button"
            className="view-user-edit-btn"
            onClick={() => navigate(`/users/edit/${id}`)}
          >
            <IconEdit />
            Edit User
          </button>
        </div>

        <div className="view-user-card-body">
          <div className="view-user-details-grid">
            <div className="view-user-detail-item">
              <span className="view-user-detail-label">User ID</span>
              <span className="view-user-detail-value">USR-{String(user.id || id).padStart(3, "0")}</span>
            </div>

            <div className="view-user-detail-item">
              <span className="view-user-detail-label">Full Name</span>
              <span className="view-user-detail-value">{userName}</span>
            </div>

            <div className="view-user-detail-item">
              <span className="view-user-detail-label">Role</span>
              <span className="view-user-detail-value">
                <span className={`view-user-role-badge ${getRoleBadgeClass(roleRaw)}`}>
                  {formatRole(roleRaw)}
                </span>
              </span>
            </div>

            <div className="view-user-detail-item">
              <span className="view-user-detail-label">Email</span>
              <span className="view-user-detail-value">{user.email || "N/A"}</span>
            </div>

            <div className="view-user-detail-item">
              <span className="view-user-detail-label">Company Email</span>
              <span className="view-user-detail-value">{user.companyEmail || "N/A"}</span>
            </div>

            <div className="view-user-detail-item">
              <span className="view-user-detail-label">Phone Number</span>
              <span className="view-user-detail-value">{user.phoneNumber || user.phone || "N/A"}</span>
            </div>

            <div className="view-user-detail-item">
              <span className="view-user-detail-label">Assigned Location</span>
              <span className="view-user-detail-value">{user.location || user.garmentId || "N/A"}</span>
            </div>

            <div className="view-user-detail-item">
              <span className="view-user-detail-label">Address</span>
              <span className="view-user-detail-value">{user.address || "N/A"}</span>
            </div>

            <div className="view-user-detail-item">
              <span className="view-user-detail-label">Date of Birth</span>
              <span className="view-user-detail-value">{formatDate(user.dateOfBirth)}</span>
            </div>

            <div className="view-user-detail-item">
              <span className="view-user-detail-label">Created Date</span>
              <span className="view-user-detail-value">{formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="view-user-actions">
          <button
            type="button"
            className="view-user-back-btn"
            onClick={() => navigate("/users")}
          >
            Back to Users
          </button>
        </div>
      </div>

      <AppFooter />
    </section>
  );
}

