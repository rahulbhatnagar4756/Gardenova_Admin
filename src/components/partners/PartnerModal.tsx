// components/PartnerModal.tsx
import { useEffect, useReducer, useState } from "react";
import Select, { type SingleValue, type StylesConfig } from "react-select";
import { ImageUpload } from "./ImageUpload";
import { useToast } from "../../hooks/useToast";
import { stateCityDataService } from "../../services/apiCalls/stateCity";
import type {
  DropdownOption,
  FormAction,
  FormState,
  LocationAction,
  LocationState,
  PartnerModalProps,
  PartnerProfileRequest,
  ValidationErrors,
} from "../../types/partnerProfile";

const initialFormState: FormState = {
  companyName: "",
  email: "",
  speciality: [],
  address: {
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  },
  website: "",
  contactPerson: "",
  mobileNumber: "",
  projectImageUrl: "",
  status: "active",
  specialityText: "",
};

/**
 * Reducer for partner form state.
 *
 * @param {FormState} state Current form state.
 * @param {FormAction} action Action describing the change.
 * @returns {FormState} New form state after applying the action.
 */
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ADDRESS_FIELD":
      return {
        ...state,
        address: { ...state.address, [action.field]: action.value },
      };
    case "SET_SPECIALITY":
      return {
        ...state,
        specialityText: action.text,
        speciality: action.array,
      };
    case "LOAD_PARTNER":
      return {
        companyName: action.partner.companyName || "",
        email: action.partner.email || "",
        speciality: action.partner.speciality || [],
        address: {
          street: action.partner.address?.street || "",
          city: action.partner.address?.city || "",
          state: action.partner.address?.state || "",
          country: action.partner.address?.country || "",
          zipCode: action.partner.address?.zipCode || "",
        },
        website: action.partner.website || "",
        contactPerson: action.partner.contactPerson || "",
        mobileNumber: action.partner.mobileNumber || "",
        projectImageUrl: action.partner.projectImageUrl || "",
        status: action.partner.status || "active",
        specialityText: "",
      };
    case "RESET":
      return initialFormState;
    default:
      return state;
  }
}

const initialLocationState: LocationState = {
  states: [],
  cities: [],
  loadingStates: false,
  loadingCities: false,
};

/**
 * Reducer that manages location (states/cities) related UI state and lists.
 *
 * @param {LocationState} state Current location state.
 * @param {LocationAction} action Action describing the change.
 * @returns {LocationState} Updated location state.
 */
function locationReducer(
  state: LocationState,
  action: LocationAction
): LocationState {
  switch (action.type) {
    case "SET_STATES":
      return { ...state, states: action.states };
    case "SET_CITIES":
      return { ...state, cities: action.cities };
    case "SET_LOADING_STATES":
      return { ...state, loadingStates: action.loading };
    case "SET_LOADING_CITIES":
      return { ...state, loadingCities: action.loading };
    case "RESET_LOCATION":
      return initialLocationState;
    default:
      return state;
  }
}

const selectStyles: StylesConfig<DropdownOption, false> = {
  /**
   * Style override for the react-select control wrapper.
   *
   * @param {any} base Base styles passed by react-select.
   * @returns {any} Merged style object for the control.
   */
  control: (base) => ({
    ...base,
    borderRadius: "8px",
    padding: "2px",
    boxShadow: "none",
    borderColor: "#ccc",
    "&:hover": { borderColor: "#888" },
  }),
  /**
   * Style override for the react-select menu.
   *
   * @param {any} base Base styles for the menu.
   * @returns {any} Merged style object for the menu.
   */
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};

/**
 * Validates an email address string.
 *
 * @param {string} email Candidate email.
 * @returns {string|undefined} An error message or undefined if valid.
 */
const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return undefined;
};

/**
 * Validates a mobile phone number (basic 10–15 digit international check).
 *
 * @param {string} mobile Candidate mobile string.
 * @returns {string|undefined} Error message or undefined if valid.
 */
const validateMobileNumber = (mobile: string): string | undefined => {
  if (!mobile.trim()) {
    return "Mobile number is required";
  }

  // Remove spaces, dashes, parentheses
  const cleanNumber = mobile.replace(/[\s\-()]/g, "");
  if (!/^\+?\d{10,15}$/.test(cleanNumber)) {
    return "Please enter a valid mobile number (10–15 digits)";
  }

  return undefined;
};

/**
 * Validates a website URL.
 *
 * @param {string} website Candidate website URL.
 * @returns {string|undefined} Error message or undefined if valid.
 */
