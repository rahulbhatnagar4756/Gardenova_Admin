import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../layouts/mainLayout";
import { Dashboard } from "../pages/dashboard/dashboard";
import { DiagnosticQuestions } from "../pages/diagnosticQuestions/diagnosticQuestions";
import { PartnerProfiles } from "../pages/partnerProfiles/partnerProfiles";
import { Leads } from "../pages/leads/leads";
import { useAuth } from "../hooks/useAuth";
import { Login } from "../pages/auth/login/login";
import { ForgotPassword } from "../pages/auth/forgotPassword/forgotPassword";
import { APP_ROUTES } from "../constants/appRoutes";
import { ProtectedRoute } from "../components/protectedRoute/protectedRoute";
import { Rules } from "../pages/diagnosticQuestions/rules/rules";

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path={APP_ROUTES.auth.login}
        element={
          isAuthenticated ? (
            <Navigate to={APP_ROUTES.admin.root} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path={APP_ROUTES.auth.forgotPassword}
        element={
          isAuthenticated ? (
            <Navigate to={APP_ROUTES.admin.root} replace />
          ) : (
            <ForgotPassword />
          )
        }
      />
      {/* Protected Routes */}
      <Route
        path={APP_ROUTES.admin.root}
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="diagnostic-questions" element={<DiagnosticQuestions />} />
        <Route path="diagnostic-questions/rules" element={<Rules />} />
        <Route path="partner-profiles" element={<PartnerProfiles />} />
        <Route path="leads" element={<Leads />} />
      </Route>
      {/* Redirect root */}
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? APP_ROUTES.admin.root : APP_ROUTES.auth.login}
            replace
          />
        }
      />
    </Routes>
  );
};
