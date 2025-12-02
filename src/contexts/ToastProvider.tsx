import React, { useState } from "react";
import { ToastContext } from "./ToastContext";
import type { Toast, ToastType } from "../types/toast";

let counter = 0;

/**
 * Provides toast notifications to the application.
 *
 * @param {{ children: React.ReactNode }} props React children for the provider.
 * @param {React.ReactNode} props.children Components wrapped by this provider.
 * @returns {JSX.Element} The ToastContext provider.
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Displays a toast message.
   *
   * @param {string} message The notification message.
   * @param {ToastType} type The type of toast (success, error, info, warning).
   * @param {number} [duration=5000] Time in ms before the toast disappears.
   * @returns {void}
   */
  const showToast = (message: string, type: ToastType, duration = 5000) => {
    const id = ++counter;
    const newToast: Toast = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  /**
   * Removes a toast by ID.
   *
   * @param {number} id The toast ID to remove.
   * @returns {void}
   */
  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /**
   * Clears all active toasts.
   *
   * @returns {void}
   */
  const clearAllToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        clearAllToasts,

        /**
         * Shows a success toast.
         *
         * @param {string} msg Message text.
         * @param {number} [d] Optional duration override.
         * @returns {void}
         */
        showSuccess: (msg, d) => showToast(msg, "success", d),
        /**
         * Shows an error toast.
         *
         * @param {string} msg Message text.
         * @param {number} [d] Optional duration override.
         * @returns {void}
         */
        showError: (msg, d) => showToast(msg, "error", d),
        /**
         * Shows a warning toast.
         *
         * @param {string} msg Message text.
         * @param {number} [d] Optional duration override.
         * @returns {void}
         */
        showWarning: (msg, d) => showToast(msg, "warning", d),
        /**
         * Shows an informational toast.
         *
         * @param {string} msg Message text.
         * @param {number} [d] Optional duration override.
         * @returns {void}
         */
        showInfo: (msg, d) => showToast(msg, "info", d),
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};
