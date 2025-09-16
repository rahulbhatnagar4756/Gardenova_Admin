import { useState } from "react";
import "./diagnosticQuestions.css";
import { useDiagnosticQuestions } from "../../hooks/useDiagnosticQuestions";
import { DataTable } from "../../components/dataTable/dataTable";
import { Modal } from "../../components/modal/modal";
import { QuestionForm } from "../../components/questionForm/questionForm";
import { Pencil, Trash2 } from "lucide-react";
import type {
  CreateQuestionRequest,
  Question,
  UpdateQuestionRequest,
} from "../../services/apiCalls/diagnosticQuestion";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../constants/appRoutes";
import { Scale } from "lucide-react";

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
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionWithId | null>(
    null
  );

  const questionsWithId: QuestionWithId[] = questions.map((q, index) => ({
    ...q,
    id: index.toString(),
  }));

  const renderOptionsAsList = (options: string[]) => {
    if (!options || options.length === 0) {
      return <span className="no-options">No options</span>;
    }

    return (
      <div className="options-list">
        {options.map((option, index) => (
          <div key={index} className="option-item">
            <span className="option-number">{index + 1}.</span>
            <span className="option-text">{option}</span>
          </div>
        ))}
      </div>
    );
  };

  const columns = [
    {
      key: "__index",
      label: "Q.No. ",
      className: "question-column",
    },
    {
      key: "questionText",
      label: "Question",
      className: "question-column",
    },
    {
      key: "options",
      label: "Options",
      render: (_value: unknown, item: QuestionWithId) =>
        renderOptionsAsList(item.options),
      className: "options-column",
    },
    {
      key: "order",
      label: "Order",
      className: "order-column",
    },
  ];

  // ... rest of the component logic is the same
  const handleEdit = (question: QuestionWithId) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(id);
      } catch (error) {
        console.error("Failed to delete question:", error);
      }
    }
  };

  const handleSubmit = async (
    data: CreateQuestionRequest | UpdateQuestionRequest
  ) => {
    try {
      if (editingQuestion) {
        await updateQuestion(
          editingQuestion._id,
          data as UpdateQuestionRequest
        );
      } else {
        await createQuestion(data as CreateQuestionRequest);
      }
      setIsModalOpen(false);
      setEditingQuestion(null);
    } catch (error) {
      console.error("Failed to save question:", error);
    }
  };

  const actions = [
    {
      label: "Edit",
      icon: <Pencil size={16} />,
      onClick: (item: QuestionWithId) => handleEdit(item),
      className: "btn-secondary",
    },
    {
      label: "Delete",
      icon: <Trash2 size={16} />,
      onClick: (item: QuestionWithId) => handleDelete(item._id),
      className: "btn-danger",
    },
  ];

  const displayedQuestions = limit
    ? questionsWithId.slice(0, limit)
    : questionsWithId;

  const handleNavigateToRulesPage = () => {
    navigate(`${APP_ROUTES.admin.rules}`);
  };

  if (loading) return <div className="loading">Loading questions...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="diagnostic-page">
      <div className="diagnostic-header">
        <h2>Diagnostic Questions</h2>
        {!limit && (
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Add Question
          </button>
        )}
        {!limit && (
          <button
            onClick={handleNavigateToRulesPage}
            className="btn btn-danger d-flex align-items-center gap-2 px-4 py-2 fw-semibold shadow-sm"
            style={{ fontSize: "16px" }}
          >
            <Scale size={16} />
            Manage Rules
          </button>
        )}
      </div>

      <DataTable<QuestionWithId>
        data={displayedQuestions}
        columns={columns}
        actions={isActionShow ? actions : undefined}
        emptyMessage="No diagnostic questions available"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuestion(null);
        }}
        title={editingQuestion ? "Edit Question" : "Add Question"}
      >
        <QuestionForm
          initialData={
            editingQuestion
              ? {
                  text: editingQuestion.questionText,
                  options: editingQuestion.options,
                  order: editingQuestion.order,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingQuestion(null);
          }}
        />
      </Modal>
    </div>
  );
};
