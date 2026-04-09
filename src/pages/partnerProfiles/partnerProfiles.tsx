// partnerProfiles.tsx
import { useEffect, useState, useCallback } from "react";
import "./partnerProfiles.css";
import { usePartnerProfiles } from "../../hooks/usePartnerProfiles";
import { Pagination } from "../../components/pagination";
import { useToast } from "../../hooks/useToast";
import StarRating from "../../components/starRating";
import { ImagePopup } from "../../components/partners/ImagePopup";
import { CsvUploadModal } from "../../components/partners/CsvUploadModal";
import { PartnerViewModal } from "../../components/partners/PartnerViewModal";
import { TableLoader } from "../../components/loader";
import type {
  PartnerProfileResponse,
  PartnerProfilesProps,
} from "../../types/partnerProfile";

/**
 * Formats a partner's location object into a readable address string.
 *
 * @param {PartnerProfileResponse["location"] | undefined} location  The location object of the partner, may be undefined.
 * @returns {string} A formatted address string combining address, city, and state, or "N/A" if location is missing.
 */
const formatLocation = (
  location?: PartnerProfileResponse["location"]
): string => {
  if (!location) return "N/A";
  return [location.address, location.city, location.state]
    .filter(Boolean)
    .join(", ");
};

/**
 * Parses a partner's assessment string into a number suitable for StarRating.
 *
 * @param {string | null | undefined} assessment  The assessment value as a string (e.g., "3,50").
 * @returns {number} The numeric rating. Returns 0 if the input is null, undefined, or invalid.
 */
const parseRating = (assessment?: string | null): number => {
  if (!assessment) return 0;
  return parseFloat(assessment.replace(",", ".")) || 0;
};

/** Shared modal state shape used for both view and edit. */
interface ModalState {
  isOpen: boolean;
  mode: "view" | "edit";
  partner: PartnerProfileResponse | null;
}

const CLOSED_MODAL: ModalState = { isOpen: false, mode: "view", partner: null };

/**
 * Partner Profiles listing page component.
 *
 * @param {PartnerProfilesProps} props Component props
 * @param {number | undefined} props.limit Initial items per page
 * @returns {JSX.Element} The rendered PartnerProfiles component.
 */
