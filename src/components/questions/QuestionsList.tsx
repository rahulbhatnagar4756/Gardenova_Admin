import type { QuestionsListProps } from "../../types/diagnosticQuestion";
import QuestionCard from "./QuestionCard";

/**
 * Renders a list of diagnostic questions with optional edit and delete actions.
 *
 * @param {QuestionsListProps} root0 Component props.
 * @param {Array<any>} root0.questions List of questions to display.
 * @param {boolean} root0.loading Whether the list is currently loading.
 * @param {boolean} root0.isActionShow Whether to show edit/delete buttons.
 * @param {(question: any) => void} root0.onEdit Callback fired when clicking edit.
 * @param {(questionId: string) => void} root0.onDelete Callback fired when clicking delete.
 * @returns {JSX.Element} The rendered list of questions.
 */
const QuestionsList = ({
  questions,
  loading,
  isActionShow,
  onEdit,
  onDelete,
}: QuestionsListProps) => {
  if (questions.length === 0 && !loading) {
    return (
      <div
        className="empty-state"
        style={{ textAlign: "center", padding: "2rem" }}
      >
        <p>
          No questions found. Click "Add Question" to create your first
          question.
        </p>
      </div>
    );
  }

  return (
    <div className="questions-container">
      {questions.map((question, index) => (
        <QuestionCard
          key={question.question_id || index}
          question={question}
          index={index}
          isActionShow={isActionShow}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default QuestionsList;
