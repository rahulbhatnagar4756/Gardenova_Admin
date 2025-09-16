import React, { useEffect, useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";
import type { DecodedToken } from "../types/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Token validation function
  const validateToken = (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);

      // Check expiration (convert seconds → ms)
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        console.warn("Token expired");
        return false;
      }

      // Check role
      if (decoded.role !== "Admin") {
        console.warn("Unauthorized role");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Invalid token", error);
      return false;
    }
  };

  // Auto-validate token from localStorage on load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && validateToken(storedToken)) {
      setToken(storedToken);
    } else {
      localStorage.removeItem("token");
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    if (validateToken(newToken)) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem("token");
      setToken(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
