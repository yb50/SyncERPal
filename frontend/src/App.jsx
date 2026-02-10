import { useEffect, useState } from "react";

function App() {
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch(() => setLocations([]));

    fetch("http://localhost:8080/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(() => setItems([]));
  }, []);

  return (
    <div>
      <h1>SyncERPal</h1>
      <h2>Locations</h2>
      {locations.length === 0 ? (
        <p>No locations loaded.</p>
      ) : (
        <ul>
          {locations.map((loc) => (
            <li key={loc.id}>
              {loc.code} — {loc.nameEn} / {loc.nameJa}
            </li>
          ))}
        </ul>
      )}

      <h2>Items</h2>
      {items.length === 0 ? (
        <p>No items loaded.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.sku} — {item.nameEn} / {item.nameJa} (low stock: {item.lowStockThreshold})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;