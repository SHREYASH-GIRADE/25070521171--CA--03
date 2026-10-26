import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-portal-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            className={`toast-notification-pill ${toast.type || "info"}`}
            role="status"
          >
            <div className="toast-icon-wrap">
              {isSuccess ? (
                <CheckCircle2 size={16} className="toast-icon green-icon" />
              ) : isError ? (
                <AlertCircle size={16} className="toast-icon red-icon" />
              ) : (
                <Info size={16} className="toast-icon gold-icon" />
              )}
            </div>

            <span className="toast-message-text">{toast.message}</span>

            <button
              type="button"
              className="toast-dismiss-btn"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
