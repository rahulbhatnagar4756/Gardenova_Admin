import type { ApiResponse } from "../types/apiResponse";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const getToken = (): string | null => {
  return localStorage.getItem("token"); // Or sessionStorage.getItem("token")
};

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
  get: <T>(endpoint: string) => fetchWithError<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) =>
    fetchWithError<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: unknown) =>
    fetchWithError<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  patch: <T>(endpoint: string, data: unknown) =>
    fetchWithError<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) =>
    fetchWithError<T>(endpoint, {
      method: "DELETE",
    }),
};
