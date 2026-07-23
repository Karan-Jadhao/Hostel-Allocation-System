import { useEffect, useId } from "react";
import { CheckCircleIcon, XIcon } from "./DialogIcons";
import { useFocusTrap } from "./useFocusTrap";
import { useDialogPresence } from "./useDialogPresence";
import "./popups.css";

/** A compact success modal that may dismiss itself after the requested duration. */
export function SuccessDialog({ open, title = "Success!", description, autoClose = true, duration = 2500, onClose, showOkButton = false }) {
  const titleId = useId();
  const descriptionId = useId();
  const { present, isExiting } = useDialogPresence(open);
  const dialogRef = useFocusTrap(open && present, onClose);

  useEffect(() => {
    if (!open || !autoClose) return undefined;
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [autoClose, duration, onClose, open]);

  if (!present) return null;
  return <div className={`popup-backdrop popup-success-backdrop ${isExiting ? "popup-exiting" : ""}`} onMouseDown={(event) => {
    if (event.target === event.currentTarget) onClose?.();
  }}>
    <section ref={dialogRef} className={`popup-card popup-success ${isExiting ? "popup-exiting" : ""}`} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} tabIndex={-1}>
      <button type="button" className="popup-close" onClick={onClose} aria-label="Close success message"><XIcon /></button>
      <div className="popup-icon popup-success-icon"><CheckCircleIcon /></div>
      <h2 id={titleId}>{title}</h2>
      {description && <p id={descriptionId} className="popup-description">{description}</p>}
      {showOkButton && <div className="popup-actions popup-success-actions"><button type="button" className="popup-button popup-button-primary" onClick={onClose}>OK</button></div>}
    </section>
  </div>;
}
