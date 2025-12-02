/**
 * Generic API response wrapper used across the application.
 *
 * @template T - Type of the data returned by the API.
 * @property data - Actual response payload.
 * @property message - Optional status or success message.
 * @property success - Whether the API request was successful.
 */
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

/**
 * Standard structure for API errors.
 *
 * @property message - Human-readable error message.
 * @property status - HTTP status code associated with the error.
 */
export interface ApiError {
  message: string;
  status: number;
}

/**
 * Standard structure for API errors.
 *
 * @property message - Human-readable error message.
 * @property status - HTTP status code associated with the error.
 */
export interface ApiError {
  message: string;
  code?: number;
  details?: unknown;
}
