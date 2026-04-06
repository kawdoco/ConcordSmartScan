import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PagePath from "../components/PagePath";
import "./MachineShared.css";
import axios from "axios";

function IconMachine() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="8" width="18" height="10" rx="2" />
      <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
      <path d="M8 13h2" />
      <path d="M14 13h2" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

const EMPTY_MACHINE = {
  type: "",
  brand: "",
  model: "",
  serialNumber: "",
  location: "",
  date: "",
};

function AddMachine() {
  const navigate = useNavigate();
  const [machine, setMachine] = useState(EMPTY_MACHINE);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const validate = () => {
    const nextErrors = {};
    if (!machine.type.trim()) nextErrors.type = "Machine type is required.";
    if (!machine.brand.trim()) nextErrors.brand = "Brand is required.";
    if (!machine.model.trim()) nextErrors.model = "Model is required.";
    if (!machine.serialNumber.trim())
      nextErrors.serialNumber = "Serial number is required.";
    if (!machine.location.trim()) nextErrors.location = "Location is required.";
    if (!machine.date) nextErrors.date = "Added date is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMachine((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8080/api/machines",
        machine, // send data
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response.data); // optional

      showNotification("Machine added successfully!", "success");

      setMachine(EMPTY_MACHINE);
      setErrors({});

      setTimeout(() => navigate("/machines"), 1200);
    } catch (err) {
      console.error(err);

      const message = err.response?.data?.message || "Error adding machine";

      showNotification(message, "error");
    } finally {
      setSubmitting(false);
    }
  };
  const handleCancel = () => {
    setMachine(EMPTY_MACHINE);
    setErrors({});
    navigate("/machines");
  };

  return (
    <section className="add-machine-page">
      <PagePath
        items={[
          { label: "Machines", to: "/machines" },
          { label: "Add Machine" },
        ]}
      />

      {notification && (
        <div className={`add-machine-notice ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <form className="add-machine-card" onSubmit={submit} noValidate>
        <div className="add-machine-card-header">
          <span className="add-machine-card-icon">
            <IconMachine />
          </span>
          <div>
            <h2>Machine Details</h2>
          </div>
        </div>

        <div className="add-machine-card-body">
          <div className="add-machine-grid-two">
            <div className="add-machine-field">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={machine.type}
                onChange={handleChange}
                className={errors.type ? "error" : ""}
              >
                <option value="">Select Machine Type</option>
                <option value="Single Needle Lockstitch">
                  Single Needle Lockstitch
                </option>
                <option value="Double Needle Lockstitch">
                  Double Needle Lockstitch
                </option>
                <option value="Overlock">Overlock</option>
                <option value="Flatlock">Flatlock</option>
                <option value="Button Hole">Button Hole</option>
                <option value="Bar Tack">Bar Tack</option>
              </select>
              {errors.type && (
                <span className="add-machine-error">{errors.type}</span>
              )}
            </div>

            <div className="add-machine-field">
              <label htmlFor="brand">Brand</label>
              <input
                id="brand"
                name="brand"
                value={machine.brand}
                onChange={handleChange}
                placeholder="e.g. JUKI"
                className={errors.brand ? "error" : ""}
              />
              {errors.brand && (
                <span className="add-machine-error">{errors.brand}</span>
              )}
            </div>
          </div>

          <div className="add-machine-grid-two">
            <div className="add-machine-field">
              <label htmlFor="model">Model</label>
              <input
                id="model"
                name="model"
                value={machine.model}
                onChange={handleChange}
                placeholder="e.g. DDL-8700"
                className={errors.model ? "error" : ""}
              />
              {errors.model && (
                <span className="add-machine-error">{errors.model}</span>
              )}
            </div>

            <div className="add-machine-field">
              <label htmlFor="serialNumber">Serial Number</label>
              <input
                id="serialNumber"
                name="serialNumber"
                value={machine.serialNumber}
                onChange={handleChange}
                placeholder="e.g. SN12345678"
                className={errors.serialNumber ? "error" : ""}
              />
              {errors.serialNumber && (
                <span className="add-machine-error">{errors.serialNumber}</span>
              )}
            </div>
          </div>

          <div className="add-machine-location-heading">
            <span>
              <IconMapPin />
            </span>
            <h3>Location &amp; Tracking</h3>
          </div>

          <div className="add-machine-grid-two">
            <div className="add-machine-field">
              <label htmlFor="location">Location (Garment ID)</label>
              <input
                id="location"
                name="location"
                value={machine.location}
                onChange={handleChange}
                placeholder="e.g., GAR-001"
                className={errors.location ? "error" : ""}
              />
              {errors.location && (
                <span className="add-machine-error">{errors.location}</span>
              )}
            </div>

            <div className="add-machine-field">
              <label htmlFor="date">Added Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={machine.date}
                onChange={handleChange}
                className={errors.date ? "error" : ""}
              />
              {errors.date && (
                <span className="add-machine-error">{errors.date}</span>
              )}
            </div>
          </div>
        </div>

        <div className="add-machine-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            <IconPlus />
            {submitting ? "Adding..." : "Add Machine"}
          </button>
        </div>
      </form>

      <AppFooter />
    </section>
  );
}

export default AddMachine;
