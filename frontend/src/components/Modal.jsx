import { useEffect } from "react";
import { createPortal } from "react-dom";

function Modal({ isOpen, title, children, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const originalBodyOverflow = document.body.style.overflow;

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;