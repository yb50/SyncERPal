import { useEffect, useState } from "react";

import "./App.css";
import ItemTable from "./components/ItemTable";
import ItemForm from "./components/ItemForm";
import StockMovementTable from "./components/StockMovementTable";
import StockMovementForm from "./components/StockMovementForm";

const API_URL = "http://localhost:8080/items";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("")
  const [lowStockThreshold, setLowStockThreshold] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stockMovements, setStockMovements] = useState([]);
  const [movementItemId, setMovementItemId] = useState("");
  const [movementType, setMovementType] = useState("IN");
  const [movementQuantity, setMovementQuantity] = useState("");
  const [movementNote, setMovementNote] = useState("");

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

  function handleSubmit(event) {
    event.preventDefault();

    const newItem = {
      name: name,
      sku: sku,
      quantity: Number(quantity),
      lowStockThreshold: Number(lowStockThreshold),
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
        setQuantity("");
        setLowStockThreshold("");
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
    setQuantity(item.quantity);
    setLowStockThreshold(item.lowStockThreshold);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setName("");
    setSku("");
    setQuantity("");
    setLowStockThreshold("");
    setError("");
  }

  function fetchStockMovements() {
    fetch("http://localhost:8080/stock-movements")
      .then((response) => response.json())
      .then((data) => { 
        setStockMovements(data);
      })
      .catch((error) => {
        console.error("Error fetching stock movements:", error);
        setError("Failed to load stock movements.");
      });
  }

  useEffect(() => {
    fetchItems();
    fetchStockMovements();
  }, []);

  function handleStockMovementSubmit(event) {
    event.preventDefault();

    const newStockMovement = {
      itemId: Number(movementItemId),
      type: movementType,
      quantity: Number(movementQuantity),
      note: movementNote,
    };

    fetch("http://localhost:8080/stock-movements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStockMovement),
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
        setMovementItemId("");
        setMovementType("IN");
        setMovementQuantity("");
        setMovementNote("");
        setError("");

        fetchItems();
        fetchStockMovements();
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <div className="app">
      <h1>SyncERPal</h1>

      <h2>Add Item</h2>

      <ItemForm 
        name={name}
        sku={sku}
        quantity={quantity}
        lowStockThreshold={lowStockThreshold}
        editingId={editingId}
        onNameChange={setName}
        onSkuChange={setSku}
        onQuantityChange={setQuantity}
        onLowStockThreshold={setLowStockThreshold}
        onSubmit={handleSubmit}
        onCancelEdit={handleCancelEdit}
      />

      {error && <p className="error">{error}</p>}

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

      <h2>Add Stock Movement</h2>

      <StockMovementForm 
        items={items}
        movementItemId={movementItemId}
        movementType={movementType}
        movementQuantity={movementQuantity}
        movementNote={movementNote}
        onMovementItemIdChange={setMovementItemId}
        onMovementTypeChange={setMovementType}
        onMovementQuantityChange={setMovementQuantity}
        onMovementNoteChange={setMovementNote}
        onSubmit={handleStockMovementSubmit}
      />

      <h2>Stock Movements</h2>

      <StockMovementTable 
        stockMovements={stockMovements}
      />
    </div>
  );
}

export default App;