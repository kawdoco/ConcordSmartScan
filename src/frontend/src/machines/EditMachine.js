import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PagePath from "../components/PagePath";
import { useToast } from "../components/Toast";
import GenericLookupInput from "../components/GenericLookupInput";
import ConfirmActionModal from "../components/ConfirmActionModal";
import { getMachineDisplayId } from "./machineId";
import "./MachineShared.css";

const buildLocationDisplayId = (location) => {
  const parsed = Number(location?.locationId);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return "";
  }

  const prefix = location?.type === "STORE" ? "STO" : "GAR";
  return `${prefix}-${String(parsed).padStart(3, "0")}`;
};

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
  const [submitting, setSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
  const handleSubmit = async () => {
    if (!validate()) return;
    setIsConfirmOpen(false);

    try {
      setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenConfirm = (event) => {
    event.preventDefault();
    if (!validate()) return;
    setIsConfirmOpen(true);
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

      <form className="edit-machine-card" onSubmit={handleOpenConfirm}>
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
                value={getMachineDisplayId(machine)}
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
              <GenericLookupInput
                id="location"
                name="location"
                label="Location"
                value={machine.location}
                onChange={handleChange}
                error={errors.location}
                  placeholder="e.g., GAR-001 or STO-002"
                className="edit-machine-field"
                  endpoint="/locations"
                searchFields={[
                    (location) => buildLocationDisplayId(location),
                    "locationId",
                    "name",
                    "type"
                ]}
                  sortComparator={(a, b) => Number(a.locationId) - Number(b.locationId)}
                  getOptionKey={(location) => `${location.type}-${location.locationId}`}
                  getOptionValue={(location) => buildLocationDisplayId(location)}
                  getPrimaryText={(location) => buildLocationDisplayId(location)}
                  getSecondaryText={(location) => `${location.name || "-"} | ${location.type || "-"}`}
                  emptyMessage="No locations found"
                  loadingMessage="Loading locations..."
              />
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
          <button type="submit" className="btn-primary" disabled={submitting}>
            <IconEdit />
            {submitting ? "Updating..." : "Update Machine"}
          </button>
        </div>
      </form>

      <ConfirmActionModal
        isOpen={isConfirmOpen}
        title="Confirm Update"
        message="Are you sure you want to update this machine?"
        confirmLabel="Yes, Update"
        cancelLabel="Cancel"
        variant="approve"
        isSubmitting={submitting}
        onConfirm={handleSubmit}
        onCancel={() => setIsConfirmOpen(false)}
      />

      <AppFooter />
    </section>
  );
}

export default EditMachine;