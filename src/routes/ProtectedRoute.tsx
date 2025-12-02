// Create a new file: components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { APP_ROUTES } from "../constants/appRoutes";
import type { ProtectedRouteProps } from "../types";

/**
 * A higher-order component that protects routes by ensuring
 * the user is authenticated before granting access.
 *
 * @param root0 Props object for the ProtectedRoute component.
 * @param root0.children React nodes that should only be rendered
 *                         when the user is authenticated.
 * @returns The protected content if authenticated, a loader when
 *          validating auth, or a redirect to login if unauthorized.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.auth.login} replace />;
  }

  return <>{children}</>;
};
