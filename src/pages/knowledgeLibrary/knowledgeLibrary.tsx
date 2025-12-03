import React, { useEffect, useState } from "react";
import "./knowledgeLibrary.css";
import { useKnowledgeLibrary } from "../../hooks/useKnowledgeLibrary";
import type { Plant } from "../../types/plants";
import { useToast } from "../../hooks/useToast";
import { PlantModal } from "../../components/knowledgeLibrary";

/**
 * Knowledge Library page for managing and browsing plants.
 *
 * @returns {JSX.Element} The Knowledge Library component.
 */
export const KnowledgeLibrary: React.FC = () => {
  const {
    plants,
    loading,
    error,
    search,
    setSearch,
    currentPage,
    totalPages,
    goToPage,
    updatePlant,
    deletePlant,
    createPlant,
  } = useKnowledgeLibrary();

  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("edit");
  const [modalOpen, setModalOpen] = useState(false);
  const { showError } = useToast();

  /**
   * Opens the edit modal for a plant.
   *
   * @param {Plant} plant The plant to edit.
   * @returns {void}
   */
  const openEditModal = (plant: Plant): void => {
    setSelectedPlant(plant);
    setModalMode("edit");
    setModalOpen(true);
  };

  /**
   * Opens the modal for creating a new plant.
   *
   * @returns {void}
   */
  const openCreateModal = (): void => {
    setSelectedPlant(null);
    setModalMode("create");
    setModalOpen(true);
  };

  /**
   * Closes the modal and resets selected plant.
   *
   * @returns {void}
   */
  const closeModal = (): void => {
    setModalOpen(false);
    setSelectedPlant(null);
  };

  useEffect(() => {
    if (error) {
      showError(`Error: ${error}`);
    }
  }, [error, showError]);

  return (
    <div className="kl-page">
      <div className="kl-content">
        <input
          type="text"
          className="kl-search"
          placeholder="Search plants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="kl-add-btn" onClick={openCreateModal}>
          + Add New Plant
        </button>

        <div className="kl-wrapper">
          <button
            className="kl-arrow kl-arrow-left"
            disabled={currentPage === 1 || loading}
            onClick={() => goToPage(currentPage - 1)}
          >
            ❮
          </button>

          <div className="kl-grid-wrapper">
            {loading && (
              <div className="kl-grid-loader">
                <div className="spinner"></div>
              </div>
            )}

            <div className={`kl-grid ${loading ? "kl-grid-blur" : ""}`}>
              {plants.map((p) => (
                <div
                  className="kl-card"
                  key={p.id}
                  onClick={() => openEditModal(p)}
                >
                  <img
                    src={p.image_search_url}
                    alt={p.common_name || p.scientific_name}
                    className="kl-img"
                  />
                  <div className="kl-info">
                    <div className="kl-common">{p.common_name}</div>
                    <div className="kl-scientific">{p.scientific_name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="kl-arrow kl-arrow-right"
            disabled={currentPage === totalPages || loading}
            onClick={() => goToPage(currentPage + 1)}
          >
            ❯
          </button>
        </div>

        <div className="kl-page-indicator">
          <span className="kl-page-number">
            {loading ? "Loading..." : `Page ${currentPage} of ${totalPages}`}
          </span>

          <div className="kl-dots">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div
                key={i}
                className={`kl-dot ${currentPage === i + 1 ? "active" : ""} ${
                  loading ? "kl-dot-disabled" : ""
                }`}
                onClick={() => !loading && goToPage(i + 1)}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* UNIFIED MODAL */}
      {modalOpen && (
        <PlantModal
          plant={selectedPlant}
          mode={modalMode}
          onClose={closeModal}
          onUpdate={async (id, data) => {
            await updatePlant(id.toString(), data);
            closeModal();
          }}
          onDelete={async (id) => {
            await deletePlant(id.toString());
            closeModal();
          }}
          onCreate={async (data) => {
            await createPlant(data);
            closeModal();
          }}
        />
      )}
    </div>
  );
};
