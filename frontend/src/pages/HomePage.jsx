import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function HomePage() {
  const { token, user, logout } = useAuth();

  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);
  const [balances, setBalances] = useState([]);
  const [movements, setMovements] = useState([]);

  async function loadAll() {
    const [locs, its, bals, movs] = await Promise.all([
      apiFetch("/api/locations", {}, token),
      apiFetch("/api/items", {}, token),
      apiFetch("/api/inventory", {}, token),
      apiFetch("/api/movements", {}, token),
    ]);

    setLocations(locs);
    setItems(its);
    setBalances(bals);
    setMovements(movs);
  }

  useEffect(() => {
    loadAll().catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function itemLabel(item) {
    return `${item.sku} — ${item.nameEn} / ${item.nameJa}`;
  }

  function locLabel(loc) {
    return `${loc.code} — ${loc.nameEn} / ${loc.nameJa}`;
  }

  function itemById(id) {
    return items.find((i) => i.id === id);
  }

  function locationById(id) {
    return locations.find((l) => l.id === id);
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>SyncERPal</h1>
        <div>
          <span style={{ marginRight: 12 }}>
            Logged in as: {user?.username} ({user?.role})
          </span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <h2>Inventory Balances</h2>
      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", marginTop: 8 }}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Location</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((b) => (
            <tr key={b.id}>
              <td>{itemById(b.itemId) ? itemLabel(itemById(b.itemId)) : b.itemId}</td>
              <td>
                {locationById(b.locationId) ? locLabel(locationById(b.locationId)) : b.locationId}
              </td>
              <td>{b.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Movement History</h2>
      {movements.length === 0 ? (
        <p>No movements yet.</p>
      ) : (
        <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", marginTop: 8 }}>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Type</th>
              <th>Item</th>
              <th>From</th>
              <th>To</th>
              <th>Qty</th>
              <th>Note</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id}>
                <td>{m.referenceNo}</td>
                <td>{m.type}</td>
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
                <td>{m.quantity}</td>
                <td>{m.note || "-"}</td>
                <td>{m.createdAt || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}