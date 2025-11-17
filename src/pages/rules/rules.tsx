import { useState } from "react";
import "./rules.css";
import { useRules } from "../../hooks/useRules";
import type {
  CreateRuleRequest,
  Rule,
  UpdateRuleRequest,
} from "../../services/apiCalls/rules";

interface RulesProps {
  limit?: number;
  isActionShow?: boolean;
}

interface RuleWithId extends Rule {
  [key: string]: unknown;
}

export const Rules = ({ limit, isActionShow = true }: RulesProps) => {
  const { rules, loading, error, createRule, updateRule, deleteRule } =
    useRules();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RuleWithId | null>(null);
  const [formData, setFormData] = useState<CreateRuleRequest>({
    name: "",
    conditions: [
      { questionId: "", operator: "equals", values: [""] },
      { questionId: "", operator: "equals", values: [""] },
    ],
  });

  const handleEdit = (rule: RuleWithId) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name || "",
      conditions: rule.conditions || [
        { questionId: "", operator: "equals", values: [""] },
        { questionId: "", operator: "equals", values: [""] },
      ],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      try {
        await deleteRule(id);
      } catch (error) {
        console.error("Failed to delete rule:", error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingRule) {
        const updateData: UpdateRuleRequest = {
          name: formData.name,
          conditions: formData.conditions,
        };
        await updateRule(editingRule.id, updateData);
      } else {
        await createRule(formData);
      }
      setIsModalOpen(false);
      setEditingRule(null);
      setFormData({
        name: "",
        conditions: [
          { questionId: "", operator: "equals", values: [""] },
          { questionId: "", operator: "equals", values: [""] },
        ],
      });
    } catch (error) {
      console.error("Failed to save rule:", error);
    }
  };

  const handleOpenModal = () => {
    setEditingRule(null);
    setFormData({
      name: "",
      conditions: [
        { questionId: "", operator: "equals", values: [""] },
        { questionId: "", operator: "equals", values: [""] },
      ],
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRule(null);
    setFormData({
      name: "",
      conditions: [
        { questionId: "", operator: "equals", values: [""] },
        { questionId: "", operator: "equals", values: [""] },
      ],
    });
  };

  const displayRules = limit ? rules.slice(0, limit) : rules;

  if (loading) return <div className="loading">Loading rules...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="rules-page bg-none">
      <div className="main_heading_area">
        <div className="row g-3">
          <div className="col">
            <h4 className="page_heading">Create Rules</h4>
          </div>
          <div className="col-auto">
            <button
              onClick={handleOpenModal}
              type="button"
              className="common_button"
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
              Add New Rule
            </button>
          </div>
        </div>
      </div>

      <div className="create_rule_container">
        <div className="row">
          {displayRules.length === 0 ? (
            <div className="col-12 text-center py-5">
              <p>No rules created yet. Click "Add New Rule" to create one.</p>
            </div>
          ) : (
            displayRules.map((rule, index) => (
              <div className="col-xl-6" key={rule.id || index}>
                <div className="single_question">
                  <div className="row align-items-end">
                    <div className="col">
                      <ul className="question_heading">
                        <li className="question_number">R.{index + 1}</li>
                        <li className="question_name">{rule.name}</li>
                      </ul>
                    </div>
                    {isActionShow && (
                      <div className="col-auto">
                        <ul className="question_options_area mt-0">
                          <li className="ms-auto question_actions">
                            <button
                              type="button"
                              onClick={() => handleEdit(rule as RuleWithId)}
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
                              onClick={() => handleDelete(rule.id)}
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
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
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
                onClick={handleCloseModal}
                aria-label="Close"
              >
                ×
              </button>
              <div className="modal-body">
                <div className="head_area">
                  <h4 className="head_modal">
                    {editingRule ? "Edit Rule" : "Add New Rule"}
                  </h4>
                  <p className="sub_head">Enter The details and marked</p>
                </div>

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
                    />
                  </div>
                </div>

                <div
                  className="accordion accordion-flush"
                  id="accordionCondition"
                >
                  {formData.conditions.map((condition, idx) => (
                    <div className="accordion-item" key={idx}>
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#flush-collapse${idx}`}
                          aria-expanded="false"
                          aria-controls={`flush-collapse${idx}`}
                        >
                          Condition {idx + 1} *
                        </button>
                      </h2>
                      <div
                        id={`flush-collapse${idx}`}
                        className="accordion-collapse collapse"
                        data-bs-parent="#accordionCondition"
                      >
                        <div className="accordion-body">
                          <select
                            className="form-select"
                            value={condition.questionId}
                            onChange={(e) => {
                              const newConditions = [...formData.conditions];
                              newConditions[idx].questionId = e.target.value;
                              setFormData({
                                ...formData,
                                conditions: newConditions,
                              });
                            }}
                          >
                            <option value="">Select Question</option>
                            <option value="question1">Question 1</option>
                            <option value="question2">Question 2</option>
                            <option value="question3">Question 3</option>
                          </select>

                          <select
                            className="form-select"
                            value={condition.operator}
                            onChange={(e) => {
                              const newConditions = [...formData.conditions];
                              newConditions[idx].operator = e.target.value as
                                | "equals"
                                | "in"
                                | "and"
                                | "or";
                              setFormData({
                                ...formData,
                                conditions: newConditions,
                              });
                            }}
                          >
                            <option value="">Choose Operator</option>
                            <option value="equals">Equals</option>
                            <option value="in">In</option>
                            <option value="and">And</option>
                            <option value="or">Or</option>
                          </select>

                          <select
                            className="form-select"
                            value={condition.values[0]}
                            onChange={(e) => {
                              const newConditions = [...formData.conditions];
                              newConditions[idx].values = [e.target.value];
                              setFormData({
                                ...formData,
                                conditions: newConditions,
                              });
                            }}
                          >
                            <option value="">Select Values</option>
                            <option value="value1">Value 1</option>
                            <option value="value2">Value 2</option>
                            <option value="value3">Value 3</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn common_button mt-3"
                  onClick={handleSubmit}
                >
                  {editingRule ? "Update Rule" : "Create Rule"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};
