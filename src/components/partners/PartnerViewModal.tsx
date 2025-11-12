// components/partners/PartnerViewModal.tsx
import React, { useState } from "react";
import type { PartnerProfileResponse } from "../../services/apiCalls/partnerProfile";
import "../../styles/global.css";
import TableLoader from "../loader";

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
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content position-relative">
          {/* === Close Button === */}
          <button
            type="button"
            className="btn-close position-absolute top-0 end-0 m-3"
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "none" }}
          >
            <svg width={27} height={27} viewBox="0 0 27 27" fill="none">
              <rect
                width={27}
                height={27}
                rx="13.5"
                fill="url(#paint0_linear)"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.2908 18.2908C18.5697 18.0118 18.5697 17.5596 18.2908 17.2806L9.71936 8.70921C9.44042 8.43026 8.98816 8.43026 8.70921 8.70921C8.43026 8.98816 8.43026 9.44042 8.70921 9.71936L17.2806 18.2908C17.5596 18.5697 18.0118 18.5697 18.2908 18.2908Z"
                fill="#F4F4F4"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.70921 18.2908C8.98816 18.5697 9.44042 18.5697 9.71936 18.2908L18.2908 9.71936C18.5697 9.44042 18.5697 8.98815 18.2908 8.70921C18.0118 8.43026 17.5596 8.43026 17.2806 8.70921L8.70921 17.2806C8.43026 17.5596 8.43026 18.0118 8.70921 18.2908Z"
                fill="#F4F4F4"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="13.5"
                  y1={0}
                  x2="13.5"
                  y2={27}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#E0B669" />
                  <stop offset={1} stopColor="#B48A3E" />
                </linearGradient>
              </defs>
            </svg>
          </button>

          {/* === Modal Body === */}
          <div className="modal-body text-center p-4">
            {!partner ? (
              // 🔹 Modal loader while fetching data
              <TableLoader text="Loading partner profiles..." />
            ) : (
              <>
                <h4 className="mb-4 fw-semibold">Partner Details</h4>

                <div className="row g-3 text-start">
                  <div className="col-md-6">
                    <strong>ID:</strong>
                    <p>{partner.id || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Company Name:</strong>
                    <p>{partner.companyName || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Email:</strong>
                    <p>{partner.email || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Contact Person:</strong>
                    <p>{partner.contactPerson || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Mobile Number:</strong>
                    <p>{partner.mobileNumber || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Website:</strong>
                    <p>{partner.website || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Status:</strong>
                    <p className="text-capitalize">
                      {partner.status || "Pending"}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <strong>Rating:</strong>
                    <p>{partner.rating ?? "N/A"}</p>
                  </div>

                  <div className="col-md-12">
                    <strong>Specialties:</strong>
                    <p>
                      {partner.speciality?.length
                        ? partner.speciality.join(", ")
                        : "N/A"}
                    </p>
                  </div>

                  <div className="col-md-12">
                    <strong>Address:</strong>
                    <p>{address}</p>
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
                            maxHeight: "250px",
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
