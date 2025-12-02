// partnerProfiles.tsx
import { useEffect, useState, useCallback } from "react";
import "./partnerProfiles.css";
import { usePartnerProfiles } from "../../hooks/usePartnerProfiles";
import { Pagination } from "../../components/pagination";
import { useToast } from "../../hooks/useToast";
import StarRating from "../../components/starRating";
import { formatAddress } from "../../utility/util";
import { ImagePopup } from "../../components/partners/ImagePopup";
import { PartnerModal } from "../../components/partners/PartnerModal";
import { PartnerViewModal } from "../../components/partners/PartnerViewModal";
import { TableLoader } from "../../components/loader";
import { useDebouncedBatchUpdater } from "../../hooks/useDebouncedBatchUpdater";
import type {
  PartnerProfileResponse,
  PartnerProfilesProps,
  PartnerProfileStatus,
} from "../../types/partnerProfile";

/**
 * Returns the next status in the predefined status cycle.
 *
 * @param current Current partner status.
 * @returns The next status in the sequence.
 */
const getNextStatus = (current: PartnerProfileStatus): PartnerProfileStatus => {
  const order: PartnerProfileStatus[] = [
    "active",
    "inactive",
    "pending",
    "suspended",
  ];
  const currentIndex = order.indexOf(current);
  const nextIndex = (currentIndex + 1) % order.length;
  return order[nextIndex];
};

