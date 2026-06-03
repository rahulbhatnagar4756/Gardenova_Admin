// components/partners/PartnerViewModal.tsx
import React, { useState, useEffect } from "react";
import "../../styles/global.css";
import { Loader } from "../loader";
import type { PartnerViewModalProps } from "../../types/partnerProfile";
import type { Plant } from "../../types/adminPlants";

/**
 * Parses assessment string like "3,50" to a readable display string.
 * 
 * @param {string | null | undefined} assessment  The assessment value to format.
 * @returns {string} The formatted assessment string, or "N/A" if not provided.
 */
// const formatAssessment = (assessment?: string | null): string => {
//   if (!assessment) return "N/A";
//   return assessment.replace(",", ".");
// };

/**
 * Extended props for PartnerViewModal supporting both view and edit modes.
 */
interface PartnerViewModalExtendedProps extends PartnerViewModalProps {
  /** When "edit", renders editable form fields instead of read-only display. */
  mode?: "view" | "edit";
  /** Called with updated partner data when the user saves in edit mode. */
  onSave?: (id: string, data: Partial<Plant>) => Promise<void>;
}

/**
 * Modal displaying full details of a partner profile.
 * Supports both read-only "view" mode and editable "edit" mode.
 *
 * @param root0 Component props.
 * @param root0.isOpen Whether the modal is visible.
 * @param root0.partner The partner data to display, or null while loading.
 * @param root0.onClose Callback to close the modal.
 * @param root0.mode "view" (default) or "edit" to enable editable fields.
 * @param root0.onSave Async callback receiving (id, updatedFields) on save.
 * @returns The partner view/edit modal UI, or null if closed.
 */
export const PartnerViewModal: React.FC<PartnerViewModalExtendedProps> = ({
  isOpen,
  partner: plant, // prop name kept for compatibility
  onClose,
  mode = "view",
  onSave,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    scientific_name: "",
    common_name: "",
    family: "",
    plant_type: "",
    care_level: "",
    watering: "",
    sunlight: "",
    cycle: "",
    description: "",
  });

  useEffect(() => {
    if (plant) {
      setForm({
        scientific_name: plant.scientific_name || "",
        common_name:     plant.common_name     || "",
        family:          plant.family          || "",
        plant_type:      plant.plant_type      || plant.type || "",
        care_level:      plant.care_level      || "",
        watering:        plant.watering        || "",
        sunlight:        plant.sunlight        || "",
        cycle:           plant.cycle           || "",
        description:     plant.description     || "",
      });
    }
  }, [plant, mode]);

  if (!isOpen) return null;

  const isEdit = mode === "edit";
  const inputCls = "form-control lock_field";
/**
 * Handles form field changes and updates the form state.
 *
 * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} e
 * Event triggered when an input, textarea, or select value changes.
 *
 * @returns {void}
 */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
