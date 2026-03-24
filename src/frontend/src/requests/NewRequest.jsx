import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PagePath from "../components/PagePath";
import "./NewRequest.css";

function IconRequest() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
}

function IconFlow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h7" />
      <path d="M14 6h7" />
      <path d="M10 6l4 0" />
      <path d="M12 6v12" />
      <path d="M9 15l3 3 3-3" />
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
  requestType: "transfer",
  machineId: "",
  machineType: "",
  fromStoreId: "",
  toGarmentId: "",
  priority: "medium",
  reason: "",
  requiredDate: "",
  notes: ""
};

export default function NewRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  const isTransfer = form.requestType === "transfer";

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2500);
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.machineId.trim()) nextErrors.machineId = "Machine ID is required.";
    if (!form.machineType.trim()) nextErrors.machineType = "Machine type is required.";
    if (isTransfer && !form.fromStoreId.trim()) nextErrors.fromStoreId = "From Store ID is required for transfer requests.";
    if (!form.toGarmentId.trim()) nextErrors.toGarmentId = "To Garment ID is required.";
    if (!form.reason.trim()) nextErrors.reason = "Reason is required.";
    if (!form.requiredDate) nextErrors.requiredDate = "Required date is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => {
      const next = { ...previous, [name]: value };
      if (name === "requestType" && value === "purchase") {
        next.fromStoreId = "";
      }
      return next;
    });

    setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const successLabel = isTransfer ? "Transfer request created successfully!" : "Purchase request created successfully!";
    showNotification(successLabel, "success");

    setTimeout(() => {
      navigate(isTransfer ? "/requests/transfer" : "/requests/purchase");
    }, 1200);
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    navigate("/requests/approved");
  };

  return (
    <section className="new-request-page">
      <PagePath items={[{ label: "Requests", to: "/requests/approved" }, { label: "New Request" }]} />

      {notification && (
        <div className={`new-request-notice ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="new-request-card">
        <div className="new-request-card-header">
          <span className="new-request-card-icon"><IconRequest /></span>
          <div>
            <h2>Create Request</h2>
            <p>Fill in the details to submit a transfer or purchase request.</p>
          </div>
        </div>

        <div className="new-request-card-body">
          <div className="new-request-grid-two">
            <div className="new-request-field">
              <label htmlFor="requestType">Request Type</label>
              <select
                id="requestType"
                name="requestType"
                value={form.requestType}
                onChange={handleChange}
              >
                <option value="transfer">Transfer Request</option>
                <option value="purchase">Purchase Request</option>
              </select>
            </div>

            <div className="new-request-field">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="new-request-grid-two">
            <div className="new-request-field">
              <label htmlFor="machineId">Machine ID</label>
              <input
                id="machineId"
                name="machineId"
                value={form.machineId}
                onChange={handleChange}
                placeholder="e.g. MAC-JUKI-442"
                className={errors.machineId ? "error" : ""}
              />
              {errors.machineId && <span className="new-request-error">{errors.machineId}</span>}
            </div>

            <div className="new-request-field">
              <label htmlFor="machineType">Machine Type</label>
              <input
                id="machineType"
                name="machineType"
                value={form.machineType}
                onChange={handleChange}
                placeholder="e.g. Lockstitch"
                className={errors.machineType ? "error" : ""}
              />
              {errors.machineType && <span className="new-request-error">{errors.machineType}</span>}
            </div>
          </div>

          <div className="new-request-flow-heading">
            <span><IconFlow /></span>
            <div>
              <h3>Request Routing</h3>
              <p>Define where the machine should be transferred or delivered.</p>
            </div>
          </div>

          <div className="new-request-grid-two">
            <div className="new-request-field">
              <label htmlFor="fromStoreId">From Store ID</label>
              <input
                id="fromStoreId"
                name="fromStoreId"
                value={form.fromStoreId}
                onChange={handleChange}
                placeholder={isTransfer ? "e.g. STORE-CENTRAL" : "Not required for purchase request"}
                disabled={!isTransfer}
                className={errors.fromStoreId ? "error" : ""}
              />
              {errors.fromStoreId && <span className="new-request-error">{errors.fromStoreId}</span>}
            </div>

            <div className="new-request-field">
              <label htmlFor="toGarmentId">To Garment ID</label>
              <input
                id="toGarmentId"
                name="toGarmentId"
                value={form.toGarmentId}
                onChange={handleChange}
                placeholder="e.g. UNIT-D4-PROD"
                className={errors.toGarmentId ? "error" : ""}
              />
              {errors.toGarmentId && <span className="new-request-error">{errors.toGarmentId}</span>}
            </div>
          </div>

          <div className="new-request-grid-two">
            <div className="new-request-field">
              <label htmlFor="requiredDate">Required Date</label>
              <input
                id="requiredDate"
                name="requiredDate"
                type="date"
                value={form.requiredDate}
                onChange={handleChange}
                className={errors.requiredDate ? "error" : ""}
              />
              {errors.requiredDate && <span className="new-request-error">{errors.requiredDate}</span>}
            </div>

            <div className="new-request-field">
              <label htmlFor="reason">Reason</label>
              <input
                id="reason"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="e.g. Capacity increase"
                className={errors.reason ? "error" : ""}
              />
              {errors.reason && <span className="new-request-error">{errors.reason}</span>}
            </div>
          </div>

          <div className="new-request-field">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              placeholder="Optional notes for reviewer"
            />
          </div>
        </div>

        <div className="new-request-actions">
          <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
          <button type="button" className="btn-primary" onClick={handleSubmit}>
            <IconPlus />
            Create Request
          </button>
        </div>
      </div>

      <AppFooter />
    </section>
  );
}
