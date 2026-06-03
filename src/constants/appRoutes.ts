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
    partnerProfiles: "/adminPanel/plants-detail",
    leads: "/adminPanel/leads",
    knowledgeLibrary: "/adminPanel/knowledge-library",
    subscriptionPlans: "/adminPanel/setting/subscription-plans",
    externalLinks:"/adminPanel/setting/external-links",                
  },
};

export const ROUTE_TITLES: Record<string, string> = {
  [APP_ROUTES.admin.dashboard]: "Dashboard",
  [APP_ROUTES.admin.partnerProfiles]: "Plants Detail",
  [APP_ROUTES.admin.diagnosticQuestions]: "Diagnostic Questions",
  [APP_ROUTES.admin.leads]: "Leads",
  [APP_ROUTES.admin.rules]: "Create Rules",
  [APP_ROUTES.admin.knowledgeLibrary]: "Knowledge Library",
  [APP_ROUTES.admin.subscriptionPlans]: "Subscription Plans",
  [APP_ROUTES.admin.externalLinks]:"External Links",
};
