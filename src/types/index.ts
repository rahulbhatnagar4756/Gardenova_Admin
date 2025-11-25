/**
 * Props for a protected route wrapper that restricts access
 * based on authentication.
 *
 * @property children - Components to render when access is allowed.
 */
export interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Pagination parameters used for API queries.
 *
 * @property page - Page number to fetch.
 * @property limit - Number of items per page.
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Props for wrapping the authentication provider.
 *
 * @property children - Application components to wrap within provider.
 */
export interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Props for uploading and previewing an image.
 *
 * @property imageUrl - The current image URL or Base64 string.
 * @property onImageChange - Callback triggered when image changes.
 */
export interface ImageUploadProps {
  imageUrl: string;
  onImageChange: (imageUrl: string) => void;
}

/**
 * Props for displaying an image in a popup/modal.
 *
 * @property imageUrl - URL of the image to show.
 * @property onClose - Callback to close the popup.
 */
export interface ImagePopupProps {
  imageUrl: string | null;
  onClose: () => void;
}

/**
 * Props for pagination UI component.
 *
 * @property totalItems - Total number of items available.
 * @property itemsPerPage - Number of items shown per page.
 * @property currentPage - Current active page number.
 * @property onPageChange - Callback fired when page changes.
 */
export interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

/**
 * Props for a generic modal component.
 *
 * @property isOpen - Whether the modal is visible.
 * @property onClose - Handler to close the modal.
 * @property title - Title displayed at the top of the modal.
 * @property children - Modal content.
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Props for loading spinner component.
 *
 * @property text - Optional loading text to display.
 */
export interface LoaderProps {
  text?: string;
}

/**
 * Props for a confirmation modal dialog.
 *
 * @property open - Whether the modal is visible.
 * @property title - Optional title of the dialog.
 * @property message - Optional message body.
 * @property confirmText - Confirm button text.
 * @property cancelText - Cancel button text.
 * @property onConfirm - Action executed when user confirms.
 * @property onCancel - Action executed when user cancels.
 */
export interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Props for a small doughnut chart component.
 *
 * @property total - Total count represented by chart.
 * @property today - Today's count used in chart.
 */
export interface DoughnutMiniChartProps {
  total: number;
  today: number;
}

/**
 * Props for a page header component.
 *
 * @property onAddClick - Handler triggered when "Add" button is clicked.
 */
export interface PageHeaderProps {
  onAddClick: () => void;
}

/**
 * Props for a protected route wrapper that restricts access
 * based on authentication.
 *
 * @property children - Components to render when access is allowed.
 */
export interface ProtectedRouteProps {
  children: React.ReactNode;
}
