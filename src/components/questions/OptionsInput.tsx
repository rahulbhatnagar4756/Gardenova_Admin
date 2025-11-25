import type { OptionsInputProps } from "../../types/diagnosticQuestion";

/**
 * Input component for adding a new option to a diagnostic question.
 * Handles text input, change events, and add-option action.
 *
 * @param {OptionsInputProps} root0 Component props.
 * @param {string} root0.currentOption Current text entered in the option input.
 * @param {(value: string) => void} root0.onOptionChange Callback fired when the input value changes.
 * @param {() => void} root0.onAddOption Callback fired when clicking the “Add” button.
 * @returns {JSX.Element} The rendered option input field.
 */
const OptionsInput = ({
  currentOption,
  onOptionChange,
  onAddOption,
}: OptionsInputProps) => {
  return (
    <div className="input_field">
      <label htmlFor="optionInput">Add Options *</label>
      <div className="position-relative">
        <input
          id="optionInput"
          name="optionInput"
          type="text"
          placeholder="Enter Option Text"
          className="form-control"
          value={currentOption}
          onChange={(e) => onOptionChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddOption();
            }
          }}
          autoComplete="off"
        />
        <button
          type="button"
          className="add_options"
          onClick={onAddOption}
          disabled={!currentOption.trim()}
        >
          <svg
            width={24}
            height={25}
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.648438"
              y="0.824463"
              width="23.3511"
              height="23.3511"
              rx={4}
              fill="#B48A3E"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.08594 12.4999C5.08594 12.833 5.35599 13.1031 5.68913 13.1031H18.9593C19.2924 13.1031 19.5625 12.833 19.5625 12.4999C19.5625 12.1668 19.2924 11.8967 18.9593 11.8967H5.68913C5.35599 11.8967 5.08594 12.1668 5.08594 12.4999Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.3239 19.7383C12.657 19.7383 12.9271 19.4682 12.9271 19.1351V5.86491C12.9271 5.53178 12.657 5.26172 12.3239 5.26172C11.9908 5.26172 11.7207 5.53178 11.7207 5.86491V19.1351C11.7207 19.4682 11.9908 19.7383 12.3239 19.7383Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default OptionsInput;
