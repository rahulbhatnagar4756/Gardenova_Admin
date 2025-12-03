import type { ApiResponse } from "../types/apiResponse";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/**
 * Retrieves the stored authentication token from localStorage.
 *
 * @returns The JWT token string or null if not found.
 */
const getToken = (): string | null => {
  return localStorage.getItem("token"); // Or sessionStorage.getItem("token")
};

/**
 * Makes an authenticated API request and handles JSON parsing & error handling.
 *
 * @template T - Expected response data type.
 * @param endpoint API endpoint appended to the base URL.
 * @param options Optional fetch settings such as method, headers, or body.
 * @returns A promise resolving to an ApiResponse of type T.
 * @throws Error if the API response is not OK or request fails.
 */
const fetchWithError = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<T> = await response.json();
    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const apiService = {
  /**
   * Sends a GET request to the specified endpoint.
   *
   * @template T - Expected response type.
   * @param endpoint API endpoint path.
   * @returns A promise resolving to an ApiResponse of type T.
   */
  get: <T>(endpoint: string) => fetchWithError<T>(endpoint),
  /**
   * Sends a POST request with JSON payload.
   *
   * @template T - Expected response type.
   * @param endpoint API endpoint path.
   * @param data Request body to send.
   * @returns A promise resolving to an ApiResponse of type T.
   */
  post: <T>(endpoint: string, data: unknown) =>
    fetchWithError<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  /**
   * Sends a PUT request for full resource updates.
   *
   * @template T - Expected response type.
   * @param endpoint API endpoint path.
   * @param data Data to update.
   * @returns A promise resolving to an ApiResponse of type T.
   */
  put: <T>(endpoint: string, data: unknown) =>
    fetchWithError<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  /**
   * Sends a PATCH request for partial updates.
   *
   * @template T - Expected response type.
   * @param endpoint API endpoint path.
   * @param data Partial update payload.
   * @returns A promise resolving to an ApiResponse of type T.
   */
  patch: <T>(endpoint: string, data: unknown) =>
    fetchWithError<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  /**
   * Sends a DELETE request to remove a resource.
   *
   * @template T - Expected response type.
   * @param endpoint API endpoint path.
   * @returns A promise resolving to an ApiResponse of type T.
   */
  delete: <T>(endpoint: string) =>
    fetchWithError<T>(endpoint, {
      method: "DELETE",
    }),
};
