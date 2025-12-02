import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";
import type { ToastContextType } from "../types/toast";

/**
 * Custom hook to access the Toast context.
 *
 * Provides methods for displaying success, error, warning, and info toasts.
 * Must be used inside a ToastProvider.
 *
 * @returns {ToastContextType} Toast actions and state.
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
