import type { QuestionOption } from "./diagnosticQuestion";

// ---------- Condition (Backend Response Shape) ----------
export interface RuleCondition {
  questionId: string;
  questionText?: string;
  operator: string; // backend returns "é igual", "ou", etc.
  value: string; // backend returns string, not array
}

// ---------- Rule ----------
export interface Rule {
  id: string;
  name: string;
  conditions: RuleCondition[];
}

// ---------- Create Rule ----------
export interface CreateRuleRequest {
  name: string;
  conditions: {
    questionId: string;
    operator: "equal" | "and" | "or"; // frontend sends English operators
    value: string; // value must be string
  }[];
}

// ---------- Update Rule ----------
export interface UpdateRuleRequest {
  name: string;
  conditions: {
    questionId: string;
    operator: "equal" | "and" | "or";
    value: string;
  }[];
}

// ---------- Response Wrapper ----------
export interface RulesResponse {
  rules: Rule[];
}

export interface RulesProps {
  limit?: number;
  isActionShow?: boolean;
}

export type LocalCondition = {
  questionId: string;
  operator: "equal" | "and" | "or";
  value: string;
  questionText?: string;
};

export type LocalFormData = {
  name: string;
  conditions: LocalCondition[];
};

// Simplified interface for editing - only needs id and name
export interface EditingRule {
  id: string;
  name: string;
}

export interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: LocalFormData) => Promise<void>;
  editingRule: { id: string; name: string } | null;
  initialFormData: LocalFormData;
  questions: QuestionsData;
}

export type Option = {
  id: string;
  option_text: string;
};

export type Question = {
  question_id: string;
  question_text: string;
  options?: Option[];
};

export type QuestionsData = {
  questions: Question[];
};

export interface UseRulesReturn {
  rules: Rule[];
  loading: boolean;
  error: string | null;
  createRule: (data: CreateRuleRequest) => Promise<void>;
  updateRule: (id: string, data: UpdateRuleRequest) => Promise<void>;
  deleteRule: (id: string) => Promise<void>;
  refreshRules: () => Promise<void>;
}

export interface OptionItemProps {
  option: QuestionOption;
  index: number;
  isEditing: boolean;
  onEditStart: (index: number) => void;
  onEditSave: (index: number, text: string) => void;
  onRemove: (index: number) => void;
}
