import { useState } from "react";
import "./diagnosticQuestions.css";
import { useDiagnosticQuestions } from "../../hooks/useDiagnosticQuestions";
import type {
  CreateQuestionRequest,
  Question,
  UpdateQuestionRequest,
} from "../../services/apiCalls/diagnosticQuestion";
import { useToast } from "../../hooks/useToast";

interface DiagnosticQuestionsProps {
  limit?: number;
  isActionShow?: boolean;
}

// Extended Question type for UI with index-based ID
interface QuestionWithId extends Question {
  [key: string]: unknown; // <-- This makes it satisfy Record<string, unknown>
}

export const DiagnosticQuestions = ({
  limit,
  isActionShow = true,
}: DiagnosticQuestionsProps) => {
  const {
    questions,
    loading,
    error,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  } = useDiagnosticQuestions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionWithId | null>(
    null
  );

  // Form state for the modal
  const [questionText, setQuestionText] = useState("");
  const [currentOption, setCurrentOption] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [questionOrder, setQuestionOrder] = useState<number>(1);
  const { showSuccess, showError, showWarning } = useToast();

  const questionsWithId: QuestionWithId[] = questions.map((q, index) => ({
    ...q,
    id: index.toString(),
  }));

  // Modal and form handlers
  const openAddModal = () => {
    setEditingQuestion(null);
    setQuestionText("");
    setOptions([]);
    setCurrentOption("");
    setQuestionOrder(questions.length + 1);
    setIsModalOpen(true);
  };

  const handleEdit = (question: QuestionWithId) => {
    setEditingQuestion(question);
    setQuestionText(question.questionText);
    setOptions([...question.options]);
    setCurrentOption("");
    setQuestionOrder(question.order || 1);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(id);
        showSuccess("Question deleted successfully!");
      } catch {
        showError("Failed to delete question");
      }
    }
  };

  const handleAddOption = () => {
    if (currentOption.trim() && !options.includes(currentOption.trim())) {
      setOptions([...options, currentOption.trim()]);
      setCurrentOption("");
    }
  };

  const handleRemoveOption = (indexToRemove: number) => {
    setOptions(options.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentOption.trim()) {
      showWarning(
        "You have an option typed but not added. Please add or clear it before saving."
      );
      return;
    }

    const questionData = {
      text: questionText.trim(),
      options: options,
      order: questionOrder,
    };

    try {
      if (editingQuestion) {
        // Check if nothing changed
        const nothingChanged =
          editingQuestion.questionText.trim() === questionData.text &&
          JSON.stringify(editingQuestion.options) ===
            JSON.stringify(questionData.options) &&
          editingQuestion.order === questionData.order;

        if (nothingChanged) {
          showWarning("No changes detected. Nothing to update.");
          setIsModalOpen(false);
          setEditingQuestion(null);
          setQuestionText("");
          setOptions([]);
          setCurrentOption("");
          return;
        }
        await updateQuestion(
          editingQuestion._id,
          questionData as UpdateQuestionRequest
        );
        showSuccess("Question updated successfully!");
      } else {
        await createQuestion(questionData as CreateQuestionRequest);
        showSuccess("Question created successfully!");
      }
      setIsModalOpen(false);
      setEditingQuestion(null);
      setQuestionText("");
      setOptions([]);
      setCurrentOption("");
    } catch {
      showError("Failed to save question");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
    setQuestionText("");
    setOptions([]);
    setCurrentOption("");
  };

  const displayedQuestions = limit
    ? questionsWithId.slice(0, limit)
    : questionsWithId;

  if (loading) return <div className="loading">Loading questions...</div>;
  if (error) return <div className="error">Error : {error}</div>;

  return (
    <>
      <div className="main_page">
        <div className="main_heading_area">
          <div className="row">
            <div className="col-md">
              <h4 className="page_heading">Manage Questions</h4>
            </div>
            <div className="col-md-auto">
              <button
                type="button"
                className="common_button"
                onClick={openAddModal}
              >
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

        {/* Dynamic Questions Display */}
        {displayedQuestions.length > 0 && (
          <div className="questions-container">
            {displayedQuestions.map((question, index) => (
              <div key={question._id || index} className="single_question">
                <div className="row align-items-end">
                  <div className="col">
                    <ul className="question_heading">
                      <li className="question_number">Q.{index + 1}</li>
                      <li className="question_name">{question.questionText}</li>
                    </ul>
                    <ul className="question_options_area">
                      <li className="question_options_head">Options:</li>
                      {question.options.map((option, optionIndex) => (
                        <li key={optionIndex}>
                          <span className="question_answer">{option}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {isActionShow && (
                    <div className="col-auto">
                      <ul className="question_options_area mt-0">
                        <li className="ms-auto question_actions">
                          <button
                            type="button"
                            onClick={() => handleEdit(question)}
                            style={{
                              background: "none",
                              border: "none",
                              padding: "5px",
                            }}
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
                            onClick={() => handleDelete(question._id)}
                            style={{
                              background: "none",
                              border: "none",
                              padding: "5px",
                            }}
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
            ))}
          </div>
        )}

        {/* Empty state */}
        {displayedQuestions.length === 0 && !loading && (
          <div
            className="empty-state"
            style={{ textAlign: "center", padding: "2rem" }}
          >
            <p>
              No questions found. Click "Add Question" to create your first
              question.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="false"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <button
                type="button"
                className="btn-close"
                onClick={handleModalClose}
                aria-label="Close"
              >
                <svg
                  width={27}
                  height={27}
                  viewBox="0 0 27 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width={27}
                    height={27}
                    rx="13.5"
                    fill="url(#paint0_linear_790_3208)"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.2908 18.2908C18.5697 18.0118 18.5697 17.5596 18.2908 17.2806L9.71936 8.70921C9.44042 8.43026 8.98816 8.43026 8.70921 8.70921C8.43026 8.98816 8.43026 9.44042 8.70921 9.71936L17.2806 18.2908C17.5596 18.5697 18.0118 18.5697 18.2908 18.2908Z"
                    fill="#F4F4F4"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.70921 18.2908C8.98816 18.5697 9.44042 18.5697 9.71936 18.2908L18.2908 9.71936C18.5697 9.44042 18.5697 8.98815 18.2908 8.70921C18.0118 8.43026 17.5596 8.43026 17.2806 8.70921L8.70921 17.2806C8.43026 17.5596 8.43026 18.0118 8.70921 18.2908Z"
                    fill="#F4F4F4"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_790_3208"
                      x1="13.5"
                      y1={0}
                      x2="13.5"
                      y2={27}
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#E0B669" />
                      <stop offset={1} stopColor="#B48A3E" />
                    </linearGradient>
                  </defs>
                </svg>
              </button>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="head_area">
                    <h4 className="head_modal">
                      {editingQuestion ? "Edit Question" : "Add New Question"}
                    </h4>
                    <p className="sub_head">
                      Enter the details and mark as needed
                    </p>
                  </div>

                  <div className="input_field">
                    <label htmlFor="questionText">Question Text *</label>
                    <div className="position-relative">
                      <textarea
                        id="questionText"
                        rows={3}
                        placeholder="Enter Your Question"
                        className="form-control"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        required
                      />
                    </div>
                  </div>

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
                        onChange={(e) => setCurrentOption(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddOption();
                          }
                        }}
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        className="add_options"
                        onClick={handleAddOption}
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

                  {/* Added Options Display */}
                  {options.length > 0 && (
                    <div className="added_list_main_outer">
                      <span className="added_label">
                        <span className="added_check_icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={15}
                            height={16}
                            viewBox="0 0 15 16"
                            fill="none"
                          >
                            <path
                              d="M7.0592 15.0592C10.9579 15.0592 14.1184 11.8987 14.1184 8C14.1184 4.10131 10.9579 0.940804 7.0592 0.940804C3.16051 0.940804 0 4.10131 0 8C0 11.8987 3.16051 15.0592 7.0592 15.0592Z"
                              fill="url(#paint0_linear_611_877)"
                            />
                            <path
                              d="M4.38379 8.40638L6.16643 10.0322L9.73168 5.96776"
                              stroke="white"
                              strokeWidth="1.71936"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <defs>
                              <linearGradient
                                id="paint0_linear_611_877"
                                x1="7.0592"
                                y1="0.940804"
                                x2="7.0592"
                                y2="15.0592"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stopColor="#E0B669" />
                                <stop offset={1} stopColor="#B48A3E" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </span>
                        Added Options
                      </span>
                      <ul className="added_list_main">
                        {options.map((option, index) => (
                          <li key={index}>
                            <span className="added_list">{option}</span>
                            <span className="list_icons">
                              <button
                                type="button"
                                className="bg_icon_et"
                                onClick={() => handleRemoveOption(index)}
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
                                    d="M14.4854 2.76467H11.3604V2.13967C11.3604 1.64239 11.1628 1.16548 10.8112 0.813848C10.4595 0.462217 9.98263 0.264673 9.48535 0.264673H5.73535C5.23807 0.264673 4.76116 0.462217 4.40953 0.813848C4.0579 1.16548 3.86035 1.64239 3.86035 2.13967V2.76467H0.735352C0.569591 2.76467 0.41062 2.83052 0.29341 2.94773C0.1762 3.06494 0.110352 3.22391 0.110352 3.38967C0.110352 3.55543 0.1762 3.7144 0.29341 3.83161C0.41062 3.94882 0.569591 4.01467 0.735352 4.01467H1.36035V15.2647C1.36035 15.5962 1.49205 15.9141 1.72647 16.1486C1.96089 16.383 2.27883 16.5147 2.61035 16.5147H12.6104C12.9419 16.5147 13.2598 16.383 13.4942 16.1486C13.7287 15.9141 13.8604 15.5962 13.8604 15.2647V4.01467H14.4854C14.6511 4.01467 14.8101 3.94882 14.9273 3.83161C15.0445 3.7144 15.1104 3.55543 15.1104 3.38967C15.1104 3.22391 15.0445 3.06494 14.9273 2.94773C14.8101 2.83052 14.6511 2.76467 14.4854 2.76467ZM6.36035 12.1397C6.36035 12.3054 6.2945 12.4644 6.17729 12.5816C6.06008 12.6988 5.90111 12.7647 5.73535 12.7647C5.56959 12.7647 5.41062 12.6988 5.29341 12.5816C5.1762 12.4644 5.11035 12.3054 5.11035 12.1397V7.13967C5.11035 6.97391 5.1762 6.81494 5.29341 6.69773C5.41062 6.58052 5.56959 6.51467 5.73535 6.51467C5.90111 6.51467 6.06008 6.58052 6.17729 6.69773C6.2945 6.81494 6.36035 6.97391 6.36035 7.13967V12.1397ZM10.1104 12.1397C10.1104 12.3054 10.0445 12.4644 9.92729 12.5816C9.81008 12.6988 9.65111 12.7647 9.48535 12.7647C9.31959 12.7647 9.16062 12.6988 9.04341 12.5816C8.9262 12.4644 8.86035 12.3054 8.86035 12.1397V7.13967C8.86035 6.97391 8.9262 6.81494 9.04341 6.69773C9.16062 6.58052 9.31959 6.51467 9.48535 6.51467C9.65111 6.51467 9.81008 6.58052 9.92729 6.69773C10.0445 6.81494 10.1104 6.97391 10.1104 7.13967V12.1397ZM10.1104 2.76467H5.11035V2.13967C5.11035 1.97391 5.1762 1.81494 5.29341 1.69773C5.41062 1.58052 5.56959 1.51467 5.73535 1.51467H9.48535C9.65111 1.51467 9.81008 1.58052 9.92729 1.69773C10.0445 1.81494 10.1104 1.97391 10.1104 2.13967V2.76467Z"
                                    fill="#F4F4F4"
                                  />
                                </svg>
                              </button>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn common_button mt-3"
                    disabled={!questionText.trim()}
                  >
                    {editingQuestion ? "Update Question" : "Save Question"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};






