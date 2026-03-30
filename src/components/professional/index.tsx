import React from "react";
import "./index.css";
import type {  ProfessionalsModalProps } from "../../types/lead";

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
//  */
// import React from "react";
// import "./index.css";
// import type { LeadRow } from "../../types/lead";

// interface ProfessionalsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   row: LeadRow | null;
// }

// // import React from "react";
// // import "./index.css";
// // import type { LeadRow } from "../../types/lead";

// interface ProfessionalsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   row: LeadRow | null;
// }

export const ProfessionalsModal: React.FC<ProfessionalsModalProps> = ({
  isOpen,
  onClose,
  row,
}) => {
  if (!isOpen || !row) return null;

  const location =
    row.partnerCity && row.partnerState
      ? `${row.partnerCity}, ${row.partnerState}`
      : row.partnerAddress || "N/A";

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
              <tr key={row.partnerId}>
                <td>
                  <img
                    src={row.partnerImageUrl || "/default.png"}
                    alt={row.partnerDisplayName}
                    className="pro-photo"
                  />
                </td>
                <td>{row.partnerDisplayName}</td>
                <td>{row.partnerSpeciality || "N/A"}</td>
                <td>{location}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
