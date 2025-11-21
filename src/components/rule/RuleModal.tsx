import { useState, useEffect } from "react";
import "./index.css";
import { useToast } from "../../hooks/useToast";
import type {
  LocalCondition,
  LocalFormData,
  RuleModalProps,
} from "../../types/rules";

export const RuleModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingRule,
  initialFormData,
  questions,
}: RuleModalProps) => {
  const [formData, setFormData] = useState<LocalFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { showWarning, showError } = useToast();

  useEffect(() => {
    // If adding new rule (not editing), ensure only 1 condition by default
    if (!editingRule && initialFormData.conditions.length > 1) {
      setFormData({
        ...initialFormData,
        conditions: [initialFormData.conditions[0]],
      });
    } else {
      setFormData(initialFormData);
    }
  }, [initialFormData, editingRule]);

  const handleSubmit = async () => {
    // Check rule name
    if (!formData.name.trim()) {
      showWarning("Rule name is required.");
      return;
    }

    // Validate each condition
    for (let i = 0; i < formData.conditions.length; i++) {
      const c = formData.conditions[i];

      if (!c.questionId) {
        showWarning(
          `Condition ${
            i + 1
          }: Please select a question or remove this condition.`
        );
        return;
      }

      if (!c.operator) {
        showWarning(`Condition ${i + 1}: Please select an operator.`);
        return;
      }

      if (!c.value || c.value.trim().length === 0) {
        showWarning(`Condition ${i + 1}: Please select at least one value.`);
        return;
      }

      // EXTRA check: if operator = equal then value must be exactly 1
      if (c.operator === "equal" && c.value.split(",").length > 1) {
        showWarning(
          `Condition ${i + 1}: "Equal" operator supports only one value.`
        );
        return;
      }
    }

    //  All validations passed — now submit
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch {
      showError("Failed to submit or Something went wrong ...");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add new condition
  const addCondition = () => {
    const newCondition: LocalCondition = {
      questionId: "",
      operator: "equal",
      value: "",
      questionText: "",
    };

    setFormData({
      ...formData,
      conditions: [...formData.conditions, newCondition],
    });
  };

  // Remove condition
  const removeCondition = (index: number) => {
    const updated = [...formData.conditions];
    updated.splice(index, 1);
    setFormData({ ...formData, conditions: updated });
  };

  // Helper to convert string to array for multi-select display
  const stringToArray = (value: string): string[] => {
    if (!value) return [];
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal modal_add_rules fade show"
        style={{ display: "block" }}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="exampleModalLabel"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <button
              type="button"
              className="btn-close close-btn"
              onClick={onClose}
              aria-label="Close"
              disabled={isSubmitting}
            >
              ✕
            </button>

            <div className="modal-body">
              <div className="head_area">
                <h4 className="head_modal">
                  {editingRule ? "Edit Rule" : "Add New Rule"}
                </h4>
                <p className="sub_head">Enter The details and marked</p>
              </div>

              {/* Rule Name */}
              <div className="input_field">
                <label htmlFor="ruleName">Rule Name *</label>
                <div className="position-relative">
                  <input
                    id="ruleName"
                    placeholder="Enter Rule Name"
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="ruleName"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={isSubmitting}
                  />
                </div>
              </div>
                    <span className={`btn_condition w-100 ${
                        isSubmitting ? "disabled-text" : ""
                      }`}
                      onClick={() => {
                        if (isSubmitting) return; // ❌ Stop click when disabled
                        addCondition();
                      }}
                    >
                      + Add More Condition
                  </span>
              {/* CONDITIONS */}
              <div
                className="accordion accordion-flush"
                id="accordionCondition"
              >
                {formData.conditions.map((condition, idx) => (
                  <div className="accordion-item" key={idx}>
                    <h2 className="accordion-header d-flex justify-content-between align-items-center">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#flush-collapse${idx}`}
                        aria-expanded="false"
                        aria-controls={`flush-collapse${idx}`}
                        disabled={isSubmitting}
                      >
                        Condition {idx + 1} *
                      </button>

                      {/* Remove button */}
                      {formData.conditions.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger ms-2"
                          onClick={() => removeCondition(idx)}
                          disabled={isSubmitting}
                        >
                          ×
                        </button>
                      )}
                    </h2>

                    <div
                      id={`flush-collapse${idx}`}
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionCondition"
                    >
                      <div className="accordion-body">
                        {/* Question */}
                        {/* Question Dropdown */}
                        <div className="input_field mb-3">
                          <label>Question</label>
                          <select
                            className="form-control"
                            value={condition.questionId}
                            onChange={(e) => {
                              const newConditions = [...formData.conditions];
                              const selectedId = e.target.value;

                              newConditions[idx].questionId = selectedId;

                              // auto-set questionText from selected question
                              const selectedQuestion = questions.questions.find(
                                (q) => q.question_id === selectedId
                              );

                              newConditions[idx].questionText =
                                selectedQuestion?.question_text || "";

                              setFormData({
                                ...formData,
                                conditions: newConditions,
                              });
                            }}
                            disabled={isSubmitting}
                          >
                            <option value="">-- Select Question --</option>

                            {questions?.questions?.map((q) => (
                              <option key={q.question_id} value={q.question_id}>
                                {q.question_text}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Operator Dropdown */}
                        <div className="input_field mb-3">
                          <label>Operator</label>
                          <select
                            className="form-control"
                            value={condition.operator}
                            onChange={(e) => {
                              const newOperator = e.target
                                .value as LocalCondition["operator"];
                              const newConditions = [...formData.conditions];

                              const selectedValues = stringToArray(
                                condition.value
                              );

                              // Show warning if user tries to select Equal with more than 1 value
                              if (
                                newOperator === "equal" &&
                                selectedValues.length > 1
                              ) {
                                showWarning(
                                  "Equal operator allows only one value. Please remove extra selected options first."
                                );
                                return; // STOP — do not change operator
                              }

                              newConditions[idx].operator = newOperator;

                              setFormData({
                                ...formData,
                                conditions: newConditions,
                              });
                            }}
                            disabled={isSubmitting}
                          >
                            <option value="equal">Equal</option>
                            <option value="and">AND</option>
                            <option value="or">OR</option>
                          </select>
                        </div>

                        {/* Value Multi-Select (Custom UI with Chips) */}
                        <div className="input_field mb-3">
                          <label>Value</label>

                          <div className="multi-select-wrapper">
                            {/* Selected chips */}
                            <div
                              className="multi-select-input"
                              onClick={() =>
                                setOpenIndex(openIndex === idx ? null : idx)
                              }
                            >
                              {stringToArray(condition.value).length > 0 ? (
                                stringToArray(condition.value).map((val, i) => (
                                  <span key={i} className="chip">
                                    {val}
                                  </span>
                                ))
                              ) : (
                                <span className="placeholder">
                                  Select values...
                                </span>
                              )}
                            </div>

                            {/* Dropdown */}
                            {openIndex === idx && (
                              <div className="multi-select-dropdown">
                                {questions.questions
                                  .find(
                                    (q) =>
                                      q.question_id === condition.questionId
                                  )
                                  ?.options?.map((opt) => {
                                    const selected = stringToArray(
                                      condition.value
                                    ).includes(opt.option_text);

                                    return (
                                      <div
                                        key={opt.id}
                                        className={`dropdown-item ${
                                          selected ? "selected" : ""
                                        }`}
                                        onClick={() => {
                                          const current = stringToArray(
                                            condition.value
                                          );
                                          const selected = current.includes(
                                            opt.option_text
                                          );

                                          // RULE: If operator = equal → allow only 1 value
                                          if (condition.operator === "equal") {
                                            // If they try to add another value (and it's not unselecting)
                                            if (
                                              !selected &&
                                              current.length >= 1
                                            ) {
                                              showWarning(
                                                "Equal operator allows only one value. Remove the selected value first."
                                              );
                                              return; //Stop here → DO NOT add value
                                            }
                                          }

                                          // Normal multi-select logic
                                          let updated;
                                          if (selected) {
                                            updated = current.filter(
                                              (v) => v !== opt.option_text
                                            );
                                          } else {
                                            updated = [
                                              ...current,
                                              opt.option_text,
                                            ];
                                          }

                                          const newConditions = [
                                            ...formData.conditions,
                                          ];
                                          newConditions[idx].value =
                                            updated.join(", ");

                                          setFormData({
                                            ...formData,
                                            conditions: newConditions,
                                          });
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={selected}
                                          readOnly
                                        />
                                        {opt.option_text}
                                      </div>
                                    );
                                  })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* <span
                className={`btn-text w-100 mt-3 ${
                  isSubmitting ? "disabled-text" : ""
                }`}
                onClick={() => {
                  if (isSubmitting) return; // ❌ Stop click when disabled
                  addCondition();
                }}
              >
                + Add More Condition
              </span> */}

              {/* SUBMIT BUTTON */}
              <button
                type="button"
                className="btn common_button mt-3"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="btn-loader"></span>
                    {editingRule ? "Updating..." : "Saving..."}
                  </>
                ) : editingRule ? (
                  "Update Rule"
                ) : (
                  "Create Rule"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BACKDROP */}
      <div className="modal-backdrop fade show"></div>
    </>
  );
};
