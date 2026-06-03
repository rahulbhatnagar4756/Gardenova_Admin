/**
 * Represents a plant record with taxonomy, growth characteristics,
 * care requirements, environmental traits, and media resources.
 */
export interface Plant {
    // Identification
    plant_id: number;                 // from p.id (integer)
    scientific_name: string;          // scientific_name text
    common_name: string;              // common_name text
    other_name: string;               // other_name text
    family: string;                   // family text
    genus: string;                    // genus text
    species_epithet: string;          // species_epithet text
    author: string;                   // authority text
    subspecies: string;               // subspecies text
    cultivar: string;                 // cultivar text
    variety: string;                  // variety text (mapped as "variety")
    origin: string;                   // origin text
    
    // Growth & Description
    plant_type: string;               // type text (mapped as "type" twice? but plant_type is used)
    type: string;                     // type text (also mapped separately)
    growth_habit: string;             // (if exists in table, not shown – optional? keep as string)
    description: string;              // description text
    cycle: string;                    // cycle text
    growth_rate: string;              // growth_rate text
    dimension_type: string;           // dimension_type text
    dimension_min_value: string;      // dimension_min_value text
    dimension_max_value: string;      // dimension_max_value text
    dimension_unit: string;           // dimension_unit text
    
    // Care Requirements
    watering: string;                 // watering text
    watering_benchmark_value: string; // watering_benchmark_value text
    watering_benchmark_unit: string;  // watering_benchmark_unit text
    sunlight: string;                 // sunlight text
    hardiness_min: string;            // hardiness_min text
    hardiness_max: string;            // hardiness_max text
    maintenance: string;              // maintenance text
    care_level: string;               // care_level text
    soil: string;                     // soil text
    pruning_month: string;            // pruning_month text
    propagation: string;              // propagation text
    
    // Environmental & Traits
    attracts: string;                 // attracts text
    pest_susceptibility: string;      // pest_susceptibility text
    plant_anatomy: string;            // plant_anatomy text
    drought_tolerant: boolean;        // drought_tolerant boolean
    salt_tolerant: boolean;           // salt_tolerant boolean
    thorny: boolean;                  // thorny boolean
    invasive: boolean;                // invasive boolean
    tropical: boolean;                // tropical boolean
    indoor: boolean;                  // indoor boolean
    
    // Flowers & Fruits
    flowers: boolean;                 // flowers boolean
    flowering_season: string;         // flowering_season text
    cones: boolean;                   // cones boolean
    fruits: boolean;                  // fruits boolean
    edible_fruit: boolean;            // edible_fruit boolean
    harvest_season: string;           // harvest_season text
    leaf: boolean;                    // leaf boolean
    edible_leaf: boolean;             // edible_leaf boolean
    seeds: boolean;                   // seeds boolean
    
    // Usage & Safety
    cuisine: boolean;                 // cuisine boolean
    medicinal: boolean;               // medicinal boolean
    poisonous_to_humans: boolean;     // poisonous_to_humans boolean
    poisonous_to_pets: boolean;       // poisonous_to_pets boolean
    
    // Edibility (additional fields from your mapping)
    edible: boolean;                  // (maybe from another column? Keep as boolean)
    edible_part: string;              // (text column? if exists)
    vegetable: boolean;               // (boolean column? if exists)
    
    // Media & Resources
    care_guides_url: string;          // care_guides_url text
    image_url: string;              // image_url text
    image_original_url: string;       // image_original_url text
    image_regular_url: string;        // image_regular_url text
    image_medium_url: string;         // image_medium_url text
    image_small_url: string;          // image_small_url text
    image_thumbnail: string;          // image_thumbnail text
    image_license: string;            // image_license text
}

/**
 * Administrative plant model.
 *
 * Extends the base Plant interface and is used in
 * admin-facing APIs and management screens.
 */
export interface  AdminPlant extends Plant {
  plant_id: number;
}

/**
 * Paginated plant collection returned by the API.
 */
export interface PaginatedPlantsResponse {
  data: AdminPlant[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}
/**
 * Standard API response for paginated plant data.
 */
export interface AdminPlantApiResponse {
  success: boolean;
  message: string;
  data: PaginatedPlantsResponse;
}