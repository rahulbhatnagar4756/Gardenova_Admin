// components/ImagePopup.tsx
interface ImagePopupProps {
  imageUrl: string | null;
  onClose: () => void;
}

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
