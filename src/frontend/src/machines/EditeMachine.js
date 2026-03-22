import React, { useState } from "react";

const styles = {
  overlay: {
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 16px",
    fontFamily: "'Segoe UI', 'DM Sans', sans-serif",
  },
  wrapper: {
    width: "100%",
    maxWidth: "620px",
  },
  pageTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "28px 28px 24px",
  },

  /* Section Header */
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "14.5px",
    fontWeight: "600",
    color: "#111827",
  },

  /* Row */
  row: {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
  },

  /* Field */
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flex: 1,
    marginBottom: "16px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
  },
  hint: {
    fontSize: "11.5px",
    color: "#9ca3af",
    marginTop: "3px",
  },
  input: {
    padding: "9px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "7px",
    fontSize: "13.5px",
    color: "#111827",
    backgroundColor: "#ffffff",
    outline: "none",
    width: "100%",
    fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  inputDisabled: {
    backgroundColor: "#f9fafb",
    color: "#9ca3af",
    cursor: "not-allowed",
  },
  select: {
    padding: "9px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "7px",
    fontSize: "13.5px",
    color: "#111827",
    backgroundColor: "#ffffff",
    outline: "none",
    width: "100%",
    fontFamily: "inherit",
    cursor: "pointer",
    appearance: "auto",
  },

  /* Divider */
  divider: {
    height: "1px",
    backgroundColor: "#f3f4f6",
    margin: "4px 0 22px",
  },

  /* Buttons */
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "24px",
  },
  cancelBtn: {
    padding: "9px 22px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    color: "#374151",
    fontWeight: "500",
    fontSize: "13.5px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  updateBtn: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "13.5px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
};

const machineTypes = [
  "Single Needle",
  "Double Needle",
  "Overlock",
  "Flatlock",
  "Button Hole",
  "Bar Tack",
];

function MachineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#2563eb">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function EditMachine() {
  const [machine, setMachine] = useState({
    machineId: "MC-9042",
    type: "Single Needle",
    model: "JUKI-DDL-8700",
    location: "ST010",
    addedDate: "2024-10-24",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMachine((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated machine:", machine);
    alert("Machine updated successfully!");
  };

  const handleCancel = () => {
    alert("Cancelled.");
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.wrapper}>
        <h1 style={styles.pageTitle}>Edit Machine</h1>

        <div style={styles.card}>
          {/* ── Machine Details ── */}
          <div style={styles.sectionHeader}>
            <MachineIcon />
            <span style={styles.sectionTitle}>Machine Details</span>
          </div>

          {/* Machine ID + Type */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Machine ID</label>
              <input
                style={{ ...styles.input, ...styles.inputDisabled }}
                type="text"
                name="machineId"
                value={machine.machineId}
                disabled
              />
              <span style={styles.hint}>System generated unique ID</span>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Type</label>
              <select
                style={styles.select}
                name="type"
                value={machine.type}
                onChange={handleChange}
              >
                {machineTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Model / Serial Number */}
          <div style={{ ...styles.field, marginBottom: "8px" }}>
            <label style={styles.label}>Model / Serial Number</label>
            <input
              style={styles.input}
              type="text"
              name="model"
              value={machine.model}
              onChange={handleChange}
            />
          </div>

          {/* Divider */}
          <div style={styles.divider} />

          {/* ── Location & Tracking ── */}
          <div style={styles.sectionHeader}>
            <LocationIcon />
            <span style={styles.sectionTitle}>Location & Tracking</span>
          </div>

          {/* Location + Added Date */}
          <div style={{ ...styles.row, marginBottom: "0" }}>
            <div style={styles.field}>
              <label style={styles.label}>Location</label>
              <input
                style={styles.input}
                type="text"
                name="location"
                value={machine.location}
                onChange={handleChange}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Added Date</label>
              <input
                style={{ ...styles.input, ...styles.inputDisabled }}
                type="date"
                name="addedDate"
                value={machine.addedDate}
                disabled
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={styles.buttons}>
            <button style={styles.cancelBtn} type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button style={styles.updateBtn} type="button" onClick={handleSubmit}>
              <CheckIcon />
              Update Machine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditMachine;
