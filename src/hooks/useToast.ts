import { toast, Toaster } from "sonner";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

/**
 * Enhanced useToast hook using Sonner package
 *
 * This hook wraps the sonner toast library while maintaining the same API
 * as your existing custom implementation, so no changes needed in Login component.
 */
export const useToast = () => {
  const showToast = (message: string, type: ToastType, duration?: number) => {
    const options = {
      duration: duration || 5000,
      position: "top-right" as const,
    };

    switch (type) {
      case "success":
        return toast.success(message, options);
      case "error":
        return toast.error(message, options);
      case "warning":
        return toast.warning(message, options);
      case "info":
        return toast.info(message, options);
      default:
        return toast(message, options);
    }
  };

  const removeToast = (id: string | number) => {
    toast.dismiss(id);
  };

  const clearAllToasts = () => {
    toast.dismiss();
  };

  // Maintain compatibility with your existing API
  return {
    toasts: [], // Not needed with sonner as it manages its own state
    showToast,
    removeToast,
    clearAllToasts,
    showSuccess: (message: string, duration?: number) =>
      toast.success(message, {
        duration: duration || 5000,
        position: "top-right",
      }),
    showError: (message: string, duration?: number) =>
      toast.error(message, {
        duration: duration || 5000,
        position: "top-right",
      }),
    showWarning: (message: string, duration?: number) =>
      toast.warning(message, {
        duration: duration || 5000,
        position: "top-right",
      }),
    showInfo: (message: string, duration?: number) =>
      toast.info(message, {
        duration: duration || 5000,
        position: "top-right",
      }),
  };
};

// Export the Toaster component for easy import
export { Toaster };
