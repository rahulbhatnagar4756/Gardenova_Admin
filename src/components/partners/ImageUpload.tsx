// components/ImageUpload.tsx
import { useRef, useState, useEffect } from "react";
import type { ImageUploadProps } from "../../types";
import { useToast } from "../../hooks/useToast";

/**
 * Image uploader component that supports previewing,
 * validating, and clearing an image. Accepts an image URL
 * and returns the updated base64 string when changed.
 *
 * @param {ImageUploadProps} root0 Component properties.
 * @param {string} root0.imageUrl Existing image URL or base64 string to display as preview.
 * @param {(image: string) => void} root0.onImageChange Callback fired when an image is selected or removed.
 * @returns {JSX.Element} The rendered image upload component.
 */
export const ImageUpload = ({ imageUrl, onImageChange }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { showWarning } = useToast();

  useEffect(() => {
    setPreview(imageUrl || null);
  }, [imageUrl]);

  /**
   * Handles file input change, validates the image,
   * converts it to a base64 string, and updates preview state.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e File input change event.
   * @returns {void}
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showWarning("Please select a valid image file (PNG, JPG, JPEG)");
      return;
    }

    const reader = new FileReader();
    /**
     * Reads the file and updates the preview + parent callback.
     *
     * @returns {void}
     */
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      onImageChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Clears the selected image preview and resets
   * file input & parent callback value.
   *
   * @returns {void}
   */
  const removeImage = () => {
    setPreview(null);
    onImageChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="input_field">
      <label>
        Upload Professional Photo<span className="text-danger">*</span>
      </label>
      <div className="position-relative">
        {!preview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className=" p-4 text-center cursor-pointer"
            style={{
              minHeight: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* <div className="mb-2">
              <i className="fas fa-cloud-upload-alt fa-2x text-warning"></i>
            </div> */}
            <small className="text-muted">
              File should be .png, .jpg format.
            </small>
            <strong>Upload Professional Photo</strong>
          </div>
        ) : (
          <div className="position-relative">
            <img
              src={preview}
              alt="Preview"
              className="w-100 rounded"
              style={{ height: "120px", objectFit: "cover" }}
            />
            <button
              type="button"
              onClick={removeImage}
              className="btn btn-sm btn-danger position-absolute"
              style={{ top: "5px", right: "5px" }}
            >
              ×
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};