export const PartnerProfiles = ({ limit }: PartnerProfilesProps) => {
  const {
    partners,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    limit: serverLimit,
    goToPage,
    setItemsPerPage,
    uploadPartnersCsv,
    updatePartnerRating,
    updatePartner,
    registerPartner,
    getPartnerById,
  } = usePartnerProfiles({
    initialLimit: limit ?? 5,
  });
  const { showError } = useToast();

  const [registeringIds, setRegisteringIds] = useState<Set<string>>(new Set());
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Single modal state drives both view and edit
  const [modal, setModal] = useState<ModalState>(CLOSED_MODAL);

  useEffect(() => {
    if (limit && limit !== serverLimit) {
      setItemsPerPage(limit);
    }
  }, [limit, serverLimit, setItemsPerPage]);

  useEffect(() => {
    if (error) showError(`Error: ${error}`);
  }, [error, showError]);

  const handlePageChange = useCallback(
    (page: number) => goToPage(page),
    [goToPage]
  );

  /**
   * Opens the modal and loads partner details from API.
   *
   * @param {string} partnerId The partner's ID.
   * @param {"view" | "edit"} mode Modal mode.
   * @returns {Promise<void>}
   */
  const handleOpenModal = async (
    partnerId: string,
    mode: "view" | "edit"
  ) => {
    try {
      setModal({ isOpen: true, mode, partner: null }); // show loader immediately
      const partner = await getPartnerById(partnerId);
      if (partner) {
        setModal({ isOpen: true, mode, partner });
      } else {
        setModal(CLOSED_MODAL);
      }
    } catch (err) {
      console.error("Failed to load partner details:", err);
      showError("Failed to fetch partner details");
      setModal(CLOSED_MODAL);
    }
  };
  /** 
   * Closes the modal.
   * @returns {void} 
   */
  const handleCloseModal = () => setModal(CLOSED_MODAL);

  /**
   * Saves edited partner details.
   *
   * @param {string} id Partner ID.
   * @param {Partial<PartnerProfileResponse>} data Partial partner data to update.
   * @returns {Promise<void>}
   */
  const handleSavePartner = async (
    id: string,
    data: Partial<PartnerProfileResponse>
  ) => {
    const payload = {
      // ── Basic fields (camelCase → snake_case) ──
      company_name: data.companyName,
      email: data.email,
      category: data.category,
      description: data.description,
      

      // ── Flatten location ──
      address: data.location?.address,
      city: data.location?.city,
      state: data.location?.state,

      // ── Flatten contact ──
      telefone: data.contact?.telefone,
      whatsapp: data.contact?.whatsapp,
      website: data.contact?.website,
      // instagram: data.contact?.instagram,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updatePartner(id, payload as any);
  };

  /**
   * Validates email and then registers the partner (pending → registered).
   * 
   * @param {PartnerProfileResponse} partner  The partner profile to register.
   * @returns {Promise<void>} A promise that resolves when the registration process is complete.
   */
  const handleRegister = async (partner: PartnerProfileResponse) => {
    if (!partner.email || partner.email.trim() === "") {
      showError(
        `Cannot register "${partner.companyName || "this partner"}" — email is missing.`
      );
      return;
    }
    setRegisteringIds((prev) => new Set(prev).add(partner.id));
    try {
      await registerPartner(partner.id, partner.email);
    } finally {
      setRegisteringIds((prev) => {
        const next = new Set(prev);
        next.delete(partner.id);
        return next;
      });
    }
  };
  /**
   * Handles the CSV file upload and calls the appropriate service to process the file.
   * 
   * @param {File} file  The CSV file to be uploaded.
   * @returns {Promise<void>} A promise that resolves when the file is successfully uploaded.
   */
  const handleCsvUpload = async (file: File) => {
    await uploadPartnersCsv(file);
  };

  return (
    <>
      <div className="main_page">
        <div className="main_heading_area">
          <div className="row g-3">
            <div className="col">
              <h4 className="page_heading">Manage Professionals</h4>
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="common_button"
                onClick={() => setCsvModalOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9 3C9.41421 3 9.75 3.33579 9.75 3.75V8.25H14.25C14.6642 8.25 15 8.58579 15 9C15 9.41421 14.6642 9.75 14.25 9.75H9.75V14.25C9.75 14.6642 9.41421 15 9 15C8.58579 15 8.25 14.6642 8.25 14.25V9.75H3.75C3.33579 9.75 3 9.41421 3 9C3 8.58579 3.33579 8.25 3.75 8.25H8.25V3.75C8.25 3.33579 8.58579 3 9 3Z"
                    fill="white"
                  />
                </svg>
                Add Professionals
              </button>
            </div>
          </div>
        </div>

        <div className="mp_table">
          <table className="table mb-0">
            <thead>
              <tr>
                <th scope="col">Project Image</th>
                <th scope="col">Company Name</th>
                <th scope="col">Email</th>
                <th scope="col">Contact</th>
                <th scope="col">Category</th>
                <th scope="col">Address</th>
                <th scope="col">Rating</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableLoader />
              ) : partners.length > 0 ? (
                partners.map((partner) => {
                  const isRegistering = registeringIds.has(partner.id);
                  const isRegistered = partner.registered === "true";

                  return (
                    <tr key={partner.id}>
                      {/* Project Image */}
                      <td scope="row">
                        {partner.image_url ? (
                          <img
                            src={partner.image_url}
                            className="profile_img"
                            alt={partner.companyName || "Profile"}
                            onClick={() => setSelectedImage(partner.image_url!)}
                            style={{ cursor: "pointer" }}
                          />
                        ) : (
                          <div className="profile_img no-image">No Image</div>
                        )}
                      </td>

                      <td>{partner.companyName || "N/A"}</td>

                      <td>
                        {partner.email ? (
                          <a
                            href={`mailto:${partner.email}`}
                            style={{ color: "inherit", textDecoration: "none" }}
                            title={partner.email}
                          >
                            {partner.email}
                          </a>
                        ) : (
                          <span style={{ color: "#ccc" }}>—</span>
                        )}
                      </td>

                      <td>
                        {partner.contact?.telefone || (
                          <span style={{ color: "#ccc" }}>—</span>
                        )}
                      </td>

                      <td>{partner.category || "N/A"}</td>

                      <td>{formatLocation(partner.location)}</td>

                      <td className="star_rating">
                        <StarRating
                          rating={parseRating(partner.ratings)}
                          onChange={async (newRating) => {
                            if (partner.ratings) {
                              partner.ratings = String(newRating);
                            }
                            try {
                              await updatePartnerRating(partner.id, newRating);
                            } catch (err) {
                              console.error("Rating update failed:", err);
                            }
                          }}
                        />
                      </td>

                      <td>
                        {isRegistered ? (
                          <span className="badge bg-success">Registered</span>
                        ) : (
                          <span
                            className="badge bg-warning text-dark"
                            style={{
                              cursor: isRegistering ? "not-allowed" : "pointer",
                              opacity: isRegistering ? 0.6 : 1,
                              transition: "opacity 0.2s ease",
                              userSelect: "none",
                            }}
                            title={
                              isRegistering ? "Registering..." : "Click to register"
                            }
                            onClick={() => {
                              if (!isRegistering) handleRegister(partner);
                            }}
                          >
                            {isRegistering ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-1"
                                  role="status"
                                  aria-hidden="true"
                                  style={{ width: "10px", height: "10px" }}
                                />
                                Registering...
                              </>
                            ) : (
                              "Pending"
                            )}
                          </span>
                        )}
                      </td>

                      {/* ── Actions: View icon + Edit icon ── */}
                      <td>
                        <span
                          className="action_icons"
                          style={{ display: "flex", alignItems: "center", gap: "10px" }}
                        >
                          {/* 👁 View Details */}
                          <span
                            onClick={() => handleOpenModal(partner.id, "view")}
                            style={{ cursor: "pointer" }}
                            title="View Partner Details"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="22"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12s-4.5 7.5-10.5 7.5S1.5 12 1.5 12z"
                              />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </span>

                          {/* ✏️ Edit Partner */}
                          <span
                            onClick={() => handleOpenModal(partner.id, "edit")}
                            style={{ cursor: "pointer" }}
                            title="Edit Partner"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                d="M17.8585 5.69049L14.5068 2.33949C14.2255 2.05829 13.844 1.90031 13.4463 1.90031C13.0485 1.90031 12.6671 2.05829 12.3858 2.33949L3.13677 11.5877C2.99701 11.7267 2.88619 11.8919 2.81075 12.074C2.73531 12.256 2.69674 12.4512 2.69727 12.6482V16C2.69727 16.3978 2.85531 16.7794 3.13661 17.0607C3.41792 17.342 3.79945 17.5 4.19727 17.5H16.7973C17.036 17.5 17.2649 17.4052 17.4337 17.2364C17.6025 17.0676 17.6973 16.8387 17.6973 16.6C17.6973 16.3613 17.6025 16.1324 17.4337 15.9636C17.2649 15.7948 17.036 15.7 16.7973 15.7H9.97227L17.8585 7.81224C17.9979 7.67295 18.1084 7.50756 18.1838 7.32553C18.2593 7.14351 18.2981 6.9484 18.2981 6.75137C18.2981 6.55434 18.2593 6.35923 18.1838 6.1772C18.1084 5.99518 17.9979 5.82979 17.8585 5.69049ZM7.42227 15.7H4.49727V12.775L10.7973 6.47499L13.7223 9.39999L7.42227 15.7ZM14.9973 8.12499L12.0723 5.19999L13.4478 3.82449L16.3728 6.74949L14.9973 8.12499Z"
                                fill="#4A4A4A"
                              />
                            </svg>
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No partners found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 0 && (
            <Pagination
              totalItems={totalCount}
              itemsPerPage={serverLimit}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* ── Modals ── */}

      <ImagePopup
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <CsvUploadModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onUpload={handleCsvUpload}
      />

      {/* One modal instance — driven by modal.mode ("view" | "edit") */}
      <PartnerViewModal
        isOpen={modal.isOpen}
        partner={modal.partner}
        onClose={handleCloseModal}
        mode={modal.mode}
        onSave={handleSavePartner}
      />
    </>
  );
};