import { useEffect, useState } from "react";

import "./App.css";
import useItems from "./hooks/useItems";
import { getStockMovements, createStockMovement } from "./api/stockMovementApi";
import ItemTable from "./components/ItemTable";
import ItemForm from "./components/ItemForm";
import StockMovementTable from "./components/StockMovementTable";
import StockMovementForm from "./components/StockMovementForm";

function App() {
  const {
    items,
    name,
    sku,
    quantity,
    lowStockThreshold,
    editingId,
    loading,
    setName,
    setSku,
    setQuantity,
    setLowStockThreshold,
    fetchItems,
    saveItem,
    removeItem,
    startEditItem,
    clearItemForm,
  } = useItems();

  const [error, setError] = useState("");
  const [stockMovements, setStockMovements] = useState([]);
  const [movementItemId, setMovementItemId] = useState("");
  const [movementType, setMovementType] = useState("IN");
  const [movementQuantity, setMovementQuantity] = useState("");
  const [movementNote, setMovementNote] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    saveItem()
      .then(() => {
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handleDelete(id) {
    removeItem(id)
      .then(() => {
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handleEdit(item) {
    startEditItem(item);
  }

  function handleCancelEdit() {
    clearItemForm();
    setError("");
  }

  function fetchStockMovements() {
    getStockMovements()
      .then((data) => { 
        setStockMovements(data);
      })
      .catch((error) => {
        console.error("Error fetching stock movements:", error);
        setError(error.message);
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

    createStockMovement(newStockMovement)
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
        items={items}
      />
    </div>
  );
}

export default App;