import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useAuth } from "../auth/AuthContext";
import AppLayout from "../components/AppLayout";
import { useI18n } from "../i18n/I18nContext";

export default function HomePage() {
  const { token, user, logout } = useAuth();

  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);
  const [balances, setBalances] = useState([]);
  const [movements, setMovements] = useState([]);

  const [type, setType] = useState("IN");
  const [itemId, setItemId] = useState("");
  const [fromLocationId, setFromLocationId] = useState("");
  const [toLocationId, setToLocationId] = useState("");
  const [adjustLocationId, setAdjustLocationId] = useState("");
  const [direction, setDirection] = useState("INCREASE");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const [balanceLocationFilter, setBalanceLocationFilter] = useState("");
  const [balanceSearch, setBalanceSearch] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  
  const { t, lang, formatNumber, formatDate } = useI18n();

  const [movementPage, setMovementPage] = useState(0);
  const [movementTypeFilter, setMovementTypeFilter] = useState("");
  const [movementItemFilter, setMovementItemFilter] = useState("");
  const [movementLocationFilter, setMovementLocationFilter] = useState("");
  const [movementTotalPages, setMovementTotalPages] = useState(1);

  async function handleSubmit(e) {
    e.preventDefault();

    let url = "";
    let body = {};

    if (type === "IN") {
      url = "/api/movements/in";
      body = { itemId, toLocationId, quantity: Number(quantity), note };
    } else if (type === "OUT") {
      url = "/api/movements/out";
      body = { itemId, fromLocationId, quantity: Number(quantity), note };
    } else if (type === "TRANSFER") {
      url = "/api/movements/transfer";
      body = { itemId, fromLocationId, toLocationId, quantity: Number(quantity), note };
    } else if (type === "ADJUST") {
      url = "/api/movements/adjust";
      body = { itemId, locationId: adjustLocationId, quantity: Number(quantity), direction, note };
    }

    try {
      await apiFetch(
        url,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
        token
      );

      await loadAll();

      setQuantity(1);
      setNote("");
    } catch (err) {
      alert("Request failed. " + err.message);
    }
  }


  async function loadAll() {
    const movUrl =
      `/api/movements?page=${movementPage}&size=10` +
      (movementTypeFilter ? `&type=${encodeURIComponent(movementTypeFilter)}` : "") +
      (movementItemFilter ? `&itemId=${encodeURIComponent(movementItemFilter)}` : "") +
      (movementLocationFilter ? `&locationId=${encodeURIComponent(movementLocationFilter)}` : "");

    const [locs, its, bals, movPage] = await Promise.all([
      apiFetch("/api/locations", {}, token),
      apiFetch("/api/items", {}, token),
      apiFetch("/api/inventory", {}, token),
      apiFetch(movUrl, {}, token),
    ]);

    setLocations(locs);
    setItems(its);
    setBalances(bals);

    setMovements(movPage.content);
    setMovementTotalPages(movPage.totalPages);

  }

  useEffect(() => {
    loadAll().catch(() => { });
  }, [movementPage, movementTypeFilter, movementItemFilter, movementLocationFilter]);


  function itemLabel(item) {
    const name = lang === "ja" ? item.nameJa : item.nameEn;
    return `${item.sku} — ${name}`;
  }

  function locLabel(loc) {
    const name = lang === "ja" ? loc.nameJa : loc.nameEn;
    return `${loc.code} — ${name}`;
  }

  function itemById(id) {
    return items.find((i) => i.id === id);
  }

  function locationById(id) {
    return locations.find((l) => l.id === id);
  }

  function getItemThreshold(itemId) {
    const it = itemById(itemId);
    if (!it) return null;
    return typeof it.lowStockThreshold === "number" ? it.lowStockThreshold : null;
  }

  function isLowStock(balanceRow) {
    const threshold = getItemThreshold(balanceRow.itemId);
    if (threshold === null) return false;
    return balanceRow.quantity <= threshold;
  }

  function balanceMatchesSearch(balanceRow) {
    const it = itemById(balanceRow.itemId);
    if (!it) return true;

    const q = balanceSearch.trim().toLowerCase();
    if (!q) return true;

    const name = (lang === "ja" ? it.nameJa : it.nameEn) || "";
    const sku = it.sku || "";

    return (
      sku.toLowerCase().includes(q) ||
      name.toLowerCase().includes(q)
    );
  }

  const filteredBalances = balances
    .filter((b) => {
      if (balanceLocationFilter && b.locationId !== balanceLocationFilter) return false;
      if (lowOnly && !isLowStock(b)) return false;
      if (!balanceMatchesSearch(b)) return false;
      return true;
    })
    .sort((a, b) => {
      const aLow = isLowStock(a) ? 1 : 0;
      const bLow = isLowStock(b) ? 1 : 0;
      return bLow - aLow;
    });

  function movementTypeLabel(type) {
    if (type === "IN") return t("type_in");
    if (type === "OUT") return t("type_out");
    if (type === "TRANSFER") return t("type_transfer");
    if (type === "ADJUST") return t("type_adjust");
    return type;
  }

  function userLabel(username) {
    if (!username) return "-";

    if (username === "admin") return t("movement_table_role_admin");
    if (username === "worker") return t("movement_table_role_worker");

    return username;
  }

  function downloadCSV(filename, rows) {
    const csv = rows
      .map(row =>
        row
          .map(v => `"${String(v ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  }


  return (
    <AppLayout>
      <div style={{ fontFamily: "sans-serif", padding: 16 }}>
        <h2>{t("home_create_movement")}</h2>

        <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: 12, maxWidth: 720 }}>
          <div style={{ marginBottom: 8 }}>
            <label>{t("form_type")}: </label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="IN">{t("type_in")}</option>
              <option value="OUT">{t("type_out")}</option>
              <option value="TRANSFER">{t("type_transfer")}</option>
              <option value="ADJUST">{t("type_adjust")}</option>
            </select>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>{t("form_item")}: </label>
            <select value={itemId} onChange={(e) => setItemId(e.target.value)}>
              <option value="">{t("choose_item")}</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {itemLabel(item)}
                </option>
              ))}
            </select>
          </div>

          {type === "IN" && (
            <div style={{ marginBottom: 8 }}>
              <label>{t("form_to_location")}: </label>
              <select value={toLocationId} onChange={(e) => setToLocationId(e.target.value)}>
                <option value="">{t("choose_location")}</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {locLabel(loc)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {type === "OUT" && (
            <div style={{ marginBottom: 8 }}>
              <label>{t("form_from_location")}: </label>
              <select value={fromLocationId} onChange={(e) => setFromLocationId(e.target.value)}>
                <option value="">{t("choose_location")}</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {locLabel(loc)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {type === "TRANSFER" && (
            <>
              <div style={{ marginBottom: 8 }}>
                <label>{t("form_from_location")}: </label>
                <select value={fromLocationId} onChange={(e) => setFromLocationId(e.target.value)}>
                  <option value="">{t("choose_location")}</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {locLabel(loc)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 8 }}>
                <label>{t("form_to_location")}: </label>
                <select value={toLocationId} onChange={(e) => setToLocationId(e.target.value)}>
                  <option value="">{t("choose_location")}</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {locLabel(loc)}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {type === "ADJUST" && (
            <>
              <div style={{ marginBottom: 8 }}>
                <label>{t("form_location")}: </label>
                <select value={adjustLocationId} onChange={(e) => setAdjustLocationId(e.target.value)}>
                  <option value="">{t("choose_location")}</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {locLabel(loc)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 8 }}>
                <label>{t("form_direction")}: </label>
                <select value={direction} onChange={(e) => setDirection(e.target.value)}>
                  <option value="INCREASE">{t("direction_increase")}</option>
                  <option value="DECREASE">{t("direction_decrease")}</option>
                </select>
              </div>
            </>
          )}

          <div style={{ marginBottom: 8 }}>
            <label>{t("form_quantity")}: </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{ width: 100 }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>{t("form_note")}: </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ width: 400 }}
              placeholder={t("form_optional")}
            />
          </div>

          <button
            type="submit"
            disabled={
              !itemId ||
              Number(quantity) <= 0 ||
              ((type === "IN" && !toLocationId) ||
                (type === "OUT" && !fromLocationId) ||
                (type === "TRANSFER" && (!fromLocationId || !toLocationId)) ||
                (type === "ADJUST" && (!adjustLocationId || !direction)))
            }
          >
            {t("form_submit")}
          </button>
        </form>


        <h2>{t("home_inventory_balances")}</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <label>{t("form_location")}: </label>
            <select
              value={balanceLocationFilter}
              onChange={(e) => setBalanceLocationFilter(e.target.value)}
            >
              <option value="">{t("filter_all_locations")}</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {locLabel(loc)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>{t("filter_search")}: </label>
            <input
              value={balanceSearch}
              onChange={(e) => setBalanceSearch(e.target.value)}
              placeholder={t("filter_search_placeholder")}
            />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="checkbox"
              checked={lowOnly}
              onChange={(e) => setLowOnly(e.target.checked)}
            />
            {t("filter_low_only")}
          </label>
        </div>

        <button
          onClick={() =>
            downloadCSV(
              "inventory_balances.csv",
              [
                ["Item", "Location", "Quantity", "LowStockThreshold"],
                ...filteredBalances.map(b => [
                  itemById(b.itemId)?.sku ?? "",
                  locationById(b.locationId)?.code ?? "",
                  b.quantity,
                  getItemThreshold(b.itemId) ?? "",
                ]),
              ]
            )
          }
        >
          Export CSV
        </button>


        <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", marginTop: 8 }}>
          <thead>
            <tr>
              <th>{t("form_item")}</th>
              <th>{t("form_location")}</th>
              <th>{t("form_quantity")}</th>
              <th>{t("table_low_stock")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredBalances.map((b) => {
              const threshold = getItemThreshold(b.itemId);
              const low = isLowStock(b);

              return (
                <tr
                  key={b.id}
                  style={{
                    background: low ? "#fff3cd" : "transparent",
                  }}
                >
                  <td>{itemById(b.itemId) ? itemLabel(itemById(b.itemId)) : b.itemId}</td>
                  <td>
                    {locationById(b.locationId) ? locLabel(locationById(b.locationId)) : b.locationId}
                  </td>
                  <td>{formatNumber(b.quantity)}</td>
                  <td>{threshold === null ? "-" : formatNumber(threshold)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>



        <h2>{t("home_movement_history")}</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <label>{t("movement_table_type")}: </label>
            <select
              value={movementTypeFilter}
              onChange={(e) => { setMovementPage(0); setMovementTypeFilter(e.target.value); }}
            >
              <option value="">(All)</option>
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
              <option value="TRANSFER">TRANSFER</option>
              <option value="ADJUST">ADJUST</option>
            </select>
          </div>

          <div>
            <label>{t("form_item")}: </label>
            <select
              value={movementItemFilter}
              onChange={(e) => { setMovementPage(0); setMovementItemFilter(e.target.value); }}
            >
              <option value="">{t("choose_item")}</option>
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {itemLabel(it)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>{t("form_location")}: </label>
            <select
              value={movementLocationFilter}
              onChange={(e) => { setMovementPage(0); setMovementLocationFilter(e.target.value); }}
            >
              <option value="">{t("filter_all_locations")}</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {locLabel(loc)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => setMovementPage((p) => Math.max(0, p - 1))}
              disabled={movementPage <= 0}
            >
              Prev
            </button>

            <span>
              Page {movementPage + 1} / {movementTotalPages}
            </span>

            <button
              onClick={() => setMovementPage((p) => Math.min(movementTotalPages - 1, p + 1))}
              disabled={movementPage >= movementTotalPages - 1}
            >
              Next
            </button>
          </div>
        </div>
        
        <button
          onClick={() =>
            downloadCSV(
              "stock_movements.csv",
              [
                ["Reference", "Type", "Item", "From", "To", "Qty", "User", "Date"],
                ...movements.map(m => [
                  m.referenceNo,
                  m.type,
                  itemById(m.itemId)?.sku ?? "",
                  m.fromLocationId ? locationById(m.fromLocationId)?.code : "",
                  m.toLocationId ? locationById(m.toLocationId)?.code : "",
                  m.quantity,
                  m.createdByUsername ?? "",
                  m.createdAt,
                ]),
              ]
            )
          }
        >
          Export CSV
        </button>

        
        {movements.length === 0 ? (
          <p>{t("home_no_movements")}</p>
        ) : (
          <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", marginTop: 8 }}>
            <thead>
              <tr>
                <th>{t("movement_table_reference")}</th>
                <th>{t("movement_table_type")}</th>
                <th>{t("movement_table_item")}</th>
                <th>{t("movement_table_from")}</th>
                <th>{t("movement_table_to")}</th>
                <th>{t("movement_table_qty")}</th>
                <th>{t("movement_table_note")}</th>
                <th>{t("movement_table_created_at")}</th>
                <th>{t("movement_table_user")}</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id}>
                  <td>{m.referenceNo}</td>
                  <td>{movementTypeLabel(m.type)}</td>
                  <td>{itemById(m.itemId) ? itemLabel(itemById(m.itemId)) : m.itemId}</td>
                  <td>
                    {m.fromLocationId
                      ? locationById(m.fromLocationId)
                        ? locLabel(locationById(m.fromLocationId))
                        : m.fromLocationId
                      : "-"}
                  </td>
                  <td>
                    {m.toLocationId
                      ? locationById(m.toLocationId)
                        ? locLabel(locationById(m.toLocationId))
                        : m.toLocationId
                      : "-"}
                  </td>
                  <td>{formatNumber(m.quantity)}</td>
                  <td>{m.note || "-"}</td>
                  <td>{formatDate(m.createdAt)}</td>
                  <td>{userLabel(m.createdByUsername)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppLayout>
  );
}
