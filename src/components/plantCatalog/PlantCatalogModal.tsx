import React from "react";
import { Loader } from "../loader";
import type { PlantCatalogItem } from "../../types/plantCatalog";
import { resolveMediaUrl } from "../../utility/util";

/** Props for the plant catalog detail modal. */
interface PlantCatalogModalProps {
  isOpen: boolean;
  plant: PlantCatalogItem | null;
  loading?: boolean;
  onClose: () => void;
}

/**
 * Dark themed modal for plant master data + care instructions.
 *
 * @param root0 Component props.
 * @param root0.isOpen Whether the modal is visible.
 * @param root0.plant Plant catalog payload, or null while loading.
 * @param root0.loading Whether detail data is currently loading.
 * @param root0.onClose Callback invoked when the modal is closed.
 * @returns The plant catalog modal UI, or null when closed.
 */
export const PlantCatalogModal: React.FC<PlantCatalogModalProps> = ({
  isOpen,
  plant,
  loading = false,
  onClose,
}) => {
  if (!isOpen) return null;

  const image = resolveMediaUrl(
    plant?.image_url ||
      plant?.image_medium_url ||
      plant?.image_regular_url ||
      plant?.image_thumbnail
  );

  const care = plant?.care_instructions;
  const careEntries = care
    ? Object.entries(care).filter(([, value]) => !!value)
    : [];

  return (
    <div
      className="modal fade show partner_details"
      style={{ display: "block", backgroundColor: "#2e3a3066" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content position-relative view_modal">
          <button
            type="button"
            className="btn-close close-btn"
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "none" }}
          >
            ✕
          </button>

          <div className="modal-body view_profile">
            {loading || !plant ? (
              <Loader text="Loading plant details..." />
            ) : (
              <>
                <div className="head_area">
                  <h4 className="head_modal">Plant Catalog</h4>
                </div>

                {image && (
                  <div className="text-center mb-3">
                    <img
                      src={image}
                      alt={plant.common_name || "Plant"}
                      style={{
                        maxWidth: "100%",
                        maxHeight: 240,
                        borderRadius: 12,
                        objectFit: "contain",
                      }}
                    />
                  </div>
                )}

                <div className="row g-3 text-start">
                  <div className="col-md-6">
                    <strong>Common Name:</strong>
                    <p className="lock_field">{plant.common_name || "—"}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Scientific Name:</strong>
                    <p className="lock_field">
                      <em>{plant.scientific_name || "—"}</em>
                    </p>
                  </div>
                  <div className="col-md-4">
                    <strong>Family:</strong>
                    <p className="lock_field">{plant.family || "—"}</p>
                  </div>
                  <div className="col-md-4">
                    <strong>Genus:</strong>
                    <p className="lock_field">{plant.genus || "—"}</p>
                  </div>
                  <div className="col-md-4">
                    <strong>Species:</strong>
                    <p className="lock_field">
                      {plant.species_epithet || "—"}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <strong>Type:</strong>
                    <p className="lock_field">
                      {plant.plant_type || plant.type || "—"}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <strong>Cycle:</strong>
                    <p className="lock_field">{plant.cycle || "—"}</p>
                  </div>
                  <div className="col-md-4">
                    <strong>Care Level:</strong>
                    <p className="lock_field">{plant.care_level || "—"}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Watering:</strong>
                    <p className="lock_field">{plant.watering || "—"}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Sunlight:</strong>
                    <p className="lock_field">{plant.sunlight || "—"}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Maintenance:</strong>
                    <p className="lock_field">{plant.maintenance || "—"}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Origin:</strong>
                    <p className="lock_field">{plant.origin || "—"}</p>
                  </div>
                  <div className="col-12">
                    <strong>Description:</strong>
                    <p className="lock_field">{plant.description || "—"}</p>
                  </div>
                </div>

                <div className="head_area mt-4">
                  <h4 className="head_modal">Care Instructions</h4>
                </div>
                {careEntries.length === 0 ? (
                  <p className="lock_field text-start">
                    No care instructions available
                  </p>
                ) : (
                  <div className="row g-3 text-start">
                    {careEntries.map(([key, value]) => (
                      <div className="col-12" key={key}>
                        <strong>
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </strong>
                        <p className="lock_field">{value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
