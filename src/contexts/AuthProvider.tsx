import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";
import type { DecodedToken } from "../types/auth";
import { decodePayload } from "../utility/util";
import type { AuthProviderProps } from "../types";

/**
 * Provides authentication context for the application,
 * including token management, login, logout, and validation.
 *
 * @param {{ children: React.ReactNode }} root0 Component props.
 * @param {React.ReactNode} root0.children Nested components.
 * @returns {JSX.Element} The AuthContext provider component.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Validates a JWT token by decoding it and checking its expiration.
   *
   * @param {string} token The JWT token to validate.
   * @returns {boolean} Returns true if the token is valid, otherwise false.
   */
  const validateToken = (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);

      // Decode base64 only for string fields
      const decodedPayload = decodePayload(decoded);

      // Check expiration (convert seconds → ms)
      const isExpired = decodedPayload.exp * 1000 < Date.now();
      if (isExpired) {
        console.warn("Token expired");
        return false;
      }

      // Check role
      if (decodedPayload.role !== "Admin") {
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

  /**
   * Saves a new token and logs in the user.
   *
   * @param {string} newToken The JWT token to store and validate.
   * @returns {void}
   */
  const login = (newToken: string) => {
    if (validateToken(newToken)) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem("token");
      setToken(null);
    }
  };

  /**
   * Logs out the user by clearing the stored token.
   *
   * @returns {void}
   */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

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
