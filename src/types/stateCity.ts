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
