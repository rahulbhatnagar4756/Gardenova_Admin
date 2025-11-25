import { useEffect } from "react";
import "./modal.css";
import type { ModalProps } from "../../types";

/**
 * Renders a modal dialog with overlay and a title.
 * Controls body scroll lock based on open/close state.
 *
 * @param {ModalProps} root0 Props for the Modal component.
 * @param {boolean} root0.isOpen Whether the modal is open.
 * @param {() => void} root0.onClose Callback to close the modal.
 * @param {string} root0.title Title displayed at the top of the modal.
 * @param {React.ReactNode} root0.children The modal body content.
 * @returns {JSX.Element | null} The modal element or null if closed.
 */
export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    /**
     * Handles closing the modal when Escape key is pressed.
     *
     * @param {KeyboardEvent} e Keyboard event object.
     * @returns {void}
     */
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-component-overlay" onClick={onClose}>
      <div
        className="modal-component-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-component-header">
          <h3 className="modal-component-title">{title}</h3>
          <button
            className="modal-component-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};
