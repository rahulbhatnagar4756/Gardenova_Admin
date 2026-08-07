import type { QuestionCardProps } from "../../types/diagnosticQuestion";

/**
 * Renders a single question card with index, text, and optional action buttons.
 *
 * @param {QuestionCardProps} root0 Component props.
 * @returns {JSX.Element} The rendered question card UI.
 */
const QuestionCard = ({
  question,
  index,
  isActionShow,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  isDragging = false,
  isDragOver = false,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  reordering = false,
}: QuestionCardProps) => {
  return (
    <div
      className={`single_question${isDragging ? " is-dragging" : ""}${
        isDragOver ? " is-drag-over" : ""
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="row align-items-end">
        <div className="col-md">
          <ul className="question_heading">
            {isActionShow && (
              <li
                className="question_drag_handle"
                title="Drag to reorder"
                aria-label="Drag to reorder"
                draggable={!reordering}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M7 5.5C7 6.32843 6.32843 7 5.5 7C4.67157 7 4 6.32843 4 5.5C4 4.67157 4.67157 4 5.5 4C6.32843 4 7 4.67157 7 5.5ZM7 10C7 10.8284 6.32843 11.5 5.5 11.5C4.67157 11.5 4 10.8284 4 10C4 9.17157 4.67157 8.5 5.5 8.5C6.32843 8.5 7 9.17157 7 10ZM7 14.5C7 15.3284 6.32843 16 5.5 16C4.67157 16 4 15.3284 4 14.5C4 13.6716 4.67157 13 5.5 13C6.32843 13 7 13.6716 7 14.5ZM16 5.5C16 6.32843 15.3284 7 14.5 7C13.6716 7 13 6.32843 13 5.5C13 4.67157 13.6716 4 14.5 4C15.3284 4 16 4.67157 16 5.5ZM16 10C16 10.8284 15.3284 11.5 14.5 11.5C13.6716 11.5 13 10.8284 13 10C13 9.17157 13.6716 8.5 14.5 8.5C15.3284 8.5 16 9.17157 16 10ZM16 14.5C16 15.3284 15.3284 16 14.5 16C13.6716 16 13 15.3284 13 14.5C13 13.6716 13.6716 13 14.5 13C15.3284 13 16 13.6716 16 14.5Z"
                    fill="#4A4A4A"
                  />
                </svg>
              </li>
            )}
            <li className="question_number">Q.{index + 1}</li>
            <li className="question_name">{question.question_text}</li>
          </ul>
          <ul className="question_options_area">
            <li className="question_options_head">Options:</li>
            {question.options.map((option, optionIndex) => (
              <li key={option.id || optionIndex}>
                <span className="question_answer">{option.option_text}</span>
              </li>
            ))}
          </ul>
        </div>
        {isActionShow && (
          <div className="col-md-auto">
            <ul className="question_options_area mt-0">
              <li className="ms-auto question_actions">
                <button
                  type="button"
                  onClick={onMoveUp}
                  disabled={!canMoveUp || reordering}
                  title="Move up"
                  aria-label="Move question up"
                  className="question_icon_btn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10 4L4 10H8V16H12V10H16L10 4Z"
                      fill="#4A4A4A"
                    />
                  </svg>
                </button>
              </li>
              <li className="question_actions">
                <button
                  type="button"
                  onClick={onMoveDown}
                  disabled={!canMoveDown || reordering}
                  title="Move down"
                  aria-label="Move question down"
                  className="question_icon_btn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10 16L16 10H12V4H8V10H4L10 16Z"
                      fill="#4A4A4A"
                    />
                  </svg>
                </button>
              </li>
              <li className="question_actions">
                <button
                  type="button"
                  onClick={() => onEdit(question)}
                  disabled={reordering}
                  className="question_icon_btn"
                  title="Edit"
                  aria-label="Edit question"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M17.8585 5.69049L14.5068 2.33949C14.2255 2.05829 13.844 1.90031 13.4463 1.90031C13.0485 1.90031 12.6671 2.05829 12.3858 2.33949L3.13677 11.5877C2.99701 11.7267 2.88619 11.8919 2.81075 12.074C2.73531 12.256 2.69674 12.4512 2.69727 12.6482V16C2.69727 16.3978 2.85531 16.7794 3.13661 17.0607C3.41792 17.342 3.79945 17.5 4.19727 17.5H16.7973C17.036 17.5 17.2649 17.4052 17.4337 17.2364C17.6025 17.0676 17.6973 16.8387 17.6973 16.6C17.6973 16.3613 17.6025 16.1324 17.4337 15.9636C17.2649 15.7948 17.036 15.7 16.7973 15.7H9.97227L17.8585 7.81224C17.9979 7.67295 18.1084 7.50756 18.1838 7.32553C18.2593 7.14351 18.2981 6.9484 18.2981 6.75137C18.2981 6.55434 18.2593 6.35923 18.1838 6.1772C18.1084 5.99518 17.9979 5.82979 17.8585 5.69049ZM7.42227 15.7H4.49727V12.775L10.7973 6.47499L13.7223 9.39999L7.42227 15.7ZM14.9973 8.12499L12.0723 5.19999L13.4478 3.82449L16.3728 6.74949L14.9973 8.12499Z"
                      fill="#4A4A4A"
                    />
                  </svg>
                </button>
              </li>
              <li className="question_actions delete_action">
                <button
                  type="button"
                  onClick={() => onDelete(question.question_id)}
                  disabled={reordering}
                  className="question_icon_btn"
                  title="Delete"
                  aria-label="Delete question"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M16.9996 4.7492H3.7976C3.55887 4.7492 3.32991 4.84404 3.1611 5.01285C2.9923 5.18165 2.89746 5.41061 2.89746 5.64934C2.89746 5.88807 2.9923 6.11702 3.1611 6.28583C3.32991 6.45464 3.55887 6.54947 3.7976 6.54947H4.09764V16.751C4.09764 17.1489 4.2557 17.5305 4.53705 17.8118C4.8184 18.0932 5.19998 18.2512 5.59787 18.2512H15.1993C15.5972 18.2512 15.9788 18.0932 16.2601 17.8118C16.5415 17.5305 16.6995 17.1489 16.6995 16.751V6.54947H16.9996C17.2383 6.54947 17.4673 6.45464 17.6361 6.28583C17.8049 6.11702 17.8997 5.88807 17.8997 5.64934C17.8997 5.41061 17.8049 5.18165 17.6361 5.01285C17.4673 4.84404 17.2383 4.7492 16.9996 4.7492ZM14.8993 16.451H5.89791V6.54947H14.8993V16.451ZM6.498 2.64888C6.498 2.41015 6.59284 2.1812 6.76165 2.01239C6.93046 1.84358 7.15941 1.74875 7.39814 1.74875H13.399C13.6378 1.74875 13.8667 1.84358 14.0355 2.01239C14.2043 2.1812 14.2992 2.41015 14.2992 2.64888C14.2992 2.88762 14.2043 3.11657 14.0355 3.28538C13.8667 3.45419 13.6378 3.54902 13.399 3.54902H7.39814C7.15941 3.54902 6.93046 3.45419 6.76165 3.28538C6.59284 3.11657 6.498 2.88762 6.498 2.64888Z"
                      fill="#4A4A4A"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
