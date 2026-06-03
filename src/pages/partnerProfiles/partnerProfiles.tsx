// partnerProfiles.tsx
import { useEffect, useState, useCallback } from "react";
import "./partnerProfiles.css";
import { usePartnerProfiles } from "../../hooks/usePartnerProfiles";
import { Pagination } from "../../components/pagination";
import { useToast } from "../../hooks/useToast";
import { ImagePopup } from "../../components/partners/ImagePopup";
import { CsvUploadModal } from "../../components/partners/CsvUploadModal";
import { PartnerViewModal } from "../../components/partners/PartnerViewModal";
import { TableLoader } from "../../components/loader";
import type { Plant } from "../../types/adminPlants"; // ← updated import
import type { PartnerProfilesProps } from "../../types/partnerProfile";

/** Shared modal state shape used for both view and edit. */
interface ModalState {
  isOpen: boolean;
  mode: "view" | "edit";
  plant: Plant | null; // ← was partner
}

const CLOSED_MODAL: ModalState = { isOpen: false, mode: "view", plant: null };

/**
 * Plant listing page component.
 *
 * @param {PartnerProfilesProps} props Component props
 * @param {number | undefined} props.limit Initial items per page
 * @returns {JSX.Element} The rendered Plant list component.
 */
export const PartnerProfiles = ({ limit }: PartnerProfilesProps) => {
  const {
    plant,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    limit: serverLimit,
    goToPage,
    setItemsPerPage,
    uploadPartnersCsv,
    getPartnerById,
    updatePartner,
  } = usePartnerProfiles({
    initialLimit: limit ?? 5,
  });

  const { showError } = useToast();

  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
   * Opens the modal and loads plant details from API.
   *
   * @param {string} plantId The plant's ID.
   * @param {"view" | "edit"} mode Modal mode.
   */
  const handleOpenModal = async (plantId: string, mode: "view" | "edit") => {
  try {
    setModal({ isOpen: true, mode, plant: null });
    const fetched = await getPartnerById(plantId);
    if (fetched) {
      // Normalize: single plant API uses "id", list uses "plant_id"
      const normalized = {
        ...fetched,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        plant_id: fetched.plant_id ?? (fetched as any).id,
      };
      setModal({ isOpen: true, mode, plant: normalized as Plant });
    } else {
      setModal(CLOSED_MODAL);
    }
  } catch (err) {
    console.error("Failed to load plant details:", err);
    showError("Failed to fetch plant details");
    setModal(CLOSED_MODAL);
  }
};
/**
 * Closes the plant modal and resets its state to the default closed state.
 *
 * @returns {void}
 */
const handleCloseModal = () => setModal(CLOSED_MODAL);

  /**
   * Saves edited plant details.
   *
   * @param {string} id Plant ID.
   * @param {Partial<Plant>} data Partial plant data to update.
   */
  const handleSavePlant = async (id: string, data: Partial<Plant>) => {
    const payload = {
      scientific_name: data.scientific_name,
      common_name: data.common_name,
      family: data.family,
      plant_type: data.plant_type,
      care_level: data.care_level,
      watering: data.watering,
      sunlight: data.sunlight,
      cycle: data.cycle,
      description: data.description,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updatePartner(id, payload as any);
  };
/**
 * Uploads a CSV file containing partner data.
 *
 * @async
 * @param {File} file  The CSV file selected by the user.
 * @returns {Promise<void>} Resolves when the upload completes.
 */
  const handleCsvUpload = async (file: File) => {
    await uploadPartnersCsv(file);
  };

  /**
   * Returns the best available image URL from a plant record.
   *
   * @param {Plant} p The plant record.
   * @returns {string | undefined} The URL of the best available image, or undefined if none found.
   */
  const getPlantImage = (p: Plant): string | undefined =>
    p.image_url ||
    p.image_small_url ||
    p.image_medium_url ||
    p.image_regular_url ||
    undefined;

  return (
    <>
      <div className="main_page">
        <div className="main_heading_area">
          <div className="row g-3">
            <div className="col">
              <h4 className="page_heading">Manage Plants</h4>
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
                Add Plants
              </button>
            </div>
          </div>
        </div>

        <div className="mp_table">
          <table className="table mb-0">
            <thead>
              <tr>
                <th scope="col">Image</th>
                <th scope="col">Common Name</th>
                <th scope="col">Scientific Name</th>
                <th scope="col">Family</th>
                <th scope="col">Type</th>
                <th scope="col">Cycle</th>
                <th scope="col">Care Level</th>
                <th scope="col">Watering</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableLoader />
              ) : (plant ?? []).length > 0 ? (
                plant?.map((p) => {
                  const imgUrl = getPlantImage(p);

                  return (
                    <tr key={p.plant_id}>
                      {/* Image */}
                      <td scope="row">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            className="profile_img"
                            alt={p.common_name || "Plant"}
                            onClick={() => setSelectedImage(imgUrl)}
                            style={{ cursor: "pointer" }}
                          />
                        ) : (
                          <div className="profile_img no-image">No Image</div>
                        )}
                      </td>

                      {/* Common Name */}
                      <td>{p.common_name || "N/A"}</td>

                      {/* Scientific Name */}
                      <td>
                        <em>{p.scientific_name || "N/A"}</em>
                      </td>

                      {/* Family */}
                      <td>{p.family || "N/A"}</td>

                      {/* Plant Type */}
                      <td>{p.plant_type || p.type || "N/A"}</td>

                      {/* Cycle */}
                      <td>{p.cycle || "N/A"}</td>

                      {/* Care Level */}
                      <td>
                        {p.care_level ? (
                          <span
                            className={`badge ${
                              p.care_level.toLowerCase() === "easy"
                                ? "bg-success"
                                : p.care_level.toLowerCase() === "medium"
                                ? "bg-warning text-dark"
                                : "bg-danger"
                            }`}
                          >
                            {p.care_level}
                          </span>
                        ) : (
                          <span style={{ color: "#ccc" }}>—</span>
                        )}
                      </td>

                      {/* Watering */}
                      <td>{p.watering || "N/A"}</td>

                      {/* Actions */}
                      <td>
                        <span
                          className="action_icons"
                          style={{ display: "flex", alignItems: "center", gap: "10px" }}
                        >
                          {/* 👁 View Details */}
                          <span
                            onClick={() =>
                              handleOpenModal(String(p.plant_id), "view")
                            }
                            style={{ cursor: "pointer" }}
                            title="View Plant Details"
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

                          {/* ✏️ Edit Plant */}
                          <span
                            onClick={() =>
                              handleOpenModal(String(p.plant_id), "edit")
                            }
                            style={{ cursor: "pointer" }}
                            title="Edit Plant"
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
                  <td colSpan={9} style={{ textAlign: "center", padding: "20px" }}>
                    No plants found
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

      <PartnerViewModal
        isOpen={modal.isOpen}
        partner={modal.plant} // adapt once PartnerViewModal supports Plant
        onClose={handleCloseModal}
        mode={modal.mode}
        onSave={handleSavePlant }
      />
    </>
  );
};