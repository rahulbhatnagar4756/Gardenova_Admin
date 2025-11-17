import { useEffect, useState } from "react";
import "./diagnosticQuestions.css";
import { useDiagnosticQuestions } from "../../hooks/useDiagnosticQuestions";
import type {
  CreateQuestionRequest,
  Question,
  UpdateQuestionRequest,
} from "../../services/apiCalls/diagnosticQuestion";
import { useToast } from "../../hooks/useToast";
import ConfirmModal from "../../components/confirmModal";
import PageHeader from "../../components/questions/PageHeader";
import QuestionsList from "../../components/questions/QuestionsList";
import QuestionModal from "../../components/questions/QuestionModal";

interface DiagnosticQuestionsProps {
  limit?: number;
  isActionShow?: boolean;
}

interface QuestionWithId extends Question {
  [key: string]: unknown;
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
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const questionsWithId: QuestionWithId[] = questions.map((q, index) => ({
    ...q,
    id: index.toString(),
  }));

  const displayedQuestions = limit
    ? questionsWithId.slice(0, limit)
    : questionsWithId;

  useEffect(() => {
    if (error) {
      showError(`Error: ${error}`);
    }
  }, [error, showError]);

  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleEdit = (question: QuestionWithId) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteQuestion(deleteId);
      showSuccess("Question deleted successfully!");
    } catch {
      showError("Failed to delete question");
    }

    setDeleteId(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleSaveQuestion = async (
    questionData: CreateQuestionRequest | UpdateQuestionRequest,
    isEditing: boolean
  ) => {
    try {
      if (isEditing && editingQuestion) {
        await updateQuestion(editingQuestion.question_id, questionData);
        showSuccess("Question updated successfully!");
      } else {
        await createQuestion(questionData);
        showSuccess("Question created successfully!");
      }
      setIsModalOpen(false);
      setEditingQuestion(null);
    } catch {
      showError("Failed to save question");
    }
  };

  return (
    <>
      <div className="main_page">
        <PageHeader onAddClick={handleOpenAddModal} />

        <QuestionsList
          questions={displayedQuestions}
          loading={loading}
          isActionShow={isActionShow}
          onEdit={handleEdit}
          onDelete={setDeleteId}
        />
      </div>

      <QuestionModal
        isOpen={isModalOpen}
        editingQuestion={editingQuestion}
        questionsCount={questions.length}
        onClose={handleModalClose}
        onSave={handleSaveQuestion}
      />

      <ConfirmModal
        open={!!deleteId}
        title="Delete Question ?"
        message="Are you sure you want to delete this question ?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
};
