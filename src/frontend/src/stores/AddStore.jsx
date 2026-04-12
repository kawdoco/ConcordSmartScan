import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PagePath from "../components/PagePath";
import MapSelector from "../components/MapSelector";
import { useToast } from "../components/Toast";
import { createStore } from "../services/locationService";
import "./AddStore.css";

function IconStores() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
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
  storeName: "",
  phoneNumber: "",
  address: "",
  latitude: "",
  longitude: ""
};

export default function AddStore() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!form.storeName.trim()) nextErrors.storeName = "Store name is required.";
    if (!form.phoneNumber.trim()) nextErrors.phoneNumber = "Phone number is required.";
    else if (!/^\d{10}$/.test(form.phoneNumber.trim())) nextErrors.phoneNumber = "Phone number must be exactly 10 digits.";
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
        name: form.storeName.trim(),
        contactInfo: form.phoneNumber.trim(),
        address: form.address.trim(),
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      };

      await createStore(payload);
      showToast("Store added successfully!", "success");
      
      // Redirect after a short delay to show the success message
      setTimeout(() => {
        navigate('/stores');
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to add store. Please try again.";
      showToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    navigate('/stores');
  };

  return (
    <section className="add-store-page">
      <PagePath items={[{ label: "Stores", to: "/stores" }, { label: "Add Store" }]} />

      <div className="add-store-card">
        <div className="add-store-card-header">
          <span className="add-store-card-icon"><IconStores /></span>
          <div>
            <h2>Store Details</h2>
            <p>Fill in the details to register a new store.</p>
          </div>
        </div>

        <div className="add-store-card-body">
          <div className="add-store-field">
            <label htmlFor="storeName">Store Name</label>
            <input
              id="storeName"
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
              placeholder="Enter store name"
              className={errors.storeName ? "error" : ""}
            />
            {errors.storeName && <span className="add-store-error">{errors.storeName}</span>}
          </div>

          <div className="add-store-field">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              maxLength={10}
              placeholder="Enter phone number"
              className={errors.phoneNumber ? "error" : ""}
            />
            {errors.phoneNumber && <span className="add-store-error">{errors.phoneNumber}</span>}
          </div>

          <div className="add-store-field">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              placeholder="Enter store address"
              className={errors.address ? "error" : ""}
            />
            {errors.address && <span className="add-store-error">{errors.address}</span>}
          </div>

          <div className="add-store-location-heading">
            <span><IconMapPin /></span>
            <div>
              <h3>Location Coordinates</h3>
              <p>Required - GPS coordinates for map pinning.</p>
            </div>
          </div>

          <div className="add-store-grid-two">
            <div className="add-store-field">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="e.g. 6.9271"
                className={errors.latitude ? "error" : ""}
              />
              {errors.latitude && <span className="add-store-error">{errors.latitude}</span>}
            </div>

            <div className="add-store-field">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="e.g. 79.8612"
                className={errors.longitude ? "error" : ""}
              />
              {errors.longitude && <span className="add-store-error">{errors.longitude}</span>}
            </div>
          </div>

          <div className="add-store-field">
            <label>Location Map</label>
            <p className="add-store-help-text">Click on the map to select the store location. The coordinates will be automatically filled above.</p>
            <MapSelector
              latitude={form.latitude ? parseFloat(form.latitude) : null}
              longitude={form.longitude ? parseFloat(form.longitude) : null}
              onLocationSelect={handleLocationSelect}
            />
          </div>
        </div>

        <div className="add-store-actions">
          <button type="button" className="btn-secondary" onClick={handleCancel} disabled={isSubmitting}>Cancel</button>
          <button type="button" className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            <IconPlus />
            {isSubmitting ? "Adding..." : "Add Store"}
          </button>
        </div>
      </div>

      <AppFooter />
    </section>
  );
}
