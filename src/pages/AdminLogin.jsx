import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const API = "https://azza-backend.onrender.com/";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const csrfResponse = await axios.get(
        `${API}/api/csrf/`,
        {
          withCredentials: true,
        }
      );

      const csrfToken = csrfResponse.data.csrfToken;

      console.log("CSRF Token:", csrfToken);

      if (!csrfToken) {
        setError("CSRF token was not received.");
        return;
      }

      const loginResponse = await axios.post(
        `${API}/api/admin/login/`,
        {
          username: username.trim(),
          password: password,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      console.log("Login Response:", loginResponse.data);

      if (loginResponse.data.message === "Login successful") {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);
      console.log("Response:", error.response?.data);

      if (error.response?.status === 401) {
        setError("Invalid username or password.");
      } else if (error.response?.status === 403) {
        setError(
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Admin access denied."
        );
      } else if (error.response?.status === 404) {
        setError("Login API not found.");
      } else {
        setError(
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">

        <div className="admin-login-logo">
          <img
            src="/images/azza-logo.png"
            alt="Azza Foodstuff"
          />
        </div>

        <h1>Admin Login</h1>

        <p>Sign in to manage your store</p>

        <form onSubmit={handleLogin}>

          <div className="admin-form-group">
            <label>Username</label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default AdminLogin;