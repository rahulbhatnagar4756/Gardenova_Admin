import React from "react";
import { useToast } from "../../hooks/useToast";

/**
 * Renders all active toast notifications on the screen.
 *
 * @returns {JSX.Element} A container holding all toast messages.
 */
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  /**
   * Returns the CSS class for the background depending on the toast type.
   *
   * @param {"success" | "error" | "warning" | "info"} type The toast type.
   * @returns {string} A string containing Tailwind/Bootstrap class names.
   */
  const getBgClass = (type: "success" | "error" | "warning" | "info") => {
    switch (type) {
      case "success":
        return "border-0 bg-success text-white";
      case "error":
        return "border-0 bg-danger text-white";
      case "warning":
        return "border-0 bg-warning text-dark";
      case "info":
        return "border-0 bg-info text-dark";
      default:
        return "border-0 bg-secondary text-white";
    }
  };

  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1055 }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast show ${getBgClass(toast.type)} mb-2`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">
              {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
            </strong>
            <small>just now</small>
            <button
              type="button"
              className="btn-close"
              onClick={() => removeToast(toast.id)}
            />
          </div>
          <div className="toast-body">{toast.message}</div>
        </div>
      ))}
    </div>
  );
};
