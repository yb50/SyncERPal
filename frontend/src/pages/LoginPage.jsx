import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await apiFetch(
        "/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ username, password }),
        },
        null
      );

      // Expected response shape:
      // { accessToken, username, role }
      auth.login(res.accessToken, { username: res.username, role: res.role });

      navigate("/", { replace: true });
    } catch (err) {
      setError("Login failed. Check username/password.");
    }
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16, maxWidth: 420 }}>
      <h1>SyncERPal</h1>
      <h2>Login</h2>

      <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: 12 }}>
        <div style={{ marginBottom: 8 }}>
          <label>Username: </label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Log in</button>

        {error && <p style={{ marginTop: 8 }}>{error}</p>}

        <p style={{ marginTop: 12 }}>
          Demo accounts:
          <br />
          admin / admin123
          <br />
          worker / worker123
        </p>
      </form>
    </div>
  );
}