export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface ImageUploadProps {
  imageUrl: string;
  onImageChange: (imageUrl: string) => void;
}

export interface ImagePopupProps {
  imageUrl: string | null;
  onClose: () => void;
}

export interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface LoaderProps {
  text?: string;
}

export interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface DoughnutMiniChartProps {
  total: number;
  today: number;
}

export interface PageHeaderProps {
  onAddClick: () => void;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
}
