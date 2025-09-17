// import { Routes, Route, Navigate } from "react-router-dom";
// import { MainLayout } from "../layouts/mainLayout";
// import { Dashboard } from "../pages/dashboard/dashboard";
// import { DiagnosticQuestions } from "../pages/diagnosticQuestions/diagnosticQuestions";
// import { PartnerProfiles } from "../pages/partnerProfiles/partnerProfiles";
// import { Leads } from "../pages/leads/leads";
// import { useAuth } from "../hooks/useAuth";
// import { Login } from "../pages/auth/login/login";
// import { ForgotPassword } from "../pages/auth/forgotPassword/forgotPassword";
// import { APP_ROUTES } from "../constants/appRoutes";
// import { ProtectedRoute } from "../components/protectedRoute/protectedRoute";
// import { Rules } from "../pages/diagnosticQuestions/rules/rules";

// export const AppRoutes = () => {
//   //const { isAuthenticated } = useAuth();

//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route
//         path={APP_ROUTES.auth.login}
//         element={
//           isAuthenticated ? (
//             <Navigate to={APP_ROUTES.admin.root} replace />
//           ) : (
//             <Login />
//           )
//         }
//       />
//       <Route
//         path={APP_ROUTES.auth.forgotPassword}
//         element={
//           isAuthenticated ? (
//             <Navigate to={APP_ROUTES.admin.root} replace />
//           ) : (
//             <ForgotPassword />
//           )
//         }
//       />
//       {/* Protected Routes */}
//       <Route
//         path={APP_ROUTES.admin.root}
//         element={
//           <ProtectedRoute>
//             <MainLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<Dashboard />} />
//         <Route path="diagnostic-questions" element={<DiagnosticQuestions />} />
//         <Route path="diagnostic-questions/rules" element={<Rules />} />
//         <Route path="partner-profiles" element={<PartnerProfiles />} />
//         <Route path="leads" element={<Leads />} />
//       </Route>
//       {/* Redirect root */}
//       <Route
//         path="/"
//         element={
//           <Navigate
//             to={isAuthenticated ? APP_ROUTES.admin.root : APP_ROUTES.auth.login}
//             replace
//           />
//         }
//       />
//     </Routes>
//   );
// };


import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/mainLayout";
import { Dashboard } from "../pages/dashboard/dashboard";
import { DiagnosticQuestions } from "../pages/diagnosticQuestions/diagnosticQuestions";
import { PartnerProfiles } from "../pages/partnerProfiles/partnerProfiles";
import { Leads } from "../pages/leads/leads";
import { Login } from "../pages/auth/login/login";
import { ForgotPassword } from "../pages/auth/forgotPassword/forgotPassword";
import { APP_ROUTES } from "../constants/appRoutes";
import { Rules } from "../pages/diagnosticQuestions/rules/rules";
import ForgotPassword1 from "../pages/auth/Forgot1";
import ForgotPassword2 from "../pages/auth/Forgot2";
import ForgotPassword3 from "../pages/auth/Forgot3";
import ForgotPassword4 from "../pages/auth/Forgot4";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={APP_ROUTES.auth.login} element={<Login />} />
      {/* <Route path={APP_ROUTES.auth.forgotPassword} element={<ForgotPassword />} /> */}
       <Route path={APP_ROUTES.auth.forgotPassword} element={<ForgotPassword1 />} />
       <Route path={APP_ROUTES.auth.forgotPassword2} element={<ForgotPassword2 />} />
       <Route path={APP_ROUTES.auth.forgotPassword3} element={<ForgotPassword3 />} />
       <Route path={APP_ROUTES.auth.forgotPassword4} element={<ForgotPassword4 />} />

      {/* Main Routes (no authentication protection) */}
      <Route path={APP_ROUTES.admin.root} element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="diagnostic-questions" element={<DiagnosticQuestions />} />
        <Route path="diagnostic-questions/rules" element={<Rules />} />
        <Route path="partner-profiles" element={<PartnerProfiles />} />
        <Route path="leads" element={<Leads />} />
      </Route>

      {/* Redirect root to dashboard (or login if you prefer) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

