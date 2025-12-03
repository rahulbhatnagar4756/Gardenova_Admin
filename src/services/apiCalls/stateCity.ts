import { apiService } from "..";
import type { CitiesResponse, StatesResponse } from "../../types/stateCity";
import { API_ROUTES } from "../apiRoutes";

export const stateCityDataService = {
  /**
   * Get all states of a specific country (e.g., "BR" for Brazil).
   *
   * @returns A promise resolving to a list of states with metadata.
   */
  getStatesByCountry: () => {
    const url = `${API_ROUTES.stateCityData.getStates}/states`;
    return apiService.get<StatesResponse>(url);
  },

  /**
   * Get all cities of a given state within a specific country.
   *
   * @param iso2 Country ISO2 code (e.g., "IN").
   * @param stateIso2 State ISO2 code (e.g., "MH").
   * @returns A promise resolving to a list of cities for the specified state.
   */
  getCitiesByState: (iso2: string, stateIso2: string) => {
    const url = API_ROUTES.stateCityData.getStateCities
      .replace("{iso2}", iso2)
      .replace("{stateIso2}", stateIso2);

    return apiService.get<CitiesResponse>(url);
  },
};
