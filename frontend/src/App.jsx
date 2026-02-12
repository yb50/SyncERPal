import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080";

function App() {
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);
  const [balances, setBalances] = useState([]);

  const [itemId, setItemId] = useState("");
  const [toLocationId, setToLocationId] = useState("");
  const [quantity, setQuantity] = useState(1);

  function loadAll() {
    fetch(`${API_BASE}/api/locations`)
      .then((r) => r.json())
      .then(setLocations);

    fetch(`${API_BASE}/api/items`)
      .then((r) => r.json())
      .then(setItems);

    fetch(`${API_BASE}/api/inventory`)
      .then((r) => r.json())
      .then(setBalances);
  }

  useEffect(() => {
    loadAll();
  }, []);

  function getItemName(item) {
    return `${item.sku} — ${item.nameEn} / ${item.nameJa}`;
  }

  function getLocationName(loc) {
    return `${loc.code} — ${loc.nameEn} / ${loc.nameJa}`;
  }

  function itemById(id) {
    return items.find((i) => i.id === id);
  }

  function locationById(id) {
    return locations.find((l) => l.id === id);
  }

  async function handleStockIn(e) {
    e.preventDefault();

    const body = {
      itemId: itemId,
      toLocationId: toLocationId,
      quantity: Number(quantity),
    };

    const res = await fetch(`${API_BASE}/api/movements/in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      alert("Stock IN failed. Check backend logs.");
      return;
    }

    loadAll();
    setQuantity(1);
  }

  return (
    <div>
      <h1>SyncERPal</h1>

      <h2>Stock IN</h2>
      <form onSubmit={handleStockIn}>
        <div>
          <label>Item: </label>
          <select value={itemId} onChange={(e) => setItemId(e.target.value)}>
            <option value="">-- choose item --</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {getItemName(item)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>To Location: </label>
          <select value={toLocationId} onChange={(e) => setToLocationId(e.target.value)}>
            <option value="">-- choose location --</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {getLocationName(loc)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Quantity: </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <button type="submit" disabled={!itemId || !toLocationId}>
          Stock IN
        </button>
      </form>

      <h2>Inventory Balances</h2>
      {balances.length === 0 ? (
        <p>No balances loaded.</p>
      ) : (
        <table>
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
                <td>
                  {itemById(b.itemId)
                    ? getItemName(itemById(b.itemId))
                    : b.itemId}
                </td>
                <td>
                  {locationById(b.locationId)
                    ? getLocationName(locationById(b.locationId))
                    : b.locationId}
                </td>
                <td>{b.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;