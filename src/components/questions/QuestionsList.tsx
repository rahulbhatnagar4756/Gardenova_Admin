import type { QuestionsListProps } from "../../types/diagnosticQuestion";
import QuestionCard from "./QuestionCard";

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
