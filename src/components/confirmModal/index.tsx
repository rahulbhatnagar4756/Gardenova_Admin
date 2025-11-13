import ".//index.css";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "Do you really want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="confirm-actions">
          <button className="cancel-btn" onClick={onCancel}>
            {cancelText}
          </button>

          <button className="confirm-btn" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
