import { useState } from "react";
import type {
  QuestionWithId,
  QuestionsListProps,
} from "../../types/diagnosticQuestion";
import QuestionCard from "./QuestionCard";

/**
 * Moves an item from one index to another within a list.
 *
 * @param {QuestionWithId[]} list Source list.
 * @param {number} fromIndex Index being moved.
 * @param {number} toIndex Destination index.
 * @returns {QuestionWithId[]} New list with the item moved.
 */
const moveItem = (
  list: QuestionWithId[],
  fromIndex: number,
  toIndex: number
): QuestionWithId[] => {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length
  ) {
    return list;
  }

  const next = [...list];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
};

/**
 * Renders a list of diagnostic questions with optional edit, delete, and reorder actions.
 *
 * @param {QuestionsListProps} root0 Component props.
 * @returns {JSX.Element} The rendered list of questions.
 */
const QuestionsList = ({
  questions,
  loading,
  isActionShow,
  onEdit,
  onDelete,
  onReorder,
  reordering = false,
}: QuestionsListProps) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

  /**
   * Applies a reorder and notifies the parent.
   *
   * @param {number} fromIndex Source index.
   * @param {number} toIndex Destination index.
   * @returns {void}
   */
  const applyReorder = (fromIndex: number, toIndex: number) => {
    if (!onReorder || reordering) return;
    const next = moveItem(questions, fromIndex, toIndex);
    if (next === questions) return;
    onReorder(next);
  };

  return (
    <div className={`questions-container${reordering ? " is-reordering" : ""}`}>
      {questions.map((question, index) => (
        <QuestionCard
          key={question.question_id || index}
          question={question}
          index={index}
          isActionShow={isActionShow}
          onEdit={onEdit}
          onDelete={onDelete}
          onMoveUp={() => applyReorder(index, index - 1)}
          onMoveDown={() => applyReorder(index, index + 1)}
          canMoveUp={index > 0}
          canMoveDown={index < questions.length - 1}
          isDragging={dragIndex === index}
          isDragOver={dragOverIndex === index && dragIndex !== index}
          reordering={reordering}
          onDragStart={(e) => {
            if (!isActionShow || reordering) return;
            setDragIndex(index);
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", String(index));
          }}
          onDragOver={(e) => {
            if (dragIndex === null || reordering) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            if (dragOverIndex !== index) setDragOverIndex(index);
          }}
          onDragLeave={() => {
            if (dragOverIndex === index) setDragOverIndex(null);
          }}
          onDrop={(e) => {
            e.preventDefault();
            const from =
              dragIndex ?? Number(e.dataTransfer.getData("text/plain"));
            setDragIndex(null);
            setDragOverIndex(null);
            if (Number.isNaN(from)) return;
            applyReorder(from, index);
          }}
          onDragEnd={() => {
            setDragIndex(null);
            setDragOverIndex(null);
          }}
        />
      ))}
    </div>
  );
};

export default QuestionsList;
