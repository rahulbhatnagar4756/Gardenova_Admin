// Base paths
const AUTH_BASE = "/api/v1/auth";
const ADMIN_BASE = "/api/v1/admin";
const PARTNER_PROFILE_BASE = "/api/v1/partnerProfile";

// apiRoutes.ts
export const API_ROUTES = {
  auth: {
    // Authenticate login routes
    login: `${AUTH_BASE}/login`,
    register: `${AUTH_BASE}/register`,
    forgotPassword: `${AUTH_BASE}/sendVerificationToken`,
    resetPassword: `${AUTH_BASE}/resetPassword`,
    verifyToken: `${AUTH_BASE}/verifyToken`,
  },
  diagnosticQuestion: {
    // diagnostic question routes
    createQuestion: `${ADMIN_BASE}/question`,
    updateQuestion: `${ADMIN_BASE}/question/`,
    getAllQuestion: `${ADMIN_BASE}/question`,
    deleteQuestion: `${ADMIN_BASE}/question/`,
  },
  rules: {
    // Rule routes
    getAllRules: `${ADMIN_BASE}/rule`,
    createRule: `${ADMIN_BASE}/rule`,
    updateRule: `${ADMIN_BASE}/rule/`,
    deleteRule: `${ADMIN_BASE}/rule/`,
  },
  partnerProfile: {
    // Partner Profile routes
    getAll: `${PARTNER_PROFILE_BASE}`,
    create: `${PARTNER_PROFILE_BASE}`,
    update: `${PARTNER_PROFILE_BASE}/`,
    delete: `${PARTNER_PROFILE_BASE}/`,
  },
} as const;

export type ApiRoute = typeof API_ROUTES;
