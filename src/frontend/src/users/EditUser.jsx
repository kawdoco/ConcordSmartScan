
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PagePath from "../components/PagePath";
import apiClient from "../services/api";
import "./AddUser.css";

export default function EditUserPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullName: "John Perera",
    dateOfBirth: "1990-05-15",
    phoneNumber: "+94 77 123 4567",
    email: "john.p@gmail.com",
    address: "123 Main St, Colombo",
    garmentId: "5",
    companyEmail: "john.p@concord.com",
    userType: "TECHNICIAN",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) {
        setSubmitError("Missing user id.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data } = await apiClient.get(`/users/${id}`);
        setFormData((prev) => ({
          ...prev,
          fullName: data.name || "",
          dateOfBirth: data.dateOfBirth || "",
          phoneNumber: data.phoneNumber || "",
          email: data.email || "",
          address: data.address || "",
          garmentId: data.garmentId != null ? String(data.garmentId) : "",
          companyEmail: data.companyEmail || "",
          userType: data.userType || data.role || "",
          currentPassword: "",
          password: "",
          confirmPassword: "",
        }));
      } catch (error) {
        const message = extractBackendError(error, "Failed to load user details.");
        setSubmitError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      setSubmitError("Missing user id.");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setSubmitError("New password and confirm password do not match.");
      return;
    }

    if (formData.password && !formData.currentPassword) {
      setSubmitError("Current password is required to set a new password.");
      return;
    }

    if (formData.garmentId && Number.isNaN(Number(formData.garmentId))) {
      setSubmitError("Garment ID must be a valid number.");
      return;
    }

    const isChangingPassword = Boolean(formData.password && formData.password.trim());

    if (!formData.fullName.trim() || !formData.dateOfBirth || !formData.phoneNumber.trim() || !formData.email.trim() || !formData.address.trim() || !formData.companyEmail.trim() || !formData.userType) {
      setSubmitError("Please fill all required fields.");
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      dateOfBirth: formData.dateOfBirth,
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      companyEmail: formData.companyEmail.trim(),
      userType: formData.userType,
      garmentId: formData.garmentId ? Number(formData.garmentId) : null,
      currentPassword: isChangingPassword ? formData.currentPassword : null,
      password: isChangingPassword ? formData.password : null,
    };

    try {
      setIsSubmitting(true);
      setSubmitError("");
      await apiClient.put(`/users/${id}`, payload);
      navigate("/users");
    } catch (error) {
      const message = extractBackendError(error, "Failed to update user. Please try again.");
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const extractBackendError = (error, fallbackMessage) => {
    const data = error?.response?.data;
    if (!data) {
      return fallbackMessage;
    }
    if (typeof data === "string") {
      return data;
    }
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
    if (Array.isArray(data.errors) && data.errors.length) {
      return data.errors.join(", ");
    }
    if (typeof data.error === "string" && data.error.trim()) {
      return data.error;
    }
    return fallbackMessage;
  };

  const handleCancel = () => {
    navigate("/users");
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  if (isLoading) {
    return (
      <section className="add-user-page">
        <PagePath items={[{ label: "Users", to: "/users" }, { label: "Edit User" }]} />
        <div className="add-user-card">
          <div className="add-user-card-body">Loading user details...</div>
        </div>
        <AppFooter />
      </section>
    );
  }

  return (
    <section className="add-user-page">
      <PagePath items={[{ label: "Users", to: "/users" }, { label: "Edit User" }]} />

      <form onSubmit={handleSubmit} className="add-user-card">
        <div className="add-user-card-header">
          <span className="add-user-card-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </span>
          <div>
            <h2>Edit User Details</h2>
            <p>Update the details of the selected user.</p>
          </div>
        </div>

        <div className="add-user-card-body">
          <div className="add-user-section">
            <div className="add-user-section-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <h2>Personal Details</h2>
            </div>

            <div className="add-user-grid-two">
              <div className="add-user-field">
                <label htmlFor="fullName">Full Name</label>
                <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
              </div>
              <div className="add-user-field">
                <label htmlFor="userType">User Type</label>
                <select id="userType" name="userType" value={formData.userType} onChange={handleInputChange} required>
                  <option value=""></option>
                  <option value="TECHNICIAN">Technician</option>
                  <option value="CHIEF_MANAGER">Chief Manager</option>
                </select>
              </div>
            </div>

            <div className="add-user-grid-two">
              <div className="add-user-field">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
              </div>
              <div className="add-user-field">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="add-user-field">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </div>

            <div className="add-user-field">
              <label htmlFor="address">Address</label>
              <textarea id="address" name="address" value={formData.address} onChange={handleInputChange} rows="3" required />
            </div>
          </div>

          <div className="add-user-section">
            <div className="add-user-section-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <h2>Company Details</h2>
            </div>

            <div className="add-user-grid-two">
              <div className="add-user-field">
                <label htmlFor="garmentId">Garment ID</label>
                <input type="text" id="garmentId" name="garmentId" value={formData.garmentId} onChange={handleInputChange} />
              </div>
              <div className="add-user-field">
                <label htmlFor="companyEmail">Company Email</label>
                <input type="email" id="companyEmail" name="companyEmail" value={formData.companyEmail} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="add-user-field add-user-narrow-field">
              <label htmlFor="userAddedDate">User Added Date</label>
              <input type="date" id="userAddedDate" name="userAddedDate" value={getCurrentDate()} disabled />
            </div>
          </div>

          <div className="add-user-section">
            <div className="add-user-section-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <h2>Account Security</h2>
            </div>

            <div className="add-user-field">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter current password"
              />
            </div>

            <div className="add-user-grid-two">
              <div className="add-user-field">
                <label htmlFor="password">New Password</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Leave blank to keep existing password" />
              </div>
              <div className="add-user-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Leave blank to keep existing password" />
              </div>
            </div>
          </div>
        </div>

        <div className="add-user-actions">
          {submitError && <div className="add-user-submit-error">{submitError}</div>}
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            {isSubmitting ? "Updating..." : "Update User"}
          </button>
        </div>
      </form>

      <AppFooter />
    </section>
  );
}