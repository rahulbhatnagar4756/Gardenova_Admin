import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../../services/apiCalls/authentication";
import type { LoginCredentials } from "../../../types/auth";
import type { ApiError } from "../../../types";
import { useAuth } from "../../../hooks/useAuth";
import "../before-login.css";
import { APP_ROUTES } from "../../../constants/appRoutes";

export const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors) setErrors("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors("");

    try {
      const response = await authService.login(formData);
      if (!response.success) {
        setErrors(response.message);
        return;
      }
      login(response.data.token);
      navigate(APP_ROUTES.admin.root, { replace: true });
      // Reset form fields after successful login
      setFormData({
        email: "",
        password: "",
      });
    } catch (error: unknown) {
      const err = error as ApiError;
      setErrors(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bl_section">
      <div className="bf_wrapper">
        <img src="./src/images/logo.png" className="k_logo" alt="Logo" />
        <h1 className="bl_head">Welcome!</h1>
        <p className="bl_sub_head">Log In to your account.</p>

        <form onSubmit={handleSubmit}>
          {errors && <div className="login-error">{errors}</div>}

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
                autoComplete="email"
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
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="field_icon password-toggle-btn"
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#F4F4F4"
                    strokeWidth="2"
                    strokeOpacity="0.5"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
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
                )}
              </button>
            </div>
          </div>

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

          <button
            type="submit"
            className="btn common_button"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div
          className="login-footer"
          style={{ marginTop: "1rem", textAlign: "center" }}
        >
          <Link to={APP_ROUTES.auth.forgotPassword} className="login-link">
            Forgot Password?
          </Link>
        </div>
      </div>
    </section>
  );
};
