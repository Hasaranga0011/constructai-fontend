import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { RegisterRequest } from "../api/auth";
import { authAPI } from "../api/auth";
import "./Login.css";

type UserRole = "project_manager" | "site_engineer" | "worker" | "procurement_team";

const ROLE_OPTIONS: { value: UserRole; label: string; description?: string }[] = [
  {
    value: "project_manager",
    label: "Project Manager",
  },
  {
    value: "site_engineer",
    label: "Site Engineer",
  },
  {
    value: "worker",
    label: "Worker",
  },
  {
    value: "procurement_team",
    label: "Procurement Team",
  },
];

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    username: "",
    full_name: "",
    password: "",
    role: "site_engineer",
  });
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.username || !formData.full_name || !formData.password || !passwordConfirm) {
      setError("All fields are required");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (formData.password !== passwordConfirm) {
      setError("Passwords do not match");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format");
      return false;
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await authAPI.register(formData);
      setSuccess("Registration successful! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      let errorMessage = error.response?.data?.detail || 
                        error.message || 
                        "Registration failed";
      
      // Handle specific error cases
      if (errorMessage.includes("email") || errorMessage.toLowerCase().includes("email")) {
        errorMessage = "This email is already registered. Please login or use a different email.";
      } else if (errorMessage.includes("username") || errorMessage.toLowerCase().includes("username")) {
        errorMessage = "This username is already taken. Please choose a different username.";
      }
      
      setError(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Create Account</h1>
          <p>Join ConstructAI</p>
        </div>

        {error && <div className="error-message">❌ {error}</div>}
        {success && <div className="success-message">✅ {success}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              required
            />
          </div>

          <div className="form-group">
            <label>Select Your Role</label>
            <div className="role-selection">
              {ROLE_OPTIONS.map((option) => (
                <label key={option.value} className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={formData.role === option.value}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  />
                  <div className="role-content">
                    <span className="role-label">{option.label}</span>
                    {option.description && <span className="role-description">{option.description}</span>}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
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
            <label htmlFor="passwordConfirm">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Already have an account?{" "}
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
