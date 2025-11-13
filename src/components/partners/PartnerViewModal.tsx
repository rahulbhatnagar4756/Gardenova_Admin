// components/partners/PartnerViewModal.tsx
import React, { useState } from "react";
import type { PartnerProfileResponse } from "../../services/apiCalls/partnerProfile";
import "../../styles/global.css";
import TableLoader from "../loader";
import { Columns } from "lucide-react";

interface PartnerViewModalProps {
  isOpen: boolean;
  partner: PartnerProfileResponse | null;
  onClose: () => void;
}

export const PartnerViewModal: React.FC<PartnerViewModalProps> = ({
  isOpen,
  partner,
  onClose,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!isOpen) return null;

  const address = partner?.address
    ? `${partner.address.street || ""}, ${partner.address.city || ""}, ${
        partner.address.state || ""
      }, ${partner.address.country || ""} - ${partner.address.zipCode || ""}`
        .replace(/,\s*,/g, ",")
        .replace(/,\s*-/, " -")
        .trim()
    : "Not specified";

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "#2e3a3066" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content position-relative view_modal">
          {/* === Close Button === */}
          <button
            type="button"
            className="btn-close close-btn"
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "none" }}
          >
            ×
          </button>

          {/* === Modal Body === */}
          <div className="modal-body text-center p-4 view_profile" >
            {!partner ? (
              // 🔹 Modal loader while fetching data
              <TableLoader text="Loading partner profiles..." />
            ) : (
              <>
                <h4 className="mb-4 fw-semibold">Partner Details</h4>

                <div className="row g-3 text-start">
                  {/* <div className="col-md-6">
                    <strong>ID:</strong>
                    <p className="lock_field">{partner.id || "N/A"}</p>
                  </div> */}

                  <div className="col-md-6">
                    <strong>Company Name:</strong>
                    <p className="lock_field">{partner.companyName || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Email:</strong>
                    <p className="lock_field">{partner.email || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Contact Person:</strong>
                    <p className="lock_field">{partner.contactPerson || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Mobile Number:</strong>
                    <p className="lock_field">{partner.mobileNumber || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Website:</strong>
                    <p className="lock_field">{partner.website || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Status:</strong>
                    <p className="text-capitalize lock_field">
                      {partner.status || "Pending"}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <strong>Rating:</strong>
                    <p className="lock_field">{partner.rating ?? "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Specialties:</strong>
                    <p className="lock_field">
                      {partner.speciality?.length
                        ? partner.speciality.join(", ")
                        : "N/A"}
                    </p>
                  </div>

                  <div className="col-md-12">
                    <strong>Address:</strong>
                    <p className="lock_field">{address}</p>
                  </div>

                  {partner.projectImageUrl && (
                    <div className="col-md-12 text-center mt-4">
                      <strong>Project Image:</strong>
                      <div className="position-relative mt-2">
                        {!imageLoaded && (
                          // 🔹 Image loader spinner
                          <TableLoader text="Loading project image." />
                        )}

                        <img
                          src={partner.projectImageUrl}
                          alt="Project"
                          className="img-fluid rounded shadow-sm"
                          onLoad={() => setImageLoaded(true)}
                          style={{
                            maxHeight: "180px",
                            width: "100%",
                            objectFit: "cover",
                            opacity: imageLoaded ? 1 : 0,
                            transition: "opacity 0.5s ease-in",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
