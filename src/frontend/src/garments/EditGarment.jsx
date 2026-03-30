import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PagePath from "../components/PagePath";
import { updateGarment } from "../services/locationService";
import "./EditGarment.css";

function IconGarment() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4l2 4h8l2-4" />
      <path d="M9 8v12h6V8" />
      <path d="M9 12h6" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
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

function IconInfo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

const FALLBACK_GARMENT = {
  branchName: "Concord - Katunayake",
  garmentId: "GR-001",
  phoneNumber: "+94 11 445 1122",
  address: "Phase I, Katunayake EPZ, Katunayake",
  latitude: "6.9271",
  longitude: "79.8612"
};

function mapGarmentToForm(garment) {
  if (!garment) return { ...FALLBACK_GARMENT };

  // Handle both API format (locationId) and old format (id)
  const garmentId = garment.locationId || garment.id || FALLBACK_GARMENT.garmentId;
  
  // Extract coordinates from location string or use individual fields
  let latitude = "";
  let longitude = "";
  
  if (garment.location) {
    [latitude, longitude] = garment.location
      .split(",")
      .map((value) => value.trim());
  } else {
    latitude = garment.latitude || "";
    longitude = garment.longitude || "";
  }

  return {
    branchName: garment.name || garment.branch || FALLBACK_GARMENT.branchName,
    garmentId: garmentId,
    phoneNumber: garment.contactInfo || garment.phone || FALLBACK_GARMENT.phoneNumber,
    address: garment.address || FALLBACK_GARMENT.address,
    latitude: latitude.toString() || FALLBACK_GARMENT.latitude,
    longitude: longitude.toString() || FALLBACK_GARMENT.longitude
  };
}

export default function EditGarment() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialForm = useMemo(() => mapGarmentToForm(location.state?.garment), [location.state?.garment]);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm(initialForm);
    setErrors({});
  }, [initialForm]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.branchName.trim()) nextErrors.branchName = "Branch name is required.";

    const phoneDigits = form.phoneNumber.replace(/\D/g, "");
    if (!form.phoneNumber.trim()) nextErrors.phoneNumber = "Phone number is required.";
    else if (phoneDigits.length < 10 || phoneDigits.length > 15) nextErrors.phoneNumber = "Phone number must contain 10 to 15 digits.";

    if (!form.address.trim()) nextErrors.address = "Address is required.";

    if (form.latitude !== "" && (isNaN(form.latitude) || Number(form.latitude) < -90 || Number(form.latitude) > 90)) {
      nextErrors.latitude = "Latitude must be between -90 and 90.";
    }

    if (form.longitude !== "" && (isNaN(form.longitude) || Number(form.longitude) < -180 || Number(form.longitude) > 180)) {
      nextErrors.longitude = "Longitude must be between -180 and 180.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const garmentId = form.garmentId;
      
      const payload = {
        name: form.branchName.trim(),
        contactInfo: form.phoneNumber.trim(),
        address: form.address.trim(),
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      };

      await updateGarment(garmentId, payload);
      showNotification("Garment updated successfully!", "success");

      setTimeout(() => {
        navigate("/garments");
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to update garment. Please try again.";
      showNotification(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setErrors({});
    navigate("/garments");
  };

  return (
    <section className="edit-garment-page">
      <PagePath items={[{ label: "Garments", to: "/garments" }, { label: "Edit Garment" }]} />

      {notification && (
        <div className={`edit-garment-notice ${notification.type === "success" ? "success" : "info"}`}>
          {notification.message}
        </div>
      )}

      <div className="edit-garment-card">
        <div className="edit-garment-card-header">
          <span className="edit-garment-card-icon"><IconGarment /></span>
          <div>
            <h2>Garment Details</h2>
            <p>Update the garment information below.</p>
          </div>
        </div>

        <div className="edit-garment-card-body">
          <div className="edit-garment-field">
            <label htmlFor="branchName">Branch Name</label>
            <input
              id="branchName"
              name="branchName"
              value={form.branchName}
              onChange={handleChange}
              className={errors.branchName ? "error" : ""}
            />
            {errors.branchName && <span className="edit-garment-error">{errors.branchName}</span>}
          </div>

          <div className="edit-garment-grid-two">
            <div className="edit-garment-field">
              <label htmlFor="garmentId">
                Garment ID <span className="edit-garment-inline-icon"><IconInfo /></span>
              </label>
              <input id="garmentId" value={form.garmentId} disabled className="disabled" />
              <span className="edit-garment-hint">Fixed system identifier</span>
            </div>

            <div className="edit-garment-field">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className={errors.phoneNumber ? "error" : ""}
              />
              {errors.phoneNumber && <span className="edit-garment-error">{errors.phoneNumber}</span>}
            </div>
          </div>

          <div className="edit-garment-field">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              className={errors.address ? "error" : ""}
            />
            {errors.address && <span className="edit-garment-error">{errors.address}</span>}
          </div>

          <div className="edit-garment-location-heading">
            <span><IconMapPin /></span>
            <div>
              <h3>Location Coordinates</h3>
              <p>Optional - GPS coordinates for map pinning.</p>
            </div>
          </div>

          <div className="edit-garment-grid-two">
            <div className="edit-garment-field">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                className={errors.latitude ? "error" : ""}
              />
              {errors.latitude && <span className="edit-garment-error">{errors.latitude}</span>}
            </div>

            <div className="edit-garment-field">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                className={errors.longitude ? "error" : ""}
              />
              {errors.longitude && <span className="edit-garment-error">{errors.longitude}</span>}
            </div>
          </div>
        </div>

        <div className="edit-garment-actions">
          <button type="button" className="btn-secondary" onClick={handleCancel} disabled={isSubmitting}>Cancel</button>
          <button type="button" className="btn-primary" onClick={handleUpdate} disabled={isSubmitting}>
            <IconEdit />
            {isSubmitting ? "Updating..." : "Update Garment"}
          </button>
        </div>
      </div>

      <AppFooter />
    </section>
  );
}
