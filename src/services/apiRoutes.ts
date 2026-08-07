
// Base paths
const AUTH_BASE = "/api/v1/auth";
const ADMIN_BASE = "/api/v1/admin";
const PARTNER_PROFILE_BASE = "/api/v1/partnerProfile";
const STATE_CITY_BASE = "/api/v1/stateCityData/countries";
const LEADS = "/api/v1/admin/admin/leads";
const DASHBOARD = "/api/v1/admin/dashboard";
const PLANTS = "/api/v1/allplants";
// const PLANTS = "/api/v1/admin/plants";
const SUBSCRIPTION_PLANS = "/api/v1/plans";
const EXTERNAL_LINKS = "/api/v1/externalLinks";
const PROFESSIONALS = "/api/v1/professional";

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
    reorderQuestions: `${ADMIN_BASE}/question/reorder`,
    questionOptionsGrouped: `${ADMIN_BASE}/question/options-grouped`,
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
    uploadCsv: `${PARTNER_PROFILE_BASE}/upload-csv`,
  },
  stateCityData: {
    getStates: `${STATE_CITY_BASE}`,
    getStateCities: `${STATE_CITY_BASE}/{iso2}/states/{stateIso2}/cities`,
  },
  leads: {
    getAll: `${LEADS}`,
    // updateStatus: `${LEADS}/`,
  },
  admin: {
    dashboard: `${DASHBOARD}`,
    users: `${ADMIN_BASE}/users`,
    userById: `${ADMIN_BASE}/users`,
    diagnosisScans: `${ADMIN_BASE}/diagnosis-scans`,
    diagnosisScanById: `${ADMIN_BASE}/diagnosis-scans`,
    plantCatalog: `${ADMIN_BASE}/plant-catalog`,
    plantCatalogById: `${ADMIN_BASE}/plant-catalog`,
  },
  plants: {
    create: `${PLANTS}`,
    getAll: `${PLANTS}`,
    getById: `${PLANTS}`,
    update: `${PLANTS}/`,
    delete: `${PLANTS}/`,
    AdmingetAll: `${PLANTS}/admin/getAllPlants`,
  },
  subscriptionPlans: {
    createPlan: `${SUBSCRIPTION_PLANS}/`,
    getAllPlans: `${SUBSCRIPTION_PLANS}/getplans`,
    updatePlan: `${SUBSCRIPTION_PLANS}/update`,
    updateStatus: `${SUBSCRIPTION_PLANS}/status`, 
  },   
  externalLinks: {
    getAll: `${EXTERNAL_LINKS}/`,
    create: `${EXTERNAL_LINKS}/`,
    update: `${EXTERNAL_LINKS}/`,
    delete: `${EXTERNAL_LINKS}/`,
  },
  PROFESSIONALS:{
      upload: `${PROFESSIONALS}/import`,
      getAll: `${PROFESSIONALS}/`,
      register: `${PROFESSIONALS}/register`,
      getById: `${PROFESSIONALS}/admin/getProfessionalsById`,
      updateById: `${PROFESSIONALS}/updateProfessionalProfile`,
      updateRating: `${PROFESSIONALS}/updateRating`,
      updateFounderStatus: `${PROFESSIONALS}/updateFounderStatus`,

  }
} as const;

/**
 * Represents the full type structure of all API route keys
 * defined inside the API_ROUTES object. Useful for
 * autocomplete and strict typing across API services.
 */
export type ApiRoute = typeof API_ROUTES;
