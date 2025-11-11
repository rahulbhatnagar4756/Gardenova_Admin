import { apiService } from "..";
import { API_ROUTES } from "../apiRoutes";

// ---------- Types ---------- //

export interface State {
  name: string;
  iso2: string;
}

export interface StatesResponse {
  country: string;
  states: State[];
  count: number;
}

export interface City {
  id: number;
  name: string;
}

export interface CitiesResponse {
  country: string;
  state: string;
  cities: City[];
  count: number;
}

// ---------- Service ---------- //

export const stateCityDataService = {
  /**
   * Get all states of a specific country (example: "BR" for Brazil)
   */
  getStatesByCountry: () => {
    const url = `${API_ROUTES.stateCityData.getStates}/states`;
    return apiService.get<StatesResponse>(url);
  },

  /**
   * Get all cities of a given state within a country
   * @param iso2 - Country ISO2 code (e.g. "IN")
   * @param stateIso2 - State ISO2 code (e.g. "MH")
   */
  getCitiesByState: (iso2: string, stateIso2: string) => {
    const url = API_ROUTES.stateCityData.getStateCities
      .replace("{iso2}", iso2)
      .replace("{stateIso2}", stateIso2);

    return apiService.get<CitiesResponse>(url);
  },
};
