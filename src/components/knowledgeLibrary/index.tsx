import Select, { type MultiValue } from "react-select";
import React, { useState, useEffect, type JSX } from "react";
import {
  type Plant,
  type SelectOption,
  type CreatePlantData,
  type PlantModalProps,
  getDefaultPlantData,
} from "../../types/plants";
import "./index.css";
import { questionService } from "../../services/apiCalls/diagnosticQuestion";
import { stateCityDataService } from "../../services/apiCalls/stateCity";
import {
  customSelectStyles,
  fileToBase64,
  toOptions,
} from "../../utility/util";
import ConfirmModal from "../confirmModal";
import { useToast } from "../../hooks/useToast";
import type { GroupedOptionsResponse } from "../../types/diagnosticQuestion";

/**
 * Validation errors for plant form fields.
 * Each property contains an optional error message string.
 */
interface ValidationErrors {
  common_name?: string;
  scientific_name?: string;
  description?: string;
  light?: string;
  water_needs?: string;
  maintenance_level?: string;
  locations?: string;
  space_types?: string;
  area_sizes?: string;
  challenges?: string;
  tech_preferences?: string;
  care_notes?: string;
  growth_form?: string;
  image_search_url?: string;
}

/**
 * Plant modal component for creating, editing, or deleting a plant.
 *
 * @param {Object} root0 Component props.
 * @param {Plant | null} root0.plant The plant being edited, or null for create mode.
 * @param {"create" | "edit"} root0.mode Modal mode (create or edit).
 * @param {() => void} root0.onClose Callback fired when the modal closes.
 * @param {(id: string, data: Partial<Plant>) => Promise<void>} [root0.onUpdate] Callback for updating a plant.
 * @param {(id: string) => Promise<void>} [root0.onDelete] Callback for deleting a plant.
 * @param {(data: CreatePlantData) => Promise<void>} [root0.onCreate] Callback for creating a new plant.
 *
 * @returns {JSX.Element} The modal UI.
 */
