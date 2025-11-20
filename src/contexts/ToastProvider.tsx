import React, { useState } from "react";
import { ToastContext } from "./ToastContext";
import type { Toast, ToastType } from "../types/toast";

let counter = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType, duration = 5000) => {
    const id = ++counter;
    const newToast: Toast = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

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
        showSuccess: (msg, d) => showToast(msg, "success", d),
        showError: (msg, d) => showToast(msg, "error", d),
        showWarning: (msg, d) => showToast(msg, "warning", d),
        showInfo: (msg, d) => showToast(msg, "info", d),
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};
