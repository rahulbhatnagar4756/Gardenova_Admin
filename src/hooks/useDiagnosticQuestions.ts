import { useEffect, useState } from "react";
import {
  questionService,
  type CreateQuestionRequest,
  type Question,
  type UpdateQuestionRequest,
} from "../services/apiCalls/diagnosticQuestion";

export const useDiagnosticQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const createQuestion = async (data: CreateQuestionRequest) => {
    debugger;
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

  const updateQuestion = async (id: string, data: UpdateQuestionRequest) => {
    debugger;
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

  const deleteQuestion = async (id: string) => {
    debugger;
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
