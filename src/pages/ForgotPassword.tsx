import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { authAPI } from "../api/auth";
import "./Login.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const step = searchParams.get("token") ? "reset" : "email";
  const resetToken = searchParams.get("token") || "";
  const resetEmail = searchParams.get("email") || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState(resetEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }

    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSuccess("Reset link sent to your email! Check your inbox.");
      setTimeout(() => {
        setEmail("");
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      const errorMessage = error.response?.data?.detail || error.message || "Failed to send reset link";
      setError(errorMessage);
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!resetToken || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(email, resetToken, newPassword, confirmPassword);
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      const errorMessage = error.response?.data?.detail || error.message || "Failed to reset password";
      setError(errorMessage);
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>{step === "email" ? "Forgot Password?" : "Reset Password"}</h1>
          <p>{step === "email" ? "Enter your email to receive a reset link" : "Create a new password"}</p>
        </div>

        {error && <div className="error-message">❌ {error}</div>}
        {success && <div className="success-message">✅ {success}</div>}

        {step === "email" ? (
          <form onSubmit={handleRequestReset} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Sending Reset Link..." : "Send Reset Link"}
            </button>

            <p className="form-hint">
              We'll send you a link to reset your password. Check your email for further instructions.
            </p>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="login-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="login-footer">
          <p>
            Remember your password?{" "}
            <Link to="/login" className="link">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <div className="login-gradient" />
    </div>
  );
}