export const PlantModal: React.FC<PlantModalProps> = ({
  plant,
  mode: initialMode,
  onClose,
  onUpdate,
  onDelete,
  onCreate,
}) => {
  const { showSuccess, showError } = useToast();
  const [editMode, setEditMode] = useState(initialMode === "create");
  const [formData, setFormData] = useState<Plant | CreatePlantData>(
    plant || getDefaultPlantData()
  );
  const [groupedOptions, setGroupedOptions] = useState<GroupedOptionsResponse>({
    space_types: [],
    area_sizes: [],
    challenges: [],
    tech_preferences: [],
  });
  const [states, setStates] = useState<{ name: string; iso2: string }[]>([]);
  const [cities, setCities] = useState<{ name: string }[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [imgFade, setImgFade] = useState(false);
  const initialized = React.useRef(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Load grouped options
  useEffect(() => {
    if (!editMode && initialMode !== "create") return;

    questionService
      .getGroupedOptions()
      .then((res) => res.success && res.data && setGroupedOptions(res.data))
      .catch((err) => console.error("Failed to load options", err));
  }, [editMode, initialMode]);

  // Load states
  useEffect(() => {
    /**
     * Fetches the list of states from the API and updates component state.
     *
     * @returns {Promise<void>} Resolves when the states have been loaded.
     */
    const loadStates = async () => {
      const res = await stateCityDataService.getStatesByCountry();
      if (res.success && res.data?.states) {
        setStates(res.data.states);
      }
    };
    loadStates();
  }, []);

  // Initialize state and city from plant locations
  useEffect(() => {
    if (initialMode === "create") return;
    if (!plant || states.length === 0) return;
    if (initialized.current) return;

    const loc = plant.locations?.[0];
    if (loc) {
      const matchedState = states.find(
        (s) => s.name.toLowerCase() === loc.location_type.toLowerCase()
      );
      setSelectedState(matchedState?.iso2 || "");
      setSelectedCity(loc.location_value || "");
    }

    initialized.current = true;
  }, [plant, states, initialMode]);

  // Load cities when state changes
  useEffect(() => {
    if (!selectedState) return;

    stateCityDataService.getCitiesByState("BR", selectedState).then((res) => {
      if (res.success && res.data?.cities) {
        const list = res.data.cities;
        setCities(list);

        if (list.some((c) => c.name === selectedCity)) return;
        setSelectedCity(list[0]?.name || "");
      }
    });
  }, [selectedState, selectedCity]);

  // Update locations when state or city changes
  useEffect(() => {
    if (initialMode !== "create" && !initialized.current) return;
    if (!selectedState || !selectedCity) return;

    const stateObj = states.find((s) => s.iso2 === selectedState);
    const stateName = stateObj?.name || selectedState;

    handleChange("locations", [
      { location_type: stateName, location_value: selectedCity },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, selectedCity, states, initialMode]);

  // Image fade effect
  useEffect(() => {
    setImgFade(true);
    const t = setTimeout(() => setImgFade(false), 250);
    return () => clearTimeout(t);
  }, [formData?.image_search_url]);

  // Reset form when plant changes
  useEffect(() => {
    if (plant) {
      setFormData(plant);
      setEditMode(initialMode === "create");
      setErrors({});
      setTouched({});
    }
  }, [plant, initialMode]);

  if (!formData) return null;

  /**
   * Validates a single form field and returns an error message if validation fails.
   *
   * @param field The name of the field to validate.
   * @param value The value entered for the field.
   * @returns A string error message if invalid, otherwise undefined.
   */
  const validateField = (
    field: keyof ValidationErrors,
    value: string | string[] | undefined
  ): string | undefined => {
    switch (field) {
      case "common_name":
        if (!value || String(value).trim().length === 0) {
          return "Common name is required";
        }
        if (String(value).trim().length < 2) {
          return "Common name must be at least 2 characters";
        }
        if (String(value).trim().length > 100) {
          return "Common name must not exceed 100 characters";
        }
        break;

      case "scientific_name":
        if (!value || String(value).trim().length === 0) {
          return "Scientific name is required";
        }
        if (String(value).trim().length < 2) {
          return "Scientific name must be at least 2 characters";
        }
        if (String(value).trim().length > 100) {
          return "Scientific name must not exceed 100 characters";
        }
        break;

      case "description":
        if (!value || String(value).trim().length === 0) {
          return "Description is required";
        }
        if (String(value).trim().length < 10) {
          return "Description must be at least 10 characters";
        }
        if (String(value).trim().length > 1000) {
          return "Description must not exceed 1000 characters";
        }
        break;

      case "light":
        if (!value || String(value).trim().length === 0) {
          return "Light requirement is required";
        }
        break;

      case "water_needs":
        if (!value || String(value).trim().length === 0) {
          return "Water needs is required";
        }
        break;

      case "maintenance_level":
        if (!value || String(value).trim().length === 0) {
          return "Maintenance level is required";
        }
        break;

      case "locations":
        if (!selectedState || !selectedCity) {
          return "State and city are required";
        }
        break;

      case "space_types": {
        const spaceTypes = value as string[] | undefined;
        if (!spaceTypes || spaceTypes.length === 0) {
          return "At least one space type is required";
        }
        break;
      }

      case "area_sizes": {
        const areaSizes = value as string[] | undefined;
        if (!areaSizes || areaSizes.length === 0) {
          return "At least one area size is required";
        }
        break;
      }

      case "challenges": {
        const challenges = value as string[] | undefined;
        if (!challenges || challenges.length === 0) {
          return "At least one challenge is required";
        }
        break;
      }

      case "tech_preferences": {
        const techPrefs = value as string[] | undefined;
        if (!techPrefs || techPrefs.length === 0) {
          return "At least one tech preference is required";
        }
        break;
      }

      case "care_notes": {
        const careNotes = value as string[] | undefined;

        if (!careNotes || careNotes.length === 0) {
          return "Care notes cannot be empty";
        }

        if (careNotes.some((note) => note.trim().length === 0)) {
          return "Care notes cannot contain empty entries";
        }
        break;
      }

      case "growth_form":
        if (!value || String(value).trim().length === 0) {
          return "Growth form is required";
        }
        if (String(value).trim().length < 2) {
          return "Growth form must be at least 2 characters";
        }
        break;

      case "image_search_url":
        if (!value || String(value).trim().length === 0) {
          return "Image is required";
        }
        break;
    }
    return undefined;
  };

  /**
   * Validates all form fields and returns true if the form is valid.
   *
   * @returns {boolean} True if the form has no validation errors.
   */
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    newErrors.common_name = validateField("common_name", formData.common_name);
    newErrors.scientific_name = validateField(
      "scientific_name",
      formData.scientific_name
    );
    newErrors.description = validateField("description", formData.description);
    newErrors.light = validateField("light", formData.light);
    newErrors.water_needs = validateField("water_needs", formData.water_needs);
    newErrors.maintenance_level = validateField(
      "maintenance_level",
      formData.maintenance_level
    );
    newErrors.locations = validateField("locations", undefined);

    newErrors.space_types = validateField("space_types", formData.space_types);
    newErrors.area_sizes = validateField("area_sizes", formData.area_sizes);
    newErrors.challenges = validateField("challenges", formData.challenges);
    newErrors.tech_preferences = validateField(
      "tech_preferences",
      formData.tech_preferences
    );
    newErrors.care_notes = validateField("care_notes", formData.care_notes);
    newErrors.growth_form = validateField("growth_form", formData.growth_form);

    newErrors.image_search_url = validateField(
      "image_search_url",
      formData.image_search_url
    );

    // Remove undefined errors
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key as keyof ValidationErrors]) {
        delete newErrors[key as keyof ValidationErrors];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles blur event for a specific form field.
   * Marks the field as touched and validates its current value.
   *
   * @param field The field name being blurred.
   */
  const handleBlur = (field: keyof ValidationErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    let value: string | string[] | undefined;

    switch (field) {
      case "common_name":
      case "scientific_name":
      case "description":
      case "light":
      case "water_needs":
      case "maintenance_level":
      case "growth_form":
      case "image_search_url":
        value = formData[field] as string | undefined;
        break;

      case "space_types":
      case "area_sizes":
      case "challenges":
      case "tech_preferences":
      case "care_notes":
        value = formData[field] as string[] | undefined;
        break;

      case "locations":
        value = undefined; // validator checks selectedState + selectedCity
        break;

      default:
        value = undefined;
    }

    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  /**
   * Updates a specific field in the form data with a new value.
   *
   * @template K - A key of the Plant or CreatePlantData model.
   * @param {K} field The field name to update.
   * @param {Plant[K] | CreatePlantData[K]} value The new value for that field.
   * @returns {void}
   */
  const handleChange = <K extends keyof (Plant & CreatePlantData)>(
    field: K,
    value: (Plant & CreatePlantData)[K]
  ) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));

    // Clear error for this field when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof ValidationErrors];
        return newErrors;
      });
    }
  };

  /**
   * Handles saving the plant based on the current modal mode.
   * Performs create or update operations and shows success/error messages.
   *
   * @returns {Promise<void>} A promise that resolves when the save operation is complete.
   */
  const handleSave = async () => {
    // Mark all fields as touched
    setTouched({
      common_name: true,
      scientific_name: true,
      description: true,
      light: true,
      water_needs: true,
      maintenance_level: true,
      locations: true,
      space_types: true,
      area_sizes: true,
      challenges: true,
      tech_preferences: true,
      care_notes: true,
      growth_form: true,
      image_search_url: true,
    });

    // Validate form
    if (!validateForm()) {
      showError("Please fix all validation errors before saving");
      return;
    }

    setIsSaving(true); // start loading
    if (initialMode === "create" && onCreate) {
      try {
        await onCreate(formData as CreatePlantData);
        showSuccess("Plant created successfully");
        onClose();
      } catch {
        showError("Failed to create plant");
      } finally {
        setIsSaving(false);
      }
    } else if (initialMode === "edit" && onUpdate && "id" in formData) {
      try {
        const { id, ...cleanData } = formData as Plant;
        await onUpdate(id, cleanData);
        showSuccess("Plant updated successfully");
        setEditMode(false);
      } catch {
        showError("Failed to update plant");
      } finally {
        setIsSaving(false); // stop loading
      }
    }
  };

  /**
   * Handles deleting the current plant when in edit mode.
   * Calls the delete API and shows success or error messages.
   *
   * @returns {Promise<void>} A promise that resolves when the delete operation is complete.
   */
  const handleDelete = async () => {
    if (initialMode === "edit" && onDelete && "id" in formData) {
      try {
        await onDelete((formData as Plant).id);
        showSuccess("Plant deleted successfully");
      } catch {
        showError("Failed to delete plant");
      } finally {
        setDeleteModalOpen(false);
      }
    }
  };

  /**
   * Handles updates for multi-select dropdown fields.
   * Converts the selected options into an array of values
   * and updates the specified field in the form data.
   *
   * @param {keyof (Plant & CreatePlantData)} field The field being updated.
   * @param {MultiValue<SelectOption>} selected The selected options from the multi-select component.
   * @returns {void}
   */
  const handleMultiSelectChange = (
    field: keyof (Plant & CreatePlantData),
    selected: MultiValue<SelectOption>
  ) => {
    const values = selected.map((opt) => opt.value);
    handleChange(field, values);
    // Validate this field after change
    if (touched[field]) {
      const error = validateField(field as keyof ValidationErrors, values);
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[field as keyof ValidationErrors] = error;
        } else {
          delete newErrors[field as keyof ValidationErrors];
        }
        return newErrors;
      });
    }
  };

  /**
   * Safely retrieves a field value from either a Plant or CreatePlantData object.
   * Ensures the returned value is never undefined.
   *
   * @template K - A key from Plant or CreatePlantData.
   * @param {Plant | CreatePlantData} data The object containing the field.
   * @param {K} field The field key to read.
   * @returns {(Plant & CreatePlantData)[K] | ""} The field value, or an empty string if undefined.
   */
  const getFieldValue = <K extends keyof (Plant & CreatePlantData)>(
    data: Plant | CreatePlantData,
    field: K
  ): (Plant & CreatePlantData)[K] | "" => {
    return (data as Plant & CreatePlantData)[field] ?? "";
  };

  /**
   * Renders a text input or textarea field for editing a plant attribute.
   *
   * @param {string} label The label displayed for the field.
   * @param {keyof (Plant & CreatePlantData)} field The field key being edited.
   * @param {"input" | "textarea"} [type="input"] Determines whether to render an input or textarea.
   * @param {boolean} [required=false] Whether the field is mandatory and should show a required indicator.
   * @returns {JSX.Element} The rendered form field component.
   */
  const renderField = (
    label: string,
    field: keyof (Plant & CreatePlantData),
    type: "input" | "textarea" = "input",
    required: boolean = false
  ): JSX.Element => {
    const fieldError = errors[field as keyof ValidationErrors];
    const showError = touched[field] && fieldError;

    return (
      <div className="kl-col">
        <label>
          {label}
          {required && <span style={{ color: "#e74c3c" }}> *</span>}
        </label>

        {type === "textarea" ? (
          <textarea
            disabled={!editMode}
            value={String(getFieldValue(formData, field))}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field as keyof ValidationErrors)}
            className={showError ? "kl-input-error" : ""}
          />
        ) : (
          <input
            type="text"
            disabled={!editMode}
            value={String(getFieldValue(formData, field))}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field as keyof ValidationErrors)}
            className={showError ? "kl-input-error" : ""}
          />
        )}

        {showError && <span className="kl-error-message">{fieldError}</span>}
      </div>
    );
  };

  /**
   * Renders a checkbox field used for boolean plant attributes.
   *
   * @param {string} label The label displayed next to the checkbox.
   * @param {keyof (Plant & CreatePlantData)} field The field key to update.
   * @returns {JSX.Element} The checkbox element.
   */
  const renderCheckbox = (
    label: string,
    field: keyof (Plant & CreatePlantData)
  ) => (
    <div className="kl-col">
      <label>{label}</label>
      <input
        type="checkbox"
        disabled={!editMode}
        checked={Boolean(getFieldValue(formData, field))}
        onChange={(e) => handleChange(field, e.target.checked)}
      />
    </div>
  );

  /**
   * Renders a multi-select dropdown for selecting multiple string values.
   *
   * @param {string} label The label displayed for this field.
   * @param {keyof (Plant & CreatePlantData)} field The field key being updated.
   * @param {string[]} options List of selectable options.
   * @param {boolean} [required=false] Whether the field is mandatory and should show a required indicator.
   * @returns {JSX.Element} The rendered multi-select component.
   */
  const renderMultiSelect = (
    label: string,
    field: keyof (Plant & CreatePlantData),
    options: string[],
    required: boolean = false
  ) => {
    const fieldError = errors[field as keyof ValidationErrors];
    const showError = touched[field] && fieldError;

    return (
      <div className="kl-col">
        <label>
          {label}
          {required && <span style={{ color: "#e74c3c" }}> *</span>}
        </label>
        {editMode ? (
          <>
            <Select
              isMulti
              value={toOptions(
                (getFieldValue(formData, field) as string[]) ?? []
              )}
              options={toOptions(options)}
              onChange={(selected) => handleMultiSelectChange(field, selected)}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, [field]: true }));

                const rawValue = getFieldValue(formData, field);

                let safeValue: string | string[] | undefined = undefined;

                if (Array.isArray(rawValue)) {
                  safeValue = rawValue as string[];
                } else if (typeof rawValue === "string") {
                  safeValue = rawValue;
                }

                const error = validateField(
                  field as keyof ValidationErrors,
                  safeValue
                );

                setErrors((prev) => ({
                  ...prev,
                  [field]: error,
                }));
              }}
              styles={{
                ...customSelectStyles,
                /**
                 * Customizes the react-select control styling based on error state.
                 *
                 * @param base The default react-select control styles.
                 * @param state The current state of the select component (focused, disabled, etc.).
                 * @returns The merged and customized style object for the select control.
                 */
                control: (base, state) => ({
                  ...customSelectStyles.control?.(base, state),
                  borderColor: showError ? "#e74c3c" : base.borderColor,
                  backgroundColor: showError ? "#ffebee" : base.backgroundColor,
                }),
              }}
              placeholder={`Select ${label.toLowerCase()}...`}
            />
            {showError && (
              <span className="kl-error-message">{fieldError}</span>
            )}
          </>
        ) : (
          <input
            type="text"
            disabled
            value={((getFieldValue(formData, field) as string[]) ?? []).join(
              ", "
            )}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div className="kl-modal-overlay" onClick={onClose}>
        <div className="kl-modal" onClick={(e) => e.stopPropagation()}>
          {/* Action Buttons */}
          <div className="kl-modal-actions">
            {initialMode === "edit" && !editMode && (
              <>
                <button
                  className="kl-btn kl-edit"
                  onClick={() => setEditMode(true)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
                <button
                  className="kl-btn kl-delete"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 6h18M19 6l-1 14H6L5 6m5-2h4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </>
            )}
            <button className="kl-btn kl-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>

          {/* Image Section */}
          <div className="kl-image-wrapper">
            {formData.image_search_url ? (
              <>
                <img
                  src={formData.image_search_url}
                  className={`kl-modal-img ${
                    imgFade ? "kl-img-fade" : "kl-img-show"
                  }`}
                  alt=""
                />
                {editMode && (
                  <button
                    className="kl-remove-img"
                    onClick={() => handleChange("image_search_url", "")}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24">
                      <path
                        d="M5 12h14"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>{" "}
                    Remove
                  </button>
                )}
              </>
            ) : (
              editMode && (
                <>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Validate file size (max 10MB)
                        if (file.size > 10 * 1024 * 1024) {
                          showError("Image must be less than 10MB");
                          return;
                        }

                        // Validate file type
                        if (!file.type.startsWith("image/")) {
                          showError("Please upload a valid image file");
                          return;
                        }
                        const base64 = await fileToBase64(file);
                        handleChange("image_search_url", base64);
                      }
                    }}
                  />
                  <button
                    className="kl-add-img"
                    onClick={() =>
                      document.getElementById("imageUpload")?.click()
                    }
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24">
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>{" "}
                    Add Image
                  </button>
                </>
              )
            )}
            {touched.image_search_url && errors.image_search_url && (
              <span className="kl-error-message">
                {errors.image_search_url}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="kl-modal-content">
            {!editMode && initialMode === "edit" && (
              <>
                <h2>{formData.common_name}</h2>
                <p className="kl-modal-scientific">
                  {formData.scientific_name}
                </p>
              </>
            )}

            {(editMode || initialMode === "create") && (
              <h2>
                {initialMode === "create" ? "Add New Plant" : "Edit Plant"}
              </h2>
            )}

            <div className="kl-input-group">
              <div className="kl-row">
                {renderField("Common Name", "common_name", "input", true)}
                {renderField(
                  "Scientific Name",
                  "scientific_name",
                  "input",
                  true
                )}
              </div>

              {renderField("Description", "description", "textarea", true)}

              <div className="kl-row">
                {renderCheckbox("Native", "native")}
                {renderField("Light", "light", "input", true)}
              </div>

              <div className="kl-row">
                {renderField("Water Needs", "water_needs", "input", true)}
                {renderField(
                  "Maintenance Level",
                  "maintenance_level",
                  "input",
                  true
                )}
              </div>
            </div>

            {/* Multi-select Fields */}
            <div className="kl-input-group">
              <div className="kl-row">
                {renderMultiSelect(
                  "Space Types",
                  "space_types",
                  groupedOptions.space_types,
                  true
                )}
                {renderMultiSelect(
                  "Area Sizes",
                  "area_sizes",
                  groupedOptions.area_sizes,
                  true
                )}
              </div>

              <div className="kl-row">
                {renderMultiSelect(
                  "Challenges",
                  "challenges",
                  groupedOptions.challenges,
                  true
                )}
                {renderMultiSelect(
                  "Tech Preferences",
                  "tech_preferences",
                  groupedOptions.tech_preferences,
                  true
                )}
              </div>

              <div className="kl-row">
                <div className="kl-col">
                  <label>
                    Care Notes<span style={{ color: "#e74c3c" }}> *</span>
                  </label>
                  <textarea
                    disabled={!editMode}
                    value={(formData.care_notes || []).join(", ")}
                    onChange={(e) => {
                      const notes = e.target.value
                        .split(",")
                        .map((x) => x.trim());
                      handleChange("care_notes", notes);
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, care_notes: true }));
                      const error = validateField(
                        "care_notes",
                        formData.care_notes
                      );
                      setErrors((prev) => ({ ...prev, care_notes: error }));
                    }}
                    className={
                      touched.care_notes && errors.care_notes
                        ? "kl-input-error"
                        : ""
                    }
                  />
                  {touched.care_notes && errors.care_notes && (
                    <span className="kl-error-message">
                      {errors.care_notes}
                    </span>
                  )}
                </div>
                {renderField("Growth Form", "growth_form", "input", true)}
              </div>

              {/* Location Selection */}
              <div className="kl-location-row">
                <div className="kl-col">
                  <label>Country</label>
                  <select disabled={!editMode} value="BR">
                    <option value="BR">Brazil</option>
                  </select>
                </div>

                <div className="kl-col">
                  <label>
                    State<span style={{ color: "#e74c3c" }}> *</span>
                  </label>
                  <select
                    disabled={!editMode || states.length === 0}
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setTouched((prev) => ({ ...prev, locations: true }));
                    }}
                    onBlur={() => handleBlur("locations")}
                    className={
                      touched.locations && errors.locations
                        ? "kl-input-error"
                        : ""
                    }
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s.iso2} value={s.iso2}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="kl-col">
                  <label>
                    City<span style={{ color: "#e74c3c" }}> *</span>
                  </label>
                  <select
                    disabled={!editMode || cities.length === 0}
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      setTouched((prev) => ({ ...prev, locations: true }));
                    }}
                    onBlur={() => handleBlur("locations")}
                    className={
                      touched.locations && errors.locations
                        ? "kl-input-error"
                        : ""
                    }
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {touched.locations && errors.locations && (
                <span className="kl-error-message">{errors.locations}</span>
              )}
            </div>

            {editMode && (
              <div className="kl-edit-actions">
                <button
                  className="kl-save-btn"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="kl-btn-spinner"></div>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  )}

                  {isSaving
                    ? "Saving..."
                    : initialMode === "create"
                    ? "Add Plant"
                    : "Save Changes"}
                </button>

                <button
                  className="kl-cancel-btn"
                  onClick={() => {
                    if (initialMode === "create") {
                      onClose();
                    } else {
                      setFormData(plant!);
                      setEditMode(false);
                      setErrors({});
                      setTouched({});
                      if (plant?.locations?.[0]) {
                        const loc = plant.locations[0];
                        const matchedState = states.find(
                          (s) =>
                            s.name.toLowerCase() ===
                            loc.location_type.toLowerCase()
                        );
                        setSelectedState(matchedState?.iso2 || "");
                        setSelectedCity(loc.location_value || "");
                      }
                    }
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      d="M6 6l12 12M6 18L18 6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>{" "}
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {initialMode === "edit" && (
        <ConfirmModal
          open={deleteModalOpen}
          title="Delete Plant"
          message="Are you sure you want to delete this plant?"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}
    </>
  );
};
