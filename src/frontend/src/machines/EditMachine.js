import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PagePath from "../components/PagePath";
import { useToast } from "../components/Toast";
import "./MachineShared.css";

const machineTypes = [
  "Single Needle",
  "Double Needle",
  "Overlock",
  "Flatlock",
  "Button Hole",
  "Bar Tack",
];

function IconMachine() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="10" rx="2" />
      <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
      <path d="M8 13h2" />
      <path d="M14 13h2" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function EditMachine() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id } = useParams();

  const [machine, setMachine] = useState({
    machineId: "",
    type: "",
    brand: "",
    model: "",
    serialNumber: "",
    location: "",
    date: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // 🔹 FETCH MACHINE BY ID
  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:8080/api/machines/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Failed to load machine (${response.status})`);

        const data = await response.json();
        setMachine(data);

      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMachine();
  }, [id]);

  const validate = () => {
    const nextErrors = {};

    if (!machine.type.trim()) nextErrors.type = "Machine type is required.";
    if (!machine.brand.trim()) nextErrors.brand = "Brand is required.";
    if (!machine.model.trim()) nextErrors.model = "Model is required.";
    if (!machine.serialNumber.trim()) nextErrors.serialNumber = "Serial number is required.";
    if (!machine.location.trim()) nextErrors.location = "Location is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMachine((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // 🔹 UPDATE MACHINE
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:8080/api/machines/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(machine),
      });

      if (!response.ok) throw new Error(`Update failed (${response.status})`);

      showToast("Machine updated successfully!", "success");

      setTimeout(() => {
        navigate("/machines");
      }, 1000);

    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleCancel = () => {
    navigate("/machines");
  };

  // 🔹 LOADING STATE
  if (loading) {
    return (
      <section className="edit-machine-page">
        <PagePath items={[{ label: "Machines", to: "/machines" }, { label: "Edit Machine" }]} />
        <div className="edit-machine-card">Loading machine...</div>
      </section>
    );
  }

  return (
    <section className="edit-machine-page">
      <PagePath items={[{ label: "Machines", to: "/machines" }, { label: "Edit Machine" }]} />

      <form className="edit-machine-card" onSubmit={handleSubmit}>
        <div className="edit-machine-card-header">
          <span className="edit-machine-card-icon"><IconMachine /></span>
          <div>
            <h2>Machine Details</h2>
          </div>
        </div>

        <div className="edit-machine-card-body">
          <div className="edit-machine-grid-two">
            <div className="edit-machine-field">
              <label htmlFor="machineId">Machine ID</label>
              <input
                id="machineId"
                name="machineId"
                value={machine.machineId}
                disabled
                className="disabled"
              />
            </div>

            <div className="edit-machine-field">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={machine.type}
                onChange={handleChange}
                className={errors.type ? "error" : ""}
              >
                {machineTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.type && <span className="edit-machine-error">{errors.type}</span>}
            </div>
          </div>

          <div className="edit-machine-grid-two">
            <div className="edit-machine-field">
              <label htmlFor="brand">Brand</label>
              <input
                id="brand"
                name="brand"
                value={machine.brand}
                onChange={handleChange}
                className={errors.brand ? "error" : ""}
              />
              {errors.brand && <span className="edit-machine-error">{errors.brand}</span>}
            </div>

            <div className="edit-machine-field">
              <label htmlFor="model">Model</label>
              <input
                id="model"
                name="model"
                value={machine.model}
                onChange={handleChange}
                className={errors.model ? "error" : ""}
              />
              {errors.model && <span className="edit-machine-error">{errors.model}</span>}
            </div>
          </div>

          <div className="edit-machine-field">
            <label htmlFor="serialNumber">Serial Number</label>
            <input
              id="serialNumber"
              name="serialNumber"
              value={machine.serialNumber}
              onChange={handleChange}
              className={errors.serialNumber ? "error" : ""}
            />
            {errors.serialNumber && <span className="edit-machine-error">{errors.serialNumber}</span>}
          </div>

          <div className="edit-machine-location-heading">
            <span><IconMapPin /></span>
            <div>
              <h3>Location & Tracking</h3>
            </div>
          </div>

          <div className="edit-machine-grid-two">
            <div className="edit-machine-field">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                value={machine.location}
                onChange={handleChange}
                className={errors.location ? "error" : ""}
              />
              {errors.location && <span className="edit-machine-error">{errors.location}</span>}
            </div>

            <div className="edit-machine-field">
              <label htmlFor="date">Added Date</label>
              <input
                id="date"
                name="date"
                value={machine.date}
                disabled
                className="disabled"
              />
            </div>
          </div>
        </div>

        <div className="edit-machine-actions">
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <IconEdit />
            Update Machine
          </button>
        </div>
      </form>

      <AppFooter />
    </section>
  );
}

export default EditMachine;