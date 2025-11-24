import type { Dispatch, SetStateAction } from "react";

export interface DiagnosticQuestion {
  id: string;
  question: string;
  category: string;
  logic: string;
  options: string[];
  createdAt: string;
  updatedAt: string;
}

// Types for Question operations
export interface Question {
  question_id: string;
  question_text: string;
  options: QuestionOption[];
  order: number;
}

export interface QuestionOption {
  id: string;
  option_text: string;
}

export interface CreateQuestionRequest {
  question_text: string;
  options: QuestionOption[];
  order: number;
}

export interface UpdateQuestionRequest {
  question_text: string;
  options: QuestionOption[];
  order: number;
}

export interface QuestionsResponse {
  questions: Question[];
}

export interface DiagnosticQuestionsProps {
  limit?: number;
  isActionShow?: boolean;
}

export interface QuestionWithId extends Question {
  [key: string]: unknown;
}

export interface QuestionsListProps {
  questions: QuestionWithId[];
  loading: boolean;
  isActionShow: boolean;
  onEdit: (question: QuestionWithId) => void;
  onDelete: (id: string) => void;
}

export interface QuestionCardProps {
  question: QuestionWithId;
  index: number;
  isActionShow: boolean;
  onEdit: (question: QuestionWithId) => void;
  onDelete: (id: string) => void;
}

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

export interface OptionsListProps {
  options: QuestionOption[];
  onRemove: (index: number) => void;
  onUpdate: (index: number, text: string) => void;
  editingOptionIndex?: number | null;
  setEditingOptionIndex: Dispatch<SetStateAction<number | null>>;
}

export interface OptionsInputProps {
  currentOption: string;
  onOptionChange: (value: string) => void;
  onAddOption: () => void;
}
