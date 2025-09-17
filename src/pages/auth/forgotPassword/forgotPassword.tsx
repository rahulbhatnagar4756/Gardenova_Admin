// ForgotPassword.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../before-login.css";
import { authService } from "../../../services/apiCalls/authentication";
import type { ApiError } from "../../../types";
import { APP_ROUTES } from "../../../constants/appRoutes";

export const ForgotPasswordStep = {
  EMAIL: "email",
  VERIFY_TOKEN: "verify_token",
  RESET_PASSWORD: "reset_password",
} as const;

export type ForgotPasswordStep =
  (typeof ForgotPasswordStep)[keyof typeof ForgotPasswordStep];

export const ForgotPassword: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>(
    ForgotPasswordStep.EMAIL
  );
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Timer for resend functionality
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (
      currentStep === ForgotPasswordStep.VERIFY_TOKEN &&
      timeLeft === 0
    ) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, currentStep]);

  const clearMessages = () => {
    setErrors("");
    setMessage("");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearMessages();

    try {
      const response = await authService.forgotPassword({ email });
      if (!response.success) {
        setErrors(response.message);
        return;
      }
      setMessage(
        response.message || "6-digit verification code sent to your email."
      );
      setCurrentStep(ForgotPasswordStep.VERIFY_TOKEN);
      setTimeLeft(60); // 1 minute timer
      setCanResend(false);
    } catch (error: unknown) {
      const err = error as ApiError;
      setErrors(
        err.message || "Failed to send verification code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearMessages();

    try {
      // Assuming you have a verifyToken method in authService
      const response = await authService.verifyResetToken({ email, token });
      if (!response.success) {
        setErrors(response.message);
        return;
      }
      setMessage("Token verified successfully. Please set your new password.");
      setCurrentStep(ForgotPasswordStep.RESET_PASSWORD);
    } catch (error: unknown) {
      const err = error as ApiError;
      setErrors(err.message || "Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrors("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrors("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      const response = await authService.resetPassword(
        email,
        token,
        newPassword
      );
      if (!response.success) {
        setErrors(response.message);
        return;
      }
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate(APP_ROUTES.auth.login);
      }, 5000);
    } catch (error: unknown) {
      const err = error as ApiError;
      setErrors(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendToken = async () => {
    setIsLoading(true);
    clearMessages();

    try {
      const response = await authService.forgotPassword({ email });
      if (!response.success) {
        setErrors(response.message);
        return;
      }
      setMessage(
        response.message || "New verification code sent to your email."
      );
      setTimeLeft(60);
      setCanResend(false);
    } catch (error: unknown) {
      const err = error as ApiError;
      setErrors(err.message || "Failed to resend verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setToken(value);
    clearMessages();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderStepIndicator = () => (
    <div className="forgot-steps">
      <div
        className={`forgot-step ${
          currentStep === ForgotPasswordStep.EMAIL
            ? "active"
            : currentStep === ForgotPasswordStep.VERIFY_TOKEN ||
              currentStep === ForgotPasswordStep.RESET_PASSWORD
            ? "completed"
            : ""
        }`}
      >
        <span>1</span>
        <p>Email</p>
      </div>
      <div className="forgot-step-line"></div>
      <div
        className={`forgot-step ${
          currentStep === ForgotPasswordStep.VERIFY_TOKEN
            ? "active"
            : currentStep === ForgotPasswordStep.RESET_PASSWORD
            ? "completed"
            : ""
        }`}
      >
        <span>2</span>
        <p>Verify</p>
      </div>
      <div className="forgot-step-line"></div>
      <div
        className={`forgot-step ${
          currentStep === ForgotPasswordStep.RESET_PASSWORD ? "active" : ""
        }`}
      >
        <span>3</span>
        <p>Reset</p>
      </div>
    </div>
  );

  const renderEmailStep = () => (
    <form className="forgot-form" onSubmit={handleEmailSubmit}>
      <div className="forgot-field">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearMessages();
          }}
        />
      </div>

      <button type="submit" disabled={isLoading} className="forgot-button">
        {isLoading ? "Sending..." : "Send Verification Code"}
      </button>
    </form>
  );

  const renderTokenStep = () => (
    <form className="forgot-form" onSubmit={handleTokenSubmit}>
      <div className="forgot-field">
        <label htmlFor="token">6-Digit Verification Code</label>
        <input
          id="token"
          name="token"
          type="text"
          required
          placeholder="Enter 6-digit code"
          value={token}
          onChange={handleTokenInputChange}
          maxLength={6}
          className="forgot-token-input"
        />
        <div className="forgot-token-display">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={`token-digit ${token[i] ? "filled" : ""}`}>
              {token[i] || ""}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || token.length !== 6}
        className="forgot-button"
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </button>

      <div className="forgot-resend">
        {!canResend ? (
          <p>Didn't receive the code? Resend in {formatTime(timeLeft)}</p>
        ) : (
          <div>
            <p>Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResendToken}
              disabled={isLoading}
              className="forgot-resend-button"
            >
              {isLoading ? "Sending..." : "Resend Code"}
            </button>
          </div>
        )}
      </div>
    </form>
  );

  const renderPasswordStep = () => {
    // Password validation
    const passwordsMatch =
      newPassword && confirmPassword && newPassword === confirmPassword;
    const passwordMismatch = confirmPassword && newPassword !== confirmPassword;
    const isPasswordValid = newPassword && newPassword.length >= 6;
    const isFormValid = passwordsMatch && isPasswordValid;

    return (
      <form className="forgot-form" onSubmit={handlePasswordReset}>
        <div className="forgot-field">
          <label htmlFor="newPassword">New Password</label>
          <div className="password-input-container">
            <input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              required
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                clearMessages();
              }}
              minLength={6}
              className={`password-input ${
                isPasswordValid ? "valid" : newPassword ? "invalid" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="password-toggle-btn"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? (
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
          {newPassword && newPassword.length < 6 && (
            <div className="password-hint error">
              Password must be at least 6 characters long
            </div>
          )}
          {isPasswordValid && (
            <div className="password-hint success">
              Password meets requirements
            </div>
          )}
        </div>

        <div className="forgot-field">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <div className="password-input-container">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearMessages();
              }}
              minLength={6}
              className={`password-input ${
                passwordsMatch ? "valid" : passwordMismatch ? "invalid" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-toggle-btn"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
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
            {passwordsMatch && (
              <div className="password-match-icon success">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20,6 9,17 4,12" />
                </svg>
              </div>
            )}
          </div>
          {passwordMismatch && (
            <div className="password-hint error">Passwords do not match</div>
          )}
          {passwordsMatch && (
            <div className="password-hint success">Passwords match!</div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="forgot-button"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    );
  };

  const getHeaderContent = () => {
    switch (currentStep) {
      case ForgotPasswordStep.EMAIL:
        return {
          title: "Forgot Password",
          description: "Enter your email to receive a verification code.",
        };
      case ForgotPasswordStep.VERIFY_TOKEN:
        return {
          title: "Verify Code",
          description: `Enter the 6-digit code sent to ${email}`,
        };
      case ForgotPasswordStep.RESET_PASSWORD:
        return {
          title: "Reset Password",
          description: "Enter your new password below.",
        };
      default:
        return {
          title: "Forgot Password",
          description: "Enter your email to receive a verification code.",
        };
    }
  };

  const { title, description } = getHeaderContent();

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        {renderStepIndicator()}

        <div className="forgot-header">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        {errors && <div className="forgot-error">{errors}</div>}
        {message && <div className="forgot-success">{message}</div>}

        {currentStep === ForgotPasswordStep.EMAIL && renderEmailStep()}
        {currentStep === ForgotPasswordStep.VERIFY_TOKEN && renderTokenStep()}
        {currentStep === ForgotPasswordStep.RESET_PASSWORD &&
          renderPasswordStep()}

        <div className="forgot-footer">
          <Link to={APP_ROUTES.auth.login} className="forgot-link">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
