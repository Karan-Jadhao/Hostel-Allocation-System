import { useId } from "react";
import { AlertTriangleIcon, XIcon } from "./DialogIcons";
import { useFocusTrap } from "./useFocusTrap";
import { useDialogPresence } from "./useDialogPresence";
import "./popups.css";

/** Accessible confirmation modal for destructive and important actions. */
export function ConfirmationDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  loading = false,
  onConfirm,
  onCancel,
  showIcon = true,
}) {
  const titleId = useId();
  const descriptionId = useId();
  const { present, isExiting } = useDialogPresence(open);
  const dialogRef = useFocusTrap(open && present, onCancel, loading);
  if (!present) return null;

  return <div className={`popup-backdrop ${isExiting ? "popup-exiting" : ""}`} onMouseDown={(event) => {
    if (event.target === event.currentTarget && !loading) onCancel?.();
  }}>
    <section ref={dialogRef} className={`popup-card popup-confirm popup-${variant} ${isExiting ? "popup-exiting" : ""}`} role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} tabIndex={-1}>
      {!loading && <button type="button" className="popup-close" onClick={onCancel} aria-label="Close dialog"><XIcon /></button>}
      {showIcon && <div className="popup-icon popup-warning-icon"><AlertTriangleIcon /></div>}
      <h2 id={titleId}>{title}</h2>
      {description && <div id={descriptionId} className="popup-description">{description}</div>}
      <div className="popup-actions">
        <button type="button" className="popup-button popup-button-secondary" onClick={onCancel} disabled={loading}>{cancelText}</button>
        <button type="button" className="popup-button popup-button-primary" onClick={onConfirm} disabled={loading}>
          {loading && <span className="popup-spinner" aria-hidden="true" />}{loading ? "Please wait..." : confirmText}
        </button>
      </div>
    </section>
  </div>;
}
