// Base paths
const AUTH_BASE = "/api/v1/auth";
const ADMIN_BASE = "/api/v1/admin";
const PARTNER_PROFILE_BASE = "/api/v1/partnerProfile";
const STATE_CITY_BASE = "/api/v1/stateCityData/countries";
const LEADS = "/api/v1/admin/leads";
const DASHBOARD = "/api/v1/admin/dashboard";

// apiRoutes.ts
export const API_ROUTES = {
  auth: {
    // Authenticate login routes
    login: `${AUTH_BASE}/login`,
    register: `${AUTH_BASE}/register`,
    forgotPassword: `${AUTH_BASE}/passwordResetToken`,
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
    getById: `${PARTNER_PROFILE_BASE}`,
    create: `${PARTNER_PROFILE_BASE}`,
    update: `${PARTNER_PROFILE_BASE}`,
    delete: `${PARTNER_PROFILE_BASE}`,
    updateRating: `${PARTNER_PROFILE_BASE}/rating`,
    updateStatus: `${PARTNER_PROFILE_BASE}/status`,
  },
  stateCityData: {
    getStates: `${STATE_CITY_BASE}`,
    getStateCities: `${STATE_CITY_BASE}/{iso2}/states/{stateIso2}/cities`,
  },
  leads: {
    getAll: `${LEADS}`,
    updateStatus: `${LEADS}/`,
  },
  admin: {
    dashboard: `${DASHBOARD}`,
  },
} as const;

/**
 * Represents the full type structure of all API route keys
 * defined inside the API_ROUTES object. Useful for
 * autocomplete and strict typing across API services.
 */
export type ApiRoute = typeof API_ROUTES;