/**
 * Partner Profiles listing page. Handles CRUD operations,
 * pagination, rating updates, and status updates.
 *
 * @param root0 Component props.
 * @param root0.limit Optional limit for number of partners to display.
 * @returns The Partner Profiles page UI.
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
    createPartner,
    updatePartner,
    updatePartnerRating,
    updatePartnerStatus,
    getPartnerById,
  } = usePartnerProfiles({
    initialLimit: limit ?? 5,
  });

  const { showError, showSuccess } = useToast();

  // Consolidated modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    editingPartner: PartnerProfileResponse | null;
  }>({
    isOpen: false,
    editingPartner: null,
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { triggerUpdate: triggerStatusUpdate, pendingUpdates } =
    useDebouncedBatchUpdater<PartnerProfileStatus>(
      updatePartnerStatus,
      2000, // debounce delay
      () => showSuccess("Partner statuses updated successfully!"),
      (failed) => showError(`${failed} status updates failed!`)
    );

  // ✅ new state for View modal
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    partner: PartnerProfileResponse | null;
  }>({ isOpen: false, partner: null });

  // Update items per page if limit prop changes
  useEffect(() => {
    if (limit && limit !== serverLimit) {
      setItemsPerPage(limit);
    }
  }, [limit, serverLimit, setItemsPerPage]);

  useEffect(() => {
    if (error) {
      showError(`Error: ${error}`);
    }
  }, [error, showError]);

  const handleOpenModal = useCallback((partner?: PartnerProfileResponse) => {
    setModalState({
      isOpen: true,
      editingPartner: partner || null,
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState({
      isOpen: false,
      editingPartner: null,
    });
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      goToPage(page);
    },
    [goToPage]
  );

  /**
   * Opens the partner view modal and loads partner details from API.
   *
   * @param partnerId The ID of the partner to fetch and display.
   * @returns A promise that resolves after modal state is updated.
   */
  const handleViewPartner = async (partnerId: string) => {
    try {
      // Step 1: Open modal immediately with no data yet
      setViewModal({ isOpen: true, partner: null });

      // Step 2: Fetch data
      const partner = await getPartnerById(partnerId);

      // Step 3: Update modal content
      if (partner) {
        setViewModal({ isOpen: true, partner });
      }
    } catch (err) {
      console.error("Failed to load partner details:", err);
      showError("Failed to fetch partner details");
    }
  };

  /**
   * Closes the partner view modal.
   *
   * @returns void
   */
  const handleCloseViewModal = () =>
    setViewModal({ isOpen: false, partner: null });

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
                onClick={() => handleOpenModal()}
                disabled={partners.length == 0}
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
                <th scope="col">Specialty</th>
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
                partners.map((partner) => (
                  <tr key={partner.id}>
                    <td scope="row">
                      {partner.projectImageUrl ? (
                        <img
                          src={partner.projectImageUrl}
                          className="profile_img"
                          alt={partner.companyName || "Profile"}
                          onClick={() =>
                            setSelectedImage(partner.projectImageUrl!)
                          }
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <div className="profile_img no-image">No Image</div>
                      )}
                    </td>
                    <td>{partner.companyName}</td>
                    <td>
                      {partner.speciality?.length
                        ? partner.speciality.join(", ")
                        : "No specialties"}
                    </td>
                    <td>{formatAddress(partner.address)}</td>
                    <td className="star_rating">
                      <StarRating
                        rating={Number(partner.rating)}
                        onChange={async (newRating) => {
                          // Optimistic update
                          partner.rating = String(newRating);
                          try {
                            await updatePartnerRating(partner.id, newRating);
                          } catch (error) {
                            console.error("Rating update failed:", error);
                          }
                        }}
                      />
                    </td>
                    {/* Click-to-cycle status badge */}
                    <td>
                      <span
                        className={`badge ${
                          partner.status === "active"
                            ? "bg-success"
                            : partner.status === "suspended"
                            ? "bg-danger"
                            : partner.status === "inactive"
                            ? "bg-secondary"
                            : "bg-warning text-dark"
                        }`}
                        style={{
                          cursor: "pointer",
                          opacity: pendingUpdates[partner.id] ? 0.6 : 1,
                          transition: "opacity 0.2s ease",
                        }}
                        title="Click to change status"
                        onClick={() => {
                          const nextStatus = getNextStatus(
                            partner.status as PartnerProfileStatus
                          );
                          partner.status = nextStatus;
                          triggerStatusUpdate(partner.id, nextStatus);
                        }}
                      >
                        {partner.status
                          ? partner.status.charAt(0).toUpperCase() +
                            partner.status.slice(1)
                          : "Pending"}
                      </span>
                    </td>

                    <td>
                      <span className="action_icons">
                        <span
                          onClick={() => handleViewPartner(partner.id)}
                          style={{ cursor: "pointer", marginRight: "8px" }}
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
                        <span
                          onClick={() => handleOpenModal(partner)}
                          style={{ cursor: "pointer" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={22}
                            height={22}
                            viewBox="0 0 22 22"
                            fill="none"
                          >
                            <path
                              d="M19.3357 6.17264L15.5812 2.41896C15.2661 2.10396 14.8388 1.927 14.3932 1.927C13.9477 1.927 13.5204 2.10396 13.2053 2.41896L2.84486 12.7786C2.6883 12.9342 2.56417 13.1193 2.47966 13.3232C2.39515 13.5271 2.35195 13.7458 2.35255 13.9665V17.721C2.35255 18.1667 2.52957 18.594 2.84468 18.9091C3.15979 19.2243 3.58717 19.4013 4.0328 19.4013H18.1469C18.4143 19.4013 18.6707 19.2951 18.8598 19.106C19.0489 18.9169 19.1551 18.6605 19.1551 18.3931C19.1551 18.1258 19.0489 17.8693 18.8598 17.6803C18.6707 17.4912 18.4143 17.385 18.1469 17.385H10.5018L19.3357 8.54936C19.4918 8.39333 19.6156 8.20807 19.7001 8.00417C19.7846 7.80026 19.8281 7.58171 19.8281 7.361C19.8281 7.14029 19.7846 6.92174 19.7001 6.71784C19.6156 6.51394 19.4918 6.32868 19.3357 6.17264ZM7.64534 17.385H4.36885V14.1085L11.4259 7.05142L14.7024 10.3279L7.64534 17.385ZM16.1306 8.8997L12.8541 5.6232L14.3949 4.08241L17.6714 7.3589L16.1306 8.8997Z"
                              fill="#4A4A4A"
                            />
                          </svg>
                        </span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
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

      <ImagePopup
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <PartnerModal
        isOpen={modalState.isOpen}
        editingPartner={modalState.editingPartner}
        onClose={handleCloseModal}
        onSave={async (data) => {
          if (modalState.editingPartner) {
            await updatePartner(modalState.editingPartner.id, data);
          } else {
            await createPartner(data);
          }
          handleCloseModal();
        }}
      />

      {/* View Partner Modal */}
      <PartnerViewModal
        isOpen={viewModal.isOpen}
        partner={viewModal.partner}
        onClose={handleCloseViewModal}
      />
    </>
  );
};
