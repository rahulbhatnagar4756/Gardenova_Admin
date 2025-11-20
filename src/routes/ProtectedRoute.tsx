// Create a new file: components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { APP_ROUTES } from "../constants/appRoutes";
import type { ProtectedRouteProps } from "../types";

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
