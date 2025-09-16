import { apiService } from "..";
import type {
  AuthResponse,
  ForgotPasswordData,
  LoginCredentials,
} from "../../types/auth";
import { API_ROUTES } from "../apiRoutes";

interface VerifyResetTokenData {
  email: string;
  token: string;
}

export const authService = {
  login: (credentials: LoginCredentials) =>
    apiService.post<AuthResponse>(API_ROUTES.auth.login, credentials),

  forgotPassword: (data: ForgotPasswordData) =>
    apiService.post<{ message: string }>(API_ROUTES.auth.forgotPassword, data),

  resetPassword: (email: string, token: string, password: string) =>
    apiService.patch<{ message: string }>(API_ROUTES.auth.resetPassword, {
      email,
      password,
      token,
    }),

  // New method for verifying the 6-digit token
  verifyResetToken: (data: VerifyResetTokenData) =>
    apiService.post<{ message: string }>(API_ROUTES.auth.verifyToken, data),

  verifyToken: () => apiService.get<AuthResponse>(API_ROUTES.auth.verifyToken),
};
