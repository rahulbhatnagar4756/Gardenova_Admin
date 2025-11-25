import type { Dispatch, SetStateAction } from "react";

/**
 * Represents a diagnostic question stored in the system.
 *
 * @property id - Unique identifier of the question.
 * @property question - The question text.
 * @property category - Category to which the question belongs.
 * @property logic - Question logic/behavior type.
 * @property options - Array of string options.
 * @property createdAt - Timestamp when question was created.
 * @property updatedAt - Timestamp when question was last updated.
 */
export interface DiagnosticQuestion {
  id: string;
  question: string;
  category: string;
  logic: string;
  options: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a question used in the diagnostic builder/editor.
 *
 * @property question_id - Unique question identifier.
 * @property question_text - Text displayed for the question.
 * @property options - List of selectable options for the question.
 * @property order - Display order of question.
 */
export interface Question {
  question_id: string;
  question_text: string;
  options: QuestionOption[];
  order: number;
}

/**
 * Represents a selectable option for a question.
 *
 * @property id - Unique identifier for the option.
 * @property option_text - Text displayed for the option.
 */
export interface QuestionOption {
  id: string;
  option_text: string;
}

/**
 * Structure used to create a new question.
 *
 * @property question_text - The question text.
 * @property options - List of options for the question.
 * @property order - The question's display order.
 */
export interface CreateQuestionRequest {
  question_text: string;
  options: QuestionOption[];
  order: number;
}

/**
 * Structure used to update an existing question.
 *
 * @property question_text - Updated question text.
 * @property options - Updated list of options.
 * @property order - Updated display order.
 */
export interface UpdateQuestionRequest {
  question_text: string;
  options: QuestionOption[];
  order: number;
}

/**
 * Response returned by API containing a list of diagnostic questions.
 *
 * @property questions - Array of questions.
 */
export interface QuestionsResponse {
  questions: Question[];
}

/**
 * Props for diagnostic questions listing component.
 *
 * @property limit - Max number of questions to display.
 * @property isActionShow - Whether edit/delete actions should be visible.
 */
export interface DiagnosticQuestionsProps {
  limit?: number;
  isActionShow?: boolean;
}

/**
 * Extended question structure including dynamic keys.
 */
export interface QuestionWithId extends Question {
  [key: string]: unknown;
}

/**
 * Props for displaying a list of question cards.
 *
 * @property questions - List of questions.
 * @property loading - Indicates whether questions are loading.
 * @property isActionShow - Whether actions should be shown.
 * @property onEdit - Handler triggered on question edit.
 * @property onDelete - Handler triggered on question delete.
 */
export interface QuestionsListProps {
  questions: QuestionWithId[];
  loading: boolean;
  isActionShow: boolean;
  onEdit: (question: QuestionWithId) => void;
  onDelete: (id: string) => void;
}

/**
 * Props for individual question card UI.
 *
 * @property question - The question being displayed.
 * @property index - Index number for ordering.
 * @property isActionShow - Whether edit/delete buttons are visible.
 * @property onEdit - Edit handler.
 * @property onDelete - Delete handler.
 */
export interface QuestionCardProps {
  question: QuestionWithId;
  index: number;
  isActionShow: boolean;
  onEdit: (question: QuestionWithId) => void;
  onDelete: (id: string) => void;
}

/**
 * Props for question creation/edit modal component.
 *
 * @property isOpen - Whether modal is open.
 * @property editingQuestion - Currently editing question (nullable).
 * @property questionsCount - Total number of existing questions.
 * @property onClose - Handler to close modal.
 * @property onSave - Form submit handler.
 */
export interface QuestionModalProps {
  isOpen: boolean;
  editingQuestion: QuestionWithId | null;
  questionsCount: number;
  onClose: () => void;
  onSave: (
    data: CreateQuestionRequest | UpdateQuestionRequest,
    isEditing: boolean
  ) => Promise<void>;
}

/**
 * Props for managing and displaying a list of question options.
 *
 * @property options - List of current options.
 * @property onRemove - Handler to remove an option.
 * @property onUpdate - Handler to update option text.
 * @property editingOptionIndex - Index of option currently being edited.
 * @property setEditingOptionIndex - Setter for editing option index.
 */
export interface OptionsListProps {
  options: QuestionOption[];
  onRemove: (index: number) => void;
  onUpdate: (index: number, text: string) => void;
  editingOptionIndex?: number | null;
  setEditingOptionIndex: Dispatch<SetStateAction<number | null>>;
}

/**
 * Props for the option input used to add new options.
 *
 * @property currentOption - Current value of the option input.
 * @property onOptionChange - Handler to update input text.
 * @property onAddOption - Handler to add new option.
 */
export interface OptionsInputProps {
  currentOption: string;
  onOptionChange: (value: string) => void;
  onAddOption: () => void;
}
