import type { PageHeaderProps } from "../../types";

/**
 * Page header component that displays a title section
 * and provides an "Add" button for creating new items.
 *
 * @param {PageHeaderProps} root0 Component props.
 * @param {() => void} root0.onAddClick Callback fired when the Add button is clicked.
 * @returns {JSX.Element} The rendered page header UI.
 */
const PageHeader = ({ onAddClick }: PageHeaderProps) => {
  return (
    <div className="main_heading_area">
      <div className="row g-3">
        <div className="col">
          <h4 className="page_heading">Manage Questions</h4>
        </div>
        <div className="col-auto">
          <button type="button" className="common_button" onClick={onAddClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 3C9.41421 3 9.75 3.33579 9.75 3.75V8.25H14.25C14.6642 8.25 15 8.58579 15 9C15 9.41421 14.6642 9.75 14.25 9.75H9.75V14.25C9.75 14.6642 9.41421 15 9 15C8.58579 15 8.25 14.6642 8.25 14.25V9.75H3.75C3.33579 9.75 3 9.41421 3 9C3 8.58579 3.33579 8.25 3.75 8.25H8.25V3.75C8.25 3.33579 8.58579 3 9 3Z"
                fill="white"
              />
            </svg>{" "}
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
