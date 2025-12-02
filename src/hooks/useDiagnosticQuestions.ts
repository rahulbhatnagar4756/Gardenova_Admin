import { useEffect, useState } from "react";
import { questionService } from "../services/apiCalls/diagnosticQuestion";
import type {
  CreateQuestionRequest,
  Question,
  UpdateQuestionRequest,
} from "../types/diagnosticQuestion";

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
        setQuestions(response.data.questions);
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
        options: data.options,
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
    try {
      // Find question by some criteria (since we don't have ID in response)
      const questionIndex = questions.findIndex((q) => q.question_id === id);

      if (questionIndex === -1) {
        throw new Error("Question not found");
      }

      // Optimistic update
      const updatedQuestion: Question = {
        question_id: id,
        question_text: data.question_text,
        options: data.options,
        order: data.order,
      };

      setQuestions((prev) =>
        prev.map((q, index) => (index === questionIndex ? updatedQuestion : q))
      );

      const response = await questionService.updateQuestion(id, data);

      if (response.success) {
        // Keep the optimistic update or refetch for consistency
        return response;
      } else {
        // Rollback optimistic update
        await fetchQuestions();
        throw new Error("Failed to update question");
      }
    } catch (err) {
      // Rollback optimistic update
      await fetchQuestions();
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
    refetch: fetchQuestions,
    clearError,
  };
};
