import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/I18nContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { lang, setLang, t } = useI18n();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        borderBottom: "1px solid #ccc",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <strong>SyncERPal</strong>
        <Link to="/">{t("nav_home")}</Link>
        <Link to="/items">{t("nav_items")}</Link>
        {isAdmin && <Link to="/admin/items">{t("nav_admin_items")}</Link>}
      </div>

      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="en">EN</option>
        <option value="ja">日本語</option>
      </select>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span>
          {user?.username} ({user?.role})
        </span>
        <button onClick={logout}>{t("nav_logout")}</button>
      </div>
    </div>
  );
}
