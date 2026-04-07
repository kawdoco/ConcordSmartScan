import "./ConfirmActionModal.css";

export default function ConfirmActionModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "approve",
  isSubmitting = false,
  onConfirm,
  onCancel
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="confirm-action-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-action-title">
      <div className="confirm-action-modal">
        <h3 id="confirm-action-title">{title}</h3>
        <p className="confirm-action-message">{message}</p>
        <div className="confirm-action-buttons">
          <button type="button" className="confirm-action-cancel" onClick={onCancel} disabled={isSubmitting}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`confirm-action-confirm ${variant}`}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
