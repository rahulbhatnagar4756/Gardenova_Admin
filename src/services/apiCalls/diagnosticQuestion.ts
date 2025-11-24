import { apiService } from "..";
import type { ApiResponse } from "../../types/apiResponse";
import type {
  CreateQuestionRequest,
  Question,
  QuestionsResponse,
  UpdateQuestionRequest,
} from "../../types/diagnosticQuestion";
import { API_ROUTES } from "../apiRoutes";

/**
 * Question Service - Contains all question-related API calls
 */
export const questionService = {
  /**
   * Get all questions
   * GET /questions
   */
  getAllQuestions: async (): Promise<ApiResponse<QuestionsResponse>> => {
    return apiService.get<QuestionsResponse>(
      API_ROUTES.diagnosticQuestion.getAllQuestion
    );
  },

  /**
   * Create a new question
   * POST /question
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
   * Update an existing question
   * PUT /question/:id
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
   * Delete a question
   * DELETE /question/:id
   */
  deleteQuestion: async (id: string): Promise<ApiResponse<null>> => {
    return apiService.delete<null>(
      API_ROUTES.diagnosticQuestion.deleteQuestion + `${id}`
    );
  },
};
