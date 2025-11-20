import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../../services/apiCalls/authentication";
import type { LoginCredentials } from "../../../types/auth";
import type { ApiError } from "../../../types";
import { useAuth } from "../../../hooks/useAuth";
import "../auth.css";
import { APP_ROUTES } from "../../../constants/appRoutes";
import { useToast } from "../../../hooks/useToast";
import logo from "../../../images/logo.png";

/**
 * Login Component
 *
 * This component handles user login functionality.
 * Features:
 * - Email & Password form with controlled inputs
 * - Toggleable password visibility
 * - "Remember Me" checkbox
 * - Toast notifications using Sonner package (positioned at top-right)
 * - Redirects user to admin dashboard upon successful login
 *
 * Note: Only the Toaster import changed - all existing functionality remains the same
 */
export const Login: React.FC = () => {
  //#region  STATE HOOKS
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  }); // Stores the user's email and password input values.
  const [isLoading, setIsLoading] = useState(false); //   Indicates whether login request is currently in progress.Used to show loading spinners / disable submit button.
  const [showPassword, setShowPassword] = useState(false); // Controls whether the password is visible or hidden.
  const [rememberMe, setRememberMe] = useState(false); // Tracks whether the user has selected "Remember Me".

  //#endregion

  //#region  CUSTOM HOOKS
  const { login } = useAuth(); // Custom hook for authentication context
  const navigate = useNavigate(); // Hook for navigation
  const { showSuccess, showError, showWarning, showInfo } = useToast(); // Updated hook using package

  //#endregion

  //#region  METHODS
  /**
   * Handles input field changes and updates formData state.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Toggles password visibility between plain text and masked.
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Updates the "Remember Me" checkbox state.
   */
  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  /**
   * Handles login form submission.
   * - Prevents default form reload
   * - Shows loading state
   * - Calls API to authenticate user
   * - Shows toast notifications for success/error
   * - Redirects to admin page on success
   * - Resets form fields after successful login
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      showWarning("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    showInfo("Attempting to log in...");

    try {
      const response = await authService.login(formData);

      if (!response.success) {
        showError(
          response.message || "Login failed. Please check your credentials."
        );
        return; // Stop execution if login fails
      }
      showSuccess("Login successful! Redirecting to dashboard...");
      navigate(APP_ROUTES.admin.root, { replace: true });
      // Success flow
      login(response.data.token); // Store token in auth context
      // Reset form fields after successful login
      setFormData({
        email: "",
        password: "",
      });
      setRememberMe(false);
    } catch (error: unknown) {
      const err = error as ApiError;
      const errorMessage = err.message || "Login failed. Please try again.";
      showError(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  //#endregion

  return (
    <>
      <section className="bl_section">
        <div className="bf_wrapper">
          <img src={logo} className="k_logo" alt="Logo" />
          <h1 className="bl_head">Welcome!</h1>
          <p className="bl_sub_head">Log In to your account.</p>

          <form onSubmit={handleSubmit}>
            <div className="input_field icon_field">
              <label htmlFor="email">Username *</label>
              <div className="position-relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Username"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  autoComplete="off"
                />
                <svg
                  className="field_icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={21}
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <path
                    d="M10 2.19888C8.42393 2.19888 6.88326 2.66624 5.5728 3.54186C4.26235 4.41748 3.24097 5.66203 2.63784 7.11812C2.0347 8.57422 1.87689 10.1765 2.18437 11.7223C2.49185 13.268 3.2508 14.6879 4.36525 15.8024C5.4797 16.9168 6.89959 17.6758 8.44538 17.9833C9.99116 18.2907 11.5934 18.1329 13.0495 17.5298C14.5056 16.9267 15.7502 15.9053 16.6258 14.5948C17.5014 13.2844 17.9688 11.7437 17.9688 10.1676C17.9663 8.05495 17.1259 6.02951 15.632 4.53562C14.1381 3.04172 12.1127 2.20136 10 2.19888ZM5.58125 15.6364C6.03968 14.8741 6.68752 14.2434 7.46181 13.8055C8.23609 13.3676 9.11048 13.1375 10 13.1375C10.8895 13.1375 11.7639 13.3676 12.5382 13.8055C13.3125 14.2434 13.9603 14.8741 14.4188 15.6364C13.169 16.6498 11.609 17.2028 10 17.2028C8.39104 17.2028 6.83097 16.6498 5.58125 15.6364ZM7.34375 9.54263C7.34375 9.01728 7.49954 8.50372 7.79141 8.0669C8.08328 7.63008 8.49813 7.28962 8.9835 7.08858C9.46887 6.88753 10.003 6.83493 10.5182 6.93742C11.0335 7.03991 11.5068 7.2929 11.8783 7.66438C12.2497 8.03586 12.5027 8.50916 12.6052 9.02442C12.7077 9.53969 12.6551 10.0738 12.4541 10.5591C12.253 11.0445 11.9126 11.4594 11.4757 11.7512C11.0389 12.0431 10.5254 12.1989 10 12.1989C9.29552 12.1989 8.61989 11.919 8.12175 11.4209C7.62361 10.9227 7.34375 10.2471 7.34375 9.54263ZM15.118 14.9833C14.3815 13.8381 13.2806 12.9744 11.993 12.5317C12.635 12.1041 13.1224 11.4812 13.3831 10.7551C13.6438 10.029 13.6639 9.23837 13.4406 8.49999C13.2172 7.7616 12.7621 7.1147 12.1426 6.65493C11.5232 6.19516 10.7722 5.94692 10.0008 5.94692C9.22935 5.94692 8.47839 6.19516 7.85893 6.65493C7.23947 7.1147 6.78441 7.7616 6.56101 8.49999C6.33762 9.23837 6.35776 10.029 6.61845 10.7551C6.87914 11.4812 7.36654 12.1041 8.0086 12.5317C6.72099 12.9744 5.62011 13.8381 4.8836 14.9833C3.94206 13.9841 3.31362 12.7312 3.07582 11.379C2.83802 10.0269 3.00126 8.63474 3.5454 7.3743C4.08954 6.11385 4.99078 5.04028 6.13792 4.28604C7.28505 3.5318 8.6279 3.12989 10.0008 3.12989C11.3737 3.12989 12.7165 3.5318 13.8637 4.28604C15.0108 5.04028 15.912 6.11385 16.4562 7.3743C17.0003 8.63474 17.1636 10.0269 16.9258 11.379C16.688 12.7312 16.0595 13.9841 15.118 14.9833Z"
                    fill="#F4F4F4"
                    fillOpacity="0.5"
                  />
                </svg>
              </div>
            </div>

            <div className="input_field icon_field mb-0">
              <label htmlFor="password">Password *</label>
              <div className="position-relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <svg
                  className="field_icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={21}
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <g clipPath="url(#clip0_694_1776)">
                    <path
                      d="M16.25 6.57388H13.5938V4.54263C13.5938 3.58951 13.2151 2.67543 12.5412 2.00147C11.8672 1.32751 10.9531 0.948883 10 0.948883C9.04688 0.948883 8.13279 1.32751 7.45884 2.00147C6.78488 2.67543 6.40625 3.58951 6.40625 4.54263V6.57388H3.75C3.45992 6.57388 3.18172 6.68912 2.9766 6.89423C2.77148 7.09935 2.65625 7.37755 2.65625 7.66763V16.4176C2.65625 16.7077 2.77148 16.9859 2.9766 17.191C3.18172 17.3961 3.45992 17.5114 3.75 17.5114H16.25C16.5401 17.5114 16.8183 17.3961 17.0234 17.191C17.2285 16.9859 17.3438 16.7077 17.3438 16.4176V7.66763C17.3438 7.37755 17.2285 7.09935 17.0234 6.89423C16.8183 6.68912 16.5401 6.57388 16.25 6.57388ZM7.34375 4.54263C7.34375 3.83815 7.6236 3.16252 8.12175 2.66438C8.61989 2.16624 9.29552 1.88638 10 1.88638C10.7045 1.88638 11.3801 2.16624 11.8783 2.66438C12.3764 3.16252 12.6562 3.83815 12.6562 4.54263V6.57388H7.34375V4.54263ZM16.4062 16.4176C16.4062 16.4591 16.3898 16.4988 16.3605 16.5281C16.3312 16.5574 16.2914 16.5739 16.25 16.5739H3.75C3.70856 16.5739 3.66882 16.5574 3.63951 16.5281C3.61021 16.4988 3.59375 16.4591 3.59375 16.4176V7.66763C3.59375 7.62619 3.61021 7.58645 3.63951 7.55715C3.66882 7.52784 3.70856 7.51138 3.75 7.51138H16.25C16.2914 7.51138 16.3312 7.52784 16.3605 7.55715C16.3898 7.58645 16.4062 7.62619 16.4062 7.66763V16.4176ZM10 9.07388C9.50261 9.07454 9.02275 9.25768 8.65139 9.58857C8.28004 9.91946 8.04299 10.3751 7.9852 10.8691C7.92741 11.3631 8.05289 11.8612 8.33785 12.2689C8.62281 12.6765 9.04744 12.9655 9.53125 13.0809V14.5426C9.53125 14.667 9.58064 14.7862 9.66854 14.8741C9.75645 14.962 9.87568 15.0114 10 15.0114C10.1243 15.0114 10.2435 14.962 10.3315 14.8741C10.4194 14.7862 10.4688 14.667 10.4688 14.5426V13.0809C10.9526 12.9655 11.3772 12.6765 11.6622 12.2689C11.9471 11.8612 12.0726 11.3631 12.0148 10.8691C11.957 10.3751 11.72 9.91946 11.3486 9.58857C10.9772 9.25768 10.4974 9.07454 10 9.07388ZM10 12.1989C9.78368 12.1989 9.57221 12.1347 9.39234 12.0146C9.21248 11.8944 9.07229 11.7235 8.98951 11.5237C8.90672 11.3238 8.88506 11.1039 8.92727 10.8918C8.96947 10.6796 9.07364 10.4847 9.2266 10.3317C9.37957 10.1788 9.57445 10.0746 9.78662 10.0324C9.99879 9.9902 10.2187 10.0119 10.4186 10.0946C10.6184 10.1774 10.7892 10.3176 10.9094 10.4975C11.0296 10.6773 11.0938 10.8888 11.0938 11.1051C11.0938 11.3952 10.9785 11.6734 10.7734 11.8785C10.5683 12.0836 10.2901 12.1989 10 12.1989Z"
                      fill="#F4F4F4"
                      fillOpacity="0.5"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_694_1776">
                      <rect
                        width={20}
                        height={20}
                        fill="white"
                        transform="translate(0 0.167633)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <span
                  onClick={togglePasswordVisibility}
                  className="password-toggle-btn"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      className="field_icon hide_show_icon"
                      width="18"
                      height="16"
                      viewBox="0 0 18 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.5"
                        d="M3.444 1.1641C3.3913 1.10471 3.32735 1.05636 3.25584 1.02187C3.18432 0.987371 3.10667 0.967412 3.02739 0.963147C2.94811 0.958881 2.86876 0.970394 2.79396 0.997019C2.71916 1.02364 2.65039 1.06485 2.59163 1.11825C2.53287 1.17165 2.48529 1.23618 2.45166 1.3081C2.41802 1.38002 2.39899 1.4579 2.39568 1.53723C2.39236 1.61656 2.40483 1.69576 2.43235 1.77024C2.45987 1.84472 2.50189 1.91299 2.55599 1.9711L3.999 3.55886C1.27499 5.23061 0.103493 7.80761 0.0517429 7.92461C0.0176277 8.00134 0 8.08438 0 8.16836C0 8.25233 0.0176277 8.33538 0.0517429 8.41211C0.0779929 8.47136 0.713243 9.87986 2.12549 11.2921C4.00725 13.1731 6.384 14.1676 9 14.1676C10.3445 14.1753 11.6753 13.8985 12.9053 13.3554L14.5553 15.1711C14.6079 15.2305 14.6719 15.2789 14.7434 15.3134C14.8149 15.3478 14.8926 15.3678 14.9719 15.3721C15.0511 15.3763 15.1305 15.3648 15.2053 15.3382C15.2801 15.3116 15.3489 15.2704 15.4076 15.217C15.4664 15.1636 15.514 15.099 15.5476 15.0271C15.5812 14.9552 15.6003 14.8773 15.6036 14.798C15.6069 14.7187 15.5944 14.6395 15.5669 14.565C15.5394 14.4905 15.4974 14.4222 15.4433 14.3641L3.444 1.1641ZM6.99375 6.85211L10.119 10.2909C9.64837 10.5385 9.10884 10.6227 8.58512 10.5304C8.06141 10.4382 7.58317 10.1746 7.22551 9.78102C6.86785 9.38748 6.65102 8.8863 6.60908 8.35617C6.56713 7.82605 6.70243 7.297 6.99375 6.85211ZM9 12.9676C6.6915 12.9676 4.67475 12.1284 3.00525 10.4739C2.31998 9.79285 1.73716 9.016 1.27499 8.16761C1.62674 7.50836 2.74949 5.66336 4.82625 4.46411L6.17625 5.94536C5.6536 6.61474 5.38442 7.44733 5.4163 8.29599C5.44817 9.14464 5.77904 9.9547 6.35042 10.583C6.92181 11.2113 7.69692 11.6173 8.53874 11.7294C9.38057 11.8415 10.2349 11.6523 10.9508 11.1954L12.0555 12.4104C11.0805 12.7844 10.0443 12.9734 9 12.9676ZM9.45 5.81036C9.29365 5.78052 9.15557 5.6898 9.06611 5.55815C8.97666 5.4265 8.94316 5.2647 8.973 5.10836C9.00284 4.95201 9.09356 4.81392 9.22521 4.72447C9.35686 4.63501 9.51866 4.60152 9.675 4.63136C10.4397 4.77961 11.136 5.17109 11.66 5.74742C12.184 6.32375 12.5077 7.05404 12.5828 7.82936C12.5976 7.98779 12.5488 8.14562 12.4473 8.26813C12.3457 8.39064 12.1997 8.46779 12.0413 8.48261C12.0225 8.48371 12.0037 8.48371 11.985 8.48261C11.835 8.48325 11.6903 8.42771 11.5792 8.32693C11.4682 8.22615 11.3989 8.08743 11.385 7.93811C11.3345 7.4224 11.1189 6.93677 10.7703 6.55342C10.4216 6.17006 9.95861 5.90946 9.45 5.81036ZM17.946 8.41211C17.9145 8.48261 17.1548 10.1649 15.444 11.6971C15.3855 11.7511 15.3169 11.793 15.2421 11.8202C15.1674 11.8475 15.0879 11.8596 15.0084 11.8558C14.9289 11.852 14.8509 11.8325 14.779 11.7983C14.7072 11.7641 14.6428 11.716 14.5897 11.6566C14.5366 11.5973 14.4959 11.5281 14.4698 11.4529C14.4438 11.3776 14.4329 11.298 14.438 11.2186C14.443 11.1391 14.4638 11.0615 14.4991 10.9902C14.5344 10.9188 14.5836 10.8552 14.6438 10.8031C15.483 10.0491 16.1881 9.15789 16.7288 8.16761C16.2656 7.31844 15.6815 6.54107 14.9948 5.85986C13.3253 4.20686 11.3085 3.36761 9 3.36761C8.51359 3.36701 8.02796 3.40639 7.548 3.48536C7.46995 3.49916 7.38994 3.49736 7.31259 3.48006C7.23523 3.46277 7.16208 3.43032 7.09734 3.38459C7.0326 3.33886 6.97756 3.28075 6.93541 3.21363C6.89325 3.14651 6.86481 3.0717 6.85174 2.99353C6.83866 2.91535 6.8412 2.83536 6.85921 2.75817C6.87722 2.68099 6.91035 2.60813 6.95668 2.54382C7.00301 2.47951 7.06162 2.42501 7.12913 2.38348C7.19664 2.34195 7.27171 2.31421 7.35 2.30186C7.89537 2.21181 8.44724 2.1669 9 2.1676C11.616 2.1676 13.9928 3.16211 15.8745 5.04386C17.2868 6.45611 17.922 7.86536 17.9483 7.92461C17.9824 8.00134 18 8.08438 18 8.16836C18 8.25233 17.9824 8.33538 17.9483 8.41211H17.946Z"
                        fill="#F4F4F4"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="field_icon hide_show_icon"
                      width="18"
                      height="13"
                      viewBox="0 0 18 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.5"
                        d="M17.9483 5.92461C17.922 5.86536 17.2868 4.45611 15.8745 3.04385C13.9928 1.1621 11.616 0.167603 9 0.167603C6.384 0.167603 4.00725 1.1621 2.12549 3.04385C0.713243 4.45611 0.0749929 5.86761 0.0517429 5.92461C0.0176277 6.00134 0 6.08438 0 6.16836C0 6.25233 0.0176277 6.33537 0.0517429 6.41211C0.0779929 6.47136 0.713243 7.87986 2.12549 9.29211C4.00725 11.1731 6.384 12.1676 9 12.1676C11.616 12.1676 13.9928 11.1731 15.8745 9.29211C17.2868 7.87986 17.922 6.47136 17.9483 6.41211C17.9824 6.33537 18 6.25233 18 6.16836C18 6.08438 17.9824 6.00134 17.9483 5.92461ZM9 10.9676C6.6915 10.9676 4.67475 10.1284 3.00525 8.47386C2.32023 7.79263 1.73743 7.01582 1.27499 6.16761C1.73731 5.31931 2.32012 4.54249 3.00525 3.86136C4.67475 2.20685 6.6915 1.3676 9 1.3676C11.3085 1.3676 13.3253 2.20685 14.9948 3.86136C15.6811 4.54232 16.2652 5.31914 16.7288 6.16761C16.188 7.17711 13.8323 10.9676 9 10.9676ZM9 2.5676C8.28799 2.5676 7.59196 2.77874 6.99995 3.17431C6.40793 3.56989 5.94651 4.13213 5.67403 4.78995C5.40155 5.44776 5.33026 6.1716 5.46917 6.86993C5.60808 7.56826 5.95094 8.20972 6.45441 8.71319C6.95788 9.21666 7.59934 9.55953 8.29767 9.69844C8.99601 9.83734 9.71985 9.76605 10.3777 9.49358C11.0355 9.2211 11.5977 8.75968 11.9933 8.16766C12.3889 7.57564 12.6 6.87962 12.6 6.16761C12.599 5.21313 12.2194 4.29803 11.5445 3.62312C10.8696 2.9482 9.95448 2.5686 9 2.5676ZM9 8.56761C8.52532 8.56761 8.06131 8.42685 7.66663 8.16314C7.27195 7.89942 6.96434 7.52459 6.78269 7.08605C6.60104 6.6475 6.55351 6.16494 6.64611 5.69939C6.73872 5.23384 6.9673 4.8062 7.30294 4.47055C7.63859 4.1349 8.06623 3.90632 8.53178 3.81372C8.99734 3.72112 9.4799 3.76864 9.91844 3.95029C10.357 4.13194 10.7318 4.43956 10.9955 4.83424C11.2592 5.22892 11.4 5.69293 11.4 6.16761C11.4 6.80413 11.1471 7.41458 10.6971 7.86466C10.247 8.31475 9.63652 8.56761 9 8.56761Z"
                        fill="#F4F4F4"
                      />
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <div className="row justify-content-between">
              <div className="col-md-auto">
                <div className="cus_form_check">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember Me
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-md-auto">
                <Link
                  to={APP_ROUTES.auth.forgotPassword}
                  className="login-link"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="btn common_button"
              disabled={isLoading || !formData.email || !formData.password}
              style={{
                opacity:
                  isLoading || !formData.email || !formData.password ? 0.6 : 1,
                cursor:
                  isLoading || !formData.email || !formData.password
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};
