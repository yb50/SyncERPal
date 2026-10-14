import { useEffect } from "react";

function ToastNotification({ type, message, onClose }) {
  useEffect(() => {
    if (!message) {
      return;
    }

    const timeoutId = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className={`toast-notification ${type}`}>
      <span>{message}</span>

      <button 
        type="button"
        onClick={onClose}
        aria-label="Close notification"
      >
        x
      </button>
    </div>
  );
}

export default ToastNotification;