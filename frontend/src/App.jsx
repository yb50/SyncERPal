import { useEffect, useState } from "react";

import "./App.css";
import useItems from "./hooks/useItems";
import useStockMovements from "./hooks/useStockMovements";
import StockMovementTable from "./components/StockMovementTable";
import StockMovementForm from "./components/StockMovementForm";
import ItemSection from "./components/ItemSection";

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

  const {
    stockMovements,
    movementItemId,
    movementType,
    movementQuantity,
    movementNote,
    setMovementItemId,
    setMovementType,
    setMovementQuantity,
    setMovementNote,
    fetchStockMovements,
    saveStockMovement,
  } = useStockMovements(fetchItems);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchItems();
    fetchStockMovements();
  }, []);

  function handleStockMovementSubmit(event) {
    event.preventDefault();

    saveStockMovement()
      .then(() => {
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <div className="app">
      <h1>SyncERPal</h1>

      {error && <p className="error">{error}</p>}

      <ItemSection
        items={items}
        name={name}
        sku={sku}
        quantity={quantity}
        lowStockThreshold={lowStockThreshold}
        editingId={editingId}
        loading={loading}
        setName={setName}
        setSku={setSku}
        setQuantity={setQuantity}
        setLowStockThreshold={setLowStockThreshold}
        saveItem={saveItem}
        removeItem={removeItem}
        startEditItem={startEditItem}
        clearItemForm={clearItemForm}
        setError={setError}
      />

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