import { useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import OptionsList from "./OptionsList";
import OptionsInput from "./OptionsInput";
import type {
  QuestionModalProps,
  QuestionOption,
} from "../../types/diagnosticQuestion";

const QuestionModal = ({
  isOpen,
  editingQuestion,
  questionsCount,
  onClose,
  onSave,
}: QuestionModalProps) => {
  const [questionText, setQuestionText] = useState("");
  const [currentOption, setCurrentOption] = useState("");
  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [questionOrder, setQuestionOrder] = useState<number>(1);
  const { showWarning } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingQuestion) {
        setQuestionText(editingQuestion.question_text);
        setOptions([...editingQuestion.options]);
        setQuestionOrder(editingQuestion.order || 1);
      } else {
        setQuestionText("");
        setOptions([]);
        setQuestionOrder(questionsCount + 1);
      }
      setCurrentOption("");
    }
  }, [isOpen, editingQuestion, questionsCount]);

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

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleUpdateOption = (index: number, text: string) => {
    const updated = [...options];
    updated[index].option_text = text;
    setOptions(updated);
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
      question_text: questionText.trim(),
      options: options,
      order: questionOrder,
    };

    if (editingQuestion) {
      const nothingChanged =
        editingQuestion.question_text.trim() === questionData.question_text &&
        JSON.stringify(editingQuestion.options) ===
          JSON.stringify(questionData.options) &&
        editingQuestion.order === questionData.order;

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
            ×
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
                />
              )}

              <button
                type="submit"
                className="btn common_button mt-3"
                disabled={!questionText.trim() || isSaving}
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
