import { useState } from "react";
import { useNavigate } from "react-router-dom";
function IconMapPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function IconChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

const NAV_ROUTES = {
  "Dashboard": "/dashboard",
  "Users": "/users",
  "Machines": "/machines",
  "Stores": "/stores/add",
  "Garments": "/garments",
  "Approved Requests": "/approved-requests",
};

const EMPTY_FORM = () => ({
  storeName: "",
  storeId: "",
  phoneNumber: "",
  address: "",
  latitude: "",
  longitude: "",
});

export default function AddNewStore() {
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM());
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const validate = () => {
    const e = {};
    if (!form.storeName.trim()) e.storeName = "Store name is required.";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Phone number is required.";
    else if (!/^\d{10}$/.test(form.phoneNumber.trim())) e.phoneNumber = "Phone number must be exactly 10 digits.";
    if (!form.address.trim()) e.address = "Address is required.";
    if (form.latitude !== "" && (isNaN(form.latitude) || Number(form.latitude) < -90 || Number(form.latitude) > 90))
      e.latitude = "Latitude must be between -90 and 90.";
    if (form.longitude !== "" && (isNaN(form.longitude) || Number(form.longitude) < -180 || Number(form.longitude) > 180))
      e.longitude = "Longitude must be between -180 and 180.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = () => {
    if (validate()) {
      showNotification("Store added successfully!", "success");
      setForm(EMPTY_FORM());
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM());
    setErrors({});
    showNotification("Form cleared.", "info");
  };

  return (
    <div style={styles.content}>
      <div style={styles.breadcrumb}>
        <span style={styles.breadcrumbLink} onClick={() => navigate("/stores/add")}>Stores</span>
        <IconChevron />
        <span style={styles.breadcrumbCurrent}>Add New Store</span>
      </div>

      <h1 style={styles.pageTitle}>Add New Store</h1>

      {notification && (
        <div style={{ ...styles.notice, background: notification.type === "success" ? "#065f46" : "#1230a8" }}>
          {notification.message}
        </div>
      )}

      <form onSubmit={(event) => { event.preventDefault(); handleSubmit(); }} style={styles.form}>
        <h2 style={styles.sectionTitle}>Store Details</h2>

        <div style={styles.formGroup}>
          <label style={styles.label}>Store Name</label>
          <input
            name="storeName"
            value={form.storeName}
            onChange={handleChange}
            placeholder="Enter store name"
            style={{ ...styles.input, borderColor: errors.storeName ? "#ef4444" : "#e2e8f0" }}
          />
          {errors.storeName && <span style={styles.errorText}>{errors.storeName}</span>}
        </div>

        <div style={styles.twoColumnRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Store ID</label>
            <input
              name="storeId"
              value={form.storeId}
              onChange={handleChange}
              placeholder="Enter store ID"
              style={{ ...styles.input, borderColor: errors.storeId ? "#ef4444" : "#e2e8f0" }}
            />
            {errors.storeId && <span style={styles.errorText}>{errors.storeId}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              maxLength={10}
              placeholder="Enter phone number"
              style={{ ...styles.input, borderColor: errors.phoneNumber ? "#ef4444" : "#e2e8f0" }}
            />
            {errors.phoneNumber && <span style={styles.errorText}>{errors.phoneNumber}</span>}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            placeholder="Enter store address"
            style={{ ...styles.textarea, borderColor: errors.address ? "#ef4444" : "#e2e8f0" }}
          />
          {errors.address && <span style={styles.errorText}>{errors.address}</span>}
        </div>

        <h2 style={{ ...styles.sectionTitle, marginTop: "30px" }}>Location Coordinates</h2>
        <p style={styles.sectionHint}>Optional. Enter GPS coordinates for map pinning.</p>

        <div style={styles.twoColumnRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Latitude</label>
            <input
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              type="number"
              placeholder="e.g. 6.9271"
              style={{ ...styles.input, borderColor: errors.latitude ? "#ef4444" : "#e2e8f0" }}
            />
            {errors.latitude && <span style={styles.errorText}>{errors.latitude}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Longitude</label>
            <input
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              type="number"
              placeholder="e.g. 79.8612"
              style={{ ...styles.input, borderColor: errors.longitude ? "#ef4444" : "#e2e8f0" }}
            />
            {errors.longitude && <span style={styles.errorText}>{errors.longitude}</span>}
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button type="button" style={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" style={styles.submitButton}>
            <IconPlus /> Add Store
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  content: {
    padding: "6px 8px",
    flex: 1
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "8px"
  },
  breadcrumbLink: {
    cursor: "pointer",
    color: "#2563eb",
    fontWeight: 500
  },
  breadcrumbCurrent: {
    color: "#0f172a"
  },
  pageTitle: {
    fontSize: "2rem",
    margin: "0 0 30px 0",
    color: "#0f172a",
    fontWeight: 600
  },
  notice: {
    marginBottom: "20px",
    padding: "13px 20px",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 600,
    boxShadow: "0 8px 28px rgba(0,0,0,.18)"
  },
  form: {
    background: "white",
    padding: "35px",
    borderRadius: "12px",
    maxWidth: "550px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
  },
  sectionTitle: {
    fontSize: "1.25rem",
    margin: "0 0 25px 0",
    color: "#1e293b",
    fontWeight: 600
  },
  sectionHint: {
    margin: "-16px 0 20px 0",
    color: "#64748b",
    fontSize: "0.92rem"
  },
  formGroup: {
    marginBottom: "20px"
  },
  twoColumnRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 500,
    color: "#334155",
    fontSize: "0.95rem"
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box"
  },
  textarea: {
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box"
  },
  errorText: {
    fontSize: "11px",
    color: "#ef4444",
    marginTop: "3px",
    display: "block"
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    marginTop: "30px"
  },
  submitButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "14px 30px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 500,
    flex: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  cancelButton: {
    background: "white",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    padding: "14px 30px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 500,
    flex: 1
  }
};