import { useState } from "react";
import "./questionForm.css";
import type {
  CreateQuestionRequest,
  UpdateQuestionRequest,
} from "../../services/apiCalls/diagnosticQuestion";

interface QuestionFormData {
  text: string;
  options: string[];
  order: number;
}

interface QuestionFormProps {
  initialData?: QuestionFormData;
  onSubmit: (data: CreateQuestionRequest | UpdateQuestionRequest) => void;
  onCancel: () => void;
}

export const QuestionForm = ({
  initialData,
  onSubmit,
  onCancel,
}: QuestionFormProps) => {
  const [formData, setFormData] = useState<QuestionFormData>({
    text: initialData?.text || "",
    options: initialData?.options || [""],
    order: initialData?.order || 1,
  });

  const [errors, setErrors] = useState<{
    text?: string;
    options?: string;
    order?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Validate question text
    if (!formData.text.trim()) {
      newErrors.text = "Question text is required";
    }

    // Validate options
    const validOptions = formData.options.filter((option) => option.trim());
    if (validOptions.length < 2) {
      newErrors.options = "At least 2 options are required";
    }

    // Validate order
    if (formData.order < 1) {
      newErrors.order = "Order must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Filter out empty options before submitting
    const validOptions = formData.options.filter((option) => option.trim());

    const submitData: CreateQuestionRequest | UpdateQuestionRequest = {
      text: formData.text.trim(),
      options: validOptions,
      order: formData.order,
    };

    onSubmit(submitData);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });

    // Clear options error when user starts typing
    if (errors.options) {
      setErrors({ ...errors, options: undefined });
    }
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ""] });
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 1) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const handleTextChange = (value: string) => {
    setFormData({ ...formData, text: value });
    // Clear text error when user starts typing
    if (errors.text) {
      setErrors({ ...errors, text: undefined });
    }
  };

  const handleOrderChange = (value: number) => {
    setFormData({ ...formData, order: value });
    // Clear order error when user changes value
    if (errors.order) {
      setErrors({ ...errors, order: undefined });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="question-form">
      <div className="form-group">
        <label htmlFor="text">Question Text *</label>
        <textarea
          id="text"
          value={formData.text}
          onChange={(e) => handleTextChange(e.target.value)}
          required
          rows={3}
          className={`form-control ${errors.text ? "error" : ""}`}
          placeholder="Enter your question here..."
        />
        {errors.text && <span className="error-message">{errors.text}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="order">Order *</label>
        <input
          id="order"
          type="number"
          value={formData.order}
          onChange={(e) => handleOrderChange(parseInt(e.target.value) || 1)}
          required
          min="1"
          className={`form-control ${errors.order ? "error" : ""}`}
          placeholder="Question order (e.g., 1, 2, 3...)"
        />
        {errors.order && <span className="error-message">{errors.order}</span>}
        <small className="form-hint">
          Set the order in which this question should appear
        </small>
      </div>

      <div className="form-group">
        <label>Answer Options *</label>
        <div className="options-container">
          {formData.options.map((option, index) => (
            <div key={index} className="option-input-group">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="form-control"
              />
              {formData.options.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="btn btn-danger btn-sm"
                  aria-label={`Remove option ${index + 1}`}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addOption}
          className="btn btn-secondary btn-sm add-option-btn"
        >
          + Add Option
        </button>

        {errors.options && (
          <span className="error-message">{errors.options}</span>
        )}
        <small className="form-hint">
          Provide at least 2 answer options. Empty options will be removed
          automatically.
        </small>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? "Update" : "Create"} Question
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};
