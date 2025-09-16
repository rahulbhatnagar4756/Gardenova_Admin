import { useState } from "react";
import "./ruleForm.css";
import type {
  CreateRuleRequest,
  UpdateRuleRequest,
  RuleCondition,
  Rule,
} from "../../services/apiCalls/rules";
import { useDiagnosticQuestions } from "../../hooks/useDiagnosticQuestions";

interface RuleFormProps {
  initialData?: Rule;
  onSubmit: (data: CreateRuleRequest | UpdateRuleRequest) => void;
  onCancel: () => void;
}

interface RuleFormData {
  name: string;
  conditions: RuleCondition[];
}

const OPERATORS = ["equals", "in", "and", "or"] as const;

export const RuleForm = ({
  initialData,
  onSubmit,
  onCancel,
}: RuleFormProps) => {
  const { questions, loading } = useDiagnosticQuestions();

  const [formData, setFormData] = useState<RuleFormData>({
    name: initialData?.name || "",
    conditions: initialData?.conditions || [
      { questionId: "", operator: "equals", values: [""] },
    ],
  });

  const [errors, setErrors] = useState<{
    name?: string;
    conditions?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Rule name is required";
    }

    const validConditions = formData.conditions.filter(
      (condition) =>
        condition.questionId.trim() &&
        condition.values.some((value) => value.trim())
    );
    if (validConditions.length === 0) {
      newErrors.conditions = "At least one valid condition is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const validConditions = formData.conditions.filter(
      (condition) =>
        condition.questionId.trim() &&
        condition.values.some((value) => value.trim())
    );

    const submitData: CreateRuleRequest | UpdateRuleRequest = {
      name: formData.name.trim(),
      conditions: validConditions.map((condition) => ({
        ...condition,
        values: condition.values.filter((value) => value.trim()),
      })),
    };

    onSubmit(submitData);
  };

  // Condition handlers
  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [
        ...formData.conditions,
        { questionId: "", operator: "equals", values: [""] },
      ],
    });
  };

  const removeCondition = (index: number) => {
    if (formData.conditions.length > 1) {
      const newConditions = formData.conditions.filter((_, i) => i !== index);
      setFormData({ ...formData, conditions: newConditions });
    }
  };

  const updateCondition = (
    index: number,
    field: keyof RuleCondition,
    value: string | string[]
  ) => {
    const newConditions = [...formData.conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setFormData({ ...formData, conditions: newConditions });
  };

  const addConditionValue = (conditionIndex: number) => {
    const newConditions = [...formData.conditions];
    newConditions[conditionIndex].values.push("");
    setFormData({ ...formData, conditions: newConditions });
  };

  const removeConditionValue = (conditionIndex: number, valueIndex: number) => {
    const newConditions = [...formData.conditions];
    if (newConditions[conditionIndex].values.length > 1) {
      newConditions[conditionIndex].values = newConditions[
        conditionIndex
      ].values.filter((_, i) => i !== valueIndex);
      setFormData({ ...formData, conditions: newConditions });
    }
  };

  const updateConditionValue = (
    conditionIndex: number,
    valueIndex: number,
    value: string
  ) => {
    const newConditions = [...formData.conditions];
    newConditions[conditionIndex].values[valueIndex] = value;
    setFormData({ ...formData, conditions: newConditions });
  };

  return (
    <form onSubmit={handleSubmit} className="rule-form">
      {/* Rule Name */}
      <div className="form-group">
        <label htmlFor="name">Rule Name *</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          required
          className={`form-control ${errors.name ? "error" : ""}`}
          placeholder="Enter rule name..."
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      {/* Conditions */}
      <div className="form-group">
        <label>Conditions *</label>
        <div className="conditions-container">
          {formData.conditions.map((condition, conditionIndex) => (
            <div key={conditionIndex} className="condition-group">
              <div className="condition-header">
                <h4>Condition {conditionIndex + 1}</h4>
                {formData.conditions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCondition(conditionIndex)}
                    className="btn btn-danger btn-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="condition-fields">
                <div className="form-row">
                  <div className="form-col">
                    <label>Question</label>
                    {loading ? (
                      <p>Loading questions...</p>
                    ) : (
                      <select
                        value={condition.questionId}
                        onChange={(e) =>
                          updateCondition(
                            conditionIndex,
                            "questionId",
                            e.target.value
                          )
                        }
                        className="form-control"
                      >
                        <option value="">-- Select Question --</option>
                        {questions.map((q) => (
                          <option key={q._id} value={q._id}>
                            {q.questionText}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="form-col">
                    <label>Operator</label>
                    <select
                      value={condition.operator}
                      onChange={(e) =>
                        updateCondition(
                          conditionIndex,
                          "operator",
                          e.target.value
                        )
                      }
                      className="form-control"
                    >
                      {OPERATORS.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="values-section">
                  <label>Values</label>
                  {condition.values.map((value, valueIndex) => {
                    // find the selected question
                    const selectedQuestion = questions.find(
                      (q) => q._id === condition.questionId
                    );

                    return (
                      <div key={valueIndex} className="value-input-group">
                        {selectedQuestion ? (
                          <select
                            value={value}
                            onChange={(e) =>
                              updateConditionValue(
                                conditionIndex,
                                valueIndex,
                                e.target.value
                              )
                            }
                            className="form-control"
                          >
                            <option value="">-- Select Value --</option>
                            {selectedQuestion.options.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Select a question to see options
                          </p>
                        )}

                        {condition.values.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeConditionValue(conditionIndex, valueIndex)
                            }
                            className="btn btn-danger btn-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => addConditionValue(conditionIndex)}
                    className="btn btn-secondary btn-sm"
                  >
                    + Add Value
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addCondition}
          className="btn btn-secondary add-condition-btn"
        >
          + Add Condition
        </button>

        {errors.conditions && (
          <span className="error-message">{errors.conditions}</span>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? "Update" : "Create"} Rule
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};
