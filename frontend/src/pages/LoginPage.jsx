import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/I18nContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const { t } = useI18n();

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

      auth.login(res.accessToken, { username: res.username, role: res.role });

      navigate("/", { replace: true });
    } catch (err) {
      setError("Login failed. Check username/password.");
    }
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16, maxWidth: 420 }}>
      <h1>SyncERPal</h1>
      <h2>{t("login_title")}</h2>

      <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: 12 }}>
        <div style={{ marginBottom: 8 }}>
          <label>{t("login_username")}: </label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>{t("login_password")}: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">{t("login_button")}</button>

        {error && <p style={{ marginTop: 8 }}>{t("login_failed")}</p>}

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
