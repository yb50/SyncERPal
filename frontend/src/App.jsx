import { useEffect, useState } from "react";

import ItemTable from "./components/ItemTable";
import ItemForm from "./components/ItemForm";

const API_URL = "http://localhost:8080/items";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  function fetchItems() {
    setLoading(true);

    fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      setItems(data);
    })
    .catch((error) => {
      console.error("Error fetching items:", error);
      setError("Failed to load items");
    })
    .finally(() => {
      setLoading(false);
    })
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
      ? API_URL
      : `${API_URL}/${editingId}`;

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
    fetch(`${API_URL}/${id}`, {
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

  function handleCancelEdit() {
    setEditingId(null);
    setName("");
    setSku("");
    setError("");
  }

  return (
    <div>
      <h1>SyncERPal</h1>

      <h2>Add Item</h2>

      <ItemForm 
        name={name}
        sku={sku}
        editingId={editingId}
        onNameChange={setName}
        onSkuChange={setSku}
        onSubmit={handleSubmit}
        onCancelEdit={handleCancelEdit}
      />

      {error && <p>{error}</p>}

      <h2>Items</h2>

      {loading && <p>Loading items...</p>}
      {!loading && items.length === 0 && <p>No items found</p>}

      {!loading && items.length > 0 && (
        <ItemTable
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;