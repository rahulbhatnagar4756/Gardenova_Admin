import { useEffect, useState } from "react";
import { questionService } from "../services/apiCalls/diagnosticQuestion";
import type {
  CreateQuestionRequest,
  Question,
  UpdateQuestionRequest,
} from "../types/diagnosticQuestion";

/**
 * Sorts questions by their display order ascending.
 *
 * @param {Question[]} list Questions to sort.
 * @returns {Question[]} Sorted copy of the list.
 */
const sortByOrder = (list: Question[]): Question[] =>
  [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

/**
 * Custom hook to manage diagnostic questions with CRUD operations and state.
 *
 * @returns {{
 *   questions: Question[],
 *   loading: boolean,
 *   error: string | null,
 *   fetchQuestions: () => Promise<void>,
 *   createQuestion: (data: CreateQuestionRequest) => Promise<any>,
 *   updateQuestion: (id: string, data: UpdateQuestionRequest) => Promise<any>,
 *   deleteQuestion: (id: string) => Promise<any>,
 *   reorderQuestions: (reordered: Question[]) => Promise<any>,
 *   clearError: () => void
 * }} Diagnostic questions hook API.
 */
export const useDiagnosticQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches all diagnostic questions from the server.
   *
   * @returns {Promise<void>} Resolves when questions are fetched.
   */
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionService.getAllQuestions();

      if (response.success) {
        setQuestions(sortByOrder(response.data.questions));
        setError(null);
      } else {
        setError("Failed to fetch questions");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch questions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  /**
   * Creates a new diagnostic question.
   *
   * @param {CreateQuestionRequest} data The question details to create.
   * @returns {Promise<any>} The response returned by the API.
   */
  const createQuestion = async (data: CreateQuestionRequest) => {
    try {
      // Optimistic update
      const tempQuestion: Question = {
        question_id: "",
        question_text: data.question_text,
        options: data.options.map((opt, index) => ({
          id: opt.id ?? `temp-${index}`,
          option_text: opt.option_text,
        })),
        order: data.order,
      };

      setQuestions((prev) => [...prev, tempQuestion]);

      const response = await questionService.createQuestion(data);

      if (response.success) {
        // Refetch to get the actual data from server (with any server-generated fields)
        await fetchQuestions();
        return response;
      } else {
        // Rollback optimistic update
        setQuestions((prev) => prev.slice(0, -1));
        throw new Error("Failed to create question");
      }
    } catch (err) {
      // Rollback optimistic update
      setQuestions((prev) => prev.slice(0, -1));
      setError(
        err instanceof Error ? err.message : "Failed to create question"
      );
      throw err;
    }
  };

  /**
   * Updates an existing diagnostic question.
   *
   * @param {string} id The ID of the question to update.
   * @param {UpdateQuestionRequest} data Updated question details.
   * @returns {Promise<any>} The API response after update.
   */
  const updateQuestion = async (id: string, data: UpdateQuestionRequest) => {
    const originalQuestions = [...questions];
    const questionIndex = questions.findIndex((q) => q.question_id === id);

    if (questionIndex === -1) {
      throw new Error("Question not found");
    }

    try {
      const updatedQuestion: Question = {
        question_id: id,
        question_text: data.question_text,
        options: data.options.map((opt, index) => ({
          id: opt.id ?? `temp-${index}`,
          option_text: opt.option_text,
        })),
        order: data.order,
      };

      setQuestions((prev) =>
        prev.map((q, index) => (index === questionIndex ? updatedQuestion : q))
      );

      const response = await questionService.updateQuestion(id, data);

      if (response.success) {
        await fetchQuestions();
        return response;
      }

      setQuestions(originalQuestions);
      throw new Error("Failed to update question");
    } catch (err) {
      setQuestions(originalQuestions);
      setError(
        err instanceof Error ? err.message : "Failed to update question"
      );
      throw err;
    }
  };

  /**
   * Deletes a diagnostic question by ID.
   *
   * @param {string} id The ID of the question to delete.
   * @returns {Promise<any>} API response confirming deletion.
   */
  const deleteQuestion = async (id: string) => {
    // Keep a copy of the current state in case we need to rollback
    const originalQuestions = [...questions];

    try {
      const response = await questionService.deleteQuestion(id);

      if (response.success) {
        // Optimistic update - remove question locally
        setQuestions((prev) => prev.filter((q) => q.question_id !== id));
        // ✅ On success, state is already updated, nothing else needed
        return response;
      } else {
        // Rollback if API fails
        setQuestions(originalQuestions);
        throw new Error("Failed to delete question");
      }
    } catch (err) {
      // Rollback in case of error
      setQuestions(originalQuestions);
      setError(
        err instanceof Error ? err.message : "Failed to delete question"
      );
      throw err;
    }
  };

  /**
   * Persists a new question order after drag-and-drop or move up/down.
   *
   * @param {Question[]} reordered Questions in the desired order.
   * @returns {Promise<any>} The API response after reorder.
   */
  const reorderQuestions = async (reordered: Question[]) => {
    const originalQuestions = [...questions];
    const withOrder = reordered.map((q, index) => ({
      ...q,
      order: index + 1,
    }));

    try {
      setQuestions(withOrder);

      const response = await questionService.reorderQuestions({
        items: withOrder.map((q) => ({
          id: q.question_id,
          order: q.order,
        })),
      });

      if (response.success) {
        return response;
      }

      setQuestions(originalQuestions);
      throw new Error("Failed to reorder questions");
    } catch (err) {
      setQuestions(originalQuestions);
      setError(
        err instanceof Error ? err.message : "Failed to reorder questions"
      );
      throw err;
    }
  };

  /**
   * Clears the current error state.
   *
   * @returns {void}
   */
  const clearError = () => {
    setError(null);
  };

  return {
    questions,
    loading,
    error,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    refetch: fetchQuestions,
    clearError,
  };
};
