// components/partners/PartnerViewModal.tsx
import React, { useState, useEffect } from "react";
import "../../styles/global.css";
import { Loader } from "../loader";
import type { PartnerProfileResponse, PartnerViewModalProps } from "../../types/partnerProfile";

/**
 * Parses assessment string like "3,50" to a readable display string.
 * 
 * @param {string | null | undefined} assessment  The assessment value to format.
 * @returns {string} The formatted assessment string, or "N/A" if not provided.
 */
const formatAssessment = (assessment?: string | null): string => {
  if (!assessment) return "N/A";
  return assessment.replace(",", ".");
};

/**
 * Extended props for PartnerViewModal supporting both view and edit modes.
 */
interface PartnerViewModalExtendedProps extends PartnerViewModalProps {
  /** When "edit", renders editable form fields instead of read-only display. */
  mode?: "view" | "edit";
  /** Called with updated partner data when the user saves in edit mode. */
  onSave?: (id: string, data: Partial<PartnerProfileResponse>) => Promise<void>;
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
  partner,
  onClose,
  mode = "view",
  onSave,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ── Editable form state ──
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    category: "",
    description: "",
    address: "",
    city: "",
    state: "",
    telefone: "",
    whatsapp: "",
    website: "",
    instagram: "",
  });

  // Populate form when partner data arrives or mode changes
  useEffect(() => {
    if (partner) {
      setForm({
        companyName: partner.companyName || "",
        email: partner.email || "",
        category: partner.category || "",
        description: partner.description || "",
        address: partner.location?.address || "",
        city: partner.location?.city || "",
        state: partner.location?.state || "",
        telefone: partner.contact?.telefone || "",
        whatsapp: partner.contact?.whatsapp || "",
        website: partner.contact?.website || "",
        instagram: partner.contact?.instagram || "",
      });
    }
  }, [partner, mode]);

  if (!isOpen) return null;

  const isEdit = mode === "edit";

/**
 * Generic change handler for all text inputs.
 * 
 * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e  The change event triggered by the input.
 */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Builds the nested update payload and calls onSave.
   * Only closes the modal on success — stays open so the user can fix errors.
   */
  const handleSave = async () => {
    if (!partner || !onSave) return;
    setIsSaving(true);
    try {
      await onSave(partner.id, {
        companyName: form.companyName,
        email: form.email,
        category: form.category,
        description: form.description,
        location: {
          address: form.address,
          city: form.city,
          state: form.state,
        },
        contact: {
          telefone: form.telefone,
          whatsapp: form.whatsapp,
          website: form.website,
          instagram: form.instagram,
        },
      });
      // ✅ Only close on success — onSave throws on API failure
      onClose();
    } catch (err) {
      // Error toast is already shown by the hook; just keep modal open
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Shared input style ──
  const inputCls = "form-control lock_field";

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
            {!partner ? (
              <Loader text="Loading partner profiles..." />
            ) : (
              <>
                <div className="head_area">
                  <h4 className="head_modal">
                    {isEdit ? "Edit Partner" : "Partner Details"}
                  </h4>
                </div>

                <div className="row g-3 text-start">
                  {/* ── Basic Info ── */}
                  <div className="col-md-6">
                    <strong>Company Name:</strong>
                    {isEdit ? (
                      <input
                        className={inputCls}
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="Company Name"
                      />
                    ) : (
                      <p className="lock_field">{partner.companyName || "N/A"}</p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <strong>Email:</strong>
                    {isEdit ? (
                      <input
                        className={inputCls}
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                      />
                    ) : (
                      <p className="lock_field">{partner.email || "N/A"}</p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <strong>Category:</strong>
                    {isEdit ? (
                      <input
                        className={inputCls}
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="Category"
                      />
                    ) : (
                      <p className="lock_field">{partner.category || "N/A"}</p>
                    )}
                  </div>

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
                      <p className="lock_field">{partner.description || "N/A"}</p>
                    )}
                  </div>

                  {/* ── Location ── */}
                  <div className="col-md-12">
                    <strong>Address:</strong>
                    {isEdit ? (
                      <input
                        className={inputCls}
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Address"
                      />
                    ) : (
                      <p className="lock_field">
                        {partner.location?.address || "N/A"}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <strong>City:</strong>
                    {isEdit ? (
                      <input
                        className={inputCls}
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="City"
                      />
                    ) : (
                      <p className="lock_field">
                        {partner.location?.city || "N/A"}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <strong>State:</strong>
                    {isEdit ? (
                      <input
                        className={inputCls}
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="State"
                      />
                    ) : (
                      <p className="lock_field">
                        {partner.location?.state || "N/A"}
                      </p>
                    )}
                  </div>

                  {/* ── Contact ── */}
                  <div className="col-md-6">
                    <strong>Phone:</strong>
                    {isEdit ? (
                      <input
                        className={inputCls}
                        name="telefone"
                        value={form.telefone}
                        onChange={handleChange}
                        placeholder="Phone"
                      />
                    ) : (
                      <p className="lock_field">
                        {partner.contact?.telefone || "N/A"}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <strong>WhatsApp:</strong>
                    {isEdit ? (
                      <input
                        className={inputCls}
                        name="whatsapp"
                        value={form.whatsapp}
                        onChange={handleChange}
                        placeholder="WhatsApp"
                      />
                    ) : (
                      <p className="lock_field">
                        {partner.contact?.whatsapp || "N/A"}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <strong>Website:</strong>
                    {isEdit ? (
                      <input
                        className={inputCls}
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                        placeholder="Website"
                      />
                    ) : (
                      <p className="lock_field">
                        {partner.contact?.website || "N/A"}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <strong>Instagram:</strong>
                    {isEdit ? (
                      <input
                        className={inputCls}
                        name="instagram"
                        value={form.instagram}
                        onChange={handleChange}
                        placeholder="Instagram"
                      />
                    ) : (
                      <p className="lock_field">
                        {partner.contact?.instagram || "N/A"}
                      </p>
                    )}
                  </div>

                  {/* ── Ratings (read-only even in edit mode) ── */}
                  <div className="col-md-6">
                    <strong>Rating:</strong>
                    <p className="lock_field">
                      {formatAssessment(partner.ratings?.assessment)}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <strong>No. of Reviews:</strong>
                    <p className="lock_field">
                      {partner.ratings?.numAvaliacoes ?? "N/A"}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <strong>Verified Source:</strong>
                    <p className="lock_field">
                      {partner.verifiedSource || "N/A"}
                    </p>
                  </div>

                  {/* ── Project Image ── */}
                  {partner.image_url && (
                    <div className="col-md-12 text-center mt-4">
                      <strong>Project Image:</strong>
                      <div className="position-relative mt-2">
                        {!imageLoaded && (
                          <Loader text="Loading project image." />
                        )}
                        <img
                          src={partner.image_url}
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

                  {/* ── Save / Cancel buttons (edit mode only) ── */}
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