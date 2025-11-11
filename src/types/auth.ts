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
