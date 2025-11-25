/**
 * Represents a state within a country.
 *
 * @property name - The official name of the state.
 * @property iso2 - The 2-letter ISO code of the state.
 */
export interface State {
  name: string;
  iso2: string;
}

/**
 * Response structure for API that returns states for a country.
 *
 * @property country - The country name for which states are listed.
 * @property states - Array of state objects.
 * @property count - Total number of states.
 */
export interface StatesResponse {
  country: string;
  states: State[];
  count: number;
}

/**
 * Represents a city within a state.
 *
 * @property id - Unique identifier for the city.
 * @property name - The name of the city.
 */
export interface City {
  id: number;
  name: string;
}

/**
 * Response structure for API that returns cities for a given state.
 *
 * @property country - The country to which the state belongs.
 * @property state - The state name for the cities listed.
 * @property cities - Array of city objects.
 * @property count - Total number of cities.
 */
export interface CitiesResponse {
  country: string;
  state: string;
  cities: City[];
  count: number;
}
