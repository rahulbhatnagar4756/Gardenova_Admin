/** Care instruction blocks returned with plant master data. */
export interface PlantCareInstructions {
  watering?: string | null;
  sunlight?: string | null;
  pruning?: string | null;
  [key: string]: string | null | undefined;
}

/** Admin plant catalog (master) record. */
export interface PlantCatalogItem {
  plant_id: number;
  common_name: string | null;
  scientific_name: string | null;
  other_name: string | null;
  family: string | null;
  genus: string | null;
  species_epithet: string | null;
  hybrid: string | null;
  author: string | null;
  subspecies: string | null;
  cultivar: string | null;
  variety: string | null;
  origin: string | null;
  plant_type: string | null;
  type: string | null;
  cycle: string | null;
  description: string | null;
  watering: string | null;
  watering_benchmark_value: string | null;
  watering_benchmark_unit: string | null;
  sunlight: string | null;
  hardiness_min: string | null;
  hardiness_max: string | null;
  dimension_type: string | null;
  dimension_min_value: string | null;
  dimension_max_value: string | null;
  dimension_unit: string | null;
  growth_rate: string | null;
  maintenance: string | null;
  care_level: string | null;
  soil: string | null;
  pruning_month: string | null;
  propagation: string | null;
  attracts: string | null;
  pest_susceptibility: string | null;
  plant_anatomy: string | null;
  drought_tolerant: boolean | null;
  salt_tolerant: boolean | null;
  thorny: boolean | null;
  invasive: boolean | null;
  tropical: boolean | null;
  indoor: boolean | null;
  flowers: boolean | null;
  flowering_season: string | null;
  cones: boolean | null;
  fruits: boolean | null;
  edible_fruit: boolean | null;
  harvest_season: string | null;
  leaf: boolean | null;
  edible_leaf: boolean | null;
  seeds: boolean | null;
  cuisine: boolean | null;
  medicinal: boolean | null;
  poisonous_to_humans: boolean | null;
  poisonous_to_pets: boolean | null;
  care_guides_url: string | null;
  image_original_url: string | null;
  image_regular_url: string | null;
  image_medium_url: string | null;
  image_small_url: string | null;
  image_thumbnail: string | null;
  image_license: string | null;
  image_url: string | null;
  care_instructions: PlantCareInstructions | null;
}

/** Paginated plant catalog response. */
export interface PlantCatalogListData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  plants: PlantCatalogItem[];
}

/** Query filters for plant catalog. */
export interface PlantCatalogFilters {
  search?: string;
}
