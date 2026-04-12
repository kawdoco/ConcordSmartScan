import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PagePath from "../components/PagePath";
import MapSelector from "../components/MapSelector";
import { useToast } from "../components/Toast";
import { createGarment } from "../services/locationService";
import "./AddGarment.css";

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

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

const EMPTY_FORM = {
  branchName: "",
  phoneNumber: "",
  address: "",
  latitude: "",
  longitude: ""
};

export default function AddGarment() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!form.branchName.trim()) nextErrors.branchName = "Branch name is required.";
    if (!form.phoneNumber.trim()) nextErrors.phoneNumber = "Phone number is required.";
    if (!form.address.trim()) nextErrors.address = "Address is required.";

    if (!form.latitude.trim()) nextErrors.latitude = "Latitude is required.";
    else if (isNaN(form.latitude) || Number(form.latitude) < -90 || Number(form.latitude) > 90) {
      nextErrors.latitude = "Latitude must be between -90 and 90.";
    }

    if (!form.longitude.trim()) nextErrors.longitude = "Longitude is required.";
    else if (isNaN(form.longitude) || Number(form.longitude) < -180 || Number(form.longitude) > 180) {
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

  const handleLocationSelect = (latitude, longitude) => {
    setForm((previous) => ({
      ...previous,
      latitude: latitude.toFixed(6),
      longitude: longitude.toFixed(6)
    }));
    setErrors((previous) => ({ ...previous, latitude: "", longitude: "" }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        name: form.branchName.trim(),
        contactInfo: form.phoneNumber.trim(),
        address: form.address.trim(),
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      };

      await createGarment(payload);
      showToast("Garment added successfully!", "success");

      setTimeout(() => {
        navigate("/garments");
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to add garment. Please try again.";
      showToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    navigate("/garments");
  };

  return (
    <section className="add-garment-page">
      <PagePath items={[{ label: "Garments", to: "/garments" }, { label: "Add Garment" }]} />

      <div className="add-garment-card">
        <div className="add-garment-card-header">
          <span className="add-garment-card-icon"><IconGarment /></span>
          <div>
            <h2>Garment Details</h2>
            <p>Fill in the details to register a new garment location.</p>
          </div>
        </div>

        <div className="add-garment-card-body">
          <div className="add-garment-field">
            <label htmlFor="branchName">Branch Name</label>
            <input
              id="branchName"
              name="branchName"
              value={form.branchName}
              onChange={handleChange}
              placeholder="Enter branch name"
              className={errors.branchName ? "error" : ""}
            />
            {errors.branchName && <span className="add-garment-error">{errors.branchName}</span>}
          </div>

          <div className="add-garment-field">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="e.g. +94 11 234 5678"
              className={errors.phoneNumber ? "error" : ""}
            />
            {errors.phoneNumber && <span className="add-garment-error">{errors.phoneNumber}</span>}
          </div>

          <div className="add-garment-field">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              placeholder="Enter garment address"
              className={errors.address ? "error" : ""}
            />
            {errors.address && <span className="add-garment-error">{errors.address}</span>}
          </div>

          <div className="add-garment-location-heading">
            <span><IconMapPin /></span>
            <div>
              <h3>Location Coordinates</h3>
              <p>Required - GPS coordinates for map pinning.</p>
            </div>
          </div>

          <div className="add-garment-grid-two">
            <div className="add-garment-field">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="e.g. 6.9271"
                className={errors.latitude ? "error" : ""}
              />
              {errors.latitude && <span className="add-garment-error">{errors.latitude}</span>}
            </div>

            <div className="add-garment-field">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="e.g. 79.8612"
                className={errors.longitude ? "error" : ""}
              />
              {errors.longitude && <span className="add-garment-error">{errors.longitude}</span>}
            </div>
          </div>

          <div className="add-garment-field">
            <label>Location Map</label>
            <p className="add-garment-help-text">Click on the map to select the garment location. The coordinates will be automatically filled above.</p>
            <MapSelector
              latitude={form.latitude ? parseFloat(form.latitude) : null}
              longitude={form.longitude ? parseFloat(form.longitude) : null}
              onLocationSelect={handleLocationSelect}
            />
          </div>
        </div>

        <div className="add-garment-actions">
          <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
          <button type="button" className="btn-primary" onClick={handleSubmit}>
            <IconPlus />
            Add Garment
          </button>
        </div>
      </div>

      <AppFooter />
    </section>
  );
}
