import { useCallback, useEffect, useState } from "react";
import "../../styles/adminList.css";
import { usePlantCatalog } from "../../hooks/usePlantCatalog";
import { Pagination } from "../../components/pagination";
import { useToast } from "../../hooks/useToast";
import { TableLoader } from "../../components/loader";
import { PlantCatalogModal } from "../../components/plantCatalog/PlantCatalogModal";
import type { PlantCatalogItem } from "../../types/plantCatalog";
import { resolveMediaUrl } from "../../utility/util";

/**
 * Admin Plant Catalog page — plant master data with care instructions.
 *
 * @returns The plant catalog page UI.
 */
export const PlantCatalog = () => {
  const {
    plants,
    loading,
    error,
    currentPage,
    totalCount,
    limit,
    filters,
    detailLoading,
    goToPage,
    updateFilters,
    getPlantById,
  } = usePlantCatalog(20);

  const { showError } = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] =
    useState<PlantCatalogItem | null>(null);

  useEffect(() => {
    if (error) showError(`Error: ${error}`);
  }, [error, showError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if ((filters.search || "") === searchInput) return;
      updateFilters({ search: searchInput });
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, updateFilters]);

  const handlePageChange = useCallback(
    (page: number) => goToPage(page),
    [goToPage]
  );

  /**
   * Opens the plant detail modal and loads full catalog data.
   *
   * @param id Plant numeric identifier.
   * @returns {Promise<void>}
   */
  const openDetail = async (id: number) => {
    setIsModalOpen(true);
    setSelectedPlant(null);
    const detail = await getPlantById(id);
    if (detail) setSelectedPlant(detail);
    else setIsModalOpen(false);
  };

  /**
   * Closes the plant detail modal and clears selection.
   *
   * @returns {void}
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlant(null);
  };

  /**
   * Picks the best available image URL for a catalog plant.
   *
   * @param plant Plant catalog record.
   * @returns Resolved media URL, or undefined when no image exists.
   */
  const getImage = (plant: PlantCatalogItem) =>
    resolveMediaUrl(
      plant.image_url ||
        plant.image_thumbnail ||
        plant.image_small_url ||
        plant.image_medium_url
    );

  return (
    <>
      <div className="main_page">
        <div className="main_heading_area">
          <div className="row g-3 align-items-center">
            <div className="col">
              <h4 className="page_heading">Admin Plant Catalog</h4>
            </div>
            <div className="col-auto">
              <div className="input_field mb-0">
                <input
                  type="text"
                  className="filter_control"
                  placeholder="Search name, species, genus..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  style={{ minWidth: 280 }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mp_table">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Image</th>
                <th>Common Name</th>
                <th>Scientific Name</th>
                <th>Family</th>
                <th>Genus / Species</th>
                <th>Care Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableLoader />
              ) : plants.length > 0 ? (
                plants.map((plant) => {
                  const img = getImage(plant);
                  return (
                    <tr key={plant.plant_id}>
                      <td>
                        {img ? (
                          <img
                            src={img}
                            alt={plant.common_name || "Plant"}
                            className="admin_thumb"
                            onClick={() => openDetail(plant.plant_id)}
                          />
                        ) : (
                          <div className="admin_thumb_placeholder">No img</div>
                        )}
                      </td>
                      <td>{plant.common_name || "—"}</td>
                      <td>
                        <em>{plant.scientific_name || "—"}</em>
                      </td>
                      <td>{plant.family || "—"}</td>
                      <td>
                        {[plant.genus, plant.species_epithet]
                          .filter(Boolean)
                          .join(" ") || "—"}
                      </td>
                      <td>{plant.care_level || "—"}</td>
                      <td>
                        <div className="action_icons">
                          <span
                            title="View details"
                            onClick={() => openDetail(plant.plant_id)}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 5C7 5 2.73 8.11 1 12C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 12C21.27 8.11 17 5 12 5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                                fill="#313131"
                              />
                            </svg>
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No plants found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {!loading && totalCount > 0 && (
            <Pagination
              totalItems={totalCount}
              itemsPerPage={limit}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      <PlantCatalogModal
        isOpen={isModalOpen}
        plant={selectedPlant}
        loading={detailLoading || (isModalOpen && !selectedPlant)}
        onClose={closeModal}
      />
    </>
  );
};
