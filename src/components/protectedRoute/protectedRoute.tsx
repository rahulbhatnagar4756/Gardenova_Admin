// components/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { ProtectedRouteProps } from "../../types";

/**
 * A wrapper component that protects routes from unauthenticated access.
 * Redirects users to the login page if they are not authenticated.
 *
 * @param {ProtectedRouteProps} root0 Component props.
 * @param {React.ReactNode} root0.children The protected content to display when authenticated.
 * @returns {JSX.Element} The protected route element or a redirect.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
