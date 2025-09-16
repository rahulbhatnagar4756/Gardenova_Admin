import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../../services/apiCalls/authentication";
import type { LoginCredentials } from "../../../types/auth";
import type { ApiError } from "../../../types";
import { useAuth } from "../../../hooks/useAuth";
import "./login.css";
import { APP_ROUTES } from "../../../constants/appRoutes";

export const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="login-container plant-theme">
      <div className="login-card">
        <div className="login-illustration">
          <img src="/images/plant-illustration.svg" alt="Plant Illustration" />
        </div>

        <h2 className="login-title">Welcome Back!</h2>
        <p className="login-subtitle">Nurture your growth with us 🌱</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {errors && <div className="login-error">{errors}</div>}

          <div className="login-input-group">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="login-input"
            />
            <div className="password-input-container">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="login-input password-input"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle-btn"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="login-options">
            <Link to={APP_ROUTES.auth.forgotPassword} className="login-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          <div className="login-footer"></div>
        </form>
      </div>
    </div>
  );
};
