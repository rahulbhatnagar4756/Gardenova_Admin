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
    <div className="rules-page">
      <div className="rules-header">
        <h2>Rules Management</h2>

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
      </div>

      <DataTable<RuleWithId>
        data={displayedRules}
        columns={columns}
        actions={isActionShow ? actions : undefined}
        emptyMessage="No rules available"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRule(null);
        }}
        title={editingRule ? "Edit Rule" : "Add Rule"}
      >
        <RuleForm
          initialData={editingRule || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingRule(null);
          }}
        />
      </Modal>
    </div>
  );
};
