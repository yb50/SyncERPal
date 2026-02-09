import { useEffect, useState } from "react";

function App() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch(() => setLocations([]));
  }, []);

  return (
    <div>
      <h1>SyncERPal</h1>
      <h2>Locations</h2>

      {locations.length === 0 ? (
        <p>No locations loaded (is the backend running?).</p>
      ) : (
        <ul>
          {locations.map((loc) => (
            <li key={loc.id}>
              {loc.code} — {loc.nameEn} / {loc.nameJa}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;