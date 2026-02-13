import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080";

function App() {
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

  function loadAll() {
    fetch(`${API_BASE}/api/locations`).then((r) => r.json()).then(setLocations);
    fetch(`${API_BASE}/api/items`).then((r) => r.json()).then(setItems);
    fetch(`${API_BASE}/api/inventory`).then((r) => r.json()).then(setBalances);
    fetch(`${API_BASE}/api/movements`).then((r) => r.json()).then(setMovements);
  }

  useEffect(() => {
    loadAll();
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

    const res = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      alert(`Request failed: ${text}`);
      return;
    }

    loadAll();
    setQuantity(1);
    setNote("");
  }

  const canSubmit =
    itemId &&
    Number(quantity) > 0 &&
    ((type === "IN" && toLocationId) ||
      (type === "OUT" && fromLocationId) ||
      (type === "TRANSFER" && fromLocationId && toLocationId) ||
      (type === "ADJUST" && adjustLocationId && direction));

  return (
    <div>
      <h1>SyncERPal</h1>

      <h2>Create Movement</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type: </label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
            <option value="TRANSFER">TRANSFER</option>
            <option value="ADJUST">ADJUST</option>
          </select>
        </div>

        <div>
          <label>Item: </label>
          <select value={itemId} onChange={(e) => setItemId(e.target.value)}>
            <option value="">-- choose item --</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {itemLabel(item)}
              </option>
            ))}
          </select>
        </div>

        {type === "IN" && (
          <div>
            <label>To Location: </label>
            <select value={toLocationId} onChange={(e) => setToLocationId(e.target.value)}>
              <option value="">-- choose location --</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {locLabel(loc)}
                </option>
              ))}
            </select>
          </div>
        )}

        {type === "OUT" && (
          <div>
            <label>From Location: </label>
            <select value={fromLocationId} onChange={(e) => setFromLocationId(e.target.value)}>
              <option value="">-- choose location --</option>
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
            <div>
              <label>From Location: </label>
              <select value={fromLocationId} onChange={(e) => setFromLocationId(e.target.value)}>
                <option value="">-- choose location --</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {locLabel(loc)}
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
                    {locLabel(loc)}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {type === "ADJUST" && (
          <>
            <div>
              <label>Location: </label>
              <select value={adjustLocationId} onChange={(e) => setAdjustLocationId(e.target.value)}>
                <option value="">-- choose location --</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {locLabel(loc)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Direction: </label>
              <select value={direction} onChange={(e) => setDirection(e.target.value)}>
                <option value="INCREASE">INCREASE</option>
                <option value="DECREASE">DECREASE</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label>Quantity: </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div>
          <label>Note: </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <button type="submit" disabled={!canSubmit}>
          Submit
        </button>
      </form>

      <h2>Inventory Balances</h2>
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
              <td>{itemById(b.itemId) ? itemLabel(itemById(b.itemId)) : b.itemId}</td>
              <td>{locationById(b.locationId) ? locLabel(locationById(b.locationId)) : b.locationId}</td>
              <td>{b.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Movement History</h2>
      {movements.length === 0 ? (
        <p>No movements yet.</p>
      ) : (
        <table>
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
                <td>{m.fromLocationId ? (locationById(m.fromLocationId) ? locLabel(locationById(m.fromLocationId)) : m.fromLocationId) : "-"}</td>
                <td>{m.toLocationId ? (locationById(m.toLocationId) ? locLabel(locationById(m.toLocationId)) : m.toLocationId) : "-"}</td>
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

export default App;
