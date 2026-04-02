import { useState } from "react";

const EMPTY_ADD = {
  garmentName: "",
  garmentId: "GR012",
  phoneNumber: "",
  address: "",
  latitude: "",
  longitude: ""
};

const EMPTY_EDIT = {
  garmentName: "Concord - Colombo",
  garmentId: "GR012",
  phoneNumber: "0771234567",
  address: "",
  latitude: "",
  longitude: ""
};

function GarmentForm({ title, subtitle, form, setForm, buttonLabel }) {
  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form style={styles.formCard}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <p style={styles.sectionSubtitle}>{subtitle}</p>

      <div style={styles.formGroup}>
        <label style={styles.label}>Garment Name</label>
        <input
          name="garmentName"
          value={form.garmentName}
          onChange={onChange}
          placeholder="Enter garment name"
          style={styles.input}
        />
      </div>

      <div style={styles.twoCol}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Garment ID</label>
          <input
            name="garmentId"
            value={form.garmentId}
            onChange={onChange}
            placeholder="GR012"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Phone Number</label>
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={onChange}
            placeholder="e.g. 0771234567"
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Address</label>
        <textarea
          name="address"
          value={form.address}
          onChange={onChange}
          placeholder="Enter full manufacturing unit address"
          rows={4}
          style={styles.textarea}
        />
      </div>

      <h3 style={styles.subSectionTitle}>Location Coordinates</h3>
      <div style={styles.twoCol}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Latitude</label>
          <input
            name="latitude"
            value={form.latitude}
            onChange={onChange}
            placeholder="e.g. 6.9271"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Longitude</label>
          <input
            name="longitude"
            value={form.longitude}
            onChange={onChange}
            placeholder="e.g. 79.8612"
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.buttonRow}>
        <button type="button" style={styles.cancelBtn}>Cancel</button>
        <button type="button" style={styles.primaryBtn}>{buttonLabel}</button>
      </div>
    </form>
  );
}

export default function GarmentPages() {
  const [tab, setTab] = useState("add");
  const [addForm, setAddForm] = useState(EMPTY_ADD);
  const [editForm, setEditForm] = useState(EMPTY_EDIT);

  return (
    <div style={styles.content}>
      <div style={styles.tabBar}>
        <button
          type="button"
          onClick={() => setTab("add")}
          style={{ ...styles.tabButton, ...(tab === "add" ? styles.tabButtonActive : {}) }}
        >
          Add Garment
        </button>
        <button
          type="button"
          onClick={() => setTab("edit")}
          style={{ ...styles.tabButton, ...(tab === "edit" ? styles.tabButtonActive : {}) }}
        >
          Edit Garment
        </button>
      </div>

      <div style={styles.breadcrumb}>Garments / {tab === "add" ? "Add New Garment" : "Edit Garment"}</div>
      <h1 style={styles.pageTitle}>{tab === "add" ? "Add New Garment" : "Edit Garment"}</h1>

      {tab === "add" ? (
        <GarmentForm
          title="Garment Details"
          subtitle="Fill in the details to register a new garment unit."
          form={addForm}
          setForm={setAddForm}
          buttonLabel="Add Garment"
        />
      ) : (
        <GarmentForm
          title="Garment Details"
          subtitle="Update garment information."
          form={editForm}
          setForm={setEditForm}
          buttonLabel="Update Garment"
        />
      )}
    </div>
  );
}

const styles = {
  content: {
    padding: "6px 8px",
    flex: 1
  },
  tabBar: {
    display: "flex",
    gap: "12px",
    background: "#1e3a8a",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "18px"
  },
  tabButton: {
    border: "1px solid transparent",
    background: "transparent",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer"
  },
  tabButtonActive: {
    background: "#ffffff",
    color: "#1e293b",
    borderColor: "#d1d5db"
  },
  breadcrumb: {
    color: "#64748b",
    fontSize: "0.92rem",
    marginBottom: "6px"
  },
  pageTitle: {
    margin: "0 0 20px 0",
    color: "#0f172a",
    fontSize: "2rem",
    fontWeight: 600
  },
  formCard: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "12px",
    maxWidth: "980px",
    border: "1px solid #e2e8f0"
  },
  sectionTitle: {
    margin: 0,
    color: "#1e293b",
    fontSize: "1.45rem",
    fontWeight: 700
  },
  sectionSubtitle: {
    margin: "6px 0 18px 0",
    color: "#64748b",
    fontSize: "0.95rem"
  },
  subSectionTitle: {
    margin: "10px 0 14px 0",
    color: "#1e293b",
    fontSize: "1.15rem",
    fontWeight: 700
  },
  formGroup: {
    marginBottom: "16px"
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#334155",
    fontSize: "0.95rem",
    fontWeight: 600
  },
  input: {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box"
  },
  textarea: {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit"
  },
  buttonRow: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px"
  },
  cancelBtn: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#64748b",
    borderRadius: "8px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 600
  },
  primaryBtn: {
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: 600
  }
};