const validateWebsite = (website: string): string | undefined => {
  if (!website.trim()) {
    return "Website Url is required";
  }
  if (website.trim()) {
    const urlRegex =
      /^(https?:\/\/)?(www\.)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/i;

    if (!urlRegex.test(website)) {
      return "Please enter a valid website URL";
    }
  }
  return undefined;
};

/**
 * Validates a ZIP/postal code (Brazilian format expected).
 *
 * @param {string} zipCode ZIP code string.
 * @returns {string|undefined} Error message or undefined if valid.
 */
const validateZipCode = (zipCode: string): string | undefined => {
  if (!zipCode.trim()) {
    return "ZIP code is required";
  }
  // Brazilian ZIP code format: 12345-678 or 12345678
  const brazilZipRegex = /^\d{5}-?\d{3}$/;
  if (!brazilZipRegex.test(zipCode)) {
    return "Please enter a valid ZIP code (format: 12345-678)";
  }
  return undefined;
};

/**
 * Validates the complete partner form state and returns a map of field errors.
 *
 * @param {FormState} formData Current form data to validate.
 * @returns {ValidationErrors} Object mapping field names to error messages.
 */
const validateForm = (formData: FormState): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Required fields
  if (!formData.companyName.trim()) {
    errors.companyName = "Company name is required";
  }

  if (!formData.contactPerson.trim()) {
    errors.contactPerson = "Contact person is required";
  }

  if (formData.speciality.length === 0) {
    errors.speciality = "At least one specialty is required";
  }

  if (!formData.address.street.trim()) {
    errors.street = "Street address is required";
  }

  if (!formData.address.country.trim()) {
    errors.country = "Country is required";
  }

  if (!formData.address.state.trim()) {
    errors.state = "State is required";
  }

  if (!formData.address.city.trim()) {
    errors.city = "City is required";
  }

  // Format validations
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const mobileError = validateMobileNumber(formData.mobileNumber);
  if (mobileError) errors.mobileNumber = mobileError;

  const websiteError = validateWebsite(formData.website);
  if (websiteError) errors.website = websiteError;

  const zipError = validateZipCode(formData.address.zipCode);
  if (zipError) errors.zipCode = zipError;

  return errors;
};

/**
 * Partner creation/edit modal component.
 *
 * @param {PartnerModalProps} root0 Component props.
 * @param {boolean} root0.isOpen Whether the modal is open.
 * @param {any | null} root0.editingPartner Partner being edited (or null when creating).
 * @param {(partner: PartnerProfileRequest) => Promise<void>} root0.onSave Save callback invoked with validated data.
 * @param {() => void} root0.onClose Close callback.
 * @returns {JSX.Element | null} The Partner modal UI or null when not visible.
 */
