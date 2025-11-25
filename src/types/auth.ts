import type { ForgotPasswordSteps } from "../constants";

/**
 * Represents a user in the authentication system.
 *
 * @property id - Unique identifier of the user.
 * @property email - User's email address.
 * @property name - Full name of the user.
 * @property role - Optional role assigned to the user.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

/**
 * Credentials used during login.
 *
 * @property email - The user's email.
 * @property password - The user's password.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Data required to initiate the forgot password process.
 *
 * @property email - Email requesting password reset.
 * @property isResend - Whether the reset email is being resent.
 */
export interface ForgotPasswordData {
  email: string;
  isResend: boolean;
}

/**
 * Response returned by authentication endpoints.
 *
 * @property token - JWT token returned on successful login.
 * @property message - Optional status or success message.
 */
export interface AuthResponse {
  token: string;
  message?: string;
}

/**
 * Structure of a decoded JWT token.
 *
 * @property userEmail - Email extracted from token.
 * @property role - Assigned role of the user.
 * @property userId - ID of the authenticated user.
 * @property iat - Issued-at timestamp.
 * @property exp - Expiration timestamp.
 */
export interface DecodedToken {
  userEmail: string;
  role: string;
  userId: string;
  iat: number;
  exp: number;
}

/**
 * Data used to validate a password reset token.
 *
 * @property email - Email address associated with reset request.
 * @property token - Reset token to validate.
 */
export interface VerifyResetTokenData {
  email: string;
  token: string;
}

/**
 * Structure of the authentication context used across the app.
 *
 * @property token - The current JWT token, if available.
 * @property login - Method to update authentication state with a new token.
 * @property logout - Method to clear authentication state.
 * @property isAuthenticated - Whether the user is currently authenticated.
 * @property isLoading - Whether authentication state is still loading.
 */
export interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Represents a single step in the forgot-password flow.
 *
 * Derived from the `ForgotPasswordSteps` enum.
 */
export type ForgotPasswordStep =
  (typeof ForgotPasswordSteps)[keyof typeof ForgotPasswordSteps];