/**
 * Saves the current plant details by invoking the provided save callback.
 *
 * The function:
 * - Validates that a plant and save handler are available.
 * - Sets the saving state while the operation is in progress.
 * - Sends the updated plant data to the save handler.
 * - Closes the dialog on successful save.
 * - Logs any errors encountered during the save operation.
 * - Resets the saving state when the operation completes.
 *
 * @async
 * @function handleSave
 * @returns {Promise<void>} Resolves when the save operation completes.
 */
  const handleSave = async () => {
    if (!plant || !onSave) return;
    setIsSaving(true);
    try {
      await onSave(String(plant.plant_id), {
        scientific_name: form.scientific_name,
        common_name:     form.common_name,
        family:          form.family,
        plant_type:      form.plant_type,
        care_level:      form.care_level,
        watering:        form.watering,
        sunlight:        form.sunlight,
        cycle:           form.cycle,
        description:     form.description,
      });
      onClose();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Pick the best available image
  const imgUrl =
  plant?.image_url  ||
    plant?.image_thumbnail  ||
    plant?.image_small_url  ||
    plant?.image_medium_url ||
    plant?.image_regular_url;

  return (
    <div
      className="modal fade show partner_details"
      style={{ display: "block", backgroundColor: "#2e3a3066" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content position-relative view_modal">
          {/* Close Button */}
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
            {!plant ? (
              <Loader text="Loading plant details..." />
            ) : (
              <>
                <div className="head_area">
                  <h4 className="head_modal">
                    {isEdit ? "Edit Plant" : "Plant Details"}
                  </h4>
                </div>

                <div className="row g-3 text-start">

                  {/* Common Name */}
                  <div className="col-md-6">
                    <strong>Common Name:</strong>
                    {isEdit ? (
                      <input
                        className={inputCls}
                        name="common_name"
                        value={form.common_name}
                        onChange={handleChange}
                        placeholder="Common Name"
                      />
                    ) : (
                      <p className="lock_field">{plant.common_name || "N/A"}</p>
                    )}
                  </div>

                  {/* Scientific Name */}
                  <div className="col-md-6">
                    <strong>Scientific Name:</strong>
                    {isEdit ? (
                      <input
                        className={inputCls}
                        name="scientific_name"
                        value={form.scientific_name}
                        onChange={handleChange}
                        placeholder="Scientific Name"
                      />
                    ) : (
                      <p className="lock_field">
                        <em>{plant.scientific_name || "N/A"}</em>
                      </p>
                    )}
                  </div>

                  {/* Family */}
                  <div className="col-md-6">
                    <strong>Family:</strong>
                    {isEdit ? (
                      <input
                        className={inputCls}
                        name="family"
                        value={form.family}
                        onChange={handleChange}
                        placeholder="Family"
                      />
                    ) : (
                      <p className="lock_field">{plant.family || "N/A"}</p>
                    )}
                  </div>

                  {/* Plant Type */}
                  <div className="col-md-6">
                    <strong>Type:</strong>
                    {isEdit ? (
                      <input
                        className={inputCls}
                        name="plant_type"
                        value={form.plant_type}
                        onChange={handleChange}
                        placeholder="Plant Type"
                      />
                    ) : (
                      <p className="lock_field">{plant.plant_type || plant.type || "N/A"}</p>
                    )}
                  </div>

                  {/* Cycle */}
                  <div className="col-md-6">
                    <strong>Cycle:</strong>
                    {isEdit ? (
                      <input
                        className={inputCls}
                        name="cycle"
                        value={form.cycle}
                        onChange={handleChange}
                        placeholder="Cycle"
                      />
                    ) : (
                      <p className="lock_field">{plant.cycle || "N/A"}</p>
                    )}
                  </div>

                  {/* Care Level */}
                  <div className="col-md-6">
                    <strong>Care Level:</strong>
                    {isEdit ? (
                      <select
                        className={inputCls}
                        name="care_level"
                        value={form.care_level}
                        onChange={handleChange}
                      >
                        <option value="">Select care level</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    ) : (
                      <p className="lock_field">
                        {plant.care_level ? (
                          <span
                            className={`badge ${
                              plant.care_level.toLowerCase() === "easy"
                                ? "bg-success"
                                : plant.care_level.toLowerCase() === "medium"
                                ? "bg-warning text-dark"
                                : "bg-danger"
                            }`}
                          >
                            {plant.care_level}
                          </span>
                        ) : (
                          <span style={{ color: "#ccc" }}>—</span>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Watering */}
                  <div className="col-md-6">
                    <strong>Watering:</strong>
                    {isEdit ? (
                      <input
                        className={inputCls}
                        name="watering"
                        value={form.watering}
                        onChange={handleChange}
                        placeholder="Watering frequency"
                      />
                    ) : (
                      <p className="lock_field">{plant.watering || "N/A"}</p>
                    )}
                  </div>

                  {/* Sunlight */}
                  <div className="col-md-6">
                    <strong>Sunlight:</strong>
                    {isEdit ? (
                      <input
                        className={inputCls}
                        name="sunlight"
                        value={form.sunlight}
                        onChange={handleChange}
                        placeholder="Sunlight requirement"
                      />
                    ) : (
                      <p className="lock_field">{plant.sunlight || "N/A"}</p>
                    )}
                  </div>

                  {/* Description — full width */}
                  <div className="col-md-12">
                    <strong>Description:</strong>
                    {isEdit ? (
                      <textarea
                        className={inputCls}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description"
                        rows={3}
                      />
                    ) : (
                      <p className="lock_field">{plant.description || "N/A"}</p>
                    )}
                  </div>

                  {/* Plant Image */}
                  {imgUrl && (
                    <div className="col-md-12 text-center mt-4">
                      <strong>Plant Image:</strong>
                      <div className="position-relative mt-2">
                        {!imageLoaded && <Loader text="Loading plant image..." />}
                        <img
                          src={imgUrl}
                          alt={plant.common_name || "Plant"}
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

                  {/* Save / Cancel (edit mode only) */}
                  {isEdit && (
                    <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="common_button btn"
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                              aria-hidden="true"
                            />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
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