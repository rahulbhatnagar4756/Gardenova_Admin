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
          

          <svg width={16}
            height={17} viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill="#F4F4F4" d="M23 4H18V3C18 2.20435 17.6839 1.44129 17.1213 0.87868C16.5587 0.316071 15.7956 0 15 0H9C8.20435 0 7.44129 0.316071 6.87868 0.87868C6.31607 1.44129 6 2.20435 6 3V4H1C0.734784 4 0.48043 4.10536 0.292893 4.29289C0.105357 4.48043 0 4.73478 0 5C0 5.26522 0.105357 5.51957 0.292893 5.70711C0.48043 5.89464 0.734784 6 1 6H2V24C2 24.5304 2.21071 25.0391 2.58579 25.4142C2.96086 25.7893 3.46957 26 4 26H20C20.5304 26 21.0391 25.7893 21.4142 25.4142C21.7893 25.0391 22 24.5304 22 24V6H23C23.2652 6 23.5196 5.89464 23.7071 5.70711C23.8946 5.51957 24 5.26522 24 5C24 4.73478 23.8946 4.48043 23.7071 4.29289C23.5196 4.10536 23.2652 4 23 4ZM8 3C8 2.73478 8.10536 2.48043 8.29289 2.29289C8.48043 2.10536 8.73478 2 9 2H15C15.2652 2 15.5196 2.10536 15.7071 2.29289C15.8946 2.48043 16 2.73478 16 3V4H8V3ZM20 24H4V6H20V24ZM10 11V19C10 19.2652 9.89464 19.5196 9.70711 19.7071C9.51957 19.8946 9.26522 20 9 20C8.73478 20 8.48043 19.8946 8.29289 19.7071C8.10536 19.5196 8 19.2652 8 19V11C8 10.7348 8.10536 10.4804 8.29289 10.2929C8.48043 10.1054 8.73478 10 9 10C9.26522 10 9.51957 10.1054 9.70711 10.2929C9.89464 10.4804 10 10.7348 10 11ZM16 11V19C16 19.2652 15.8946 19.5196 15.7071 19.7071C15.5196 19.8946 15.2652 20 15 20C14.7348 20 14.4804 19.8946 14.2929 19.7071C14.1054 19.5196 14 19.2652 14 19V11C14 10.7348 14.1054 10.4804 14.2929 10.2929C14.4804 10.1054 14.7348 10 15 10C15.2652 10 15.5196 10.1054 15.7071 10.2929C15.8946 10.4804 16 10.7348 16 11Z"/>
</svg>

        </button>
      </span>
    </li>
  );
};

export default OptionItem;
