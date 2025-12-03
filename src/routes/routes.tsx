import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/mainLayout";
import { Dashboard } from "../pages/dashboard/dashboard";
import { DiagnosticQuestions } from "../pages/diagnosticQuestions/diagnosticQuestions";
import { PartnerProfiles } from "../pages/partnerProfiles/partnerProfiles";
import { Leads } from "../pages/leads/leads";
import { Login } from "../pages/auth/login/login";
import { APP_ROUTES } from "../constants/appRoutes";
import { ForgotPassword } from "../pages/auth/forgotPassword/forgotPassword";
import { ProtectedRoute } from "./ProtectedRoute";
import { Rules } from "../pages/rules/rules";
//import { KnowledgeLibrary } from "../pages/knowledgeLibrary/knowledgeLibrary";

/**
 * Defines all application routes including public, protected,
 * and layout-wrapped routes.
 *
 * @returns The complete JSX route tree for the application.
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={APP_ROUTES.auth.login} element={<Login />} />
      <Route
        path={APP_ROUTES.auth.forgotPassword}
        element={<ForgotPassword />}
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
        <Route path="rules" element={<Rules />} />
        <Route path="partner-profiles" element={<PartnerProfiles />} />
        <Route path="leads" element={<Leads />} />
        {/* <Route path="knowledge-library" element={<KnowledgeLibrary />} /> */}
      </Route>

      {/* Redirect root to dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
};
