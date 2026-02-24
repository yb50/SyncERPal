import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useAuth } from "../auth/AuthContext";
import AppLayout from "../components/AppLayout";

import { useI18n } from "../i18n/I18nContext";

export default function AdminItemsPage() {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const [sku, setSku] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [nameJa, setNameJa] = useState("");
  const [barcode, setBarcode] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [lowStockThreshold, setLowStockThreshold] = useState(0);

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
    load().catch(() => { });
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setMessage("");

    try {
      await apiFetch(
        "/api/items",
        {
          method: "POST",
          body: JSON.stringify({
            sku,
            nameEn,
            nameJa,
            barcode: barcode || null,
            unit,
            lowStockThreshold: Number(lowStockThreshold),
          }),
        },
        token
      );

      setMessage(t("admin_created"));

      setSku("");
      setNameEn("");
      setNameJa("");
      setBarcode("");
      setUnit("pcs");
      setLowStockThreshold(0);

      await load();
    } catch (err) {
      setMessage(t("admin_create_failed"));
    }
  }

  return (
    <AppLayout>
      <h2>{t("admin_create_item")}</h2>

      <form onSubmit={handleCreate} style={{ border: "1px solid #ccc", padding: 12, maxWidth: 720 }}>
        <div style={{ marginBottom: 8 }}>
          <label>{t("admin_table_sku")}: </label>
          <input value={sku} onChange={(e) => setSku(e.target.value)} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>{t("admin_table_name")} (EN): </label>
          <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} style={{ width: 300 }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>{t("admin_table_name")} (JA): </label>
          <input value={nameJa} onChange={(e) => setNameJa(e.target.value)} style={{ width: 300 }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>{t("admin_table_barcode")}: </label>
          <input value={barcode} onChange={(e) => setBarcode(e.target.value)} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>{t("admin_table_unit")}: </label>
          <input value={unit} onChange={(e) => setUnit(e.target.value)} style={{ width: 80 }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>{t("admin_table_low_stock")}: </label>
          <input
            type="number"
            min="0"
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(e.target.value)}
            style={{ width: 80 }}
          />
        </div>

        <button
          type="submit"
          disabled={!sku || !nameEn || !nameJa}
        >
          {t("admin_create_button")}
        </button>

        {message && <p style={{ marginTop: 8 }}>{message}</p>}
      </form>

      <h3 style={{ marginTop: 24 }}>{t("admin_table_items")}</h3>
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
