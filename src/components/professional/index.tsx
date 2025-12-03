import React from "react";
import "./index.css";
import type { ProfessionalsModalProps } from "../../types/partnerProfile";

/**
 * Modal component that displays a list of professionals.
 * Shows a loading state until data is fetched and allows closing the modal.
 *
 * @param {ProfessionalsModalProps} root0 Component properties.
 * @param {boolean} root0.isOpen Whether the modal is currently visible.
 * @param {() => void} root0.onClose Callback to close the modal.
 * @param {Array<any>} root0.professionals List of professionals to display.
 * @param {boolean} root0.loading Indicates whether professionals are still loading.
 * @returns {JSX.Element | null} Rendered modal or null when closed.
 */
export const ProfessionalsModal: React.FC<ProfessionalsModalProps> = ({
  isOpen,
  onClose,
  professionals,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="pro-modal-backdrop" onClick={onClose}>
      <div className="pro-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="pro-modal-header">
          <h3>Professionals</h3>
          <p>Quote Request Sent To Professionals</p>
          <button
            className="pro-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="pro-table-wrapper">
          {loading ? (
            <div className="pro-loading">
              <p>Loading professionals...</p>
            </div>
          ) : professionals.length > 0 ? (
            <table className="pro-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Specialty</th>
                  <th>Service Region</th>
                </tr>
              </thead>
              <tbody>
                {professionals.map((pro) => (
                  <tr key={pro.id}>
                    <td>
                      <img
                        src={pro.projectImageUrl || "/default.png"}
                        alt={pro.companyName}
                        className="pro-photo"
                      />
                    </td>
                    <td>{pro.companyName}</td>
                    <td>
                      {pro.speciality?.length
                        ? pro.speciality.join(", ")
                        : "N/A"}
                    </td>
                    <td>
                      {pro.address
                        ? `${pro.address.city || ""}, ${
                            pro.address.state || ""
                          }`
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="pro-empty">
              <p>No professionals found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
