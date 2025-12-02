import { apiService } from "..";
import type { ApiResponse } from "../../types/apiResponse";
import type {
  CreateQuestionRequest,
  GroupedOptionsResponse,
  Question,
  QuestionsResponse,
  UpdateQuestionRequest,
} from "../../types/diagnosticQuestion";
import { API_ROUTES } from "../apiRoutes";

/**
 * Question Service - Contains all question-related API calls.
 * Provides operations for retrieving, creating, updating,
 * and deleting diagnostic questions.
 */
export const questionService = {
  /**
   * Fetch all diagnostic questions.
   * GET /questions
   *
   * @returns A promise resolving to an ApiResponse containing all questions.
   */
  getAllQuestions: async (): Promise<ApiResponse<QuestionsResponse>> => {
    return apiService.get<QuestionsResponse>(
      API_ROUTES.diagnosticQuestion.getAllQuestion
    );
  },

  /**
   * Create a new diagnostic question.
   * POST /question
   *
   * @param data The payload containing the question text, options, and order.
   * @returns A promise resolving to an ApiResponse with null data.
   */
  createQuestion: async (
    data: CreateQuestionRequest
  ): Promise<ApiResponse<null>> => {
    return apiService.post<null>(
      API_ROUTES.diagnosticQuestion.createQuestion,
      data
    );
  },

  /**
   * Update an existing diagnostic question by ID.
   * PUT /question/:id
   *
   * @param id Unique identifier of the question to update.
   * @param data Updated question payload including text, options, and order.
   * @returns A promise resolving to an ApiResponse containing the updated question.
   */
  updateQuestion: async (
    id: string,
    data: UpdateQuestionRequest
  ): Promise<ApiResponse<Question>> => {
    return apiService.put<Question>(
      API_ROUTES.diagnosticQuestion.updateQuestion + `${id}`,
      data
    );
  },

  /**
   * Delete a diagnostic question by its ID.
   * DELETE /question/:id
   *
   * @param id Unique identifier of the question to delete.
   * @returns A promise resolving to an ApiResponse with null data.
   */
  deleteQuestion: async (id: string): Promise<ApiResponse<null>> => {
    return apiService.delete<null>(
      API_ROUTES.diagnosticQuestion.deleteQuestion + `${id}`
    );
  },

  /**
   * Fetch grouped diagnostic question options.
   * GET /question/options-grouped
   *
   * @returns A promise resolving to an ApiResponse containing grouped options.
   */
  getGroupedOptions: async (): Promise<ApiResponse<GroupedOptionsResponse>> => {
    return apiService.get<GroupedOptionsResponse>(
      API_ROUTES.diagnosticQuestion.questionOptionsGrouped
    );
  },
};
