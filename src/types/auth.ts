import type { ForgotPasswordSteps } from "../constants";

// types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
  isResend: boolean;
}

export interface AuthResponse {
  token: string;
  message?: string;
}

// types/auth.ts
export interface DecodedToken {
  userEmail: string;
  role: string;
  userId: string;
  iat: number;
  exp: number;
}

export interface VerifyResetTokenData {
  email: string;
  token: string;
}

export interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type ForgotPasswordStep =
  (typeof ForgotPasswordSteps)[keyof typeof ForgotPasswordSteps];
