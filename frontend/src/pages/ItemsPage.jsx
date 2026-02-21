import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useAuth } from "../auth/AuthContext";
import AppLayout from "../components/AppLayout";
import { useI18n } from "../i18n/I18nContext";

export default function ItemsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const { t, lang, formatNumber } = useI18n();

  function itemName(it) {
    if (lang === "ja") return it.nameJa || it.nameEn || "";
    return it.nameEn || it.nameJa || "";
  }

  async function load() {
    const data = await apiFetch("/api/items", {}, token);
    setItems(data);
  }

  useEffect(() => {
    load().catch(() => setError("Failed to load items."));
  }, []);

  return (
    <AppLayout>
      <h2>{t("admin_table_items")}</h2>
      {error && <p>{error}</p>}

      {items.length === 0 ? (
        <p>{t("admin_table_no_items")}</p>
      ) : (
        <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", marginTop: 8 }}>
          <thead>
            <tr>
              <th>{t("admin_table_sku")}</th>
              <th>{t("admin_table_name")}</th>
              <th>{t("admin_table_barcode")}</th>
              <th>{t("admin_table_unit")}</th>
              <th>{t("admin_table_low_stock")}</th>
              <th>{t("admin_table_active")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>{it.sku}</td>
                <td>{itemName(it)}</td>
                <td>{it.barcode || "-"}</td>
                <td>{it.unit}</td>
                <td>{formatNumber(it.lowStockThreshold)}</td>
                <td>{it.active ? t("admin_table_yes") : t("admin_table_no")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AppLayout>
  );
}
