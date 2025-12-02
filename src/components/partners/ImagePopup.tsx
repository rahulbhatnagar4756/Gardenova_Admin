import type { ImagePopupProps } from "../../types";

/**
 * Image preview popup modal that displays a full-size image
 * and allows closing the popup via callback.
 *
 * @param {ImagePopupProps} root0 Component props.
 * @param {string} root0.imageUrl Image URL or base64 string to display.
 * @param {() => void} root0.onClose Callback triggered when the popup is closed.
 * @returns {JSX.Element | null} Rendered popup component or null when no image is provided.
 */
export const ImagePopup = ({ imageUrl, onClose }: ImagePopupProps) => {
  if (!imageUrl) return null;

  return (
    <div className="image-overlay" onClick={onClose}>
      <div className="image-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <img src={imageUrl} alt="Enlarged" className="popup-img" />
      </div>
    </div>
  );
};
