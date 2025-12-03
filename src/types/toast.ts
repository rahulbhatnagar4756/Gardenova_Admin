/**
 * Supported toast types used to display different alert variations.
 */
export type ToastType = "success" | "error" | "warning" | "info";

/**
 * Represents a single toast item shown in the UI.
 *
 * @property id - Unique identifier for the toast.
 * @property message - Text message displayed inside the toast.
 * @property type - Type of toast (success, error, warning, info).
 * @property duration - Optional duration in milliseconds before auto-dismiss.
 */
export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}

/**
 * Defines the structure of the Toast context used in React.
 *
 * @property toasts - List of active toast messages.
 * @property showToast - Function to display a toast with custom message & type.
 * @property removeToast - Function to remove a toast by ID.
 * @property clearAllToasts - Function to remove all toasts.
 * @property showSuccess - Convenient method to show a success toast.
 * @property showError - Convenient method to show an error toast.
 * @property showWarning - Convenient method to show a warning toast.
 * @property showInfo - Convenient method to show an info toast.
 */
export interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: number) => void;
  clearAllToasts: () => void;
  showSuccess: (msg: string, duration?: number) => void;
  showError: (msg: string, duration?: number) => void;
  showWarning: (msg: string, duration?: number) => void;
  showInfo: (msg: string, duration?: number) => void;
}
