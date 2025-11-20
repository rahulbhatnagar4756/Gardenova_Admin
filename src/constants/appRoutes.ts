export const APP_ROUTES = {
  auth: {
    login: "/login",
    forgotPassword: "/forgotpassword",
  },
  admin: {
    root: "/adminPanel",
    dashboard: "/adminPanel",
    diagnosticQuestions: "/adminPanel/diagnostic-questions",
    rules: "/adminPanel/rules",
    partnerProfiles: "/adminPanel/partner-profiles",
    leads: "/adminPanel/leads",
  },
};

export const ROUTE_TITLES: Record<string, string> = {
  [APP_ROUTES.admin.dashboard]: "Dashboard",
  [APP_ROUTES.admin.partnerProfiles]: "Professionals",
  [APP_ROUTES.admin.diagnosticQuestions]: "Diagnostic Questions",
  [APP_ROUTES.admin.leads]: "Leads",
  [APP_ROUTES.admin.rules]: "Create Rules",
};
