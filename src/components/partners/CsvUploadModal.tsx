// components/partners/CsvUploadModal.tsx
import React, { useState, useRef, useCallback } from "react";
// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * Props for the CsvUploadModal component.
 */
interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Modal for uploading a CSV file to bulk-add partner profiles.
 * Supports drag & drop and file picker. Backend handles all parsing/validation.
 *
 * @param root0 Component props.
 * @param root0.isOpen Whether the modal is visible.
 * @param root0.onClose Callback to close the modal.
 * @param root0.onUpload Callback that receives the selected File to send to the backend.
 * @returns The CSV upload modal UI, or null if closed.
 */
export const CsvUploadModal: React.FC<CsvUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Validates and stores the selected CSV file.
   *
   * @param file The file chosen by the user.
   */
  const handleFile = useCallback((file: File) => {
    setFileError(null);

    if (!file.name.endsWith(".csv")) {
      setFileError("Only .csv files are supported.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }, []);
  /**
   * Handles file selection via the hidden file input element.
   *
   * @param e The change event from the file input.
   */
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so same file can be re-selected if needed
    e.target.value = "";
  };
  /**
   * Handles a file being dropped onto the drop zone.
   *
   * @param e The drag event from the drop zone.
   */
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );
  /**
   * Handles a file being dragged over the drop zone.
   *
   * @param e The drag event from the drop zone.
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
/**
 * Handles the drag leave event by setting the dragging state to false.
 * 
 * @returns {void} No return value.
 */
  const handleDragLeave = () => setIsDragging(false);

  /**
   * Resets the dragging state when a file is dragged out of the drop zone.
   */
  const handleClose = () => {
    setSelectedFile(null);
    setFileError(null);
    setIsUploading(false);
    onClose();
  };

  /**
   * Submits the selected CSV file to the parent upload handler.
   */
  const handleSubmit = async () => {
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      await onUpload(selectedFile);
      handleClose();
    } catch {
      // Error toasts are handled in usePartnerProfiles
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show modal_view_form"
      style={{ display: "block", backgroundColor: "rgba(46, 58, 48, 0.4)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Close Button */}
          <button
            type="button"
            className="btn-close close-btn"
            onClick={handleClose}
            aria-label="Close"
          >
            ✕
          </button>

          <div className="modal-body">
            {/* Header */}
            <div className="head_area">
              <h4 className="head_modal">Upload Professionals via CSV</h4>
              <p className="sub_head">
                Select a CSV file to bulk-add professionals
              </p>
            </div>

            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${
                  isDragging ? "#4caf50" : selectedFile ? "#4caf50" : "#ccc"
                }`,
                borderRadius: "12px",
                padding: "48px 24px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: isDragging
                  ? "rgba(76, 175, 80, 0.06)"
                  : selectedFile
                  ? "rgba(76, 175, 80, 0.04)"
                  : "#fafafa",
                transition: "all 0.2s ease",
                marginBottom: "16px",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                onChange={handleFileInputChange}
              />

              {selectedFile ? (
                /* ── File selected state ── */
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="44"
                    height="44"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#4caf50"
                    strokeWidth="1.5"
                    style={{ marginBottom: "12px" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  <p
                    style={{
                      color: "#4caf50",
                      fontWeight: 600,
                      margin: "0 0 4px",
                      fontSize: "15px",
                    }}
                  >
                    {selectedFile.name}
                  </p>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>
                    Click to replace
                  </p>
                </>
              ) : (
                /* ── Empty state ── */
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="44"
                    height="44"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#aaa"
                    strokeWidth="1.5"
                    style={{ marginBottom: "12px" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p
                    style={{
                      color: "#555",
                      fontWeight: 500,
                      margin: "0 0 4px",
                      fontSize: "15px",
                    }}
                  >
                    Drag & drop your CSV here
                  </p>
                  <p style={{ color: "#aaa", fontSize: "13px", margin: 0 }}>
                    or click to browse — .csv files only
                  </p>
                </>
              )}
            </div>

            {/* File validation error */}
            {fileError && (
              <div
                className="alert alert-danger py-2 px-3"
                style={{ fontSize: "13px", borderRadius: "8px" }}
              >
                {fileError}
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              className="btn common_button mt-2"
              onClick={handleSubmit}
              disabled={!selectedFile || isUploading || !!fileError}
            >
              {isUploading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Uploading...
                </>
              ) : (
                "Upload & Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};