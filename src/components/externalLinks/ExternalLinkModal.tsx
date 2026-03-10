import { useEffect, useState } from "react";
import type { ExternalLinkModalProps } from "../../types/externalLinks";

/**
 * ExternalLinkModal component.
 *
 * Used to create or edit an external link.
 *
 * @param props Component props
 * @param props.isOpen Controls modal visibility
 * @param props.editingLink External link being edited, null when creating
 * @param props.onClose Callback to close the modal
 * @param props.onSave Callback to save the external link
 *
 * @returns JSX element or null when modal is closed
 */
const ExternalLinkModal = ({ isOpen, editingLink, onClose, onSave }: ExternalLinkModalProps) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  
  /**
   * Sync form state when modal opens or editing link changes.
   */
  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title);
      setUrl(editingLink.url || "");
      setIsActive(editingLink.is_active);
    } else {
      setTitle("");
      setUrl("");
      setIsActive(true);
    }
  }, [editingLink, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="external_link_modal question_modal">
      <div className="modal_content">
        <div className="head_area">
        <button className="close_btn" onClick={onClose}>✕</button>
        <h4 style={{color:"#fff"}}>{editingLink ? "Edit Link" : "Add Externals Link"}</h4>
        </div>
      <div className="input_field">
        <label htmlFor="title">Title <span className="text-danger">*</span></label>
        <input
        id="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control"

        />
      </div>

      <div className="input_field">
        <label htmlFor="url">URL <span className="text-danger">*</span></label>
        <input
        id="url"
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="form-control"

        />
      </div>
      <div className="input_field">
        <label htmlFor="check">Active</label>
          <input
            id="check"
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
          />
          
      </div>

        <div className="modal_actions">
          <button className="cancel_btn" onClick={onClose}>Cancel</button>
          <button className="save_btn" onClick={() => onSave({ title, url, is_active: isActive })}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExternalLinkModal;





