import type { QuestionOption } from "./diagnosticQuestion";

/**
 * Represents a single condition inside a rule as returned by the backend.
 *
 * @property questionId - Unique ID of the question.
 * @property questionText - Optional text of the question.
 * @property operator - Operator coming from backend (e.g., "é igual", "ou").
 * @property value - Value used for comparison (always a string).
 */
export interface RuleCondition {
  questionId: string;
  questionText?: string;
  operator: string; // backend returns "é igual", "ou", etc.
  value: string; // backend returns string, not array
}

/**
 * Represents a rule containing a set of conditions.
 *
 * @property id - Unique identifier of the rule.
 * @property name - Readable name of the rule.
 * @property conditions - List of associated conditions.
 */
export interface Rule {
  id: string;
  name: string;
  conditions: RuleCondition[];
}

/**
 * Payload structure used when creating a new rule.
 *
 * @property name - Name of the new rule.
 * @property conditions - List of conditions to be created.
 */
export interface CreateRuleRequest {
  name: string;
  conditions: {
    questionId: string;
    operator: "equal" | "and" | "or"; // frontend sends English operators
    value: string; // value must be string
  }[];
}

/**
 * Payload structure for updating an existing rule.
 *
 * @property name - Updated rule name.
 * @property conditions - Updated list of conditions.
 */
export interface UpdateRuleRequest {
  name: string;
  conditions: {
    questionId: string;
    operator: "equal" | "and" | "or";
    value: string;
  }[];
}

/**
 * Wrapper structure returned by API when fetching all rules.
 *
 * @property rules - Array of rule objects.
 */
export interface RulesResponse {
  rules: Rule[];
}

/**
 * Additional props used when displaying rule lists.
 *
 * @property limit - Maximum number of rules to return.
 * @property isActionShow - Whether action buttons (edit/delete) should be visible.
 */
export interface RulesProps {
  limit?: number;
  isActionShow?: boolean;
}

/**
 * Local representation of a rule condition used in forms.
 *
 * @property questionId - ID of the question.
 * @property operator - Logical operator used.
 * @property value - Condition value.
 * @property questionText - Optional readable question text.
 */
export type LocalCondition = {
  questionId: string;
  operator: "equal" | "and" | "or";
  value: string;
  questionText?: string;
};

/**
 * Local form data structure representing an entire rule before submission.
 *
 * @property name - Name of the rule.
 * @property conditions - Array of editable rule conditions.
 */
export type LocalFormData = {
  name: string;
  conditions: LocalCondition[];
};

/**
 * Represents minimal rule data used when editing.
 *
 * @property id - ID of the rule being edited.
 * @property name - Name of the rule.
 */
export interface EditingRule {
  id: string;
  name: string;
}

/**
 * Props for the Rule Modal component.
 *
 * @property isOpen - Indicates whether the modal is visible.
 * @property onClose - Function to close the modal.
 * @property onSubmit - Handler for submitting rule form data.
 * @property editingRule - Current rule being edited (if any).
 * @property initialFormData - Default values for the form.
 * @property questions - Full list of questions used for condition selection.
 */
export interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: LocalFormData) => Promise<void>;
  editingRule: { id: string; name: string } | null;
  initialFormData: LocalFormData;
  questions: QuestionsData;
}

/**
 * Represents an option inside a multiple-choice question.
 *
 * @property id - Unique option identifier.
 * @property option_text - Text shown for the option.
 */
export type Option = {
  id: string;
  option_text: string;
};

/**
 * Represents a question used in rule creation.
 *
 * @property question_id - Unique question ID.
 * @property question_text - Text of the question.
 * @property options - Optional list of selectable options.
 */
export type Question = {
  question_id: string;
  question_text: string;
  options?: Option[];
};

/**
 * Wrapper containing a list of questions.
 *
 * @property questions - Array of question objects.
 */
export type QuestionsData = {
  questions: Question[];
};

/**
 * Return type for the useRules() hook.
 *
 * @property rules - List of all loaded rules.
 * @property loading - Indicates whether rules are being loaded.
 * @property error - Error message if loading fails.
 * @property createRule - Creates a new rule.
 * @property updateRule - Updates an existing rule.
 * @property deleteRule - Deletes a rule by ID.
 * @property refreshRules - Reloads rules from backend.
 */
export interface UseRulesReturn {
  rules: Rule[];
  loading: boolean;
  error: string | null;
  createRule: (data: CreateRuleRequest) => Promise<void>;
  updateRule: (id: string, data: UpdateRuleRequest) => Promise<void>;
  deleteRule: (id: string) => Promise<void>;
  refreshRules: () => Promise<void>;
}

/**
 * Props for an individual option row in the UI.
 *
 * @property option - Option data to display.
 * @property index - Index of the option in the list.
 * @property isEditing - Whether this option is currently being edited.
 * @property onEditStart - Triggered when editing begins.
 * @property onEditSave - Triggered when editing is saved.
 * @property onRemove - Triggered when the option is removed.
 */
export interface OptionItemProps {
  option: QuestionOption;
  index: number;
  isEditing: boolean;
  onEditStart: (index: number) => void;
  onEditSave: (index: number, text: string) => void;
  onRemove: (index: number) => void;
}
