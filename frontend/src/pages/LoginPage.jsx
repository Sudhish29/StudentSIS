import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api";
import { useAuth } from "../AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const user = await loginApi(username, password);
      login(user);
      navigate(user.role === "admin" ? "/admin" : "/student");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <div className="login-showcase">
        <div className="brand">
          <span className="brand-mark">SP</span>
          <span className="brand-name">Performance Tracker</span>
        </div>

        <h1>Know where every student stands.</h1>
        <p className="showcase-sub">
          One dashboard for admins to manage records and analyze class
          performance, and a personal dashboard for every student to track
          their own progress.
        </p>

        <ul className="feature-list">
          <li>
            <span className="feature-icon">01</span>
            Manage students, subjects and marks in one place
          </li>
          <li>
            <span className="feature-icon">02</span>
            Visual analytics &mdash; averages, grade spread, top performers
          </li>
          <li>
            <span className="feature-icon">03</span>
            Every student gets their own login, created automatically
          </li>
        </ul>
      </div>

      <div className="login-panel">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Welcome back</h2>
          <p className="login-subtitle">Sign in to view your dashboard</p>

          {error && <p className="error">{error}</p>}

          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin or USN"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          <button type="submit">Sign in</button>

          <div className="login-credentials">
            <p><strong>Admin</strong> &mdash; admin / admin123</p>
            <p><strong>Student</strong> &mdash; USN / date of birth (YYYY-MM-DD)</p>
          </div>
        </form>
      </div>
    </div>
  );
}
