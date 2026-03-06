// pages/AddMachine.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function AddMachine() {
  const navigate = useNavigate();
  
  const [machine, setMachine] = useState({
    machineId: "MC-9042",
    type: "",
    model: "",
    location: "",
    date: "2024-10-24"
  });

  const handleChange = (e) => {
    setMachine({ ...machine, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    alert("Machine Added Successfully!");
    navigate("/");
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      
      <div style={styles.mainArea}>
        <Topbar />
        
        <div style={styles.content}>
          <h1 style={styles.pageTitle}>Add Machine</h1>
          
          <form onSubmit={submit} style={styles.form}>
            <h2 style={styles.sectionTitle}>Machine Details</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Machine ID</label>
              <input
                name="machineId"
                value={machine.machineId}
                onChange={handleChange}
                style={styles.input}
                placeholder="MC-9042"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Type</label>
              <select 
                name="type" 
                onChange={handleChange} 
                value={machine.type}
                style={styles.select}
              >
                <option value="">Select Machine Type</option>
                <option value="Lockstitch">Lockstitch</option>
                <option value="Overlock">Overlock</option>
                <option value="Button Hole">Button Hole</option>
                <option value="Flatlock">Flatlock</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Model / Serial Number</label>
              <input
                name="model"
                placeholder="e.g. JUKO-DDL-8700 / SN12345678"
                onChange={handleChange}
                value={machine.model}
                style={styles.input}
              />
            </div>

            <h2 style={{...styles.sectionTitle, marginTop: "30px"}}>Location & Tracking</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Location</label>
              <input
                name="location"
                placeholder="e.g. ST010 or GR005"
                onChange={handleChange}
                value={machine.location}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Added Date</label>
              <input
                type="date"
                name="date"
                onChange={handleChange}
                value={machine.date}
                style={styles.input}
              />
            </div>

            <div style={styles.buttonGroup}>
              <button type="button" style={styles.cancelButton} onClick={() => navigate("/")}>
                Cancel
              </button>
              <button type="submit" style={styles.submitButton}>
                Add Machine
              </button>
            </div>
          </form>
        </div>

        <footer style={styles.footer}>
          <p style={styles.footerText}>© 2024 Concord Apparel Pvt Ltd. Machine Replacement Location System.</p>
          <div style={styles.footerLinks}>
            <a href="#" style={styles.footerLink}>Privacy Policy</a>
            <span style={styles.separator}>|</span>
            <a href="#" style={styles.footerLink}>System Manual</a>
            <span style={styles.separator}>|</span>
            <a href="#" style={styles.footerLink}>Technical Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh"
  },
  mainArea: {
    marginLeft: "250px",
    width: "calc(100% - 250px)",
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  },
  content: {
    padding: "30px 40px",
    flex: 1
  },
  pageTitle: {
    fontSize: "2rem",
    margin: "0 0 30px 0",
    color: "#0f172a",
    fontWeight: "600"
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
    fontWeight: "600"
  },
  formGroup: {
    marginBottom: "20px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
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
    boxSizing: "border-box",
    ':focus': {
      borderColor: "#2563eb"
    }
  },
  select: {
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.95rem",
    background: "white",
    outline: "none",
    cursor: "pointer"
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
    fontWeight: "500",
    flex: 1,
    transition: "background 0.2s",
    ':hover': {
      background: "#1d4ed8"
    }
  },
  cancelButton: {
    background: "white",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    padding: "14px 30px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    flex: 1,
    transition: "all 0.2s",
    ':hover': {
      background: "#f8fafc",
      borderColor: "#cbd5e1"
    }
  },
  footer: {
    background: "white",
    padding: "25px 40px",
    borderTop: "1px solid #e5e7eb",
    textAlign: "center"
  },
  footerText: {
    margin: "0 0 12px 0",
    color: "#64748b",
    fontSize: "0.95rem"
  },
  footerLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "15px"
  },
  footerLink: {
    color: "#2563eb",
    textDecoration: "none",
    fontSize: "0.95rem",
    ':hover': {
      textDecoration: "underline"
    }
  },
  separator: {
    color: "#cbd5e1"
  }
};

export default AddMachine;