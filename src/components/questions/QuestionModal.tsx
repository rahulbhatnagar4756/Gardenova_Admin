import { useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import OptionsList from "./OptionsList";
import OptionsInput from "./OptionsInput";
import type {
  QuestionModalProps,
  QuestionOption,
} from "../../types/diagnosticQuestion";

/**
 * Represents the original state of a question before editing begins.
 *
 * @typedef {Object} OriginalQuestionState
 * @property {string} question_text - Question text.
 * @property {QuestionOption[]} options - List of options.
 * @property {number} order - Ordering number.
 */
type OriginalQuestionState = {
  question_text: string;
  options: QuestionOption[];
  order: number;
};

/**
 * Modal for creating or editing a diagnostic question.
 * Handles question text, options, editing state, order, and validation.
 *
 * @param {QuestionModalProps} root0 Component props.
 * @param {boolean} root0.isOpen Whether the modal is open.
 * @param {any} root0.editingQuestion Question object when editing.
 * @param {number} root0.questionsCount Total questions for auto-ordering.
 * @param {() => void} root0.onClose Callback to close modal.
 * @param {(data: any) => Promise<void>} root0.onSave Callback to save question.
 * @returns {JSX.Element | null} The modal UI or null when hidden.
 */
const QuestionModal = ({
  isOpen,
  editingQuestion,
  questionsCount,
  onClose,
  onSave,
}: QuestionModalProps) => {
  const [currentOption, setCurrentOption] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [questionOrder, setQuestionOrder] = useState<number>(1);
  const { showWarning } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [originalData, setOriginalData] =
    useState<OriginalQuestionState | null>(null);
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      if (editingQuestion) {
        setQuestionText(editingQuestion.question_text);
        setOptions([...editingQuestion.options]);
        setQuestionOrder(editingQuestion.order || 1);

        setOriginalData({
          question_text: editingQuestion.question_text.trim(),
          options: JSON.parse(JSON.stringify(editingQuestion.options)),
          order: editingQuestion.order,
        });
      } else {
        setQuestionText("");
        setOptions([]);
        setQuestionOrder(questionsCount + 1);
        setOriginalData(null);
      }
      setCurrentOption("");
    }
  }, [isOpen, editingQuestion, questionsCount]);

  /**
   * Adds a new option to the question.
   *
   * @returns {void}
   */
  const handleAddOption = () => {
    if (currentOption.trim()) {
      const newOption: QuestionOption = {
        id: "",
        option_text: currentOption.trim(),
      };
      setOptions([...options, newOption]);
      setCurrentOption("");
    }
  };

  /**
   * Removes an option by index.
   *
   * @param {number} index Index of the option to remove.
   * @returns {void}
   */
  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  /**
   * Updates option text at a specific index.
   *
   * @param {number} index Index of option to update.
   * @param {string} text New text value.
   * @returns {void}
   */
  const handleUpdateOption = (index: number, text: string) => {
    const updated = [...options];
    updated[index].option_text = text;
    setOptions(updated);
  };

  /**
   * Validates and submits the question to parent for saving.
   *
   * @param {React.FormEvent} e Form submit event.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingOptionIndex !== null) {
      showWarning(
        "Please save the option you are editing before saving the question."
      );
      return;
    }

    if (currentOption.trim()) {
      showWarning(
        "You have an option typed but not added. Please add or clear it before saving."
      );
      return;
    }

    const questionData = {
      question_text: questionText.trim(),
      options: options,
      order: questionOrder,
    };

    if (editingQuestion && originalData) {
      const nothingChanged =
        originalData.question_text === questionData.question_text &&
        JSON.stringify(originalData.options) ===
          JSON.stringify(questionData.options) &&
        originalData.order === questionData.order;

      if (nothingChanged) {
        showWarning("No changes detected. Nothing to update.");
        onClose();
        return;
      }
    }

    try {
      setIsSaving(true); // 🔥 SHOW LOADER
      await onSave(questionData, !!editingQuestion);
    } finally {
      setIsSaving(false); // 🔥 HIDE LOADER
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show question_modal"
      style={{ display: "block", backgroundColor: "rgba(46, 58, 48, 0.4)" }}
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <button
            type="button"
            className="btn-close close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="head_area">
                <h4 className="head_modal">
                  {editingQuestion ? "Edit Question" : "Add New Question"}
                </h4>
                <p className="sub_head">Enter the details and mark as needed</p>
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

              <OptionsInput
                currentOption={currentOption}
                onOptionChange={setCurrentOption}
                onAddOption={handleAddOption}
              />

              {options.length > 0 && (
                <OptionsList
                  options={options}
                  onRemove={handleRemoveOption}
                  onUpdate={handleUpdateOption}
                  editingOptionIndex={editingOptionIndex}
                  setEditingOptionIndex={setEditingOptionIndex}
                />
              )}

              <button
                type="submit"
                className="btn common_button mt-3"
                disabled={
                  !questionText.trim() ||
                  isSaving ||
                  editingOptionIndex !== null // disable when editing
                }
              >
                {isSaving && (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    {editingQuestion
                      ? "Updating Question..."
                      : "Saving Question..."}
                  </>
                )}

                {!isSaving &&
                  (editingQuestion ? "Update Question" : "Save Question")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
