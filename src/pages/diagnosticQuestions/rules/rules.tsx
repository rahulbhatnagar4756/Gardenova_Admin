import { useState } from "react";
import "./rules.css";
import { Pencil, Trash2, FilePlus } from "lucide-react";
import { DataTable } from "../../../components/dataTable/dataTable";
import { Modal } from "../../../components/modal/modal";
import { RuleForm } from "../../../components/ruleForm/ruleForm";
import { useRules } from "../../../hooks/useRules";
import type {
  CreateRuleRequest,
  Rule,
  RuleCondition,
  UpdateRuleRequest,
} from "../../../services/apiCalls/rules";

interface RulesProps {
  limit?: number;
  isActionShow?: boolean;
}

// Extended Rule type for UI with index-based ID
interface RuleWithId extends Rule {
  [key: string]: unknown; // <-- satisfies Record<string, unknown>
}

export const Rules = ({ limit, isActionShow = true }: RulesProps) => {
  const { rules, loading, error, createRule, updateRule, deleteRule } =
    useRules();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RuleWithId | null>(null);

  const rulesWithId: RuleWithId[] = rules.map((r, index) => ({
    ...r,
    id: index.toString(),
  }));

  const renderConditions = (conditions: RuleCondition[]) => {
    if (!conditions || conditions.length === 0) {
      return <span className="no-conditions">No conditions</span>;
    }

    return (
      <div className="conditions-list">
        {conditions.map((condition, index) => (
          <div key={index} className="condition-item">
            {/* ✅ Display questionText if present, fallback to questionId */}
            <span className="condition-question">
              {condition.questionText || condition.questionId}
            </span>
            <span className="condition-operator">=</span>
            <span className="condition-values">
              {condition.values.join(" or ")}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const columns = [
    {
      key: "__index",
      label: "No.",
      className: "rule-number-column",
    },
    {
      key: "name",
      label: "Rule Name",
      className: "rule-name-column",
    },
    {
      key: "conditions",
      label: "Conditions",
      render: (_value: unknown, item: RuleWithId) =>
        renderConditions(item.conditions),
      className: "conditions-column",
    },
  ];

  const handleEdit = (rule: RuleWithId) => {
    setEditingRule(rule);
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

  const handleSubmit = async (data: CreateRuleRequest | UpdateRuleRequest) => {
    try {
      if (editingRule) {
        await updateRule(editingRule._id, data as UpdateRuleRequest);
      } else {
        await createRule(data as CreateRuleRequest);
      }
      setIsModalOpen(false);
      setEditingRule(null);
    } catch (error) {
      console.error("Failed to save rule:", error);
    }
  };

  const actions = [
    {
      label: "Edit",
      icon: <Pencil size={16} />,
      onClick: (item: RuleWithId) => handleEdit(item),
      className: "btn-secondary",
    },
    {
      label: "Delete",
      icon: <Trash2 size={16} />,
      onClick: (item: RuleWithId) => handleDelete(item._id),
      className: "btn-danger",
    },
  ];

  const displayedRules = limit ? rulesWithId.slice(0, limit) : rulesWithId;

  if (loading) return <div className="loading">Loading rules...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="rules-page bg-none">
      {/* <div className="rules-header">
        <h2>Create Rules</h2>

        {!limit && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 fw-semibold shadow-sm"
            style={{ fontSize: "14px" }}
          >
            <FilePlus className="w-6 h-6" />
            <span>Add Rule</span>
          </button>
        )}
      </div> */}

      <div className="main_heading_area">
        <div className="row g-3">
          <div className="col">
            <h4 className="page_heading">Create Rules</h4>
          </div>
          <div className="col-auto">
            <button
              onClick={() => setIsModalOpen(true)}
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
          <div className="col-xl-6">
            <div className="single_question">
              <div className="row align-items-end">
                <div className="col">
                  <ul className="question_heading">
                    <li className="question_number">R.1</li>
                    <li className="question_name">Robotic Mower</li>
                  </ul>
                </div>
                <div className="col-auto">
                  <ul className="question_options_area mt-0">
                    <li className="ms-auto question_actions">
                      <button type="button">
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
                          ></path>
                        </svg>
                      </button>
                    </li>
                    <li className="question_actions delete_action">
                      <button type="button">
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
                          ></path>
                        </svg>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="single_question">
              <div className="row align-items-end">
                <div className="col">
                  <ul className="question_heading">
                    <li className="question_number">R.2</li>
                    <li className="question_name">Luxury Lighting</li>
                  </ul>
                </div>
                <div className="col-auto">
                  <ul className="question_options_area mt-0">
                    <li className="ms-auto question_actions">
                      <button type="button">
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
                          ></path>
                        </svg>
                      </button>
                    </li>
                    <li className="question_actions delete_action">
                      <button type="button">
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
                          ></path>
                        </svg>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="single_question">
              <div className="row align-items-end">
                <div className="col">
                  <ul className="question_heading">
                    <li className="question_number">R.3</li>
                    <li className="question_name">Smart Irrigation</li>
                  </ul>
                </div>
                <div className="col-auto">
                  <ul className="question_options_area mt-0">
                    <li className="ms-auto question_actions">
                      <button type="button">
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
                          ></path>
                        </svg>
                      </button>
                    </li>
                    <li className="question_actions delete_action">
                      <button type="button">
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
                          ></path>
                        </svg>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="single_question">
              <div className="row align-items-end">
                <div className="col">
                  <ul className="question_heading">
                    <li className="question_number">Q.4</li>
                    <li className="question_name">
                      Professional Partner Recommendation
                    </li>
                  </ul>
                </div>
                <div className="col-auto">
                  <ul className="question_options_area mt-0">
                    <li className="ms-auto question_actions">
                      <button type="button">
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
                          ></path>
                        </svg>
                      </button>
                    </li>
                    <li className="question_actions delete_action">
                      <button type="button">
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
                          ></path>
                        </svg>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <DataTable<RuleWithId>
        data={displayedRules}
        columns={columns}
        actions={isActionShow ? actions : undefined}
        emptyMessage="No rules available"
      /> */}

      {/* <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRule(null);
        }}
        title={editingRule ? "Edit Rule" : "Add New Rule"}
      >
        <RuleForm
          initialData={editingRule || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingRule(null);
          }}
        />
      </Modal> */}

      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal12"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal12"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <svg
                width="27"
                height="27"
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="27"
                  height="27"
                  rx="13.5"
                  fill="url(#paint0_linear_790_3208)"
                ></rect>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.2908 18.2908C18.5697 18.0118 18.5697 17.5596 18.2908 17.2806L9.71936 8.70921C9.44042 8.43026 8.98816 8.43026 8.70921 8.70921C8.43026 8.98816 8.43026 9.44042 8.70921 9.71936L17.2806 18.2908C17.5596 18.5697 18.0118 18.5697 18.2908 18.2908Z"
                  fill="#F4F4F4"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.70921 18.2908C8.98816 18.5697 9.44042 18.5697 9.71936 18.2908L18.2908 9.71936C18.5697 9.44042 18.5697 8.98815 18.2908 8.70921C18.0118 8.43026 17.5596 8.43026 17.2806 8.70921L8.70921 17.2806C8.43026 17.5596 8.43026 18.0118 8.70921 18.2908Z"
                  fill="#F4F4F4"
                ></path>
                <defs>
                  <linearGradient
                    id="paint0_linear_790_3208"
                    x1="13.5"
                    y1="0"
                    x2="13.5"
                    y2="27"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#E0B669"></stop>
                    <stop offset="1" stop-color="#B48A3E"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </button>
            <div className="modal-body">
              <div className="head_area">
                <h4 className="head_modal">Add New Rule</h4>
                <p className="sub_head">Enter The details and marked</p>
              </div>

              <div className="input_field">
                <label htmlFor="email">Rule Name *</label>
                <div className="position-relative">
                  <input
                    id="email"
                    placeholder="Enter Rule Name"
                    className="form-control"
                    autoComplete="off"
                    type="email"
                    name="email"
                  />
                </div>
              </div>

              <div
                className="accordion accordion-flush"
                id="accordionCondition"
              >
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseOne"
                      aria-expanded="false"
                      aria-controls="flush-collapseOne"
                    >
                      Condition 1 *
                    </button>
                  </h2>
                  <div
                    id="flush-collapseOne"
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionCondition"
                  >
                    <div className="accordion-body">
                      <select
                        className="form-select"
                        aria-label="Default select example"
                      >
                        <option selected>Select Question</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>

                      <select
                        className="form-select"
                        aria-label="Default select example"
                      >
                        <option selected>Choose Operator</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>

                      <select
                        className="form-select"
                        aria-label="Default select example"
                      >
                        <option selected>Select Values</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseTwo"
                      aria-expanded="false"
                      aria-controls="flush-collapseTwo"
                    >
                      Condition 2 *
                    </button>
                  </h2>
                  <div
                    id="flush-collapseTwo"
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionCondition"
                  >
                    <div className="accordion-body">
                      <select
                        className="form-select"
                        aria-label="Default select example"
                      >
                        <option selected>Select Question</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>

                      <select
                        className="form-select"
                        aria-label="Default select example"
                      >
                        <option selected>Choose Operator</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>

                      <select
                        className="form-select"
                        aria-label="Default select example"
                      >
                        <option selected>Select Values</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>

                      <a href="" className="add_more_value">
                        + Add More Values
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn common_button mt-3">
                Create Rule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
