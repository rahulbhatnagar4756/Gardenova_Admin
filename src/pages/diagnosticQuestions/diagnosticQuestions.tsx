import { useEffect, useState } from "react";
import "./diagnosticQuestions.css";
import { useDiagnosticQuestions } from "../../hooks/useDiagnosticQuestions";
import { useToast } from "../../hooks/useToast";
import ConfirmModal from "../../components/confirmModal";
import PageHeader from "../../components/questions/PageHeader";
import QuestionsList from "../../components/questions/QuestionsList";
import QuestionModal from "../../components/questions/QuestionModal";
import type {
  CreateQuestionRequest,
  DiagnosticQuestionsProps,
  QuestionWithId,
  UpdateQuestionRequest,
} from "../../types/diagnosticQuestion";
import { Loader } from "../../components/loader";

/**
 * Diagnostic Questions page component.
 *
 * @param {DiagnosticQuestionsProps} props Component props.
 * @param {number} props.limit Optional limit for number of questions shown.
 * @param {boolean} props.isActionShow Whether to show action buttons.
 * @returns {JSX.Element} The Diagnostic Questions component.
 */
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

  /**
   * Opens the modal for adding a new question.
   *
   * @returns {void}
   */
  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  /**
   * Opens the modal for editing a selected question.
   *
   * @param {QuestionWithId} question The question to edit.
   * @returns {void}
   */
  const handleEdit = (question: QuestionWithId) => {
    const cloned = JSON.parse(JSON.stringify(question)); // deep clone
    setEditingQuestion(cloned);
    setIsModalOpen(true);
  };

  /**
   * Handles deleting a question after user confirmation.
   *
   * @returns {Promise<void>} Resolves once the question is deleted.
   */
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

  /**
   * Closes the question modal and resets editing state.
   *
   * @returns {void}
   */
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  /**
   * Saves a question — either creates a new one or updates an existing one.
   *
   * @param {CreateQuestionRequest | UpdateQuestionRequest} questionData Data to save.
   * @param {boolean} isEditing Whether the user is editing an existing question.
   * @returns {Promise<void>} Resolves when saving is completed.
   */
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

  if (loading) return <Loader text="Loading your questions..." />;
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
