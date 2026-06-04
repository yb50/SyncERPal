import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  function fetchItems() {
    fetch("http://localhost:8080/items")
    .then((response) => response.json())
    .then((data) => {
      setItems(data);
    })
    .catch((error) => {
      console.error("Error fetching items:", error);
    });
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    const newItem = {
      name: name,
      sku: sku,
    };

    const url = editingId === null
      ? "http://localhost:8080/items"
      : `http://localhost:8080/items/${editingId}`;

    const method = editingId === null ? "POST" : "PUT";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((message) => {
            throw new Error(message);
          });
        }

        return response.json();
      })
      .then(() => {
        setEditingId(null);
        setName("");
        setSku("");
        setError("");
        fetchItems();
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handleDelete(id) {
    fetch(`http://localhost:8080/items/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete item.");
        }

        fetchItems();
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setName(item.name);
    setSku(item.sku);
  }

  return (
    <div>
      <h1>SyncERPal</h1>

      <h2>Add Item</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          <label>SKU: </label>
          <input 
            type="text"
            value={sku}
            onChange={(event) => setSku(event.target.value)}
          />
        </div>

        <button type="submit">Add Item</button>
      </form>

      {error && <p>{error}</p>}

      <h2>Items</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>SKU</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.sku}</td>
              <td>{item.name}</td>
              <td>
                <button onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
                <button onClick={() => handleEdit(item)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;