import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

export default function Login() {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("audri@example.com");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim()) return setLocalError("Email is required.");
    if (password.length < 6) return setLocalError("Password must be at least 6 characters.");

    try {
      await login({ email, password });
      navigate("/profile");
    } catch {
      // error already set in context
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Login</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            autoComplete="current-password"
          />
        </label>

        {(localError || error) && (
          <p style={{ margin: 0 }}>{localError ?? error}</p>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log In"}
        </button>

        <p style={{ fontSize: 14, opacity: 0.8, marginTop: 8 }}>
          Demo login: <b>audri@example.com</b> + any password 6+ chars
        </p>
      </form>
    </div>
  );
}