export const PartnerModal = ({
  isOpen,
  editingPartner,
  onClose,
  onSave,
}: PartnerModalProps) => {
  const [formData, dispatchForm] = useReducer(formReducer, initialFormState);
  const [locationData, dispatchLocation] = useReducer(
    locationReducer,
    initialLocationState
  );
  const [loadingButton, setLoadingButton] = useReducer(
    (state: boolean) => !state,
    false
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const { showInfo, showError } = useToast();

  // Load partner data when editing
  useEffect(() => {
    if (editingPartner) {
      dispatchForm({ type: "LOAD_PARTNER", partner: editingPartner });
      setErrors({});
      setTouched(new Set());
    } else {
      dispatchForm({ type: "RESET" });
      setErrors({});
      setTouched(new Set());
    }
  }, [editingPartner]);

  // Load states when country changes
  useEffect(() => {
    if (formData.address.country === "Brazil") {
      dispatchLocation({ type: "SET_LOADING_STATES", loading: true });
      stateCityDataService
        .getStatesByCountry()
        .then((res) => {
          dispatchLocation({ type: "SET_STATES", states: res.data.states });
        })
        .catch(console.error)
        .finally(() => {
          dispatchLocation({ type: "SET_LOADING_STATES", loading: false });
        });
    } else {
      dispatchLocation({ type: "RESET_LOCATION" });
    }
  }, [formData.address.country]);

  // Load cities when state changes
  useEffect(() => {
    if (formData.address.country === "Brazil" && formData.address.state) {
      dispatchLocation({ type: "SET_LOADING_CITIES", loading: true });
      stateCityDataService
        .getCitiesByState("BR", formData.address.state)
        .then((res) => {
          dispatchLocation({ type: "SET_CITIES", cities: res.data.cities });
        })
        .catch(console.error)
        .finally(() => {
          dispatchLocation({ type: "SET_LOADING_CITIES", loading: false });
        });
    } else {
      dispatchLocation({ type: "SET_CITIES", cities: [] });
    }
  }, [formData.address.state, formData.address.country]);

  /**
   * Marks a specific form field as "touched" so validation errors
   * can be displayed only after the user interacts with the field.
   *
   * @param {string} fieldName The name of the field that lost focus.
   * @returns {void}
   */
  const handleBlur = (fieldName: string) => {
    setTouched((prev) => {
      const newTouched = new Set(prev);
      newTouched.add(fieldName);
      return newTouched;
    });
  };

  // Validate on form data changes for touched fields
  useEffect(() => {
    if (touched.size > 0) {
      const validationErrors = validateForm(formData);
      setErrors(validationErrors);
    }
  }, [formData, touched]);

  /**
   * Validates all partner form fields and attempts to submit the form.
   * Highlights errors, marks all fields as touched, and shows an error toast
   * if validation fails.
   *
   * @returns {Promise<void>} Resolves once submission or validation handling completes.
   */
  const handleSubmit = async () => {
    // Validate all fields
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    // Mark all fields as touched
    setTouched(
      new Set(Object.keys(formData).concat(Object.keys(formData.address)))
    );

    // If there are errors, show error message and return
    if (Object.keys(validationErrors).length > 0) {
      showError("Please fix all validation errors before submitting");
      return;
    }

    try {
      setLoadingButton();
      showInfo(
        editingPartner
          ? "Updating partner details..."
          : "Saving partner details..."
      );

      const isBase64Image = formData.projectImageUrl?.startsWith("data:image");
      const selectedState = locationData.states.find(
        (s) => s.iso2 === formData.address.state
      );
      const requestData: PartnerProfileRequest = {
        companyName: formData.companyName,
        email: formData.email,
        speciality: formData.speciality,
        address: {
          ...formData.address,
          state: selectedState ? selectedState.name : formData.address.state,
        },
        website: formData.website,
        contactPerson: formData.contactPerson,
        mobileNumber: formData.mobileNumber,
        projectImageUrl: isBase64Image
          ? formData.projectImageUrl
          : formData.projectImageUrl || "",
        status: formData.status as "active" | "inactive",
      };

      await onSave(requestData);
    } catch {
      showError("Failed to save partner");
    } finally {
      setLoadingButton();
    }
  };

  /**
   * Handles country dropdown selection. Updates the country field,
   * resets state and city fields, and marks the country field as touched.
   *
   * @param {SingleValue<DropdownOption>} selectedOption Selected country option from the dropdown.
   * @returns {void}
   */
  const handleCountryChange = (selectedOption: SingleValue<DropdownOption>) => {
    const value = selectedOption ? selectedOption.value : "";
    dispatchForm({
      type: "SET_ADDRESS_FIELD",
      field: "country",
      value,
    });
    dispatchForm({ type: "SET_ADDRESS_FIELD", field: "state", value: "" });
    dispatchForm({ type: "SET_ADDRESS_FIELD", field: "city", value: "" });
    handleBlur("country");
  };

  /**
   * Handles state dropdown selection. Updates the state field,
   * resets the city list, and marks the state field as touched.
   *
   * @param {SingleValue<DropdownOption>} selectedOption Selected state option from the dropdown.
   * @returns {void}
   */
  const handleStateChange = (selectedOption: SingleValue<DropdownOption>) => {
    const value = selectedOption ? selectedOption.value : "";
    dispatchForm({
      type: "SET_ADDRESS_FIELD",
      field: "state",
      value,
    });
    dispatchForm({ type: "SET_ADDRESS_FIELD", field: "city", value: "" });
    handleBlur("state");
  };

  /**
   * Handles city dropdown selection. Updates the city field
   * and marks the city field as touched.
   *
   * @param {SingleValue<DropdownOption>} selectedOption Selected city option from the dropdown.
   * @returns {void}
   */
  const handleCityChange = (selectedOption: SingleValue<DropdownOption>) => {
    const value = selectedOption ? selectedOption.value : "";
    dispatchForm({
      type: "SET_ADDRESS_FIELD",
      field: "city",
      value,
    });
    handleBlur("city");
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show modal_view_form"
      style={{ display: "block", backgroundColor: "rgba(46, 58, 48, 0.4)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <button
            type="button"
            className="btn-close close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>

          <div className="modal-body">
            <div className="head_area">
              <h4 className="head_modal">
                {editingPartner ? "Edit Professional" : "Add New Professional"}
              </h4>
              <p className="sub_head">Enter the details and save</p>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="input_field ">
                  <label htmlFor="companyName">
                    Company Name <span className="text-danger">*</span>
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    placeholder="Enter Company Name"
                    className={`form-control ${
                      touched.has("companyName") && errors.companyName
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formData.companyName}
                    onChange={(e) =>
                      dispatchForm({
                        type: "SET_FIELD",
                        field: "companyName",
                        value: e.target.value,
                      })
                    }
                    onBlur={() => handleBlur("companyName")}
                    autoComplete="off"
                  />
                  {touched.has("companyName") && errors.companyName && (
                    <div className="invalid-feedback d-block">
                      {errors.companyName}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="input_field ">
                  <label htmlFor="email">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    className={`form-control ${
                      touched.has("email") && errors.email ? "is-invalid" : ""
                    }`}
                    value={formData.email}
                    onChange={(e) =>
                      dispatchForm({
                        type: "SET_FIELD",
                        field: "email",
                        value: e.target.value,
                      })
                    }
                    onBlur={() => handleBlur("email")}
                    autoComplete="off"
                  />
                  {touched.has("email") && errors.email && (
                    <div className="invalid-feedback d-block">
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="input_field ">
                  <label htmlFor="contactPerson">
                    Contact Person <span className="text-danger">*</span>
                  </label>
                  <input
                    id="contactPerson"
                    name="contactPerson"
                    type="text"
                    placeholder="Enter Contact Person"
                    className={`form-control ${
                      touched.has("contactPerson") && errors.contactPerson
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formData.contactPerson}
                    onChange={(e) =>
                      dispatchForm({
                        type: "SET_FIELD",
                        field: "contactPerson",
                        value: e.target.value,
                      })
                    }
                    onBlur={() => handleBlur("contactPerson")}
                    autoComplete="off"
                  />
                  {touched.has("contactPerson") && errors.contactPerson && (
                    <div className="invalid-feedback d-block">
                      {errors.contactPerson}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="input_field ">
                  <label htmlFor="mobileNumber">
                    Mobile Number <span className="text-danger">*</span>
                  </label>
                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    placeholder="Enter Mobile Number"
                    className={`form-control ${
                      touched.has("mobileNumber") && errors.mobileNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formData.mobileNumber}
                    onChange={(e) =>
                      dispatchForm({
                        type: "SET_FIELD",
                        field: "mobileNumber",
                        value: e.target.value,
                      })
                    }
                    onBlur={() => handleBlur("mobileNumber")}
                    autoComplete="off"
                  />
                  {touched.has("mobileNumber") && errors.mobileNumber && (
                    <div className="invalid-feedback d-block">
                      {errors.mobileNumber}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="input_field ">
                  <label htmlFor="speciality">
                    Specialty <span className="text-danger">*</span>
                  </label>
                  <input
                    id="speciality"
                    name="speciality"
                    type="text"
                    placeholder="Enter specialties (comma separated)"
                    className={`form-control ${
                      touched.has("speciality") && errors.speciality
                        ? "is-invalid"
                        : ""
                    }`}
                    value={
                      formData.specialityText || formData.speciality.join(", ")
                    }
                    onChange={(e) => {
                      const text = e.target.value;
                      dispatchForm({
                        type: "SET_SPECIALITY",
                        text,
                        array: text
                          .split(",")
                          .map((s) => s.trim())
                          .filter((s) => s),
                      });
                    }}
                    onBlur={() => handleBlur("speciality")}
                    autoComplete="off"
                  />
                  {touched.has("speciality") && errors.speciality && (
                    <div className="invalid-feedback d-block">
                      {errors.speciality}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="input_field ">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="Enter Website URL"
                    className={`form-control ${
                      touched.has("website") && errors.website
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formData.website}
                    onChange={(e) =>
                      dispatchForm({
                        type: "SET_FIELD",
                        field: "website",
                        value: e.target.value,
                      })
                    }
                    onBlur={() => handleBlur("website")}
                    autoComplete="off"
                  />
                  {touched.has("website") && errors.website && (
                    <div className="invalid-feedback d-block">
                      {errors.website}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="input_field ">
                  <label htmlFor="street">
                    Street Address <span className="text-danger">*</span>
                  </label>
                  <input
                    id="street"
                    name="street"
                    type="text"
                    placeholder="Enter Street Address"
                    className={`form-control ${
                      touched.has("street") && errors.street ? "is-invalid" : ""
                    }`}
                    value={formData.address.street}
                    onChange={(e) =>
                      dispatchForm({
                        type: "SET_ADDRESS_FIELD",
                        field: "street",
                        value: e.target.value,
                      })
                    }
                    onBlur={() => handleBlur("street")}
                    autoComplete="off"
                  />
                  {touched.has("street") && errors.street && (
                    <div className="invalid-feedback d-block">
                      {errors.street}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="input_field">
                  <label htmlFor="zipCode">
                    Zip Code <span className="text-danger">*</span>
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    placeholder="Enter Zip Code"
                    className={`form-control ${
                      touched.has("zipCode") && errors.zipCode
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formData.address.zipCode}
                    onChange={(e) =>
                      dispatchForm({
                        type: "SET_ADDRESS_FIELD",
                        field: "zipCode",
                        value: e.target.value,
                      })
                    }
                    onBlur={() => handleBlur("zipCode")}
                    autoComplete="off"
                  />
                  {touched.has("zipCode") && errors.zipCode && (
                    <div className="invalid-feedback d-block">
                      {errors.zipCode}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="input_field custom_select">
                  <label htmlFor="country">
                    Country <span className="text-danger">*</span>
                  </label>
                  <Select<DropdownOption, false>
                    id="country"
                    name="country"
                    placeholder="Select Country"
                    value={
                      formData.address.country
                        ? {
                            value: formData.address.country,
                            label: formData.address.country,
                          }
                        : null
                    }
                    options={[{ value: "Brazil", label: "Brazil" }]}
                    onChange={handleCountryChange}
                    classNamePrefix="beautiful-select"
                    styles={selectStyles}
                  />
                  {touched.has("country") && errors.country && (
                    <div className="text-danger small mt-1">
                      {errors.country}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="input_field custom_select">
                  <label htmlFor="state">
                    State <span className="text-danger">*</span>
                  </label>
                  <Select<DropdownOption, false>
                    id="state"
                    name="state"
                    isDisabled={
                      !formData.address.country || locationData.loadingStates
                    }
                    isLoading={locationData.loadingStates}
                    placeholder={
                      locationData.loadingStates ? "Fetching" : "Select State"
                    }
                    value={
                      formData.address.state
                        ? {
                            value: formData.address.state,
                            label:
                              locationData.states.find(
                                (s) => s.iso2 === formData.address.state
                              )?.name || formData.address.state,
                          }
                        : null
                    }
                    options={locationData.states.map((state) => ({
                      value: state.iso2,
                      label: state.name,
                    }))}
                    onChange={handleStateChange}
                    classNamePrefix="beautiful-select"
                    styles={selectStyles}
                  />
                  {touched.has("state") && errors.state && (
                    <div className="text-danger small mt-1">{errors.state}</div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="input_field custom_select">
                  <label htmlFor="city">
                    City <span className="text-danger">*</span>
                  </label>
                  <Select<DropdownOption, false>
                    id="city"
                    name="city"
                    isDisabled={
                      !formData.address.state || locationData.loadingCities
                    }
                    isLoading={locationData.loadingCities}
                    placeholder={
                      locationData.loadingCities ? "Fetching" : "Select City"
                    }
                    value={
                      formData.address.city
                        ? {
                            value: formData.address.city,
                            label: formData.address.city,
                          }
                        : null
                    }
                    options={locationData.cities.map((city) => ({
                      value: city.name,
                      label: city.name,
                    }))}
                    onChange={handleCityChange}
                    classNamePrefix="beautiful-select"
                    styles={selectStyles}
                  />
                  {touched.has("city") && errors.city && (
                    <div className="text-danger small mt-1">{errors.city}</div>
                  )}
                </div>
              </div>

              <div className="col-md-12 image_upload">
                <ImageUpload
                  imageUrl={formData.projectImageUrl}
                  onImageChange={(url) =>
                    dispatchForm({
                      type: "SET_FIELD",
                      field: "projectImageUrl",
                      value: url,
                    })
                  }
                />
              </div>
              <div className="col-md-12">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn common_button mt-3"
                  disabled={loadingButton}
                >
                  {loadingButton ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      {editingPartner
                        ? "Please wait... Updating"
                        : "Please wait... Saving"}
                    </>
                  ) : (
                    <>{editingPartner ? "Update" : "Save"}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
