import { useState, useEffect } from "react";
import type { OptionItemProps } from "../../types/rules";

/**
 * Represents a single editable option item inside a rule modal.
 * Supports editing mode, saving updates, and removing the option.
 *
 * @param {OptionItemProps} root0 Component props.
 * @param {{ option_text: string }} root0.option Option object containing text.
 * @param {number} root0.index Position index of the option.
 * @param {boolean} root0.isEditing Indicates whether this option is currently being edited.
 * @param {(index: number) => void} root0.onEditStart Callback fired to start editing.
 * @param {(index: number, value: string) => void} root0.onEditSave Callback fired to save edited text.
 * @param {(index: number) => void} root0.onRemove Callback fired to remove the option.
 * @returns {JSX.Element} Rendered option item.
 */
const OptionItem = ({
  option,
  index,
  isEditing,
  onEditStart,
  onEditSave,
  onRemove,
}: OptionItemProps) => {
  const [editText, setEditText] = useState(option.option_text);

  useEffect(() => {
    if (isEditing) {
      setEditText(option.option_text);
    }
  }, [isEditing, option.option_text]);

  /**
   * Saves the edited text when the user confirms the change.
   *
   * @returns {void}
   */
  const handleSave = () => {
    if (editText.trim() === "") return;
    onEditSave(index, editText.trim());
  };

  return (
    <li>
      {isEditing ? (
        <div
          className="edit_mode"
          style={{ display: "flex", alignItems: "center" }}
        >
          <input
            className="added_list editable_span"
            type="text"
            value={editText}
            autoFocus
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            style={{
              width: "100%",
              padding: "6px 10px",
              borderRadius: "4px",
              fontSize: "14px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />

          <button
            type="button"
            className="bg_icon_et"
            onClick={handleSave}
            style={{
              border: "none",
              background: "transparent",
              marginLeft: "8px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="20"
              viewBox="0 0 70 52"
              fill="none"
            >
              <path
                d="M62.8549 0.605471C62.4525 0.203131 61.9447 0 61.4408 0C60.9368 0 60.4291 0.10156 60.0267 0.50391L22.8547 35.1519L9.01467 21.0109C8.30764 20.3039 7.09667 20.3039 6.38967 21.0109L0.530272 26.6671C-0.176758 27.3741 -0.176758 28.5851 0.530272 29.2921L21.4403 50.9091C21.8426 51.3115 22.3504 51.5146 22.8544 51.5146C23.3583 51.5146 23.8661 51.3115 24.0653 51.0107L68.7103 9.29167C69.4173 8.58464 69.4173 7.37367 68.7103 6.66667L62.8549 0.605471Z"
                fill="#F4F4F4"
              />
            </svg>
          </button>
        </div>
      ) : (
        <>
          <span className="added_list">{option.option_text}</span>

          <span className="list_icons">
            <button
              type="button"
              className="bg_icon_et"
              onClick={() => onEditStart(index)}
              style={{
                border: "none",
                background: "transparent",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M17.8585 5.69049L14.5068 2.33949C14.2255 2.05829 13.844 1.90031 13.4463 1.90031C13.0485 1.90031 12.6671 2.05829 12.3858 2.33949L3.13677 11.5877C2.99701 11.7267 2.88619 11.8919 2.81075 12.074C2.73531 12.256 2.69674 12.4512 2.69727 12.6482V16C2.69727 16.3978 2.85531 16.7794 3.13661 17.0607C3.41792 17.342 3.79945 17.5 4.19727 17.5H16.7973C17.036 17.5 17.2649 17.4052 17.4337 17.2364C17.6025 17.0676 17.6973 16.8387 17.6973 16.6C17.6973 16.3613 17.6025 16.1324 17.4337 15.9636C17.2649 15.7948 17.036 15.7 16.7973 15.7H9.97227L17.8585 7.81224C17.9979 7.67295 18.1084 7.50756 18.1838 7.32553C18.2593 7.14351 18.2981 6.9484 18.2981 6.75137C18.2981 6.55434 18.2593 6.35923 18.1838 6.1772C18.1084 5.99518 17.9979 5.82979 17.8585 5.69049ZM7.42227 15.7H4.49727V12.775L10.7973 6.47499L13.7223 9.39999L7.42227 15.7ZM14.9973 8.12499L12.0723 5.19999L13.4478 3.82449L16.3728 6.74949L14.9973 8.12499Z"
                  fill="#f4f4f4"
                />
              </svg>
            </button>
          </span>
        </>
      )}

      <span className="list_icons">
        <button
          type="button"
          className="bg_icon_et"
          onClick={() => onRemove(index)}
          style={{
            border: "none",
            background: "transparent",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={17}
            viewBox="0 0 16 17"
            fill="none"
          >
            <path
              d="M14.4854 2.76467H11.3604V2.13967C11.3604 1.64239 11.1628 1.16548 10.8112 0.813848C10.4595 0.462217 9.98263 0.264673 9.48535 0.264673H5.73535C5.23807 0.264673 4.76116 0.462217 4.40953 0.813848C4.0579 1.16548 3.86035 1.64239 3.86035 2.13967V2.76467H0.735352C0.569591 2.76467 0.41062 2.83052 0.29341 2.94773C0.1762 3.06494 0.110352 3.22391 0.110352 3.38967C0.110352 3.55543 0.1762 3.7144 0.29341 3.83161C0.41062 3.94882 0.569591 4.01467 0.735352 4.01467H1.36035V15.2647C1.36035 15.5962 1.49205 15.9141 1.72647 16.1486C1.96089 16.383 2.27883 16.5147 2.61035 16.5147H12.6104C12.9419 16.5147 13.2598 16.383 13.4942 16.1486C13.7287 15.9141 13.8604 15.5962 13.8604 15.2647V4.01467H14.4854C14.6511 4.01467 14.8101 3.94882 14.9273 3.83161C15.0445 3.7144 15.1104 3.55543 15.1104 3.38967C15.1104 3.22391 15.0445 3.06494 14.9273 2.94773C14.8101 2.83052 14.6511 2.76467 14.4854 2.76467Z"
              fill="#F4F4F4"
            />
          </svg>
        </button>
      </span>
    </li>
  );
};

export default OptionItem;
