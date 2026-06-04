import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/items")
      .then((response) => response.json())
      .then((data) => {
        console.log("Items from backend:", data);
        setItems(data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  return (
    <div>
      <h1>SyncERPal</h1>

      <h2>Items</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>SKU</th>
            <th>Name</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.sku}</td>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;