import { apiService } from "..";
import type {
  AuthResponse,
  ForgotPasswordData,
  LoginCredentials,
  VerifyResetTokenData,
} from "../../types/auth";
import { API_ROUTES } from "../apiRoutes";

export const authService = {
  /**
   * Log in a user using email and password.
   *
   * @param credentials Object containing the user's email and password.
   * @returns A promise resolving to an AuthResponse containing JWT token and message.
   */
  login: (credentials: LoginCredentials) =>
    apiService.post<AuthResponse>(API_ROUTES.auth.login, credentials),

  /**
   * Initiate the forgot password flow.
   *
   * @param data Contains user email and resend flag.
   * @returns A promise resolving to an object containing a status message.
   */
  forgotPassword: (data: ForgotPasswordData) =>
    apiService.post<{ message: string }>(API_ROUTES.auth.forgotPassword, data),

  /**
   * Reset the user's password using email, token, and new password.
   *
   * @param email User's email address.
   * @param token The reset token sent to the user's email.
   * @param password The new password to set.
   * @returns A promise resolving to an object containing a success message.
   */
  resetPassword: (email: string, token: string, password: string) =>
    apiService.patch<{ message: string }>(API_ROUTES.auth.resetPassword, {
      email,
      password,
      token,
    }),

  /**
   * Verify the 6-digit OTP/token for password reset.
   *
   * @param data Contains email and verification token.
   * @returns A promise resolving to an object containing a success message.
   */
  verifyResetToken: (data: VerifyResetTokenData) =>
    apiService.post<{ message: string }>(API_ROUTES.auth.verifyToken, data),

  /**
   * Verify the current authentication token (checks if user is still logged in).
   *
   * @returns A promise resolving to AuthResponse with token and user details.
   */
  verifyToken: () => apiService.get<AuthResponse>(API_ROUTES.auth.verifyToken),
};
