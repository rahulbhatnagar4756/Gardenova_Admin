import React from "react";
import type { PartnerProfileResponse } from "../../services/apiCalls/partnerProfile";
import "./index.css";

interface ProfessionalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionals: PartnerProfileResponse[];
  loading: boolean;
}

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
